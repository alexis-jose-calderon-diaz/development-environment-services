# Proposal

## Why

The `ac-dotnet-testing` skill presents several organizational choices as universal rules, which can lead to unnecessary restructuring or expensive integration-test setup when applied to an existing solution. Clarifying which practices are recommendations and which protect test isolation will make the guidance safer to apply across different .NET repositories.

## What Changes

- Preserve existing test-project and folder conventions when adding or reviewing tests; present the current feature-oriented layout and separate unit/integration projects as defaults for new projects or explicit reorganizations.
- Keep one test case per file as the skill's preferred convention, while allowing established repository conventions or an explicit user request to determine file grouping.
- Explain that tests must remain independently runnable and own their mutable data, while allowing fixtures to share costly infrastructure when they do not share test state or create order dependencies.
- Update the integration example to assert the HTTP status before deserializing the response body, so failures point first to the unexpected status.
- Align the `dotnet-testing` specification with these distinctions between defaults and isolation requirements.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `dotnet-testing`: Clarify how the skill adapts to existing repository conventions, treats one-case-per-file organization, permits safe infrastructure fixtures, and demonstrates response validation.

## Impact

- `skills/ac-dotnet-testing/SKILL.md`
- `openspec/specs/dotnet-testing/spec.md` through a delta specification
- No application code, APIs, or dependencies are affected.
