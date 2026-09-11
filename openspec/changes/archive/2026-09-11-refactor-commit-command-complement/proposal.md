## Why

El command portable `/commit` duplica gran parte de la skill externa `git-commit` y, al mismo tiempo, no expresa con suficiente precisión varias políticas locales de selección, agrupación, confirmación y seguridad. Esto dificulta mantener una única fuente para las capacidades generales de commits y deja ambiguas reglas críticas del workflow.

## What Changes

- Refactorizar únicamente `integrations/opencode/commands/commit.md` para tratar `git-commit` como base y añadir solo la orquestación y las restricciones específicas del workflow.
- Eliminar duplicaciones reales de Conventional Commits, tipos, breaking changes, análisis general y mecánica general de commit cuando no aporten una política local.
- Mantener explícitamente la selección `working-tree` frente a `--staged`, el preflight Git, el análisis progresivo, la agrupación por intención y el staging por grupos completos.
- Formalizar una propuesta de commits con formato exacto, mensajes en español, rutas y estados Git estables, pendientes y advertencias.
- Requerir comprobación de cambios concurrentes, confirmación mediante `question` y verificación posterior a cada commit.
- Endurecer la política de secretos: no ofrecer autorización para incluir valores sospechosos; excluirlos en working tree y detener el modo `--staged` para que el usuario corrija el index manualmente.
- Preservar hooks, firma y las restricciones Git locales, sin permitir `--no-verify`, amend ni validaciones del proyecto.
- **BREAKING**: cambiar el contrato textual del command para que `/commit` prevalezca sobre comportamientos genéricos de la skill cuando el workflow local sea más restrictivo.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `opencode-integration`: convertir el command `commit` en una extensión explícita de la skill externa `git-commit`, conservando sus capacidades generales y definiendo las políticas locales de selección, agrupación, staging, seguridad, confirmación y verificación.

## Impact

- `integrations/opencode/commands/commit.md` será el único archivo de configuración portable modificado.
- `.agents/skills/git-commit/SKILL.md` y `/home/dev/.agents/skills/git-commit/SKILL.md` permanecerán sin cambios.
- No se modificarán APIs, servicios, código de producto ni la instalación externa de la skill.
- La validación se limitará a revisar el command, comparar sus responsabilidades con la skill y validar los artifacts; no se ejecutarán builds, tests, lint ni commits.
