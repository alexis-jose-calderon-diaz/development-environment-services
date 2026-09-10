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
