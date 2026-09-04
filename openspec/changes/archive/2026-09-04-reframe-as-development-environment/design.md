## Context

Ver `proposal.md` para la motivacion. El estado actual combina un inventario de herramientas, un Compose de servicios comunes y recursos de configuracion global de OpenCode en la raiz.

`compose.services.yaml` ya define PostgreSQL, pgAdmin, una red externa `shared`, volumenes persistentes y un gateway Tailscale. Los servicios usan nombres y puertos estables, por lo que el modelo deseado es una instancia comun por maquina, no multiples proyectos Compose aislados.

La integracion OpenCode de nivel raiz esta compuesta por `AGENTS.md`, `commands/`, `agents/`, `skills/` y `config/opencode.jsonc`. La carpeta `.opencode/` contiene el flujo OpenSpec interno y no forma parte de esta reorganizacion.

## Goals / Non-Goals

**Goals:**

- Convertir el Compose existente en el nucleo operativo de un ambiente de desarrollo transversal.
- Mantener PostgreSQL y pgAdmin disponibles sin configuracion de una aplicacion consumidora.
- Conservar endpoints, nombres, volumenes y conectividad adecuados para una instancia singleton.
- Habilitar acceso local a pgAdmin sin depender de Tailscale.
- Activar Tailscale unicamente mediante un perfil opcional.
- Mantener el comportamiento de los recursos OpenCode despues de moverlos a `integrations/opencode/`.
- Dejar documentados los prerequisitos, la red externa, las variables, los comandos y los limites de seguridad.

**Non-Goals:**

- Instalar Docker, runtimes, editores u otras herramientas en la maquina anfitriona.
- Conocer nombres de proyectos, crear configuracion de aplicaciones, ejecutar migraciones o administrar schemas de consumidores.
- Permitir multiples instancias aisladas del ambiente en la misma maquina.
- Convertir la configuracion `trust` en una politica apta para produccion.
- Crear un CLI, un Makefile o una capa de comandos distinta de Docker Compose.
- Modificar `.opencode/`, sus dependencias o sus workflows OpenSpec internos.

## Decisions

### 1. Compose directo como interfaz

Se mantendra `compose.services.yaml` como archivo de servicios y se documentaran comandos explicitos con `docker compose -f compose.services.yaml`. No se agregara un wrapper que oculte las operaciones de Docker ni una nueva dependencia del host.

Se considero renombrar el archivo a `compose.yaml`, pero conservar la ruta actual reduce el cambio estructural y evita mezclar el reencuadre de identidad con una migracion de entrypoint innecesaria.

### 2. Nucleo y perfiles en la misma topologia

PostgreSQL y pgAdmin permaneceran en el nucleo sin perfil. Tailscale se asociara al perfil `tailscale` y solo se resolveran sus credenciales cuando ese perfil sea activado. El inicio del nucleo no debe depender de `DEVBOX_WEB_GATEWAY_TS_AUTHKEY`.

El perfil conservara el proxy HTTPS hacia pgAdmin y compartira la red `shared` con los servicios base. Se validaran por separado el inicio sin perfil y el inicio con credenciales del perfil.

Se considero separar cada perfil en archivos Compose adicionales, pero un perfil nativo mantiene una sola topologia visible y permite activar servicios con la interfaz estandar de Compose.

### 3. Red externa y contrato singleton

La red `shared` seguira declarandose como externa y no sera creada implicitamente por el Compose. La documentacion indicara como comprobarla y crearla antes del primer inicio. Si no existe, el arranque debe fallar de forma comprensible.

Los nombres de contenedor `devbox-postgres` y `devbox-pgadmin`, el puerto local de PostgreSQL `127.0.0.1:5432`, el endpoint local de pgAdmin y los volumenes persistentes se trataran como identificadores estables del ambiente. Los nombres fijos son intencionales para que otros proyectos conectados a `shared` puedan localizar el servicio comun.

Se descarta soportar multiples instancias como objetivo de este cambio. La documentacion advertira de las colisiones de puertos, nombres y volumenes que produciria un segundo ambiente en la misma maquina.

### 4. Acceso y autenticacion de desarrollo

pgAdmin tendra un acceso local independiente del gateway Tailscale, usando su puerto interno `5050` y un endpoint de host estable documentado. Tailscale agregara acceso remoto sin reemplazar el acceso local.

PostgreSQL conservara `POSTGRES_HOST_AUTH_METHOD=trust` para conexiones desde la maquina anfitriona y contenedores confiables de `shared`. README y la documentacion operativa deben advertir que cualquier contenedor conectado a esa red puede intentar autenticarse sin contrasena y que la configuracion no debe reutilizarse en produccion.

Las credenciales de pgAdmin continuaran llegando desde variables locales ignoradas por Git. Las credenciales de Tailscale seran necesarias solo para activar su perfil.

### 5. Reubicacion de la integracion OpenCode

Los recursos OpenCode de nivel raiz se moveran a esta estructura:

```text
integrations/opencode/
|-- AGENTS.md
|-- opencode.jsonc
|-- commands/
|-- agents/
`-- skills/
```

`AGENTS.md` y `opencode.jsonc` seran archivos hermanos. Se actualizaran las referencias internas, las rutas de instalacion y la documentacion, pero no los contratos ni el comportamiento de los comandos, agentes y skills.

No se conservaran copias en las rutas antiguas ni se creara un `AGENTS.md` raiz. Esto hace explicita la separacion, pero constituye un cambio incompatible para consumidores que instalen directamente desde las rutas actuales.

### 6. Documentacion orientada al ambiente

`README.md` describira primero el ambiente Docker comun: prerequisitos, red `shared`, variables, nucleo, perfiles, endpoints, persistencia y advertencias. `CLI-TOOLS.md` se reducira a los clientes y comandos necesarios para operar y comprobar Docker Compose; no sera una guia de instalacion de la workstation.

La documentacion no incluira nombres, variables, migraciones ni instrucciones propias de proyectos consumidores.

## Risks / Trade-offs

- **[Red externa ausente]** El nucleo no funcionara desde una copia limpia si `shared` no existe. -> Documentar un preflight explicito y validar el error de arranque.
- **[Confianza excesiva en `shared`]** `trust` permite conexiones sin contrasena desde contenedores conectados a la red. -> Marcar la red como limite de confianza y prohibir esta configuracion en produccion.
- **[Colision del singleton]** Una segunda instancia puede reclamar los mismos puertos, nombres o volumenes. -> Documentar que el ambiente es unico por maquina y no ofrecer aislamiento en este cambio.
- **[Credenciales de perfiles]** Una variable obligatoria de Tailscale podria bloquear por accidente el nucleo si se resuelve fuera del perfil. -> Probar el comando sin perfil y mantener la validacion de la credencial ligada al servicio opcional.
- **[Cambio de rutas OpenCode]** Instalaciones existentes que usen `commands/`, `agents/`, `skills/` o `config/opencode.jsonc` quedaran obsoletas. -> Incluir instrucciones de migracion y declarar el cambio como incompatible; no mantener duplicados.
- **[Perdida de instrucciones raiz]** Mover `AGENTS.md` puede impedir su descubrimiento automatico en el repositorio y afectar reglas de coordinacion fuera de `.opencode/`. -> Documentar la decision y validar especificamente el flujo OpenSpec interno sin modificar `.opencode/`.
- **[Persistencia existente]** Cambios de variables no reconfiguran automaticamente un volumen PostgreSQL ya inicializado. -> No asumir reinicializacion; documentar que la persistencia conserva el estado previo y que cualquier reprovision destructivo requiere una accion explicita fuera de este cambio.

## Migration Plan

1. Reubicar los recursos OpenCode a `integrations/opencode/` y actualizar sus referencias internas y rutas de instalacion.
2. Actualizar `README.md` y `CLI-TOOLS.md` para presentar el ambiente como producto principal y la integracion OpenCode como opt-in.
3. Ajustar `compose.services.yaml` para el acceso local de pgAdmin y el perfil opcional de Tailscale, manteniendo red, nombres y persistencia del singleton.
4. Documentar la preparacion de la red externa `shared`, las variables de pgAdmin y Tailscale, los comandos de nucleo y la activacion del perfil.
5. Validar el nucleo sin Tailscale, el perfil remoto, las conexiones locales, la conectividad desde `shared`, la persistencia y la instalacion de la integracion desde sus nuevas rutas.

El rollback de archivos consiste en revertir el cambio Git y volver a las rutas anteriores. Los volumenes Docker no deben eliminarse durante el rollback; la informacion persistida se considera independiente de la reorganizacion de archivos.

## Open Questions

Ninguna. Las decisiones que afectan el alcance, la topologia, la seguridad, la compatibilidad de rutas y el tratamiento de `.opencode/` quedaron definidas durante la exploracion.
