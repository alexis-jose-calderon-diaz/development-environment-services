## 1. Actualizar el protocolo de continuacion

- [x] 1.1 Actualizar la subseccion de `HANDOFF` en `integrations/opencode/AGENTS.md` para conservar la regla `HANDOFF => nueva sesion hija`, omitir `task_id` y mantener terminal la sesion agotada; verificar por inspeccion que la continuacion normal sin HANDOFF conserve su comportamiento.
- [x] 1.2 Definir en la misma subseccion el paquete compacto para la nueva sesion, incluyendo el objetivo delegado original, `Completed`, `Remaining`, `Decisions`, archivos relevantes, riesgos, `Verification`, `Next action` y restricciones parentales; verificar que no se reduzca el HANDOFF a un mensaje generico ni se copie la conversacion completa.
- [x] 1.3 Documentar la verificacion dirigida del estado actual, la autoridad del repositorio y la regla de no repetir trabajo completado salvo discrepancia; verificar que el texto cubra tanto conocimiento no persistido de workers exploratorios como progreso y decisiones de workers de implementacion.
- [x] 1.4 Documentar HANDOFF encadenados mediante estado rolling compacto y conservar el objetivo original estable; verificar que el texto prohiba anidar historiales completos y mantenga el alcance de cada continuacion.

## 2. Validar alcance y contrato

- [x] 2.1 Revisar el diff y ejecutar `git diff --check`; verificar que el unico archivo de implementacion modificado sea `integrations/opencode/AGENTS.md` y que no haya cambios en plugin, agentes, comandos, skills, `opencode.jsonc`, codigo fuente ni tests.
- [x] 2.2 Ejecutar `openspec validate --specs` y contrastar el protocolo actualizado con todos los escenarios de la delta spec; verificar que los artifacts de planificacion sigan completos y que el cambio quede listo para `/opsx-apply` sin iniciar implementacion.
