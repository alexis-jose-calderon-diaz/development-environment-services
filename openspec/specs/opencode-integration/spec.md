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
