# Design

## Context

La skill actual es un contrato Markdown de aproximadamente 120 líneas: el host
interpreta sus instrucciones y ejecuta las operaciones Git disponibles. No existe
un parser propio, plugin ni suite de tests de producto para este flujo. La
implementación debe conservar esa portabilidad y limitarse principalmente a
mejorar la secuencia de instrucciones y sus comprobaciones. Véanse
`proposal.md` y la delta spec para la motivación y el comportamiento requerido.

## Goals / Non-Goals

**Goals:**

- Convertir el estado del repositorio en una evidencia explícita y comparable
  antes de cualquier escritura.
- Hacer deterministas la selección del alcance, la presentación de rutas, la
  aprobación y la secuencia de commits.
- Reducir el riesgo de ejecución accidental de contenido del repositorio o de
  inclusión de secretos.
- Proporcionar una matriz pequeña de evaluaciones reproducibles para revisar el
  comportamiento de la skill sin crear infraestructura de producto.

**Non-Goals:**

- No crear un parser Git, plugin, wrapper ejecutable ni dependencia externa.
- No cambiar la semántica de staged como alcance único ni introducir opciones
  formales de invocación.
- No automatizar resolución de conflictos, rollback, amend, push ni validaciones
  del proyecto consumidor.

## Decisions

### Fotografía de evidencia antes de proponer

La skill organizará el análisis como una fase de solo lectura que captura una
fotografía conceptual con `HEAD` SHA, branch, upstream, estado de operaciones,
estado del index, diff del working tree, no trackeados elegibles y asignación de
rutas a grupos. Las salidas de Git con rutas se tratarán en formato delimitado
de forma segura cuando la herramienta lo permita, para no perder nombres con
espacios, saltos de línea o caracteres de opción.

**Alternativa descartada:** comparar únicamente `git status` resumido. No
detectaría de forma suficiente cambios de contenido, avance de `HEAD` o cambios
del index que mantengan las mismas rutas.

### Máquina de alcance explícito

La skill conservará dos estados mutuamente excluyentes:

1. `index`: si existe cualquier contenido staged, se propone exactamente un
   commit y no se modifica staging.
2. `working-tree`: solo si el index está vacío, se agrupan archivos completos
   trackeados o no trackeados no ignorados.

La presencia de conflictos, operaciones Git en curso, `HEAD` ausente o branch
detached bloquea ambos estados antes de cualquier escritura. Los archivos
ignorados se excluyen sin inspeccionar su contenido.

**Alternativa descartada:** permitir que el usuario mezcle staged y working tree
en una misma ejecución. Haría imposible demostrar que el commit coincide con la
selección aprobada.

### Representación segura de rutas y mensajes

La propuesta usará estados Git y rutas escapadas como datos visuales, mantendrá
renombres como una entrada coherente y distinguirá eliminaciones, binarios,
symlinks y submódulos. La ejecución usará rutas explícitas separadas del texto
del comando y nunca interpretará nombres, diffs o mensajes mediante shell,
`eval` o interpolación ejecutable.

**Alternativa descartada:** imprimir directamente las rutas en bloques Markdown
sin escape. Un nombre con backticks, salto de línea o texto parecido a una
opción podría falsificar la propuesta o confundir la ejecución.

### Propuesta como frontera de autorización

La propuesta será el único contrato de escritura: contendrá alcance, estado,
grupos, mensajes, rutas, pendientes, exclusiones y advertencias, y terminará
con `## Fin de propuesta`. La respuesta solo autorizará la ejecución si coincide
exactamente con `Crear commits`. `Ajustar propuesta` reconstruirá todo el plan;
`Cancelar` finalizará sin cambios.

**Alternativa descartada:** aceptar confirmaciones naturales como “sí” o
“adelante”. Son ambiguas cuando la propuesta incluye varios commits o riesgos.

### Revalidación y bucle secuencial

Después de la aprobación, la skill volverá a capturar la evidencia y la
comparará con la fotografía original. Para cada grupo aprobado en working tree
realizará staging solo de sus rutas explícitas y comprobará el index antes del
commit. Tras cada commit comprobará SHA, mensaje, rutas y estado residual; tras
cualquier hook repetirá la comprobación antes de continuar.

Si hay divergencia, fallo de hook o cambio inesperado, la secuencia termina con
el estado real informado. No habrá rollback automático, amend, revert ni intento
de reconciliar cambios concurrentes.

**Alternativa descartada:** continuar con el siguiente grupo después de un hook
que modificó el repositorio. Podría ejecutar mensajes y rutas que ya no
corresponden a la aprobación original.

### Política de secretos en dos niveles

La revisión de seguridad se limitará a rutas elegibles. En working tree, una
ruta con evidencia razonable de secreto se excluye sin mostrar su contenido; en
index, cualquier evidencia detiene el flujo. Los mensajes de propuesta y error
describirán únicamente la categoría del problema, nunca el valor. Si no queda
ningún grupo seguro, la skill termina sin escribir.

**Alternativa descartada:** ofrecer una confirmación para forzar un secreto
staged. La aprobación del usuario no convierte una ruta potencialmente sensible
en una operación segura para esta skill.

### Evaluaciones dirigidas

Las evaluaciones usarán prompts y repositorios temporales mínimos, con resultados
observables: ninguna escritura antes de aprobación, alcance exacto, ausencia de
secretos en salida, detención ante divergencia y verificación secuencial. Se
comparará la versión actual con la endurecida cuando el harness lo permita, pero
las evaluaciones no se convertirán en una dependencia runtime de la skill.

## Risks / Trade-offs

- **[Detenciones adicionales]** La skill puede detenerse ante estados que antes
  intentaba interpretar. → Priorizar la seguridad y explicar el bloqueo para que
  el usuario lo resuelva manualmente.
- **[Heurística de secretos]** No existe un detector universal. → Usar evidencia
  conservadora, limitar la inspección a rutas elegibles y nunca revelar valores.
- **[Limitación de Markdown]** Un host puede no representar exactamente las
  decisiones o no soportar respuestas estructuradas. → Mantener las tres
  decisiones textuales exactas y no inferir aprobación por defecto.
- **[Rutas atípicas]** Algunos nombres o submódulos pueden ser difíciles de
  representar de forma portable. → Conservar el estado real, usar delimitación
  segura y detenerse si no puede demostrarse el alcance.
- **[Coste de revalidación]** Comparar evidencia antes de cada escritura añade
  pasos y tokens. → Aplicarlo solo al alcance aprobado y tratarlo como parte del
  contrato de seguridad, no como una validación del proyecto.

## Migration Plan

1. Actualizar `integrations/opencode/skills/grouped-commits/SKILL.md` con el
   protocolo de fotografía, alcance, seguridad, aprobación y revalidación.
2. Añadir prompts o fixtures de evaluación dentro del alcance acordado, sin
   modificar la instalación global ni crear comandos auxiliares.
3. Revisar el diff de la skill y ejecutar las evaluaciones dirigidas; no crear
   commits ni ejecutar validaciones de proyecto como parte del flujo de la skill.
4. Para rollback, restaurar manualmente la versión anterior de `SKILL.md` desde
   el respaldo revisado; no usar operaciones Git destructivas ni modificar refs.
