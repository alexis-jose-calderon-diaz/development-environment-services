# Proposal

## Why

La integración portable mantiene cinco agentes personalizados con contratos, permisos y coordinación orientados a delegaciones internas. Se quiere operar únicamente con skills reutilizables por el agente principal, conservando los flujos que aportan utilidad directa y eliminando la complejidad de roles, ownership y HANDOFF que no puede trasladarse de forma equivalente a una skill.

La migración debe hacerse antes de eliminar los agentes para validar que el análisis de impacto, la planificación, la revisión y la auditoría de fronteras siguen siendo útiles como workflows iniciados por el usuario.

## What Changes

- Crear skills públicas versionadas para análisis de impacto, planificación de ejecución, revisión de cambios y auditoría read-only de fronteras de integración.
- Rediseñar esos flujos para que sean autosuficientes cuando se carguen desde una petición del usuario y no dependan de un prompt de orquestador, un `Analysis Report` previo ni un `Scope` delegado implícito.
- Conservar como instrucciones de las skills la disciplina de contexto mínimo, evidencia, alcance, validación y separación entre hallazgos confirmados e incertidumbres.
- No crear una skill equivalente a `implementer`: su ownership de archivos, permisos de edición, atomicidad de la subtarea y protocolo de presupuesto pertenecen a la delegación y no tienen una sustitución segura como skill.
- Convertir `integration-checker` únicamente en una auditoría read-only; no trasladar su capacidad de corregir archivos automáticamente.
- Retirar los cinco agentes personalizados de `integrations/opencode/agents/` después de validar las skills.
- Retirar o simplificar las reglas de `AGENTS.md`, la documentación de instalación y el soporte de `HANDOFF` que solo exista para los agentes eliminados.
- Actualizar el catálogo público y la documentación para distinguir las nuevas skills de la configuración portable restante y de la superficie interna `./.agents/`.
- **BREAKING**: la instalación portable dejará de proporcionar los agentes personalizados `analyzer`, `planner`, `implementer`, `reviewer` e `integration-checker`; las skills no ofrecerán aislamiento de permisos equivalente al de esos agentes.

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `opencode-integration`: sustituye los agentes portables personalizados por skills públicas autosuficientes, elimina la dependencia contractual de delegación y redefine la integración read-only como auditoría de fronteras; también actualiza la instalación y documentación portable.
- `context-budget-plugin`: retira la protección de presupuesto y el protocolo `HANDOFF` del plugin portable, porque ambos dependen de los workers personalizados que serán eliminados.

## Impact

- `integrations/opencode/agents/*.md`: archivos de agentes que dejarán de formar parte de la instalación portable.
- `integrations/opencode/AGENTS.md` y `integrations/opencode/README.md`: reglas, índice e instrucciones de sincronización que actualmente describen agentes y HANDOFF.
- `integrations/opencode/plugins/context-handoff.ts`: plugin portable que será retirado junto con el contrato de presupuesto y `HANDOFF` de los agentes personalizados.
- `skills/`: nuevas skills públicas y su catálogo.
- `openspec/specs/opencode-integration/spec.md`: requisitos sobre agentes, skills, documentación portable y continuidad de contexto.
- Configuración global instalada bajo `~/.config/opencode/`: los usuarios deberán sincronizar una distribución sin los agentes eliminados y cargar las skills mediante el mecanismo público correspondiente.
