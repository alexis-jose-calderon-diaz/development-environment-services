## Context

Consulta `proposal.md` para la motivación y `specs/opencode-integration/spec.md` para el contrato observable. El workflow OpenSpec local ya resuelve el cambio y obtiene su contexto mediante el CLI, pero una sesión creada por `Task` recibe un prompt nuevo y no hereda automáticamente los argumentos del comando.

La integración global usa actualmente una línea textual como señal de activación y `delegation-context` la conserva solo cuando ya existe en el contexto de origen. Ese modelo es adecuado para una solicitud directa, pero no representa un workflow que ya resolvió el cambio y transporta un snapshot contractual.

Las superficies tienen propietarios diferentes:

- `AGENTS.md` es política local de `development-environment-services`.
- `.opencode/` contiene los workflows locales de OpenSpec y no se modifica en este cambio.
- `integrations/opencode/` es el respaldo versionado de la configuración global reutilizable.
- `integrations/opencode/AGENTS.md` contiene únicamente reglas aplicables a los recursos dentro de su propio scope; debe ser agnóstico de ubicación y no asumir una instalación, un repositorio consumidor ni un carácter global.
- `integrations/opencode/README.md` documenta, fuera del contrato de reglas del toolkit, la relación con el proyecto anfitrión y el procedimiento de instalación manual.

## Goals / Non-Goals

**Goals:**

- Distinguir una activación directa de un contexto OpenSpec heredado desde un workflow.
- Permitir que el contexto heredado use el `change-id` ya validado por el CLI sin pedir una declaración redundante al usuario.
- Mantener el comportamiento fail-closed ante IDs ausentes, ambiguos, placeholder, obsoletos o contradictorios.
- Transportar el snapshot mínimo mediante las secciones existentes de `delegation-context`.
- Aclarar en las reglas y documentación la convivencia entre la política local y la integración global.

**Non-Goals:**

- Modificar comandos, skills o workflows de `.opencode/`.
- Modificar `integrations/opencode/commands/`, `opencode.jsonc` o servicios del repositorio.
- Crear hooks, plugins o mecanismos de propagación en el runtime de OpenCode.
- Inferir un cambio desde la branch, la ruta, el nombre de un artifact o la existencia de un único cambio activo.
- Sincronizar automáticamente los archivos hacia `~/.config/opencode/`.
- Convertir `reviewer` en un agente de revisión genérica.

## Decisions

### 1. Dos fuentes explícitas de activación

Se admitirán dos formas de iniciar el bootstrap:

1. Una solicitud directa contiene una única declaración textual con el ID real.
2. Una delegación contiene un snapshot de workflow con el `change-id` real y los datos de resolución emitidos por el CLI.

El segundo caso será una señal de contexto heredado, no una inferencia. El orquestador será responsable de construirla después de resolver el cambio; el usuario no tendrá que copiar una plantilla. Si ambos canales aparecen, sus IDs deben coincidir exactamente.

### 2. Snapshot mínimo verificable

El paquete heredado conservará, cuando estén disponibles, `change-id`, `schemaName`, `changeRoot`, `planningHome`, `actionContext` y el estado o las rutas contextuales emitidas por `status` e `instructions`. Se usará el `change-id` sin normalizar y el agente volverá a ejecutar el bootstrap del CLI antes de inspeccionar la superficie de trabajo.

La ausencia de cualquiera de los datos que el bootstrap necesite, una respuesta inválida del CLI o una discrepancia entre el snapshot y la resolución propia producirá `BLOCKED`. No se aceptará un nombre aislado como sustituto del snapshot ni se continuará como tarea genérica cuando el contexto recibido declara explícitamente OpenSpec.

### 3. Transporte en el contrato existente

`delegation-context` seguirá usando sus secciones actuales. El contexto heredado se expresará en `Repository Context` y `Dependencies` con referencias estructuradas al `change-id` y al snapshot, mientras `Scope`, `Out of Scope`, requisitos y criterios permanecerán en sus secciones correspondientes.

La plantilla textual de la declaración se tratará como metasyntax de documentación. Los agentes no la emitirán como valor literal: los informes usarán el ID confirmado o `No aplica` cuando corresponda. Un placeholder en un paquete será un error de transporte, no una solicitud al usuario.

### 4. Responsabilidad por rol

Las reglas comunes definirán la distinción entre contexto directo y heredado. `analyzer`, `planner`, `implementer` e `integration-checker` activarán el bootstrap con cualquiera de las dos fuentes válidas y conservarán la ruta genérica cuando no exista contexto OpenSpec. `reviewer` seguirá requiriendo un contexto OpenSpec válido porque su responsabilidad es revisar contra ese contrato, pero aceptará el snapshot heredado de un workflow.

La verificación propia del agente seguirá siendo obligatoria; el snapshot recibido limita y acelera la investigación, pero no reemplaza `status`, `instructions` ni la comprobación de coherencia del root y schema.

### 5. Separación documental y de políticas

`AGENTS.md` explicará que sus reglas son locales al proyecto y que `.opencode/` es su superficie de workflows OpenSpec. `integrations/opencode/README.md` explicará que la integración es global, reutilizable y operativa solo después de copiarla a `~/.config/opencode/`, y que debe coexistir con el `AGENTS.md` raíz del proyecto consumidor. `integrations/opencode/AGENTS.md` no describirá esa instalación ni la relación con el consumidor: se limitará a las reglas portables de los recursos bajo su propio scope.

La documentación distinguirá `integrations/opencode/commands/` como comandos globales de OpenCode de `.opencode/commands/` como comandos locales de OpenSpec. Ninguna de las dos superficies se usará como ruta implícita para modificar la otra.

## Risks / Trade-offs

- **[El orquestador omite el snapshot]** El subagente no tiene metadatos automáticos de la sesión padre. -> Bloquear la delegación y reportar falta de propagación; no pedir al usuario una plantilla ni inferir el cambio.
- **[Snapshot obsoleto]** El estado puede cambiar entre etapas. -> Reejecutar `status` e `instructions` con el ID exacto antes de leer código o declarar éxito.
- **[Confusión entre políticas]** Un proyecto puede tener reglas raíz diferentes de las globales. -> Documentar propietarios, límites y convivencia; no copiar `AGENTS.md` raíz a la integración.
- **[Desfase de instalación]** `~/.config/opencode/` puede conservar una versión anterior. -> Mantener sincronización manual, comparar ambas ubicaciones y no afirmar que la configuración operativa cambió automáticamente.
- **[Falsa activación]** Una mención incidental o un nombre aislado podría activar OpenSpec. -> Aceptar solo la declaración directa válida o el snapshot estructurado con evidencia de resolución; rechazar placeholders y ambigüedades.

## Migration Plan

1. Ajustar `AGENTS.md`, `integrations/opencode/AGENTS.md`, `integrations/opencode/README.md`, los agentes especializados y las dos skills de contexto según este diseño.
2. Dejar intactos `.opencode/`, sus comandos y skills, `integrations/opencode/commands/` y `opencode.jsonc`.
3. Validar la delta de capability y revisar que cada agente distinga activación directa, contexto heredado y tarea genérica sin copiar el placeholder.
4. Comparar el respaldo versionado con `~/.config/opencode/` y sincronizar manualmente solo después de revisar las diferencias.

El rollback consiste en restaurar los archivos de reglas, agentes, skills y documentación modificados por este cambio. No requiere mover artifacts OpenSpec ni alterar los workflows locales; cualquier rollback de `~/.config/opencode/` debe seguir el procedimiento manual de comparación.

## Open Questions

Ninguna. El origen del contexto, el alcance de archivos y la separación entre políticas locales y globales quedaron definidos durante la exploración.
