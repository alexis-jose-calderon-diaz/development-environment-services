## MODIFIED Requirements

### Requirement: Modos explícitos para cambios staged

El comando portable `commit` SHALL separar el modo normal del working tree del
modo explícito del index mediante una sintaxis de argumentos determinista. El
modo `staged` SHALL seleccionarse únicamente cuando el primer token de la
invocación sea exactamente `--staged`; en cualquier otro caso sin una opción
válida, el modo SHALL ser `working-tree`.

#### Scenario: Cambios staged bloquean el modo normal

- **WHEN** el usuario ejecuta `/commit` sin `--staged` como primer token y existe al menos un cambio staged
- **THEN** el comando SHALL detenerse antes de hacer staging o crear commits, SHALL dejar intacto el index y SHALL indicar que debe usarse `/commit --staged` o prepararse manualmente el index

#### Scenario: `--staged` crea un commit del index

- **WHEN** el usuario ejecuta `/commit --staged` con `--staged` como primer token y existe contenido staged
- **THEN** el comando SHALL proponer y crear, tras confirmación explícita, un único commit con exactamente el contenido del index, sin reagruparlo, dividirlo ni modificar su staging

#### Scenario: Cambios fuera del index quedan intactos

- **WHEN** `/commit --staged` se ejecuta con cambios staged y también existen cambios unstaged o no trackeados
- **THEN** SHALL incluir únicamente el index en el commit y SHALL dejar intactos los demás cambios y SHALL informarlos como pendientes cuando sea relevante

#### Scenario: `--staged` sin contenido staged

- **WHEN** el usuario ejecuta `/commit --staged` con `--staged` como primer token y no existe ningún cambio staged
- **THEN** el comando SHALL detenerse sin hacer staging ni crear commits e informar que no hay contenido en el index para procesar

#### Scenario: El modo working tree conserva la agrupación

- **WHEN** el usuario ejecuta `/commit` sin `--staged` como primer token, sin cambios staged y existen cambios en el working tree
- **THEN** el comando SHALL analizar todos los cambios no ignorados elegibles y SHALL hacer staging únicamente de las rutas aprobadas para cada commit

#### Scenario: Un archivo pertenece a un único commit

- **WHEN** un archivo completo contiene cambios relacionados con una sola intención lógica
- **THEN** el archivo SHALL pertenecer a un único commit y no SHALL dividirse automáticamente por hunks

#### Scenario: Archivo con intenciones separables

- **WHEN** un archivo contiene cambios de dos intenciones que deberían formar commits separados
- **THEN** el comando SHALL detenerse y solicitar staging manual, sin dividir hunks automáticamente ni elegir una intención de forma arbitraria

### Requirement: Interfaz de argumentos reducida y segura

El comando SHALL reconocer `--staged` como única opción formal y SHALL
interpretarlo únicamente cuando sea el primer token de la invocación. El texto
posterior que no sea una opción SHALL poder usarse como contexto no ejecutable.
Una opción desconocida, o cualquier token posterior que empiece por `-`, SHALL
detener el flujo sin analizar ni modificar el repositorio. El command SHALL
distinguir los argumentos reales recibidos de las menciones de opciones que
formen parte de su propia documentación.

#### Scenario: Opción staged válida

- **WHEN** el primer token real de la invocación es exactamente `--staged` y ningún token posterior empieza por `-`
- **THEN** el comando SHALL seleccionar exclusivamente el modo index y SHALL tratar el texto restante sin opciones como contexto no ejecutable

#### Scenario: Ejecución normal sin opción

- **WHEN** la invocación no tiene argumentos o su primer token no empieza por `-` y ningún token posterior empieza por `-`
- **THEN** el comando SHALL seleccionar el modo working-tree y SHALL tratar todo el texto recibido como contexto no ejecutable

#### Scenario: Opción desconocida

- **WHEN** la invocación contiene una opción distinta de `--staged`, ya sea como primer token o después del primero
- **THEN** el comando SHALL informar que la opción no está soportada y SHALL terminar sin ejecutar staging, commits ni otras operaciones de escritura Git

#### Scenario: Opción posterior no soportada

- **WHEN** un token posterior al primero empieza por `-`, incluido un segundo `--staged`
- **THEN** el comando SHALL informar que la sintaxis de opciones no está soportada y SHALL terminar sin ejecutar staging, commits ni otras operaciones de escritura Git

#### Scenario: Mención documental de la opción

- **WHEN** el texto del command menciona `--staged` fuera del bloque que representa los argumentos reales de la invocación
- **THEN** esas menciones SHALL permanecer como documentación y no SHALL cambiar el modo seleccionado
