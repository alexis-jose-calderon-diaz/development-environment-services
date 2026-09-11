## MODIFIED Requirements

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
