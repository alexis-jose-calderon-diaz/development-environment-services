## Why

Cuando un worker devuelve `## HANDOFF` por agotamiento de contexto, el orquestador puede reutilizar su `task_id` y reanudar una sesión agotada. Esto puede repetir el límite duro y bloquear la continuación; el protocolo portable debe distinguir esa situación de una continuación normal.

## What Changes

- Añadir a la guía portable un protocolo explícito para tratar un HANDOFF de presupuesto como trabajo incompleto.
- Exigir una nueva `Task` sin el `task_id` del worker agotado para cada continuación por HANDOFF.
- Definir el paquete mínimo de continuación: objetivo original, HANDOFF completo y restricciones parentales necesarias.
- Exigir inspeccionar el estado actual del repositorio y evitar repetir trabajo completado salvo que falte o sea incorrecto.
- Mantener la reutilización de una sesión existente para seguimientos normales que no sean HANDOFF.
- Soportar HANDOFF encadenados sin iniciar revisión ni declarar éxito antes de una finalización normal.

## Capabilities

### New Capabilities

### Modified Capabilities

- `opencode-integration`: definir la coordinación portable de continuaciones después de un HANDOFF de contexto.

## Impact

- Se modifica únicamente `integrations/opencode/AGENTS.md`.
- No se modifican el plugin de presupuesto, los agentes, `opencode.jsonc`, comandos ni skills.
- No se añaden APIs, dependencias ni cambios en la generación de HANDOFF; solo se documenta el comportamiento del orquestador que lo recibe.
