# Proposal

## Why

`ac-grouped-commits` debe producir una propuesta completa como resultado final de su activación, pero su contrato actual la presenta como estrictamente `read-only` y le ordena rechazar cualquier solicitud posterior de crear commits. Esto bloquea la continuación natural del flujo y mezcla el objetivo editorial de la skill con controles de permisos que deben resolverse en el modo y la configuración externa del agente.

## What Changes

- **BREAKING**: redefinir `ac-grouped-commits` por su enfoque y salida: analizar cambios Git y generar una propuesta completa, sin declarar una política global `read-only`.
- Mantener la terminación directa después de la propuesta dentro de la activación que la genera.
- Eliminar la instrucción que obliga a rechazar una solicitud posterior de creación de commits.
- Eliminar referencias a `proposal-only`, a la imposibilidad permanente de crear commits y a la existencia obligatoria de otro flujo ejecutor.
- Mantener las reglas de agrupación, alcance, mensajes, secretos y representación segura necesarias para que la propuesta sea fiable.
- Dejar explícito en el diseño que el aislamiento, la autorización y las confirmaciones de ejecución pertenecen al modo y los permisos externos del agente, no a esta skill.
- Actualizar las evaluaciones, el catálogo público y el contrato OpenSpec para reflejar la nueva frontera de responsabilidad.

## Capabilities

### New Capabilities

### Modified Capabilities

- `opencode-integration`: ajustar el contrato de `ac-grouped-commits` para que defina una salida de propuesta sin imponer una política global de permisos ni bloquear solicitudes posteriores fuera de esa activación.

## Impact

- `skills/ac-grouped-commits/SKILL.md`: descripción, límites de activación, flujo de propuesta y referencias de seguridad.
- `skills/ac-grouped-commits/evals/evals.json`: expectativas sobre la salida final y eliminación del caso que exige rechazar ejecuciones posteriores.
- `skills/README.md`: catálogo y límites públicos de la skill.
- `openspec/specs/opencode-integration/spec.md`: requisitos y escenarios de la skill, manteniendo `read-only` explícito para las demás skills que lo necesiten.
- No se modifican comandos, permisos del runtime, configuración global, servicios Docker ni la implementación Git del agente.
