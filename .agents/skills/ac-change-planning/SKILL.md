---
name: ac-change-planning
description: Crea planes técnicos verificables para cambios de software. Activa esta skill cuando el usuario pida planificar, descomponer, ordenar o preparar la ejecución de una tarea, aunque no proporcione un Analysis Report, un identificador OpenSpec ni una delegación previa; inspecciona el contexto mínimo necesario y no implementes el cambio.
---

# Planificación de cambios

Convierte una petición de cambio en un plan de ejecución claro, comprobable y
acotado. La skill es un workflow iniciado por el usuario: trabaja con la
petición y el estado disponible del repositorio, sin esperar un prompt de
orquestador, un informe de otra skill ni un `Scope` implícito.

## Límites

- Produce planificación; no implementes, edites, elimines ni corrijas archivos.
- No delegues, no crees subagentes y no asignes ownership o permisos de agentes.
- No presentes estas instrucciones como una barrera de permisos: una skill se
  carga dentro del agente actual. Si se requiere aislamiento read-only efectivo,
  el agente seleccionado y sus permisos deben proporcionarlo.
- No inventes rutas, dependencias, criterios ni decisiones. Marca como
  `UNKNOWN`, `BLOCKED` o pendiente aquello que no pueda confirmarse.
- No repitas una exploración global. Lee primero la petición y el contexto que
  el usuario entregue; inspecciona solo archivos, configuración o contratos
  directamente relevantes para cerrar una decisión del plan.
- El plan debe ser autosuficiente y ejecutable por el agente principal. La
  delegación, un orquestador o un agente sugerido son opcionales, nunca un
  prerrequisito. Mantén el trabajo de planificación read-only: no edites el
  repositorio ni produzcas cambios como efecto colateral.

## Método

### 1. Delimitar el cambio

Extrae el objetivo, resultado esperado, alcance, exclusiones, restricciones,
criterios de aceptación y validaciones conocidas. Distingue los datos
esenciales para delimitar el trabajo (por ejemplo, una ruta, una opción de
compatibilidad o una decisión que cambie el contrato) de los datos que pueden
confirmarse durante una unidad.

Si falta un dato esencial, no explores globalmente para inferirlo: devuelve un
plan mínimo marcado `BLOCKED`, pide únicamente ese dato exacto y detén la
planificación que dependa de él. Ese plan mínimo puede enumerar las unidades
independientes que sí estén suficientemente delimitadas, pero no inventa rutas,
decisiones ni criterios para la unidad bloqueada. La ausencia de un Analysis
Report, de una delegación o de contexto formal no es por sí sola un bloqueo.

### 2. Inspeccionar el contexto mínimo

Cuando la petición no sea suficiente, realiza una inspección proporcional:

1. Identifica la raíz y el estado relevante del repositorio, sin modificarlo.
2. Busca las rutas, símbolos, contratos, configuración y pruebas directamente
   relacionados con el objetivo.
3. Amplía la lectura únicamente a una dependencia crítica o consumidor que
   cambie la delimitación, el orden o la validación.
4. Distingue hechos confirmados, supuestos e incertidumbres con evidencia.

Si el usuario ya proporcionó contexto suficiente, úsalo sin volver a explorar
todo el repositorio. Si falta información esencial, no hagas esta inspección:
solicita primero el dato faltante. No ejecutes comandos con efectos
secundarios.

### 3. Formar unidades ejecutables

Divide por resultados cohesionados y verificables. Cada unidad debe tener áreas
exclusivas: no asignes el mismo archivo o área modificable a dos unidades.
Prefiere una sola unidad cuando dividir añada coordinación sin una ganancia
real. Separa el trabajo que pueda avanzar independientemente del que dependa de
una decisión, contrato, salida o validación anterior. Si una unidad dependiente
queda `BLOCKED`, conserva y planifica las unidades independientes que ya tengan
alcance, archivos y criterios suficientes; no bloquees el plan completo.

Cuando varias unidades consuman un contrato compartido, asigna la definición y
el cambio del contrato a una única unidad propietaria. Registra cada consumidor
en `Dependencies` apuntando a ese contrato/unidad, aunque sus archivos sean
exclusivos; no repartas la propiedad del contrato ni dupliques su modificación.
Si documentación, validación o retirada tienen archivos, responsables o
criterios distintos, conviértelas en unidades separadas y enlázalas a las
unidades cuyo resultado necesiten.

Para cada unidad define `Scope` y `Out of Scope` por separado. Incluye una
validación concreta que pueda demostrar el resultado, no solo una actividad
genérica como “revisar cambios”.

### 4. Ordenar y decidir

- Usa `Parallel` solo cuando las unidades no compartan áreas modificables ni
  dependan de resultados ajenos.
- Usa `Sequential` cuando una unidad consuma una salida, contrato, decisión o
  validación previa; explica la razón. Una dependencia bloqueada no impide
  marcar como `Parallel` y planificar otra unidad independiente.
- Indica condiciones de inicio, integración posterior y el punto donde debe
  detenerse el trabajo si aparece un bloqueo.
- Si el alcance no puede cerrarse con evidencia suficiente, conserva la unidad
  como `BLOCKED`. Para un dato esencial ausente, el informe debe pedir solo la
  ruta, opción o decisión concreta que falta; no sustituyas esa petición por
  una exploración global ni por supuestos.

## Formato de salida

Devuelve únicamente el informe Markdown siguiente, sin preámbulos ni bloques de
código. Sustituye los marcadores por información concreta; usa `None` solo
cuando la ausencia esté confirmada.

# Execution Plan

## Objective

Resume el objetivo y el resultado verificable esperado.

## Scope and Assumptions

Indica:

- **Scope:** lo que se ejecutará.
- **Out of Scope:** lo que se excluye explícitamente.
- **Assumptions:** supuestos respaldados o necesarios.
- **Uncertainties:** dudas, evidencia faltante y decisiones requeridas.

## Work Breakdown

Para cada unidad usa exactamente esta información. Marca `BLOCKED` en el nombre
u objetivo cuando corresponda y señala el dato exacto que la desbloquea.

### Unit N — nombre breve

- **Objective:** resultado único de la unidad.
- **Files/Areas:** rutas o áreas exclusivas asignadas.
- **Required Context:** información mínima para ejecutarla.
- **Dependencies:** unidades, contratos o decisiones previas; `None` si no hay.
- **Mode:** `Parallel` o `Sequential`, con razón breve.
- **Suggested Agent:** rol recomendado o `agente principal`; es informativo, no
  obligatorio. No inventes un agente ni dependas de una delegación.
- **Validation:** comprobación concreta y evidencia esperada.
- **Scope:** límites incluidos en esta unidad.
- **Out of Scope:** exclusiones específicas de esta unidad.

## Dependency Graph

Representa las relaciones entre unidades. Señala grupos `Parallel`, enlaces
`Sequential` y razones. Usa `None` si todas son independientes.

## Execution Order

Enumera el orden recomendado, las condiciones para iniciar cada grupo, los
resultados que deben pasar al siguiente y la integración posterior.

## Integration and Validation

Describe cómo comprobar que las unidades encajan: contratos entre fronteras,
archivos compartidos, pruebas, documentación, configuración y validaciones
finales aplicables. Distingue validaciones planificadas de las no ejecutadas.

## Risks and Decision Points

Lista riesgos con impacto y mitigación, bloqueos posibles, decisiones pendientes
y puntos de control para detener, dividir de nuevo o cambiar el orden. No
resuelvas por suposición una decisión que amplíe el alcance.

## Summary for Orchestrator

Resume la estrategia, el número recomendado de unidades, los grupos paralelos o
secuenciales, las validaciones clave, el alcance excluido y la siguiente acción.

Aunque el encabezado conserve este nombre por compatibilidad con el formato
histórico, el resumen está dirigido al usuario o al agente principal; no implica
que exista un orquestador, una sesión hija ni una continuación automática.
