## 1. Separación de superficies y políticas

- [x] 1.1 Actualizar `AGENTS.md` para distinguir sus reglas locales de `integrations/opencode/`, reconocer el contexto OpenSpec resuelto por workflows sin exigir una declaración redundante y confirmar que `.opencode/` permanece fuera del cambio mediante `git diff --name-only`.
- [x] 1.2 Actualizar `integrations/opencode/AGENTS.md` para que contenga únicamente reglas coherentes con el scope de la carpeta, sea agnóstico a la ubicación y no asuma carácter global, instalación ni repositorio consumidor; actualizar `integrations/opencode/README.md` para documentar el propósito global, la convivencia con el `AGENTS.md` raíz, la separación respecto de `.opencode/` y la diferencia entre comandos globales y workflows locales; verificar que no se introduzcan rutas operativas hacia `.opencode/`.

## 2. Contrato de contexto OpenSpec

- [x] 2.1 Adaptar `integrations/opencode/skills/openspec-change-context-bootstrap/SKILL.md` para aceptar snapshots heredados de workflows con `change-id` y contexto del CLI, conservar la activación directa explícita y mantener el bloqueo ante IDs ausentes, ambiguos, placeholder, obsoletos o contradictorios; verificar cada caso mediante revisión textual focalizada.
- [x] 2.2 Adaptar `integrations/opencode/skills/delegation-context/SKILL.md` para transportar el snapshot heredado en sus secciones existentes sin exigir que la solicitud original contenga la plantilla, rechazar placeholders y preservar `Scope`, `Out of Scope` y el contrato aplicable; verificar que no queden reglas que obliguen al usuario a completar el marcador.

## 3. Comportamiento de los agentes

- [x] 3.1 Alinear los gates y contratos de salida de `integrations/opencode/agents/analyzer.md`, `integrations/opencode/agents/planner.md` e `integrations/opencode/agents/implementer.md` para distinguir activación directa, contexto heredado y tarea genérica, y verificar que cada agente conserve el `change-id` real o `No aplica` sin emitir placeholders.
- [x] 3.2 Alinear `integrations/opencode/agents/reviewer.md` e `integrations/opencode/agents/integration-checker.md` con el mismo contrato heredado, manteniendo `reviewer` como agente OpenSpec-only y conservando el bloqueo fail-closed cuando falte evidencia; verificar coherencia entre gates, snapshot, validaciones y formatos de salida.

## 4. Validación transversal

- [x] 4.1 Auditar todas las referencias a `OpenSpec change: <change-id>` dentro de `AGENTS.md` e `integrations/opencode/` para distinguir metasyntax de valores reales, eliminar solicitudes dirigidas al usuario y confirmar con búsquedas que `.opencode/` y sus comandos no fueron modificados.
- [x] 4.2 Ejecutar `openspec validate --specs`, revisar `git diff --name-only` y comparar los archivos versionados con `~/.config/opencode/` sin sobrescribirlos; confirmar que los artifacts OpenSpec son coherentes y que cualquier sincronización operativa queda como paso manual.
