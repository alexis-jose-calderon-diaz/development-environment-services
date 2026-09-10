# opencode-integration Specification

## Purpose

Define el comportamiento seguro de la integración global de OpenCode al trabajar con cambios OpenSpec y sus límites frente a la configuración local de cada proyecto.

## Requirements

### Requirement: Guia portable agnostica de workflow

La configuracion portable SHALL limitar sus reglas obligatorias a herramientas disponibles, comportamiento, seguridad y convenciones generales de trabajo. No SHALL exigir una declaracion, identificador, snapshot, comando o protocolo perteneciente a un workflow externo para iniciar una tarea generica. Al ejecutar una tarea, SHALL priorizar la resolucion dentro del `workdir` efectivo y SHALL permitir el acceso externo solo cuando un recurso necesario no pueda obtenerse dentro de esa superficie. La guia y los contratos de agentes SHALL no imponer un formato general de rutas como condicion para trabajar.

#### Scenario: Tarea generica sin contexto externo

- **WHEN** un agente recibe una tarea ordinaria sin contexto de un workflow especifico
- **THEN** puede analizar, planificar, implementar o integrar respetando el objetivo y las restricciones recibidas, sin devolver `BLOCKED` por la ausencia de un identificador externo

#### Scenario: Toolkit instalado en otro proyecto

- **WHEN** la configuracion portable se aplica en un repositorio consumidor con sus propias reglas y workflows
- **THEN** las reglas del toolkit siguen siendo validas sin asumir una estructura de artifacts, una branch, una ruta de planificacion o un CLI del consumidor

#### Scenario: Resolucion prioritaria dentro del workdir

- **WHEN** los recursos disponibles dentro del `workdir` son suficientes para resolver la tarea
- **THEN** el agente trabaja con esa superficie sin buscar ni acceder externamente de forma innecesaria

#### Scenario: Recurso externo necesario

- **WHEN** un recurso necesario no esta disponible dentro del `workdir`
- **THEN** el agente puede acceder al recurso externo concreto, limita la operacion a lo necesario, explica el motivo y no amplia por ello el `Scope` autorizado para modificar archivos

#### Scenario: Rutas adecuadas al contexto

- **WHEN** una herramienta o un resultado requiere representar una ruta
- **THEN** el agente usa el formato valido para esa herramienta y contexto, sin bloquear la tarea unicamente por no usar rutas relativas

### Requirement: Contexto estructurado para delegacion

El orquestador SHALL entregar a cada sub-agente un prompt autocontenido y proporcional a la tarea, usando cuando sean relevantes las secciones `Objective`, `Scope`, `Out of Scope`, `Repository Context`, `Relevant Files`, `Existing Behavior`, `Desired Behavior`, `Constraints`, `Decisions Already Made`, `Dependencies`, `Acceptance Criteria` y `Verification`. SHALL transportar hechos, decisiones, dependencias y criterios verificables, y SHALL omitir historiales, informes completos y contenido irrelevante.

#### Scenario: Delegacion con alcance definido

- **WHEN** el orquestador delega una subtarea a un agente
- **THEN** el agente recibe el objetivo, los archivos o areas autorizados, las exclusiones, las restricciones y las condiciones de terminado necesarias para actuar sin reconstruir la conversacion previa

#### Scenario: Contexto innecesario o historico

- **WHEN** los resultados de agentes anteriores contienen razonamientos o detalles que no condicionan la subtarea siguiente
- **THEN** el orquestador conserva solo las conclusiones, decisiones y dependencias relevantes en el prompt delegado

### Requirement: Agentes de rol reutilizables

Los agentes portables SHALL conservar responsabilidades diferenciadas para analizar, planificar, implementar, revisar e integrar, pero SHALL operar sobre el contexto recibido en lugar de depender de una skill auxiliar para activar o validar un workflow especifico. `reviewer` SHALL poder revisar tareas genericas y cambios con criterios contractuales incluidos en el contexto.

#### Scenario: Revision de tarea generica

- **WHEN** `reviewer` recibe un objetivo, un scope, criterios de aceptacion y un diff sin una especificacion externa
- **THEN** identifica hallazgos concretos contra ese contexto y devuelve su informe sin bloquear por la ausencia de un workflow formal

#### Scenario: Ausencia de skills auxiliares

- **WHEN** las skills auxiliares de contexto no estan instaladas
- **THEN** los agentes pueden ejecutar sus responsabilidades usando `AGENTS.md`, su contrato de rol y el prompt delegado

### Requirement: Implementer respects context budget signals

El agente `implementer` SHALL tratar como autoritarias únicamente las señales
runtime explícitas `[context-handoff:budget]:SOFT` y
`[context-handoff:budget]:HARD`. No SHALL estimar, contar ni inferir su propio
uso de tokens.

#### Scenario: Operacion normal sin señal

- **WHEN** la solicitud no contiene una señal de presupuesto
- **THEN** el agente ejecuta su ciclo existente, valida el cambio y devuelve su
  formato normal sin iniciar un HANDOFF

#### Scenario: Alcance del limite blando

- **WHEN** la solicitud contiene `[context-handoff:budget]:SOFT`
- **THEN** el agente evita exploracion amplia y trabajo no relacionado, prioriza
  terminar la unidad coherente actual, persiste cambios utiles y usa
  verificacion dirigida sin estar obligado a devolver un HANDOFF

#### Scenario: Alcance del limite duro

- **WHEN** la solicitud contiene `[context-handoff:budget]:HARD`
- **THEN** el agente detiene inmediatamente la implementacion, exploracion y
  verificacion adicional, no ejecuta mas herramientas y devuelve un HANDOFF en
  lugar de continuar el ciclo normal

#### Scenario: Herramienta bloqueada por el limite duro

- **WHEN** el runtime rechaza una herramienta con `CONTEXT_BUDGET_HARD_STOP`
- **THEN** el agente no reintenta la herramienta ni usa otra equivalente y
  devuelve el HANDOFF con la informacion disponible

### Requirement: HANDOFF durable y estructurado

Cuando el presupuesto alcanza HARD, el agente SHALL devolver exactamente un
encabezado superior `## HANDOFF` y las secciones `Objective`, `Completed`,
`Remaining`, `Decisions`, `Files changed`, `Relevant files`, `Verification` y
`Next action`. El contenido SHALL describir el estado persistido de forma
concisa y accionable, sin reproducir la conversacion ni el contenido completo
de los archivos.

#### Scenario: Trabajo parcialmente completado

- **WHEN** HARD aparece antes de completar el objetivo delegado
- **THEN** `Completed` enumera solo cambios persistidos, `Remaining` enumera
  tareas concretas pendientes y `Next action` contiene una unica primera accion
  ejecutable

#### Scenario: Verificacion interrumpida

- **WHEN** HARD impide ejecutar una comprobacion pendiente
- **THEN** `Verification` la marca explícitamente como `NOT RUN` y la incluye en
  `Remaining` cuando sea necesaria para completar el objetivo

#### Scenario: Continuacion fuera del agente

- **WHEN** el agente devuelve un HANDOFF
- **THEN** no crea, delega ni invoca otra sesion y no solicita decision del
  usuario sobre la continuacion

### Requirement: Continuacion de HANDOFF en una sesion hija nueva

Cuando un worker delegado devuelve una respuesta superior `## HANDOFF` por agotamiento de contexto, el orquestador SHALL tratar el objetivo como incompleto y SHALL crear una nueva sesion hija para continuar. La sesion que emitio el HANDOFF SHALL considerarse agotada y no SHALL reanudarse para ese objetivo.

#### Scenario: HANDOFF obliga a crear una sesion nueva

- **WHEN** un worker devuelve un `## HANDOFF` causado por el limite duro de contexto
- **THEN** el orquestador crea una nueva `Task` sin pasar el `task_id` ni otro identificador de continuacion del worker anterior

#### Scenario: El tipo de agente puede repetirse sin reutilizar la sesion

- **WHEN** la subtarea pendiente sigue correspondiendo al mismo rol, como `implementer`
- **THEN** la nueva sesion puede usar la misma definicion de agente, pero recibe un contexto de worker independiente y fresco

#### Scenario: La continuacion conserva solo el contexto necesario

- **WHEN** el orquestador crea el worker posterior al HANDOFF
- **THEN** le entrega el objetivo delegado original, el HANDOFF estructurado completo y las restricciones parentales necesarias, sin copiar la conversacion completa de ninguno de los workers

#### Scenario: El repositorio valida el HANDOFF

- **WHEN** el nuevo worker comienza la continuacion
- **THEN** inspecciona el estado actual del repositorio, trata ese estado como fuente de verdad y no repite trabajo listado como completado salvo que falte o sea incorrecto

#### Scenario: HANDOFF encadenado

- **WHEN** un worker creado para continuar tambien devuelve un `## HANDOFF`
- **THEN** el orquestador vuelve a crear otra sesion hija nueva sin reutilizar ningun identificador de la sesion agotada y continua hasta una respuesta normal o un bloqueo genuino

#### Scenario: HANDOFF no completa la subtarea

- **WHEN** el orquestador recibe un `## HANDOFF` sin un bloqueo genuino separado
- **THEN** continua automaticamente con un worker nuevo, no reporta exito, no inicia revision ni solicita confirmacion al usuario

#### Scenario: Continuacion normal sin HANDOFF

- **WHEN** un worker devuelve una respuesta normal y el orquestador necesita un seguimiento intencional
- **THEN** puede reanudar la sesion existente mediante su `task_id` cuando esa continuacion sea apropiada

### Requirement: Separación de configuraciones local y global

La documentación del repositorio, principalmente el `README.md` de la integración y el `AGENTS.md` raíz cuando corresponda, SHALL explicar que el `AGENTS.md` raíz y la configuración del proyecto consumidor pertenecen a ese proyecto, mientras `integrations/opencode/` contiene el respaldo versionado de la configuración portable que se instala manualmente bajo `~/.config/opencode/`. SHALL distinguir también los comandos globales de OpenCode de los workflows locales del proyecto y SHALL evitar instrucciones que mezclen ambas superficies. El `integrations/opencode/AGENTS.md` SHALL limitarse a reglas aplicables a los recursos dentro de su propio scope, ser agnóstico de ubicación y no asumir que es una política global, una instalación operativa o parte de un repositorio consumidor concreto.

#### Scenario: Consulta de la guia de integracion

- **WHEN** un usuario consulta el `README.md` de la integracion o el `AGENTS.md` raiz
- **THEN** puede identificar el proposito, la ubicacion operativa, la relacion y los limites de cada superficie sin interpretar `integrations/opencode/` como configuracion del proyecto consumidor

#### Scenario: Aplicacion aislada de las reglas del toolkit

- **WHEN** el `integrations/opencode/AGENTS.md` se aplica bajo cualquier ubicacion que contenga sus recursos de scope
- **THEN** sus reglas se mantienen validas sin depender de una ruta de instalacion, un repositorio consumidor, una estructura de workflows o una politica local concreta

#### Scenario: Instalacion portable sin alterar el proyecto

- **WHEN** el usuario sincroniza manualmente la configuracion portable
- **THEN** copia unicamente los recursos documentados de `integrations/opencode/` hacia `~/.config/opencode/` y conserva separadas las reglas y configuraciones del proyecto consumidor

### Requirement: Indice breve de agentes portables

La integración portable SHALL ofrecer en `integrations/opencode/AGENTS.md` un índice conciso de los agentes disponibles, incluyendo `analyzer`, `planner`, `implementer`, `reviewer` e `integration-checker`, su responsabilidad principal y su límite general de edición. La guía SHALL remitir los métodos, límites detallados y formatos de salida a los contratos individuales de `integrations/opencode/agents/` sin duplicarlos.

#### Scenario: Consulta del conjunto portable

- **WHEN** un usuario consulta la guía común de la integración
- **THEN** puede identificar los cinco agentes portables y distinguir cuáles operan solo en lectura y cuáles pueden editar dentro de un alcance acotado

#### Scenario: Selección de un agente

- **WHEN** el usuario tiene una tarea de análisis, planificación, implementación, revisión o comprobación de integración
- **THEN** la guía permite seleccionar el rol apropiado sin exigir la lectura de todos los contratos individuales ni conocer un workflow externo

#### Scenario: Detalle de un contrato

- **WHEN** un usuario necesita conocer el método o el formato de salida de un agente
- **THEN** la guía dirige al contrato individual correspondiente y no presenta una segunda versión extensa o contradictoria de ese contrato

#### Scenario: Toolkit aplicado en otro repositorio

- **WHEN** la integración portable se aplica bajo otra ubicación o junto a workflows propios del repositorio consumidor
- **THEN** el índice de agentes conserva sus nombres, responsabilidades y límites sin asumir rutas locales ni configuraciones del consumidor

### Requirement: Propuesta de tag centrada en commits

El comando portable `tag` SHALL analizar los commits alcanzables desde la base
seleccionada hasta `HEAD` y SHALL usar únicamente esos commits, sus rutas
modificadas y sus diffs relevantes como evidencia principal. No SHALL exigir la
lectura de la politica general del proyecto ni revisar areas no modificadas para
decidir la version.

#### Scenario: Base determinada por el ultimo tag

- **WHEN** existen tags numericos alcanzables desde la historia `first-parent`
  de `HEAD`
- **THEN** el comando usa como base el tag de release mas reciente de esa
  historia y analiza solo los commits posteriores hasta `HEAD`

#### Scenario: Repositorio sin tags

- **WHEN** no existe ningun tag de release alcanzable
- **THEN** el comando analiza toda la historia disponible hasta `HEAD` y usa
  `v0.0.0` como base virtual solo para calcular el primer tag automatico

#### Scenario: Cambios sin commit

- **WHEN** el working tree contiene cambios staged, unstaged o no trackeados
- **THEN** el comando los excluye del analisis de version y continua usando el
  estado alcanzado por `HEAD`, informando la situacion de forma breve

### Requirement: Interfaz de argumentos reducida

El comando SHALL aceptar como unico argumento opcional `--version <version>`.
La version SHALL mantener el formato numerico `vMAJOR.MINOR.PATCH`. El comando
SHALL rechazar argumentos desconocidos y no SHALL conservar los modos separados
de base manual, working tree estricto o versiones preliminares.

#### Scenario: Version automatica

- **WHEN** el usuario ejecuta el comando sin argumentos y existen commits
  versionables
- **THEN** el comando calcula la siguiente version a partir del impacto de los
  cambios desde la base seleccionada

#### Scenario: Version explicita

- **WHEN** el usuario proporciona `--version vMAJOR.MINOR.PATCH`
- **THEN** el comando usa exactamente esa version como objetivo, valida que no
  exista y no recalcula el incremento a partir del impacto

#### Scenario: Argumento no soportado

- **WHEN** el usuario proporciona una opcion distinta de `--version`
- **THEN** el comando no propone una version y explica brevemente que el
  argumento no esta soportado

### Requirement: Clasificacion por impacto de usuario

El comando SHALL clasificar la evolucion de la version por la adaptacion que el
cambio exige al usuario. La cantidad, tipo, arquitectura o tamano del codigo no
SHALL elevar por si mismos el nivel. Si la evidencia queda entre dos niveles,
el comando SHALL elegir el nivel menor.

#### Scenario: Cambio de codigo con impacto minimo

- **WHEN** el rango contiene codigo de producto, aunque el cambio sea interno
  o localizado
- **THEN** la propuesta SHALL ser como minimo `PATCH`

#### Scenario: Cambio visible localizado

- **WHEN** el cambio altera un boton, mueve inputs o ajusta la distribucion
  puntual de un componente sin transformar un flujo principal
- **THEN** la propuesta SHALL usar `PATCH`

#### Scenario: Cambio visible con adaptacion acotada

- **WHEN** el cambio agrega, elimina o reemplaza un modal, componente o flujo
  acotado que requiere adaptacion del usuario
- **THEN** la propuesta SHALL usar `MINOR`, salvo que exista evidencia clara de
  un impacto mayor

#### Scenario: Cambio drastico del producto

- **WHEN** el cambio transforma un flujo central, la navegacion principal o la
  forma general de usar el producto y exige una adaptacion amplia
- **THEN** la propuesta SHALL usar `MAJOR`

#### Scenario: Modulo nuevo no automaticamente mayor

- **WHEN** el rango agrega un modulo nuevo
- **THEN** el comando SHALL clasificarlo segun su impacto real y no SHALL usar
  `MAJOR` unicamente por la existencia del modulo

### Requirement: Elegibilidad de cambios para versionar

El comando SHALL proponer al menos un `PATCH` cuando el rango contenga codigo
de producto. Los cambios de tests, configuracion, tooling, infraestructura o
documentacion por si solos no SHALL obligar a crear un tag. La documentacion
mezclada con codigo de producto SHALL quedar incluida en el resumen del tag.

#### Scenario: Solo documentacion

- **WHEN** todos los cambios del rango afectan unicamente documentacion
- **THEN** el comando SHALL mostrar que no se propone una nueva version y no
  SHALL generar un comando `git tag`

#### Scenario: Codigo y documentacion

- **WHEN** el rango contiene codigo de producto y documentacion
- **THEN** el comando SHALL proponer una version basada en el impacto del codigo
  y SHALL resumir la documentacion solo cuando aporte contexto

### Requirement: Salida breve y segura

El comando SHALL mostrar una propuesta concisa con la base, la version objetivo,
el nivel de impacto, el estado del working tree y un resumen agrupado de los
cambios relevantes. Una propuesta valida SHALL terminar con un unico bloque
manual para crear un tag anotado apuntando al SHA completo de `HEAD`.

El comando SHALL permanecer en modo de analisis: no SHALL ejecutar `git tag`,
crear o modificar refs, publicar tags, modificar archivos ni cambiar el working
tree.

#### Scenario: Propuesta valida

- **WHEN** el repositorio pasa las validaciones y contiene codigo versionable
- **THEN** el comando muestra solo la informacion necesaria para revisar la
  propuesta y un unico comando manual de tag sin `git push`

#### Scenario: Sin cambios versionables

- **WHEN** no existe codigo de producto versionable en el rango
- **THEN** el comando muestra un resultado breve sin propuesta y sin bloque de
  comandos

### Requirement: Modos explícitos para cambios staged

El comando portable `commit` SHALL separar el modo normal del working tree del
modo explícito del index mediante el argumento `--staged`.

#### Scenario: Cambios staged bloquean el modo normal

- **WHEN** el usuario ejecuta `/commit` y existe al menos un cambio staged
- **THEN** el comando SHALL detenerse antes de hacer staging o crear commits y
  SHALL indicar que debe usarse `/commit --staged` para procesar el index

#### Scenario: `--staged` crea un commit del index

- **WHEN** el usuario ejecuta `/commit --staged` y existe contenido staged
- **THEN** el comando SHALL proponer y crear, tras confirmación explícita, un
  único commit con exactamente el contenido del index sin reagruparlo ni
  modificar su staging

#### Scenario: Cambios fuera del index quedan intactos

- **WHEN** `/commit --staged` se ejecuta con cambios staged y también existen
  cambios unstaged o no trackeados
- **THEN** SHALL incluir únicamente el index en el commit y SHALL dejar intactos
  los demás cambios, informándolos como pendientes

#### Scenario: `--staged` sin contenido staged

- **WHEN** el usuario ejecuta `/commit --staged` y no existe ningún cambio staged
- **THEN** el comando SHALL detenerse sin hacer staging ni crear commits e
  informar que no hay contenido en el index para procesar

#### Scenario: El modo working tree conserva la agrupación

- **WHEN** el usuario ejecuta `/commit` sin cambios staged y existen cambios en
  el working tree
- **THEN** el comando SHALL conservar la agrupación semántica existente de uno o
  más commits y SHALL hacer staging únicamente de las rutas aprobadas para cada
  grupo

### Requirement: Interfaz de argumentos reducida y segura

El comando SHALL reconocer `--staged` como única opción formal. El texto sin
opciones SHALL poder usarse como contexto, pero una opción desconocida SHALL
detener el flujo sin analizar ni modificar el repositorio.

#### Scenario: Opción staged válida

- **WHEN** `$ARGUMENTS` contiene `--staged` y ningún argumento de opción
  desconocido
- **THEN** el comando SHALL seleccionar exclusivamente el modo index y tratar el
  texto restante sin opciones como contexto no ejecutable

#### Scenario: Opción desconocida

- **WHEN** `$ARGUMENTS` contiene una opción distinta de `--staged`
- **THEN** el comando SHALL informar que la opción no está soportada y SHALL
  terminar sin ejecutar staging, commits ni otras operaciones de escritura Git

### Requirement: Análisis superficial con revisión dirigida

El comando SHALL comenzar el análisis del alcance elegido con el estado, las
rutas, los estados y las estadísticas de los cambios, sin inspeccionar de forma
exhaustiva el proyecto ni los archivos no relacionados. SHALL revisar el diff
detallado únicamente cuando el resumen no permita resolver una ambigüedad real
o cuando sea necesario evaluar una señal de seguridad en una ruta elegible.

#### Scenario: Resumen suficiente para proponer el plan

- **WHEN** las rutas, estados y estadísticas permiten identificar el alcance y
  la intención de los cambios
- **THEN** el comando SHALL generar el plan sin exigir una inspección exhaustiva
  del contenido del diff

#### Scenario: Ambigüedad o señal de seguridad

- **WHEN** el resumen no permite agrupar o describir correctamente un cambio, o
  una ruta elegible parece contener información sensible
- **THEN** el comando SHALL ampliar la revisión únicamente a la evidencia
  necesaria y SHALL conservar la confirmación específica para rutas sospechosas
