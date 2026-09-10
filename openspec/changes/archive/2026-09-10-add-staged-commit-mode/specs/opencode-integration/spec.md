## ADDED Requirements

### Requirement: Modos explícitos para cambios staged

El comando portable `commit` SHALL separar el modo normal del working tree del
modo explícito del index mediante el argumento `--staged`.

#### Scenario: Cambios staged bloquean el modo normal

- **WHEN** el usuario ejecuta `/commit` y existe al menos un cambio staged
- **THEN** el comando SHALL detenerse antes de hacer staging o crear commits y
  SHALL indicar que debe usarse `/commit --staged` para procesar el index

#### Scenario: `--staged` crea un commit del index

- **WHEN** el usuario ejecuta `/commit --staged` y existe contenido staged
- **THEN** el comando SHALL proponer y crear, tras confirmación explícita, un
  único commit con exactamente el contenido del index sin reagruparlo ni
  modificar su staging

#### Scenario: Cambios fuera del index quedan intactos

- **WHEN** `/commit --staged` se ejecuta con cambios staged y también existen
  cambios unstaged o no trackeados
- **THEN** SHALL incluir únicamente el index en el commit y SHALL dejar intactos
  los demás cambios, informándolos como pendientes

#### Scenario: `--staged` sin contenido staged

- **WHEN** el usuario ejecuta `/commit --staged` y no existe ningún cambio staged
- **THEN** el comando SHALL detenerse sin hacer staging ni crear commits e
  informar que no hay contenido en el index para procesar

#### Scenario: El modo working tree conserva la agrupación

- **WHEN** el usuario ejecuta `/commit` sin cambios staged y existen cambios en
  el working tree
- **THEN** el comando SHALL conservar la agrupación semántica existente de uno o
  más commits y SHALL hacer staging únicamente de las rutas aprobadas para cada
  grupo

### Requirement: Interfaz de argumentos reducida y segura

El comando SHALL reconocer `--staged` como única opción formal. El texto sin
opciones SHALL poder usarse como contexto, pero una opción desconocida SHALL
detener el flujo sin analizar ni modificar el repositorio.

#### Scenario: Opción staged válida

- **WHEN** `$ARGUMENTS` contiene `--staged` y ningún argumento de opción
  desconocido
- **THEN** el comando SHALL seleccionar exclusivamente el modo index y tratar el
  texto restante sin opciones como contexto no ejecutable

#### Scenario: Opción desconocida

- **WHEN** `$ARGUMENTS` contiene una opción distinta de `--staged`
- **THEN** el comando SHALL informar que la opción no está soportada y SHALL
  terminar sin ejecutar staging, commits ni otras operaciones de escritura Git

### Requirement: Análisis superficial con revisión dirigida

El comando SHALL comenzar el análisis del alcance elegido con el estado, las
 rutas, los estados y las estadísticas de los cambios, sin inspeccionar de forma
 exhaustiva el proyecto ni los archivos no relacionados. SHALL revisar el diff
 detallado únicamente cuando el resumen no permita resolver una ambigüedad real
 o cuando sea necesario evaluar una señal de seguridad en una ruta elegible.

#### Scenario: Resumen suficiente para proponer el plan

- **WHEN** las rutas, estados y estadísticas permiten identificar el alcance y
  la intención de los cambios
- **THEN** el comando SHALL generar el plan sin exigir una inspección exhaustiva
  del contenido del diff

#### Scenario: Ambigüedad o señal de seguridad

- **WHEN** el resumen no permite agrupar o describir correctamente un cambio, o
  una ruta elegible parece contener información sensible
- **THEN** el comando SHALL ampliar la revisión únicamente a la evidencia
  necesaria y SHALL conservar la confirmación específica para rutas sospechosas
