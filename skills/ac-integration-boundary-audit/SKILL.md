---
name: ac-integration-boundary-audit
description: Audit read-only whether the pieces of a distributed change fit together. Activate this skill when the user asks to check boundaries between implementation, contracts, clients or consumers, models, persistence, migrations, generated outputs, and tests, or needs to identify incompatibilities, blockers, or design decisions before correcting them. Do not use it to implement changes, review internal style, or organize commits.
---

# Integration Boundary Audit

Audit coherence between the pieces directly related to a change. The objective is
to determine whether interfaces still fit, not to inspect the entire repository
or replace a general quality review.

## Read-Only Limit

Do not edit, create, delete, or format files. Do not apply automatic corrections
even when you find a concrete incompatibility. Report the evidence, impact, and
recommended action so the user can decide the next step.

This read-only instruction is a behavior contract, not runtime permission
isolation: a skill loads inside the selected agent. If an effective no-modification
guarantee is required, the user must run the audit with an agent or mode whose
permissions are read-only.

Do not depend on an orchestrator prompt, delegated `Scope`, an `Analysis Report`,
an OpenSpec identifier, or a prior session. Work from the current request, the
repository state, and evidence provided by the user. Do not delegate work to
other agents.

Respond in the user's requested language; use English when no response language
is specified. Preserve the fixed boundary and global status values.

## Procedure

1. **Scope the audit.** Extract the objective, change or diff to check, scope,
   exclusions, available criteria, and relevant validations. If information is
   missing, inspect only the minimum context that can establish the boundary; do
   not invent contracts or assume a piece works.
2. **Identify the surface.** List modified or relevant modules and files, affected
   contracts, models, storage, migrations, generated outputs, consumers, and
   tests. Prioritize the diff and direct references.
3. **Trace each applicable boundary.** Compare names, types, parameters,
   responses, formats, versions, paths, behavior, and errors on both sides. Check
   only the boundaries necessary for the change:
     implementation → contracts, contracts → consumers, model → persistence,
     persistence → migrations, model → generated outputs, implementation → tests,
     and generated outputs → consumers.
4. **Find sufficient evidence.** Use proportional reads, searches, and
   validations. Distinguish observed facts from inferences. If a boundary lacks
   sufficient evidence, mark it `NO VERIFICADA` (or `NO APLICA` when outside the
   surface), never as a success.
5. **Classify results.** Report only evidence-backed incompatibilities. Assign
   `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`, and state the boundary, paths, concrete
   evidence, impact, and recommended action. An incompatibility requiring a
   public-decision change, scope expansion, design choice, or authorization is a
   blocker; do not invent a solution.
6. **Record validations.** Run builds, tests, generation, type checking, linting,
   or output comparisons only when they provide evidence about a boundary. Record
   the command, covered surface, and result. A missing, failed, or invalidated
   validation is not a `PASS`.

### States and Evidence

`NO VERIFICADA` means missing or insufficient evidence; it does not imply a defect
exists. Explain which file, consumer, result, or validation is missing and do not
replace it with an inference. `FAIL` on a boundary means a concrete
incompatibility demonstrated by two comparable sides. If that incompatibility or
pending data compatibility requires choosing a design, changing a public contract,
expanding scope, or receiving authorization, retain the finding as a blocker and
use `BLOCKED` for the global status; do not choose for the user. An explicitly
demonstrated decision in the audited material can close a boundary as `PASS`, but
a pending decision is `BLOCKED`.

Calculate the global status with this precedence:

1. `BLOCKED`: at least one unresolved design, compatibility, or authorization
   blocker exists, even if other boundaries pass.
2. `FAIL`: a demonstrated incompatibility exists that does not require a design
   decision to act on and there is no higher-precedence blocker.
3. `PASS WITH WARNINGS`: there are no incompatibilities or blockers, but at least
   one boundary is `NO VERIFICADA`, a validation is missing, or an explicit
   residual risk remains.
4. `PASS`: all applicable boundaries are verified and pass, with no findings,
   missing relevant validations, or pending risks.

Do not confuse `NO VERIFICADA` with `BLOCKED`: the first describes what could not
yet be demonstrated; the second describes a demonstrated incompatibility or
pending decision that prevents closing the integration.

## What to Check

- **Implementation → contracts:** signatures, types, states, errors, versions,
  and exposed behavior.
- **Contracts → consumers:** clients, adapters, commands, endpoints, events, or
  documentation consuming names, formats, and responses.
- **Model → persistence:** fields, nullability, serialization, relationships,
  indexes, and conversions.
- **Persistence → migrations:** expected schema, ordering, defaults,
  reversibility when applicable, and compatibility with existing data.
- **Model → generated outputs:** fields, types, nullability, names, serialization,
  and any other representation the generator must produce.
- **Implementation → tests:** cases that actually exercise the changed interface,
  coherent assertions, and relevant coverage gaps.
- **Generated outputs → consumers:** produced files, code, artifacts, or reports;
  format, location, names, and dependent consumers.

Do not turn the audit into a style inspection, refactor, generic security review,
or implementation. Do not report hypothetical problems without a concrete path,
contract, result, or reference supporting them.

Style is out of scope even when inconsistent. It enters the audit only if the
alleged style problem changes an interface or contract consumed by another
component (for example, name, type, format, path, or serialization); in that case
report the compatibility effect, not an aesthetic preference.

## Report

Return a concise report with this structure. Preserve `/` as the separator and
use valid paths with the necessary directories.

```markdown
# Integration Boundary Audit

## Status

`PASS` | `PASS WITH WARNINGS` | `FAIL` | `BLOCKED`

Apply the precedence defined above. Do not use `FAIL` or `BLOCKED` to fill missing
evidence: an unproven boundary is `NO VERIFICADA` and normally leaves the global
status `PASS WITH WARNINGS`, unless a blocker also exists.

## Blockers

- `None`, or each blocker with a concrete cause, evidence, affected surface, and
  required decision or action.

## Verified Surface

- Modules:
- Modified or relevant files:
- Contracts:
- Models and persistence:
- Migrations:
- Generated outputs:
- Consumers:
- Tests:

## Verified Boundaries

- Implementation → Contracts: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Contracts → Consumers: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Model → Persistence: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Persistence → Migrations: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Model → Generated outputs: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Implementation → Tests: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Generated outputs → Consumers: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`

## Findings

For each finding include:

- severity: `CRITICAL` | `HIGH` | `MEDIUM` | `LOW`
- boundary:
- files:
- description:
- evidence:
- impact:
- recommended action:

Write `None` when there are no findings.

## Validations Run

- command: result and covered surface

## Pending Risks

- Residual risks, uncertainties, or evidence gaps; `None` when none remain.

## User Summary

Overall status, unverified boundaries, blockers, next decision, or recommended
action. Do not claim corrections were applied: this skill never modifies files.
```

When the context does not allow a boundary to be audited, explain what evidence is
missing and what the user or a future validation would need to provide. If an
incompatibility requires a design decision, retain `BLOCKED` even when the other
boundaries pass.
