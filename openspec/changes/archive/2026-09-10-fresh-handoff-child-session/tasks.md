## 1. Actualizar el protocolo portable

- [x] 1.1 Añadir en `integrations/opencode/AGENTS.md`, dentro de `## Delegación`, la regla normativa `HANDOFF => nueva sesión hija`, omitiendo el `task_id` del worker agotado y permitiendo repetir el tipo de agente sin reutilizar la sesión; verificar mediante inspección que no se modifiquen otros contratos.
- [x] 1.2 Documentar el paquete mínimo de continuación, la inspección del repositorio, la autoridad del estado actual, la no repetición de trabajo completado, los HANDOFF encadenados y la diferencia frente a continuaciones normales; verificar cada escenario del delta spec contra el texto resultante.

## 2. Validar el alcance

- [x] 2.1 Revisar el diff y confirmar que el único archivo modificado sea `integrations/opencode/AGENTS.md`, sin cambios en plugins, agentes, comandos, skills u `opencode.jsonc`; verificar con `git status --short` y `git diff --check`.
- [x] 2.2 Validar los artifacts y las especificaciones con `openspec validate --specs`, y confirmar mediante búsqueda dirigida que HANDOFF se trate como incompleto, no active revisión prematuramente y no solicite confirmación al usuario.
