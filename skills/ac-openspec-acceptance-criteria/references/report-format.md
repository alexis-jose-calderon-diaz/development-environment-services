# Informe de criterios de aceptación

Entregar Markdown en español directamente en la conversación, sin archivos persistentes. El orden y los conteos deben ser consistentes: `criterios extraídos = DEFINED + AMBIGUOUS`; `UNDEFINED` se cuenta **aparte** como escenario candidato, aunque tenga ID `CA`. Contar requisitos únicos por capacidad/operación/nombre (distinguir homónimos por ubicación), no por número de escenarios. No contar un escenario candidato como cobertura verificable. Evitar copiar texto completo de las specs.

```markdown
# Criterios de aceptación: <cambio>

## Resumen
- Esquema y alcance: <schemaName>; <artefactos leídos, omitidos y faltantes pertinentes>.
- Requisitos analizados: N; criterios extraídos: N (DEFINED: N; AMBIGUOUS: N).
- Escenarios candidatos UNDEFINED: N; requisitos sin cobertura verificable: N.
- Estado: CLEAR | CLARIFICATION_REQUIRED | INSUFFICIENT_INFORMATION.

## Listado de criterios
### <capacidad> · REQ-001 — <nombre y operación>
- **CA-001 · DEFINED · <conducta>** — Origen: `ruta:línea`, escenario «…».
  - Given/When/Then: <solo pasos respaldados; omitir los desconocidos>.
  - Calidad: Claridad Adecuada; Verificabilidad Adecuada; Completitud Adecuada; Consistencia Adecuada; Trazabilidad Adecuada.
- **CA-002 · AMBIGUOUS · <conducta respaldada>** — Origen: `ruta:línea`.
  - Verificable: <parte que sí puede comprobarse>; pendiente: <dato que cambia el resultado>.
  - Calidad: <cinco dimensiones, causa concreta de cada Pendiente/No evaluable>.
### <capacidad> · REQ-002 — <nombre y operación>
- Sin criterio verificable: <causa concreta y evidencia `ruta:línea`>.

## Matriz de trazabilidad
| Requisito (origen) | Criterio | Estado | Verificación esperada |
| --- | --- | --- | --- |
| REQ-001 (`ruta:línea`) | CA-001 | DEFINED | <comportamiento observable a comprobar, no prueba existente> |
| REQ-002 (`ruta:línea`) | — | Sin cobertura verificable | Por definir |
| REQ-001 (`ruta:línea`) | CA-003 (candidato) | UNDEFINED (no aprobado) | Por definir; no obligatorio |

## Ambigüedades
- <ubicación y evidencia breve; interpretación abierta o fuentes contradictorias; consecuencia funcional; dato necesario>.

## Escenarios candidatos
- **CA-003 · UNDEFINED (no aprobado)** — Origen motivador: REQ-001 (`ruta:línea`); relevancia: <por qué>; situación: <condición>; resultado: **por definir**. <Distinguir una exclusión expresa>.
  - Calidad: <cinco dimensiones; No evaluable donde dependa de un resultado aprobado, motivo concreto y trazabilidad al requisito motivador>.

## Preguntas pendientes
1. **Prioridad alta** — <decisión funcional concreta> (origen REQ-001; motivo e impacto en el comportamiento).

## Evaluación general
**Estado: CLEAR | CLARIFICATION_REQUIRED | INSUFFICIENT_INFORMATION.** <justificación breve, límites y siguiente paso en OpenSpec>.
```

Incluir las siete secciones aun cuando alguna diga «Ninguna»; no generar filas ficticias. Si no hay requisitos funcionales porque el cambio excluye explícitamente cambios de comportamiento (`skip_specs: true` u otro esquema equivalente), reportar cero criterios, «no aplica» y `CLEAR` **solo si** el alcance disponible confirma que esa ausencia es intencional. Si faltan documentos indispensables o una fuente base necesaria para interpretar la operación, `INSUFFICIENT_INFORMATION` con resultados parciales. Si hay conflicto o ambigüedad funcional que impide decidir el comportamiento, `CLARIFICATION_REQUIRED`; también si un escenario candidato relevante necesita una decisión antes de implementar. `CLEAR` requiere evidencia suficiente y ninguna ambigüedad crítica pendiente; escenarios candidatos no críticos pueden quedar como recomendaciones explícitamente opcionales sin degradar `CLEAR`. La falta de un escenario formal sin ambigüedad funcional es una limitación documental para resolver con OpenSpec, no licencia para inventar pasos ni por sí sola una contradicción.

En reejecuciones con informe anterior disponible, añadir bajo el resumen una nota breve de «vigentes, modificados, nuevos, resueltos/retirados» con sus IDs; señalar un CA anterior sin respaldo documental actual como retirado o no sustentado, nunca mantenerlo como requisito vigente. No rellenar huecos reutilizando IDs ni comparar solo números de línea. En contradicciones, citar las dos ubicaciones. Si una referencia a `REQ-…` procede de la propuesta porque falta spec, indicarlo. Cuando no pueda justificarse un criterio respaldado, señalar la falta de cobertura en vez de crear un CA ficticio. Esta evaluación no certifica tests, arquitectura, seguridad ni implementación y no sustituye `@ac-openspec-review`.
