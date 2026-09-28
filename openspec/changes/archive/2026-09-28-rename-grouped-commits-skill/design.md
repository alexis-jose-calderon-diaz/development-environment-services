# Design

## Context

Consulta `proposal.md` para la motivación y `specs/opencode-integration/spec.md`
para los contratos actualizados. Actualmente la skill vive en
`skills/ac-grouped-commits/`; su `SKILL.md` pide enumerar rutas ignoradas y
`Exclusions` las muestra, aunque el escenario actual de la spec solo prohíbe
incluirlas e inspeccionar su contenido. La definición describe los campos de la
propuesta, pero no ofrece una salida completa de ejemplo.

La spec de skills públicas enumera ocho nombres, mientras que
`skills/README.md` ya cataloga nueve e incluye `ac-dotnet-testing`. El cambio
aprovechará la actualización de ese requisito para reconciliar la lista sin
alterar el comportamiento de esa skill.

## Goals / Non-Goals

**Goals:**

- Hacer que el nombre público describa el resultado central de la skill y
  conservar una sola identidad pública.
- Hacer el formato de propuesta comprensible mediante un ejemplo completo,
  ficticio y coherente con la estructura normativa.
- Mantener rutas y contenidos de archivos no rastreados ignorados fuera de la
  inspección y de todas las secciones de salida.
- Mantener coherentes la skill, sus evaluaciones, el catálogo y la spec.

**Non-Goals:**

- Mantener `ac-grouped-commits` como alias o duplicar la skill bajo dos nombres.
- Cambiar el alcance staged/working-tree, las reglas de agrupación, Conventional
  Commits o la frontera de salida de la propuesta, salvo lo necesario para
  aclarar los archivos ignorados.
- Reescribir referencias históricas en `openspec/changes/archive/`.
- Modificar otras skills, la configuración global o los servicios del
  repositorio.

## Decisions

### Identidad basada en el resultado

El identificador canónico será `ac-commit-proposal`, con carpeta del mismo
nombre y metadata `name` coincidente. La descripción y el cuerpo mantendrán el
agrupamiento lógico como método para construir una propuesta completa, no como
el resultado final.

Se retirará el identificador anterior sin alias. Dos carpetas instalables para
el mismo flujo crearían identidades duplicadas y prolongarían la ambigüedad que
el cambio busca resolver. La migración será explícita: las instalaciones que
usen el nombre anterior deberán instalar o actualizar la skill con el nuevo
identificador.

### Ejemplo marcado como ilustrativo

El ejemplo se añadirá junto al contrato de salida de `SKILL.md`. Cubrirá todos
los campos en su orden requerido, incluidos bloques de commit, estados Git,
pendientes, exclusiones y advertencias. Sus valores serán ficticios y el rótulo
indicará que una ejecución real debe sustituirlos por valores observados; el
ejemplo no será una plantilla para copiar en una propuesta real. Las
evaluaciones comprobarán la estructura completa.

### Exclusión de ignorados sin enumeración

Se confiará en la exclusión normal de Git para archivos no rastreados ignorados.
El flujo no solicitará un listado de ignorados ni hará consultas para
enumerarlos; tampoco abrirá sus rutas ni las incluirá en `Pending`, `Exclusions`
o `Warnings`. Por ello, cuando no haya otros archivos elegibles excluidos,
`Exclusions` será `None`.

Las reglas de ignore no ocultan archivos ya rastreados. Estos seguirán el
alcance normal de `index` o `working-tree`, para no excluir cambios versionados
por una coincidencia accidental con `.gitignore`.

### Actualización de referencias activas

El renombrado actualizará de forma coordinada la ruta de la skill, `name`,
`skill_name` de sus evaluaciones, catálogo e instrucciones de instalación. Las
referencias activas de OpenSpec se actualizarán junto con la delta. Los artifacts
archivados conservarán los identificadores históricos con los que se ejecutaron
esos cambios.

Al actualizar el inventario en `opencode-integration`, se corregirá también su
conteo para reflejar las nueve skills ya publicadas, incluida
`ac-dotnet-testing`; no se cambiarán los requisitos de comportamiento de esa
skill.

## Risks / Trade-offs

- **[Instalaciones existentes usan `ac-grouped-commits`]** El nuevo nombre no
  será reconocido como actualización de esa identidad. -> Marcar el cambio como
  incompatible y documentar el nuevo identificador de instalación; no mantener
  un alias duplicado.
- **[El ejemplo se confunde con una salida real]** -> Rotularlo como ilustrativo,
  usar valores ficticios y exigir que la ejecución reporte únicamente datos
  observados.
- **[Un comando enumera archivos ignorados accidentalmente]** -> Mantener el
  contrato de no enumeración en spec, skill y evaluaciones; usar la selección
  predeterminada de Git y revisar que `Exclusions` no exponga esos nombres.
- **[La spec diverge del catálogo en otra edición]** -> Verificar que el
  inventario enumere los nueve nombres activos y que el identificador nuevo
  coincida con la carpeta, frontmatter, evaluación y documentación.

## Migration Plan

1. Renombrar la carpeta pública y actualizar su metadata, descripción, ejemplo
   y tratamiento de archivos ignorados.
2. Cambiar `skill_name`, ajustar las evaluaciones para el ejemplo/formato y la
   invisibilidad de ignorados, y sincronizar catálogo e instalación.
3. Actualizar la spec principal usando la delta, incluido el inventario actual
   de nueve skills.
4. Buscar referencias activas al nombre anterior, validar el formato de
   evaluación y OpenSpec, y revisar el diff; conservar sin cambios los artifacts
   archivados.
5. Para rollback, restaurar el directorio y referencias anteriores de forma
   coordinada. No se requiere migración de datos ni de servicios.
