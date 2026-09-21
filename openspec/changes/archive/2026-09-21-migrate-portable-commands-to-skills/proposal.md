# Proposal

## Why

La integración todavía distribuye `tag` y `pr` como commands específicos de
OpenCode, aunque sus workflows pueden reutilizarse como Agent Skills. Esto
mantiene interfaces basadas en `$ARGUMENTS`, metadata de agente y mecanismos
propios del runtime, y separa estos flujos de las skills públicas ya
versionadas. La migración completa ahora permite una distribución uniforme,
portable y auditable.

## What Changes

- **BREAKING** Eliminar `integrations/opencode/commands/tag.md` y
  `integrations/opencode/commands/pr.md`; no conservar aliases ni wrappers
  `/tag` o `/pr`.
- Añadir la skill pública `ac-release-tag-proposal` para proponer versiones y
  tags mediante análisis read-only de la historia Git.
- Añadir la skill pública `ac-pull-request` para revisar commits y crear una
  Pull Request con `gh` únicamente después de una confirmación explícita.
- Mantener las reglas de seguridad, preflight, formatos de salida,
  revalidación y límites operativos de ambos commands, adaptándolas a una
  interfaz de skill independiente de OpenCode.
- Añadir evaluaciones de comportamiento para casos válidos, bloqueos,
  argumentos inválidos, ausencia de cambios versionables y confirmación de
  publicación.
- Actualizar el catálogo público, la documentación de instalación y la
  especificación de integración para reflejar las dos nuevas skills y la
  eliminación de los commands.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `opencode-integration`: reemplazar los workflows portables `tag` y `pr` por
  las skills públicas `ac-release-tag-proposal` y `ac-pull-request`, actualizar
  sus contratos de seguridad y ajustar la documentación de superficies
  instalables.

## Impact

- Afecta `skills/`, `integrations/opencode/commands/`, los README de la raíz y
  de la integración, `integrations/opencode/AGENTS.md` y la especificación
  principal de `opencode-integration`.
- Añade la dependencia operativa de Git para ambas skills y de `gh` autenticado
  para `ac-pull-request`; no añade librerías ni modifica `opencode.jsonc`.
- Cambia la interfaz de invocación: las skills se activan mediante la petición
  del usuario y no mediante commands globales de OpenCode.
- No modifica servicios Docker, APIs, datos persistentes, workflows locales de
  `.opencode/` ni la superficie interna `./.agents/`.
