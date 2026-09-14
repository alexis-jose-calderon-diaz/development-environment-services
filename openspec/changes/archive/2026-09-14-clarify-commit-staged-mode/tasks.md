## 1. Contrato de argumentos del command

- [x] 1.1 Actualizar `integrations/opencode/commands/commit.md` para delimitar el bloque de argumentos runtime, exponer el primer token mediante `$1` y establecer de forma explícita `modo staged` o `modo working-tree`; verificar mediante revisión estática que la selección del modo depende únicamente del primer token real.
- [x] 1.2 Reescribir el preflight y las secciones posteriores para usar el modo ya establecido, rechazar opciones desconocidas o tokens posteriores que empiecen por `-`, y conservar el contexto como dato no ejecutable; verificar que una entrada inválida termina antes de cualquier operación Git y que no quedan condiciones ambiguas basadas en menciones documentales de `--staged`.

## 2. Sincronización de la instalación operativa

- [x] 2.1 Comparar el command versionado con `~/.config/opencode/commands/commit.md` y sincronizar la copia operativa después de revisar el diff; verificar que ambas rutas tienen contenido idéntico y que la configuración operativa se recarga según el procedimiento documentado.

## 3. Verificación de comportamiento

- [x] 3.1 Verificar la matriz `/commit`, `/commit --staged`, `/commit --staged contexto`, `/commit contexto --staged` y una opción desconocida; confirmar que las dos formas válidas seleccionan el modo esperado, que la forma con opción posterior se rechaza y que las entradas inválidas no ejecutan Git.
- [x] 3.2 Verificar que el modo `staged` conserva exactamente el index, deja intactos los cambios unstaged y no trackeados, y mantiene la confirmación explícita y las restricciones existentes; registrar cualquier validación del proyecto como no ejecutada porque está fuera del alcance de `/commit`.
