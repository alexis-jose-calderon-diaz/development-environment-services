# Design

## Context

See `proposal.md` for motivation. `skills/ac-commit-proposal/SKILL.md` already
requires a complete proposal and fixes most fields, while
`openspec/specs/opencode-integration/spec.md` requires one complete fictional
example. The output example currently demonstrates a `text` fenced sample, but
the skill does not define the exact rendered Markdown grammar or demonstrate
multiline messages and special paths. The existing skill evaluation is stored
in `skills/ac-commit-proposal/evals/evals.json`; this repository does not use
the Vally `eval.yaml` layout described by `create-skill-test`.

## Goals / Non-Goals

**Goals:**

- Make the visible proposal format deterministic enough to review consistently.
- Cover normal Markdown rendering, multiline exact messages, and safely escaped
  paths with one complete example and short variants.
- Add evaluation coverage for the externally visible format without changing
  commit grouping or Git safety behavior.

**Non-Goals:**

- Create a new skill or change `ac-commit-proposal` activation, scope selection,
  grouping, security, or termination behavior.
- Execute staging, commits, or any other repository mutation.
- Introduce a new evaluation harness or migrate the repository to Vally.

## Decisions

1. **Keep one canonical Markdown grammar in the skill.** Preserve the existing
   section names and field order, but state the literal heading levels, labels,
   metadata order, commit-block order, list syntax, and `None` representation.
   Render the proposal as ordinary Markdown rather than wrapping the whole
   output in a code fence. This makes the required structure visible and
   testable while preserving the established field contract.

2. **Represent paths as JSON strings inside inline code.** Apply JSON escaping
   to every displayed path, and force a backtick to `\\u0060` so it cannot close
   the Markdown code span. Use escaped control characters such as `\\n` for
   line breaks. A rename remains one Git-state list item with source and
   destination strings separated by ` → `. This representation is reversible
   and prevents path text from being parsed as Markdown or instructions.

3. **Represent complete commit messages in a `text` fence.** Put the exact
   message below `Message:` and use a tilde fence of at least three characters,
   longer than any consecutive tilde run in the message. This supports bodies
   and trailers without splitting them into fields or rendering their Markdown.

4. **Keep examples differentiated and small.** Retain one complete fictional
   `working-tree` proposal as the canonical example. Add at least two clearly
   marked, focused variants to demonstrate `index` with pending changes and
   special paths/states; include a multiline message with a trailer in the
   examples. Each variant illustrates an edge case without duplicating the full
   proposal structure.

5. **Extend the repository's existing JSON evaluations.** Strengthen relevant
   existing cases to check the exact Markdown structure, ordered fields,
   escaped path representation, and direct ending; add a distinct multiline
   message case if needed to make that behavior independently observable. Do
   not add `eval.yaml` or claim a measured quality improvement without a
   comparative run and result evidence.

## Risks / Trade-offs

- **The exact format may add verbosity or overconstrain valid outputs.** Keep
  wording and structural rules limited to externally visible consistency; leave
  intent text and observed values unconstrained beyond existing requirements.
- **Examples can drift from the contract.** Keep one canonical full sample,
  short variants, and evaluation assertions for the syntax each example
  illustrates.
- **Escaped paths may be less immediately readable.** Use standard JSON escapes
  and document the notation beside the examples; preserving unambiguous paths
  takes priority over displaying control characters literally.
- **Markdown fence handling can corrupt exact messages if underspecified.**
  Define the tilde fence as longer than the longest consecutive tilde run in the
  message and verify a message containing a fence-like sequence in the
  evaluation case.
