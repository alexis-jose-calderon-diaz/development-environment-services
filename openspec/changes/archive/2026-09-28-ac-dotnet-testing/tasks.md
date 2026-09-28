# Tasks

## 1. Skill Structure

- [x] 1.1 Create `skills/ac-dotnet-testing/` directory and verify the path exists
- [x] 1.2 Create `skills/ac-dotnet-testing/SKILL.md` with proper frontmatter (name, description) and verify the file is valid markdown

## 2. Project Structure Section

- [x] 2.1 Document separate test project naming convention (`<Project>.UnitTests`, `<Project>.IntegrationTests`) and verify the section is present in SKILL.md
- [x] 2.2 Add folder structure examples with one uniquely named test file per case and verify they match the spec

## 3. Unit Test Patterns

- [x] 3.1 Document exactly one test case/method per file with subject-and-scenario naming examples and verify each example file has a single case
- [x] 3.2 Add an arrange-act-assert example containing exactly one test case and verify the example compiles conceptually
- [x] 3.3 Document self-contained test principle (no shared fixtures) and verify the section is present

## 4. Integration Test Patterns

- [x] 4.1 Document vertical slice organization by feature (not by layer) and verify the section is present
- [x] 4.2 Add an example of one cross-layer integration scenario (API + service + repository + DB) in its own test file and verify it is clear
- [x] 4.3 Document that properties added to the same scenario extend its existing case, while distinct behavior gets its own file; verify the rule is consistent with one case per file

## 5. Framework-Agnostic Guidance

- [x] 5.1 Document multiple assertion library options (xUnit.Assert, FluentAssertions, Shouldly) without recommending one and verify the section is present
- [x] 5.2 Document multiple mocking library options (Moq, NSubstitute, FakeItEasy) without recommending one and verify the section is present

## 6. Anti-Patterns and Examples

- [x] 6.1 Add anti-patterns section (shared mutable state, execution-order dependencies, multiple behaviors per test) and verify the section is present
- [x] 6.2 Add concrete code examples for common scenarios and verify they are consistent with the patterns section

## 7. Validation

- [x] 7.1 Verify SKILL.md follows the repository's public skill conventions (English, frontmatter, self-contained) and verify compliance
- [x] 7.2 Verify the skill is discoverable in `skills/README.md` or equivalent catalog and verify it appears correctly
