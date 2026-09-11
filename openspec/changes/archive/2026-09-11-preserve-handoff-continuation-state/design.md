## Context

La guia portable ya define que un `HANDOFF` deja incompleta la delegacion, que la sesion agotada es terminal y que la continuacion debe crear una `Task` nueva sin reutilizar `task_id`. El problema restante esta en el contenido del prompt nuevo: la regla actual menciona el HANDOFF completo, pero no exige conservar de forma operativa sus conclusiones ni evita una inspeccion amplia del repositorio.

La especificacion de `opencode-integration` ya define las secciones que produce el worker y la diferencia entre continuacion normal y continuacion por agotamiento. La implementacion debe cambiar solo la guia portable, sin alterar el plugin que detecta el limite ni los contratos de los agentes que producen el HANDOFF.

## Goals / Non-Goals

**Goals:**

- Hacer normativo que el prompt de la sesion hija contenga el objetivo original y un paquete compacto de estado relevante.
- Mantener conocimiento no persistido de workers exploratorios y progreso persistido de workers de implementacion.
- Evitar la rediscovery amplia mediante una verificacion dirigida contra `Remaining` y `Next action`.
- Permitir cadenas de HANDOFF con un estado rolling acotado y un objetivo original estable.

**Non-Goals:**

- Cambiar la creacion de la sesion hija, el descarte de `task_id` o la terminacion logica de la sesion agotada.
- Cambiar la generacion, validacion o deteccion del HANDOFF.
- Copiar conversaciones, invocaciones de herramientas, dumps de archivos o hipotesis descartadas.
- Modificar agentes, plugins, comandos, skills, `opencode.jsonc`, codigo fuente o tests.

## Decisions

### Una regla cohesionada junto a la delegacion

La aclaracion se incorporara en la subseccion existente de continuacion tras HANDOFF, junto a las reglas que ya gobiernan la creacion de workers. Esto evita repartir la precedencia entre `Delegacion` y `Coordinacion y salida`, donde una regla generica podria volver a introducir la reanudacion o la rediscovery amplia.

Alternativa descartada: añadir instrucciones en cada agente. El problema pertenece al orquestador y hacerlo por rol duplicaria el protocolo y no cubriria agentes exploratorios de forma consistente.

### Objetivo original separado del estado del HANDOFF

El prompt nuevo conservara el objetivo delegado original como una seccion estable y separada. El HANDOFF aportara el estado de progreso de la sesion anterior, pero no podra sustituir la intencion parental por su resumen parcial o por `Remaining`.

Alternativa descartada: usar solo la seccion `Objective` del HANDOFF. Eso permite que el objetivo se degrade o se pierda en cadenas y no garantiza que coincida con el alcance parental.

### Paquete compacto derivado del HANDOFF mas reciente

El orquestador extraera las conclusiones necesarias para continuar: `Completed`, `Remaining`, `Decisions`, `Files changed`, `Relevant files`, riesgos o hallazgos importantes, `Verification`, `Next action` y restricciones parentales aplicables. Omitira detalles recuperables y conservara solo entradas relevantes para la subtarea pendiente.

En una cadena, el siguiente paquete reemplazara el anterior por el estado rolling actualmente relevante. No se anidaran HANDOFF completos ni se transportara el historial conversacional.

Alternativa descartada: pasar un resumen minimo como “continua la tarea”. Ese mensaje no conserva hallazgos de exploracion ni decisiones que no existan en el repositorio.

### Verificacion dirigida y autoridad del repositorio

El worker nuevo verificara solo los archivos o estados relacionados con el trabajo restante y la siguiente accion. Si el estado actual contradice el HANDOFF, prevalecera el repositorio; la discrepancia se investigara solo en el area afectada. El worker no repetira trabajo completado salvo evidencia de que falta, esta obsoleto, es incorrecto o es inconsistente.

Alternativa descartada: ordenar “inspeccionar el repositorio” sin limitar el alcance. Esa formulacion fomenta reconstruir todo el contexto y neutraliza el beneficio de una sesion fresca con continuidad.

### Restricciones parentales como parte del contrato

El paquete incluira solo las restricciones necesarias para continuar, como “no editar”, “no delegar”, scope de analisis o archivos autorizados. Una sesion nueva no heredara implicitamente capacidades o permisos que no se hayan transferido.

## Risks / Trade-offs

- [La guia no ejecuta por si sola el comportamiento del orquestador] -> Usar lenguaje normativo y describir por separado la sesion nueva, el payload requerido y la verificacion dirigida.
- [Un HANDOFF puede quedar desactualizado por cambios concurrentes] -> Tratar el repositorio actual como autoridad y limitar la comprobacion a la superficie relevante.
- [El paquete puede crecer en cadenas largas] -> Reemplazar el estado anterior por un resumen rolling y excluir historial, comandos y contenido recuperable.
- [La exploracion puede producir conocimiento que no sobrevive en archivos] -> Exigir la transferencia de hallazgos confirmados, decisiones, riesgos, rutas relevantes y preguntas pendientes.

## Migration Plan

1. Actualizar solo `integrations/opencode/AGENTS.md` en la subseccion existente de continuacion tras HANDOFF.
2. Comprobar que el diff conserva la regla de crear una sesion nueva sin `task_id` y que no cambia la continuacion normal.
3. Validar la especificacion y revisar que el estado del cambio enumere todos los artifacts requeridos.
4. Dejar la sincronizacion manual con `~/.config/opencode/` fuera de este cambio, conforme a la documentacion existente.
