# Spec Delta

## MODIFIED Requirements

### Requirement: Self-contained tests
The skill SHALL require that each test can run independently, owns or isolates its mutable test data, and does not depend on another test's execution or cleanup. For integration tests, it MAY recommend sharing costly infrastructure such as a host, database container, or database when startup cost justifies reuse, provided each case receives logically isolated mutable data. Sharing infrastructure SHALL NOT be described as sharing mutable test state. The skill SHALL retain an isolated host, container, database, transaction, schema, or other suitable physical isolation per test as a valid choice when that offers the better fit.

#### Scenario: Independent test execution
- **WHEN** running any single test in isolation
- **THEN** it SHALL pass without requiring another test to run first or clean up after it

#### Scenario: No shared mutable state
- **WHEN** multiple tests use the same host, container, or database infrastructure
- **THEN** each test SHALL create and own its mutable data, and SHALL NOT depend on mutable fixture data or another test's state

#### Scenario: Sharing costly infrastructure
- **WHEN** repeatedly starting a host, database container, or database adds meaningful integration-suite runtime
- **THEN** the skill SHALL allow a fixture to reuse that infrastructure while requiring logical isolation for every test case

#### Scenario: Reset shared infrastructure before each case
- **WHEN** a test uses shared database state
- **THEN** the shared state SHALL be reset automatically before each case by an idempotent operation that removes transient test data while preserving required seed data and migration history

#### Scenario: Verify the reset contract
- **WHEN** the skill recommends automatic reset for shared integration-test state
- **THEN** it SHALL require a test that verifies the reset removes transient data, preserves required seeds and migration history, and remains safe when repeated

#### Scenario: Serialize tests that cannot safely overlap
- **WHEN** tests share mutable infrastructure state that cannot be isolated during concurrent execution
- **THEN** the skill SHALL require serializing those tests or the smallest applicable test collection while retaining per-case reset and independent execution

#### Scenario: Per-test physical isolation
- **WHEN** per-test infrastructure startup is affordable or physical isolation better fits the suite
- **THEN** the skill SHALL continue to present creating and disposing isolated infrastructure per case as a valid option
