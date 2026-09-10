## Context

El comando actual de `integrations/opencode/commands/tag.md` tiene 273 lineas,
cuatro opciones y un flujo orientado a inspeccionar el proyecto completo,
interpretar politicas externas y clasificar impacto tecnico y de producto por
separado. La nueva propuesta mantiene el tag numerico y la seguridad de solo
lectura, pero acota la evidencia a la historia Git que se va a versionar.

## Goals / Non-Goals

**Goals:**

- Resolver automaticamente la base en la historia alcanzable de `HEAD`.
- Analizar commits y diffs del rango, sin inspeccionar el proyecto completo.
- Clasificar `PATCH`, `MINOR` y `MAJOR` por adaptacion del usuario.
- Hacer que cualquier codigo de producto elegible produzca como minimo `PATCH`.
- Ofrecer un solo override explicito, `--version`, y una salida corta.

**Non-Goals:**

- Crear, modificar o publicar tags automaticamente.
- Aceptar formatos no numericos o canales preliminares.
- Convertir mensajes de commit en una regla automatica de SemVer.
- Versionar documentacion, tests, configuracion, tooling o infraestructura sin
  codigo de producto en el rango.

## Decisions

### Evidencia limitada al rango

La implementacion debe obtener la base y revisar el historial, rutas,
estadisticas y diffs unicamente entre la base y `HEAD`. Los mensajes de commit
sirven como indice, pero el diff puede revisarse cuando sea necesario confirmar
el efecto visible. Esto evita que el comando dependa de politicas, modulos o
documentacion no relacionada.

Se conserva la seleccion determinista del release mas reciente en la historia
`first-parent`. Cuando no existe ningun tag alcanzable, el rango abarca toda la
historia disponible y `v0.0.0` se usa como base virtual para calcular el primer
tag automatico; no se presenta como un tag existente. Los cambios del working
tree no forman parte de la version, porque el objetivo es etiquetar el estado de
`HEAD`.

### Un unico argumento explicito

Se conserva solo `--version <version>` y se retiran `--base`, `--strict`,
`--prerelease` y `--stable`. La base automatica elimina decisiones repetidas y
la version explicita cubre el caso en que el usuario ya decidio el numero.
Cuando se proporciona `--version`, se valida el formato, la inexistencia del
tag y la evidencia del rango, pero no se vuelve a calcular el incremento.

### Clasificacion por adaptacion del usuario

La escala se aplica de menor a mayor impacto:

- `PATCH`: cualquier codigo de producto, con prioridad para controles,
  posiciones, distribuciones o ajustes localizados.
- `MINOR`: cambios visibles que agregan, eliminan o reemplazan componentes o
  flujos acotados y requieren cierta adaptacion.
- `MAJOR`: transformaciones drasticas de flujos centrales, navegacion principal
  o modelo general de uso que exigen adaptacion amplia.

Un modulo nuevo es una señal para revisar el impacto, no una regla automatica
de `MAJOR`. Si la evidencia es ambigua, se elige el nivel menor. La deteccion
de codigo de producto debe apoyarse en las rutas y el contenido del diff, sin
convertir nombres de archivos o extensiones en una politica universal.

### Elegibilidad y salida

La presencia de codigo de producto hace elegible el release y fija `PATCH` como
minimo. Documentacion pura no lo hace elegible; tests, configuracion, tooling e
infraestructura tampoco por si solos. Si hay codigo y documentacion, el codigo
determina la elegibilidad y el resumen puede mencionar la documentacion de forma
agrupada.

La salida debe conservar solo la decision, una justificacion breve, el resumen
de cambios relevantes y un unico bloque `git tag -a` apuntado al SHA completo.
No debe incluir un listado exhaustivo de commits, estadisticas innecesarias,
politicas del proyecto ni un bloque de push.

## Risks / Trade-offs

- [Clasificacion de codigo de producto] Un repositorio puede mezclar codigo de
  producto con tooling o generacion en rutas similares -> revisar el contenido
  del diff y tratar la duda de nivel como el nivel menor, sin ampliar el
  analisis al proyecto completo.
- [Retiro de argumentos] Consumidores que usen `--base`, `--strict`,
  `--prerelease` o `--stable` tendran que adaptar sus invocaciones -> documentar
  la interfaz reducida y conservar la seguridad de solo lectura.
- [Historias extensas sin tags] El primer analisis puede abarcar muchos commits
  -> resumir por cambios agrupados y no imprimir el historial completo.
- [Impacto mayor subestimado] Elegir el nivel menor ante ambiguedad puede
  ocultar un cambio amplio -> reservar `MAJOR` para evidencia clara y describir
  la incertidumbre en la justificacion breve.

## Migration Plan

1. Sustituir las instrucciones del comando portable por la interfaz reducida y
   validar sus escenarios con repositorios de prueba o fixtures temporales.
2. Comparar manualmente el respaldo versionado con la instalacion global antes
   de sincronizarlo.
3. Si una invocacion antigua usa una opcion retirada, reemplazarla por la
   ejecucion automatica o por `--version`.

La migracion es reversible restaurando la version anterior del archivo portable;
no requiere cambios en refs ni en datos persistentes.
