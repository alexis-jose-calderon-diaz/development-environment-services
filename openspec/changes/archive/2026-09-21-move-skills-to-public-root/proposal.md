# Proposal

## Why

La skill propia `grouped-commits` está mezclada con el respaldo de configuración
portable de OpenCode bajo `integrations/opencode/skills/`, aunque debe poder
consumirse como una skill pública independiente. Además, la documentación actual
combina la copia manual del toolkit con la instalación de skills y puede llevar a
instalar contenido en la superficie interna `./.agents/`.

## What Changes

- **BREAKING** Mover la superficie pública de skills a `/skills/`, incluyendo su
  catálogo, `grouped-commits/SKILL.md` y sus evaluaciones.
- Retirar las skills públicas de `integrations/opencode/`; esa integración
  conservará únicamente configuración portable, agents, commands y plugins.
- Declarar explícitamente que `/skills/` es una superficie pública y que
  `./.agents/` pertenece al workflow interno y queda fuera del catálogo y del
  movimiento.
- Cambiar la instalación de skills públicas para usar `npx skills add` con
  alcance global y selección neutral de agentes, sin recomendar `opencode` ni
  imponer `--agent`.
- Cambiar la sincronización de skills públicas a `npx skills update --global`;
  mantener manual la sincronización del resto de `integrations/opencode/`.
- Alinear el README raíz, la guía de integración y la especificación con las
  nuevas rutas, límites y comandos.

## Capabilities

### New Capabilities

<!-- No se introduce una capacidad independiente; se reorganiza una capacidad existente. -->

### Modified Capabilities

- `opencode-integration`: cambiar la ubicación pública versionada de la skill y
  sustituir la instalación manual y específica de OpenCode por instalación y
  actualización globales mediante `npx skills` con selección neutral de agentes.

## Impact

- Afecta `skills/`, `integrations/opencode/`, `README.md` y la documentación de
  instalación y sincronización.
- Requiere actualizar el delta de `opencode-integration` y las tareas de migración
  de rutas y comandos.
- No modifica `./.agents/`, el workflow interno ni los servicios Docker.
- La instalación global queda bajo el directorio de skills del usuario según el
  CLI; el repositorio no instala, actualiza ni elimina skills automáticamente.
