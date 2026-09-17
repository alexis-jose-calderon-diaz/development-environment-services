## Context

El command `/commit` ya genera una propuesta textual detallada y usa la
herramienta `question` para confirmar antes de modificar Git. El formato actual
no tiene una señal terminal que permita distinguir de forma inequívoca que todos
los bloques y secciones de la propuesta ya fueron emitidos. La propuesta y la
confirmación deben seguir siendo superficies distintas porque la lista de rutas
puede ser extensa.

## Goals / Non-Goals

**Goals:**

- Añadir una señal textual final y estable: `## Fin de propuesta`.
- Hacer explícito que `question` se invoca después de esa señal.
- Mantener el plan completo, incluyendo archivos, en el mensaje visible de la
  propuesta.
- Mantener breve el contenido de `question`, usando únicamente la confirmación
  y sus opciones existentes.

**Non-Goals:**

- No cambiar la agrupación de commits ni el detalle requerido de las rutas.
- No mover el plan completo dentro de `question`.
- No definir una política adicional para una ejecución en la que el marcador no
  sea visible.
- No cambiar las operaciones Git, los hooks, la seguridad ni la validación del
  repositorio.

## Decisions

### Marcador final dentro del formato visible

Se añadirá `## Fin de propuesta` después de `## Advertencias`. Un encabezado
estable es más fácil de reconocer que una frase variable y no aumenta el tamaño
de forma proporcional al número de archivos.

Alternativas consideradas:

- Repetir la propuesta completa en `question`: se descarta porque duplica
  contenido y puede producir una interfaz difícil de leer con muchos archivos.
- Usar un identificador o hash del plan: se descarta porque identifica una
  propuesta, pero no demuestra por sí mismo que su contenido completo haya sido
  emitido al usuario.

### Confirmación breve después del marcador

La instrucción conservará las opciones exactas `Crear commits`, `Ajustar plan`
y `Cancelar`, pero indicará que la llamada ocurre después del marcador y no
deberá repetir archivos ni el plan. Así la propuesta visible sigue siendo la
fuente de contexto que el usuario confirma.

### Alcance de configuración

La implementación modificará primero el respaldo versionado
`integrations/opencode/commands/commit.md`. La sincronización de la copia en
`~/.config/opencode/commands/commit.md` seguirá el procedimiento manual ya
documentado y no forma parte de este cambio de artifacts.

## Risks / Trade-offs

- [Riesgo] El marcador confirma que el modelo emitió el cierre textual, pero no
  ofrece una garantía independiente sobre cómo renderiza la interfaz.
  Mitigación: mantener la instrucción de orden inmediatamente antes de
  `question` y conservar la propuesta completa fuera de la herramienta.
- [Riesgo] Un cambio posterior al formato podría omitir el marcador en una
  rama del flujo. Mitigación: documentar el marcador en el contrato del
  requisito y cubrir tanto `working-tree` como `staged` y `Ajustar plan`.

## Migration Plan

1. Actualizar el command versionado según el contrato de la especificación.
2. Comparar y sincronizar manualmente la copia operativa si corresponde.
3. Reiniciar OpenCode después de cambiar la configuración global.
4. Verificar mediante una ejecución controlada que el marcador aparece antes de
   la confirmación y que no se repiten las rutas en `question`.
