## ADDED Requirements

### Requirement: Guia portable agnostica de workflow

La configuracion portable SHALL limitar sus reglas obligatorias a herramientas disponibles, comportamiento, seguridad y convenciones generales de trabajo. No SHALL exigir una declaracion, identificador, snapshot, comando o protocolo perteneciente a un workflow externo para iniciar una tarea generica.

#### Scenario: Tarea generica sin contexto externo

- **WHEN** un agente recibe una tarea ordinaria sin contexto de un workflow especifico
- **THEN** puede analizar, planificar, implementar o integrar respetando el objetivo y las restricciones recibidas, sin devolver `BLOCKED` por la ausencia de un identificador externo

#### Scenario: Toolkit instalado en otro proyecto

- **WHEN** la configuracion portable se aplica en un repositorio consumidor con sus propias reglas y workflows
- **THEN** las reglas del toolkit siguen siendo validas sin asumir una estructura de artifacts, una branch, una ruta de planificacion o un CLI del consumidor

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

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Activación por contexto OpenSpec

**Reason**: La configuracion portable deja de imponer conocimiento o activacion de un workflow especifico.

**Migration**: Los workflows que necesiten un contrato formal deben transportar sus requisitos y criterios como contexto normal del prompt o mantener sus reglas en la configuracion local correspondiente.

### Requirement: Validación fail-closed del contexto heredado

**Reason**: El toolkit portable ya no valida snapshots ni identificadores pertenecientes a un workflow externo.

**Migration**: La validacion de contexto especifico queda a cargo del workflow que lo define; los agentes portables solo verifican la coherencia del objetivo, scope, restricciones y criterios recibidos.

### Requirement: Propagación del identificador real entre agentes

**Reason**: La delegacion portable no debe depender de identificadores de cambios ni de una sintaxis de activacion externa.

**Migration**: El orquestador debe propagar directamente el contexto contractual relevante mediante las secciones estructuradas del prompt, sin identificadores o snapshots que no sean necesarios para la subtarea.
