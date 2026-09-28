# Proposal

## Why

`ac-commit-proposal` ya exige una propuesta con campos y orden definidos, pero no fija completamente su sintaxis Markdown y solo muestra un ejemplo completo. Esto deja ambigua la representación de mensajes multilínea y rutas especiales, y dificulta reconocer propuestas con formato inconsistente.

## What Changes

- Definir el formato Markdown visible de la propuesta como un contrato exacto: encabezados, etiquetas, orden, listas y representación de secciones vacías.
- Especificar una representación segura de rutas como cadenas JSON en spans de código y de mensajes exactos en bloques `text`, incluidos mensajes multilínea.
- Ampliar los ejemplos de la skill con un ejemplo completo ficticio y variantes breves para el alcance `index`, cambios pendientes y rutas o estados Git especiales.
- Extender `evals/evals.json` para comprobar la estructura Markdown requerida, sus casos límite y la terminación sin texto posterior.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `opencode-integration`: precisar la sintaxis Markdown de la propuesta de commits y exigir varios ejemplos que cubran el formato canónico y sus variantes.

## Impact

- `skills/ac-commit-proposal/SKILL.md`: contrato de salida y ejemplos.
- `skills/ac-commit-proposal/evals/evals.json`: expectativas verificables sobre formato y ejemplos de salida.
- `openspec/specs/opencode-integration/spec.md`: delta del requisito de propuesta completa.
- No cambia la agrupación de commits, la selección del alcance Git, la seguridad ni la interfaz de invocación.
