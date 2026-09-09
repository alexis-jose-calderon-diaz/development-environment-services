## ADDED Requirements

### Requirement: Indice breve de agentes portables

La integracion portable SHALL ofrecer en `integrations/opencode/AGENTS.md` un indice conciso de los agentes disponibles, incluyendo `analyzer`, `planner`, `implementer`, `reviewer` e `integration-checker`, su responsabilidad principal y su limite general de edicion. La guia SHALL remitir los metodos, limites detallados y formatos de salida a los contratos individuales de `integrations/opencode/agents/` sin duplicarlos.

#### Scenario: Consulta del conjunto portable

- **WHEN** un usuario consulta la guia comun de la integracion
- **THEN** puede identificar los cinco agentes portables y distinguir cuales operan solo en lectura y cuales pueden editar dentro de un alcance acotado

#### Scenario: Seleccion de un agente

- **WHEN** el usuario tiene una tarea de analisis, planificacion, implementacion, revision o comprobacion de integracion
- **THEN** la guia permite seleccionar el rol apropiado sin exigir la lectura de todos los contratos individuales ni conocer un workflow externo

#### Scenario: Detalle de un contrato

- **WHEN** un usuario necesita conocer el metodo o el formato de salida de un agente
- **THEN** la guia dirige al contrato individual correspondiente y no presenta una segunda version extensa o contradictoria de ese contrato

#### Scenario: Toolkit aplicado en otro repositorio

- **WHEN** la integracion portable se aplica bajo otra ubicacion o junto a workflows propios del repositorio consumidor
- **THEN** el indice de agentes conserva sus nombres, responsabilidades y limites sin asumir rutas locales ni configuraciones del consumidor
