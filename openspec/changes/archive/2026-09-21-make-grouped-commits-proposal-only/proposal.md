# Proposal

## Why

La skill `ac-grouped-commits` mezcla la generación de la propuesta con una
confirmación interactiva y la ejecución de commits. Ese comportamiento resulta
inconsistente cuando la herramienta `question` aparece o no aparece, y evita
que el usuario revise o ajuste la propuesta con calma antes de solicitar otra
acción.

La skill debe tener un límite claro y predecible: analizar el estado Git,
agrupar los cambios y entregar la propuesta, sin solicitar confirmación ni
modificar el repositorio.

## What Changes

- **BREAKING**: convertir `ac-grouped-commits` en una skill exclusivamente de
  análisis y propuesta.
- Eliminar de la skill pública la invocación de `question`, la solicitud de
  aprobación y toda lógica de staging o creación de commits.
- Eliminar el marcador obligatorio `## Fin de propuesta`; la salida terminará
  directamente después de la propuesta completa.
- Mantener el preflight read-only, la selección segura del alcance, la
  agrupación por intención, la detección de secretos y la representación segura
  de rutas.
- Actualizar las evaluaciones, el catálogo público y la especificación de
  integración para reflejar el nuevo límite de comportamiento.
- Mantener `.agents/` fuera del alcance.

## Capabilities

### New Capabilities

### Modified Capabilities

- `opencode-integration`: cambiar `ac-grouped-commits` de un flujo que propone y
  ejecuta tras aprobación a un flujo read-only que solo entrega la propuesta.

## Impact

- **Skill pública**: `skills/ac-grouped-commits/SKILL.md` dejará de orientar al
  agente a pedir decisiones o crear commits.
- **Evaluaciones**: `skills/ac-grouped-commits/evals/evals.json` deberá validar
  que la ejecución termina tras producir la propuesta y no usa `question`.
- **Documentación**: `skills/README.md` deberá describir el flujo proposal-only.
- **Especificación**: se actualizará el delta de
  `openspec/specs/opencode-integration/spec.md` para eliminar los requisitos de
  aprobación y ejecución de esta skill.
- No se modificará `.agents/`, la configuración Docker ni otras skills públicas.
