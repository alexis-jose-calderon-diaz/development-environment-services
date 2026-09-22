# Design

## Context

La skill pública `skills/ac-grouped-commits/SKILL.md` contiene actualmente en
un mismo flujo el preflight read-only, la presentación de una propuesta, la
llamada a `question` y la ejecución secuencial de staging y commits. La
superficie pública debe quedar separada de `.agents/`, que está explícitamente
fuera de este cambio.

## Goals / Non-Goals

**Goals:**

- Hacer que la skill produzca una propuesta determinista y termine ahí.
- Eliminar toda dependencia de la herramienta `question`.
- Conservar el análisis Git, la agrupación, los mensajes, las exclusiones, las
  advertencias y las reglas de seguridad relevantes para una propuesta.
- Alinear la skill pública, sus evaluaciones, el catálogo y la especificación.

**Non-Goals:**

- Crear una skill alternativa para ejecutar commits.
- Cambiar `.agents/` o modificar la configuración portable de OpenCode.
- Cambiar las demás skills públicas.
- Cambiar la política de agrupación, selección de alcance o detección de
  secretos salvo donde sea necesario para eliminar la ejecución.

## Decisions

### La skill será proposal-only

Se eliminarán las instrucciones que piden aprobación, llaman a `question`,
realizan staging o crean commits. Esto evita que el comportamiento dependa de
si la herramienta de interacción está disponible y hace explícito que la skill
solo produce información para revisión.

La alternativa de conservar un modo de ejecución activado por una petición
posterior se descarta porque mantendría dos responsabilidades y podría volver a
activar la inconsistencia que motiva el cambio.

### La propuesta no tendrá marcador artificial

Se conservarán las secciones sustantivas de la propuesta, pero se eliminará
`## Fin de propuesta` y cualquier texto posterior. Así la salida termina de
forma natural sin sugerir una acción ni necesitar que otro componente interprete
un marcador.

### La ejecución queda fuera del alcance de esta skill

Una petición posterior para crear commits no será ejecutada por
`ac-grouped-commits`. Si el usuario necesita esa operación, deberá usar otro
flujo explícito. Esta separación evita que la descripción de la skill parezca
read-only mientras sus instrucciones internas conservan operaciones de escritura.

### La especificación se actualiza como delta

El delta modificará el contrato de activación y seguridad, añadirá el requisito
de terminación directa y retirará los requisitos específicos de aprobación y
verificación de commits. Las reglas de selección segura del alcance se
conservarán porque siguen siendo necesarias para producir una propuesta fiable.

## Risks / Trade-offs

- [Usuarios que esperaban que la skill creara commits] → La salida y el README
  indicarán el nuevo límite proposal-only; la creación deberá solicitarse a un
  flujo separado.
- [Evaluaciones antiguas que esperan `question` o `## Fin de propuesta`] → Se
  actualizarán para comprobar ausencia de interacción, ausencia de escrituras y
  terminación directa.
- [Divergencia accidental con `.agents/`] → `.agents/` permanecerá fuera del
  cambio y se verificará explícitamente que ningún diff lo incluya.

## Migration Plan

1. Actualizar la skill pública y sus evaluaciones.
2. Actualizar el catálogo público y el delta de especificación.
3. Ejecutar validaciones de formato, referencias obsoletas y OpenSpec.
4. Comunicar que la skill solo prepara propuestas; no requiere migración de
   datos ni rollback porque no modifica el repositorio durante su ejecución.
