## Why

Cuando un worker devuelve `## HANDOFF` por agotamiento de contexto, el orquestador ya crea correctamente una sesion hija nueva, pero la delegacion posterior puede reducir el estado del worker anterior a un mensaje generico. Eso obliga a repetir exploracion y puede perder conclusiones que no quedaron persistidas en el repositorio, especialmente en workers de analisis.

## What Changes

- Definir un paquete compacto de continuacion para cada nueva sesion creada tras un `HANDOFF`.
- Conservar por separado el objetivo delegado original y el estado operativo relevante del `HANDOFF`: trabajo completado, trabajo restante, decisiones, archivos relevantes, riesgos, verificacion y siguiente accion.
- Indicar al worker nuevo que verifique solo el estado del repositorio relacionado con la continuacion, que no repita trabajo completado sin detectar una discrepancia y que trate el repositorio actual como autoridad.
- Mantener el estado de continuacion como un resumen actualizado, sin copiar conversaciones ni anidar historiales entre `HANDOFF` encadenados.
- Preservar la creacion de una sesion hija nueva sin reutilizar `task_id` ni otro identificador de la sesion agotada.

## Capabilities

### New Capabilities

### Modified Capabilities

- `opencode-integration`: exigir que las continuaciones posteriores a `HANDOFF` transfieran estado operativo suficiente, especialmente para workers exploratorios, sin perder las restricciones parentales.

## Impact

- Se modifica unicamente la guia portable `integrations/opencode/AGENTS.md`.
- No se modifican el plugin de presupuesto, las definiciones de agentes, comandos, skills, `opencode.jsonc`, codigo fuente ni tests.
- No se cambian APIs, dependencias ni la regla existente que obliga a crear una sesion fresca y omitir el identificador anterior.
