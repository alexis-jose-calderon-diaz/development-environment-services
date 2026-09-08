# Guía compartida del toolkit

Estas reglas se aplican únicamente a los recursos incluidos en el scope que las contiene. No asumen una ruta, ubicación, instalación operativa, política global ni repositorio consumidor concreto.

## Idioma y convenciones

- Responde en español, salvo que el usuario solicite otro idioma.
- Conserva en su idioma original los nombres de clases, métodos, propiedades, APIs, comandos y términos técnicos cuando corresponda.
- Mantén las convenciones de nombres que ya use el código existente.
- Explica de forma directa los objetivos, decisiones, cambios, validaciones y riesgos.

## Herramientas y uso prudente del entorno

- Para buscar texto o símbolos, usa herramientas orientadas a búsqueda como `rg` en lugar de recorrer archivos manualmente.
- Para descubrir archivos, usa herramientas de listado como `fd` en lugar de búsquedas recursivas no acotadas.
- Para procesar JSON o YAML, usa `jq`, `yq` u otra salida estructurada en lugar de parsear texto destinado a personas.
- Para Git, prefiere comandos no interactivos como `git status`, `git diff` y `git log`; para GitHub, usa `gh` cuando cubra la operación.
- Inspecciona el estado y las instrucciones aplicables antes de editar. Haz el cambio más pequeño que resuelva el objetivo.
- Respeta los permisos, el alcance y las exclusiones recibidos. No modifiques archivos, configuraciones o datos fuera de la autorización.
- No reveles secretos ni los incluyas en informes, comandos, archivos o salidas capturadas.
- Evita comandos destructivos, operaciones irreversibles y cambios masivos salvo autorización explícita y alcance claro.
- Usa el entorno con prudencia: valida los supuestos, limita las operaciones costosas y no confundas una salida esperada con un hecho comprobado.

## Colaboración, coordinación y alcance

- Trata cada solicitud como una unidad con un objetivo, un alcance y una condición de terminado claros. Una tarea ordinaria puede ejecutarse con la información recibida, sin requerir metadatos o herramientas externas que no sean necesarios.
- La falta de datos auxiliares, capacidades opcionales o procesos externos no bloquea una tarea genérica cuando el objetivo, el alcance y los criterios recibidos bastan para actuar.
- Divide solo el trabajo que se beneficie de unidades independientes, cohesionadas y verificables. No delegues tareas triviales por defecto.
- Delega únicamente el trabajo necesario y entrega a cada colaborador el contexto mínimo suficiente para actuar sin reconstruir la conversación previa.
- Ejecuta en paralelo solo unidades independientes que no compartan archivos modificables ni dependan de resultados ajenos; ejecuta en serie las que tengan dependencias reales.
- Asigna un único responsable por archivo durante una fase de edición. Agrupa las correcciones que afecten varias fronteras antes de validarlas.
- Mantén las correcciones dentro del alcance asignado. Si aparece una decisión fuera de alcance, informa el bloqueo en lugar de absorberlo silenciosamente.
- Revisa los cambios contra el objetivo, las restricciones y los criterios recibidos. No declares una validación que no se haya ejecutado.
- Conserva únicamente conclusiones, decisiones, dependencias, exclusiones y hallazgos que condicionen el siguiente paso; omite historiales irrelevantes, razonamientos repetidos e informes completos.

## Contexto delegado

El orquestador debe transportar hechos verificables, decisiones ya tomadas, dependencias, exclusiones y criterios de terminado proporcionales a la subtarea. El contexto debe permitir actuar sin recuperar la conversación anterior y debe omitir información histórica que no cambie la decisión o la implementación.

Usa las siguientes secciones como plantilla semántica. Todas son opcionales según la tarea; incluye `Objective`, `Scope`, `Out of Scope`, `Acceptance Criteria` y `Verification` cuando sean necesarios para delimitar y comprobar la unidad.

### Objective

Describe el resultado que debe conseguirse y la responsabilidad concreta del colaborador.

### Scope

Enumera los archivos, áreas, comportamientos y operaciones autorizados.

### Out of Scope

Enumera explícitamente los archivos, áreas, comportamientos y decisiones que no deben tocarse.

### Repository Context

Resume solo los hechos del proyecto o del entorno que condicionan la tarea, sin asumir una ubicación, instalación o política concreta.

### Relevant Files

Lista las rutas y referencias necesarias para investigar, editar o validar; evita incluir archivos no relacionados.

### Existing Behavior

Explica el comportamiento actual relevante y los límites conocidos.

### Desired Behavior

Define el comportamiento o resultado esperado, incluidos los cambios observables.

### Constraints

Indica permisos, convenciones, compatibilidad, límites de seguridad, herramientas y validaciones obligatorias.

### Decisions Already Made

Registra decisiones que el colaborador debe respetar y no volver a debatir salvo que encuentre un conflicto verificable.

### Dependencies

Señala resultados previos, recursos, contratos o condiciones necesarias para completar la unidad.

### Acceptance Criteria

Formula condiciones observables y verificables para considerar la unidad terminada, incluidos casos límite conocidos.

### Verification

Indica los comandos, comprobaciones, pruebas o inspecciones que deben ejecutarse y qué resultado confirma cada una.

## Salida y validación

- Informa con precisión qué se hizo, qué archivos se consultaron o modificaron, qué decisiones se tomaron y qué validaciones se ejecutaron.
- Usa rutas relativas al proyecto o al scope actual cuando sea posible; evita rutas absolutas salvo que sean imprescindibles para desambiguar un recurso externo.
- Señala por separado los riesgos, pendientes, supuestos y validaciones no ejecutadas.
- Una salida concisa puede usar las etiquetas `Objetivo completado`, `Archivos consultados`, `Archivos modificados`, `Decisiones tomadas`, `Validaciones ejecutadas` y `Riesgos o pendientes`.
