## Why

El `AGENTS.md` portable mezcla reglas generales de OpenCode con un protocolo estricto de activacion OpenSpec. Esa politica se repite en las skills y en los agentes, por lo que tareas genericas pueden quedar bloqueadas por no transportar una declaracion o snapshot que no necesitan.

La guia portable debe describir como comportarse y como delegar contexto, no imponer un workflow especifico. Centralizar un contrato breve de delegacion reducira duplicacion y hara que la configuracion sea reutilizable en repositorios con workflows distintos.

## What Changes

- **BREAKING** Simplificar `integrations/opencode/AGENTS.md` para centralizar herramientas, comportamiento, seguridad y un formato generico de contexto autocontenido para sub-agentes.
- **BREAKING** Eliminar de la configuracion portable la activacion obligatoria, el bootstrap, los identificadores y los snapshots especificos de OpenSpec.
- **BREAKING** Eliminar las skills globales `openspec-change-context-bootstrap` y `delegation-context`.
- Simplificar los prompts de `analyzer`, `planner`, `implementer` e `integration-checker` para que consuman el contexto delegado sin depender de un protocolo OpenSpec.
- Convertir `reviewer` en un agente de revision reutilizable para tareas genericas y cambios con criterios contractuales suministrados por el orquestador.
- Actualizar la documentacion de `integrations/opencode/` para reflejar la nueva separacion entre el toolkit portable y las configuraciones o workflows del proyecto consumidor.
- Mantener sin cambios `AGENTS.md` raiz, `openspec/`, los workflows locales y el codigo de servicios de este repositorio.

## Capabilities

### New Capabilities

### Modified Capabilities

- `opencode-integration`: sustituir el protocolo obligatorio y especifico de OpenSpec por reglas portables de comportamiento y delegacion de contexto.

## Impact

- Afecta `integrations/opencode/AGENTS.md`, los cinco agentes globales, las dos skills globales y `integrations/opencode/README.md`.
- Cambia el comportamiento de instalacion global bajo `~/.config/opencode/`, que debera sincronizarse con la nueva estructura de recursos.
- Elimina dependencias documentales entre los agentes globales y el CLI o artifacts de OpenSpec.
- No afecta APIs, persistencia, servicios Docker ni los workflows OpenSpec locales del repositorio.
