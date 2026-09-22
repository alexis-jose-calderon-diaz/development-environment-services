# Design

## Context

La integración conserva únicamente dos recursos versionados directamente en
`integrations/`: una guía con nombre descubrible automáticamente y un
archivo de configuración con el nombre operativo de OpenCode. El README de esa
carpeta duplica la documentación de instalación que también aparece en el
README raíz. La propuesta y el delta de especificación definen el resultado
esperado; este documento fija cómo conservar la separación entre respaldo y
destino operativo.

## Goals / Non-Goals

**Goals:**

- Mantener los respaldos versionados fuera del descubrimiento automático.
- Conservar los nombres operativos únicamente al copiar a `~/.config/opencode/`.
- Tener una sola fuente documental en `README.md` raíz.
- Aplicar reglas comunes de idioma, preguntas, ciclo de trabajo,
  atomización y delegación sin mezclar reglas específicas del repositorio con
  la guía portable.
- Mantener las definiciones públicas fuera de las reglas transversales y de este
  cambio.

**Non-Goals:**

- No cambiar el contenido, permisos, proveedores, MCP ni formato lógico de la
  configuración JSONC.
- No cambiar Docker Compose, servicios, datos, credenciales ni validaciones
  operativas del ambiente.
- No modificar `prospectos/`.
- No convertir la documentación portable en una guía del proyecto consumidor.
- No modificar las definiciones públicas ni imponerles reglas propias sobre
  idioma o delegación.

## Decisions

### 1. Usar nombres neutrales, no sufijos reconocibles

Los archivos se moverán desde `integrations/opencode/` y se renombrarán a
`integrations/agents-global.md` y `integrations/opencode-config.jsonc`. Se
descarta conservar `AGENTS.md` u `opencode.jsonc`
con sufijos como `.example`, porque patrones de descubrimiento amplios podrían
seguir tratándolos como recursos operativos. Las instrucciones documentarán el
mapeo explícito:

```text
integrations/agents-global.md
    --> ~/.config/opencode/AGENTS.md

integrations/opencode-config.jsonc
    --> ~/.config/opencode/opencode.jsonc
```

No se mantendrán duplicados con los nombres antiguos ni la carpeta
`integrations/opencode/` en el repositorio.

### 2. Consolidar la documentación en el README raíz

Se eliminará la carpeta `integrations/opencode/`. La sección de integración de
`README.md` será ampliada con propósito, inventario, comandos de copia,
comparación individual entre nombres distintos, sincronización bidireccional,
migración y reinicio posterior. El inventario de componentes enlazará a esa
sección en lugar de enlazar a un archivo eliminado.

El enlace equivalente de `skills/README.md` apuntará al README raíz. Los
artifacts históricos bajo `openspec/changes/archive/` no se modificarán.

### 3. Separar reglas portables de reglas del repositorio

`integrations/agents-global.md` contendrá solo reglas generales reutilizables:
idioma,
interacción mediante la herramienta especializada, ciclo repetible,
prioridad del directorio de trabajo, seguridad, cambios mínimos, acceso
externo justificado, atomización, delegación y reporte. No contendrá la
estructura Docker, las políticas OpenSpec ni otras reglas propias de este
repositorio.

`AGENTS.md` raíz se tocará únicamente para conservar las reglas propias del
repositorio y retirar cualquier referencia normativa a la guía transversal. No
repetirá idioma, preguntas, ciclo, atomización ni delegación: esas reglas
pertenecen a `integrations/agents-global.md`. Sus secciones de servicios,
OpenSpec, integración y validación permanecerán bajo la propiedad de este
repositorio.

## Risks / Trade-offs

- **[Rutas antiguas en consumidores]** Las copias manuales que usen las rutas
  antiguas dejarán de funcionar. -> Documentar el mapeo nuevo y una migración
  explícita sin conservar duplicados.
- **[README eliminado]** Enlaces externos al README de la integración quedarán
  obsoletos. -> Actualizar las referencias rastreables y hacer que el README
  raíz sea la fuente única.
- **[Descubrimiento intencionalmente desactivado]** Las reglas y la
  configuración no se aplicarán desde el checkout. -> Documentar que la copia
  al destino operativo es necesaria y que los nombres operativos se conservan
  solo allí.
- **[Configuración no parseable]** Un renombrado podría alterar accidentalmente
  el contenido. -> Comparar el diff del archivo y validar su sintaxis sin
  modificar el destino operativo.

## Migration Plan

1. Renombrar los dos archivos versionados sin cambiar su contenido lógico.
2. Reescribir la guía portable y alinear el README raíz y el `AGENTS.md` raíz.
3. Retirar el README de la integración y comprobar que no queden enlaces
   operativos hacia él.
4. Para una instalación existente, comparar primero los archivos operativos y
   copiar manualmente cada respaldo neutral desde `integrations/` al destino convencional
   correspondiente.
5. Reiniciar OpenCode después de actualizar el destino operativo.

La reversión se realizará restaurando los nombres y documentos desde el diff
del cambio si se decide no adoptar la migración. No se modificarán archivos de
`~/.config/opencode/` automáticamente.

## Open Questions

None.
