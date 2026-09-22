# Proposal

## Why

The public skills currently mix Spanish and English across frontmatter, instructional prose, headings, and output guidance. This makes the portable catalog less predictable to maintain and leaves the default response language inconsistent between skills.

## What Changes

- Translate the instructional content, frontmatter descriptions, headings, and output templates of the seven public `skills/<name>/SKILL.md` files to English.
- Keep `skills/README.md` in its existing Spanish language; preserve its public catalog, installation commands, and surface boundaries.
- Establish English as the default language for generated natural-language responses when the user does not specify a language.
- Make generated responses follow the user's requested language when one is specified.
- Preserve language-independent tokens and contracts such as skill names, CLI commands, Conventional Commits types, status values, and required section identifiers.
- Keep evaluation prompts as test data and exclude the internal `./.agents/` surface from this change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `opencode-integration`: standardize the language of public skill content and define a consistent default/requested-language policy for skill responses.

## Impact

- Affected portable skill instructions under `skills/<name>/SKILL.md`.
- `skills/README.md` remains unchanged and Spanish.
- Affected observable response-language behavior for public skills, especially the current Spanish default in `ac-pull-request`.
- No application code, Docker services, external APIs, or runtime dependencies are changed.
- Existing behavior and safety contracts remain unchanged apart from language selection.
