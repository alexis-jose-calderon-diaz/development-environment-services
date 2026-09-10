## Context

La guía portable ya define un prompt autocontenido y un paquete de contexto mínimo para cada delegación. El plugin solo señala el agotamiento y `implementer` solo devuelve el HANDOFF; la decisión de continuar, crear otra `Task` o reanudar una sesión pertenece al orquestador. En la interfaz disponible, pasar `task_id` permite continuar una sesión existente y omitirlo crea una sesión hija nueva.

## Goals / Non-Goals

**Goals:**

- Colocar una única regla cohesionada junto al contrato de delegación portable.
- Hacer inequívoca la precedencia: `HANDOFF => nueva sesión sin task_id`.
- Separar continuación normal, continuación por HANDOFF y bloqueo genuino.
- Mantener pequeño el contexto transferido y hacer que el repositorio sea la fuente de estado durable.

**Non-Goals:**

- Cambiar el plugin, sus límites, el bloqueo de herramientas o la generación del HANDOFF.
- Modificar contratos de agentes, comandos, skills u `opencode.jsonc`.
- Eliminar o terminar sesiones agotadas mediante una API.
- Cambiar la salida normal de los workers o implementar coordinación automática fuera de las reglas del orquestador.

## Decisions

### Sección única en la guía de delegación

La regla se añadirá como una subsección de `## Delegación`, junto al contrato que ya define qué contexto recibe cada worker. Así se evita duplicar reglas en `## Coordinación y salida` y se mantiene cerca del punto donde el orquestador crea o continúa workers.

Alternativa descartada: repartir la regla entre la tabla de agentes, la delegación y la coordinación, porque aumentaría el riesgo de que la excepción de HANDOFF quede contradicha por una regla genérica de continuación.

### Omitir `task_id` para HANDOFF

La continuación posterior a un HANDOFF se expresará como una nueva `Task` con el agente apropiado y un prompt nuevo, omitiendo el `task_id` del worker agotado. No se inventarán parámetros ni APIs de terminación. La misma definición de agente puede reutilizarse, pero la sesión será distinta.

Alternativa descartada: reutilizar el `task_id` y confiar en que el nuevo prompt reinicie el contexto, porque ese mecanismo reanuda precisamente la sesión que alcanzó HARD.

### Paquete mínimo y estado durable

El prompt de continuación conservará el objetivo original, el HANDOFF completo y únicamente las restricciones parentales necesarias. Incluirá una instrucción para inspeccionar el repositorio antes de actuar; si el HANDOFF difiere del estado actual, prevalecerá el repositorio. El worker usará `Completed` para evitar repetir trabajo, salvo evidencia de que el cambio no existe o es incorrecto.

Alternativa descartada: transferir la conversación completa del worker anterior, porque reproduce el presupuesto agotado y contradice el objetivo de mantener el contexto pequeño.

### Máquina de estados explícita

El protocolo documentará estas transiciones:

```text
respuesta normal + seguimiento intencional --> puede reanudar task_id existente
HANDOFF                         --> nueva Task sin task_id
nuevo worker + HANDOFF           --> otra nueva Task sin task_id
respuesta normal final           --> completar y avanzar al siguiente stage
bloqueo genuino                  --> aplicar manejo existente de bloqueos
```

Un HANDOFF será terminal para la sesión hija respecto de ese objetivo, pero no implicará borrarla ni ejecutar una operación de terminación.

## Risks / Trade-offs

- [La documentación no impone por sí sola el comportamiento del runtime] -> Usar lenguaje normativo, distinguir explícitamente `task_id` omitido de `task_id` reutilizado y validar los escenarios del delta spec.
- [El HANDOFF puede describir un estado que cambió después] -> Ordenar al worker nuevo inspeccionar el repositorio y tratarlo como autoridad.
- [Varios HANDOFF pueden alargar la delegación] -> Permitir cadenas sin límite artificial, pero transportar solo el objetivo, el HANDOFF y las restricciones necesarias.
- [La copia instalada puede quedar desactualizada] -> Mantener el cambio únicamente en el respaldo portable y dejar la sincronización manual documentada fuera de este cambio.

## Migration Plan

1. Actualizar únicamente `integrations/opencode/AGENTS.md` con la subsección de protocolo.
2. Revisar que el diff preserve la delegación normal y no modifique agentes ni runtime.
3. Validar el cambio OpenSpec y, cuando corresponda, sincronizar manualmente el respaldo portable con la instalación global siguiendo su documentación.

No hay migración de datos ni rollback runtime. Retirar la subsección restaura el comportamiento documental anterior.
