## Context

El contrato actual de `implementer` define un ciclo normal de implementación,
validación y salida `# Implementation Result`. El plugin existente añade al
contexto del worker hijo las señales `[context-handoff:budget]:SOFT` o
`[context-handoff:budget]:HARD` y bloquea herramientas después de HARD, pero deja
pasar la respuesta textual final.

## Goals / Non-Goals

**Goals:**

- Integrar el protocolo mediante una sección cohesionada del contrato existente.
- Hacer explícita la precedencia de HARD sobre el ciclo y la salida normales.
- Hacer que el HANDOFF transfiera solo estado durable y accionable.
- Mantener el comportamiento normal y permitir que SOFT termine sin HANDOFF.

**Non-Goals:**

- Cambiar la detección, contabilidad o señalización del plugin.
- Añadir lógica de continuación, delegación o coordinación entre workers.
- Alterar el formato normal, responsabilidades o permisos del agente.

## Decisions

### Sección única de protocolo

El protocolo se añadirá como una sección cercana al ciclo de trabajo, en vez de
repetir reglas junto a cada paso. Esto reduce contradicciones y conserva el
contrato actual como referencia para NORMAL.

Alternativa descartada: reescribir el ciclo completo, porque ampliaría el
diff y podría debilitar responsabilidades existentes.

### Precedencia explícita para HARD

HARD será una frontera runtime que prevalece sobre las instrucciones de
implementar, explorar, validar y devolver `# Implementation Result`. El agente
debe dejar de usar herramientas incluso si cree que queda poco trabajo; si el
plugin rechaza una herramienta con `CONTEXT_BUDGET_HARD_STOP`, no debe
reintentarlo.

Alternativa descartada: confiar solo en el bloqueo del plugin, porque el
contrato debe definir también la respuesta textual correcta.

### HANDOFF mínimo y estable

La salida HARD usará únicamente `## HANDOFF` como encabezado superior y las
secciones requeridas. Enumerará cambios persistidos, pendientes accionables,
decisiones no obvias, rutas relevantes, estado de verificación y una sola
primera acción. No incluirá dumps, historial ni comandos irrelevantes.

Alternativa descartada: reutilizar `# Implementation Result`, porque esa salida
representa finalización normal y no distingue una transferencia incompleta.

### Señales y ownership

El agente reconocerá solo los literales emitidos por el plugin y no realizará
contabilidad propia de tokens. La transición dependerá de la presencia de la
señal runtime, no de una estimación del modelo.

## Risks / Trade-offs

- [Una instrucción HARD puede aparecer mientras queda una validación pendiente]
  -> Detener herramientas y marcar la validación como `NOT RUN` en el HANDOFF.
- [El estado del worker puede contener cambios preexistentes de otro actor]
  -> Describir únicamente cambios realizados por este worker y referenciar el
  estado actual sin revertir, limpiar ni atribuir cambios ajenos.
- [La salida HANDOFF puede crecer innecesariamente]
  -> Exigir contenido conciso, rutas de alto valor y una sola acción inicial.

## Migration Plan

1. Actualizar únicamente `integrations/opencode/agents/implementer.md`.
2. Validar marcadores, precedencia, formato HANDOFF y preservación del formato
   normal mediante inspección dirigida y las validaciones existentes.
3. Sincronizar manualmente el respaldo con la instalación global solo después
   de revisar el diff, siguiendo la documentación de `integrations/opencode`.

No hay migración de datos ni rollback runtime: retirar la sección añadida
restaura el comportamiento documental anterior.
