# Reglas de extracción y evaluación funcional

## Evidencia y clasificación

- Fuente de verdad: requisito/escenario de spec. La propuesta puede documentar comportamientos aún no desglosados en specs; el diseño solo aporta decisiones funcionales explícitas compatibles con ellas; tareas y detalles técnicos no crean requisitos. En cualquier conflicto citar ambas ubicaciones, sin resolverlo por jerarquía. Rastrear cada criterio hasta una fuente concreta `ruta:línea` (o requisito y escenario de esa ruta); si el requisito está solo en propuesta, indicarlo.
- `DEFINED`: comportamiento y resultado observables, comprobación objetiva, condiciones necesarias expresas o innecesarias para la comprobación, trazabilidad y ausencia de contradicción relevante. La falta de escenario formal se señala aparte; no es por sí sola prueba de ambigüedad si el SHALL deja todo lo necesario inequívoco.
- `AMBIGUOUS`: existe comportamiento documentado, pero falta un dato que altera el resultado o hay interpretaciones, subjetividad o contradicción; citar palabras o fuentes exactas y formular la decisión pendiente. Si el resultado es desconocido, no escribir un `Then` especulativo. Un escenario con `WHEN` sin `THEN` es ambiguo o no verificable, nunca `DEFINED`.
- `UNDEFINED`: únicamente escenario candidato derivado de un requisito existente, relevante por su dominio o estados/entradas explícitos, sin comportamiento decidido. Citar el requisito motivador, explicar por qué importa, escribir `Resultado: por definir` y formular una pregunta. No completar Given/When/Then como si estuviera aprobado. Una exclusión expresa no es una laguna; tampoco lo son todos los errores imaginables.
- `ADDED`/`MODIFIED`: extraer la conducta vigente del delta, no sumar automáticamente la anterior. `REMOVED`: considerar el comportamiento eliminado y sus efectos observables solo si la fuente base y las notas de migración los sustentan; sin base suficiente, informar límite, no inventar resultados. `RENAMED`: vincular la nueva denominación al comportamiento base, sin duplicar criterios ni presuponer una transición. No usar `SHALL` como evidencia de que se implementó o de que existe una prueba.
- Un requisito sin escenarios puede proporcionar un criterio si el texto normativo define una comprobación; si no, contarlo como **sin cobertura verificable**. Un criterio `AMBIGUOUS` solo cuenta como cobertura verificable si su parte observable puede probarse sin resolver la ambigüedad; explicitar el límite. Los `UNDEFINED` nunca cubren un requisito.

## Construcción y calidad por criterio

Dividir solo comportamientos/resultados observables distintos, sin fragmentar una misma comprobación en variaciones irrelevantes. Evitar repetir criterios idénticos; si un comportamiento respalda varios requisitos, vincularlos a un mismo CA en la matriz. Usar Given/When/Then únicamente con precondiciones, acción y resultado expresos: «usuario autorizado» no es una precondición confirmada si la fuente solo dice «usuario». Si no se sabe quién puede actuar, registrar esa ambigüedad sin convertirla en una regla concreta.

Para **cada** CA registrar `Claridad`, `Verificabilidad`, `Completitud`, `Consistencia`, `Trazabilidad` como `Adecuada`, `Pendiente` o `No evaluable`, con una causa breve para toda dimensión no adecuada. En candidatos `UNDEFINED`, usar `No evaluable` para las dimensiones que requieren comportamiento aprobado; la trazabilidad indica el requisito que **motiva** el análisis, no una autorización. Sin cifras ni puntuaciones.

Explorar solo si tienen relación con el requisito: éxito y alternativas, entradas inválidas, estados/transiciones, permisos, entidades inexistentes, repeticiones, límites, errores, integridad y casos límite. Consultar decisiones funcionales, no detalles de arquitectura. Una contradicción entre dos fuentes afecta a la consistencia de los CA relacionados y requiere aclaración aunque cada frase por separado sea clara.

## Comprobaciones de casos representativos

Usar esta tabla como pruebas de mesa del procedimiento; **no** crear cambios de ejemplo ni sustituir una ejecución real por la tabla. Contrastar la salida real con estos resultados cuando el proyecto ofrezca casos equivalentes.

| Caso | Resultado esperado |
| --- | --- |
| Requisito y escenario completos | CA `DEFINED`, Given/When/Then respaldados, `CLEAR` si no hay otros problemas. |
| Rol o condición relevante no especificada | CA `AMBIGUOUS`, condición sin inventar y pregunta concreta, `CLARIFICATION_REQUIRED`. |
| Dos fuentes incompatibles | CA afectados `AMBIGUOUS`, referencias a ambas fuentes, `CLARIFICATION_REQUIRED`. |
| Estado explícito sin transición importante definida | Candidato `UNDEFINED` con relevancia y resultado por definir, pregunta; no declararlo requisito. |
| Requisito sin escenarios | Derivar solo lo objetivamente verificable; indicar ausencia de escenario y, si no permite comprobar nada, contar sin cobertura verificable. |
| Varias capacidades | Inventariar todos los archivos de spec y evitar colisiones de nombres/IDs. |
| Artefactos incompletos | Explicar qué falta según esquema y si es indispensable; `INSUFFICIENT_INFORMATION` solo cuando imposibilita evaluar lo esencial. |
| Reejecución tras modificación | Con informe previo, conservar IDs por identidad, señalar cambio/nuevo/resuelto y no duplicar preguntas. |
| Exclusión expresa | No generar candidato para el escenario excluido; documentar exclusión relevante si aclara el alcance. |
| Specs exhaustivos para el alcance | No generar escenarios hipotéticos; `CLEAR` si todo es evaluable y no hay ambigüedades críticas. |
