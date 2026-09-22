# Design

## Context

La skill pública `skills/ac-grouped-commits/SKILL.md` fue convertida en una
skill `proposal-only` y sus evaluaciones y especificación actuales ordenan
rechazar una solicitud posterior de creación de commits. La necesidad actual es
conservar el resultado acotado de la activación —una propuesta completa— sin
presentar esa frontera como una política global de permisos. Véase
`proposal.md` para la motivación y `specs/opencode-integration/spec.md` para el
contrato observable actualizado.

## Goals / Non-Goals

**Goals:**

- Definir `ac-grouped-commits` por el resultado que entrega: una propuesta
  completa y terminada.
- Evitar que una activación de propuesta incluya preguntas, aprobación o texto
  posterior.
- Retirar el lenguaje que transforma la skill en una barrera global frente a
  solicitudes posteriores.
- Mantener la selección segura del alcance, la agrupación lógica, el tratamiento
  de secretos y la representación segura de rutas.
- Mantener separada la política de permisos efectiva, que corresponde al modo y
  la configuración del agente anfitrión.

**Non-Goals:**

- Implementar en este cambio un ejecutor de commits o un nuevo command.
- Diseñar permisos, confirmaciones o aislamiento del runtime de OpenCode.
- Cambiar las políticas `read-only` de `ac-release-tag-proposal`,
  `ac-change-review` o `ac-integration-boundary-audit`.
- Cambiar la lógica de agrupación, la selección staged/working-tree o la
  heurística de detección de secretos salvo para ajustar su redacción al nuevo
  límite de salida.

## Decisions

### La frontera será de salida, no de permisos

La skill indicará que su activación termina después de emitir la propuesta
completa. No declarará que el agente carece de permisos ni que nunca puede
ejecutar operaciones. Esta separación permite que Plan mode o las reglas del
host controlen la ejecución sin que la skill responda negativamente a una
petición posterior por una restricción heredada.

**Alternativa descartada:** conservar `read-only` y delegar obligatoriamente la
creación a otro flujo. El repositorio no contiene actualmente ese flujo
ejecutor y la alternativa reproduce el bloqueo observado.

### La solicitud posterior no será un escenario de rechazo

La especificación describirá únicamente la activación que genera la propuesta.
No añadirá un escenario que ordene rechazar una petición posterior ni afirmará
que la creación debe gestionarse mediante una skill concreta. Una conversación
posterior podrá quedar sujeta a las reglas generales y permisos efectivos del
agente.

**Alternativa descartada:** agregar una nueva skill ejecutora en el mismo cambio.
Eso ampliaría el alcance y mezclaría la corrección del contrato de salida con
un workflow de staging, revalidación y commits que el usuario no ha solicitado
formalizar ahora.

### La terminación directa permanece

La propuesta continuará siendo el output final de la activación: sin marcador
artificial, pregunta, aprobación ni texto posterior. Esta regla evita que la
skill inicie una segunda fase por sí misma, pero no se expresará como una
prohibición global sobre la conversación o el runtime.

### Las restricciones del runtime permanecen externas

La documentación y el contrato OpenSpec no modificarán permisos de OpenCode,
Plan mode ni confirmaciones de comandos. Las skills que sí requieren límites
`read-only` conservarán su documentación específica y la advertencia de que
las instrucciones no sustituyen el aislamiento efectivo del agente.

## Risks / Trade-offs

- **[Ejecución dependiente del host]** La seguridad de una solicitud posterior
  depende del modo y permisos activos. -> Mantener esa responsabilidad fuera de
  esta skill y documentarla en el diseño, sin convertirla en una falsa garantía
  del Markdown.
- **[Activación repetida]** Un host podría volver a cargar la skill para una
  petición posterior relacionada con commits. -> Limitar la descripción de
  activación a revisar, agrupar, separar, organizar o preparar propuestas, y
  comprobar que la evaluación no exige rechazos posteriores.
- **[Pérdida de una barrera textual]** Eliminar `read-only` reduce una defensa
  declarativa. -> Conservar el output acotado de propuesta y dejar la defensa
  efectiva en permisos externos, que es el mecanismo que el usuario controla.
- **[Divergencia documental]** El README, las evaluaciones y la especificación
  podrían conservar lenguaje antiguo. -> Validar referencias globales limitadas
  a `ac-grouped-commits` y revisar que las demás skills mantienen sus límites.

## Migration Plan

1. Actualizar `skills/ac-grouped-commits/SKILL.md` para retirar el lenguaje de
   permiso global y conservar el output de propuesta.
2. Ajustar `skills/ac-grouped-commits/evals/evals.json` para eliminar el caso que
   exige rechazar la creación posterior y comprobar la terminación de la
   propuesta.
3. Actualizar `skills/README.md` y aplicar el delta de
   `openspec/specs/opencode-integration/spec.md`.
4. Ejecutar validaciones de Markdown, JSON, referencias antiguas, OpenSpec y
   whitespace; comprobar que no se modificaron comandos, permisos ni servicios.
5. Para rollback, restaurar los cuatro archivos públicos y la especificación a
   su versión anterior mediante el control de versiones; no se requiere
   migración de datos ni cambios de runtime.
