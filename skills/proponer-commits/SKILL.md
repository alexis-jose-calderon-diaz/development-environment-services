---
name: proponer-commits
description: Propone una secuencia de commits atómicos con mensajes Conventional Commits 1.0.0 a partir de cambios de un repositorio, un diff o una descripción de cambios. Úsala cuando se solicite planificar, agrupar o redactar commits, sin crearlos.
---

# Proponer commits

## Alcance

Elabora una propuesta revisable; no modifiques archivos, el índice ni el historial, y no ejecutes commits. Usa las convenciones específicas del proyecto si existen; en ausencia de ellas, aplica [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). No supongas acceso a Git, al sistema de archivos ni a otras capacidades: trabaja con el diff o la descripción proporcionados cuando no estén disponibles.

## Procedimiento

1. Identifica qué cambios entran en la propuesta. Si hay acceso autorizado al repositorio, inspecciona el estado y las diferencias relevantes, distinguiendo cambios preparados, no preparados y archivos nuevos; para estos últimos, consulta su contenido solo si es accesible. Si no hay repositorio o no se pueden leer los cambios, solicita un diff o una descripción. No atribuyas contenido no observado a archivos nuevos ni incluyas cambios ajenos al alcance solicitado.
2. Identifica instrucciones locales sobre commits y, si resultan accesibles y pertinentes, ejemplos recientes del historial. Distingue las reglas del proyecto de las recomendaciones de Conventional Commits; nunca afirmes que un tipo opcional es obligatorio por el estándar.
3. Agrupa cambios por intención y dependencia para que cada commit represente una unidad coherente. Cuando una misma zona mezcle cambios independientes, indica qué fragmentos separar; no asumas que basta con separar archivos completos. Mantén juntos los cambios que deban aplicarse juntos. Propón un orden que permita entender las dependencias.
4. Redacta cada mensaje con la forma `<tipo>[ámbito opcional][!]: <descripción>`, seguida opcionalmente de cuerpo y notas al pie separados por líneas en blanco. Usa `feat` para funcionalidad nueva y `fix` para corrección de errores. Emplea otros tipos, como `docs`, `test`, `refactor` o `chore`, solo cuando describan fielmente el cambio y sean compatibles con las reglas del proyecto. El ámbito, si se usa, es un sustantivo que identifica la parte afectada.
5. Marca un cambio incompatible con `!` inmediatamente antes de `:` o con `BREAKING CHANGE: <explicación>` en una nota al pie; no lo presupongas sin evidencia. Si hace falta contexto para entender el motivo o la migración, añade cuerpo o nota al pie. No inventes números de incidencia, impactos, pruebas ni comportamiento.
6. Entrega una lista ordenada con el mensaje propuesto y los cambios (archivos o fragmentos identificables) incluidos en cada commit. Explica brevemente divisiones no evidentes y señala lo que no pueda asignarse con certeza. Si faltan datos esenciales, pide solo los necesarios en lugar de fabricar una propuesta precisa.

## Ejemplos

- Cambios: añadir filtro por fecha y pruebas del filtro; corregir un enlace en la guía sin relación con el filtro. Propuesta: `feat(search): add date filter` (filtro y pruebas), seguido de `docs: fix broken guide link` (guía).
- Cambio incompatible comprobado: la API deja de aceptar `legacyMode`. Propuesta: `feat(api)!: remove legacyMode option`, con cuerpo que describa la alternativa de migración si se conoce. También es válido usar una nota `BREAKING CHANGE: ...` en lugar de `!`.

## Casos límite

- Si los cambios ya están preparados, especifica si la propuesta cubre solo esos cambios o también los no preparados; no confundas ambos conjuntos.
- Si hay modificaciones independientes en un mismo archivo, sugiere separar fragmentos y advierte si no es posible inferir límites seguros a partir del material disponible.
- Si no hay cambios observables ni descripción de cambios, no propongas mensajes ficticios.
- Si el contenido disponible puede incluir secretos o datos personales, evita reproducirlos en la propuesta.
