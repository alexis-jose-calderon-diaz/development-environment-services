## Why

El comando portable `tag` mezcla la revisión de commits con un análisis amplio del proyecto, políticas externas y demasiadas reglas de salida. Esto dificulta predecir la propuesta y produce respuestas abrumadoras cuando el objetivo principal es resumir la evolución desde el último tag.

## What Changes

- Reducir el comando a un único argumento opcional: `--version <versión>`.
- Eliminar las opciones `--base`, `--strict`, `--prerelease` y `--stable`.
- Seleccionar automáticamente el último tag alcanzable como base; si no existe ninguno, analizar toda la historia disponible usando `v0.0.0` como base virtual para el primer cálculo.
- Limitar la evidencia a los commits y diffs del rango analizado, sin revisar el proyecto completo ni depender de su política general de versionado.
- Clasificar la versión por el impacto de adaptación para el usuario, no por la cantidad, tipo o tamaño del código.
- Garantizar como mínimo un `PATCH` cuando exista código de producto en los cambios; la documentación pura no genera tag.
- Permitir que `--version` fije exactamente el tag propuesto sin recalcularlo.
- Reducir la salida a una propuesta breve, un resumen de cambios y un único comando de creación manual del tag.
- Mantener la creación y publicación del tag fuera del comando.

## Capabilities

### New Capabilities

### Modified Capabilities

- `opencode-integration`: modifica el comportamiento y la interfaz del comando global portable `tag` para producir propuestas de tags más acotadas y predecibles.

## Impact

- `integrations/opencode/commands/tag.md` cambiará sus argumentos, reglas de selección de base, análisis de cambios, clasificación de impacto y formato de salida.
- Los consumidores del comando dejarán de usar `--base`, `--strict`, `--prerelease` y `--stable`; `--version` será el único argumento soportado.
- No se añaden dependencias ni se ejecutan operaciones Git de escritura, publicación o modificación del working tree.
