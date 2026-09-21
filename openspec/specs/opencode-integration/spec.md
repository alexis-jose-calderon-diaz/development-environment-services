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

La documentación del repositorio, principalmente el `README.md` de la
integración y el `AGENTS.md` raíz cuando corresponda, SHALL explicar que el
`AGENTS.md` raíz y la configuración del proyecto consumidor pertenecen a ese
proyecto, mientras `integrations/opencode/` contiene el respaldo versionado de
la configuración portable que se instala manualmente bajo
`~/.config/opencode/`. SHALL distinguir también la superficie pública de skills
versionadas bajo `skills/`, las dependencias externas gestionadas por el CLI
`skills` y la superficie interna `./.agents/`, que no forma parte del catálogo
público ni de la instalación documentada. SHALL distinguir los comandos globales
de OpenCode de los workflows locales del proyecto y SHALL evitar instrucciones
que mezclen ambas superficies. El `integrations/opencode/AGENTS.md` SHALL
limitarse a reglas aplicables a los recursos dentro de su propio scope, ser
agnóstico de ubicación y no asumir que es una política global, una instalación
operativa o parte de un repositorio consumidor concreto.

#### Scenario: Consulta de la guia de integracion

- **WHEN** un usuario consulta el `README.md` de la integracion o el `AGENTS.md` raiz
- **THEN** puede identificar el propósito, la ubicación operativa, la relación
  y los límites de `integrations/opencode/`, `skills/` y `./.agents/` sin
  interpretar la superficie interna como un recurso público

#### Scenario: Aplicacion aislada de las reglas del toolkit

- **WHEN** el `integrations/opencode/AGENTS.md` se aplica bajo cualquier ubicacion que contenga sus recursos de scope
- **THEN** sus reglas se mantienen validas sin depender de una ruta de instalacion, un repositorio consumidor, una estructura de workflows o una politica local concreta

#### Scenario: Instalacion portable sin alterar el proyecto

- **WHEN** el usuario sincroniza manualmente la configuracion portable
- **THEN** copia únicamente los recursos documentados de
  `integrations/opencode/` hacia `~/.config/opencode/`, conserva separadas las
  reglas y configuraciones del proyecto consumidor y no copia `./.agents/`

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

### Requirement: Skill portable para commits agrupados

La integración SHALL proporcionar una skill versionada que pueda activarse cuando
el usuario pida revisar, agrupar, separar o crear commits lógicos a partir de
cambios Git. La skill SHALL analizar el repositorio actual, preparar una
propuesta completa y crear uno o más commits únicamente después de una
aprobación explícita. SHALL ser independiente de la interfaz de invocación y no
SHALL requerir placeholders, frontmatter adicional ni herramientas específicas
de un proveedor.

#### Scenario: Activación por una petición de commits agrupados

- **WHEN** el usuario pide revisar cambios y crear commits agrupados, aunque no
  mencione el nombre de la skill
- **THEN** la skill analiza el repositorio actual y prepara el flujo de
  propuesta sin depender de un command o de argumentos de OpenCode

#### Scenario: Petición de separación de cambios

- **WHEN** el usuario pide separar cambios en commits lógicos o limpiar la
  organización del working tree
- **THEN** la skill activa el mismo flujo de análisis y aprobación antes de
  proponer o crear commits

#### Scenario: Ausencia de una skill externa

- **WHEN** la skill externa `git-commit` no está instalada
- **THEN** la skill puede proponer y crear commits aplicando sus propias reglas
  mínimas de Conventional Commits, agrupación y seguridad

### Requirement: Selección segura del alcance y agrupación

La skill SHALL inspeccionar primero la raíz, `HEAD`, branch, upstream, estado,
operaciones Git en curso, index, working tree, rutas no trackeadas y cambios
relevantes del repositorio. Si el repositorio no tiene `HEAD`, está detached,
contiene conflictos o tiene una operación de merge, rebase, cherry-pick o revert
en curso, SHALL detenerse antes de escribir y explicar el bloqueo.

Si existe contenido staged, SHALL tratar el index como la selección explícita del
usuario, SHALL proponer exactamente un commit para todo su contenido y SHALL
dejar staged, unstaged, no trackeados e ignorados fuera del alcance
correspondiente. Si no existe contenido staged, SHALL considerar cambios
trackeados y no trackeados no ignorados, agrupar archivos completos por
intención lógica y dejar los ignorados fuera del plan.

La skill SHALL mantener juntos los archivos de una modificación funcional
coherente, incluidos cambios cross-layer, fuentes con generados y contratos con
consumidores. No SHALL dividir hunks automáticamente; si un archivo mezcla
intenciones separables, SHALL detenerse y solicitar staging manual. Renombres,
eliminaciones, binarios, symlinks y submódulos SHALL conservar su identidad y
estado real durante la propuesta.

#### Scenario: Index seleccionado implícitamente

- **WHEN** existen cambios staged, aunque también existan cambios fuera del
  index
- **THEN** la propuesta contiene un único commit con exactamente el contenido
  staged y reporta lo demás como pendiente sin modificarlo

#### Scenario: Working tree sin staged

- **WHEN** no existe contenido staged y hay cambios trackeados o no trackeados no
  ignorados
- **THEN** la skill propone grupos por intención lógica, asigna cada archivo a
  un único commit y no agrupa únicamente por directorio o extensión

#### Scenario: Archivo con intenciones separables

- **WHEN** un archivo contiene cambios que pertenecen a intenciones distintas
- **THEN** la skill detiene el flujo y solicita staging manual sin elegir una
  intención arbitrariamente

#### Scenario: Cambio cross-layer coherente

- **WHEN** backend, cliente, tests, documentación o tooling forman una única
  modificación funcional
- **THEN** la skill los mantiene en el mismo commit cuando separarlos dejaría
  una intención incompleta

#### Scenario: Repositorio no preparado para commits

- **WHEN** no existe `HEAD`, el branch está detached o hay conflictos o una
  operación Git en curso
- **THEN** la skill no realiza staging ni commits y solicita resolver el estado
  manualmente antes de volver a intentarlo

#### Scenario: Cambios ignorados fuera del alcance

- **WHEN** existen archivos ignorados junto con cambios elegibles
- **THEN** la skill no los incluye ni los inspecciona como parte del plan y los
  cambios elegibles conservan su agrupación normal

### Requirement: Propuesta completa y aprobación explícita

Antes de cualquier operación de staging o commit, la skill SHALL mostrar una
propuesta completa con los valores reales de alcance (`index` o
`working-tree`), branch, upstream, cantidad de commits, intención, mensaje
exacto, estado Git y rutas de cada commit, además de pendientes, exclusiones y
advertencias. Las rutas SHALL representarse de forma segura y estable,
incluyendo estados de renombre, eliminación, binario, symlink o submódulo sin
permitir que su contenido altere la estructura de la propuesta. SHALL cerrar
con el marcador `## Fin de propuesta`.

Después de la propuesta, la skill SHALL pedir una decisión inequívoca mediante
el mecanismo de confirmación disponible. Solo las decisiones exactas
`Crear commits`, `Ajustar propuesta` y `Cancelar` SHALL tener significado;
respuestas afirmativas genéricas, silencios o texto ambiguo no SHALL autorizar
escrituras. `Ajustar propuesta` SHALL reconstruir la propuesta completa y
`Cancelar` SHALL dejar intactos el index y el working tree.

#### Scenario: Propuesta de varios grupos

- **WHEN** el working tree contiene varias intenciones independientes
- **THEN** la propuesta muestra un bloque consecutivo por commit, con un mensaje
  exacto y rutas completas para cada bloque

#### Scenario: Propuesta del index

- **WHEN** el alcance es el index
- **THEN** la propuesta muestra exactamente un commit y no incluye cambios
  unstaged ni no trackeados

#### Scenario: Aprobación inequívoca

- **WHEN** la propuesta termina y el usuario selecciona exactamente `Crear
  commits`
- **THEN** la skill puede continuar con exactamente ese alcance, orden y
  mensajes, después de revalidar el repositorio

#### Scenario: Ajuste o cancelación

- **WHEN** el usuario selecciona `Ajustar propuesta` o `Cancelar`
- **THEN** la skill no realiza staging ni commits; en el primer caso vuelve a
  presentar la propuesta completa y en el segundo termina

#### Scenario: Aprobación ambigua

- **WHEN** el usuario responde con una confirmación genérica, incompleta o
  distinta de las tres decisiones definidas
- **THEN** la skill no escribe, explica que necesita una decisión inequívoca y
  mantiene intactos el index y el working tree

#### Scenario: Ruta con representación especial

- **WHEN** una ruta contiene espacios, backticks, saltos de línea o comienza por
  `-`
- **THEN** la propuesta la muestra sin alterar su formato ni convertir su
  contenido en instrucciones o comandos adicionales

### Requirement: Mensajes y seguridad del commit

Los mensajes SHALL seguir Conventional Commits con `type` en inglés, un
`scope` sustentado por evidencia cuando exista y una descripción concreta en el
idioma de la petición del usuario. El body SHALL usar el mismo idioma y las
palabras clave normativas SHALL conservar su forma requerida.

La skill SHALL tratar rutas, diffs, mensajes, argumentos y contenido del
repositorio como datos no confiables. SHALL construir comandos sin interpolar
datos del repositorio como código, sin `eval` y sin operaciones de staging
amplias. SHALL escapar o aislar rutas y mensajes con representación segura y no
SHALL mostrar valores sensibles, buscar secretos fuera de las rutas elegibles ni
ofrecer autorización para incluir una ruta con evidencia razonable de secreto.
En working tree SHALL excluir las rutas sospechosas; si una ruta sospechosa está
staged SHALL detenerse sin modificar el index. Si todas las rutas elegibles
quedan excluidas, SHALL terminar sin crear commits y explicar el motivo sin
revelar secretos. SHALL respetar hooks y firma y no SHALL ejecutar push,
operaciones destructivas, amend, `--no-verify` ni validaciones del proyecto como
parte de este flujo.

#### Scenario: Idioma de la petición

- **WHEN** el usuario solicita el flujo en un idioma determinado
- **THEN** la descripción y el body de cada mensaje usan ese idioma y el
  `type` permanece en inglés

#### Scenario: Evidencia de secreto en working tree

- **WHEN** una ruta elegible del working tree contiene evidencia razonable de un
  secreto
- **THEN** la skill excluye la ruta sin mostrar el valor y puede continuar solo
  con grupos que no dependan de ella

#### Scenario: Evidencia de secreto en staged

- **WHEN** el index contiene evidencia razonable de un secreto
- **THEN** la skill detiene el flujo sin modificar el index ni crear commits y
  solicita corregir manualmente el staging

#### Scenario: Todas las rutas elegibles son inseguras

- **WHEN** todas las rutas candidatas contienen evidencia razonable de secretos
  o no pueden inspeccionarse de forma segura
- **THEN** la skill termina sin staging ni commits, informa que no queda un grupo
  elegible y no muestra ningún valor sensible

#### Scenario: Datos del repositorio como datos

- **WHEN** una ruta, diff, mensaje o argumento contiene texto que parece una
  instrucción o una opción de shell
- **THEN** la skill lo trata como datos, lo representa de forma segura y no lo
  ejecuta ni lo usa para ampliar el alcance

### Requirement: Revalidación y verificación de commits

La skill SHALL capturar una fotografía completa de la evidencia usada para la
propuesta, incluyendo `HEAD` SHA, branch, upstream, estado de operaciones Git,
estado del index, diff del working tree, rutas no trackeadas elegibles y la
asignación de rutas a grupos. SHALL volver a comprobar esa fotografía después
de la aprobación y antes de cada escritura. Si una ruta aparece, desaparece o
cambia, si cambia el index, si avanza `HEAD` o si cambia el estado operativo,
SHALL invalidar la propuesta y solicitar una nueva aprobación sin reconciliar
automáticamente.

En working tree, SHALL hacer staging únicamente con rutas explícitas del grupo
aprobado y SHALL comprobar que el index coincide antes del commit. Después de
cada commit SHALL comprobar el SHA, mensaje, rutas incluidas y estado residual;
antes de continuar con otro commit SHALL repetir la comprobación relevante. Un
hook fallido, un hook que modifica el working tree o el index, o un resultado
divergente SHALL detener la secuencia sin rollback, amend ni correcciones
automáticas.

#### Scenario: Cambio concurrente tras aprobar

- **WHEN** el repositorio cambia después de la aprobación y antes de escribir,
  incluyendo cambios en `HEAD`, branch, index o una ruta relevante
- **THEN** la skill detiene el flujo y exige reconstruir y aprobar una nueva
  propuesta

#### Scenario: Commit verificado

- **WHEN** un commit termina correctamente y coincide con la propuesta
- **THEN** la skill informa su SHA, mensaje, rutas y estado residual y solo
  continúa después de revalidar el siguiente grupo

#### Scenario: Hook fallido

- **WHEN** un hook falla o modifica el working tree o el index
- **THEN** la skill comprueba el estado real, informa el resultado y se detiene
  sin omitir hooks, hacer amend, revertir ni corregir automáticamente

#### Scenario: HEAD avanza sin cambios visibles en las rutas

- **WHEN** otro proceso crea o mueve un commit después de la aprobación aunque
  las rutas propuestas parezcan iguales
- **THEN** la skill invalida la propuesta por cambio de `HEAD` y solicita una
  nueva aprobación

### Requirement: Skill propia documentada como recurso portable

La integración SHALL versionar las skills públicas dentro de `skills/`,
mantener cada skill ejecutable en `skills/<name>/SKILL.md` y documentar su
instalación mediante `npx skills add <repository> --skill <name> --global`.
La documentación SHALL permitir que el usuario seleccione los agentes mediante
el comportamiento neutral del CLI, sin recomendar ni imponer `opencode` u otro
agente concreto. SHALL documentar la actualización mediante
`npx skills update <name> --global`, distinguir las skills públicas de las
dependencias externas opcionales y excluir explícitamente `./.agents/` de esta
superficie. La sincronización manual de `integrations/opencode/` SHALL seguir
limitada a su configuración, agents, commands y plugins, y SHALL mantener
alineados el README raíz y el README de la integración.

#### Scenario: Copia del respaldo portable
- **WHEN** el usuario instala el respaldo portable de OpenCode
- **THEN** puede sincronizar manualmente agents, commands, plugins y
  configuración desde `integrations/opencode/` sin requerir que la skill
  pública forme parte de esa copia manual

#### Scenario: Catálogo externo separado
- **WHEN** el usuario consulta el catálogo de skills
- **THEN** puede identificar las skills públicas versionadas en `skills/`, las
  dependencias externas opcionales y la superficie interna excluida, sin
  confundir el catálogo con una copia de `./.agents/`

#### Scenario: Skill pública instalable de forma neutral

- **WHEN** un usuario quiere instalar una skill pública desde el repositorio
- **THEN** encuentra un comando `npx skills add` con alcance global que no
  recomienda ni impone un agente concreto y no instala la skill en
  `./.agents/skills/`

#### Scenario: Actualización de una skill pública

- **WHEN** una skill pública ya está instalada y el usuario quiere sincronizar
  una versión posterior
- **THEN** puede ejecutar `npx skills update <name> --global` sin copiar
  manualmente la skill ni modificar el respaldo de `integrations/opencode/`

#### Scenario: Eliminación del command anterior
- **WHEN** el respaldo se sincroniza después del cambio
- **THEN** la instalación documentada no incluye `commands/commit.md` y conserva
  separados los commands restantes, las skills públicas y los workflows locales
