## Why

El command `/commit` recibe `$ARGUMENTS` como texto plano, pero actualmente describe `--staged` en muchas partes del propio prompt sin delimitar claramente la invocación real. Esto puede hacer que el agente confunda una mención normativa con la opción efectivamente recibida y seleccione el modo incorrecto antes de ejecutar operaciones Git.

## What Changes

- **BREAKING** Definir una sintaxis determinista en la que `--staged` solo sea válido como primer token de la invocación.
- Establecer el modo a partir del primer argumento real antes de ejecutar cualquier operación Git.
- Rechazar opciones desconocidas o tokens posteriores que comiencen por `-` sin analizar ni modificar el repositorio.
- Delimitar los argumentos reales de la documentación del command y usar `modo staged` o `modo working-tree` en las reglas posteriores.
- Mantener el comportamiento existente del modo staged: un único commit con el contenido exacto del index y sin incluir cambios fuera del index.

## Capabilities

### New Capabilities

<!-- No se introduce una capacidad nueva. -->

### Modified Capabilities

- `opencode-integration`: precisar el contrato de argumentos y la selección del modo del command portable `/commit`.

## Impact

- Afecta la especificación y el prompt portable de `integrations/opencode/commands/commit.md`.
- Afecta únicamente la interpretación de los argumentos de `/commit`; no cambia las operaciones Git permitidas, la confirmación explícita, el análisis de secretos ni la agrupación de commits.
- La copia instalada en `~/.config/opencode/commands/commit.md` debe mantenerse sincronizada cuando se implemente el cambio.
- No introduce dependencias, APIs ni cambios en el repositorio consumidor.
