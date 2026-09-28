# Proposal

## Why

La identidad pública `ac-grouped-commits` describe la técnica de organizar cambios, pero no el resultado que define la skill: una propuesta completa de commits. Además, el formato solo está descrito por campos y actualmente ordena enumerar rutas ignoradas, lo que contradice el objetivo de que esos archivos permanezcan invisibles para el agente.

## What Changes

- **BREAKING** Renombrar la skill pública `ac-grouped-commits` a `ac-commit-proposal`, manteniendo un único identificador público y actualizando su directorio, metadata, evaluación y referencias de instalación.
- Añadir a la skill un ejemplo completo e ilustrativo de propuesta, con valores ficticios claramente identificados y todos los campos y bloques requeridos.
- Cambiar el tratamiento de archivos ignorados por Git: no enumerar sus rutas, inspeccionarlos ni incluirlos en la propuesta o en `Exclusions`; usar la exclusión predeterminada de Git.
- Sincronizar el inventario de la especificación de skills públicas con el catálogo actual de nueve skills, que incluye `ac-dotnet-testing`.
- Ajustar las evaluaciones y el contrato OpenSpec para verificar el nombre, el formato de la propuesta y la invisibilidad de archivos ignorados.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `opencode-integration`: sincronizar el inventario público y cambiar la identidad de la skill de commits; precisar que su objetivo es producir una propuesta completa, exigir un ejemplo ilustrativo del formato y prohibir enumerar o inspeccionar rutas ignoradas por Git.

## Impact

- Afecta `skills/ac-grouped-commits/` (renombrada a `skills/ac-commit-proposal/`), `skills/README.md` y `openspec/specs/opencode-integration/spec.md`.
- Afecta la instalación y actualización documentadas, además de cualquier referencia activa a `ac-grouped-commits`.
- No cambia APIs ni servicios. El cambio de identificador público es incompatible con instalaciones que usen el nombre anterior; no se propone mantener un alias.
