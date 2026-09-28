# Tasks

## 1. Public skill

- [x] 1.1 Create `skills/ac-dotnet-clean-architecture/SKILL.md` with valid frontmatter and a narrow Clean Architecture trigger; verify the name matches its directory and the content is authored in English.
- [x] 1.2 Define the four project roles, permitted and forbidden references, composition-only host-to-infrastructure reference, and bounded response shape; verify an example answer contains only the solution tree, responsibilities, and dependency relationships without the excluded topic or implementation details.
- [x] 1.3 Define read-only inspection for existing `.sln`/`.slnx` and `.csproj` files and a conceptual path when none exist; verify examples clearly separate observed and proposed projects and never invent existing references.

## 2. Catalog and specification

- [x] 2.1 Add `ac-dotnet-clean-architecture` to `skills/README.md` and its global installation command; verify the catalog includes eight public skill entries and keeps `.agents/` outside the public surface.
- [x] 2.2 Check that the delta's eight-skill inventory and new behavior match the published skill and catalog; verify the change with `openspec validate add-dotnet-clean-architecture-skill --strict` and leave synchronization with the durable spec for the later sync/archive workflow.

## 3. Maintenance validation

- [x] 3.1 Add `skills/ac-dotnet-clean-architecture/evals/evals.json` using the repository format for new-solution, existing-solution, and strict-boundary scenarios; verify the file parses as JSON and each scenario checks references and the narrow output scope.
- [x] 3.2 Validate this change with `openspec validate add-dotnet-clean-architecture-skill --strict`, inspect the final diff for unintended files or excluded content in the skill, and report any validation not run.
