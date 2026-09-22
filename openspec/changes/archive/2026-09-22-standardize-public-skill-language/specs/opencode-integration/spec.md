# Spec Delta

## ADDED Requirements

### Requirement: English-first language for public skill content

Each public `skills/<name>/SKILL.md` SHALL use English as the default authoring language for explanatory prose, frontmatter descriptions, headings, instructions, and output templates. The public catalog `skills/README.md` MAY remain Spanish. Skill names, commands, identifiers, status values, required section labels, and other language-independent contract tokens MAY retain their established form.

#### Scenario: Public skill content is standardized

- **WHEN** a user or maintainer reads any of the seven versioned skill definitions
- **THEN** the explanatory content is consistently written in English without changing the skill names, installation commands, safety boundaries, or behavioral contracts

#### Scenario: Public catalog language is preserved

- **WHEN** a user or maintainer reads `skills/README.md`
- **THEN** the catalog remains in Spanish and its documented names, commands, and surface boundaries are unchanged

#### Scenario: Language-independent contract tokens are preserved

- **WHEN** the content is translated or normalized
- **THEN** CLI commands, paths, identifiers, Conventional Commits types, status values, and required machine-readable section labels retain the exact forms needed for operation and validation

### Requirement: Consistent default language for generated skill responses

Public skills SHALL generate natural-language responses in the user's explicitly requested language when one is provided. When the request does not establish a language, the skills SHALL use English by default. This language policy SHALL NOT alter language-independent tokens or safety and workflow requirements.

#### Scenario: User requests a non-English response

- **WHEN** the user explicitly asks to use a particular language for the skill response
- **THEN** the natural-language response uses that language while preserving required identifiers, commands, status values, and normative tokens

#### Scenario: User does not specify a response language

- **WHEN** the user invokes a public skill without establishing a response language
- **THEN** the natural-language response is written in English

#### Scenario: Existing language-specific output contract remains compatible

- **WHEN** a skill produces Conventional Commits text or another structured output with language-independent fields
- **THEN** only the natural-language portions follow the selected language and the required type, field names, commands, and structural markers remain unchanged
