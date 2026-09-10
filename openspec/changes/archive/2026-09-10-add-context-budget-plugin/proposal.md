## Why

Los workers de OpenCode pueden acercarse al límite de contexto sin una señal
runtime confiable y pueden consumir más contexto mediante nuevas herramientas.
Un plugin local permitirá detectar esa presión por sesión y comunicarla antes
de que el worker pierda capacidad de continuar de forma segura.

## What Changes

- Añadir el plugin portable `integrations/opencode/plugins/context-handoff.ts` para mantener el presupuesto de contexto por `sessionID`.
- Clasificar cada sesión en `NORMAL`, `SOFT` o `HARD` usando métricas de tokens reportadas por OpenCode y una estimación acotada de resultados de herramientas aún no reflejados.
- Inyectar instrucciones del sistema para los estados `SOFT` y `HARD`, solicitando un `## HANDOFF` únicamente como salida textual del worker.
- Bloquear llamadas posteriores a herramientas para workers hijos que hayan alcanzado `HARD`, sin bloquear su respuesta textual final.
- Configurar límites y agentes monitorizados mediante valores centralizados y variables de entorno, con validación estricta de límites inválidos.
- Limpiar o rebasar el estado ante eliminación o compactación de una sesión.
- Mantener fuera de alcance la creación de subagentes, la continuación automática, la compactación y cualquier modificación de agentes, prompts, comandos, skills u orquestación.

## Capabilities

### New Capabilities

- `context-budget-plugin`: Detección, señalización y protección del presupuesto de contexto por sesión de OpenCode.

### Modified Capabilities

<!-- No se modifican requisitos de la integración portable global. -->

## Impact

- Código nuevo en `integrations/opencode/plugins/context-handoff.ts`.
- Validación contra los tipos y hooks públicos de `@opencode-ai/plugin@1.18.30` disponibles en el entorno local.
- Integración con los eventos `message.updated`, `session.compacted` y `session.deleted`, los hooks de transformación de sistema y ejecución de herramientas, y el logging estructurado del SDK.
- Requiere incluir el plugin en el inventario y procedimiento de instalación de `integrations/opencode/`, sin modificar agentes, prompts ni archivos fuera del repositorio.
- La identificación de workers depende de `Session.parentID`; si no puede confirmarse, el plugin no aplicará SOFT ni HARD a esa sesión.
