# Reglas globales

- Responde siempre en español.
- Mantén nombres de clases, métodos, propiedades, APIs, comandos y términos técnicos en su idioma original cuando corresponda.
- Genera explicaciones, análisis, planes, resúmenes y mensajes para el usuario en español.
- Si el código existente utiliza nombres en inglés, conserva esa convención.

## Estrategia de orquestación de tareas

Estas reglas son transversales y aplican a cualquier proyecto, lenguaje o tipo de trabajo.

- Para tareas grandes o no triviales, el agente principal debe actuar principalmente como orquestador y delegar el trabajo en lugar de intentar resolverlo todo directamente.
- Antes de implementar, divide el trabajo en subtareas pequeñas, cada una con un único objetivo, alcance claro, pocos archivos involucrados, resultado verificable y el mínimo contexto necesario.
- Ejecuta subtareas en paralelo únicamente cuando sean independientes, no modifiquen los mismos archivos y no dependan del resultado de otra subtarea.
- Ejecuta subtareas en serie cuando exista una dependencia real entre ellas.
- Prefiere subagentes especializados para exploración, análisis, implementación, pruebas y revisión.
- Cuando el trabajo ya esté dividido, asigna la implementación al `implementer`. Después de implementar, usa `reviewer` para evaluar la corrección de cada unidad e `integration-checker` cuando deba verificarse la coherencia entre múltiples piezas. Estos roles se complementan y no deben sustituirse entre sí.
- Delega las investigaciones del repositorio cuando sea posible para evitar que la sesión principal lea grandes cantidades de archivos.
- Entrega a cada subagente únicamente el contexto necesario para su unidad de trabajo.
- Una sesión hija no debe representar una feature completa si esta puede dividirse en unidades más pequeñas.
- Cada sesión hija debe corresponder preferentemente a una unidad atómica, concreta y descartable.
- No permitas que dos subagentes modifiquen simultáneamente los mismos archivos. Si dos subtareas afectan los mismos archivos, ejecútalas secuencialmente o asígnalas al mismo agente.
- Después de cambios significativos, prefiere un subagente distinto para revisar el resultado.
- El revisor debe trabajar principalmente con el objetivo original, el diff actual y las restricciones relevantes.
- Si existe un plan, una especificación OpenSpec o una lista de tareas previamente definida, úsala como fuente para identificar unidades delegables.
- Cuando el trabajo pueda modelarse como un grafo de dependencias, usa esta estrategia: tareas independientes -> paralelo; tareas dependientes -> serie; integración -> revisión.
- No delegues artificialmente tareas triviales cuando la sobrecarga de crear y coordinar un subagente supere el beneficio.
- Mantén el balance entre aislamiento de contexto, número de agentes, dependencias y riesgo de conflictos.
- Al terminar una subtarea, conserva únicamente un resumen accionable y no toda la conversación del subagente.
- El resultado de cada subagente debe ser conciso y utilizar preferentemente estas etiquetas: `Objetivo completado`, `Archivos consultados`, `Archivos modificados`, `Decisiones tomadas`, `Validaciones ejecutadas` y `Riesgos o pendientes`.
- Evita devolver logs extensos, código completo innecesario, contenido de archivos sin relación directa y explicaciones repetitivas.

## Evaluación previa de complejidad

Antes de dividir una tarea grande en subagentes y decidir cuántos utilizar y cómo distribuir el trabajo:

- Para toda tarea grande o no trivial que pueda requerir división, el agente principal debe invocar primero al subagente global `context-planner` para realizar el reconocimiento y la estimación de superficie de contexto antes de crear otros subagentes.
- Las tareas cotidianas o triviales no necesitan pasar por `context-planner`; resuélvelas directamente cuando no exista una necesidad real de planificación.
- `context-planner` se encarga únicamente del análisis y la recomendación inicial; no debe recibir tareas de implementación, edición ni revisión final.
- Identifica los módulos, features o áreas probablemente afectadas.
- Identifica los archivos relevantes sin leerlos completamente cuando no sea necesario.
- Obtén, cuando sea posible, la cantidad aproximada de archivos involucrados, el tamaño de cada archivo, las líneas aproximadas de código, la distribución de archivos por módulo o feature, los archivos especialmente grandes, los archivos compartidos o de alta centralidad y las dependencias entre los archivos afectados.
- El objetivo de esta fase no es comprender todavía toda la implementación, sino estimar cuánto contexto será necesario para resolver el trabajo.

## Uso de la superficie de contexto

- Utiliza la evaluación de superficie para decidir el nivel de división.
- No dividas únicamente por cantidad de tareas funcionales.
- Considera también cuánto código tendría que cargar un agente para resolver cada subtarea.
- Tres archivos pequeños y fuertemente relacionados pueden mantenerse en una sola subtarea.
- Tres archivos muy grandes pueden requerir varias subtareas.
- Quince archivos pequeños de una misma feature pueden ser manejables por un solo agente si comparten un contexto reducido.
- Ocho archivos distribuidos entre backend, frontend, contratos y pruebas probablemente deben separarse.
- Un archivo extremadamente grande puede justificar una investigación previa independiente aunque sea el único archivo afectado.

## Criterios de división

Utiliza conjuntamente los siguientes criterios:

- Cantidad de archivos.
- Tamaño de los archivos.
- Cantidad aproximada de líneas.
- Número de módulos afectados.
- Separación arquitectónica.
- Dependencias entre cambios.
- Posibilidad de paralelización.
- Riesgo de conflictos.
- Cantidad de contexto que deberá leer cada agente.

La métrica principal no debe ser cuántos archivos hay, sino:

> cuánto contexto necesita mantener simultáneamente un agente para completar correctamente su unidad de trabajo.

## Presupuesto de contexto por subtarea

- Intenta que cada subtarea pueda resolverse leyendo únicamente una fracción pequeña y coherente del repositorio.
- Si una subtarea requiere cargar demasiados archivos o archivos muy grandes, subdivídela nuevamente antes de ejecutarla.
- Prefiere una subtarea con entre 3 y 8 archivos relacionados y contexto específico sobre otra con 25 archivos, múltiples módulos y contexto heterogéneo.
- Estos números son orientativos y no límites rígidos. La cohesión del contexto tiene prioridad sobre la cantidad exacta de archivos.

```text
Subtarea
|-- 3-8 archivos relacionados
`-- contexto específico
```

## Archivos grandes

Cuando un archivo sea especialmente grande:

1. Identifica primero las secciones relevantes.
2. Evita cargar el archivo completo si las herramientas de búsqueda permiten localizar el área necesaria.
3. Considera una subtarea de análisis específica.
4. Entrega al siguiente agente únicamente las ubicaciones y conclusiones necesarias.

```text
analysis-large-file
      |
      v
"Modificar líneas/secciones relacionadas con X"
      |
      v
implementation
```

## Determinación del número de subagentes

- No establezcas previamente un número fijo de subagentes.
- Determina el número dinámicamente después de evaluar la superficie de trabajo.
- Busca el menor número de subagentes que permita mantener contextos pequeños, aprovechar paralelismo real, evitar duplicación de investigación, minimizar conflictos de edición y mantener claras las dependencias.
- No crees subagentes solamente para aumentar el paralelismo.

## Fase de planificación

Para tareas grandes utiliza preferentemente este flujo:

```text
1. Reconocimiento
      |
      v
2. Estimación de superficie de contexto
      |
      v
3. Construcción del grafo de subtareas
      |
      v
4. Identificación de tareas paralelas y secuenciales
      |
      v
5. Ejecución
      |
      v
6. Integración
      |
      v
7. Revisión
```

- Durante el reconocimiento y la estimación de superficie de contexto, evita una exploración profunda.
- Mantén esta fase barata en tokens y orientada exclusivamente a decidir cómo distribuir el trabajo.

## Principio de decisión

Antes de delegar, el orquestador debe poder responder:

- ¿Cuántos archivos probablemente están involucrados?
- ¿Qué tan grandes son?
- ¿Qué archivos pertenecen al mismo contexto?
- ¿Qué archivos pueden analizarse independientemente?
- ¿Qué cambios tienen dependencias?
- ¿Qué tareas pueden correr en paralelo?
- ¿Qué tareas podrían generar conflictos?
- ¿Cuánto contexto tendría que mantener cada agente?

Solo después de responder estas preguntas debe decidir cuántos subagentes crear y qué responsabilidad asignar a cada uno.

## Estrategia de protección del contexto

- El objetivo es evitar que una sola sesión acumule toda la investigación y la implementación.
- Las sesiones de subagentes deben nacer para resolver una unidad concreta, producir un resultado verificable y terminar.
- Las sesiones hijas no deben convertirse en conversaciones permanentes ni conservar contexto que ya no sea necesario.
- Cuando una subtarea nueva no necesite el contexto interno de una sesión anterior, iníciala en una sesión nueva.
- Transfiere información entre agentes mediante resúmenes y resultados accionables, no mediante historiales completos.
- La sesión principal debe conservar principalmente el objetivo global, el plan, las dependencias, las decisiones arquitectónicas, el estado de las subtareas, los resultados resumidos y los bloqueos.
- La sesión principal debe evitar la exploración exhaustiva, leer repetidamente los mismos archivos, implementar personalmente todas las subtareas y copiar respuestas completas de los subagentes.
- Considera la compactación de contexto un mecanismo de respaldo, no el flujo normal de trabajo. Prioriza la delegación, el contexto mínimo y los resúmenes antes de depender de ella.

## Criterios para considerar una tarea grande

Considera una tarea grande cuando presente una o más de estas señales:

- Involucra múltiples módulos o features.
- Requiere varias fases de trabajo.
- Afecta numerosos archivos.
- Necesita investigación extensa del repositorio o de fuentes externas.
- Combina cambios de backend y frontend.
- Modifica contratos, APIs o esquemas compartidos.
- Requiere migraciones.
- Requiere generación de código.
- Incluye pruebas de integración.
- Contiene subtareas independientes que pueden ejecutarse en paralelo.

## Análisis de cambios Git

Cuando necesites analizar o revisar cambios realizados en el código,
usa preferentemente:

git -c diff.external=difft diff

Usa `git diff` estándar cuando necesites el parche Git exacto,
por ejemplo para operaciones que dependan del formato tradicional del diff.
