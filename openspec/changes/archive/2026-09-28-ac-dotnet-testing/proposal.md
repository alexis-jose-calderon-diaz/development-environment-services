# Proposal

## Why

The repository lacks a public skill that establishes clear conventions for creating xUnit tests. Without a shared guide, test projects end up with inconsistent structure, unclear organization, and patterns that are hard to maintain. This skill fills that gap by providing a complete, framework-agnostic guide for both unit and integration tests.

## What Changes

- New public skill `ac-dotnet-testing` under `skills/ac-dotnet-testing/SKILL.md`
- Covers both unit tests and integration tests with xUnit
- Defines separate test project structure (`<Project>.UnitTests`, `<Project>.IntegrationTests`)
- Establishes core principles: one test per file, self-contained tests, extend-don't-duplicate
- Introduces vertical slice organization for integration tests (per feature, not per layer)
- Includes code examples, patterns (arrange-act-assert), and anti-patterns
- Framework-agnostic: no specific assertion or mocking library recommendations

## Capabilities

### New Capabilities

- `dotnet-testing`: Conventions and patterns for creating xUnit test projects, covering structure, organization, and coding patterns for both unit and integration tests

### Modified Capabilities

<!-- No existing capabilities are being modified -->

## Impact

- New versioned public skill installable via `npx skills add <repository> --skill ac-dotnet-testing --global`
- No impact on existing code, services, or configurations
- Establishes a reusable reference for any .NET project using xUnit
