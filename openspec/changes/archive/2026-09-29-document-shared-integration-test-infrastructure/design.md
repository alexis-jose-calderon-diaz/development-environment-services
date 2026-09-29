# Design

## Context

The current skill permits xUnit fixtures to share costly infrastructure and its integration example creates an isolated database for each case. The `dotnet-testing` capability already requires independently runnable cases and prohibits shared mutable test state. See `proposal.md` for motivation and `specs/dotnet-testing/spec.md` for the updated contract.

## Goals / Non-Goals

**Goals:**
- Explain sharing a host, database container, or database when repeated startup materially increases suite runtime.
- Describe a reset boundary that restores per-case logical isolation and preserves required seeds and migration history.
- Keep per-test physical isolation as a supported alternative and make the example reflect that choice.

**Non-Goals:**
- Prescribe a particular database reset tool, fixture library, or persistence framework.
- Change production or test code in this repository.
- Require serialization when tests use safely partitioned data and can run concurrently.

## Decisions

- Add a dedicated shared-infrastructure subsection under integration-test independence and cleanup. State that sharing infrastructure does not permit sharing mutable case data.
- Recommend reuse only when startup cost is material. Hosts, database containers, and databases may live at fixture or collection scope; each case must be reset automatically before it runs.
- Define reset as idempotent: remove transient data from prior cases, preserve required seed/reference data and migration history, and leave the environment in the same usable baseline when run more than once.
- Require a focused reset test that seeds transient and preserved data, invokes reset, and verifies deletion, preservation, and repeatability.
- Explain that test execution must be serialized at the smallest practical scope when reset and case execution can race over shared mutable state. Independent schemas, databases, transactions, or unique partitions can remain parallel where they provide real isolation.
- Keep `StartWithIsolatedDatabaseAsync` in the existing case-level example as the physical-isolation path, and add a separate shared-fixture example or pseudocode showing automatic reset before arrange/act/assert. Avoid implying that illustrative adapter names exist in consumer repositories.

## Risks / Trade-offs

- [A shared host can retain mutable in-memory state beyond database rows] → Describe host-level state as part of the isolation boundary and require reset or serialization when that state can affect cases.
- [A broad reset can remove seeds or migration metadata] → Make preservation explicit and verify both preserved categories in the reset test.
- [Serialization can reduce parallel throughput] → Limit it to tests whose shared mutable state cannot be safely partitioned; retain physical isolation or independent partitions as alternatives.
