# Proposal

## Why

El command portable `commit` depende de argumentos y convenciones propias de
OpenCode, además de una skill externa, para organizar cambios y crear commits.
Esto dificulta reutilizar el flujo en otras herramientas y mantiene una
orquestación extensa separada de la instalación portable versionada.

## What Changes

- **BREAKING** Eliminar `integrations/opencode/commands/commit.md` y sustituirlo
  por la skill versionada `grouped-commits`.
- Añadir una `SKILL.md` autocontenida para analizar cambios Git, agruparlos por
  intención, mostrar una propuesta completa y pedir aprobación explícita antes
  de escribir.
- Tratar el contenido staged como selección implícita del index y proponer un
  único commit; sin staged, agrupar el working tree por archivos completos.
- Mantener las protecciones de seguridad, revalidación, staging explícito,
  hooks y verificación posterior sin depender de `$ARGUMENTS`, `$1`,
  `question` ni de la skill externa `git-commit`.
- Actualizar la documentación de instalación para distinguir la skill propia
  versionada del catálogo de skills externas y documentar su copia global.
- Usar el idioma de la petición del usuario para la descripción y el body del
  commit, conservando el `type` de Conventional Commits en inglés.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `opencode-integration`: reemplazar el contrato del command `commit` por una
  skill portable de agrupación, propuesta, aprobación y creación segura de
  commits, y actualizar la documentación de superficies instalables.

## Impact

- Afecta `integrations/opencode/skills/`,
  `integrations/opencode/commands/commit.md`,
  `integrations/opencode/README.md`,
  `integrations/opencode/skills/README.md` y el `README.md` raíz.
- No modifica APIs, servicios, código de producto ni `opencode.jsonc`.
- Elimina la dependencia funcional de la skill externa `git-commit` para este
  flujo.
- La instalación operativa bajo `~/.config/opencode/` seguirá siendo manual;
  no se añade sincronización automática.
