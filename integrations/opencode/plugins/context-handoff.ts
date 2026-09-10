import type {
  Hooks,
  Plugin,
  PluginInput,
  PluginOptions,
} from "@opencode-ai/plugin";
import type { AssistantMessage, Event } from "@opencode-ai/sdk";

const DEFAULT_SOFT_LIMIT = 330000;
const DEFAULT_HARD_LIMIT = 350000;
const CONTEXT_HANDOFF_MARKER = "[context-handoff:budget]";
const CONTEXT_BUDGET_HARD_STOP = "CONTEXT_BUDGET_HARD_STOP";

// Comma-separated agent allow-list; empty means every confirmed child session.
const MONITORED_AGENTS_ENV = "OPENCODE_CONTEXT_MONITORED_AGENTS";
const METADATA_RETRY_MS = 5000;

export type BudgetState = "NORMAL" | "SOFT" | "HARD";

export type ContextHandoffConfig = {
  softLimit: number;
  hardLimit: number;
  monitoredAgents: ReadonlySet<string>;
};

export type ContextTokenUsage = {
  input: number;
  output: number;
  reasoning?: number;
  cache: {
    read: number;
    write: number;
  };
};

type Environment = Record<string, string | undefined>;
type PluginClient = PluginInput["client"];

type AssistantRecord = {
  created: number;
  usage: number;
};

type SessionState = {
  estimate: number;
  status: BudgetState;
  authoritativeUsage: number;
  latestAssistant?: {
    id: string;
    created: number;
  };
  assistantMessages: Map<string, AssistantRecord>;
  provisionalTools: Map<string, number>;
  seenToolCallIDs: Set<string>;
  retiredAssistantIDs: Set<string>;
  retiredToolCallIDs: Set<string>;
  compactedAt?: number;
  metadataKnown: boolean;
  parentID?: string;
  agent?: string;
};

type MetadataRequest = {
  state: SessionState;
  promise: Promise<void>;
};

const SOFT_INSTRUCTION = `${CONTEXT_HANDOFF_MARKER}:SOFT
Context budget is nearing its limit. Avoid broad exploration, complete the current coherent unit, and prepare to stop.`;

const HARD_INSTRUCTION = `${CONTEXT_HANDOFF_MARKER}:HARD
Context budget is exhausted. Stop normal work; do not start additional exploration or implementation. Return a concise textual ## HANDOFF with these sections: Objective, Completed, Remaining, Decisions, Files changed, Relevant files, Verification, and Next action.`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function currentEnvironment(): Environment {
  const processValue = (globalThis as { process?: { env?: Environment } })
    .process;
  return processValue?.env ?? {};
}

function parseLimit(name: string, value: unknown): number {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    throw new Error(
      `[context-handoff] invalid ${name}: expected a finite positive number`,
    );
  }

  return numericValue;
}

function optionValue(options: unknown, name: string): unknown {
  if (!isRecord(options)) return undefined;
  return Object.prototype.hasOwnProperty.call(options, name)
    ? options[name]
    : undefined;
}

function resolveLimit(
  optionName: string,
  environmentName: string,
  fallback: number,
  options: unknown,
  environment: Environment,
): number {
  // Environment overrides are validated even when options also provide a value.
  if (environment[environmentName] !== undefined) {
    return parseLimit(environmentName, environment[environmentName]);
  }

  const configured = optionValue(options, optionName);
  return configured === undefined
    ? fallback
    : parseLimit(`option ${optionName}`, configured);
}

function parseAgentFilter(value: unknown): Set<string> {
  if (value === undefined) return new Set<string>();

  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : (() => {
          throw new Error(
            "[context-handoff] invalid monitoredAgents: expected a comma-separated string or an array",
          );
        })();

  const agents = new Set<string>();
  for (const item of values) {
    if (typeof item !== "string") {
      throw new Error(
        "[context-handoff] invalid monitoredAgents: every agent must be a string",
      );
    }
    const agent = item.trim();
    if (agent) agents.add(agent);
  }
  return agents;
}

function readContextHandoffConfig(
  options: PluginOptions | unknown = {},
  environment: Environment = currentEnvironment(),
): ContextHandoffConfig {
  if (options !== undefined && !isRecord(options)) {
    throw new Error(
      "[context-handoff] invalid plugin options: expected an object",
    );
  }

  const softLimit = resolveLimit(
    "softLimit",
    "OPENCODE_CONTEXT_SOFT_LIMIT",
    DEFAULT_SOFT_LIMIT,
    options,
    environment,
  );
  const hardLimit = resolveLimit(
    "hardLimit",
    "OPENCODE_CONTEXT_HARD_LIMIT",
    DEFAULT_HARD_LIMIT,
    options,
    environment,
  );

  if (hardLimit <= softLimit) {
    throw new Error(
      `[context-handoff] invalid limits: hardLimit (${hardLimit}) must be greater than softLimit (${softLimit})`,
    );
  }

  const configuredAgents =
    environment[MONITORED_AGENTS_ENV] !== undefined
      ? environment[MONITORED_AGENTS_ENV]
      : optionValue(options, "monitoredAgents");

  return {
    softLimit,
    hardLimit,
    // An empty filter intentionally means every confirmed child session.
    monitoredAgents: parseAgentFilter(configuredAgents),
  };
}

function estimateContextTokens(tokens: ContextTokenUsage): number {
  // OpenCode's overflow formula counts cache tokens and does not add reasoning.
  const total = tokens.input + tokens.output + tokens.cache.read + tokens.cache.write;
  if (
    !Number.isFinite(total) ||
    tokens.input < 0 ||
    tokens.output < 0 ||
    tokens.cache.read < 0 ||
    tokens.cache.write < 0
  ) {
    throw new TypeError(
      "[context-handoff] assistant token usage must contain finite non-negative values",
    );
  }
  return total;
}

function classifyContextBudget(
  estimate: number,
  softLimit: number = DEFAULT_SOFT_LIMIT,
  hardLimit: number = DEFAULT_HARD_LIMIT,
): BudgetState {
  if (!Number.isFinite(estimate) || estimate < 0) {
    throw new RangeError(
      "[context-handoff] context estimate must be finite and non-negative",
    );
  }
  if (
    !Number.isFinite(softLimit) ||
    !Number.isFinite(hardLimit) ||
    softLimit <= 0 ||
    hardLimit <= softLimit
  ) {
    throw new RangeError("[context-handoff] invalid budget limits");
  }
  if (estimate >= hardLimit) return "HARD";
  if (estimate >= softLimit) return "SOFT";
  return "NORMAL";
}

function createSessionState(): SessionState {
  return {
    estimate: 0,
    status: "NORMAL",
    authoritativeUsage: 0,
    assistantMessages: new Map<string, AssistantRecord>(),
    provisionalTools: new Map<string, number>(),
    seenToolCallIDs: new Set<string>(),
    retiredAssistantIDs: new Set<string>(),
    retiredToolCallIDs: new Set<string>(),
    metadataKnown: false,
  };
}

function rememberAssistant(
  state: SessionState,
  messageID: string,
  record: AssistantRecord,
): void {
  state.assistantMessages.set(messageID, record);
}

function rememberToolCall(state: SessionState, callID: string): void {
  state.seenToolCallIDs.add(callID);
}

function provisionalTotal(state: SessionState): number {
  let total = 0;
  for (const estimate of state.provisionalTools.values()) total += estimate;
  return total;
}

function isAssistantMessage(value: unknown): value is AssistantMessage {
  return isRecord(value) && value.role === "assistant";
}

function assistantUsage(message: AssistantMessage): number | undefined {
  const tokens = message.tokens;
  if (!isRecord(tokens) || !isRecord(tokens.cache)) return undefined;
  const values = [
    tokens.input,
    tokens.output,
    tokens.cache.read,
    tokens.cache.write,
  ];
  if (
    values.some(
      (value) => typeof value !== "number" || !Number.isFinite(value) || value < 0,
    )
  ) {
    return undefined;
  }
  return estimateContextTokens({
    input: tokens.input,
    output: tokens.output,
    reasoning: tokens.reasoning,
    cache: {
      read: tokens.cache.read,
      write: tokens.cache.write,
    },
  });
}

function assistantCreated(message: AssistantMessage): number | undefined {
  const created = message.time?.created;
  return typeof created === "number" && Number.isFinite(created)
    ? created
    : undefined;
}

function acceptAssistantMessage(
  state: SessionState,
  message: AssistantMessage,
): number | undefined {
  const usage = assistantUsage(message);
  const created = assistantCreated(message);
  if (usage === undefined || created === undefined || typeof message.id !== "string") {
    return undefined;
  }

  if (state.retiredAssistantIDs.has(message.id)) return undefined;
  if (state.compactedAt !== undefined && created <= state.compactedAt) {
    return undefined;
  }

  const previous = state.assistantMessages.get(message.id);
  const latest = state.latestAssistant;
  if (previous && (created < previous.created || usage < previous.usage)) {
    return undefined;
  }
  if (!previous && latest && created <= latest.created) return undefined;
  if (previous && latest && latest.id !== message.id && created <= latest.created) {
    return undefined;
  }

  rememberAssistant(state, message.id, { created, usage });
  state.latestAssistant = { id: message.id, created };
  state.authoritativeUsage = usage;
  // A new authoritative usage supersedes all provisional tool-result estimates.
  state.provisionalTools.clear();
  return usage;
}

function normalizedAgent(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const agent = value.trim();
  return agent || undefined;
}

function sessionMetadata(value: unknown): { parentID?: string } | undefined {
  if (!isRecord(value)) return undefined;
  const parentID = value.parentID;
  return {
    parentID: typeof parentID === "string" && parentID ? parentID : undefined,
  };
}

function responseData(value: unknown): unknown {
  if (isRecord(value) && Object.prototype.hasOwnProperty.call(value, "data")) {
    return value.data;
  }
  return value;
}

async function safeLog(
  client: PluginClient,
  level: "debug" | "info" | "error" | "warn",
  message: string,
  extra?: Record<string, unknown>,
): Promise<void> {
  try {
    await client.app.log({
      body: {
        service: "context-handoff",
        level,
        message,
        ...(extra ? { extra } : {}),
      },
    });
  } catch {
    // Diagnostics must never change hook behavior.
  }
}

const contextHandoffPlugin: Plugin = async (input, options) => {
  let config: ContextHandoffConfig;
  try {
    config = readContextHandoffConfig(options);
  } catch (error) {
    await safeLog(
      input.client,
      "error",
      error instanceof Error
        ? error.message
        : "[context-handoff] invalid plugin configuration",
    );
    throw error;
  }

  const states = new Map<string, SessionState>();
  const deletedSessions = new Set<string>();
  const metadataFailures = new Map<string, number>();
  const metadataRequests = new Map<string, MetadataRequest>();
  let disposed = false;

  const getState = (sessionID: string): SessionState | undefined => {
    if (deletedSessions.has(sessionID)) return undefined;
    let state = states.get(sessionID);
    if (!state) {
      state = createSessionState();
      states.set(sessionID, state);
    }
    return state;
  };

  const setEstimate = async (
    sessionID: string,
    state: SessionState,
    estimate: number,
  ): Promise<void> => {
    const classified = classifyContextBudget(
      estimate,
      config.softLimit,
      config.hardLimit,
    );
    // Once HARD is reached, only compaction may release the hard-stop.
    const next = state.status === "HARD" ? "HARD" : classified;
    const previous = state.status;
    state.estimate = estimate;
    state.status = next;
    if (previous !== next) {
      await safeLog(
        input.client,
        "info",
        `[context-handoff] session ${sessionID}: ${previous} -> ${next} (${estimate} tokens)`,
      );
    }
  };

  const applyMetadata = (
    sessionID: string,
    state: SessionState,
    metadata: { parentID?: string },
  ): void => {
    if (disposed || states.get(sessionID) !== state) return;
    state.metadataKnown = true;
    state.parentID = metadata.parentID;
    metadataFailures.delete(sessionID);
  };

  const ensureMetadata = async (
    sessionID: string,
    state: SessionState,
  ): Promise<void> => {
    if (disposed || states.get(sessionID) !== state || state.metadataKnown) return;

    const previousFailure = metadataFailures.get(sessionID);
    if (
      previousFailure !== undefined &&
      Date.now() - previousFailure < METADATA_RETRY_MS
    ) {
      return;
    }

    const existing = metadataRequests.get(sessionID);
    if (existing?.state === state) {
      await existing.promise;
      return;
    }
    if (existing) metadataRequests.delete(sessionID);

    let request!: Promise<void>;
    const operation = (async (): Promise<void> => {
      try {
        const response = await input.client.session.get({
          path: { id: sessionID },
        });
        const metadata = sessionMetadata(responseData(response));
        if (!metadata) throw new Error("invalid session metadata response");
        applyMetadata(sessionID, state, metadata);
      } catch {
        if (disposed || states.get(sessionID) !== state) return;
        metadataFailures.set(sessionID, Date.now());
        await safeLog(
          input.client,
          "warn",
          `[context-handoff] unable to confirm metadata for session ${sessionID}`,
        );
      }
    })();

    request = operation.finally(() => {
      if (metadataRequests.get(sessionID)?.promise === request) {
        metadataRequests.delete(sessionID);
      }
    });
    metadataRequests.set(sessionID, { state, promise: request });
    await request;
  };

  const isMonitoredChild = (state: SessionState): boolean => {
    if (!state.metadataKnown || !state.parentID) return false;
    if (config.monitoredAgents.size === 0) return true;
    return state.agent !== undefined && config.monitoredAgents.has(state.agent);
  };

  const processMessageUpdated = async (
    message: unknown,
  ): Promise<void> => {
    if (!isAssistantMessage(message) || disposed) return;
    const sessionID = message.sessionID;
    if (typeof sessionID !== "string" || !sessionID) return;
    const state = getState(sessionID);
    if (!state) return;
    const usage = acceptAssistantMessage(state, message);
    if (usage !== undefined) {
      await setEstimate(sessionID, state, usage);
    }
  };

  const processSessionEvent = (session: unknown): void => {
    if (!isRecord(session) || typeof session.id !== "string" || !session.id) return;
    const state = getState(session.id);
    if (!state) return;
    const metadata = sessionMetadata(session);
    if (metadata) applyMetadata(session.id, state, metadata);
  };

  const processEvent = async (event: Event): Promise<void> => {
    if (disposed) return;
    switch (event.type) {
      case "message.updated":
        await processMessageUpdated(event.properties.info);
        break;
      case "session.created":
      case "session.updated":
        processSessionEvent(event.properties.info);
        break;
      case "session.compacted": {
        const sessionID = event.properties.sessionID;
        const state = getState(sessionID);
        if (!state) break;
        state.estimate = 0;
        state.authoritativeUsage = 0;
        state.latestAssistant = undefined;
        state.compactedAt = Date.now();
        for (const messageID of state.assistantMessages.keys()) {
          state.retiredAssistantIDs.add(messageID);
        }
        for (const callID of state.seenToolCallIDs) {
          state.retiredToolCallIDs.add(callID);
        }
        state.assistantMessages.clear();
        state.provisionalTools.clear();
        state.seenToolCallIDs.clear();
        const previous = state.status;
        state.status = "NORMAL";
        if (previous !== "NORMAL") {
          await safeLog(
            input.client,
            "info",
            `[context-handoff] session ${sessionID}: ${previous} -> NORMAL (0 tokens)`,
          );
        }
        break;
      }
      case "session.deleted": {
        const sessionID = event.properties.info.id;
        deletedSessions.add(sessionID);
        states.delete(sessionID);
        metadataFailures.delete(sessionID);
        metadataRequests.delete(sessionID);
        break;
      }
      default:
        break;
    }
  };

  const hooks: Hooks = {
    event: async ({ event }) => {
      await processEvent(event);
    },

    "chat.message": async (hookInput, output) => {
      if (disposed) return;
      const state = getState(hookInput.sessionID);
      if (!state) return;
      const agent =
        normalizedAgent(hookInput.agent) ??
        normalizedAgent(output.message?.agent);
      if (agent !== undefined) state.agent = agent;
      await ensureMetadata(hookInput.sessionID, state);
    },

    "experimental.chat.system.transform": async (hookInput, output) => {
      if (disposed || !hookInput.sessionID) return;
      const state = getState(hookInput.sessionID);
      if (!state) return;
      await ensureMetadata(hookInput.sessionID, state);
      if (!isMonitoredChild(state)) return;

      const hasMarker = output.system.some((instruction) =>
        instruction.includes(CONTEXT_HANDOFF_MARKER),
      );
      if (hasMarker) return;
      if (state.status === "SOFT") output.system.push(SOFT_INSTRUCTION);
      if (state.status === "HARD") output.system.push(HARD_INSTRUCTION);
    },

    "tool.execute.before": async (hookInput) => {
      if (disposed) return;
      const state = getState(hookInput.sessionID);
      if (!state) return;
      await ensureMetadata(hookInput.sessionID, state);
      if (isMonitoredChild(state) && state.status === "HARD") {
        throw new Error(
          `${CONTEXT_BUDGET_HARD_STOP}: context budget is exhausted; return the HANDOFF instead of running another tool`,
        );
      }
    },

    "tool.execute.after": async (hookInput, output) => {
      if (disposed || typeof output.output !== "string") return;
      const state = getState(hookInput.sessionID);
      if (!state || state.retiredToolCallIDs.has(hookInput.callID)) return;
      if (state.seenToolCallIDs.has(hookInput.callID)) return;
      rememberToolCall(state, hookInput.callID);
      // This is provisional text not yet represented by authoritative assistant usage.
      state.provisionalTools.set(
        hookInput.callID,
        Math.ceil(output.output.length / 4),
      );
      await setEstimate(
        hookInput.sessionID,
        state,
        state.authoritativeUsage + provisionalTotal(state),
      );
    },

    dispose: async () => {
      disposed = true;
      states.clear();
      deletedSessions.clear();
      metadataFailures.clear();
      metadataRequests.clear();
    },
  };

  return hooks;
};

export default contextHandoffPlugin;
