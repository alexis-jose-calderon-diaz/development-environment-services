## MODIFIED Requirements

### Requirement: Modos explícitos para cambios staged

El comando portable `commit` SHALL separar el modo normal del working tree del
modo explícito del index mediante el argumento `--staged`.

#### Scenario: Cambios staged bloquean el modo normal

- **WHEN** el usuario ejecuta `/commit` y existe al menos un cambio staged
- **THEN** el comando SHALL detenerse antes de hacer staging o crear commits,
  SHALL dejar intacto el index y SHALL indicar que debe usarse `/commit --staged`
  o prepararse manualmente el index

#### Scenario: `--staged` crea un commit del index

- **WHEN** el usuario ejecuta `/commit --staged` y existe contenido staged
- **THEN** el comando SHALL proponer y crear, tras confirmación explícita, un
  único commit con exactamente el contenido del index, sin reagruparlo,
  dividirlo ni modificar su staging

#### Scenario: Cambios fuera del index quedan intactos

- **WHEN** `/commit --staged` se ejecuta con cambios staged y también existen
  cambios unstaged o no trackeados
- **THEN** SHALL incluir únicamente el index en el commit, SHALL dejar intactos
  los demás cambios y SHALL informarlos como pendientes cuando sea relevante

#### Scenario: `--staged` sin contenido staged

- **WHEN** el usuario ejecuta `/commit --staged` y no existe ningún cambio staged
- **THEN** el comando SHALL detenerse sin hacer staging ni crear commits e
  informar que no hay contenido en el index para procesar

#### Scenario: El modo working tree conserva la agrupación

- **WHEN** el usuario ejecuta `/commit` sin cambios staged y existen cambios en
  el working tree
- **THEN** el comando SHALL analizar todos los cambios no ignorados elegibles y
  SHALL hacer staging únicamente de las rutas aprobadas para cada commit

#### Scenario: Un archivo pertenece a un único commit

- **WHEN** un archivo completo contiene cambios relacionados con una sola
  intención lógica
- **THEN** el archivo SHALL pertenecer a un único commit y no SHALL dividirse
  automáticamente por hunks

#### Scenario: Archivo con intenciones separables

- **WHEN** un archivo contiene cambios de dos intenciones que deberían formar
  commits separados
- **THEN** el comando SHALL detenerse y solicitar staging manual, sin dividir
  hunks automáticamente ni elegir una intención de forma arbitraria

### Requirement: Análisis superficial con revisión dirigida

El comando SHALL comenzar el análisis del alcance elegido con el estado, las
rutas, los estados y las estadísticas de los cambios, sin inspeccionar de forma
exhaustiva el proyecto ni los archivos no relacionados. SHALL revisar el diff
detallado únicamente cuando el resumen no permita resolver una ambigüedad real,
decidir la agrupación, redactar el plan o evaluar una señal de seguridad en una
ruta elegible.

#### Scenario: Resumen suficiente para proponer el plan

- **WHEN** las rutas, estados y estadísticas permiten identificar el alcance y
  la intención de los cambios
- **THEN** el comando SHALL generar el plan sin exigir una inspección
  exhaustiva del contenido del diff

#### Scenario: Ambigüedad o señal de seguridad

- **WHEN** el resumen no permite agrupar o describir correctamente un cambio, o
  una ruta elegible parece contener información sensible
- **THEN** el comando SHALL ampliar la revisión únicamente a la evidencia
  necesaria, sin mostrar valores sensibles ni buscar secretos fuera de las
  rutas elegibles

## ADDED Requirements

### Requirement: Composición con la skill externa de commits

El command `/commit` SHALL usar la skill externa `git-commit` como base para las
capacidades generales de Conventional Commits, análisis del diff,
determinación de `type` y `scope`, mensajes, breaking changes y ejecución
general de commits. El command SHALL añadir sus políticas locales sin modificar,
copiar ni extender físicamente la skill externa. Cuando exista una diferencia,
la regla local más restrictiva SHALL prevalecer para este command.

#### Scenario: Capacidad general delegada a la skill

- **WHEN** el command analiza un cambio elegible para crear un commit
- **THEN** SHALL aprovechar la capacidad general de la skill para analizarlo y
  generar un Conventional Commit, aplicando además las restricciones locales
  del command

#### Scenario: Skill externa permanece intacta

- **WHEN** se refactoriza el command portable
- **THEN** no SHALL modificarse ningún archivo de la skill externa ni SHALL
  requerirse una copia de sus explicaciones generales dentro del command

#### Scenario: Política local más restrictiva

- **WHEN** la skill permite una operación que el workflow local prohíbe
- **THEN** el command SHALL detener o restringir la operación conforme a su
  política local, sin relajarla por la recomendación general de la skill

### Requirement: Agrupación lógica de commits del working tree

En modo `working-tree`, el command SHALL agrupar archivos completos por
intención lógica y SHALL separar las intenciones independientes. No SHALL
agrupar archivos únicamente por compartir directorio o tipo. Cambios de varias
capas SHALL permanecer juntos cuando formen una modificación funcional
coherente; contratos compartidos y consumidores SHALL poder permanecer juntos
cuando separarlos deje un commit conceptualmente incompleto.

#### Scenario: Intenciones independientes

- **WHEN** el working tree contiene cambios de intenciones independientes
- **THEN** cada intención SHALL proponerse como un commit separado, con cada
  archivo asignado a un único grupo

#### Scenario: Cambio cross-layer coherente

- **WHEN** una única modificación funcional requiere cambios coordinados en
  backend, cliente, tests, documentación o tooling
- **THEN** los archivos necesarios SHALL permanecer en el mismo commit aunque
  pertenezcan a capas o categorías distintas

#### Scenario: Código fuente y archivos generados

- **WHEN** un archivo generado cambia como consecuencia directa del cambio
  fuente que lo produce
- **THEN** ambos SHALL permanecer juntos en el mismo commit cuando representen
  una única intención funcional

#### Scenario: Contrato y consumidores

- **WHEN** separar un contrato compartido de sus consumidores dejaría uno de
  los commits conceptualmente incompleto
- **THEN** el contrato y los consumidores afectados SHALL permanecer juntos
  en el mismo commit

#### Scenario: Separación artificial por categoría

- **WHEN** backend y frontend, tests, documentación o tooling forman una única
  modificación coherente
- **THEN** el command no SHALL separarlos artificialmente solo por su categoría

### Requirement: Mensajes locales en español

Los commits propuestos por `/commit` SHALL conservar el `type` de Conventional
Commits en inglés y SHALL usar una descripción en español, concreta, en
minúsculas y relacionada con la intención del cambio. Cuando exista un body,
este SHALL estar en español. El `scope` SHALL basarse en evidencia real del
repositorio y no SHALL inventarse.

#### Scenario: Mensaje de una línea

- **WHEN** una intención requiere un commit sin body ni footer adicional
- **THEN** el mensaje SHALL contener exactamente un `type` válido, un `scope`
  sustentado por evidencia cuando corresponda y una descripción concreta en
  español

#### Scenario: Mensaje con body o breaking change

- **WHEN** el análisis determina que el commit necesita body, footer o una
  indicación de breaking change
- **THEN** la descripción y el body SHALL estar en español, mientras las
  palabras clave normativas de Conventional Commits SHALL conservar su forma
  requerida

### Requirement: Propuesta exacta y confirmación obligatoria

Antes de cualquier operación de escritura Git, el command SHALL mostrar una
propuesta completa que incluya exactamente los campos `Modo`, `Branch`,
`Upstream` y `Commits`, seguida por bloques consecutivos `### Commit N` con la
`Intención`, el mensaje exacto y los cambios con estados y rutas. La propuesta
SHALL incluir siempre las secciones `## Pendientes` y `## Advertencias`.
`Commits` SHALL coincidir con la cantidad de commits propuestos.

#### Scenario: Propuesta working tree

- **WHEN** el modo es `working-tree` y existen varias intenciones
- **THEN** la propuesta SHALL mostrar un bloque `### Commit N` por intención,
  en el orden de ejecución, sin nombres alternativos como grupo o cambio

#### Scenario: Propuesta staged

- **WHEN** el modo es `staged` y existe contenido elegible en el index
- **THEN** la propuesta SHALL mostrar exactamente `Commits: 1`, únicamente
  `### Commit 1` y todos los archivos staged elegibles en ese commit

#### Scenario: Estados y rutas de cambios

- **WHEN** la propuesta enumera archivos
- **THEN** SHALL usar únicamente estados Git válidos, SHALL mostrar rutas
  relativas a la raíz que comiencen por `./`, SHALL conservar los renombrados
  como una sola entrada con ruta anterior y nueva, y SHALL ordenar de forma
  estable las demás rutas lexicográficamente

#### Scenario: Confirmación del plan

- **WHEN** la propuesta está completa y no existe una ambigüedad pendiente
- **THEN** el command SHALL usar `question` inmediatamente después de la
  propuesta, con las opciones exactas `Crear commits`, `Ajustar plan` y
  `Cancelar`, y no SHALL ejecutar staging ni commit antes de recibir `Crear
  commits`

#### Scenario: Plan ajustado

- **WHEN** el usuario selecciona `Ajustar plan` o cambia cualquier elemento del
  plan
- **THEN** el command SHALL mostrar nuevamente la propuesta completa y SHALL
  requerir una nueva confirmación antes de escribir

### Requirement: Protección frente a cambios concurrentes

El command SHALL capturar el estado del repositorio utilizado para construir la
propuesta y SHALL volver a comprobarlo después de la confirmación y antes de
cada operación de escritura. SHALL comparar los cambios relevantes y el index
con el estado aprobado. Si existe una diferencia, SHALL detenerse, no SHALL
reconciliarla automáticamente y SHALL requerir una nueva propuesta y
confirmación.

#### Scenario: Repositorio sin cambios concurrentes

- **WHEN** el estado relevante y el index coinciden con la propuesta confirmada
- **THEN** el command SHALL poder continuar con exactamente las rutas, el orden
  y los mensajes aprobados

#### Scenario: Repositorio cambiado tras confirmar

- **WHEN** aparece, desaparece o cambia una ruta relevante, o cambia el index
  después de la confirmación
- **THEN** el command SHALL detenerse sin aplicar el plan anterior y SHALL
  informar que debe reconstruirse y confirmarse una nueva propuesta

### Requirement: Seguridad y verificación de la ejecución

El command SHALL inspeccionar señales de secretos únicamente en las rutas
elegibles y nunca SHALL mostrar sus valores. Ante evidencia razonable de un
secreto, en working tree SHALL excluir la ruta y, en modo `--staged`, SHALL
detenerse para que el usuario corrija manualmente el index; nunca SHALL ofrecer
una opción para autorizar su inclusión. El command SHALL respetar hooks y firma,
no SHALL ejecutar validaciones del proyecto y SHALL verificar el resultado tras
cada commit.

#### Scenario: Ruta sospechosa en working tree

- **WHEN** una ruta elegible del working tree contiene evidencia razonable de
  un secreto
- **THEN** el command SHALL excluirla del plan sin mostrar su valor y SHALL
  poder continuar con otros grupos que no dependan de ella

#### Scenario: Ruta sospechosa en staged

- **WHEN** el index contiene evidencia razonable de un secreto
- **THEN** el command SHALL detenerse sin modificar el index ni crear el commit
  y SHALL pedir que el usuario corrija manualmente el staging, sin ofrecer
  autorización para incluir la ruta

#### Scenario: Fallo de hook

- **WHEN** un hook falla o modifica archivos o el index durante un commit
- **THEN** el command SHALL comprobar si el commit llegó a crearse, SHALL
  detenerse, no SHALL usar `--no-verify`, no SHALL hacer amend y no SHALL
  modificar automáticamente el código para corregir el hook

#### Scenario: Verificación posterior a un commit

- **WHEN** un commit termina correctamente
- **THEN** el command SHALL comprobar su SHA corto, mensaje, rutas realmente
  incluidas y estado residual, y no SHALL continuar con otro commit si el
  resultado no coincide con la propuesta aprobada

#### Scenario: Validaciones fuera de alcance

- **WHEN** el command crea o verifica commits
- **THEN** no SHALL ejecutar ni afirmar haber ejecutado build, tests, lint,
  format, type-check, migraciones, generación de clientes, instalación de
  dependencias o servicios
