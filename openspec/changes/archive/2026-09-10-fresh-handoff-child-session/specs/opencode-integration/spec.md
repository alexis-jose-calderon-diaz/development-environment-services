## ADDED Requirements

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
