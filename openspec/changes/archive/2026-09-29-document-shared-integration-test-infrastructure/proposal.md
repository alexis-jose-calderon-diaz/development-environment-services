# Proposal

## Why

Integration suites can spend substantial time repeatedly starting hosts, containers, and databases. The existing skill permits sharing costly fixtures but does not explain how to reset shared infrastructure safely, which can leave mutable data coupled across test cases.

## What Changes

- Document when integration tests may share a host, database container, or database to reduce setup time.
- Require logical isolation for each test through an automatic, idempotent reset before each case; preserve seeds and migration history while clearing transient data.
- Explain when shared state requires serialized execution and require a test that verifies the reset behavior.
- Clarify that shared infrastructure does not mean shared mutable test state, while retaining per-test physical isolation as a valid option when it fits better.
- Review the skill's references and examples so they demonstrate the available isolation choices consistently.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `dotnet-testing`: specify safe logical isolation requirements for integration tests that share costly infrastructure.

## Impact

- `skills/ac-dotnet-testing/SKILL.md` guidance and examples.
- `openspec/specs/dotnet-testing/spec.md` contract for the public testing skill.
- No production code, test code, APIs, or dependencies.
