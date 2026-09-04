---
name: openspec-change-context-bootstrap
description: "Prepara un contexto compacto y contractual para un cambio OpenSpec. Se usa únicamente cuando la tarea declara una línea inequívoca OpenSpec change: <change-id>."
---

# OpenSpec Change Context Bootstrap

## Activación y bloqueo inicial

Esta skill es condicional. Solo se activa si la solicitud operativa contiene una única línea de texto, no un ejemplo, una plantilla, un comentario ni un bloque citado, con este formato:

```text
OpenSpec change: <change-id>
```

El ID debe estar en la misma línea, sin prefijos ni backticks, no estar vacío ni ser un placeholder (`<change-id>`, `TODO`, `TBD`, `unknown`, `none`, `...` u otro equivalente). Conserva el valor exacto; no lo normalices ni lo infieras desde una rama, ruta, nombre de artifact, commit o texto cercano.

Detén el trabajo y reporta `BLOCKED` si ocurre cualquiera de estas condiciones:

- la tarea pide trabajo OpenSpec pero no contiene la línea declarativa;
- falta el ID, es ambiguo, hay más de una declaración o aparecen IDs contradictorios;
- el cambio no puede resolverse mediante OpenSpec.

Si la tarea no es OpenSpec y no contiene esa declaración, no cargues esta skill ni conviertas el repositorio en un workflow OpenSpec. Una mención incidental de OpenSpec o una línea de ejemplo en documentación no es una declaración operativa.
Trabajar sobre el propio toolkit, sus reglas o esta skill tampoco lo convierte por sí solo en un cambio OpenSpec consumidor; sin una declaración operativa, conserva el flujo genérico.

## Orden obligatorio del bootstrap

Después de pasar el gate de ID y antes de inspeccionar, editar, revisar o validar el repositorio:

1. Sigue primero cualquier instrucción o skill OpenSpec aplicable que ya haya sido proporcionada por la tarea, el contexto de sesión o las reglas del proyecto. Si no se proporcionó ninguna, no inventes una; esta skill define el bootstrap común.
2. Comprueba que el ejecutable `openspec` esté disponible. Si no existe, termina con `BLOCKED`.
3. Cuando el root sea desconocido o la resolución falle, ejecuta `openspec context --json`. Un resultado `no_openspec_root`, un error, una salida no JSON o un contexto inválido son bloqueos. Respeta el root que resuelva el CLI, que puede provenir de un root cercano, `config.yaml` o un store; no supongas una carpeta concreta.
4. Obtén el estado del cambio con el comando real de OpenSpec CLI 1.10.0:

   ```text
   openspec status --change "<change-id>" --json
   ```

5. Obtén y aplica la guía operativa del cambio con:

   ```text
   openspec instructions apply --change "<change-id>" --json
   ```

   Consume `instruction` y `context`, además de `operationGuidance` y los `contextFiles` cuando el CLI los devuelva, antes de entrar en el código. Las instrucciones o skills OpenSpec devueltas por el CLI se aplican antes de cualquier inspección genérica del repositorio; no inventes campos ausentes.

Una salida con código de error, JSON inválido, cambio inexistente, root no resuelto, contexto no válido o campos imprescindibles ausentes bloquea el bootstrap; detente antes del siguiente comando cuando la respuesta actual no sea válida. No continúes como si fuera un repositorio genérico ni sustituyas estos comandos por búsquedas manuales.

## Contrato de las respuestas del CLI

Trata las respuestas del CLI como la fuente de resolución. Conserva, cuando estén presentes, `changeRoot`, `planningHome`, `artifactPaths`, `actionContext`, `schemaName`, el estado de artifacts y el progreso de `status`; y `contextFiles`, `instruction`, `context`, `operationGuidance`, el progreso y las tareas de `instructions apply`. No reconstruyas estos datos desde convenciones locales.

El `status` debe identificar el change solicitado —por ejemplo mediante `changeName`— y ese identificador debe coincidir exactamente con la declaración recibida; también debe proporcionar un contexto de root/schema utilizable. Si `instructions apply` emite un identificador o una ruta de cambio, debe ser coherente con ese mismo ID y root. Su respuesta debe ser interpretable para saber qué guía y qué contexto aplicar. Si la forma o el contenido no permiten comprobar esto, reporta contexto inválido y bloquea.

## Resolución de artifacts y contexto

Las únicas rutas candidatas son las emitidas por el CLI:

- cada `outputPath` y `resolvedOutputPath` dentro de `artifactPaths`;
- cada entrada de `existingOutputPaths` dentro de `artifactPaths`;
- cada ruta de `contextFiles`.

Usa esas rutas tal como fueron devueltas y lee solo las que existan y sean relevantes para el rol. Si una ruta relativa no tiene una resolución proporcionada por el CLI, no inventes su base. Nunca hardcodees una estructura de cambios ni derives rutas por nombres esperados. Para informes, aplica la convención global de rutas relativas usando únicamente el root de proyecto emitido por el CLI como base ya resuelta; no muestres rutas absolutas ni inventes otra base.

No asumas que existen `proposal`, `design`, `tasks`, deltas/specs u otros artifacts. Puedes leerlos únicamente si el payload los identifica y el archivo existe. Distingue lo requerido de lo opcional según el schema, `status` o `instructions`: si un artifact o `contextFile` requerido está ausente, no existe o no es legible, termina con `BLOCKED`; si es opcional, registra su ausencia y continúa sin fabricarlo.

## Snapshot mínimo

Deriva un snapshot orientado al rol, no una copia de artifacts ni una descripción de todo el repositorio. Incluye solo hechos respaldados por las respuestas del CLI, la solicitud/rol recibidos y los archivos identificados:

- la línea exacta `OpenSpec change: <change-id>`;
- `schemaName`, root de cambio (`changeRoot`) y `planningHome` cuando estén disponibles;
- `actionContext` cuando esté disponible, limitado a las restricciones y roots permitidos relevantes;
- objetivo;
- responsabilidad, alcance y fuera de alcance;
- requisitos contractuales y deltas relevantes;
- decisiones y restricciones;
- criterios de aceptación;
- tareas relacionadas, dependencias y progreso;
- estado de artifacts y validaciones conocidas, indicando qué está verificado y qué no;
- rutas fuente emitidas por el CLI, sin copiar su contenido completo.

No rellenes campos ausentes con suposiciones. Marca un dato como no indicado o bloquea si las instrucciones lo hacen obligatorio. Filtra el snapshot según el rol:

- `analyzer`: contrato, alcance, restricciones, dependencias e impacto que debe investigar;
- `planner`: requisitos, deltas, tareas, dependencias, gates y criterios que condicionan el plan;
- `implementer`: requisitos aplicables, decisiones, restricciones y criterios de aceptación para su scope;
- `reviewer`: contrato, cambios esperados, criterios y evidencia de validación contra los que revisa;
- `integration-checker`: contrato completo relevante para las fronteras, consumidores, artifacts y estado de validación.

## Transferencia al siguiente agente

`openspec-change-context-bootstrap` descubre, resuelve, lee y deriva el snapshot mínimo del contexto OpenSpec. `delegation-context` sigue siendo la skill que transporta y comprime el paquete de entrada; esta skill no la reemplaza, no decide la división, el agente, el paralelismo ni el workflow.

En cada delegación posterior de la misma tarea, el orquestador debe conservar la única línea exacta `OpenSpec change: <change-id>` y transferir el snapshot compacto usando las secciones existentes de `delegation-context`, sin pegar artifacts completos:

- `Objective`: objetivo y declaración del change;
- `Scope`: responsabilidad y subconjunto de trabajo del agente;
- `Out of Scope`: exclusiones explícitas;
- `Repository Context` y `Relevant Files`: schema/root y solo rutas del CLI relevantes;
- `Desired Behavior`, `Constraints` y `Acceptance Criteria`: el subconjunto contractual aplicable;
- `Dependencies`, `Existing Behavior` y `Verification`: tareas, estado, progreso y validaciones conocidas.

La obligación de propagar la línea y el snapshot es contractual en las reglas y prompts. No presupone un hook del runtime que intercepte o promocione delegaciones automáticamente. Si el orquestador no puede preservar el ID, el scope, las exclusiones o el subconjunto contractual, debe bloquear la delegación.

## Autoridad y cambios de artifacts

Las instrucciones y artifacts OpenSpec son el contrato autoritativo sobre el código. Si código, configuración, tests, otro contexto o un artifact contradicen ese contrato, registra el hallazgo y bloquea la decisión o la superficie afectada; no elijas silenciosamente la interpretación más conveniente.

Los artifacts son de solo lectura durante el bootstrap. Solo edítalos cuando exista autorización explícita que identifique el artifact o la ruta emitida por el CLI y la operación permitida. No cambies un artifact para hacer coincidir el código ni inventes una ruta para editarlo.

## Reutilización de validaciones

Registra cada validación conocida junto con su resultado, change-id exacto, contexto/schema/root, superficie aplicable y momento o evidencia de recencia cuando el origen lo proporcione. Solo es reutilizable si:

1. corresponde al mismo `change-id`;
2. conserva el mismo contexto, `schemaName` y root, y el estado OpenSpec es suficientemente reciente para el trabajo actual;
3. cubre la misma superficie y no hay cambios posteriores que la invaliden.

Si no puede demostrarse la identidad, recencia o aplicabilidad, ejecuta una validación focalizada o marca el resultado como no verificado. Nunca reutilices validaciones de otro change ni presentes una ausencia de evidencia como éxito. El agente conserva su contrato de salida propio al informar el snapshot, bloqueos y validaciones.
