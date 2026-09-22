# Servicios compartidos

Esta carpeta contiene el Docker Compose del ambiente común de desarrollo. Los
servicios son independientes de cualquier aplicación consumidora: PostgreSQL y
pgAdmin forman el núcleo, y los consumidores se conectan mediante la red Docker
externa `shared`.

## Requisitos

- Docker Engine con Docker Compose disponible.
- La red Docker externa `shared` creada antes del primer inicio.
- Credenciales locales para pgAdmin en `services/.env`.

El ambiente está diseñado como una instancia común por máquina. Sus puertos,
nombres y volúmenes estables no permiten ejecutar varias instancias aisladas en
el mismo host sin configuración adicional fuera del alcance de este repositorio.

## Configuración e inicio

Ejecuta los comandos desde la raíz del repositorio:

```bash
cp services/.env.example services/.env
docker network create shared
docker compose --env-file services/.env -f services/docker-compose.yaml up -d
docker compose --env-file services/.env -f services/docker-compose.yaml ps
```

Si `shared` ya existe, `docker network create shared` devolverá un error; en ese
caso continúa con los comandos de Compose. No versiones `services/.env`,
credenciales ni claves de Tailscale.

PostgreSQL y pgAdmin quedan disponibles en los endpoints locales siguientes:

| Servicio | Endpoint |
| --- | --- |
| PostgreSQL | `127.0.0.1:5432` |
| pgAdmin | [http://127.0.0.1:5050/pgadmin](http://127.0.0.1:5050/pgadmin) |

pgAdmin usa las credenciales definidas en `services/.env`.

## Detención y persistencia

Para detener los servicios sin eliminar los datos persistentes:

```bash
docker compose --env-file services/.env -f services/docker-compose.yaml down
```

Los volúmenes se conservan entre reinicios. No uses `down --volumes` salvo que
quieras eliminar explícitamente los datos del ambiente.

## Acceso remoto opcional

El perfil `tailscale` publica pgAdmin mediante HTTPS bajo la ruta `/pgadmin`, sin
cambiar el endpoint local de PostgreSQL. Sustituye el valor de ejemplo de
`WEB_GATEWAY_TS_AUTHKEY` por una credencial temporal y activa el perfil:

```bash
docker compose --env-file services/.env -f services/docker-compose.yaml --profile tailscale up -d
```

Después, accede a pgAdmin mediante `https://<dominio-tailscale>/pgadmin`. El
núcleo de PostgreSQL y pgAdmin no requiere credenciales de Tailscale cuando el
perfil no está activo.

## Proyectos consumidores

Los contenedores consumidores deben conectarse a la red externa `shared` y usar
el servicio `postgres` en el puerto `5432`. Este repositorio no conoce nombres
de aplicaciones, migraciones ni schemas de los consumidores.

PostgreSQL usa `POSTGRES_HOST_AUTH_METHOD=trust` para el desarrollo local.
Cualquier contenedor conectado a `shared` debe considerarse confiable, porque
esta política permite autenticación sin contraseña desde esa red. No reutilices
esta configuración en redes no confiables ni en producción.

## Validación

La configuración puede comprobarse sin iniciar contenedores:

```bash
docker compose --env-file services/.env.example -f services/docker-compose.yaml config --quiet
docker compose --env-file services/.env.example -f services/docker-compose.yaml --profile tailscale config --quiet
```
