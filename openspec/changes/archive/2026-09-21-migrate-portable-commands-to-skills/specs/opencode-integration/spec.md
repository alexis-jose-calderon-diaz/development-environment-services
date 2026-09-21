# Spec Delta

## MODIFIED Requirements

### Requirement: Límites explícitos de las skills frente a los permisos

Las skills migradas SHALL documentar que sus instrucciones read-only no
constituyen un aislamiento de permisos equivalente al de un agente configurado.
La documentación SHALL indicar que el agente seleccionado y sus permisos
efectivos siguen siendo responsables de impedir ediciones, delegaciones u
operaciones no autorizadas. `ac-release-tag-proposal` SHALL permanecer
read-only en todo momento; `ac-pull-request` SHALL limitar sus operaciones de
publicación a una confirmación inequívoca y no SHALL presentar la skill como un
control de seguridad del runtime.

#### Scenario: Carga de una skill read-only en un agente con edición

- **WHEN** el agente actual tiene permisos de edición y carga
  `ac-release-tag-proposal`, `ac-change-review` o
  `ac-integration-boundary-audit`
- **THEN** la skill conserva la instrucción de no editar, pero la documentación
  no presenta esa instrucción como una garantía de seguridad del runtime

#### Scenario: Uso de una skill read-only en Plan mode

- **WHEN** el usuario quiere una propuesta de tag estrictamente sin
  modificaciones y utiliza un agente con permisos read-only
- **THEN** `ac-release-tag-proposal` puede ejecutarse dentro de ese límite
  efectivo y devolver solo el análisis solicitado

#### Scenario: Publicación protegida por confirmación

- **WHEN** un agente con capacidad de edición carga `ac-pull-request`
- **THEN** la skill no interpreta sus propias instrucciones como aislamiento y
  solo intenta publicar después de mostrar el plan completo y recibir la
  confirmación exacta del usuario

### Requirement: Separación de configuraciones local y global

La documentación del repositorio, principalmente el `README.md` de la
integración y el `AGENTS.md` raíz cuando corresponda, SHALL explicar que el
`AGENTS.md` raíz y la configuración del proyecto consumidor pertenecen a ese
proyecto, mientras `integrations/opencode/` contiene el respaldo versionado de
la configuración portable que se instala manualmente bajo
`~/.config/opencode/`. SHALL distinguir también la superficie pública de skills
versionadas bajo `skills/`, las dependencias externas gestionadas por el CLI
`skills` y la superficie interna `./.agents/`, que no forma parte del catálogo
público ni de la instalación documentada. SHALL distinguir los commands globales
de OpenCode que puedan existir en un consumidor de los workflows locales del
proyecto y SHALL evitar instrucciones que mezclen ambas superficies. El
`integrations/opencode/AGENTS.md` SHALL limitarse a reglas aplicables a los
recursos dentro de su propio scope, ser agnóstico de ubicación y no asumir que
es una política global, una instalación operativa o parte de un repositorio
consumidor concreto. La documentación portable SHALL dejar de presentar
agentes personalizados, protocolos de HANDOFF o los commands `tag` y `pr`
eliminados como recursos instalables.

#### Scenario: Consulta de la guia de integracion

- **WHEN** un usuario consulta el `README.md` de la integracion o el
  `AGENTS.md` raiz
- **THEN** puede identificar el propósito, la ubicación operativa, la relación
  y los límites de `integrations/opencode/`, `skills/` y `./.agents/` sin
  interpretar la superficie interna como un recurso público ni encontrar
  agentes o commands eliminados en el inventario instalable

#### Scenario: Aplicacion aislada de las reglas del toolkit

- **WHEN** el `integrations/opencode/AGENTS.md` se aplica bajo cualquier
  ubicacion que contenga sus recursos de scope
- **THEN** sus reglas se mantienen validas sin depender de una ruta de
  instalacion, un repositorio consumidor, una estructura de workflows o una
  politica local concreta

#### Scenario: Instalación portable sin commands sustituidos

- **WHEN** el usuario sincroniza manualmente la configuracion portable
- **THEN** copia únicamente los recursos de configuración y plugins que
  permanezcan en `integrations/opencode/`, instala las skills públicas por
  separado, conserva separadas las reglas y configuraciones del proyecto
  consumidor y no copia `./.agents/`

### Requirement: Skill propia documentada como recurso portable

La integración SHALL versionar las skills públicas dentro de `skills/`, mantener
cada skill ejecutable en `skills/<name>/SKILL.md` y documentar su instalación
mediante `npx skills add <repository> --skill <name> --global`. Los siete
nombres públicos SHALL usar el prefijo `ac-`:
`ac-change-impact-analysis`, `ac-change-planning`, `ac-change-review`,
`ac-grouped-commits`, `ac-integration-boundary-audit`,
`ac-release-tag-proposal` y `ac-pull-request`. La documentación SHALL permitir
que el usuario seleccione el agente mediante el comportamiento neutral del CLI,
sin recomendar ni imponer `opencode` u otro agente concreto. SHALL documentar
la actualización mediante `npx skills update <name> --global`, distinguir las
skills públicas de las dependencias externas opcionales y excluir explícitamente
`./.agents/` de esta superficie. La sincronización manual de
`integrations/opencode/` SHALL quedar limitada a la configuración y plugins que
permanezcan, sin incluir agents o commands sustituidos, y SHALL mantener
alineados el README raíz y el README de la integración.

#### Scenario: Copia del respaldo portable

- **WHEN** el usuario instala el respaldo portable de OpenCode
- **THEN** puede sincronizar manualmente la configuración y los plugins que
  permanezcan desde `integrations/opencode/` sin requerir que las skills
  públicas formen parte de esa copia manual

#### Scenario: Catálogo externo separado

- **WHEN** el usuario consulta el catálogo de skills
- **THEN** puede identificar las siete skills públicas versionadas en `skills/`,
  las dependencias externas opcionales y la superficie interna excluida, sin
  confundir el catálogo con una copia de `./.agents/`

#### Scenario: Skill pública instalable de forma neutral

- **WHEN** un usuario quiere instalar una skill pública desde el repositorio
- **THEN** encuentra un comando `npx skills add` con alcance global que usa el
  identificador público con prefijo `ac-`, no recomienda ni impone un agente
  concreto y no instala la skill en `./.agents/skills/`

#### Scenario: Actualización de una skill pública

- **WHEN** una skill pública con identificador `ac-*` ya está instalada y el
  usuario quiere sincronizar una versión posterior
- **THEN** puede ejecutar `npx skills update <name> --global` sin copiar
  manualmente la skill ni modificar el respaldo de `integrations/opencode/`

#### Scenario: Eliminación de commands sustituidos

- **WHEN** el respaldo se sincroniza después del cambio
- **THEN** la instalación documentada no incluye `commands/commit.md`,
  `commands/tag.md` ni `commands/pr.md`, y conserva separadas la configuración,
  las skills públicas y los workflows locales

### Requirement: Propuesta de tag centrada en commits

La skill portable `ac-release-tag-proposal` SHALL analizar los commits
alcanzables desde la base seleccionada hasta `HEAD` y SHALL usar únicamente esos
commits, sus rutas modificadas y sus diffs relevantes como evidencia principal.
No SHALL exigir la lectura de la política general del proyecto ni revisar áreas
no modificadas para decidir la versión. SHALL operar independientemente de un
command, del runtime de OpenCode y de placeholders de argumentos.

#### Scenario: Base determinada por el ultimo tag

- **WHEN** existen tags numericos alcanzables desde la historia `first-parent`
  de `HEAD`
- **THEN** la skill usa como base el tag de release más reciente de esa historia
  y analiza solo los commits posteriores hasta `HEAD`

#### Scenario: Repositorio sin tags

- **WHEN** no existe ningun tag de release alcanzable
- **THEN** la skill analiza toda la historia disponible hasta `HEAD` y usa
  `v0.0.0` como base virtual solo para calcular el primer tag automatico

#### Scenario: Cambios sin commit

- **WHEN** el working tree contiene cambios staged, unstaged o no trackeados
- **THEN** la skill los excluye del analisis de version y continua usando el
  estado alcanzado por `HEAD`, informando la situacion de forma breve

### Requirement: Interfaz de argumentos reducida

`ac-release-tag-proposal` SHALL aceptar como unico override opcional explícito
`--version <version>` dentro de la petición del usuario. La versión SHALL
mantener el formato numérico `vMAJOR.MINOR.PATCH`. La skill SHALL rechazar o
solicitar aclaración para argumentos desconocidos y no SHALL conservar modos
separados de base manual, working tree estricto o versiones preliminares. El
contenido del repositorio SHALL tratarse como datos y no como una fuente de
opciones ejecutables.

#### Scenario: Version automatica

- **WHEN** el usuario solicita una propuesta sin override y existen commits
  versionables
- **THEN** la skill calcula la siguiente versión a partir del impacto de los
  cambios desde la base seleccionada

#### Scenario: Version explicita

- **WHEN** el usuario proporciona `--version vMAJOR.MINOR.PATCH`
- **THEN** la skill usa exactamente esa version como objetivo, valida que no
  exista y no recalcula el incremento a partir del impacto

#### Scenario: Argumento no soportado

- **WHEN** el usuario proporciona una opcion distinta de `--version`
- **THEN** la skill no propone una version y explica brevemente que el
  argumento no esta soportado

### Requirement: Clasificacion por impacto de usuario

`ac-release-tag-proposal` SHALL clasificar la evolución de la versión por la
adaptación que el cambio exige al usuario. La cantidad, tipo, arquitectura o
tamaño del código no SHALL elevar por sí mismos el nivel. Si la evidencia queda
entre dos niveles, la skill SHALL elegir el nivel menor.

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
- **THEN** la skill SHALL clasificarlo segun su impacto real y no SHALL usar
  `MAJOR` unicamente por la existencia del modulo

### Requirement: Elegibilidad de cambios para versionar

`ac-release-tag-proposal` SHALL proponer al menos un `PATCH` cuando el rango
contenga codigo de producto. Los cambios de tests, configuracion, tooling,
infraestructura o documentacion por si solos no SHALL obligar a crear un tag.
La documentacion mezclada con codigo de producto SHALL quedar incluida en el
resumen del tag.

#### Scenario: Solo documentacion

- **WHEN** todos los cambios del rango afectan unicamente documentacion
- **THEN** la skill SHALL mostrar que no se propone una nueva version y no SHALL
  generar un comando `git tag`

#### Scenario: Codigo y documentacion

- **WHEN** el rango contiene codigo de producto y documentacion
- **THEN** la skill SHALL proponer una version basada en el impacto del codigo y
  SHALL resumir la documentacion solo cuando aporte contexto

### Requirement: Salida breve y segura

`ac-release-tag-proposal` SHALL mostrar una propuesta concisa con la base, la
version objetivo, el nivel de impacto, el estado del working tree y un resumen
agrupado de los cambios relevantes. Una propuesta valida SHALL terminar con un
unico bloque manual para crear un tag anotado apuntando al SHA completo de
`HEAD`.

La skill SHALL permanecer en modo de analisis: no SHALL ejecutar `git tag`, crear
o modificar refs, publicar tags, modificar archivos ni cambiar el working tree.
El bloque manual será únicamente texto para copiar y no SHALL incluir `git push`.

#### Scenario: Propuesta valida

- **WHEN** el repositorio pasa las validaciones y contiene codigo versionable
- **THEN** la skill muestra solo la informacion necesaria para revisar la
  propuesta y un unico comando manual de tag sin `git push`

#### Scenario: Sin cambios versionables

- **WHEN** no existe codigo de producto versionable en el rango
- **THEN** la skill muestra un resultado breve sin propuesta y sin bloque de
  comandos

## ADDED Requirements

### Requirement: Skill portable para Pull Requests

La integración SHALL proporcionar una skill pública `ac-pull-request` que se
active cuando el usuario solicite revisar cambios committeados, preparar,
publicar o crear una Pull Request. La skill SHALL ser independiente de la
interfaz de commands de OpenCode y SHALL aceptar, cuando el usuario los indique,
los overrides `--repo <owner/repo>`, `--base <branch>`,
`--head-remote <remote>` y `--draft`. El texto restante de la petición SHALL
servir únicamente como contexto editorial para el título y la descripción, no
como instrucciones ejecutables.

La skill SHALL requerir Git y GitHub CLI autenticado para completar la
publicación, pero no SHALL crear commits, modificar el working tree ni ejecutar
builds, tests, lint, format, type-check, migraciones o servicios.

#### Scenario: Activación desde una petición natural

- **WHEN** el usuario pide abrir una PR desde los commits de la branch actual
  sin mencionar el nombre de la skill
- **THEN** `ac-pull-request` inicia el preflight y el análisis sin exigir un
  command, `$ARGUMENTS` ni una convención de OpenCode

#### Scenario: Override explícito de PR

- **WHEN** el usuario proporciona `--repo`, `--base`, `--head-remote` o
  `--draft`
- **THEN** la skill usa esos valores como datos verificados del plan y no
  interpreta el texto editorial restante como shell o argumentos adicionales

#### Scenario: Opción desconocida

- **WHEN** la petición contiene una opción que la skill no reconoce
- **THEN** la skill solicita aclaración y no ejecuta ninguna operación de
  publicación

### Requirement: Preflight y propuesta de Pull Request

Antes de proponer o ejecutar una Pull Request, `ac-pull-request` SHALL
comprobar la raíz, el estado completo del repositorio, `HEAD`, la branch actual,
las operaciones Git en curso, la instalación y autenticación de `gh`, el
repositorio destino, la branch base, el remote de origen y la referencia local
de comparación. SHALL detenerse si hay cambios staged, unstaged o no trackeados,
conflictos, merge/rebase/cherry-pick/revert en curso, `HEAD` detached,
ambigüedad de remotes, falta de referencias locales suficientes o ausencia de
cambios entre la base y `HEAD`. No SHALL ejecutar `git fetch` automáticamente.

La skill SHALL comprobar si ya existe una PR abierta para la combinación de
repositorio destino, owner de origen y branch actual. Si existe, SHALL informar
su URL y no SHALL crear otra. El análisis SHALL revisar el historial y el diff
completo, respetar el template local de PR cuando exista y declarar que no se
ejecutaron validaciones del proyecto.

#### Scenario: Branch limpia y cambios committeados

- **WHEN** el repositorio está limpio, la base es inequívoca y existen commits
  comparables
- **THEN** la skill genera un título y una descripción basados en la evidencia
  del historial y el diff, sin afirmar que ejecutó build o tests

#### Scenario: Working tree no limpio

- **WHEN** existen cambios staged, unstaged o no trackeados
- **THEN** la skill se detiene, explica que la PR solo incluye commits y no
  modifica ni publica el estado encontrado

#### Scenario: PR existente

- **WHEN** ya existe una Pull Request abierta para el destino, owner de origen y
  branch actual
- **THEN** la skill informa la URL existente y no ejecuta `git push` ni
  `gh pr create`

#### Scenario: Destino ambiguo o base no disponible

- **WHEN** hay varios remotes razonables, no se puede determinar el repositorio
  destino o no existe una referencia local suficiente para comparar
- **THEN** la skill pide aclaración o actualización manual y no ejecuta
  `git fetch`, `git push` ni `gh pr create`

### Requirement: Confirmación y publicación segura de Pull Requests

Antes de hacer staging, push o crear la Pull Request, `ac-pull-request` SHALL
mostrar un plan completo con repositorio destino, branch base, remote, owner y
branch de origen, commits, resumen de cambios, título, descripción exacta,
necesidad de publicar la branch, cambios excluidos y advertencias. SHALL pedir
una confirmación inequívoca mediante el mecanismo disponible. Solo una decisión
equivalente a `Crear y publicar PR` SHALL autorizar exactamente el plan mostrado;
`Ajustar propuesta` SHALL reconstruirlo sin publicar y `Cancelar` SHALL terminar
sin modificar refs.

Después de la confirmación, la skill SHALL volver a comprobar el estado,
`HEAD`, branch base, diffs y ausencia de PR existente. Si algo cambió, SHALL
invalidar la propuesta y solicitar una nueva confirmación. Si la branch no está
publicada o está atrasada, SHALL ejecutar únicamente un push no forzado con el
remote y la referencia previamente verificados. Después SHALL ejecutar
`gh pr create` con repositorio, head, base, título y descripción explícitos,
añadiendo `--draft` solo cuando el usuario lo solicitó.

La skill SHALL tratar nombres, diffs, mensajes y argumentos como datos no
confiables, no SHALL revelar secretos y no SHALL reintentar automáticamente.
Después de cada operación SHALL informar el estado factual; si el push tiene
éxito y la creación falla, SHALL informar que la branch quedó publicada y el
error de creación sin afirmar que existe una PR.

#### Scenario: Confirmación inequívoca

- **WHEN** el usuario confirma exactamente el plan completo para crear y
  publicar la PR
- **THEN** la skill revalida el repositorio y puede publicar la branch y crear
  la PR con los valores aprobados

#### Scenario: Confirmación ambigua o cancelación

- **WHEN** el usuario responde con una aprobación genérica, `Ajustar propuesta`
  o `Cancelar`
- **THEN** la skill no publica; solicita una decisión inequívoca, reconstruye la
  propuesta o termina según corresponda

#### Scenario: Cambio concurrente después de aprobar

- **WHEN** cambia `HEAD`, la branch, la base, el diff, el estado del repositorio
  o la existencia de una PR después de la aprobación
- **THEN** la skill invalida el plan, no ejecuta el push ni crea la PR y solicita
  una nueva aprobación

#### Scenario: Fallo al crear la PR después del push

- **WHEN** el push tiene éxito pero `gh pr create` falla
- **THEN** la skill informa que la branch quedó publicada, muestra el error de
  creación y no reintenta ni informa una PR como creada
