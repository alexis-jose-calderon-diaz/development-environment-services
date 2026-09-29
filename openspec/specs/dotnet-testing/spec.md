# dotnet-testing Specification

## Purpose

Provides a complete, framework-agnostic guide for creating xUnit test projects, covering structure, organization, and coding patterns for both unit and integration tests.

## Requirements

### Requirement: Separate test projects

The skill SHALL present separate unit and integration test projects named `<Project>.UnitTests` and `<Project>.IntegrationTests` as a recommended default for new solutions. When working in an existing solution, it SHALL preserve established project boundaries and names unless the user requests a reorganization or a concrete constraint requires a change.

#### Scenario: Unit test project naming
- **WHEN** a new .NET solution has a project named `MyApp`
- **THEN** the skill SHALL recommend `MyApp.UnitTests` as the default unit-test project name

#### Scenario: Integration test project naming
- **WHEN** a new .NET solution has a project named `MyApp`
- **THEN** the skill SHALL recommend `MyApp.IntegrationTests` as the default integration-test project name

#### Scenario: Adding tests to an existing solution
- **WHEN** adding or reviewing tests in a solution that already has a test-project structure
- **THEN** the skill SHALL follow that structure and SHALL NOT recommend renaming or splitting projects solely to match its default layout

### Requirement: One test case per file

The skill SHALL present one test case per file, with descriptive file and class names, as a preferred convention. It SHALL follow the repository's established grouping convention or the user's explicit choice when that differs, while keeping distinct behaviors understandable and independently runnable.

#### Scenario: Separate cases for one class
- **WHEN** creating tests in a new solution or a repository that uses one case per file
- **THEN** each case SHALL have its own file and test class, with one test method in each file

#### Scenario: Following an established grouping convention
- **WHEN** adding tests to a repository that groups multiple related test methods in one file
- **THEN** the skill SHALL preserve that convention unless the user requests a different organization

#### Scenario: File naming identifies the scenario
- **WHEN** creating a test case for `PaymentProcessor` that rejects an expired card
- **THEN** the skill SHALL recommend a descriptive subject-and-scenario name such as `PaymentProcessor_RejectsExpiredCardTests.cs`

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

### Requirement: Vertical slice organization for integration tests

The skill SHALL recommend organizing integration tests by feature or use case rather than only by technical layer. For new solutions it MAY show a feature-oriented folder structure as a default. In an existing solution it SHALL preserve established organization unless the user requests a reorganization, and it SHALL describe integration coverage in terms of the relevant boundaries rather than requiring every test to cross every application layer.

#### Scenario: Feature-based folder structure
- **WHEN** creating integration-test folders for a new e-commerce solution
- **THEN** the skill SHALL recommend feature folders such as `Orders/`, `Payments/`, and `Inventory/` over folders organized only as `Controllers/`, `Services/`, and `Repositories/`

#### Scenario: Existing integration-test organization
- **WHEN** adding integration tests to a solution with an established folder organization
- **THEN** the skill SHALL follow that organization and SHALL NOT require moving existing tests solely to adopt a feature-oriented layout

#### Scenario: Cross-layer test
- **WHEN** writing an integration test for "Create Order"
- **THEN** the test SHALL exercise the relevant production boundaries for the behavior under test without requiring unrelated layers or external systems

### Requirement: Extend existing cases for the same scenario

The skill SHALL establish that when a new property belongs to the same result or behavior already covered by a test case, that existing case SHALL be extended with the relevant assertion rather than creating a second case. A distinct behavior SHALL have its own test method. It SHALL have its own file when the repository follows the one-case-per-file convention; when the repository groups related test methods in one file, the skill SHALL preserve that grouping.

#### Scenario: Adding a property to an existing result
- **WHEN** an `OrderService` result gains a property covered by an existing scenario
- **THEN** the existing case SHALL be extended to assert that property without adding another test method

#### Scenario: Adding a distinct behavior
- **WHEN** a new method or behavior on `OrderService` requires a separate scenario
- **THEN** it SHALL be covered by one new test method; create a separate file when following one-case-per-file, or keep it in the existing file when that is the repository's established grouping

### Requirement: Framework-agnostic guidance

The skill SHALL provide guidance that is not tied to any specific assertion or mocking library, mentioning options without recommending a specific one.

#### Scenario: Assertion examples
- **WHEN** showing how to write assertions
- **THEN** the skill SHALL mention multiple options (e.g., xUnit.Assert, FluentAssertions, Shouldly) without requiring one

#### Scenario: Mocking examples
- **WHEN** showing how to create mocks
- **THEN** the skill SHALL mention multiple options (e.g., Moq, NSubstitute, FakeItEasy) without requiring one

### Requirement: Code patterns and examples

The skill SHALL include concrete code examples for common patterns including arrange-act-assert, test organization, and anti-patterns. HTTP integration examples SHALL check the expected response status before deserializing a response body when the status determines whether that body has the expected shape.

#### Scenario: Arrange-Act-Assert pattern
- **WHEN** showing a basic unit test
- **THEN** the skill SHALL demonstrate the arrange-act-assert structure with clear comments

#### Scenario: Anti-pattern documentation
- **WHEN** describing what to avoid
- **THEN** the skill SHALL include anti-patterns such as shared mutable state, tests depending on execution order, and multiple assertions for different behaviors in one test

#### Scenario: HTTP response validation
- **WHEN** an integration-test example expects a successful HTTP response with a typed body
- **THEN** the example SHALL assert the expected status before deserializing that body
