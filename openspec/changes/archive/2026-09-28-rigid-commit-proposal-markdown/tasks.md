# Tasks

## 1. Definir el contrato Markdown

- [x] 1.1 Actualizar `skills/ac-commit-proposal/SKILL.md` con los encabezados, etiquetas, orden, metadatos, listas y representación `None` exactos; verificarlo contra `specs/opencode-integration/spec.md` y conservar los límites existentes de alcance y seguridad.
- [x] 1.2 Especificar en la skill el formato de mensajes completos en fences `text` dinámicos y de rutas como cadenas JSON inline, incluidos escapes de backticks, caracteres de control y renombres; verificar que los ejemplos de sintaxis corresponden a esas reglas.

## 2. Añadir ejemplos representativos

- [x] 2.1 Incluir un ejemplo completo ficticio de `working-tree` con varios grupos y al menos dos variantes breves para `index` con pendientes y rutas/estados especiales; verificar que los datos están marcados como ilustrativos y cubren mensajes multilínea.
- [x] 2.2 Revisar todos los ejemplos junto al contrato para confirmar que no contradicen el orden, el Markdown normal, el escape JSON, el tratamiento de `None` ni la terminación después de `Warnings`.

## 3. Extender las evaluaciones de la skill

- [x] 3.1 Actualizar los casos pertinentes de `skills/ac-commit-proposal/evals/evals.json` para comprobar encabezados, etiquetas, orden y listas exactas, el uso de Markdown normal y la ausencia de texto posterior; verificar que cada expectativa tiene un resultado observable.
- [x] 3.2 Añadir un caso distinto de mensaje multilínea con body/trailer y contenido que incluya una secuencia parecida a un fence; verificar que el caso comprueba que el fence de salida no se cierra dentro del mensaje.
- [x] 3.3 Validar `skills/ac-commit-proposal/evals/evals.json` con un parser JSON y revisar que los identificadores de casos sean únicos y que cada caso conserve el formato local `evals/evals.json`.

## 4. Validar la integración

- [x] 4.1 Ejecutar `openspec validate rigid-commit-proposal-markdown --type change` y `openspec validate --specs`; resolver cualquier incumplimiento de artifacts o del delta de `opencode-integration`.
- [x] 4.2 Revisar conjuntamente la skill y sus evaluaciones contra todos los escenarios nuevos; documentar por separado cualquier ejecución de evaluación comparativa no disponible y no afirmar una mejora medida sin resultados.
