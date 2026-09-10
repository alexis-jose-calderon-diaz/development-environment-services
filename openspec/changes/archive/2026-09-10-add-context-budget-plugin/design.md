## Context

El repositorio contiene un respaldo portable en `integrations/opencode/` y un
entorno local `.opencode` con `@opencode-ai/plugin@1.18.30` instalado para
validar tipos. No hay plugins existentes ni un framework de tests TypeScript.
La API clásica instalada expone `Plugin`, el evento general `event`,
`tool.execute.before`, `tool.execute.after`,
`experimental.chat.system.transform`, `dispose` y logging mediante
`client.app.log()`.

Los tipos instalados modelan `AssistantMessage.tokens` con `input`, `output`,
`reasoning`, `cache.read` y `cache.write`. El runtime de OpenCode usa como
fallback de overflow la suma de `input + output + cache.read + cache.write`.
La integración existente configura un modelo con contexto de 400000 tokens,
por lo que los límites propuestos de 330000 y 350000 son coherentes con el
entorno observado.

## Goals / Non-Goals

**Goals:**

- Implementar un único plugin portable en `integrations/opencode/plugins/context-handoff.ts`.
- Mantener estado aislado por `sessionID` y tolerar eventos repetidos.
- Usar el último uso autoritativo del asistente, con crecimiento provisional de resultados de herramientas.
- Añadir señales SOFT/HARD sin reemplazar instrucciones de sistema existentes.
- Bloquear herramientas únicamente para workers hijos monitorizados en HARD.
- Rebasar el estado después de `session.compacted` y liberar sesiones eliminadas.
- Permitir límites pequeños para validación manual y automatizada.

**Non-Goals:**

- Crear o continuar subagentes.
- Implementar el receptor del HANDOFF o cambiar el orquestador.
- Modificar agentes, prompts, comandos, skills, `AGENTS.md` u OpenCode.
- Desactivar, controlar o implementar compactación.
- Añadir una dependencia de testing pesada o una segunda instancia de OpenCode.

## Decisions

### Usar el API clásico instalado

El plugin usará los hooks de `@opencode-ai/plugin@1.18.30`, no la API v2
experimental del mismo paquete. El archivo versionado vivirá bajo
`integrations/opencode/plugins/` y se instalará posteriormente bajo el
directorio global de plugins de OpenCode. La validación de tipos usará la copia
del paquete disponible en el entorno local.
La alternativa de usar la API v2 se descarta porque no expone estos hooks de
sesión y herramientas en sus tipos de promesa instalados.

### Usar `event` para métricas y ciclo de vida

No existe un hook separado `message.updated`; se inspeccionará `event.event`
para procesar `message.updated`, `session.compacted` y `session.deleted`.
Cada estado se indexará por `sessionID`.

El uso autoritativo será reemplazado, no acumulado. La estimación seguirá la
contabilidad de overflow observada en OpenCode:

```text
input + output + cache.read + cache.write
```

`reasoning` no se sumará de nuevo porque el runtime lo trata como parte ya
representada del output. Los resultados de herramientas se conservarán como
estimación provisional hasta el siguiente uso autoritativo.

### Deducción de workers hijos

La protección activa requerirá `Session.parentID` confirmado. El nombre del
agente se capturará desde `chat.message`, porque el mensaje assistant no lo
expone directamente. Una lista configurable de agentes podrá restringir aún
más el conjunto, pero el valor vacío significará todos los workers hijos
identificables.

Si no se puede obtener `parentID`, el plugin podrá registrar métricas internas
pero no inyectará SOFT/HARD ni bloqueará herramientas. Esta opción prioriza no
bloquear accidentalmente al orquestador primario.

### Transformar el sistema y bloquear herramientas por separado

`experimental.chat.system.transform` añadirá una sola instrucción de
presupuesto a `output.system` y comprobará el marcador antes de insertar para
ser idempotente dentro de una solicitud. `tool.execute.before` lanzará un
error `CONTEXT_BUDGET_HARD_STOP` en HARD. No se interceptará la generación de
texto, de modo que el worker pueda devolver el HANDOFF.

La transformación de sistema es experimental porque es el hook público
disponible en la versión instalada; no se inventará un hook alternativo.

### Configuración por entorno y fallo explícito

Los límites se centralizarán en una función de configuración que leerá:

- `OPENCODE_CONTEXT_SOFT_LIMIT`
- `OPENCODE_CONTEXT_HARD_LIMIT`
- una variable opcional para agentes monitorizados

La configuración inválida hará fallar la carga del plugin y emitirá un mensaje
claro. Se prefiere este comportamiento a iniciar con límites inesperados.

### Rebase después de compactación

`session.compacted` iniciará un nuevo periodo de medición en `NORMAL`, limpiará
estimaciones provisionales y permitirá que el siguiente mensaje assistant
establezca el nuevo uso autoritativo. Esto evita conservar un HARD obsoleto
después de que OpenCode haya reducido el contexto activo.

## Risks / Trade-offs

- [La métrica del proveedor puede representar la solicitud actual y no exactamente el próximo contexto] -> Usar la contabilidad de overflow de OpenCode y reemplazar estimaciones con cada uso autoritativo, en lugar de sumar historiales.
- [Un resultado de herramienta puede contener attachments o metadatos no representados en `output`] -> Documentar que la heurística cubre texto nuevo no reportado y mantenerla conservadora sin fingir exactitud.
- [El hook `experimental.chat.system.transform` puede cambiar en futuras versiones] -> Validar la versión instalada y ejecutar una comprobación de carga de OpenCode antes de integrar el plugin.
- [Un evento duplicado o fuera de orden puede degradar la estimación] -> Deduplicar por `messageID` y `callID`, y aceptar actualizaciones del mismo mensaje solo como reemplazos.
- [Una sesión primaria puede no exponer temporalmente su relación parental] -> No aplicar acciones de protección hasta confirmar `parentID`.
- [No hay TypeScript compiler ni framework de tests configurado] -> Mantener funciones de cálculo pequeñas y exportables, validar carga con OpenCode y usar únicamente pruebas ligeras si el entorno disponible lo permite.

## Migration Plan

1. Añadir el plugin al respaldo portable y al inventario de recursos instalables.
2. Validar tipos contra `@opencode-ai/plugin@1.18.30` y comprobar la carga después de instalarlo bajo el directorio global de plugins.
3. Ejecutar una verificación manual con límites bajos en una sesión hija.
4. Retirar el archivo portable y su entrada de instalación para rollback; no hay migración de datos persistentes porque el estado vive en memoria.
