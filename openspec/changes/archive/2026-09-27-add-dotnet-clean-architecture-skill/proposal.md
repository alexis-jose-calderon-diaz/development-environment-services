# Proposal

## Why

The public skill catalog has no focused guidance for structuring a .NET solution according to Clean Architecture. A dedicated skill can provide a consistent map of projects and dependency directions without expanding into implementation details.

## What Changes

- Add public skill `ac-dotnet-clean-architecture` to recommend a strictly Clean Architecture .NET solution layout: project responsibilities and permitted/forbidden project references.
- Keep the skill's advice limited to solution structure and relationships; exclude internal class or folder design, code, implementation steps, and any mention of testing or test projects in the skill's guidance and generated architecture output.
- Add the skill to `skills/README.md` and its global installation example, and provide evaluation scenarios for the architectural output.
- Update the existing public-skill inventory requirement, which currently enumerates exactly seven skills.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `opencode-integration`: extend the public skill inventory and require bounded, Clean Architecture-specific .NET solution-structure recommendations.

## Impact

- `skills/ac-dotnet-clean-architecture/SKILL.md` and its evaluation scenarios.
- `skills/README.md` catalog and installation example.
- `openspec/specs/opencode-integration/spec.md` through a delta specification.
- No .NET application, runtime dependency, or external service is added to this repository.
