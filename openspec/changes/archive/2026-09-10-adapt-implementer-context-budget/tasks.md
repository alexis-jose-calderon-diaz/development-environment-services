## 1. Protocolo del agente

- [x] 1.1 Añadir una sección cohesionada en `integrations/opencode/agents/implementer.md` para reconocer únicamente `[context-handoff:budget]:SOFT` y `[context-handoff:budget]:HARD`, prohibir la contabilidad propia de tokens y conservar el ciclo normal; verificar la presencia literal de ambas señales y de la regla de ownership.
- [x] 1.2 Definir el modo SOFT y la precedencia inmediata de HARD sobre implementación, exploración, validación y la salida normal; verificar que SOFT no obliga a HANDOFF y que HARD prohíbe nuevas herramientas, incluyendo reintentos tras `CONTEXT_BUDGET_HARD_STOP`.

## 2. Salida de continuidad

- [x] 2.1 Documentar el HANDOFF con un único encabezado superior `## HANDOFF`, las ocho secciones requeridas y estado durable conciso; verificar que exige separar trabajo persistido, pendientes accionables, estados `PASSED`/`FAILED`/`NOT RUN` y una sola `Next action`.

## 3. Alcance y validación

- [x] 3.1 Revisar el diff del agente contra el contrato existente y verificar que se conservan responsabilidades, límites, convenciones, validación, seguridad, permisos y el formato normal `# Implementation Result`.
- [x] 3.2 Confirmar que solo `integrations/opencode/agents/implementer.md` queda previsto para implementación y ejecutar `git diff --check`; verificar que no hay cambios en el plugin, orquestador, `AGENTS.md` ni otros agentes.
- [x] 3.3 Ejecutar `openspec validate --specs` y verificar que la delta de `opencode-integration` y las specs existentes validan sin errores.
