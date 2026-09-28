# Design

## Context

See `proposal.md` for motivation and `specs/opencode-integration/spec.md` for the observable contract. Public skills live under `skills/<name>/SKILL.md`, use English for their authoring text, and respond in the requested language. `skills/README.md` is the public catalog and installation source; this repository contains no .NET consumer solution to modify.

## Goals / Non-Goals

**Goals:**
- Make architecture advice stable across new and existing .NET solutions while distinguishing observed projects from proposed ones.
- Express the direction of references and the composition-root exception without implying that outer projects may be referenced by inner projects.

**Non-Goals:**
- Prescribe internal folders, types, patterns within projects, source files, commands or code generation.
- Extend the architecture output to quality assurance or additional architectural styles.

## Decisions

### 1. One public skill with a narrow trigger

Create `skills/ac-dotnet-clean-architecture/SKILL.md` with frontmatter that activates on requests to organize a .NET solution into Clean Architecture projects and their references. The skill is advisory and read-only: inspect only relevant solution/project metadata if a repository is available, and describe a conceptual example when none is available. A broad .NET coding skill was rejected because it would invite implementation advice outside the agreed boundary.

### 2. Canonical project map and dependency contract

Use Domain, Application, Infrastructure, and a Presentation/Host entry-point project as conceptual roles, with names adapted to the user's solution. Domain has no project references; Application references Domain; Infrastructure references Application (and Domain only where its contracts or model require it); Presentation/Host references Application and may reference Infrastructure solely for composition at startup. Inward layers never reference outer layers. If there are several entry points, identify each entry point without inventing unrelated project roles. The alternative of listing arbitrary cross-layer references is rejected because it weakens the strict Clean Architecture boundary.

### 3. Bounded output contract

Return a compact solution tree of projects, a responsibility summary, and an explicit permitted/forbidden reference map or ASCII diagram; clearly label what was observed versus proposed. Do not include internal directories/classes, implementation snippets, shell commands, alternative architectures, or the excluded topic in the generated response. Keep the skill definition free of examples that introduce excluded project kinds. This avoids drifting from solution structure into a full application template.

### 4. Documentation and maintenance checks

Add the eighth skill to the catalog row and installation command without changing `integrations/`, `.agents/`, or the root README, which already links to the catalog. Add evaluation prompts for a new solution, an existing solution with an outward reference, and strict output-boundary compliance, using the established `evals/evals.json` format. These scenarios validate the skill but do not appear in its architectural recommendations.

## Risks / Trade-offs

- [Canonical four-role outline may overstate needs of a small application] -> label it as the target architecture, not evidence that all projects already exist.
- [A host-to-infrastructure reference could be mistaken for a domain dependency] -> describe it explicitly as composition-only; never allow references from Domain or Application to Infrastructure.
- [An existing solution might lack readable project metadata] -> mark its current references as unverified rather than claim an observed state.

## Migration Plan

This is additive: publish the new skill and catalog entry together, then validate the change and review the skill's scenarios. Existing skill names and installations remain unchanged; rollback removes the new skill and catalog entry and reverts the inventory requirement.
