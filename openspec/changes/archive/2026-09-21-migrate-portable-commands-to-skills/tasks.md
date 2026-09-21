# Tasks

## 1. Crear las skills públicas

- [x] 1.1 Añadir `skills/ac-release-tag-proposal/SKILL.md` con metadata
  portable, activación para releases/tags, el override único `--version`, el
  análisis de historia Git y la salida manual read-only; verificar que el
  `name` coincide con la carpeta y que no contiene `$ARGUMENTS`, `$1`,
  `agent` ni dependencias de `question`.
- [x] 1.2 Añadir `skills/ac-pull-request/SKILL.md` con los overrides de PR, el
  preflight de Git y `gh`, la generación de propuesta, la confirmación
  inequívoca, la revalidación y la publicación no forzada; verificar que no
  crea commits, no modifica el working tree y no ejecuta build, tests, lint,
  format, type-check, migraciones ni servicios.
- [x] 1.3 Añadir `evals/evals.json` para cada skill con escenarios de éxito,
  bloqueo, argumentos inválidos, estado sucio, PR existente y publicación
  confirmada; verificar que cada JSON declara el `skill_name`, prompts,
  `expected_output` y expectativas observables.

## 2. Sustituir la superficie portable y actualizar documentación

- [x] 2.1 Eliminar `integrations/opencode/commands/tag.md` y
  `integrations/opencode/commands/pr.md` sin crear wrappers ni aliases;
  verificar que ambos paths desaparecen y que no queda una copia de sus
  instrucciones en `integrations/opencode/commands/`.
- [x] 2.2 Actualizar `integrations/opencode/README.md` y
  `integrations/opencode/AGENTS.md` para retirar los commands del inventario y
  de la instalación manual, separar la instalación de skills públicas y
  conservar la distinción frente a `.opencode/` y `./.agents/`; verificar que
  la tabla de recursos y los comandos de copia describen el mismo conjunto.
- [x] 2.3 Actualizar `README.md` y `skills/README.md` con
  `ac-release-tag-proposal` y `ac-pull-request`, sus descripciones, instalación
  global mediante `npx skills` y actualización selectiva; verificar que la
  instalación raíz no crea ni copia `~/.config/opencode/commands` y que no
  quedan referencias activas a `/tag`, `/pr`, `commands/tag.md` o
  `commands/pr.md`.

## 3. Validar contratos, documentación y comportamiento

- [x] 3.1 Revisar las dos `SKILL.md`, los README y el diff de la integración
  contra el delta `opencode-integration`; verificar metadata, nombres,
  triggers, límites de permisos, formatos de salida, ausencia de referencias
  específicas de OpenCode y preservación de `opencode.jsonc`.
- [x] 3.2 Ejecutar `openspec validate --specs` desde la raíz y corregir solo
  inconsistencias de artifacts o referencias introducidas por este cambio;
  verificar que la validación termina correctamente sin aplicar cambios a
  servicios ni ejecutar operaciones Git de escritura.
- [x] 3.3 Ejecutar las evaluaciones de ambas skills con repositorios fixture y
  una implementación de `gh` simulada o un remote de prueba aislado; verificar
  la selección de base y clasificación del tag, los bloqueos de PR, la espera
  de confirmación, la revalidación y el informe de fallo parcial sin crear tags
  ni publicar en el remote real.
- [x] 3.4 Revisar el estado y el diff final limitado a las rutas del cambio;
  verificar que no se modificaron `services/`, `opencode.jsonc`, `.opencode/`,
  `./.agents/`, APIs, datos persistentes ni la configuración operativa bajo
  `~/.config/opencode/`.
