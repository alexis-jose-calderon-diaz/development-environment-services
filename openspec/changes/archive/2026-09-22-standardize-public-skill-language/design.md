# Design

## Context

The public `skills/` surface contains seven executable skills and one catalog README. The skill instructional prose is primarily Spanish but includes English frontmatter, headings, status values, and command syntax. The README is intentionally maintained in Spanish. Several skills already derive output language from the user's request, while `ac-pull-request` explicitly defaults to Spanish. See `proposal.md` for the motivation and `specs/opencode-integration/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Make the seven public skill definitions consistently English-first.
- Make response-language selection explicit and consistent across the public skills.
- Preserve operational syntax, safety rules, output structure, and language-independent tokens.
- Keep the change limited to the seven public `skills/<name>/SKILL.md` files; leave the Spanish catalog README unchanged.

**Non-Goals:**

- Do not translate or restructure the Spanish catalog README, evaluation prompts, or fixture data merely because they are written in Spanish.
- Do not change the internal `./.agents/` skills or OpenSpec workflow skills.
- Do not change application code, integrations, commands, dependencies, or the semantics of existing safety and Git workflows.

## Decisions

### 1. Translate source prose, not contract tokens

Translate explanatory prose, frontmatter descriptions, headings, comments, and natural-language template text in all seven `SKILL.md` files. Keep `skills/README.md` in Spanish. Preserve skill identifiers, paths, CLI commands, shell snippets, status values, Conventional Commits types, required field names, and structural markers.

**Alternative considered:** Rewrite every visible string, including commands and machine-facing labels. Rejected because it could break installation instructions, parsing expectations, or existing evaluation criteria.

### 2. Use explicit language selection in each public skill

Each skill will state the shared policy in its own relevant language/output guidance: honor an explicitly requested language, otherwise use English. Existing rules that require specific tokens to remain in English or preserve a structured format take precedence over natural-language translation.

**Alternative considered:** Rely on the language of the user's prompt without defining a fallback. Rejected because mixed-language prompts and short prompts would continue to produce inconsistent defaults.

### 3. Preserve localized behavior when requested

The language policy changes only the fallback. A user request for Spanish or another language continues to control natural-language descriptions, bodies, summaries, and recommendations where the skill permits localization. Structured identifiers and normative tokens remain unchanged.

**Alternative considered:** Force every generated response to English. Rejected because the public skills are user-facing and existing contracts already support the request language for commit text and editorial PR content.

### 4. Validate with inventory and behavioral review

Validation will combine a file inventory, targeted searches for leftover instructional Spanish, review of preserved commands and structural markers, and existing skill evals. Spanish prompts and fixture content in `evals/` are treated as test inputs, not source prose, and are not included in the language-consistency check.

## Risks / Trade-offs

- **[Translation changes a normative meaning]** -> Compare each translated instruction against the existing safety, scope, and output contract; review all seven skills as a set.
- **[A required token is translated accidentally]** -> Preserve identifiers, commands, status values, field names, and code blocks through targeted inspection and validation.
- **[Skills diverge in language fallback rules]** -> Add the same explicit requested-language/English-default policy wherever each skill describes response language, including the existing commit and PR exceptions.
- **[Evaluation behavior is mistaken for source-language inconsistency]** -> Keep Spanish eval prompts and fixture data out of the translation scope while validating the skills against them.

## Migration Plan

1. Translate and normalize the seven public skill definitions while leaving the public catalog README unchanged in Spanish.
2. Add or align the response-language guidance without changing workflow, security, or output-shape requirements.
3. Run static inventory checks and the repository's available skill evaluations.
4. If rollback is needed, revert the documentation-only commit; no runtime data migration or service rollback is required.

## Open Questions

None.
