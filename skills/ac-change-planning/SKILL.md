---
name: ac-change-planning
description: Create verifiable technical plans for software changes. Activate this skill when the user asks to plan, break down, order, or prepare the execution of a task, even without an Analysis Report, OpenSpec identifier, or prior delegation; inspect the minimum necessary context and do not implement the change.
---

# Change Planning

Turn a change request into a clear, verifiable, and bounded execution plan. The
skill is a user-started workflow: work from the request and the repository state
available without waiting for an orchestrator prompt, another skill's report, or
an implicit `Scope`.

## Limits

- Produce planning; do not implement, edit, delete, or fix files.
- Do not delegate, create subagents, or assign ownership or agent permissions.
- Do not present these instructions as a permission barrier: a skill loads inside
  the current agent. If effective read-only isolation is required, the selected
  agent and its permissions must provide it.
- Do not invent paths, dependencies, criteria, or decisions. Mark anything that
  cannot be confirmed as `UNKNOWN`, `BLOCKED`, or pending.
- Do not repeat a global exploration. Read the request and user-provided context
  first; inspect only files, configuration, or contracts directly relevant to
  closing a planning decision.
- The plan must be self-contained and executable by the main agent. Delegation,
  an orchestrator, or a suggested agent is optional and never a prerequisite.
  Keep planning read-only: do not edit the repository or produce side effects.
- Respond in the user's requested language; use English when no response language is specified.

## Method

### 1. Scope the Change

Extract the objective, expected result, scope, exclusions, constraints,
acceptance criteria, and known validations. Distinguish information essential to
bound the work (for example, a path, compatibility option, or contract-changing
decision) from information that can be confirmed during a unit.

If an essential datum is missing, do not explore globally to infer it: return a
minimal plan marked `BLOCKED`, request only that exact datum, and stop planning
that depends on it. The minimal plan may list independent units that are
sufficiently bounded, but it must not invent paths, decisions, or criteria for
the blocked unit. The absence of an Analysis Report, delegation, or formal
context is not by itself a blocker.

### 2. Inspect the Minimum Context

When the request is insufficient, perform a proportional inspection:

1. Identify the repository root and relevant state without modifying it.
2. Search for paths, symbols, contracts, configuration, and tests directly
   related to the objective.
3. Expand reading only to a critical dependency or consumer that changes scope,
   ordering, or validation.
4. Distinguish confirmed facts, assumptions, and uncertainties with evidence.

If the user already provided enough context, use it without re-exploring the
entire repository. If essential information is missing, do not perform this
inspection: request the missing datum first. Do not run commands with side
effects.

### 3. Form Executable Units

Divide by cohesive, verifiable outcomes. Each unit must have exclusive areas: do
not assign the same file or modifiable area to two units. Prefer one unit when
splitting adds coordination without real benefit. Separate work that can advance
independently from work dependent on a prior decision, contract, output, or
validation. If a dependent unit is `BLOCKED`, retain and plan independent units
that already have sufficient scope, files, and criteria; do not block the whole
plan.

When multiple units consume a shared contract, assign the contract definition and
change to one owner unit. Record each consumer in `Dependencies` pointing to
that contract/unit even when their files are exclusive; do not split contract
ownership or duplicate its modification. If documentation, validation, or
retirement have different files, owners, or criteria, make them separate units
and link them to the units whose results they need.

For each unit define `Scope` and `Out of Scope` separately. Include a concrete
validation that can demonstrate the result, not only a generic activity such as
"review changes".

### 4. Order and Decide

- Use `Parallel` only when units share no modifiable areas and do not depend on
  other results.
- Use `Sequential` when a unit consumes a prior output, contract, decision, or
  validation; explain why. A blocked dependency does not prevent marking and
  planning another independent unit as `Parallel`.
- State start conditions, later integration, and where work must stop if a block
  appears.
- If scope cannot be closed with sufficient evidence, keep the unit as `BLOCKED`.
  For a missing essential datum, the report must request only the missing path,
  option, or decision; do not replace that request with global exploration or
  assumptions.

## Output Format

Return only the following Markdown report, without preambles or code blocks.
Replace placeholders with concrete information; use `None` only when absence is
confirmed.

# Execution Plan

## Objective

Summarize the objective and expected verifiable result.

## Scope and Assumptions

State:

- **Scope:** what will be executed.
- **Out of Scope:** what is explicitly excluded.
- **Assumptions:** supported or necessary assumptions.
- **Uncertainties:** questions, missing evidence, and required decisions.

## Work Breakdown

For each unit use exactly this information. Mark the name or objective
`BLOCKED` when applicable and identify the exact datum that unlocks it.

### Unit N — brief name

- **Objective:** single outcome of the unit.
- **Files/Areas:** exclusive assigned paths or areas.
- **Required Context:** minimum information needed to execute it.
- **Dependencies:** prior units, contracts, or decisions; `None` when absent.
- **Mode:** `Parallel` or `Sequential`, with a brief reason.
- **Suggested Agent:** recommended role or `main agent`; informational, not
  mandatory. Do not invent an agent or depend on delegation.
- **Validation:** concrete check and expected evidence.
- **Scope:** limits included in this unit.
- **Out of Scope:** exclusions specific to this unit.

## Dependency Graph

Represent relationships between units. Mark `Parallel` groups, `Sequential`
links, and reasons. Use `None` if all are independent.

## Execution Order

List the recommended order, conditions for starting each group, results that
must pass to the next, and later integration.

## Integration and Validation

Describe how to verify that units fit together: boundary contracts, shared files,
tests, documentation, configuration, and applicable final validations. Distinguish
planned validations from validations not run.

## Risks and Decision Points

List risks with impact and mitigation, possible blockers, pending decisions, and
checkpoints for stopping, splitting again, or changing order. Do not resolve by
assumption a decision that expands scope.

## Summary for Orchestrator

Summarize the strategy, recommended number of units, parallel or sequential
groups, key validations, excluded scope, and next action.

Although this heading retains its name for compatibility with the historical
format, the summary is addressed to the user or main agent; it does not imply
that an orchestrator, child session, or automatic continuation exists.
