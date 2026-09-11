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

Al crear la sesion hija, el orquestador SHALL conservar por separado el objetivo delegado original y construir un paquete compacto de continuacion a partir del HANDOFF mas reciente. El paquete SHALL incluir, cuando sean relevantes, el estado `Completed`, el trabajo `Remaining`, las `Decisions`, `Files changed`, `Relevant files`, riesgos o hallazgos no resueltos, `Verification`, `Next action` y las restricciones parentales necesarias. No SHALL sustituir ese estado por un resumen generico ni copiar la conversacion completa.

El orquestador SHALL mantener ese paquete como estado rolling actualizado entre HANDOFF encadenados, sin anidar historiales completos. El worker nuevo SHALL verificar solo el estado actual del repositorio relacionado con la continuacion, tratar el repositorio como fuente de verdad ante una discrepancia y no repetir trabajo completado salvo que falte, este obsoleto, sea incorrecto o resulte inconsistente. Este comportamiento SHALL preservar tambien conclusiones de exploracion que no esten persistidas en archivos.

#### Scenario: HANDOFF obliga a crear una sesion nueva

- **WHEN** un worker devuelve un `## HANDOFF` causado por el limite duro de contexto
- **THEN** el orquestador crea una nueva `Task` sin pasar el `task_id` ni otro identificador de continuacion del worker anterior

#### Scenario: El tipo de agente puede repetirse sin reutilizar la sesion

- **WHEN** la subtarea pendiente sigue correspondiendo al mismo rol, como `implementer`
- **THEN** la nueva sesion puede usar la misma definicion de agente, pero recibe un contexto de worker independiente y fresco

#### Scenario: La continuacion conserva el objetivo y el estado operativo

- **WHEN** el orquestador crea el worker posterior al HANDOFF
- **THEN** le entrega el objetivo delegado original, el estado relevante de `Completed`, `Remaining`, `Decisions`, archivos, riesgos, `Verification` y `Next action`, junto con las restricciones parentales necesarias, sin copiar la conversacion completa

#### Scenario: El repositorio valida el HANDOFF de forma dirigida

- **WHEN** el nuevo worker comienza la continuacion
- **THEN** verifica solo el estado actual del repositorio relevante para `Remaining` o `Next action`, trata ese estado como fuente de verdad y no repite trabajo listado como completado salvo que falte o sea incorrecto

#### Scenario: Una exploracion conserva conocimiento no persistido

- **WHEN** un worker de analisis devuelve un HANDOFF con hallazgos confirmados, decisiones, riesgos, rutas relevantes o preguntas pendientes que no quedaron escritos en archivos

- **THEN** el paquete de continuacion transfiere esos elementos relevantes al worker exploratorio nuevo y le permite continuar sin volver a mapear ampliamente el repositorio

#### Scenario: Una implementacion conserva progreso y decisiones

- **WHEN** un worker de implementacion devuelve un HANDOFF despues de modificar archivos o ejecutar verificaciones

- **THEN** el worker nuevo recibe los archivos cambiados, las decisiones no obvias, el estado de verificacion y el trabajo restante, inspecciona su estado actual y continua sin recrear cambios ya persistidos

#### Scenario: HANDOFF encadenado usa estado rolling compacto

- **WHEN** un worker creado para continuar tambien devuelve un `## HANDOFF`
- **THEN** el orquestador vuelve a crear otra sesion hija nueva sin reutilizar ningun identificador de la sesion agotada y pasa el objetivo original junto con el estado rolling actualmente relevante, sin anidar todos los HANDOFF ni copiar historiales

#### Scenario: El objetivo original permanece estable

- **WHEN** existen dos o mas continuaciones por HANDOFF para la misma delegacion

- **THEN** cada worker nuevo recibe el objetivo delegado original sin sustituirlo por el resumen parcial o el `Remaining` del worker anterior

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
- **THEN** el comando SHALL detenerse antes de hacer staging o crear commits,
  SHALL dejar intacto el index y SHALL indicar que debe usarse `/commit --staged`
  o prepararse manualmente el index

#### Scenario: `--staged` crea un commit del index

- **WHEN** el usuario ejecuta `/commit --staged` y existe contenido staged
- **THEN** el comando SHALL proponer y crear, tras confirmación explícita, un
  único commit con exactamente el contenido del index, sin reagruparlo,
  dividirlo ni modificar su staging

#### Scenario: Cambios fuera del index quedan intactos

- **WHEN** `/commit --staged` se ejecuta con cambios staged y también existen
  cambios unstaged o no trackeados
- **THEN** SHALL incluir únicamente el index en el commit y SHALL dejar intactos
  los demás cambios y SHALL informarlos como pendientes cuando sea relevante

#### Scenario: `--staged` sin contenido staged

- **WHEN** el usuario ejecuta `/commit --staged` y no existe ningún cambio staged
- **THEN** el comando SHALL detenerse sin hacer staging ni crear commits e
  informar que no hay contenido en el index para procesar

#### Scenario: El modo working tree conserva la agrupación

- **WHEN** el usuario ejecuta `/commit` sin cambios staged y existen cambios en
  el working tree
- **THEN** el comando SHALL analizar todos los cambios no ignorados elegibles y
  SHALL hacer staging únicamente de las rutas aprobadas para cada commit

#### Scenario: Un archivo pertenece a un único commit

- **WHEN** un archivo completo contiene cambios relacionados con una sola
  intención lógica
- **THEN** el archivo SHALL pertenecer a un único commit y no SHALL dividirse
  automáticamente por hunks

#### Scenario: Archivo con intenciones separables

- **WHEN** un archivo contiene cambios de dos intenciones que deberían formar
  commits separados
- **THEN** el comando SHALL detenerse y solicitar staging manual, sin dividir
  hunks automáticamente ni elegir una intención de forma arbitraria

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
detallado únicamente cuando el resumen no permita resolver una ambigüedad real,
decidir la agrupación, redactar el plan o evaluar una señal de seguridad en una
ruta elegible.

#### Scenario: Resumen suficiente para proponer el plan

- **WHEN** las rutas, estados y estadísticas permiten identificar el alcance y
  la intención de los cambios
- **THEN** el comando SHALL generar el plan sin exigir una inspección exhaustiva
  del contenido del diff

#### Scenario: Ambigüedad o señal de seguridad

- **WHEN** el resumen no permite agrupar o describir correctamente un cambio, o
  una ruta elegible parece contener información sensible
- **THEN** el comando SHALL ampliar la revisión únicamente a la evidencia
  necesaria, sin mostrar valores sensibles ni buscar secretos fuera de las rutas
  elegibles

### Requirement: Composición con la skill externa de commits

El command `/commit` SHALL usar la skill externa `git-commit` como base para las
capacidades generales de Conventional Commits, análisis del diff,
determinación de `type` y `scope`, mensajes, breaking changes y ejecución
general de commits. El command SHALL añadir sus políticas locales sin modificar,
copiar ni extender físicamente la skill externa. Cuando exista una diferencia,
la regla local más restrictiva SHALL prevalecer para este command.

#### Scenario: Capacidad general delegada a la skill

- **WHEN** el command analiza un cambio elegible para crear un commit
- **THEN** SHALL aprovechar la capacidad general de la skill para analizarlo y
  generar un Conventional Commit, aplicando además las restricciones locales
  del command

#### Scenario: Skill externa permanece intacta

- **WHEN** se refactoriza el command portable
- **THEN** no SHALL modificarse ningún archivo de la skill externa ni SHALL
  requerirse una copia de sus explicaciones generales dentro del command

#### Scenario: Política local más restrictiva

- **WHEN** la skill permite una operación que el workflow local prohíbe
- **THEN** el command SHALL detener o restringir la operación conforme a su
  política local, sin relajarla por la recomendación general de la skill

### Requirement: Agrupación lógica de commits del working tree

En modo `working-tree`, el command SHALL agrupar archivos completos por
intención lógica y SHALL separar las intenciones independientes. No SHALL
agrupar archivos únicamente por compartir directorio o tipo. Cambios de varias
capas SHALL permanecer juntos cuando formen una modificación funcional
coherente; contratos compartidos y consumidores SHALL poder permanecer juntos
cuando separarlos deje un commit conceptualmente incompleto.

#### Scenario: Intenciones independientes

- **WHEN** el working tree contiene cambios de intenciones independientes
- **THEN** cada intención SHALL proponerse como un commit separado, con cada
  archivo asignado a un único grupo

#### Scenario: Cambio cross-layer coherente

- **WHEN** una única modificación funcional requiere cambios coordinados en
  backend, cliente, tests, documentación o tooling
- **THEN** los archivos necesarios SHALL permanecer en el mismo commit aunque
  pertenezcan a capas o categorías distintas

#### Scenario: Código fuente y archivos generados

- **WHEN** un archivo generado cambia como consecuencia directa del cambio
  fuente que lo produce
- **THEN** ambos SHALL permanecer juntos en el mismo commit cuando representen
  una única intención funcional

#### Scenario: Contrato y consumidores

- **WHEN** separar un contrato compartido de sus consumidores dejaría uno de
  los commits conceptualmente incompleto
- **THEN** el contrato y los consumidores afectados SHALL permanecer juntos
  en el mismo commit

#### Scenario: Separación artificial por categoría

- **WHEN** backend y frontend, tests, documentación o tooling forman una única
  modificación coherente
- **THEN** el command no SHALL separarlos artificialmente solo por su categoría

### Requirement: Mensajes locales en español

Los commits propuestos por `/commit` SHALL conservar el `type` de Conventional
Commits en inglés y SHALL usar una descripción en español, concreta, en
minúsculas y relacionada con la intención del cambio. Cuando exista un body,
este SHALL estar en español. El `scope` SHALL basarse en evidencia real del
repositorio y no SHALL inventarse.

#### Scenario: Mensaje de una línea

- **WHEN** una intención requiere un commit sin body ni footer adicional
- **THEN** el mensaje SHALL contener exactamente un `type` válido, un `scope`
  sustentado por evidencia cuando corresponda y una descripción concreta en
  español

#### Scenario: Mensaje con body o breaking change

- **WHEN** el análisis determina que el commit necesita body, footer o una
  indicación de breaking change
- **THEN** la descripción y el body SHALL estar en español, mientras las
  palabras clave normativas de Conventional Commits SHALL conservar su forma
  requerida

### Requirement: Propuesta exacta y confirmación obligatoria

Antes de cualquier operación de escritura Git, el command SHALL mostrar una
propuesta completa que incluya exactamente los campos `Modo`, `Branch`,
`Upstream` y `Commits`, seguida por bloques consecutivos `### Commit N` con la
`Intención`, el mensaje exacto y los cambios con estados y rutas. La propuesta
SHALL incluir siempre las secciones `## Pendientes` y `## Advertencias`.
`Commits` SHALL coincidir con la cantidad de commits propuestos.

#### Scenario: Propuesta working tree

- **WHEN** el modo es `working-tree` y existen varias intenciones
- **THEN** la propuesta SHALL mostrar un bloque `### Commit N` por intención,
  en el orden de ejecución, sin nombres alternativos como grupo o cambio

#### Scenario: Propuesta staged

- **WHEN** el modo es `staged` y existe contenido elegible en el index
- **THEN** la propuesta SHALL mostrar exactamente `Commits: 1`, únicamente
  `### Commit 1` y todos los archivos staged elegibles en ese commit

#### Scenario: Estados y rutas de cambios

- **WHEN** la propuesta enumera archivos
- **THEN** SHALL usar únicamente estados Git válidos, SHALL mostrar rutas
  relativas a la raíz que comiencen por `./`, SHALL conservar los renombrados
  como una sola entrada con ruta anterior y nueva, y SHALL ordenar de forma
  estable las demás rutas lexicográficamente

#### Scenario: Confirmación del plan

- **WHEN** la propuesta está completa y no existe una ambigüedad pendiente
- **THEN** el command SHALL usar `question` inmediatamente después de la
  propuesta, con las opciones exactas `Crear commits`, `Ajustar plan` y
  `Cancelar`, y no SHALL ejecutar staging ni commit antes de recibir `Crear
  commits`

#### Scenario: Plan ajustado

- **WHEN** el usuario selecciona `Ajustar plan` o cambia cualquier elemento del
  plan
- **THEN** el command SHALL mostrar nuevamente la propuesta completa y SHALL
  requerir una nueva confirmación antes de escribir

### Requirement: Protección frente a cambios concurrentes

El command SHALL capturar el estado del repositorio utilizado para construir la
propuesta y SHALL volver a comprobarlo después de la confirmación y antes de
cada operación de escritura. SHALL comparar los cambios relevantes y el index
con el estado aprobado. Si existe una diferencia, SHALL detenerse, no SHALL
reconciliarla automáticamente y SHALL requerir una nueva propuesta y
confirmación.

#### Scenario: Repositorio sin cambios concurrentes

- **WHEN** el estado relevante y el index coinciden con la propuesta confirmada
- **THEN** el command SHALL poder continuar con exactamente las rutas, el orden
  y los mensajes aprobados

#### Scenario: Repositorio cambiado tras confirmar

- **WHEN** aparece, desaparece o cambia una ruta relevante, o cambia el index
  después de la confirmación
- **THEN** el command SHALL detenerse sin aplicar el plan anterior y SHALL
  informar que debe reconstruirse y confirmarse una nueva propuesta

### Requirement: Seguridad y verificación de la ejecución

El command SHALL inspeccionar señales de secretos únicamente en las rutas
elegibles y nunca SHALL mostrar sus valores. Ante evidencia razonable de un
secreto, en working tree SHALL excluir la ruta y, en modo `--staged`, SHALL
detenerse para que el usuario corrija manualmente el index; nunca SHALL ofrecer
una opción para autorizar su inclusión. El command SHALL respetar hooks y firma,
no SHALL ejecutar validaciones del proyecto y SHALL verificar el resultado tras
cada commit.

#### Scenario: Ruta sospechosa en working tree

- **WHEN** una ruta elegible del working tree contiene evidencia razonable de un
  secreto
- **THEN** el command SHALL excluirla del plan sin mostrar su valor y SHALL
  poder continuar con otros grupos que no dependan de ella

#### Scenario: Ruta sospechosa en staged

- **WHEN** el index contiene evidencia razonable de un secreto
- **THEN** el command SHALL detenerse sin modificar el index ni crear el commit
  y SHALL pedir que el usuario corrija manualmente el staging, sin ofrecer
  autorización para incluir la ruta

#### Scenario: Fallo de hook

- **WHEN** un hook falla o modifica archivos o el index durante un commit
- **THEN** el command SHALL comprobar si el commit llegó a crearse, SHALL
  detenerse, no SHALL usar `--no-verify`, no SHALL hacer amend y no SHALL
  modificar automáticamente el código para corregir el hook

#### Scenario: Verificación posterior a un commit

- **WHEN** un commit termina correctamente
- **THEN** el command SHALL comprobar su SHA corto, mensaje, rutas realmente
  incluidas y estado residual, y no SHALL continuar con otro commit si el
  resultado no coincide con la propuesta aprobada

#### Scenario: Validaciones fuera de alcance

- **WHEN** el command crea o verifica commits
- **THEN** no SHALL ejecutar ni afirmar haber ejecutado build, tests, lint,
  format, type-check, migraciones, generación de clientes, instalación de
  dependencias o servicios

### Requirement: Catalogo de skills externas para uso global

La integracion portable SHALL documentar un catalogo curado de skills externas para OpenCode, distinguiendo como minimo las dependencias recomendadas de las opciones bajo demanda. Cada entrada SHALL indicar su fuente, su proposito, su relacion con los agentes o commands existentes y cualquier solapamiento o limite relevante.

#### Scenario: Consulta del catalogo recomendado

- **WHEN** un usuario consulta la documentacion de skills globales
- **THEN** puede identificar `git-commit` como dependencia de `/commit` y distinguirla de las skills opcionales sin instalar el catalogo completo

#### Scenario: Consulta de una skill opcional

- **WHEN** el usuario evalua una skill opcional del catalogo
- **THEN** encuentra el caso de uso que la activa y la limitacion que impide tratarla como parte obligatoria del baseline global

#### Scenario: Skill externa no versionada

- **WHEN** el usuario revisa el respaldo versionado de la integracion
- **THEN** puede distinguir el catalogo documental de los `SKILL.md` externos y no interpreta que el repositorio conserve una copia ejecutable de esas skills

### Requirement: Instalacion global dirigida de skills

La documentacion SHALL proporcionar comandos de `npx skills add` que instalen las skills seleccionadas en el alcance global y las dirijan a OpenCode. No SHALL recomendar la instalacion masiva de skills del catalogo externo como baseline, y SHALL indicar que los commands locales pueden imponer restricciones mas fuertes que una skill externa.

#### Scenario: Instalacion global para OpenCode

- **WHEN** el usuario instala una skill documentada siguiendo el comando proporcionado
- **THEN** el comando usa `--global` y `--agent opencode` y la skill queda destinada al directorio global de skills de OpenCode

#### Scenario: Instalacion selectiva

- **WHEN** el usuario instala el baseline o un grupo opcional
- **THEN** el comando selecciona nombres concretos mediante `--skill` y no usa una opcion equivalente a instalar todo el repositorio

#### Scenario: Precedencia del command local

- **WHEN** `/commit` utiliza la skill externa `git-commit`
- **THEN** conserva las restricciones locales de confirmacion, seguridad, staging y validacion aunque la skill externa describa un comportamiento menos restrictivo

### Requirement: Documentacion coherente de superficies globales

Los README del repositorio y de la integracion SHALL distinguir los recursos versionados instalables manualmente de las dependencias externas de skills, SHALL describir el mismo destino global y SHALL evitar referencias a skills OpenSpec eliminadas del respaldo. La instalacion manual del respaldo SHALL incluir todos sus recursos versionados, incluido el plugin portable.

#### Scenario: README raiz y README de integracion alineados

- **WHEN** el usuario consulta cualquiera de los README de instalacion
- **THEN** encuentra una explicacion compatible sobre el respaldo versionado, las skills externas y la configuracion operativa global

#### Scenario: Referencia a skill eliminada

- **WHEN** el usuario sigue la instalacion global desde el README raiz
- **THEN** no se le exige instalar `openspec-change-context-bootstrap` como dependencia del respaldo actual

#### Scenario: Plugin incluido en la instalacion manual

- **WHEN** el usuario copia los recursos versionados de la integracion
- **THEN** la instruccion incluye `plugins/context-handoff.ts` ademas de las reglas, la configuracion, los agentes y los commands documentados
