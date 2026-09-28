# Design

## Context

The repository has no existing skill that guides test creation for .NET projects. The `ac-dotnet-testing` skill will be the first public skill focused on testing conventions. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Provide a complete, self-contained guide for xUnit test structure and patterns
- Cover both unit and integration tests with clear, actionable conventions
- Be framework-agnostic to remain applicable across different project preferences
- Include concrete code examples and anti-patterns

**Non-Goals:**
- Do not recommend specific third-party libraries (assertion frameworks, mocking frameworks)
- Do not cover test coverage tools or CI/CD integration
- Do not provide language-specific guidance beyond C# / .NET

## Decisions

### Decision 1: Separate test projects by test type

**Choice:** Unit tests and integration tests live in separate projects (`<Project>.UnitTests`, `<Project>.IntegrationTests`).

**Rationale:** Separating by test type allows independent execution, different build configurations, and clearer project references. Unit tests can run fast without infrastructure dependencies, while integration tests can reference infrastructure projects.

**Alternatives considered:**
- Single test project with folders for unit/integration: Simpler but mixes concerns and makes selective execution harder.
- Separate projects per feature: Too fragmented for small projects.

### Decision 2: One test case per file

**Choice:** Each test file contains one test class and exactly one test method/case. File and class names identify the subject and scenario, for example `OrderService_CreatesOrderTests.cs`.

**Rationale:** A direct 1:1 mapping between a file and a behavior makes individual cases easy to locate, review, and run. Distinct cases for one production class use separate descriptive files.

**Alternatives considered:**
- Multiple cases in one `<ClassName>Tests.cs` file: More compact, but does not meet the requested one-case-per-file convention.
- Files named only after the production class: Ambiguous when that class has multiple distinct behaviors to test.

When a property is added to the same result or behavior already covered, extend that case's assertions. Add a separate file only for a distinct behavior or scenario; do not split one scenario into extra cases merely to assert another property of its result.

### Decision 3: Self-contained tests with no shared fixtures

**Choice:** Each test creates its own data and cleans up after itself. No shared fixtures between tests.

**Rationale:** Eliminates hidden dependencies between tests, makes tests runnable in any order, and simplifies debugging. The cost of creating data per test is outweighed by the reliability gain.

**Alternatives considered:**
- xUnit `IClassFixture<T>`: Shared context per test class, but creates coupling between tests in the same class.
- xUnit `ICollectionFixture<T>`: Shared context across multiple classes, but introduces global state.
- Test data builders: Useful pattern, but still each test should own its data lifecycle.

### Decision 4: Vertical slice organization for integration tests

**Choice:** Integration tests are organized by feature (e.g., `Orders/`, `Payments/`), not by technical layer (e.g., `Controllers/`, `Services/`).

**Rationale:** Vertical slices align tests with business capabilities, making it clear what functionality is tested. When a feature changes, its tests are in one place. This also encourages tests that exercise the full stack.

**Alternatives considered:**
- Layer-based organization: Leads to fragmented tests where no single test verifies a feature end-to-end.
- Hybrid approach: Adds complexity without clear benefit.

### Decision 5: Framework-agnostic with multiple options

**Choice:** The skill mentions multiple assertion and mocking libraries without recommending a specific one.

**Rationale:** Different teams have different preferences. The skill should teach patterns, not tools. Mentioning options (xUnit.Assert, FluentAssertions, Shouldly, Moq, NSubstitute, FakeItEasy) makes the skill applicable everywhere.

**Alternatives considered:**
- Recommending a single library: Makes the skill opinionated and less reusable.
- Only using built-in xUnit.Assert: Too limiting for real-world projects.

## Risks / Trade-offs

- **Risk:** One case per file can increase the number of test files and repeat setup code.
  **Mitigation:** Use descriptive scenario names and small local setup helpers within each file; keep each case independently executable.
- **Risk:** Self-contained tests may lead to code duplication in test setup.
  **Mitigation:** Recommend test data builders and helpers only when they preserve each test's independent data and resource lifecycle; do not share mutable fixture state between tests.

- **Risk:** Vertical slice integration tests may become slow if they hit real databases.
  **Mitigation:** The skill should mention the option of using test containers or in-memory databases, but leave the choice to the user.

- **Risk:** Framework-agnostic guidance may be too abstract for beginners.
  **Mitigation:** Provide concrete code examples using xUnit's built-in features as the baseline, then mention alternatives.
