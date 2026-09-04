## Why

La documentación raíz todavía describe los recursos de OpenCode como si fueran contenido principal del repositorio, aunque actualmente están agrupados bajo `integrations/opencode/`. Además, esa carpeta carece de una explicación explícita sobre su relación con la configuración global operativa ubicada en `~/.config/opencode/`, lo que puede provocar ediciones en el lugar equivocado o referencias internas incorrectas.

## What Changes

- Actualizar `README.md` para reflejar la estructura actual del repositorio y enlazar la integración opcional de OpenCode desde `integrations/opencode/`.
- Crear `integrations/opencode/README.md` como guía de propósito, ubicación operativa y mantenimiento de la integración.
- Declarar que los archivos de `integrations/opencode/` son respaldos versionados de los archivos que realmente utiliza OpenCode desde `~/.config/opencode/`.
- Documentar el flujo de sincronización entre la copia versionada y la configuración global, incluyendo la revisión de diferencias antes de sobrescribir archivos.
- Establecer que las referencias internas de la integración deben resolverse desde la raíz de la configuración global y no mencionar rutas padre del repositorio.
- Diferenciar la integración global de OpenCode del flujo interno de OpenSpec ubicado en `.opencode/`.
- **BREAKING** No aplica al comportamiento del software; el cambio únicamente mejora y aclara la documentación y las convenciones de mantenimiento.

## Capabilities

### New Capabilities

Ninguna. El cambio es exclusivamente documental y no introduce comportamiento funcional.

### Modified Capabilities

Ninguna.

La delta de especificación se omite deliberadamente mediante `skip_specs: true`, porque no cambian requisitos de un sistema ejecutable.

## Impact

- Archivos documentales: `README.md` y el nuevo `integrations/opencode/README.md`.
- Metadatos de planificación OpenSpec: este cambio usa `skip_specs: true` para evitar una especificación funcional artificial.
- No se modifican comandos, agentes, skills, configuración JSONC, servicios Docker, APIs, dependencias ni el flujo interno de `.opencode/`.
