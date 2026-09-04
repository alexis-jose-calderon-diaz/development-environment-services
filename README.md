# Development Environment Services

Repositorio público de la capa de servicios y configuraciones compartidas del ambiente de desarrollo.

Este repositorio complementa a `development-environment-host`: el repositorio host prepara la máquina y sus herramientas base; este repositorio levanta los servicios comunes y conserva configuraciones reutilizables para los proyectos consumidores.

## Propósito

El ambiente proporciona servicios Docker persistentes e independientes de cualquier aplicación concreta. PostgreSQL y pgAdmin forman el núcleo; los proyectos consumidores pueden conectarse mediante la red Docker externa `shared` sin agregar código ni configuración de esos proyectos a este repositorio.

## Componentes

- `services/`: definición Docker Compose, variables de ejemplo y servicios compartidos del ambiente.
- `integrations/opencode/`: respaldo versionado de la configuración global de OpenCode. Es una integración opcional; consulta su [guía de integración](integrations/opencode/README.md).
- `openspec/`: especificaciones y cambios del workflow OpenSpec de este repositorio.
- `.opencode/`: comandos y skills internos para trabajar con OpenSpec en este repositorio. No es el origen de la instalación global de OpenCode.

## Requisitos

- Docker Engine con Docker Compose disponible.
- La red Docker externa `shared` creada antes del primer inicio.
- Credenciales locales para pgAdmin en `services/.env`.

El ambiente está diseñado como una instancia común por máquina. Sus puertos, nombres y volúmenes estables no permiten ejecutar varias instancias aisladas en el mismo host sin una configuración adicional fuera del alcance de este repositorio.

## Inicio del ambiente

Desde la raíz del repositorio:

```bash
cp services/.env.example services/.env
docker network create shared
docker compose --env-file services/.env -f services/docker-compose.yaml up -d
docker compose --env-file services/.env -f services/docker-compose.yaml ps
```

Si `shared` ya existe, el primer comando de Docker devolverá un error; en ese caso continúa con los comandos de Compose. PostgreSQL queda disponible en `127.0.0.1:5432` y pgAdmin en [http://127.0.0.1:5050](http://127.0.0.1:5050), usando las credenciales definidas en `services/.env`.

Para detener los servicios sin eliminar los datos persistentes:

```bash
docker compose --env-file services/.env -f services/docker-compose.yaml down
```

Los volúmenes se conservan entre reinicios. No uses `down --volumes` salvo que quieras eliminar explícitamente los datos del ambiente.

## Acceso remoto opcional

El perfil `tailscale` publica pgAdmin mediante HTTPS sin cambiar los endpoints locales. Sustituye el valor de ejemplo de `DEVBOX_WEB_GATEWAY_TS_AUTHKEY` por una credencial temporal y activa el perfil:

```bash
docker compose --env-file services/.env -f services/docker-compose.yaml --profile tailscale up -d
```

El núcleo de PostgreSQL y pgAdmin no requiere credenciales de Tailscale cuando el perfil no está activo.

## Proyectos consumidores

Los contenedores consumidores deben conectarse a la red externa `shared` y usar el servicio PostgreSQL del ambiente mediante los nombres y puertos documentados por Docker Compose. Este repositorio no conoce nombres de aplicaciones, migraciones ni schemas de los consumidores.

PostgreSQL usa `POSTGRES_HOST_AUTH_METHOD=trust` para el desarrollo local. Cualquier contenedor conectado a `shared` debe considerarse confiable, porque esta política permite autenticación sin contraseña desde esa red. No reutilices esta configuración en redes no confiables ni en producción.

## Integración opcional de OpenCode

La instalación global de OpenCode no es necesaria para operar los servicios. Si quieres usarla, clona el repositorio y copia manualmente el respaldo versionado de `integrations/opencode/` hacia la configuración operativa:

```bash
git clone https://github.com/alexis-jose-calderon-diaz/development-environment-services.git
cd development-environment-services
mkdir -p ~/.config/opencode/agents ~/.config/opencode/commands ~/.config/opencode/skills
cp integrations/opencode/AGENTS.md ~/.config/opencode/AGENTS.md
cp integrations/opencode/opencode.jsonc ~/.config/opencode/opencode.jsonc
cp integrations/opencode/agents/*.md ~/.config/opencode/agents/
cp integrations/opencode/commands/*.md ~/.config/opencode/commands/
cp -R integrations/opencode/skills/* ~/.config/opencode/skills/
```

Revisa y combina `AGENTS.md` con las reglas globales existentes antes de reemplazarlo. La skill `openspec-change-context-bootstrap` debe estar instalada en `~/.config/opencode/skills/` para que el bootstrap esté disponible en tareas OpenSpec. Para comparar y mantener ambas ubicaciones, consulta [`integrations/opencode/README.md`](integrations/opencode/README.md).

## Operación y validación

La configuración puede comprobarse sin iniciar contenedores:

```bash
docker compose --env-file services/.env.example -f services/docker-compose.yaml config --quiet
docker compose --env-file services/.env.example -f services/docker-compose.yaml --profile tailscale config --quiet
```

No versiones `services/.env`, credenciales ni claves de Tailscale.
