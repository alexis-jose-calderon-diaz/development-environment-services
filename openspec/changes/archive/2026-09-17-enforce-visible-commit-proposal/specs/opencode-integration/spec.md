## MODIFIED Requirements

### Requirement: Propuesta exacta y confirmación obligatoria

Antes de cualquier operación de escritura Git, el command SHALL mostrar una
propuesta completa que incluya exactamente los campos `Modo`, `Branch`,
`Upstream` y `Commits`, seguida por bloques consecutivos `### Commit N` con la
`Intención`, el mensaje exacto y los cambios con estados y rutas. La propuesta
SHALL incluir siempre las secciones `## Pendientes` y `## Advertencias`, y SHALL
terminar con el marcador visible `## Fin de propuesta`. `Commits` SHALL
coincidir con la cantidad de commits propuestos. La llamada a `question` SHALL
ocurrir después de emitir dicho marcador y SHALL mantener un contenido breve,
sin repetir la lista completa de archivos ni el plan detallado.

#### Scenario: Propuesta working tree

- **WHEN** el modo es `working-tree` y existen varias intenciones
- **THEN** la propuesta SHALL mostrar un bloque `### Commit N` por intención,
  en el orden de ejecución, sin nombres alternativos como grupo o cambio, y
  SHALL cerrar con `## Fin de propuesta`

#### Scenario: Propuesta staged

- **WHEN** el modo es `staged` y existe contenido elegible en el index
- **THEN** la propuesta SHALL mostrar exactamente `Commits: 1`, únicamente
  `### Commit 1` y todos los archivos staged elegibles en ese commit, y SHALL
  cerrar con `## Fin de propuesta`

#### Scenario: Estados y rutas de cambios

- **WHEN** la propuesta enumera archivos
- **THEN** SHALL usar únicamente estados Git válidos, SHALL mostrar rutas
  relativas a la raíz que comiencen por `./`, SHALL conservar los renombrados
  como una sola entrada con ruta anterior y nueva, y SHALL ordenar de forma
  estable las demás rutas lexicográficamente

#### Scenario: Confirmación del plan

- **WHEN** la propuesta está completa y no existe una ambigüedad pendiente
- **THEN** el command SHALL emitir primero la propuesta completa junto con
  `## Fin de propuesta`, SHALL usar después `question` con las opciones exactas
  `Crear commits`, `Ajustar plan` y `Cancelar`, y no SHALL ejecutar staging ni
  commit antes de recibir `Crear commits`

#### Scenario: Plan ajustado

- **WHEN** el usuario selecciona `Ajustar plan` o cambia cualquier elemento del
  plan
- **THEN** el command SHALL mostrar nuevamente la propuesta completa, SHALL
  cerrarla con `## Fin de propuesta` y SHALL requerir una nueva confirmación
  antes de escribir
