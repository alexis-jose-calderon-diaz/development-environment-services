## Purpose

Esta capacidad proporciona una señal runtime confiable sobre la presión de
contexto de cada sesión de OpenCode y limita el consumo adicional de contexto
de los workers hijos cuando alcanzan su presupuesto configurado.

## ADDED Requirements

### Requirement: Presupuesto de contexto aislado por sesión

El plugin SHALL mantener un presupuesto independiente para cada sesión de
OpenCode y SHALL clasificarlo como `NORMAL`, `SOFT` o `HARD` según los límites
configurados. SHALL usar el último uso autoritativo reportado para la sesión,
no la suma histórica de todos los mensajes ni un cálculo proporcionado por el
modelo.

#### Scenario: Sesiones concurrentes independientes

- **WHEN** dos sesiones distintas reciben actualizaciones de uso al mismo tiempo
- **THEN** cada sesión conserva su propia estimación y transición de estado, y alcanzar `HARD` en una no cambia el estado de la otra

#### Scenario: Uso autoritativo del asistente

- **WHEN** OpenCode actualiza un mensaje assistant con `input`, `output`, `cache.read` y `cache.write`
- **THEN** el plugin estima el contexto con `input + output + cache.read + cache.write`, trata `reasoning` como parte ya representada por `output`, y reemplaza la estimación anterior en vez de acumularla como facturación histórica

#### Scenario: Resultado de herramienta aún no reflejado

- **WHEN** una herramienta produce texto después del último uso autoritativo y antes de la siguiente solicitud del modelo
- **THEN** el plugin añade provisionalmente `ceil(text.length / 4)` a la estimación de esa sesión y descarta esa estimación provisional cuando llega el siguiente uso autoritativo

#### Scenario: Evento duplicado

- **WHEN** OpenCode entrega más de una vez el mismo mensaje assistant o el mismo resultado de herramienta
- **THEN** el plugin no cuenta dos veces el uso ni el resultado ya procesado

### Requirement: Transiciones y señales de presupuesto

El plugin SHALL clasificar `NORMAL` cuando la estimación sea menor que
`softLimit`, `SOFT` cuando sea igual o mayor que `softLimit` y menor que
`hardLimit`, y `HARD` cuando sea igual o mayor que `hardLimit`. En `SOFT` o
`HARD` SHALL conservar las instrucciones existentes y añadir una única
instrucción de sistema apropiada a la solicitud actual.

#### Scenario: Sesión bajo el límite blando

- **WHEN** la estimación es menor que `softLimit`
- **THEN** el estado es `NORMAL` y no se añade una instrucción de presupuesto

#### Scenario: Alcance del límite blando

- **WHEN** la estimación alcanza `softLimit` sin alcanzar `hardLimit`
- **THEN** el estado cambia a `SOFT` y la solicitud incluye una instrucción que pide evitar exploración amplia, completar la unidad coherente actual y prepararse para detenerse

#### Scenario: Alcance del límite duro

- **WHEN** la estimación alcanza `hardLimit`
- **THEN** el estado cambia a `HARD` y la solicitud incluye una instrucción que ordena detener el trabajo normal, no iniciar exploración o implementación adicional y devolver un `## HANDOFF` conciso

#### Scenario: Instrucciones existentes preservadas

- **WHEN** otra parte de OpenCode ya proporcionó instrucciones de sistema
- **THEN** la señal de presupuesto se añade sin reemplazar, eliminar ni reordenar destructivamente las instrucciones existentes

### Requirement: HANDOFF textual en estado HARD

La instrucción `HARD` SHALL solicitar un `## HANDOFF` textual con, como
mínimo, las secciones `Objective`, `Completed`, `Remaining`, `Decisions`,
`Files changed`, `Relevant files`, `Verification` y `Next action`. El plugin
no SHALL generar, recibir, interpretar ni continuar automáticamente ese
HANDOFF.

#### Scenario: Worker devuelve el HANDOFF

- **WHEN** una sesión monitorizada está en `HARD` y el modelo produce una respuesta textual
- **THEN** la respuesta puede entregarse normalmente aunque la sesión permanezca en `HARD`

#### Scenario: No hay continuación automática

- **WHEN** se produce una instrucción `HARD`
- **THEN** el plugin no crea otra sesión, no invoca otro agente y no modifica el flujo del orquestador

### Requirement: Protección de herramientas para workers hijos

El plugin SHALL bloquear cualquier ejecución de herramienta posterior a `HARD`
en una sesión monitorizada, mediante el mecanismo pre-ejecución disponible,
con un error que indique que el presupuesto está agotado y que debe devolverse
el HANDOFF. SHALL permitir que la respuesta textual final continúe.

#### Scenario: Herramienta bloqueada en HARD

- **WHEN** un worker hijo monitorizado en `HARD` intenta ejecutar una herramienta
- **THEN** la ejecución se rechaza con un mensaje `CONTEXT_BUDGET_HARD_STOP` y la sesión puede seguir generando texto

#### Scenario: Herramienta permitida antes de HARD

- **WHEN** una sesión monitorizada está en `NORMAL` o `SOFT`
- **THEN** sus herramientas no son bloqueadas por este plugin

#### Scenario: Sesión primaria protegida

- **WHEN** una sesión no tiene un `parentID` confirmado
- **THEN** el plugin no aplica SOFT ni HARD ni bloquea sus herramientas por defecto

### Requirement: Configuración y validación segura

El plugin SHALL centralizar al menos `softLimit` y `hardLimit`, usando por
defecto `330000` y `350000`. SHALL permitir sobrescribirlos mediante
`OPENCODE_CONTEXT_SOFT_LIMIT` y `OPENCODE_CONTEXT_HARD_LIMIT`, y SHALL
rechazar la carga si `softLimit` no es positivo o si `hardLimit` no es mayor
que `softLimit`. La selección opcional de agentes monitorizados SHALL poder
configurarse sin modificar archivos de agentes.

#### Scenario: Configuración por defecto

- **WHEN** no se proporcionan límites personalizados
- **THEN** el plugin usa `softLimit=330000` y `hardLimit=350000`

#### Scenario: Configuración de desarrollo

- **WHEN** se proporcionan límites positivos con `hardLimit` mayor que `softLimit`
- **THEN** el plugin usa esos límites para permitir validaciones con presupuestos pequeños

#### Scenario: Configuración inválida

- **WHEN** falta un valor numérico, un límite no es positivo o `hardLimit` no es mayor que `softLimit`
- **THEN** el plugin falla claramente durante la carga y no inicia una protección con límites ambiguos

### Requirement: Ciclo de vida y diagnóstico

El plugin SHALL eliminar el estado de una sesión cuando OpenCode notifique su
eliminación, SHALL liberar todo el estado al descargarse y SHALL reiniciar la
estimación y el estado a `NORMAL` después de una compactación confirmada. SHALL
registrar únicamente transiciones de estado, errores de configuración y fallos
significativos, sin registrar cada actualización de tokens.

#### Scenario: Compactación automática

- **WHEN** OpenCode notifica que una sesión fue compactada
- **THEN** el plugin descarta la estimación previa y comienza un nuevo periodo en `NORMAL`

#### Scenario: Eliminación de sesión

- **WHEN** OpenCode notifica `session.deleted`
- **THEN** el plugin elimina el estado asociado y no conserva referencias indefinidamente

#### Scenario: Logging de transiciones

- **WHEN** una sesión cambia de `NORMAL` a `SOFT` o de `SOFT` a `HARD`
- **THEN** el plugin registra una línea diagnóstica concisa con la sesión, estado anterior, estado nuevo y estimación

#### Scenario: Sin inundación de logs

- **WHEN** se reciben actualizaciones que mantienen el mismo estado
- **THEN** el plugin no registra una línea por cada actualización
