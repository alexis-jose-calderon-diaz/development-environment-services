# Design

## Context

See `proposal.md` for motivation. The current `dotnet-testing` capability and public skill both state the project layout, one-case-per-file rule, and fixture restrictions as universal requirements. The requested change is guidance-only and does not alter runtime behavior.

## Goals / Non-Goals

**Goals:**

- Keep a clear recommended baseline for new .NET test projects.
- Let repository conventions and explicit user choices guide work in existing solutions.
- Define test independence in terms of data isolation and lack of order dependencies, not the absence of all fixtures.
- Keep skill instructions and the OpenSpec capability contract aligned.
- Make the HTTP example report an unexpected status before attempting to parse its body.

**Non-Goals:**

- Change the skill's xUnit scope, naming examples, assertion-library guidance, or mocking-library guidance.
- Require migrations or reorganization of existing test projects.
- Prescribe a particular fixture library or integration-test infrastructure.

## Decisions

### Treat layouts as defaults, not migration requirements

Keep the existing feature-oriented folders and split unit/integration projects as concrete defaults for new solutions. For existing repositories, inspect and follow their current layout unless the user requests a change or a specific constraint makes the layout unsuitable. This preserves useful examples without implying that every repository should be restructured.

Alternative considered: retain universal layout requirements and tell agents to make exceptions. That keeps a strict standard but leaves the conflict in place and can still lead to unnecessary restructuring.

### Define independence by test-owned state

Require each test to run without another test's execution or cleanup, and to own or isolate mutable test data. Permit fixtures to share costly infrastructure such as a host or database container when individual tests retain isolated data and do not depend on shared mutable fixture state.

Alternative considered: disallow all xUnit fixtures. This is simpler to state, but prevents safe infrastructure reuse and can make integration suites needlessly slow or expensive.

### Retain one-case-per-file as a preferred convention

Keep descriptive one-case-per-file examples as the default for new suites, while instructing agents to honor established repository grouping and explicit user preferences. This preserves discoverability without making file count a compatibility constraint.

Alternative considered: remove the convention entirely. That would lose a clear organization pattern even where the repository has no established one.

### Validate HTTP status before parsing typed content

In the integration example, assert the expected status immediately after receiving the response, then deserialize the expected response body. This makes failures for unexpected status codes direct and avoids misleading parse errors.

Alternative considered: keep parsing first and assert later. It can verify both status and content in successful cases, but error responses may fail during parsing before exposing the status mismatch.

## Risks / Trade-offs

- **More judgment is required when adapting to existing repositories** → Instruct the skill to inspect nearby tests and distinguish observed conventions from its recommendations.
- **New projects may adopt inconsistent structures if defaults are too soft** → Keep the recommended project names and feature-oriented examples explicit for greenfield work.
- **Shared fixtures may accidentally introduce test coupling** → State the isolation and independent-execution conditions alongside the permission to reuse infrastructure.

## Migration Plan

Update `skills/ac-dotnet-testing/SKILL.md` and the matching capability requirements together. No code or data migration is required. Validate the change artifacts and inspect the final diff before considering implementation complete.
