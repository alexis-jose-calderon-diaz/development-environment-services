## ADDED Requirements

### Requirement: Propuesta de tag centrada en commits

El comando portable `tag` SHALL analizar los commits alcanzables desde la base
seleccionada hasta `HEAD` y SHALL usar únicamente esos commits, sus rutas
modificadas y sus diffs relevantes como evidencia principal. No SHALL exigir la
lectura de la politica general del proyecto ni revisar areas no modificadas para
decidir la version.

#### Scenario: Base determinada por el ultimo tag

- **WHEN** existen tags numericos alcanzables desde la historia `first-parent`
  de `HEAD`
- **THEN** el comando usa como base el tag de release mas reciente de esa
  historia y analiza solo los commits posteriores hasta `HEAD`

#### Scenario: Repositorio sin tags

- **WHEN** no existe ningun tag de release alcanzable
- **THEN** el comando analiza toda la historia disponible hasta `HEAD` y usa
  `v0.0.0` como base virtual solo para calcular el primer tag automatico

#### Scenario: Cambios sin commit

- **WHEN** el working tree contiene cambios staged, unstaged o no trackeados
- **THEN** el comando los excluye del analisis de version y continua usando el
  estado alcanzado por `HEAD`, informando la situacion de forma breve

### Requirement: Interfaz de argumentos reducida

El comando SHALL aceptar como unico argumento opcional `--version <version>`.
La version SHALL mantener el formato numerico `vMAJOR.MINOR.PATCH`. El comando
SHALL rechazar argumentos desconocidos y no SHALL conservar los modos separados
de base manual, working tree estricto o versiones preliminares.

#### Scenario: Version automatica

- **WHEN** el usuario ejecuta el comando sin argumentos y existen commits
  versionables
- **THEN** el comando calcula la siguiente version a partir del impacto de los
  cambios desde la base seleccionada

#### Scenario: Version explicita

- **WHEN** el usuario proporciona `--version vMAJOR.MINOR.PATCH`
- **THEN** el comando usa exactamente esa version como objetivo, valida que no
  exista y no recalcula el incremento a partir del impacto

#### Scenario: Argumento no soportado

- **WHEN** el usuario proporciona una opcion distinta de `--version`
- **THEN** el comando no propone una version y explica brevemente que el
  argumento no esta soportado

### Requirement: Clasificacion por impacto de usuario

El comando SHALL clasificar la evolucion de la version por la adaptacion que el
cambio exige al usuario. La cantidad, tipo, arquitectura o tamano del codigo no
SHALL elevar por si mismos el nivel. Si la evidencia queda entre dos niveles,
el comando SHALL elegir el nivel menor.

#### Scenario: Cambio de codigo con impacto minimo

- **WHEN** el rango contiene codigo de producto, aunque el cambio sea interno
  o localizado
- **THEN** la propuesta SHALL ser como minimo `PATCH`

#### Scenario: Cambio visible localizado

- **WHEN** el cambio altera un boton, mueve inputs o ajusta la distribucion
  puntual de un componente sin transformar un flujo principal
- **THEN** la propuesta SHALL usar `PATCH`

#### Scenario: Cambio visible con adaptacion acotada

- **WHEN** el cambio agrega, elimina o reemplaza un modal, componente o flujo
  acotado que requiere adaptacion del usuario
- **THEN** la propuesta SHALL usar `MINOR`, salvo que exista evidencia clara de
  un impacto mayor

#### Scenario: Cambio drastico del producto

- **WHEN** el cambio transforma un flujo central, la navegacion principal o la
  forma general de usar el producto y exige una adaptacion amplia
- **THEN** la propuesta SHALL usar `MAJOR`

#### Scenario: Modulo nuevo no automaticamente mayor

- **WHEN** el rango agrega un modulo nuevo
- **THEN** el comando SHALL clasificarlo segun su impacto real y no SHALL usar
  `MAJOR` unicamente por la existencia del modulo

### Requirement: Elegibilidad de cambios para versionar

El comando SHALL proponer al menos un `PATCH` cuando el rango contenga codigo
de producto. Los cambios de tests, configuracion, tooling, infraestructura o
documentacion por si solos no SHALL obligar a crear un tag. La documentacion
mezclada con codigo de producto SHALL quedar incluida en el resumen del tag.

#### Scenario: Solo documentacion

- **WHEN** todos los cambios del rango afectan unicamente documentacion
- **THEN** el comando SHALL mostrar que no se propone una nueva version y no
  SHALL generar un comando `git tag`

#### Scenario: Codigo y documentacion

- **WHEN** el rango contiene codigo de producto y documentacion
- **THEN** el comando SHALL proponer una version basada en el impacto del codigo
  y SHALL resumir la documentacion solo cuando aporte contexto

### Requirement: Salida breve y segura

El comando SHALL mostrar una propuesta concisa con la base, la version objetivo,
el nivel de impacto, el estado del working tree y un resumen agrupado de los
cambios relevantes. Una propuesta valida SHALL terminar con un unico bloque
manual para crear un tag anotado apuntando al SHA completo de `HEAD`.

El comando SHALL permanecer en modo de analisis: no SHALL ejecutar `git tag`,
crear o modificar refs, publicar tags, modificar archivos ni cambiar el working
tree.

#### Scenario: Propuesta valida

- **WHEN** el repositorio pasa las validaciones y contiene codigo versionable
- **THEN** el comando muestra solo la informacion necesaria para revisar la
  propuesta y un unico comando manual de tag sin `git push`

#### Scenario: Sin cambios versionables

- **WHEN** no existe codigo de producto versionable en el rango
- **THEN** el comando muestra un resultado breve sin propuesta y sin bloque de
  comandos
