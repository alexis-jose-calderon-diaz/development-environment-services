# Guía compartida del toolkit portable

Estas reglas aplican únicamente a los recursos incluidos en este scope. No asumen una ruta, una instalación operativa, una política global ni un repositorio consumidor concreto.

## Reglas comunes

- Responde en español salvo que el usuario solicite otro idioma; conserva en su idioma original los nombres técnicos.
- Mantén las convenciones existentes y explica de forma directa objetivos, decisiones, cambios, validaciones y riesgos.
- Usa herramientas orientadas a búsqueda y lectura; para JSON o YAML prefiere salida estructurada.
- Inspecciona el estado antes de editar y realiza el cambio mínimo dentro del alcance autorizado.
- No reveles secretos ni ejecutes operaciones destructivas o irreversibles sin autorización explícita.
- Si un problema queda fuera del alcance, infórmalo como riesgo o pendiente en lugar de corregirlo silenciosamente.

## Prioridad del workdir

- Prioriza resolver la tarea dentro del `workdir` actual antes de acceder a recursos externos.
- Accede fuera del `workdir` solo como último recurso necesario, limita la operación al recurso concreto y justifica el motivo.
- El acceso externo no amplía el `Scope` autorizado ni justifica explorar otras áreas.

## Agentes portables

Estos cinco agentes forman el conjunto portable. Sus archivos individuales contienen el método, los límites detallados y el formato de salida de cada rol.

| Agente | Uso principal | Edición |
| --- | --- | --- |
| `analyzer` | Estado, impacto, superficie y riesgos | Solo lectura |
| `planner` | Plan verificable a partir del análisis | Solo lectura |
| `implementer` | Una unidad atómica y su validación | Edición acotada |
| `reviewer` | Resultado contra objetivo, alcance y criterios | Solo lectura |
| `integration-checker` | Fronteras y correcciones de integración | Edición acotada |

Consulta `agents/<name>.md` para el contrato completo; no dupliques sus procedimientos en esta guía.

## Delegación

El orquestador entrega un prompt autocontenido y proporcional a la tarea. Transporta solo hechos, decisiones, dependencias y criterios que condicionen el trabajo.

Incluye, cuando sean necesarios para delimitar y validar la subtarea:

- `Objective`
- `Scope`
- `Out of Scope`
- `Repository Context`
- `Relevant Files`
- `Existing Behavior`
- `Desired Behavior`
- `Constraints`
- `Decisions Already Made`
- `Dependencies`
- `Acceptance Criteria`
- `Verification`

No transportes historiales, razonamientos completos ni contenido irrelevante. Si falta información para actuar dentro de un límite seguro, declárala en lugar de asumirla.

### Continuación tras HANDOFF de presupuesto

**Regla obligatoria: `HANDOFF => nueva sesión hija`.** Cuando un worker delegado devuelve una respuesta de nivel superior `## HANDOFF` porque agotó su presupuesto de contexto, el objetivo sigue incompleto y la sesión que emitió el HANDOFF queda agotada y es terminal para esa delegación.

- No reanudes esa sesión ni reutilices su `task_id` o cualquier identificador equivalente de continuación.
- Crea una nueva `Task` con el tipo de agente apropiado y omite el `task_id` anterior. El mismo tipo de agente, como `implementer`, puede usarse otra vez, pero la sesión debe ser nueva.
- Pasa al nuevo worker solo el objetivo original, el HANDOFF estructurado completo y las restricciones parentales necesarias. No copies conversaciones completas ni historiales.
- Indica al nuevo worker que inspeccione el estado actual del repositorio antes de continuar. El repositorio es la fuente de verdad; no repita elementos de `Completed` salvo que falten o sean incorrectos.
- Trata cada HANDOFF posterior de la misma manera: crea otra sesión nueva sin reutilizar identificadores, sin límite artificial de encadenamiento.
- Un HANDOFF no es finalización ni bloqueo: no reportes éxito, no avances a revisión y no solicites confirmación al usuario. Si contiene además un bloqueo genuino, aplica el manejo existente para ese bloqueo.

Una respuesta normal sin HANDOFF puede continuar en la sesión existente mediante su `task_id` cuando el orquestador necesite un seguimiento intencional. Esta excepción no aplica a una sesión que ya emitió un HANDOFF.

## Coordinación y salida

- Divide solo el trabajo que se beneficie de unidades independientes y verificables.
- Ejecuta en paralelo únicamente unidades que no compartan archivos modificables ni dependan de resultados ajenos.
- Mantén un único responsable por archivo durante una fase de edición.
- Ejecuta solo validaciones relevantes y registra comando, resultado y superficie cubierta.
- Informa por separado cambios, validaciones no ejecutadas, riesgos y pendientes.
