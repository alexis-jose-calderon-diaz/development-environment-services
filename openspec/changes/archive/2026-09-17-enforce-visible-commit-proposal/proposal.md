## Why

El comando `/commit` exige mostrar una propuesta detallada antes de pedir confirmación, pero el límite entre la propuesta visible y la llamada a `question` no está marcado de forma inequívoca. En algunas ejecuciones el usuario recibe la confirmación sin poder identificar con seguridad que el plan completo fue emitido, especialmente cuando contiene muchas rutas.

## What Changes

- Añadir un marcador final obligatorio a la propuesta visible de commits.
- Establecer que la llamada a `question` ocurre después de emitir ese marcador.
- Mantener la lista completa de archivos en la propuesta visible y evitar duplicarla en el contenido de `question`.
- No definir un comportamiento adicional para el caso en que el marcador no sea visible; la decisión queda abierta al modelo según el contexto de ejecución.

## Capabilities

### New Capabilities

### Modified Capabilities

- `opencode-integration`: el requisito de propuesta y confirmación del comando `/commit` incorpora una señal explícita de finalización visible antes de `question`.

## Impact

- `integrations/opencode/commands/commit.md` deberá reflejar el nuevo cierre de la propuesta y el orden de la confirmación.
- La especificación principal de `opencode-integration` recibirá un delta sobre la interfaz visible de `/commit`.
- No cambian las operaciones Git, la agrupación de archivos, los mensajes de commit ni las opciones de confirmación.
- La copia operativa en `~/.config/opencode/commands/commit.md` requerirá sincronización manual durante la implementación, fuera de este cambio de planificación.
