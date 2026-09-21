# Tasks

## 1. Reubicar la superficie pública

- [x] 1.1 Mover `integrations/opencode/skills/` a `skills/`, conservando `README.md`, `grouped-commits/SKILL.md` y `grouped-commits/evals/evals.json`; verificar que los tres recursos existan bajo `/skills/` y que no quede un duplicado bajo `integrations/opencode/skills/`.
- [x] 1.2 Mantener intactos `./.agents/`, sus skills y `skills-lock.json`; verificar el alcance con `git diff --name-status` y una búsqueda que excluya explícitamente `./.agents/`.

## 2. Actualizar documentación e instalación

- [x] 2.1 Reescribir `skills/README.md` como catálogo de la superficie pública, distinguiendo skills versionadas y dependencias externas, declarando la exclusión de `./.agents/` y documentando `npx skills add <repositorio> --skill <name> --global` sin `--agent` ni recomendación de agente; verificar los comandos y rutas con una búsqueda dirigida.
- [x] 2.2 Actualizar `README.md` para presentar `/skills/` como recurso público independiente, eliminar la copia manual de `grouped-commits` y enlazar su instalación mediante `npx skills`; verificar que la sección de instalación no recomiende `opencode` ni apunte a `integrations/opencode/skills/`.
- [x] 2.3 Actualizar `integrations/opencode/README.md` para retirar la skill de la tabla y del script de copia manual, enlazar el catálogo público raíz y documentar que `integrations/opencode/` conserva solo su configuración portable; verificar que la sincronización manual restante cubra agents, commands, plugins y configuración.
- [x] 2.4 Actualizar `AGENTS.md` y cualquier referencia activa necesaria para dejar explícita la separación entre `/skills/`, `integrations/opencode/` y `./.agents/`; verificar que no queden instrucciones operativas que traten `./.agents/` como superficie pública.

## 3. Alinear especificación y contrato de sincronización

- [x] 3.1 Revisar la documentación final contra el delta de `opencode-integration`, incluyendo la ruta pública `skills/<name>/SKILL.md`, el comando global `npx skills add`, la actualización `npx skills update <name> --global` y la selección neutral de agentes; verificar cada escenario mediante revisión textual dirigida.
- [x] 3.2 Confirmar que la documentación de sincronización manual no ejecuta ni recomienda instalar skills y que las instrucciones de `npx skills` no usan el alcance de proyecto; verificar con búsquedas separadas para `--global`, `--agent`, `./.agents/` y `integrations/opencode/skills/`.

## 4. Validación de la migración

- [x] 4.1 Validar el cambio OpenSpec con `openspec validate "move-skills-to-public-root" --type change --strict`, y validar las especificaciones con `openspec validate --specs`.
- [x] 4.2 Ejecutar `git diff --check` y revisar `git status --short`; verificar que el diff solo incluya la reubicación pública, documentación y artifacts del cambio, sin modificaciones en `./.agents/`, `skills-lock.json` o servicios Docker.
