# Spec Delta

## MODIFIED Requirements

### Requirement: Skills portables de análisis y planificación

La superficie pública SHALL proporcionar skills independientes y autosuficientes para analizar el impacto de un cambio y preparar un plan de ejecución. `ac-change-impact-analysis` SHALL operar en modo read-only, identificar la superficie directamente relevante, riesgos, consumidores y complejidad, y distinguir hechos confirmados de incertidumbres. `ac-change-planning` SHALL poder iniciar su propia inspección proporcional cuando el usuario pida un plan y SHALL producir unidades, dependencias, modos de ejecución y validaciones sin exigir un informe interno de otro agente.

#### Scenario: Análisis de impacto solicitado por el usuario

- **WHEN** el usuario pide evaluar el impacto, alcance o riesgos de un cambio antes de implementarlo
- **THEN** `ac-change-impact-analysis` devuelve un análisis fundamentado en el repositorio actual sin modificar archivos

#### Scenario: Plan solicitado sin contexto de orquestador

- **WHEN** el usuario pide un plan técnico para una tarea y no proporciona un `Analysis Report` previo
- **THEN** `ac-change-planning` inspecciona el contexto mínimo necesario y devuelve un plan verificable sin bloquear por la ausencia de una delegación previa

#### Scenario: Tarea pequeña

- **WHEN** la tarea no obtiene beneficio real de dividirse
- **THEN** la skill de planificación recomienda una única unidad en lugar de crear coordinación artificial

### Requirement: Skills portables de revisión e integración

La superficie pública SHALL proporcionar una skill para revisar cambios contra un objetivo y sus criterios, y una skill para auditar fronteras de integración. `ac-change-review` SHALL ser read-only por contrato, priorizar incumplimientos con evidencia y distinguir hallazgos confirmados, incertidumbres, riesgos residuales y brechas de pruebas. `ac-integration-boundary-audit` SHALL limitarse a comprobar coherencia entre módulos, contratos, consumidores, persistencia, salidas generadas y tests; no SHALL aplicar correcciones automáticamente.

#### Scenario: Revisión contra criterios

- **WHEN** el usuario pide revisar un diff o una implementación con un objetivo y criterios disponibles
- **THEN** `ac-change-review` informa hallazgos accionables con ubicación, evidencia, impacto y recomendación, sin editar archivos

#### Scenario: Revisión sin workflow formal

- **WHEN** el usuario pide una revisión genérica sin especificación OpenSpec
- **THEN** `ac-change-review` usa el objetivo, el alcance y la evidencia disponible sin exigir un identificador o workflow externo

#### Scenario: Auditoría de fronteras

- **WHEN** el usuario pide verificar que varias piezas de un cambio distribuido encajan entre sí
- **THEN** `ac-integration-boundary-audit` comprueba únicamente las fronteras relevantes y marca como no verificadas las que carecen de evidencia suficiente

#### Scenario: Problema que requiere una decisión de diseño

- **WHEN** una incompatibilidad no puede resolverse sin cambiar una decisión pública o ampliar el alcance
- **THEN** la auditoría informa el bloqueo y no modifica archivos ni inventa una corrección

### Requirement: Límites explícitos de las skills frente a los permisos

Las skills migradas SHALL documentar que sus instrucciones read-only no constituyen un aislamiento de permisos equivalente al de un agente configurado. La documentación SHALL indicar que el agente seleccionado y sus permisos efectivos siguen siendo responsables de impedir ediciones, delegaciones u operaciones no autorizadas.

#### Scenario: Carga de una skill read-only en un agente con edición

- **WHEN** el agente actual tiene permisos de edición y carga `ac-change-review` o `ac-integration-boundary-audit`
- **THEN** la skill conserva la instrucción de no editar, pero la documentación no presenta esa instrucción como una garantía de seguridad del runtime

#### Scenario: Uso de una skill en Plan mode

- **WHEN** el usuario quiere una revisión estrictamente sin modificaciones y utiliza un agente con permisos read-only
- **THEN** la skill puede ejecutarse dentro de ese límite efectivo y devolver solo el informe solicitado

### Requirement: Agentes de rol reutilizables

La integración portable SHALL dejar de proporcionar agentes personalizados para analizar, planificar, implementar, revisar e integrar. En su lugar, SHALL proporcionar skills públicas autosuficientes para los flujos de análisis de impacto, planificación, revisión y auditoría de integración. Esas skills SHALL operar sobre la petición del usuario y el estado actual del repositorio, sin depender de un prompt de orquestador, un informe interno previo, un identificador externo o un `Scope` delegado implícito.

Las skills de análisis y revisión SHALL conservar la disciplina de contexto mínimo, alcance, evidencia, validación y riesgos. La auditoría de integración SHALL ser read-only y no SHALL sustituir la coordinación de ownership que antes correspondía a un agente delegado.

#### Scenario: Flujo de análisis sin agente personalizado

- **WHEN** los agentes portables personalizados no están instalados
- **THEN** el usuario puede cargar una skill pública para analizar el cambio y obtener un informe basado en el contexto disponible

#### Scenario: Flujo de revisión genérica

- **WHEN** `ac-change-review` recibe un objetivo, un alcance, criterios de aceptación y un diff sin una especificación externa
- **THEN** identifica hallazgos concretos contra ese contexto y devuelve su informe sin bloquear por la ausencia de un workflow formal

#### Scenario: Flujo de integración sin corrección automática

- **WHEN** `ac-integration-boundary-audit` encuentra una incompatibilidad concreta
- **THEN** informa la frontera, la evidencia, el impacto y la acción recomendada sin editar archivos

### Requirement: Skill propia documentada como recurso portable

La integración SHALL versionar las skills públicas dentro de `skills/`, mantener cada skill ejecutable en `skills/<name>/SKILL.md` y documentar su instalación mediante `npx skills add <repository> --skill <name> --global`. Los cinco nombres públicos SHALL usar el prefijo `ac-`: `ac-change-impact-analysis`, `ac-change-planning`, `ac-change-review`, `ac-grouped-commits` y `ac-integration-boundary-audit`. La documentación SHALL permitir que el usuario seleccione el agente mediante el comportamiento neutral del CLI, sin recomendar ni imponer `opencode` u otro agente concreto. SHALL documentar la actualización mediante `npx skills update <name> --global`, distinguir las skills públicas de las dependencias externas opcionales y excluir explícitamente `./.agents/` de esta superficie. La sincronización manual de `integrations/opencode/` SHALL quedar limitada a la configuración, commands y plugins que permanezcan, sin incluir agentes personalizados eliminados, y SHALL mantener alineados el README raíz y el README de la integración.

#### Scenario: Copia del respaldo portable

- **WHEN** el usuario instala el respaldo portable de OpenCode
- **THEN** puede sincronizar manualmente la configuración, los commands y los plugins que permanezcan desde `integrations/opencode/` sin requerir que las skills públicas formen parte de esa copia manual

#### Scenario: Catálogo externo separado

- **WHEN** el usuario consulta el catálogo de skills
- **THEN** puede identificar las skills públicas versionadas en `skills/`, las dependencias externas opcionales y la superficie interna excluida, sin confundir el catálogo con una copia de `./.agents/`

#### Scenario: Skill pública instalable de forma neutral

- **WHEN** un usuario quiere instalar una skill pública desde el repositorio
- **THEN** encuentra un comando `npx skills add` con alcance global que usa el identificador público con prefijo `ac-`, no recomienda ni impone un agente concreto y no instala la skill en `./.agents/skills/`

#### Scenario: Actualización de una skill pública

- **WHEN** una skill pública con identificador `ac-*` ya está instalada y el usuario quiere sincronizar una versión posterior
- **THEN** puede ejecutar `npx skills update <name> --global` sin copiar manualmente la skill ni modificar el respaldo de `integrations/opencode/`

#### Scenario: Eliminación del command anterior

- **WHEN** el respaldo se sincroniza después del cambio
- **THEN** la instalación documentada no incluye `commands/commit.md` y conserva separados los commands restantes, las skills públicas y los workflows locales
