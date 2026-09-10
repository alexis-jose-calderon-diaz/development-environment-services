## Why

La guía portable no define una prioridad clara entre el `workdir` disponible y los recursos externos. Esto puede llevar a ampliar innecesariamente la superficie de investigación, aunque el toolkit necesita conservar la posibilidad de consultar recursos externos cuando sean realmente necesarios.

## What Changes

- Añadir a la guía común una política breve de priorizar el `workdir` y usar recursos externos solo como último recurso necesario.
- Exigir que el acceso externo sea concreto, mínimo y justificado, sin convertirlo en una ampliación automática del `Scope` de edición.
- Retirar la exigencia general de usar rutas relativas de la guía y de los cinco contratos de agentes portables.
- Mantener separadas la configuración portable versionada y la instalación operativa, sin cambiar permisos globales ni código de proyecto.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `opencode-integration`: ajustar las reglas de alcance, acceso externo y formato de rutas de la integración portable.

## Impact

- Afecta `integrations/opencode/AGENTS.md` y los contratos Markdown de `analyzer`, `planner`, `implementer`, `reviewer` e `integration-checker`.
- No afecta APIs, dependencias, servicios Docker ni código de aplicación.
- La copia instalada bajo `~/.config/opencode/` requerirá sincronización manual posterior, conforme a la documentación existente.
