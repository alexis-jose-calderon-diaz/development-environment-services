# dotnet-testing Specification

## Purpose

Provides a complete, framework-agnostic guide for creating xUnit test projects, covering structure, organization, and coding patterns for both unit and integration tests.

## Requirements

### Requirement: Separate test projects

The skill SHALL define a structure where unit tests and integration tests live in separate projects, named `<Project>.UnitTests` and `<Project>.IntegrationTests` respectively.

#### Scenario: Unit test project naming
- **WHEN** a new .NET solution has a project named `MyApp`
- **THEN** the unit test project SHALL be named `MyApp.UnitTests`

#### Scenario: Integration test project naming
- **WHEN** a new .NET solution has a project named `MyApp`
- **THEN** the integration test project SHALL be named `MyApp.IntegrationTests`

### Requirement: One test case per file

The skill SHALL establish that each test file contains exactly one test case in exactly one test method. The file and test class names SHALL identify both the subject and the scenario so distinct cases for the same class can live in separate files.

#### Scenario: Separate cases for one class
- **WHEN** creating two distinct test cases for `OrderService`
- **THEN** each case SHALL have its own file and test class, with one test method in each file

#### Scenario: File naming identifies the scenario
- **WHEN** creating a test case for `PaymentProcessor` that rejects an expired card
- **THEN** the file and test class SHALL use a descriptive subject-and-scenario name such as `PaymentProcessor_RejectsExpiredCardTests.cs`

### Requirement: Self-contained tests

The skill SHALL require that each test creates its own data and cleans up after itself, with no shared fixtures or dependencies between tests.

#### Scenario: Independent test execution
- **WHEN** running any single test in isolation
- **THEN** it SHALL pass without requiring any other test to run first

#### Scenario: No shared state
- **WHEN** multiple tests need similar test data
- **THEN** each test SHALL create its own copy of the data

### Requirement: Vertical slice organization for integration tests

The skill SHALL define that integration tests are organized by feature (vertical slice), where each test crosses all layers of a specific functionality, rather than by technical layer.

#### Scenario: Feature-based folder structure
- **WHEN** creating integration tests for an e-commerce application
- **THEN** tests SHALL be organized in folders like `Orders/`, `Payments/`, `Inventory/` rather than `Controllers/`, `Services/`, `Repositories/`

#### Scenario: Cross-layer test
- **WHEN** writing an integration test for "Create Order"
- **THEN** the test SHALL exercise the API endpoint, service layer, repository, and database

### Requirement: Extend existing cases for the same scenario

The skill SHALL establish that when a new property belongs to the same result or behavior already covered by a test case, that existing case SHALL be extended with the relevant assertion rather than creating a second case. A distinct behavior SHALL have its own test case and file.

#### Scenario: Adding a property to an existing result
- **WHEN** an `OrderService` result gains a property covered by an existing scenario
- **THEN** the existing one-case test file SHALL be extended to assert that property without adding another test method

#### Scenario: Adding a distinct behavior
- **WHEN** a new method or behavior on `OrderService` requires a separate scenario
- **THEN** it SHALL be covered by one new test case in its own file, leaving existing case files with one test method each

### Requirement: Framework-agnostic guidance

The skill SHALL provide guidance that is not tied to any specific assertion or mocking library, mentioning options without recommending a specific one.

#### Scenario: Assertion examples
- **WHEN** showing how to write assertions
- **THEN** the skill SHALL mention multiple options (e.g., xUnit.Assert, FluentAssertions, Shouldly) without requiring one

#### Scenario: Mocking examples
- **WHEN** showing how to create mocks
- **THEN** the skill SHALL mention multiple options (e.g., Moq, NSubstitute, FakeItEasy) without requiring one

### Requirement: Code patterns and examples

The skill SHALL include concrete code examples for common patterns including arrange-act-assert, test organization, and anti-patterns.

#### Scenario: Arrange-Act-Assert pattern
- **WHEN** showing a basic unit test
- **THEN** the skill SHALL demonstrate the arrange-act-assert structure with clear comments

#### Scenario: Anti-pattern documentation
- **WHEN** describing what to avoid
- **THEN** the skill SHALL include anti-patterns such as shared mutable state, tests depending on execution order, and multiple assertions for different behaviors in one test
