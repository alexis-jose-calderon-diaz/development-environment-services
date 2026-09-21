# Proposal

## Why

Las cinco skills públicas actuales no comparten un prefijo identificable con
este catálogo, lo que dificulta distinguirlas de skills externas o de otros
paquetes instalados globalmente. Adoptar el prefijo `ac-` crea una convención
de nombres uniforme y explícita antes de ampliar su distribución.

## What Changes

- **BREAKING** Renombrar las cinco skills públicas a:
  `ac-change-impact-analysis`, `ac-change-planning`, `ac-change-review`,
  `ac-grouped-commits` y `ac-integration-boundary-audit`.
- Actualizar los directorios `skills/<name>/`, el campo `name` de cada
  `SKILL.md` y los nombres de las evaluaciones asociadas.
- Actualizar el catálogo, los comandos de instalación y actualización, y las
  referencias activas para usar los nuevos identificadores.
- Mantener fuera del alcance las skills externas registradas en
  `skills-lock.json`, la superficie interna `./.agents/` y el comportamiento
  operativo de cada skill.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `opencode-integration`: modificar la convención de nombres, las rutas y los
  identificadores documentados para las skills públicas instalables.

## Impact

- Afecta `skills/`, su README, los cinco `SKILL.md` y sus archivos de
  evaluación.
- Afecta los comandos `npx skills add` y `npx skills update` documentados para
  consumidores externos.
- Las instalaciones existentes que usen los nombres sin prefijo requerirán
  migración o una nueva instalación con los identificadores `ac-*`.
- No cambia APIs, servicios Docker, dependencias de runtime ni la lógica de las
  skills.
