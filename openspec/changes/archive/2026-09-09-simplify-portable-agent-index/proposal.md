## Why

`integrations/opencode/AGENTS.md` contiene reglas comunes y un contrato detallado de delegacion, pero no ofrece una vista breve de los agentes portables disponibles. Esto dificulta entender rapidamente que rol usar y hace que la guia comun resulte mas extensa de lo necesario.

## What Changes

- **BREAKING** Simplificar `integrations/opencode/AGENTS.md` para que funcione como una guia comun breve e indice operativo del toolkit portable.
- Documentar en la guia los cinco agentes portables, su responsabilidad principal y sus limites de edicion.
- Mantener los contratos detallados, metodos y formatos de salida en `integrations/opencode/agents/*.md`, sin duplicarlos en `AGENTS.md`.
- Conservar el contexto de delegacion y las reglas de seguridad solo en el nivel minimo necesario para orientar el uso de los agentes.
- No modificar los prompts individuales, `README.md`, `opencode.jsonc` ni las superficies locales del repositorio.

## Capabilities

### New Capabilities

### Modified Capabilities

- `opencode-integration`: la guia portable debe identificar de forma concisa los agentes disponibles y orientar su seleccion sin duplicar sus contratos individuales.

## Impact

- Afecta `integrations/opencode/AGENTS.md` y la documentacion de comportamiento de la integracion portable.
- Requiere alinear la delta spec, el diseno y las tareas con los cinco agentes existentes: `analyzer`, `planner`, `implementer`, `reviewer` e `integration-checker`.
- No cambia APIs, servicios Docker, permisos runtime, prompts individuales, instalacion documentada ni configuraciones locales.
