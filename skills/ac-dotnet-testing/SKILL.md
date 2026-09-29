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
  and nearby tests first. Follow established project names, file grouping, and
  folder conventions unless the user requests a reorganization or a concrete
  constraint requires one. Treat this skill's layouts as recommendations when
  they differ from an existing repository.
- Separate confirmed repository conventions from recommendations. Do not invent
  application types, layers, or infrastructure that are not present.
- Keep every test independently runnable. A test must not rely on another test's
  execution, data, or cleanup.

## Test project structure

For a new solution, recommend separate unit and integration test projects under
`tests/` at the solution root. Within each project, use this feature-oriented
layout as a default: `Features/<Module>/<SliceOrUseCase>/`. Use the production
module as `<Module>` (for example, `Orders`) and a concise PascalCase slice or
use-case name as `<SliceOrUseCase>` (for example, `CreateOrder/` or
`UpdateOrder/`). Keep different use cases in separate folders, even when they
belong to the same module. If a module has only one use case, still include its
use-case folder so the layout stays predictable. Keep the C# namespace aligned
with the folders below the project root; for example,
`Features/Orders/CreateOrder/` maps to
`MyApp.IntegrationTests.Features.Orders.CreateOrder`. This feature-oriented
layout keeps a use case together when it exercises multiple production layers.
In an existing solution, follow its project and folder conventions; do not
rename projects or move tests solely to adopt this example.

Example layout:

```text
tests/
  MyApp.UnitTests/
    MyApp.UnitTests.csproj
    Features/
      Pricing/
        Calculate/
          Calculate_WhenQuantityIsPositive_ReturnsUnitPriceTimesQuantityTests.cs
          Calculate_WhenQuantityIsZero_ReturnsZeroTests.cs
  MyApp.IntegrationTests/
    MyApp.IntegrationTests.csproj
    Features/
      Orders/
        CreateOrder/
          CreateOrder_WhenRequestIsValid_PersistsTheSubmittedOrderAsyncTests.cs
        UpdateOrder/
          UpdateOrder_WhenRequestIsValid_UpdatesTheOrderAsyncTests.cs
```

- For a new solution, recommend projects named
  `<ProductionProject>.UnitTests` and
  `<ProductionProject>.IntegrationTests` (for example,
  `MyApp.UnitTests` and `MyApp.IntegrationTests`). Use the existing project
  names and boundaries in a repository that already has test projects.
- When applying this layout in a new solution, group cases under
  `Features/<Module>/<SliceOrUseCase>/` as shown above. Choose the module and
  use-case names from the behavior being tested, not from the production layer.
- Prefer giving each case its own file, class, and test method in a new suite or
  where the repository already follows that convention. Use the test method name
  as the shared base name when following that convention: if the method is
  `<Action>_When<Condition>_<ExpectedOutcome>`, name the file
  `<Action>_When<Condition>_<ExpectedOutcome>Tests.cs` and the class
  `<Action>_When<Condition>_<ExpectedOutcome>Tests`. The class and file names
  should match apart from `.cs` and the `Tests` suffix. Use PascalCase without
  spaces, make the condition and outcome specific, and avoid vague names such
  as `GeneralTests.cs` or `HappyPathTests.cs`.
- When following the one-case-per-file convention, keep one test class and one
  test method in each case file, usually marked `[Fact]`. Put a distinct
  condition or expected behavior in its own file, even when testing the same
  production type. Use `[Theory]` when multiple input rows verify the same
  condition and expected behavior; those rows remain one case in one file. In
  an existing suite that groups related methods together, preserve that pattern
  unless the user asks to change it.

## Unit tests

Unit tests verify a focused behavior of a unit without starting the application
or depending on external infrastructure. Name the method
`<Method>_When<Condition>_<ExpectedOutcome>`; use the method under test as the
first segment, then state the condition and observable result. When using
one-case-per-file, derive the file and class names from that exact method name,
adding `Tests` to both. When the repository groups cases in a class, follow its
file and class naming pattern. For example, the method
`Calculate_WhenQuantityIsPositive_ReturnsUnitPriceTimesQuantity` belongs in
`Calculate_WhenQuantityIsPositive_ReturnsUnitPriceTimesQuantityTests.cs`, in
the matching class
`Calculate_WhenQuantityIsPositive_ReturnsUnitPriceTimesQuantityTests`.
Keep the Arrange-Act-Assert phases easy to identify. When using one case per
file, put one `[Fact]` method in the file. For async test methods, append
`Async` to the method name.

For a production `PriceCalculator` type, a case file can look like this:

```csharp
namespace MyApp.UnitTests.Features.Pricing.Calculate;

public sealed class Calculate_WhenQuantityIsPositive_ReturnsUnitPriceTimesQuantityTests
{
    [Fact]
    public void Calculate_WhenQuantityIsPositive_ReturnsUnitPriceTimesQuantity()
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
coherent scenario. Give a distinct behavior its own test method; use a separate
file when following the one-case-per-file convention.

## Integration tests by vertical slice

For new suites, recommend organizing integration tests under the feature they
verify. In an existing suite, follow its established folder structure unless
the user asks to reorganize it. Each integration case should exercise the
end-to-end behavior through the relevant production boundaries. For a feature
that exposes an API and persists data, a create-order case can cover the API
endpoint, application/service behavior, repository, and database together
rather than testing each layer in a separate folder.

Example file: `Features/Orders/CreateOrder/CreateOrder_WhenRequestIsValid_PersistsTheSubmittedOrderAsyncTests.cs`.
Name the method `<UseCase>_When<Condition>_<ExpectedOutcome>` and append
`Async` when the method is async. For the one-case-per-file convention, derive
the file and class names from that method name with a `Tests` suffix. For
example, this file contains the class
`CreateOrder_WhenRequestIsValid_PersistsTheSubmittedOrderAsyncTests` and method
`CreateOrder_WhenRequestIsValid_PersistsTheSubmittedOrderAsync`.
The `TestApplication` adapter below represents the repository-specific way to
start a host with an isolated database; this example creates and disposes that
infrastructure in the case. Per-test physical isolation is a valid choice when
its startup cost is acceptable or it makes the suite easier to reason about.
When repeatedly starting a host, database container, or database materially
increases suite runtime, a fixture may keep that infrastructure alive across
cases. Reusing infrastructure does not mean reusing mutable test state: every
case still needs its own logical baseline and data.

```csharp
namespace MyApp.IntegrationTests.Features.Orders.CreateOrder;

public sealed class CreateOrder_WhenRequestIsValid_PersistsTheSubmittedOrderAsyncTests
{
    [Fact]
    public async Task CreateOrder_WhenRequestIsValid_PersistsTheSubmittedOrderAsync()
    {
        // Arrange
        await using var app = await TestApplication.StartWithIsolatedDatabaseAsync();
        var request = new CreateOrderRequest(CustomerId: "customer-42");

        // Act
        using var response = await app.Client.PostAsJsonAsync("/orders", request);

        // Assert the status before parsing the expected response shape
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var created = await response.Content.ReadFromJsonAsync<OrderResponse>()
            ?? throw new InvalidOperationException("Expected a created order response.");

        // Assert
        var persisted = await app.FindOrderAsync(created.Id);
        Assert.Equal(request.CustomerId, persisted.CustomerId);
    }
}
```

Adapt the request, response, host, and database access to the actual application.
The example is illustrative, not a claim that these types or endpoints exist in
the user's repository. Use real components for the boundaries under test; isolate
or replace unrelated external systems when needed.

For shared infrastructure, reset shared state automatically before every case,
such as from the test's per-case initialization hook. The reset must be
idempotent: remove transient data from earlier cases, preserve required seed or
reference data and migration history, and leave the same usable baseline when
run more than once. Include mutable host-level state in that boundary when it
can affect a case. For example, a shared fixture can expose
`ResetTransientStateAsync`, which the per-case lifecycle hook awaits before
Arrange:

```csharp
// Illustrative pseudocode: adapt the hook and return type to the xUnit version.
public Task InitializeAsync()
    => _fixture.ResetTransientStateAsync();
```

Add a focused test for the reset itself. It should create transient data and
required seed data, invoke the reset, verify that transient data is gone while
the seeds and migration history remain, then invoke the reset again and verify
that the usable baseline is unchanged. Do not rely on another integration case
to verify cleanup.

If a reset or another shared mutable resource can race with case execution,
serialize the smallest applicable test collection or suite. Keep tests parallel
when they use independent databases, schemas, transactions, or data partitions
that actually prevent interference. A shared host may also retain mutable
in-memory state; reset or isolate that state too, or serialize the affected
cases when it cannot be partitioned safely.

## Independence, data, and cleanup

- Each test creates the data it needs and owns the lifetime of resources it
  starts. Dispose resources in the test, using `using`, `await using`, or
  `try/finally` as appropriate.
- Do not use shared mutable test state or test-order assumptions. xUnit
  fixtures (`IClassFixture<T>` / `ICollectionFixture<T>`) may share a costly
  host, database container, or database when startup cost justifies reuse, but
  infrastructure reuse must not pass mutable test data between cases or make a
  test depend on another test's execution or cleanup.
- For shared integration-test state, reset automatically before every case.
  Make the reset idempotent, remove transient data, preserve required seeds and
  migration history, and test those guarantees. Reset relevant mutable host
  state as well as database state.
- Serialize only the tests whose shared mutable state cannot be safely
  partitioned during concurrent execution. Otherwise, use independent
  databases, transactions, schemas, or uniquely identified records to preserve
  parallel execution.
- Per-test physical isolation remains a valid alternative: create and dispose
  an isolated host, database container, database, transaction, or schema when
  its cost is acceptable or it better fits the application. Clean up only
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
new method needs a distinct scenario, add a separate test method. Put it in a
new file when following the one-case-per-file convention; when the repository
groups related tests in one file, preserve that grouping and keep the method
focused.

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

- Multiple unrelated behaviors in one test method. Multiple methods in one file
  are acceptable when that matches the repository's established grouping and
  each method covers a focused behavior.
- One test depending on another test to seed data, initialize state, or clean
  up.
- Shared mutable state or mutable fixture state that couples test cases.
- Tests whose results depend on execution order, shared database rows, or a
  particular test-run sequence.
- A single test that combines unrelated behaviors. Multiple assertions about
  the same outcome are fine; separate distinct outcomes into separate cases.
- For a new suite, organizing integration tests only by technical layer when
  that fragments a feature across unrelated locations.
- Creating a new test case solely for a property that belongs to an existing
  scenario, or adding a distinct behavior to the same test method. When the
  repository groups methods in one file, a distinct behavior belongs in its own
  method in that file.
