# Spec Delta

## ADDED Requirements

### Requirement: Skills portables de análisis y planificación

La superficie pública SHALL proporcionar skills independientes y autosuficientes para analizar el impacto de un cambio y preparar un plan de ejecución. `change-impact-analysis` SHALL operar en modo read-only, identificar la superficie directamente relevante, riesgos, consumidores y complejidad, y distinguir hechos confirmados de incertidumbres. `change-planning` SHALL poder iniciar su propia inspección proporcional cuando el usuario pida un plan y SHALL producir unidades, dependencias, modos de ejecución y validaciones sin exigir un informe interno de otro agente.

#### Scenario: Análisis de impacto solicitado por el usuario

- **WHEN** el usuario pide evaluar el impacto, alcance o riesgos de un cambio antes de implementarlo
- **THEN** `change-impact-analysis` devuelve un análisis fundamentado en el repositorio actual sin modificar archivos

#### Scenario: Plan solicitado sin contexto de orquestador

- **WHEN** el usuario pide un plan técnico para una tarea y no proporciona un `Analysis Report` previo
- **THEN** `change-planning` inspecciona el contexto mínimo necesario y devuelve un plan verificable sin bloquear por la ausencia de una delegación previa

#### Scenario: Tarea pequeña

- **WHEN** la tarea no obtiene beneficio real de dividirse
- **THEN** la skill de planificación recomienda una única unidad en lugar de crear coordinación artificial

### Requirement: Skills portables de revisión e integración

La superficie pública SHALL proporcionar una skill para revisar cambios contra un objetivo y sus criterios, y una skill para auditar fronteras de integración. `change-review` SHALL ser read-only por contrato, priorizar incumplimientos con evidencia y distinguir hallazgos confirmados, incertidumbres, riesgos residuales y brechas de pruebas. `integration-boundary-audit` SHALL limitarse a comprobar coherencia entre módulos, contratos, consumidores, persistencia, salidas generadas y tests; no SHALL aplicar correcciones automáticamente.

#### Scenario: Revisión contra criterios

- **WHEN** el usuario pide revisar un diff o una implementación con un objetivo y criterios disponibles
- **THEN** `change-review` informa hallazgos accionables con ubicación, evidencia, impacto y recomendación, sin editar archivos

#### Scenario: Revisión sin workflow formal

- **WHEN** el usuario pide una revisión genérica sin especificación OpenSpec
- **THEN** `change-review` usa el objetivo, el alcance y la evidencia disponible sin exigir un identificador o workflow externo

#### Scenario: Auditoría de fronteras

- **WHEN** el usuario pide verificar que varias piezas de un cambio distribuido encajan entre sí
- **THEN** `integration-boundary-audit` comprueba únicamente las fronteras relevantes y marca como no verificadas las que carecen de evidencia suficiente

#### Scenario: Problema que requiere una decisión de diseño

- **WHEN** una incompatibilidad no puede resolverse sin cambiar una decisión pública o ampliar el alcance
- **THEN** la auditoría informa el bloqueo y no modifica archivos ni inventa una corrección

### Requirement: Límites explícitos de las skills frente a los permisos

Las skills migradas SHALL documentar que sus instrucciones read-only no constituyen un aislamiento de permisos equivalente al de un agente configurado. La documentación SHALL indicar que el agente seleccionado y sus permisos efectivos siguen siendo responsables de impedir ediciones, delegaciones u operaciones no autorizadas.

#### Scenario: Carga de una skill read-only en un agente con edición

- **WHEN** el agente actual tiene permisos de edición y carga `change-review` o `integration-boundary-audit`
- **THEN** la skill conserva la instrucción de no editar, pero la documentación no presenta esa instrucción como una garantía de seguridad del runtime

#### Scenario: Uso de una skill en Plan mode

- **WHEN** el usuario quiere una revisión estrictamente sin modificaciones y utiliza un agente con permisos read-only
- **THEN** la skill puede ejecutarse dentro de ese límite efectivo y devolver solo el informe solicitado

## MODIFIED Requirements

### Requirement: Agentes de rol reutilizables

La integración portable SHALL dejar de proporcionar agentes personalizados para analizar, planificar, implementar, revisar e integrar. En su lugar, SHALL proporcionar skills públicas autosuficientes para los flujos de análisis de impacto, planificación, revisión y auditoría de integración. Esas skills SHALL operar sobre la petición del usuario y el estado actual del repositorio, sin depender de un prompt de orquestador, un informe interno previo, un identificador externo o un `Scope` delegado implícito.

Las skills de análisis y revisión SHALL conservar la disciplina de contexto mínimo, alcance, evidencia, validación y riesgos. La auditoría de integración SHALL ser read-only y no SHALL sustituir la coordinación de ownership que antes correspondía a un agente delegado.

#### Scenario: Flujo de análisis sin agente personalizado

- **WHEN** los agentes portables personalizados no están instalados
- **THEN** el usuario puede cargar una skill pública para analizar el cambio y obtener un informe basado en el contexto disponible

#### Scenario: Flujo de revisión genérica

- **WHEN** `change-review` recibe un objetivo, un alcance, criterios de aceptación y un diff sin una especificación externa
- **THEN** identifica hallazgos concretos contra ese contexto y devuelve su informe sin bloquear por la ausencia de un workflow formal

#### Scenario: Flujo de integración sin corrección automática

- **WHEN** `integration-boundary-audit` encuentra una incompatibilidad concreta
- **THEN** informa la frontera, la evidencia, el impacto y la acción recomendada sin editar archivos

### Requirement: Separación de configuraciones local y global

La documentación del repositorio, principalmente el `README.md` de la integración y el `AGENTS.md` raíz cuando corresponda, SHALL explicar que el `AGENTS.md` raíz y la configuración del proyecto consumidor pertenecen a ese proyecto, mientras `integrations/opencode/` contiene el respaldo versionado de la configuración portable que se instala manualmente bajo `~/.config/opencode/`. SHALL distinguir también la superficie pública de skills versionadas bajo `skills/`, las dependencias externas gestionadas por el CLI `skills` y la superficie interna `./.agents/`, que no forma parte del catálogo público ni de la instalación documentada. SHALL distinguir los comandos globales de OpenCode de los workflows locales del proyecto y SHALL evitar instrucciones que mezclen ambas superficies. El `integrations/opencode/AGENTS.md` SHALL limitarse a reglas aplicables a los recursos dentro de su propio scope, ser agnóstico de ubicación y no asumir que es una política global, una instalación operativa o parte de un repositorio consumidor concreto. La documentación portable SHALL dejar de presentar agentes personalizados o protocolos de HANDOFF eliminados como recursos instalables.

#### Scenario: Consulta de la guía de integración

- **WHEN** un usuario consulta el `README.md` de la integración o el `AGENTS.md` raíz
- **THEN** puede identificar el propósito, la ubicación operativa, la relación y los límites de `integrations/opencode/`, `skills/` y `./.agents/`, sin interpretar la superficie interna como un recurso público ni encontrar agentes eliminados en el inventario instalable

#### Scenario: Aplicación aislada de las reglas del toolkit

- **WHEN** el `integrations/opencode/AGENTS.md` se aplica bajo cualquier ubicación que contenga sus recursos de scope
- **THEN** sus reglas se mantienen válidas sin depender de una ruta de instalación, un repositorio consumidor, una estructura de workflows o una política local concreta

#### Scenario: Instalación portable sin agentes personalizados

- **WHEN** el usuario sincroniza manualmente la configuración portable
- **THEN** copia únicamente los recursos documentados que permanezcan en `integrations/opencode/`, conserva separadas las reglas y configuraciones del proyecto consumidor y no copia `./.agents/`

### Requirement: Skill propia documentada como recurso portable

La integración SHALL versionar las skills públicas dentro de `skills/`, mantener cada skill ejecutable en `skills/<name>/SKILL.md` y documentar su instalación mediante `npx skills add <repository> --skill <name> --global`. La documentación SHALL permitir que el usuario seleccione el agente mediante el comportamiento neutral del CLI, sin recomendar ni imponer `opencode` u otro agente concreto. SHALL documentar la actualización mediante `npx skills update <name> --global`, distinguir las skills públicas de las dependencias externas opcionales y excluir explícitamente `./.agents/` de esta superficie. La sincronización manual de `integrations/opencode/` SHALL quedar limitada a la configuración, commands y plugins que permanezcan, sin incluir agentes personalizados eliminados, y SHALL mantener alineados el README raíz y el README de la integración.

#### Scenario: Copia del respaldo portable

- **WHEN** el usuario instala el respaldo portable de OpenCode
- **THEN** puede sincronizar manualmente la configuración, los commands y los plugins que permanezcan desde `integrations/opencode/` sin requerir que las skills públicas formen parte de esa copia manual

#### Scenario: Catálogo externo separado

- **WHEN** el usuario consulta el catálogo de skills
- **THEN** puede identificar las skills públicas versionadas en `skills/`, las dependencias externas opcionales y la superficie interna excluida, sin confundir el catálogo con una copia de `./.agents/`

#### Scenario: Skill pública instalable de forma neutral

- **WHEN** un usuario quiere instalar una skill pública desde el repositorio
- **THEN** encuentra un comando `npx skills add` con alcance global que no recomienda ni impone un agente concreto y no instala la skill en `./.agents/skills/`

#### Scenario: Actualización de una skill pública

- **WHEN** una skill pública ya está instalada y el usuario quiere sincronizar una versión posterior
- **THEN** puede ejecutar `npx skills update <name> --global` sin copiar manualmente la skill ni modificar el respaldo de `integrations/opencode/`

## REMOVED Requirements

### Requirement: Implementer respects context budget signals

**Reason**: El agente `implementer` y su contrato de señales runtime no se trasladan a una skill pública; las skills no controlan sesiones hijas ni reciben autoridad sobre el presupuesto del runtime.

**Migration**: El agente principal usará la compactación y los límites nativos de OpenCode. Si en el futuro se requiere delegación con HANDOFF, deberá diseñarse como una integración de agentes separada y no asumirse como comportamiento de las skills.

### Requirement: HANDOFF durable y estructurado

**Reason**: El formato `HANDOFF` era un contrato entre workers delegados y su orquestador, no una capacidad iniciada directamente por el usuario.

**Migration**: Los informes de las skills terminarán con el resultado de su workflow y señalarán riesgos o trabajo pendiente sin prometer continuidad automática de una sesión agotada.

### Requirement: Continuación de HANDOFF en una sesión hija nueva

**Reason**: La continuidad automática depende de agentes subagent, ownership y coordinación que se eliminan de la integración portable.

**Migration**: Las tareas posteriores se iniciarán como nuevas peticiones del usuario o mediante las capacidades nativas de OpenCode que el usuario configure por separado.

### Requirement: Índice breve de agentes portables

**Reason**: Ya no existirá un conjunto portable de cinco agentes personalizados que documentar.

**Migration**: `integrations/opencode/AGENTS.md` mantendrá reglas comunes del toolkit y remitirá al catálogo de skills públicas cuando corresponda. Los detalles de cada skill vivirán en su propio `SKILL.md` y en `skills/README.md`.
