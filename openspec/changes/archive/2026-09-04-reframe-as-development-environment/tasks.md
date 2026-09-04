## 1. Reubicar la integracion OpenCode

- [x] 1.1 Crear `integrations/opencode/` y mover `AGENTS.md`, `commands/`, `agents/`, `skills/` y `config/opencode.jsonc` a esa integracion, dejando `AGENTS.md` y `opencode.jsonc` como archivos hermanos; verificar que las rutas nuevas existan, que las rutas antiguas ya no formen parte del producto y que `.opencode/` no haya cambiado.
- [x] 1.2 Actualizar las referencias internas de los agentes, skills y documentacion para usar `integrations/opencode/`, conservando los contratos y el comportamiento de los recursos; verificar con busquedas acotadas que no queden referencias operativas a las rutas antiguas.
- [x] 1.3 Comprobar la instalacion opcional de la integracion desde su nueva ubicacion y documentar la migracion de consumidores existentes; verificar que los archivos copiados mantengan sus nombres, permisos de configuracion y contenido funcional esperado.

## 2. Adaptar el ambiente Docker transversal

- [x] 2.1 Ajustar `compose.services.yaml` para que PostgreSQL y pgAdmin sean el nucleo sin perfil, pgAdmin tenga acceso local estable en `127.0.0.1:5050`, y se conserven los nombres, puertos, healthchecks y volumenes del singleton; verificar la configuracion con `docker compose -f compose.services.yaml config`.
- [x] 2.2 Convertir el gateway Tailscale en el perfil opcional `tailscale`, evitando que el nucleo requiera `DEVBOX_WEB_GATEWAY_TS_AUTHKEY` y manteniendo el proxy HTTPS hacia pgAdmin; verificar por separado la configuracion sin perfil y con `--profile tailscale` usando una credencial de prueba no persistida.
- [x] 2.3 Preservar la red externa `shared` y la politica PostgreSQL `trust`, haciendo explicitos sus limites en la configuracion y sin introducir soporte para multiples instancias; verificar que un arranque sin `shared` falle indicando el prerequisito y que no se cree una red alternativa.
- [x] 2.4 Crear un ejemplo seguro de las variables locales necesarias para pgAdmin y Tailscale, sin valores reales ni secretos; verificar que el ejemplo sea suficiente para preparar el nucleo y que Git no incluya archivos `.env` reales.

## 3. Reencuadrar la documentacion

- [x] 3.1 Reescribir `README.md` para presentar `Development Environment` como identidad principal, explicar el nucleo PostgreSQL/pgAdmin, la red `shared`, la persistencia, el acceso local, los perfiles y la ausencia de conocimiento sobre proyectos; verificar que los comandos documentados funcionen sin wrappers.
- [x] 3.2 Reducir `CLI-TOOLS.md` a los prerequisitos y comprobaciones necesarias para operar Docker Compose y el ambiente, eliminando la responsabilidad de instalar runtimes, editores y herramientas de workstation; verificar que no presente OpenCode como dependencia esencial.
- [x] 3.3 Añadir a la documentacion la advertencia sobre `trust`, la confianza requerida en `shared`, la naturaleza singleton del ambiente, el acceso remoto opcional y la migracion de las rutas OpenCode; verificar que una persona pueda operar el nucleo desde una copia limpia siguiendo solo la documentacion del repositorio.

## 4. Validacion integrada

- [x] 4.1 Validar el nucleo en una red `shared` disponible: iniciar PostgreSQL y pgAdmin, comprobar healthchecks, conectarse por `127.0.0.1:5432` y `127.0.0.1:5050`, reiniciar los servicios y confirmar que los datos sobreviven; registrar cualquier fallo con su causa concreta.
- [x] 4.2 Validar la conectividad desde un contenedor consumidor conectado a `shared` y el acceso remoto con el perfil Tailscale cuando exista una credencial de prueba disponible; verificar que el consumidor resuelva el hostname estable de PostgreSQL y que los endpoints locales no cambien.
- [x] 4.3 Ejecutar `openspec validate --change reframe-as-development-environment` y una revision final de `git diff --check`, estado de artifacts y ausencia de cambios bajo `.opencode/`; verificar que todos los requisitos de `specs/development-environment-services/spec.md` tengan evidencia o queden identificados como no verificables.
