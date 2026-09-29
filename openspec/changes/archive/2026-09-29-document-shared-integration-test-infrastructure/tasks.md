# Tasks

## 1. Document shared integration-test isolation

- [x] 1.1 Update `skills/ac-dotnet-testing/SKILL.md` to explain when reusing a host, database container, or database can reduce suite runtime, while stating that shared infrastructure never means shared mutable case state; verify the guidance covers all three infrastructure layers and preserves independent test execution.
- [x] 1.2 Document automatic, idempotent per-case reset of shared database state, including removal of transient data and preservation of required seeds and migration history; verify the text requires a dedicated test of deletion, preservation, and repeated reset behavior.
- [x] 1.3 Document serialization when shared mutable state cannot be safely isolated during concurrent execution, and retain per-test physical isolation as a valid alternative; verify the guidance limits serialization to the affected test scope and presents the existing isolated-database example consistently.

## 2. Review examples and validate the contract

- [x] 2.1 Add or revise an illustrative shared-fixture example to show reset occurring automatically before each case, and review related references and the public skills catalog for consistency; verify examples distinguish infrastructure reuse from mutable test data and do not imply repository-specific types exist.
- [x] 2.2 Review the final diff to confirm only the requested skill documentation changed, then run `openspec validate --specs` and resolve any specification validation errors.
