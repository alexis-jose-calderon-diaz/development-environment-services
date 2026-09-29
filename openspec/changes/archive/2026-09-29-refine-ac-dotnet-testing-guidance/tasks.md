# Tasks

## 1. Refine the public skill guidance

- [x] 1.1 Revise `skills/ac-dotnet-testing/SKILL.md` so separate projects and feature-oriented folders are recommended defaults for new solutions, and verify its workflow tells agents to preserve established conventions in existing repositories.
- [x] 1.2 Reframe one-case-per-file as a preferred convention and allow fixtures for costly infrastructure when test data remains isolated and tests run independently; verify the skill distinguishes infrastructure reuse from shared mutable test state.
- [x] 1.3 Move the expected HTTP status assertion before typed response deserialization in the integration example; verify the example checks status before parsing the body.
- [x] 1.4 Review naming, coverage-extension, and anti-pattern guidance for conflicting one-case-per-file requirements; verify grouped repository conventions remain allowed throughout the skill.

## 2. Validate the change

- [x] 2.1 Check that the `dotnet-testing` delta spec and updated skill express the same behavior for existing conventions, test independence, fixture reuse, and HTTP response validation.
- [x] 2.2 Run `openspec validate refine-ac-dotnet-testing-guidance --type change` and `openspec validate --specs`; resolve any validation findings and confirm the change status reports all required artifacts complete.
