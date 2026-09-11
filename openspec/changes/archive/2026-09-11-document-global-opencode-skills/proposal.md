## Why

La integración portable tiene una carpeta de `skills/` cuyo contenido documenta dependencias externas, pero las instrucciones actuales no distinguen con claridad entre una skill versionada y una skill instalada globalmente. Además, los README del repositorio y de la integración contienen instrucciones divergentes y una referencia obsoleta a una skill OpenSpec que ya no forma parte del respaldo global.

Este cambio busca ofrecer un catálogo pequeño y razonado de skills globales útiles, con instalación dirigida a OpenCode y con límites claros frente a los agentes, commands y workflows propios del toolkit.

## What Changes

- Documentar en `integrations/opencode/skills/README.md` las skills externas recomendadas y opcionales, su propósito, sus solapamientos y sus condiciones de uso.
- Documentar la instalación global mediante `npx skills add` usando `--global` y `--agent opencode`, sin recomendar la instalación masiva del catálogo.
- Registrar `git-commit` como dependencia explícita de `/commit`, manteniendo la precedencia de las restricciones locales del command.
- Registrar `excalidraw-diagram-generator`, `documentation-writer`, `docs-sync-audit`, `test-gap-audit` y `security-review` como opciones bajo demanda, con sus límites relevantes.
- Aclarar que las skills son dependencias externas y no se copian ni se venden dentro del respaldo versionado.
- Alinear `README.md` e `integrations/opencode/README.md` con ese modelo, incluyendo el plugin portable en la instalación manual y retirando la referencia obsoleta a `openspec-change-context-bootstrap`.
- Mantener fuera del cambio el código ejecutable, los agentes, los commands, el plugin y la configuración de OpenCode.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `opencode-integration`: ampliar el contrato documental de la integración para distinguir las skills externas globales de los recursos versionados y mantener coherentes las instrucciones de instalación y separación entre superficies.

## Impact

- Documentación: `README.md`, `integrations/opencode/README.md` e `integrations/opencode/skills/README.md`.
- Dependencias externas: catálogo y comandos de instalación de `github/awesome-copilot` mediante `npx skills`.
- Operación global: aclaración del destino `~/.config/opencode/skills/` y del alcance exclusivo de OpenCode.
- No se modifican APIs, servicios Docker, código de producto, agentes, commands, plugins ni `opencode.jsonc`.
