## ADDED Requirements

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
