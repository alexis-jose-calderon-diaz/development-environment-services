## Why

El comando portable `commit` procesa actualmente los cambios staged de forma
automática, aunque el usuario no haya indicado que desea trabajar con el index.
Esto puede mezclar dos intenciones operativas: preparar commits desde el
working tree o confirmar una selección staged ya existente. El comando necesita
modos explícitos y un análisis inicial más breve para que el alcance elegido sea
predecible sin perder sus controles de seguridad.

## What Changes

- **BREAKING**: bloquear `/commit` cuando exista cualquier cambio staged, sin
  hacer staging ni analizar el index para crear un commit.
- Añadir `--staged` como modo explícito para crear un único commit con todo el
  contenido staged del index.
- En `/commit --staged`, ignorar y dejar intactos los cambios unstaged y no
  trackeados; bloquear si no existe contenido staged.
- Mantener la agrupación semántica de uno o más commits para el modo normal del
  working tree cuando no haya cambios staged.
- Reconocer únicamente `--staged` como opción; conservar el texto sin opciones
  como contexto y rechazar opciones desconocidas sin modificar Git.
- Reducir el análisis inicial a estado, rutas y estadísticas, reservando la
  inspección detallada del diff para ambigüedades reales o señales de seguridad.
- Conservar la confirmación explícita, la ejecución de hooks, la revisión de
  rutas sospechosas y las restricciones contra operaciones destructivas.

## Capabilities

### New Capabilities

### Modified Capabilities

- `opencode-integration`: modifica el contrato del comando portable `commit`
  para separar explícitamente el modo working tree del modo index y limitar la
  profundidad inicial de su análisis.

## Impact

- `integrations/opencode/commands/commit.md` cambiará su interfaz de argumentos,
  preflight, selección de alcance, análisis y reglas de creación de commits.
- La instalación global deberá sincronizar manualmente el comando actualizado
  desde el respaldo versionado a `~/.config/opencode/commands/commit.md`.
- Los consumidores que invoquen `/commit` con cambios staged deberán usar
  `/commit --staged` o preparar el index de otra forma.
- No se añaden dependencias ni se modifican archivos del proyecto consumidor,
  hooks, configuración Git o refs durante el comando.
