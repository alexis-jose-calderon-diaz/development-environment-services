---
name: ac-dotnet-clean-architecture
description: Recommend or assess a .NET solution structure using strict Clean Architecture. Activate when a user asks which projects a .NET solution should contain, what each project owns, or which project references are allowed. Focus only on solution-level project boundaries and dependencies; do not broaden into source-code implementation or internal project organization.
compatibility: Requires an agent that can read solution and project files when inspecting an existing repository. Inspection is read-only by contract, not runtime permission isolation.
---

# .NET Clean Architecture

Recommend a strict Clean Architecture project map for a .NET solution. Describe only solution projects, their responsibilities, and the direction of project references. Adapt the entry-point role to the application already present; do not invent observed projects.

## When to Use

- The user asks for a .NET solution layout based on Clean Architecture.
- The user asks which .NET projects should exist, what each project is responsible for, or how project references should be directed.
- The user asks whether an existing `.sln`, `.slnx`, or set of `.csproj` project references follows Clean Architecture.

## When Not to Use

- The request is about implementing application behavior or organizing code inside a project.
- The request asks for an architecture other than Clean Architecture.

## Workflow

1. **Scope the request.** Identify whether the user wants a conceptual layout or an assessment of a repository. Keep the task limited to solution projects and their relationships.
2. **Inspect an existing solution read-only.** Find relevant `.sln` or `.slnx` files and the included `.csproj` files. Read project names and explicit project references only. Do not modify files. Separate observed projects and references from recommendations. If metadata is unavailable, state that limitation rather than inferring the current graph.
3. **Choose the project roles.** Use the four roles below as the strict baseline. Match the entry-point name to the existing application (for example, `Api`, `Web`, `Worker`, or `Desktop`) without adding unrelated layers.
4. **Apply the reference rules.** Show references from the referencing project to the project it references. Keep inner projects independent of outer layers. The entry point may reference Infrastructure only for composition at startup; its application-facing behavior depends on Application.
5. **Return only the bounded architecture map.** Use the output contract below in the user's requested language. Do not include source-code examples, implementation procedures, or subjects beyond the solution projects and their relationships.

## Canonical Project Roles

| Project role | Responsibility | Project references |
| --- | --- | --- |
| `*.Domain` | Core business model and rules | None |
| `*.Application` | Application use cases and inward-facing contracts | `*.Domain` |
| `*.Infrastructure` | External technology integrations and implementations of inward-facing contracts | `*.Application`; `*.Domain` only when it directly uses Domain types |
| `*.Api` / `*.Host` | Application entry point and dependency composition | `*.Application`; `*.Infrastructure` only from the composition root |

Use the repository's established naming where present. The entry-point role may be `Api`, `Web`, `Worker`, `Desktop`, or another actual host; this changes its name, not the dependency rule.

## Dependency Rules

- `Application -> Domain` is allowed.
- `Infrastructure -> Application` is allowed. `Infrastructure -> Domain` is allowed only when Infrastructure directly uses Domain types.
- `Api/Host -> Application` is allowed.
- `Api/Host -> Infrastructure` is allowed only as the startup composition-root reference. The entry point's application-facing behavior must not depend on Infrastructure.
- `Domain` must not reference Application, Infrastructure, or the entry point.
- `Application` must not reference Infrastructure or the entry point.
- `Infrastructure` must not reference the entry point.
- The entry point must not be referenced by any other application project.

Show references as compile-time project edges. Do not infer a direct reference merely because a dependency is transitively available.

## Output Contract

For a conceptual layout, return:

1. A compact solution tree containing only the proposed projects.
2. A short responsibility for each project.
3. An explicit reference graph and prohibited inward-layer violations.

For an existing solution, return:

1. The observed projects and explicit project references, separately labeled from recommendations.
2. The Clean Architecture reference violations, if any, with the project edge as evidence.
3. A target project map and allowed reference graph.

Keep the response proportional. If the user asks only for a diagram, omit explanatory sections that are not needed to understand the project graph. Do not present a proposed project as already present in the repository.
