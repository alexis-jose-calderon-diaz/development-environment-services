# Proposal

## Why

Los nombres actuales `AGENTS.md` y `opencode.jsonc` dentro de
`integrations/opencode/` pueden ser descubiertos automáticamente como reglas y
configuración operativa aunque solo sean respaldos versionados. Además, la
documentación está separada en un README que se quiere retirar y contiene rutas
que dejarán de existir. Las reglas de idioma, interacción, delegación y ciclo
de trabajo también deben quedar alineadas entre la guía portable, el repositorio
y las respuestas generadas.

## What Changes

- **BREAKING** Mover y renombrar `integrations/opencode/AGENTS.md` a
  `integrations/agents-global.md`, conservando `AGENTS.md` como nombre
  únicamente en el destino operativo `~/.config/opencode/AGENTS.md`.
- **BREAKING** Mover y renombrar `integrations/opencode/opencode.jsonc` a
  `integrations/opencode-config.jsonc`, conservando `opencode.jsonc`
  como nombre únicamente en el destino operativo `~/.config/opencode/`.
- **BREAKING** Eliminar la carpeta `integrations/opencode/` y trasladar su
  documentación vigente al README raíz.
- Rediseñar `agents-global.md` con español obligatorio para las respuestas
  dirigidas al humano, preguntas mediante la herramienta especializada cuando
  esté disponible, el ciclo alcance-plan-implementación-revisión-integración-
  finalización y la repetición de fases cuando sea necesaria.
- Exigir que se intente atomizar y delegar el trabajo a subagentes disponibles,
  preservando límites de edición, ownership por archivo y dependencias entre
  unidades.
- Alinear `AGENTS.md` raíz para que conserve únicamente las reglas específicas
  del repositorio y no duplique ni dirija las reglas transversales globales.
- Convertir `README.md` raíz en la fuente documental única de la integración,
  incluyendo el mapeo respaldo-destino, copia manual, comparación,
  sincronización, migración y reinicio posterior.
- Actualizar `skills/README.md` para eliminar el enlace al README retirado.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `opencode-integration`: cambia la superficie de archivos de respaldo, la
  fuente documental de la integración, las reglas portables de interacción y
  ciclo de trabajo, la política de idioma de las respuestas y la coordinación
  de unidades delegables.

## Impact

- Archivos versionados bajo `integrations/`, con movimientos y una eliminación
  de carpeta documental.
- `README.md`, `AGENTS.md` y `skills/README.md`.
- La especificación `opencode-integration` y la documentación de instalación
  global bajo `~/.config/opencode/`.
- No se modifican Docker Compose, servicios, credenciales, `prospectos/` ni la
  configuración contenida en el archivo JSONC, salvo su nombre de respaldo.
