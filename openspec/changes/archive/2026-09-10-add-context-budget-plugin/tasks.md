## 1. Estructura y configuración

- [x] 1.1 Crear `integrations/opencode/plugins/context-handoff.ts` como plugin TypeScript portable usando `Plugin` de `@opencode-ai/plugin@1.18.30`, y verificar que la forma de exportación y los imports coinciden con los tipos instalados.
- [x] 1.2 Implementar la configuración centralizada de límites, agentes monitorizados y protección de workers hijos; verificar defaults `330000/350000`, overrides de entorno y fallo explícito para valores inválidos.

## 2. Contabilidad aislada por sesión

- [x] 2.1 Implementar el estado en memoria indexado por `sessionID`, con clasificación `NORMAL`/`SOFT`/`HARD`, y verificar que dos sesiones concurrentes no comparten estimaciones ni transiciones.
- [x] 2.2 Procesar `message.updated` para usar el último `AssistantMessage.tokens` con la fórmula compatible con OpenCode y deduplicar actualizaciones por identificadores; verificar que eventos repetidos no suman tokens dos veces.
- [x] 2.3 Procesar `tool.execute.after` con estimación provisional de texto y reemplazarla al recibir el siguiente uso autoritativo; verificar que un resultado de herramienta grande puede provocar una transición sin duplicarse.

## 3. Señales y protección runtime

- [x] 3.1 Implementar `experimental.chat.system.transform` para añadir instrucciones SOFT y HARD, preservar instrucciones existentes y evitar duplicados dentro de una solicitud; verificar los contenidos de ambas señales.
- [x] 3.2 Implementar `tool.execute.before` para rechazar herramientas de workers hijos en HARD con `CONTEXT_BUDGET_HARD_STOP`, manteniendo permitidas las respuestas textuales; verificar que NORMAL y SOFT no bloquean herramientas.
- [x] 3.3 Implementar captura de agente y filtro por `parentID`, con fallback seguro que no aplica protección cuando la relación parental no puede confirmarse; verificar que la sesión primaria no recibe hard-stop por defecto.

## 4. Ciclo de vida, diagnóstico y validación

- [x] 4.1 Implementar limpieza en `session.deleted` y `dispose`, y reinicio a `NORMAL` en `session.compacted`; verificar que una compactación descarta el presupuesto anterior y que las sesiones eliminadas no retienen estado.
- [x] 4.2 Añadir logging estructurado únicamente para transiciones, configuración inválida y fallos significativos; verificar que actualizaciones repetidas dentro del mismo estado no inundan el log.
- [x] 4.3 Ejecutar type-check contra los tipos instalados, comprobar que OpenCode carga el plugin sin errores de startup y ejecutar una validación manual con límites bajos como `10000/15000`, sin realizar una prueba de 350000 tokens.
