# Development Environment Services

## Rol del repositorio

- Este repositorio complementa a `development-environment-host`: contiene la capa de servicios y configuraciones compartidas que se ejecuta dentro del host preparado.
- No hay una aplicación, manifest raíz, suite de tests ni CI propios; el núcleo operativo es Docker Compose.

## Superficies

- `services/` es un entorno Docker Compose independiente de los proyectos consumidores; `integrations/opencode/` es solo el respaldo versionado de la configuración global.
- `.opencode/` y `openspec/` contienen el workflow OpenSpec local del repositorio; no los mezcles con `integrations/opencode/` ni los uses como origen de la instalación global.
- Antes de modificar `integrations/opencode/`, lee `integrations/opencode/AGENTS.md`; esa guía contiene sus reglas específicas y no debe duplicarse aquí.

## Entorno Docker

- Desde la raíz, copia `services/.env.example` a `services/.env` y usa `services/docker-compose.yaml` con `--env-file services/.env`; prepara antes la red Docker externa `shared`, que Compose no crea automáticamente.
- Compose requiere `PGADMIN_EMAIL` y `PGADMIN_PASSWORD`; `WEB_GATEWAY_TS_AUTHKEY` solo es necesario con `--profile tailscale`. pgAdmin se sirve bajo la ruta `/pgadmin`. No versiones `services/.env` ni credenciales.
- PostgreSQL y pgAdmin forman el núcleo sin perfil y exponen PostgreSQL en `127.0.0.1:5432` y pgAdmin en `127.0.0.1:5050/pgadmin`; Tailscale solo añade acceso remoto mediante el perfil opcional `tailscale`.
- Los datos viven en volúmenes persistentes y los nombres de servicio/contenedor son estables para consumidores conectados a `shared`; no añadas configuración específica de un proyecto consumidor ni intentes ejecutar una segunda instancia en el mismo host.
- PostgreSQL usa `POSTGRES_HOST_AUTH_METHOD=trust` para desarrollo sobre una red confiable; no reutilices esta configuración en redes no confiables ni en producción.

## OpenSpec

- Para resolver el contexto y el estado local, ejecuta `openspec context --json` y `openspec list --json`; valida las especificaciones con `openspec validate --specs`.
- Trata una solicitud como OpenSpec solo si contiene una única línea operativa `OpenSpec change: <change-id>` con un ID real; no infieras el ID desde ramas, rutas ni artifacts.
- Los artifacts archivados en `openspec/changes/archive/` son históricos; no los uses como fuente de comandos o rutas actuales.

## Integración global

- La instalación global se copia manualmente desde `integrations/opencode/` a `~/.config/opencode/`; compara ambas ubicaciones antes de sobrescribir y reinicia OpenCode tras cambiar la configuración instalada.

## Validación

- Comprueba el Compose base con `docker compose --env-file services/.env.example -f services/docker-compose.yaml config --quiet` y el perfil remoto con `docker compose --env-file services/.env.example -f services/docker-compose.yaml --profile tailscale config --quiet` antes de levantar servicios.
