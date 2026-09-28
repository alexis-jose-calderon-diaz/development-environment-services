---
name: ac-dotnet-testing
description: Use this skill whenever a user asks to create, add, organize, extend, or review unit or integration tests in a .NET/C# solution that uses xUnit, even if they do not explicitly ask for testing conventions. Trigger for test-project layout, one case per file, Arrange-Act-Assert, independent data and resources, unit/integration boundaries, or feature-oriented integration coverage. Do not trigger for NUnit or other frameworks, package/runner/CLI/CI troubleshooting, assertion-library comparisons, production-only fixes, or Clean Architecture project-reference decisions.
---

# .NET Testing with xUnit

Use this skill to structure .NET test projects and create focused, independent
xUnit tests. Teach patterns rather than prescribing assertion or mocking
libraries. Respond in the user's explicitly requested language; use English when
no response language is specified.

## Scope and workflow

- Cover both unit tests and integration tests written with xUnit.
- When working in an existing repository, inspect the solution, test projects,
  and nearby tests first. Preserve established project names and conventions
  where they do not conflict with the one-case-per-file and independence rules.
- Separate confirmed repository conventions from recommendations. Do not invent
  application types, layers, or infrastructure that are not present.
- Keep every test independently runnable. A test must not rely on another test's
  execution, data, or cleanup.

## Test project structure

Keep unit and integration tests in separate projects:

```text
tests/
  MyApp.UnitTests/
    MyApp.UnitTests.csproj
    Features/
      Pricing/
        PriceCalculator_WhenQuantityIsPositive_ReturnsTotalTests.cs
        PriceCalculator_WhenQuantityIsZero_ReturnsZeroTests.cs
  MyApp.IntegrationTests/
    MyApp.IntegrationTests.csproj
    Features/
      Orders/
        CreateOrder_WhenRequestIsValid_PersistsOrderTests.cs
```

- Name projects `<ProductionProject>.UnitTests` and
  `<ProductionProject>.IntegrationTests` (for example,
  `MyApp.UnitTests` and `MyApp.IntegrationTests`).
- Organize test files by feature or capability rather than mirroring technical
  layers such as `Controllers/`, `Services/`, and `Repositories/`.
- Put each individual case in its own file. The filename and test class name
  must identify the subject and scenario, for example
  `PriceCalculator_WhenQuantityIsPositive_ReturnsTotalTests.cs`.
- Each case file contains one test class and exactly one test method. Use a
  separate file and class for a distinct case, even when testing the same
  production type.

## Unit tests

Unit tests verify a focused behavior of a unit without starting the application
or depending on external infrastructure. Name each test for the subject,
condition, and expected outcome. Keep the Arrange-Act-Assert phases easy to
identify and put one `[Fact]` method in the file.

For a production `PriceCalculator` type, a case file can look like this:

```csharp
namespace MyApp.UnitTests.Features.Pricing;

public sealed class PriceCalculator_WhenQuantityIsPositive_ReturnsTotalTests
{
    [Fact]
    public void Calculate_WithPositiveQuantity_ReturnsUnitPriceTimesQuantity()
    {
        // Arrange
        var calculator = new PriceCalculator();
        const decimal unitPrice = 12.50m;
        const int quantity = 3;

        // Act
        var total = calculator.Calculate(unitPrice, quantity);

        // Assert
        Assert.Equal(37.50m, total);
    }
}
```

The class and method names are examples; match the actual production API. Keep
multiple assertions in one case only when they verify the same outcome or
coherent scenario. Split a distinct behavior into its own case file.

## Integration tests by vertical slice

Organize integration tests under the feature they verify. Each integration case
should exercise the end-to-end behavior through the relevant production
boundaries. For a feature that exposes an API and persists data, a create-order
case can cover the API endpoint, application/service behavior, repository, and
database together rather than testing each layer in a separate folder.

Example file: `Features/Orders/CreateOrder_WhenRequestIsValid_PersistsOrderTests.cs`.
The `TestApplication` adapter below represents the repository-specific way to
start a fresh host and isolated test database; create and dispose it inside this
case, not in a shared xUnit fixture.

```csharp
namespace MyApp.IntegrationTests.Features.Orders;

public sealed class CreateOrder_WhenRequestIsValid_PersistsOrderTests
{
    [Fact]
    public async Task CreateOrder_PersistsTheSubmittedOrder()
    {
        // Arrange
        await using var app = await TestApplication.StartWithIsolatedDatabaseAsync();
        var request = new CreateOrderRequest(CustomerId: "customer-42");

        // Act
        using var response = await app.Client.PostAsJsonAsync("/orders", request);
        var created = await response.Content.ReadFromJsonAsync<OrderResponse>()
            ?? throw new InvalidOperationException("Expected a created order response.");

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var persisted = await app.FindOrderAsync(created.Id);
        Assert.Equal(request.CustomerId, persisted.CustomerId);
    }
}
```

Adapt the request, response, host, and database access to the actual application.
The example is illustrative, not a claim that these types or endpoints exist in
the user's repository. Use real components for the boundaries under test; isolate
or replace unrelated external systems when needed.

## Independence, data, and cleanup

- Each test creates the data it needs and owns the lifetime of resources it
  starts. Dispose resources in the test, using `using`, `await using`, or
  `try/finally` as appropriate.
- Do not use shared mutable state, test-order assumptions, or shared xUnit
  fixtures (`IClassFixture<T>` / `ICollectionFixture<T>`) to pass data or costly
  mutable context between tests.
- For integration tests, use an isolated database, transaction, schema, or
  uniquely identified records appropriate to the application, and clean up only
  resources owned by that test.
- Avoid duplicating large setup blocks by using a small helper local to the
  case file. A helper must not conceal shared state or couple test lifecycles.
- Reusable immutable constants or pure construction logic are acceptable only
  when they do not introduce shared mutable state or test dependencies.

## Extend coverage without duplicating cases

Before adding a file, find the existing case for the same production behavior.
If a new property is part of the same result or scenario already covered, extend
that case's assertions in its existing file; do not add another case just to
assert the property. If the new property represents a distinct behavior, or a
new method needs a distinct scenario, create one new case file for it. Keep the
one-test-method-per-file rule in either situation.

## Assertions and test doubles

Use xUnit's built-in `Assert` in examples to keep the baseline self-contained.
Teams may use their existing assertion library; options include xUnit `Assert`,
FluentAssertions, and Shouldly. Do not require or rank one option.

For unit tests, isolate only collaborators whose behavior is outside the unit's
responsibility. For integration tests, prefer exercising real components at the
boundaries the case is meant to verify. Teams may use Moq, NSubstitute,
FakeItEasy, handwritten fakes, or another established approach; do not require
or rank a mocking library.

## Anti-patterns

- Multiple test methods or unrelated behaviors in one file.
- One test depending on another test to seed data, initialize state, or clean
  up.
- Shared mutable state or mutable fixture state across test cases.
- Tests whose results depend on execution order, shared database rows, or a
  particular test-run sequence.
- A single test that combines unrelated behaviors. Multiple assertions about
  the same outcome are fine; separate distinct outcomes into separate cases.
- Integration test folders organized only by technical layer, leaving a feature
  fragmented across unrelated locations.
- Creating a new test case solely for a property that belongs to an existing
  scenario, or appending a distinct behavior to an existing case file.
