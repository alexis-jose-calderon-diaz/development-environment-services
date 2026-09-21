# Design

## Context

La superficie pública contiene cinco directorios ejecutables bajo `skills/`.
Cada uno tiene un `SKILL.md` cuyo campo `name` coincide con el directorio y un
archivo de evaluaciones con `skill_name` coincidente. El catálogo
`skills/README.md` contiene los identificadores usados por los comandos
`npx skills add` y `npx skills update`. Véanse `proposal.md` y la delta de
`opencode-integration` para la motivación y el contrato actualizado.

## Goals / Non-Goals

**Goals:**

- Usar `ac-` como prefijo uniforme en los cinco identificadores públicos.
- Mantener la correspondencia entre nombre instalable, directorio, frontmatter,
  evaluaciones y documentación.
- Hacer explícito que el cambio es incompatible con instalaciones que todavía
  usan los identificadores antiguos.
- Verificar que no queden referencias activas a los nombres antiguos dentro de
  la superficie pública.

**Non-Goals:**

- No modificar la lógica, las instrucciones, los criterios de evaluación ni el
  comportamiento de ejecución de las skills.
- No renombrar skills externas, skills internas de `./.agents/` ni entradas de
  `skills-lock.json`.
- No añadir aliases ni compatibilidad automática para los nombres antiguos.
- No cambiar la integración portable de OpenCode, los servicios Docker ni las
  especificaciones fuera de `opencode-integration`.

## Decisions

### Prefijo con guion

Los nombres usarán `ac-<nombre-actual>` en lugar de concatenar `ac` al nombre.
Esto conserva la convención kebab-case existente y permite identificar el
prefijo sin perder la capacidad de leer la función de cada skill.

### Renombrado físico y actualización coherente

Los cinco directorios se renombrarán conservando su contenido y evaluaciones.
Después se actualizarán únicamente los campos de identidad (`name` y
`skill_name`) y las referencias documentales o de validación necesarias. No se
reescribirán los cuerpos de las skills salvo que contengan una referencia
identificadora que deba actualizarse.

### Cambio incompatible sin alias

Los identificadores antiguos dejarán de aparecer como opciones instalables y
no se crearán directorios duplicados. Un alias mantendría dos superficies
publicadas y podría permitir que consumidores sigan instalando una identidad
sin prefijo, contradiciendo el objetivo de nomenclatura única.

### Fuente pública como límite

La búsqueda y las comprobaciones se limitarán a las referencias activas de la
superficie pública y a la documentación que la instala. Las entradas externas
de `skills-lock.json` no se reinterpretarán como skills públicas del catálogo.

## Risks / Trade-offs

- [Instalaciones existentes quedan obsoletas] -> Documentar el cambio como
  **BREAKING** y proporcionar los nuevos nombres en todos los comandos de
  instalación y actualización.
- [Una referencia antigua queda oculta en documentación o evaluaciones] ->
  Ejecutar búsquedas dirigidas de los cinco nombres antiguos y comprobar que
  cada nuevo nombre coincide en directorio, `SKILL.md`, evaluación y catálogo.
- [El renombrado altera accidentalmente el contenido] -> Usar renombres de
  directorio preservando archivos y revisar el diff para confirmar que solo
  cambiaron identidades y referencias autorizadas.
- [El CLI espera una coincidencia estricta entre nombre y ruta] -> Ejecutar la
  validación disponible para cada `skills/ac-*/SKILL.md` y revisar los campos de
  identidad antes de considerar completado el cambio.

## Migration Plan

1. Renombrar los cinco directorios públicos y actualizar sus metadatos y
   evaluaciones.
2. Actualizar `skills/README.md` y cualquier referencia activa de instalación,
   actualización o catálogo.
3. Validar estructura, nombres, referencias antiguas ausentes y contenido
   operativo sin cambios no autorizados.
4. Comunicar a los consumidores que deben instalar las skills con los nuevos
   identificadores `ac-*`; no se requiere migración de servicios ni de datos.

El rollback consiste en revertir el commit del cambio, restaurando los
directorios, metadatos, evaluaciones y documentación a sus nombres anteriores.
