# Reglas globales

- Responde siempre en español.
- Mantén nombres de clases, métodos, propiedades, APIs, comandos y términos técnicos en su idioma original cuando corresponda.
- Genera explicaciones, análisis, planes, resúmenes y mensajes para el usuario en español.
- Si el código existente utiliza nombres en inglés, conserva esa convención.

## Estrategia de orquestación de tareas

Estas reglas son transversales y aplican a cualquier proyecto, lenguaje o tipo de trabajo.

- Para tareas grandes o no triviales, el agente principal debe actuar principalmente como orquestador y delegar el trabajo en lugar de intentar resolverlo todo directamente.
- Antes de implementar, divide el trabajo en subtareas pequeñas y cohesionadas, cada una con un único objetivo, alcance claro, pocos archivos involucrados, resultado verificable y el mínimo contexto necesario. No dividas una unidad cohesionada únicamente por tipo de archivo si el mismo agente puede resolver de forma segura su código productivo, pruebas y contrato directamente relacionado.
- Ejecuta subtareas en paralelo únicamente cuando sean independientes, no modifiquen los mismos archivos y no dependan del resultado de otra subtarea.
- Ejecuta subtareas en serie cuando exista una dependencia real entre ellas.
- Prefiere subagentes especializados para exploración, análisis, implementación, pruebas e integración.
- Cuando el trabajo ya esté dividido, asigna cada unidad al `implementer`. Debe completar el código productivo, las pruebas y los contratos directamente relacionados con su unidad, ejecutar validaciones locales, comprobar el resultado y corregir los problemas dentro de su alcance antes de informar. Después de completar todas las unidades, usa `integration-checker` para verificar la coherencia entre múltiples piezas.
- Delega las investigaciones del repositorio cuando sea posible para evitar que la sesión principal lea grandes cantidades de archivos.
- Entrega a cada subagente únicamente el contexto necesario para su unidad de trabajo.
- Una sesión hija no debe representar una feature completa si esta puede dividirse en unidades más pequeñas, pero tampoco debe dividirse una unidad cohesionada en sesiones separadas de implementación, pruebas o contratos sin una dependencia real.
- Cada sesión hija debe corresponder preferentemente a una unidad atómica, concreta y descartable.
- No permitas que dos subagentes modifiquen simultáneamente los mismos archivos. Si dos subtareas afectan los mismos archivos, ejecútalas secuencialmente o asígnalas al mismo agente.
- Si existe un plan, una especificación OpenSpec o una lista de tareas previamente definida, úsala como fuente para identificar unidades delegables.
- Cuando el trabajo pueda modelarse como un grafo de dependencias, usa esta estrategia: tareas independientes -> paralelo; tareas dependientes -> serie; integración -> correcciones agrupadas, si son necesarias -> validación final.
- No delegues artificialmente tareas triviales cuando la sobrecarga de crear y coordinar un subagente supere el beneficio.
- Mantén el balance entre aislamiento de contexto, número de agentes, dependencias y riesgo de conflictos.
- Al terminar una subtarea, conserva únicamente un resumen accionable y no toda la conversación del subagente.
- El resultado de cada subagente debe ser conciso y utilizar preferentemente estas etiquetas: `Objetivo completado`, `Archivos consultados`, `Archivos modificados`, `Decisiones tomadas`, `Validaciones ejecutadas` y `Riesgos o pendientes`.
- Evita devolver logs extensos, código completo innecesario, contenido de archivos sin relación directa y explicaciones repetitivas.
- En todos los informes, planes, matrices, validaciones y resúmenes, referencia los archivos mediante rutas relativas a la raíz del proyecto o worktree, omitiendo la ruta absoluta y el prefijo de la raíz. Incluye los directorios necesarios para desambiguar, usa `/` como separador y no uses solo el nombre del archivo salvo que sea único y esté en la raíz; por ejemplo, `src/auth/services/login.ts:42`.
- Para archivos fuera del proyecto, usa una ruta relativa con `../` cuando sea posible e indica que están fuera del proyecto; evita rutas absolutas salvo que sean imprescindibles para identificar el recurso.

## Coordinación sin duplicación

- Antes de delegar, el `planner` debe entregar una matriz de ejecución con la unidad, archivos bajo responsabilidad, archivos fuera de alcance, criterios de aceptación, casos límite, validaciones requeridas y dependencias.
- La matriz debe garantizar que cada archivo modificable tenga un único responsable durante la fase de implementación. Si dos unidades necesitan el mismo archivo, deben ejecutarse en serie o consolidarse en una sola unidad. Cuando todas las unidades terminan, `integration-checker` puede modificar la superficie integrada como único responsable de las correcciones transversales.
- Los criterios de aceptación deben incorporar desde el inicio los casos límite relevantes, las pruebas de contrato, autorización, concurrencia, serialización o integración que correspondan. No postergues estos casos para una ronda genérica de refuerzo si ya son conocidos.
- No crees una subtarea posterior solo para repetir una validación o completar una prueba que formaba parte de los criterios de aceptación de una unidad. Crea una subtarea correctiva únicamente cuando exista un hallazgo nuevo, una dependencia descubierta o un cambio de alcance.
- Espera a que terminen todas las unidades planificadas antes de ejecutar la verificación de integración. `integration-checker` debe consolidar en un único informe los problemas de backend, contratos, clientes generados, frontend, persistencia y pruebas.
- Si la integración encuentra problemas, `integration-checker` debe agrupar y aplicar las correcciones compatibles dentro de la superficie afectada. Solo escala al responsable original o al agente principal los problemas que requieran una decisión, estén fuera del alcance o no puedan corregirse de forma segura. Evita crear una nueva sesión por cada problema aislado.
- Tras las correcciones agrupadas de integración, ejecuta validaciones focalizadas sobre las fronteras afectadas; no repitas la exploración global ni la suite completa sin una razón concreta.
- `integration-checker` es el gate de integración y puede editar la superficie afectada. No devuelvas al `implementer` un problema que el checker pueda corregir directamente; después de corregir, debe validar de nuevo las áreas afectadas.
- No reejecutes automáticamente `integration-checker` después de sus propias correcciones. Reejecútalo solo si una corrección modifica otra frontera o contrato, introduce un riesgo alto, deja pruebas insuficientes o requiere comprobar una dependencia nueva.
- `implementer` debe ejecutar validaciones focalizadas de su unidad, comprobar el resultado y reportar sus resultados. Las suites globales y las validaciones transversales deben concentrarse en la fase de integración y no repetirse innecesariamente en cada subtarea.
- Transfiere al siguiente agente la matriz, los resúmenes y los hallazgos relevantes; no le pidas repetir una exploración global que ya fue resuelta.

## Evaluación previa de complejidad

Antes de dividir una tarea grande en subagentes y decidir cuántos utilizar y cómo distribuir el trabajo:

- Para toda tarea grande o no trivial que pueda requerir división, el agente principal debe invocar primero al subagente global `analyzer` para conocer el estado actual, la superficie y el impacto del cambio.
- Después de recibir el `Analysis Report`, el agente principal debe invocar al subagente global `planner` para separar el análisis de la planificación y diseñar el alcance, las unidades, las dependencias y el orden de ejecución.
- El agente principal decide, a partir del análisis y del plan, si necesita delegar, cuántos agentes utilizar y qué unidades asignarles.
- Las tareas cotidianas o triviales no necesitan invocar `analyzer` ni `planner`; el agente principal puede resolverlas directamente cuando no exista una necesidad real de planificación.
- `analyzer` se encarga de la inspección inicial, la estimación de superficie, impacto y riesgos, y de recomendar a alto nivel el nivel general de paralelización y la cantidad necesaria de subagentes según la cohesión e independencia de la superficie; no debe descomponer unidades concretas, asignar agentes, construir el grafo de dependencias, fijar el orden exacto de ejecución, describir pasos concretos de código ni crear el plan detallado, editar o delegar.
- `planner` consume el informe de `analyzer` y las restricciones del usuario para diseñar el plan de ejecución; no debe implementar, editar ni corregir una implementación ni delegar.
- Durante el análisis, identifica los módulos, features o áreas probablemente afectadas.
- Durante el análisis, localiza los archivos relevantes sin leerlos completamente cuando no sea necesario.
- Durante el análisis, obtiene, cuando sea posible, la cantidad aproximada de archivos involucrados, el tamaño de cada archivo, las líneas aproximadas de código, la distribución por módulo o feature, los archivos especialmente grandes, los archivos compartidos o de alta centralidad y las dependencias entre los archivos afectados.
- El objetivo del análisis inicial no es comprender todavía toda la implementación, sino estimar cuánto contexto será necesario para que `planner` diseñe una ejecución segura y eficiente.

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
1. Análisis inicial (`analyzer`)
      |
      v
2. Planificación (`planner`, consumiendo el `Analysis Report`)
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
7. Correcciones agrupadas, si son necesarias
      |
      v
8. Revisión final
```

- Durante el análisis inicial, evita una exploración profunda y mantén la investigación acotada a la superficie e impacto del cambio.
- Durante la planificación, evita repetir el análisis global y usa únicamente inspecciones dirigidas para cerrar dependencias críticas.
- Durante la planificación, define explícitamente la propiedad de los archivos, los criterios de aceptación, los casos límite y las validaciones de cada unidad antes de iniciar la ejecución.
- Durante la integración, comprueba todas las fronteras afectadas en conjunto y consolida los problemas antes de solicitar correcciones.
- Después de la integración y de las correcciones agrupadas, ejecuta una validación focalizada sobre las áreas afectadas. No conviertas esta fase en una cadena de comprobaciones parciales salvo por un riesgo concreto.
- Mantén ambas fases baratas en tokens y orientadas exclusivamente a preparar una ejecución segura; la decisión final de delegar corresponde al agente principal.

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

Cuando necesites analizar cambios realizados en el código,
usa preferentemente:

git -c diff.external=difft diff

Usa `git diff` estándar cuando necesites el parche Git exacto,
por ejemplo para operaciones que dependan del formato tradicional del diff.
