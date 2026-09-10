## Context

El comando actual vive en un único archivo portable,
`integrations/opencode/commands/commit.md`. Su preflight obtiene el estado de
Git, revisa por separado el index y el working tree, y cuando detecta staged
elige automáticamente el index como fuente del commit. Cuando no hay staged,
agrupa cambios del working tree, solicita confirmación, hace staging por grupo y
crea uno o más commits. El comando no tiene suite propia ni ejecuta validaciones
del proyecto.

La motivación y el comportamiento observable requerido están definidos en
`proposal.md` y en la delta spec de `opencode-integration`.

## Goals / Non-Goals

**Goals:**

- Hacer explícita la selección entre working tree e index antes de analizar el
  alcance del commit.
- Mantener el index como selección exacta del usuario en `--staged`, con un único
  commit y sin operaciones adicionales de staging.
- Mantener la agrupación semántica existente cuando el comando trabaja sobre el
  working tree sin staged.
- Reducir el coste y el volumen del análisis normal mediante una estrategia
  superficial con ampliación dirigida.
- Conservar confirmación, hooks, revisión de rutas sospechosas y restricciones
  contra operaciones destructivas.

**Non-Goals:**

- Cambiar el formato de los mensajes semánticos o la política de agrupación del
  modo working tree.
- Añadir opciones para seleccionar rutas, separar hunks o modificar el index.
- Ejecutar validaciones del proyecto, cambiar la configuración de Git o
  sincronizar automáticamente la instalación global.

## Decisions

### Selección explícita del modo

El comando debe validar los argumentos antes de iniciar cualquier operación de
escritura. Sin `--staged`, la existencia de cualquier entrada staged es una
condición bloqueante; no se debe continuar intentando trabajar solo con las
partes unstaged. Con `--staged`, la existencia de contenido staged habilita el
modo index y la ausencia de staged es bloqueante.

Se elige este contrato sobre el comportamiento actual de selección automática
porque evita que una ejecución destinada al working tree confirme por sorpresa
una selección previa del usuario. Tampoco se permite hacer fallback automático
al otro modo, porque ocultaría un error de alcance.

### Tratamiento del index explícito

`--staged` representa una autorización para confirmar exactamente el index
actual, incluso si contiene intenciones mezcladas. El comando propone un único
commit con ese contenido, no ejecuta `git add`, no separa grupos y no intenta
corregir el staging. Los cambios unstaged y no trackeados se reportan como
pendientes y permanecen intactos.

Esta decisión prioriza la selección explícita del usuario. La alternativa de
detenerse ante un index mixto mantendría una política semántica más estricta,
pero contradice el objetivo de confirmar lo que ya fue staged; quien necesite
varios commits puede preparar el index en ejecuciones separadas.

### Análisis superficial con ampliación dirigida

El análisis inicial debe usar el estado, las rutas, los estados y las
estadísticas del conjunto elegible. No debe leer de forma exhaustiva el
proyecto ni cambios que no pertenezcan al modo seleccionado. Solo se amplía a
un diff detallado cuando la evidencia resumida no basta para agrupar o redactar
el mensaje, o cuando una ruta o su contenido requiere revisión de seguridad.

Se elige esta estrategia sobre un análisis siempre profundo porque reduce ruido
y latencia sin convertir nombres de archivos en evidencia suficiente para casos
ambiguos o sensibles. La alternativa de usar únicamente estadísticas se
descarta porque podría producir mensajes imprecisos y omitir señales de
secretos en rutas elegibles.

### Agrupación diferenciada por modo

El modo working tree conserva la agrupación semántica existente: puede producir
uno o más commits y hace staging únicamente de las rutas aprobadas para cada
grupo. El modo index no reutiliza esa agrupación, porque el index ya es la
selección de alcance y debe llegar al commit sin alteraciones.

### Contrato de argumentos

`--staged` es la única opción formal. El texto restante sin prefijo de opción
puede servir como contexto para entender la intención o redactar el mensaje;
las opciones desconocidas se rechazan sin modificar Git. Esto mantiene la
interfaz pequeña y evita que texto no reconocido cambie el modo por accidente.

## Risks / Trade-offs

- [Cambio de comportamiento por staged] Las invocaciones existentes de `/commit`
  con staged dejarán de crear commits automáticamente -> bloquear con un
  mensaje claro que indique `/commit --staged` y documentar la migración.
- [Mensaje menos preciso con análisis superficial] Las rutas y estadísticas
  pueden no revelar toda la intención -> revisar el diff solo ante ambigüedad y
  mostrar el plan completo antes de confirmar.
- [Index con intenciones mezcladas] Un único commit puede contener cambios que
  normalmente se separarían -> mostrar todas las rutas elegibles y respetar la
  selección exacta; no modificar el index automáticamente.
- [Detección de señales sensibles] Un resumen no siempre permite evaluar el
  contenido de una ruta -> conservar la revisión dirigida de rutas y valores
  sospechosos sin mostrar secretos.
- [Divergencia entre respaldo e instalación] El cambio portable no actualiza
  automáticamente `~/.config/opencode/` -> comparar y sincronizar manualmente
  según el procedimiento documentado.

## Migration Plan

1. Actualizar `integrations/opencode/commands/commit.md` con el contrato de
   argumentos, la máquina de estados y el análisis superficial definidos aquí.
2. Validar escenarios en repositorios Git temporales: staged bloqueante en modo
   normal, commit exacto con `--staged`, cambios residuales, argumentos inválidos,
   agrupación del working tree y ampliación dirigida del diff.
3. Ejecutar `openspec validate --specs` y revisar el diff para confirmar que la
   implementación no modifique otras superficies.
4. Comparar manualmente el respaldo con `~/.config/opencode/` antes de
   sincronizarlo y reiniciar OpenCode después de una actualización intencional.

La reversión consiste en restaurar la versión anterior del comando portable y
volver a sincronizarla manualmente si ya se había instalado.
