# Tasks

## 1. Crear la skill portable de commits

- [x] 1.1 Añadir `integrations/opencode/skills/grouped-commits/SKILL.md` con metadata mínima, descripción de activación y cuerpo independiente de OpenCode; verificar que `name` coincide con la carpeta y que no contiene `$ARGUMENTS`, `$1`, `agent` ni `question`
- [x] 1.2 Documentar en la skill la selección implícita del index, la agrupación por intención, los límites ante hunks mixtos, la política de mensajes y las reglas de seguridad; verificar mediante revisión dirigida que cada requisito añadido tiene una instrucción correspondiente
- [x] 1.3 Documentar la propuesta completa, las decisiones `Crear commits`, `Ajustar propuesta` y `Cancelar`, la revalidación, el staging explícito y la verificación secuencial; verificar que no existe ninguna operación de escritura antes de la aprobación

## 2. Sustituir el command y actualizar la instalación

- [x] 2.1 Eliminar `integrations/opencode/commands/commit.md` sin modificar `pr.md`, `tag.md` ni los cambios ajenos del worktree; verificar el estado y el diff limitado a las rutas autorizadas
- [x] 2.2 Actualizar `integrations/opencode/README.md` para incluir la skill propia como recurso versionado, documentar su destino global y retirar la copia del command eliminado; verificar que la tabla y la instalación manual describen el mismo conjunto
- [x] 2.3 Actualizar `integrations/opencode/skills/README.md` y el `README.md` raíz para distinguir la skill propia del catálogo externo y eliminar la dependencia obligatoria de `git-commit`; verificar que no quede una instrucción que requiera `/commit` o una skill externa para este flujo

## 3. Revisar coherencia y validar artifacts

- [x] 3.1 Releer la skill, los README y el diff completo del cambio para confirmar que la documentación, el comportamiento staged implícito y el diseño no se contradicen; verificar también que `integrations/opencode/opencode.jsonc` y `.prettierrc.json` permanecen fuera del cambio
- [x] 3.2 Ejecutar `openspec validate --specs` y corregir únicamente inconsistencias de los artifacts de este cambio; verificar que la validación termina correctamente sin ejecutar commits ni validaciones del proyecto
- [x] 3.3 Revisar la instalación manual resultante y confirmar que la skill puede copiarse a `~/.config/opencode/skills/grouped-commits/SKILL.md` y que el rollback documentado no requiere operaciones Git destructivas
