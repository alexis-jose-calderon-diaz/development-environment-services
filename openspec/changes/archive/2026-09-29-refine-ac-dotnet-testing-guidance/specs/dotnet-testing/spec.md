# Spec Delta

## MODIFIED Requirements

### Requirement: Separate test projects

The skill SHALL present separate unit and integration test projects named `<Project>.UnitTests` and `<Project>.IntegrationTests` as a recommended default for new solutions. When working in an existing solution, it SHALL preserve established project boundaries and names unless the user requests a reorganization or a concrete constraint requires a change.

#### Scenario: Unit test project naming
- **WHEN** creating test projects for a new .NET solution with a production project named `MyApp`
- **THEN** the skill SHALL recommend `MyApp.UnitTests` as the default unit-test project name

#### Scenario: Integration test project naming
- **WHEN** creating test projects for a new .NET solution with a production project named `MyApp`
- **THEN** the skill SHALL recommend `MyApp.IntegrationTests` as the default integration-test project name

#### Scenario: Adding tests to an existing solution
- **WHEN** adding or reviewing tests in a solution that already has a test-project structure
- **THEN** the skill SHALL follow that structure and SHALL NOT recommend renaming or splitting projects solely to match its default layout

### Requirement: One test case per file

The skill SHALL present one test case per file, with descriptive file and class names, as a preferred convention. It SHALL follow the repository's established grouping convention or the user's explicit choice when that differs, while keeping distinct behaviors understandable and independently runnable.

#### Scenario: Separate cases for one class
- **WHEN** creating tests in a new solution or a repository that uses one case per file
- **THEN** each distinct test case SHALL have its own file and test class, and the names SHALL identify the subject and scenario

#### Scenario: Following an established grouping convention
- **WHEN** adding tests to a repository that groups multiple related test methods in one file
- **THEN** the skill SHALL preserve that convention unless the user requests a different organization

#### Scenario: File naming identifies the scenario
- **WHEN** writing a test case for `PaymentProcessor` that rejects an expired card
- **THEN** the skill SHALL recommend a descriptive subject-and-scenario name such as `PaymentProcessor_RejectsExpiredCardTests.cs`

### Requirement: Self-contained tests

The skill SHALL require that each test can run independently, owns or isolates its mutable test data, and does not depend on another test's execution or cleanup. It MAY recommend fixtures for sharing costly infrastructure when the fixture does not share mutable test state or introduce order dependencies.

#### Scenario: Independent test execution
- **WHEN** running any single test in isolation
- **THEN** it SHALL pass without requiring another test to run first or clean up after it

#### Scenario: Isolated test data
- **WHEN** multiple tests need similar mutable test data
- **THEN** each test SHALL create or receive an isolated copy of that data

#### Scenario: No shared state
- **WHEN** multiple tests need similar test data
- **THEN** each test SHALL create its own copy of mutable data and SHALL NOT depend on shared mutable state

#### Scenario: Shared infrastructure fixture
- **WHEN** integration tests use a fixture to share costly infrastructure such as a host or database container
- **THEN** the fixture MAY share that infrastructure while each test retains isolated data and can run independently

### Requirement: Extend existing cases for the same scenario

The skill SHALL establish that when a new property belongs to the same result or behavior already covered by a test case, that existing case SHALL be extended with the relevant assertion rather than creating a second case. A distinct behavior SHALL have its own test method. It SHALL have its own file when the repository follows the one-case-per-file convention; when the repository groups related test methods in one file, the skill SHALL preserve that grouping.

#### Scenario: Adding a property to an existing result
- **WHEN** an `OrderService` result gains a property covered by an existing scenario
- **THEN** the existing case SHALL be extended to assert that property without adding another test method

#### Scenario: Adding a distinct behavior
- **WHEN** a new method or behavior on `OrderService` requires a separate scenario
- **THEN** it SHALL be covered by one new test method; create a separate file when following one-case-per-file, or keep it in the existing file when that is the repository's established grouping

### Requirement: Vertical slice organization for integration tests

The skill SHALL recommend organizing integration tests by feature or use case rather than only by technical layer. For new solutions it MAY show a feature-oriented folder structure as a default. In an existing solution it SHALL preserve established organization unless the user requests a reorganization, and it SHALL describe integration coverage in terms of the relevant boundaries rather than requiring every test to cross every application layer.

#### Scenario: Feature-based folder structure
- **WHEN** creating integration tests for an e-commerce application in a new solution
- **THEN** the skill SHALL recommend feature folders such as `Orders/`, `Payments/`, and `Inventory/` over folders organized only as `Controllers/`, `Services/`, and `Repositories/`

#### Scenario: Existing integration-test organization
- **WHEN** adding integration tests to a solution with an established folder organization
- **THEN** the skill SHALL follow that organization and SHALL NOT require moving existing tests solely to adopt a feature-oriented layout

#### Scenario: Cross-layer test
- **WHEN** writing an integration test for "Create Order"
- **THEN** the test SHALL exercise the relevant production boundaries for the behavior under test without requiring unrelated layers or external systems

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
