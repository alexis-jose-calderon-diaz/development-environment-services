# Tasks

## 1. Normalize public skill content

- [x] 1.1 Translate `skills/ac-change-impact-analysis/SKILL.md`, `skills/ac-change-planning/SKILL.md`, and `skills/ac-change-review/SKILL.md` to English while preserving frontmatter, read-only boundaries, report schemas, and explicit language-selection guidance; verify each file retains its required sections and machine-readable status values.
- [x] 1.2 Translate `skills/ac-grouped-commits/SKILL.md` and `skills/ac-integration-boundary-audit/SKILL.md` to English while preserving proposal formats, boundary states, safety rules, and localized natural-language output rules; verify all required Git and audit tokens remain unchanged.
- [x] 1.3 Translate `skills/ac-release-tag-proposal/SKILL.md` and `skills/ac-pull-request/SKILL.md` to English, changing the fallback response language to English while retaining explicit requested-language behavior; verify tag commands, PR confirmation phrases, preflight constraints, and output structure remain intact.
- [x] 1.4 Keep `skills/README.md` in Spanish while preserving the seven-skill catalog, installation/update commands, external-skill distinctions, and exclusion of `./.agents/`; verify every documented public skill name and command matches the existing inventory.

## 2. Validate language and contract consistency

- [x] 2.1 Review all seven `SKILL.md` files for consistent English-first authoring and an explicit requested-language/English-default policy; verify targeted searches find no remaining Spanish instructional prose outside intentional examples or data, while excluding the intentionally Spanish README.
- [x] 2.2 Compare the translated files against the existing skill contracts and eval fixtures; verify commands, paths, identifiers, status values, required headings, safety boundaries, and eval JSON remain valid and unchanged unless a language fallback is intentionally updated.
- [x] 2.3 Run `openspec validate --specs` and the repository's available skill evaluations or static checks; verify the change delta validates and record any evaluation runner that is not configured.
- [x] 2.4 Perform a final scope review of the diff; verify only the seven public `SKILL.md` files and the OpenSpec planning artifacts are affected, with no edits to `skills/README.md`, `./.agents/`, application code, services, or dependencies.
