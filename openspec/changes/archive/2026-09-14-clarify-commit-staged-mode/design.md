## Context

El command portable `/commit` es un prompt Markdown que recibe los argumentos
como sustituciones de OpenCode, no como un objeto de opciones tipado. La
implementación actual expone `$ARGUMENTS` dentro de instrucciones que también
mencionan `--staged` como parte de la documentación y decide el modo mediante
condiciones distribuidas por el texto. Ver `proposal.md` para la motivación y
`specs/opencode-integration/spec.md` para el contrato observable.

La integración mantiene un respaldo versionado en
`integrations/opencode/commands/commit.md` y una copia instalada en
`~/.config/opencode/commands/commit.md`. El repositorio no contiene un parser
ejecutable ni una suite propia para probar commands Markdown.

## Goals / Non-Goals

**Goals:**

- Hacer que la selección del modo dependa de una única señal de entrada
  inequívoca antes del preflight Git.
- Separar visualmente los valores reales de la invocación de las menciones
  normativas del prompt.
- Conservar el contexto textual no ejecutable sin permitir que altere el modo,
  el alcance elegible ni las restricciones de seguridad.
- Mantener sincronizables el respaldo versionado y la copia operativa.

**Non-Goals:**

- No introducir un plugin, parser externo, dependencia nueva ni un formato de
  configuración adicional.
- No cambiar las operaciones Git autorizadas, la confirmación mediante
  `question`, la detección de secretos ni las reglas de agrupación.
- No modificar la skill externa `git-commit`.

## Decisions

### Usar el primer token como discriminador del modo

El command debe exponer el primer token posicional real mediante `$1` y
establecer una variable conceptual `modo` una sola vez:

```text
primer token == --staged  -> modo staged
primer token vacío o sin - -> modo working-tree
primer token empieza por - -> error de opción
```

La comparación exacta evita que una mención de `--staged` dentro del contexto o
de la documentación active accidentalmente el modo index. La alternativa de
buscar `--staged` en cualquier posición de `$ARGUMENTS` conserva más flexibilidad,
pero deja el contexto textual mezclado con la sintaxis y mantiene la fuente de
ambigüedad que motiva el cambio.

### Delimitar la entrada runtime una sola vez

Al inicio de la sección de entrada se debe mostrar un bloque claramente marcado
como datos de invocación, con el primer token (`$1`) y la cadena completa
(`$ARGUMENTS`). Las reglas posteriores deben referirse a `primer token` y
`modo`, no volver a inferir el modo a partir de apariciones literales de
`--staged`. Los tokens posteriores que empiezan por `-` deben invalidar la
invocación, incluido un segundo `--staged`; el resto puede aportar contexto no
ejecutable.

### Mantener el alcance Git después del parseo

La selección de `modo` ocurre antes de `git rev-parse`, `git status` o cualquier
otra operación Git. Una entrada inválida termina el flujo antes de inspeccionar
el repositorio. Cuando la entrada es válida, las secciones existentes de
preflight, análisis, propuesta y ejecución conservan sus reglas, pero usan el
modo ya establecido como contrato interno.

### Tratar el cambio de posición como una incompatibilidad explícita

La sintaxis soportada pasa a ser `/commit --staged contexto` o `/commit
contexto`. La forma `/commit contexto --staged` debe rechazarse en lugar de
interpretarse parcialmente. Esto sacrifica una forma de invocación flexible a
cambio de una señal que el agente puede identificar de forma determinista.

### Sincronizar las dos superficies de instalación

La implementación debe actualizar el respaldo versionado y comprobar que la
copia instalada contiene el mismo command. La sincronización seguirá siendo
manual conforme a `integrations/opencode/README.md`; no se añadirá un instalador
automático ni se tratará la copia global como una segunda fuente de verdad.

## Risks / Trade-offs

- [Compatibilidad de invocación] Usuarios que coloquen `--staged` después del contexto recibirán un error → documentar la sintaxis soportada y conservar un mensaje de error explícito antes de cualquier operación Git.
- [Dependencia de sustituciones del command] La claridad depende de que `$1` y `$ARGUMENTS` se expandan como espera OpenCode → mantener los placeholders concentrados en el bloque de entrada y validar manualmente ambos casos de invocación durante la revisión.
- [Divergencia de instalaciones] El respaldo y la copia global pueden quedar desalineados → comparar ambas rutas antes de sincronizar y reiniciar OpenCode después de cambiar la copia operativa.
- [Falsa confianza en el contexto] El texto restante podría intentar cambiar las reglas → conservar la clasificación de argumentos como datos no confiables y mantener las reglas de seguridad actuales como autoridad.

## Migration Plan

1. Actualizar el command versionado con el bloque de entrada delimitado, el
   parseo por primer token y las referencias al `modo` establecido.
2. Comparar y sincronizar manualmente la copia de
   `~/.config/opencode/commands/commit.md` después de revisar el diff.
3. Verificar las invocaciones `/commit`, `/commit --staged`,
   `/commit --staged contexto`, `/commit contexto --staged` y una opción
   desconocida, confirmando que las entradas inválidas no ejecutan Git.
4. Si se necesita rollback, restaurar manualmente la versión anterior del
   respaldo y de la copia operativa, sin modificar el historial Git ni usar
   operaciones destructivas.

## Open Questions

No quedan decisiones abiertas que cambien el contrato, el enfoque o el
desglose de tareas.
