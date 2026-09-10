## Why

El plugin de presupuesto ya inyecta señales runtime y bloquea nuevas herramientas
cuando un worker hijo alcanza HARD. El contrato actual de `implementer` no define
como reaccionar a esas señales, por lo que puede continuar el ciclo normal o
devolver un informe incompatible en lugar de transferir el estado pendiente.

## What Changes

- Añadir al contrato de `implementer` un protocolo de presupuesto de contexto.
- Mantener el comportamiento y la salida actuales cuando no hay señal.
- Definir SOFT como modo de conservacion, sin forzar un HANDOFF prematuro.
- Definir HARD como limite inmediato: detener trabajo y herramientas, y devolver
  un HANDOFF conciso con estado durable.
- Prohibir que el agente estime o infiera su propio uso de tokens.
- Mantener fuera de alcance el plugin, el orquestador, los demas agentes y la
  continuacion automatica.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `opencode-integration`: ampliar el contrato de `implementer` para reaccionar
  de forma determinista a las señales de presupuesto del plugin y producir el
  HANDOFF estructurado en HARD.

## Impact

- Unico archivo de implementacion previsto: `integrations/opencode/agents/implementer.md`.
- Señales consumidas: `[context-handoff:budget]:SOFT` y
  `[context-handoff:budget]:HARD`.
- No se agregan dependencias, APIs ni cambios de runtime.
