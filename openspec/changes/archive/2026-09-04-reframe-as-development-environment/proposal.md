## Why

El repositorio se presenta actualmente como un toolkit de OpenCode, aunque sus necesidades principales se han desplazado hacia la provision y operacion de servicios Docker comunes para desarrollo. PostgreSQL y pgAdmin deben estar disponibles independientemente del proyecto en curso, mientras que OpenCode debe conservarse como una integracion opcional y no como la identidad principal.

## What Changes

- Reorientar la identidad y documentacion del repositorio hacia `Development Environment`.
- Definir un ambiente Docker transversal con una instancia singleton por maquina de PostgreSQL y pgAdmin.
- Mantener la red externa `shared` como contrato de conectividad para proyectos y otros servicios Docker.
- Exponer el acceso local al nucleo y conservar Tailscale como perfil opcional para acceso remoto a pgAdmin.
- Mantener `trust` como politica de autenticacion para el entorno local controlado, documentando su dependencia de la confianza en `shared`.
- Reducir `CLI-TOOLS.md` a los prerequisitos necesarios para operar Docker Compose y los servicios.
- Mover `AGENTS.md`, `commands/`, `agents/`, `skills/` y `config/opencode.jsonc` a `integrations/opencode/`, conservando el comportamiento de la integracion.
- Colocar `integrations/opencode/AGENTS.md` y `integrations/opencode/opencode.jsonc` al mismo nivel dentro de la integracion.
- Actualizar referencias e instrucciones de instalacion para la nueva ubicacion de la integracion OpenCode.
- Mantener `.opencode/` sin cambios porque contiene el flujo OpenSpec interno del repositorio.
- **BREAKING** Cambiar las rutas publicas de los recursos OpenCode y dejar de proporcionar `AGENTS.md` y `opencode.jsonc` en la raiz.

## Capabilities

### New Capabilities

- `development-environment-services`: Servicios Docker comunes, conectividad externa, perfiles opcionales y operacion local del ambiente de desarrollo.

### Modified Capabilities

- Ninguna. No existen capacidades especificadas previamente en `openspec/specs/`.

## Impact

- `compose.services.yaml` cambia para representar el nucleo transversal, el acceso local a pgAdmin y los perfiles opcionales sin conocer proyectos consumidores.
- `README.md` y `CLI-TOOLS.md` cambian su identidad, prerequisitos, comandos y modelo de operacion.
- Los recursos OpenCode de nivel raiz cambian de ubicacion a `integrations/opencode/`; sus referencias internas y rutas de instalacion deben actualizarse sin alterar su comportamiento.
- La ausencia de un `AGENTS.md` raiz puede cambiar el descubrimiento automatico de instrucciones del repositorio y debe quedar explicitamente documentada.
- `.opencode/` y su dependencia local de OpenSpec quedan fuera de la implementacion.
- No se introducen APIs de aplicacion, configuracion por proyecto, migraciones ni conocimiento de consumidores concretos.
