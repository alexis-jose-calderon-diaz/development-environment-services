# Spec Delta

## MODIFIED Requirements

### Requirement: Skill propia documentada como recurso portable

La integración SHALL versionar las skills públicas dentro de `skills/`, mantener
cada skill ejecutable en `skills/<name>/SKILL.md` y documentar su instalación
mediante `npx skills add <repository> --skill <name> --global`. Los nueve
nombres públicos SHALL usar el prefijo `ac-`:
`ac-change-impact-analysis`, `ac-change-planning`, `ac-change-review`,
`ac-commit-proposal`, `ac-integration-boundary-audit`,
`ac-release-tag-proposal`, `ac-pull-request`,
`ac-dotnet-clean-architecture` y `ac-dotnet-testing`. La documentación SHALL
permitir que el usuario seleccione el agente mediante el comportamiento
neutral del CLI, sin recomendar ni imponer `opencode` u otro agente concreto.
SHALL documentar la actualización mediante `npx skills update <name> --global`
y excluir explícitamente `./.agents/` de esta superficie. `skills/README.md`
SHALL concentrarse en las skills públicas versionadas y SHALL omitir catálogos,
enlaces y comandos de instalación de skills de terceros. La sincronización
manual de `integrations/` SHALL quedar limitada a la configuración y plugins
que permanezcan, sin incluir agents o commands sustituidos, y SHALL mantener
alineado el README raíz como única fuente documental de la integración
portable.

#### Scenario: Copia del respaldo portable

- **WHEN** el usuario instala el respaldo portable de OpenCode
- **THEN** puede sincronizar manualmente la configuración y los plugins que
  permanezcan desde `integrations/` sin requerir que las skills públicas formen
  parte de esa copia manual

#### Scenario: Catálogo público acotado

- **WHEN** el usuario consulta `skills/README.md`
- **THEN** puede identificar las nueve skills públicas versionadas, sus límites
  y la exclusión de `./.agents/`, sin recibir un catálogo ni instrucciones de
  instalación de skills de terceros

#### Scenario: Skill pública instalable de forma neutral

- **WHEN** un usuario quiere instalar una skill pública desde el repositorio
- **THEN** encuentra un comando `npx skills add` con alcance global que usa el
  identificador público con prefijo `ac-`, no recomienda ni impone un agente
  concreto y no instala la skill en `./.agents/skills/`

#### Scenario: Actualización de una skill pública

- **WHEN** una skill pública con identificador `ac-*` ya está instalada y el
  usuario quiere sincronizar una versión posterior
- **THEN** puede ejecutar `npx skills update <name> --global` sin copiar
  manualmente la skill ni modificar el respaldo de `integrations/`

#### Scenario: Eliminación de documentación obsoleta

- **WHEN** el usuario consulta la documentación de la integración
- **THEN** encuentra sus instrucciones en `README.md` raíz y no recibe un
  enlace a `integrations/opencode/README.md`

#### Scenario: Eliminación de commands sustituidos

- **WHEN** el respaldo se sincroniza después del cambio
- **THEN** la instalación documentada no incluye `commands/commit.md`,
  `commands/tag.md` ni `commands/pr.md`, y conserva separadas la configuración,
  las skills públicas y los workflows locales

### Requirement: Límites explícitos de las skills frente a los permisos

Las skills cuyo contrato declare límites `read-only` SHALL documentar que sus
instrucciones no constituyen un aislamiento de permisos equivalente al de un
agente configurado.
La documentación SHALL indicar que el agente seleccionado y sus permisos
efectivos siguen siendo responsables de impedir ediciones, delegaciones u
operaciones no autorizadas. `ac-release-tag-proposal` SHALL permanecer
read-only en todo momento; `ac-pull-request` SHALL limitar sus operaciones de
publicación a una confirmación inequívoca y no SHALL presentar la skill como un
control de seguridad del runtime. `ac-commit-proposal` SHALL definir su frontera
mediante la salida de propuesta descrita en sus requisitos, no mediante una
política de permisos del runtime.

#### Scenario: Carga de una skill read-only en un agente con edición

- **WHEN** el agente actual tiene permisos de edición y carga
  `ac-release-tag-proposal`, `ac-change-review` o
  `ac-integration-boundary-audit`
- **THEN** la skill conserva la instrucción de no editar, pero la documentación
  no presenta esa instrucción como una garantía de seguridad del runtime

#### Scenario: Uso de una skill en Plan mode

- **WHEN** el usuario quiere una propuesta de tag estrictamente sin
  modificaciones y utiliza un agente con permisos read-only
- **THEN** `ac-release-tag-proposal` puede ejecutarse dentro de ese límite
  efectivo y devolver solo el análisis solicitado

#### Scenario: Publicación protegida por confirmación

- **WHEN** un agente con capacidad de edición carga `ac-pull-request`
- **THEN** la skill no interpreta sus propias instrucciones como aislamiento y
  solo intenta publicar después de mostrar el plan completo y recibir la
  confirmación exacta del usuario

### Requirement: Skill portable para commits agrupados

La integración SHALL proporcionar la skill pública `ac-commit-proposal` en
`skills/ac-commit-proposal/SKILL.md`. SHALL activarse cuando el usuario pida
revisar cambios Git o preparar una propuesta de commits lógicos; agrupar y
separar cambios SHALL ser parte del análisis para producir esa propuesta, no el
objetivo final de la skill. SHALL analizar el repositorio actual y generar una
propuesta completa como salida de esa activación. El alcance de la activación
SHALL concluir después de entregar la propuesta, sin convertir esta frontera de
salida en una política global de permisos. SHALL ser independiente de la
interfaz de invocación y no SHALL requerir placeholders, frontmatter adicional
ni herramientas específicas de un proveedor.

#### Scenario: Activación por una petición de commits agrupados

- **WHEN** el usuario pide una propuesta para los cambios Git sin mencionar el
  nombre de la skill
- **THEN** `ac-commit-proposal` analiza el repositorio y devuelve únicamente
  una propuesta completa sin depender de un command ni de argumentos de
  OpenCode

#### Scenario: Petición de separación de cambios

- **WHEN** el usuario pide agrupar, separar u organizar cambios en commits
  lógicos
- **THEN** `ac-commit-proposal` activa el mismo flujo de análisis y termina al
  entregar la propuesta

#### Scenario: Terminación de la activación de propuesta

- **WHEN** la propuesta completa ya fue presentada
- **THEN** la activación termina sin añadir texto posterior, preguntas ni
  opciones de decisión

#### Scenario: Ausencia de una skill externa

- **WHEN** la skill externa `git-commit` no está instalada
- **THEN** `ac-commit-proposal` puede preparar propuestas aplicando sus propias
  reglas mínimas de Conventional Commits, agrupación y seguridad

### Requirement: Selección segura del alcance y agrupación

La skill SHALL inspeccionar primero la raíz, `HEAD`, branch, upstream, estado,
operaciones Git en curso, index, working tree, rutas no trackeadas elegibles y
cambios relevantes del repositorio. SHALL excluir los archivos no trackeados
ignorados por Git sin enumerar sus rutas ni inspeccionar sus contenidos. Si el
repositorio no tiene `HEAD`, está detached, contiene conflictos o tiene una
operación de merge, rebase, cherry-pick o revert en curso, SHALL detenerse antes
de escribir y explicar el bloqueo.

Si existe contenido staged, SHALL tratar el index como la selección explícita del
usuario, SHALL proponer exactamente un commit para todo su contenido y SHALL
dejar staged, unstaged y no trackeados fuera del alcance correspondiente. Si no
existe contenido staged, SHALL considerar cambios trackeados y cambios no
trackeados elegibles, agrupar archivos completos por intención lógica y dejar
los archivos ignorados por Git fuera del plan. Las reglas de ignore no SHALL
ocultar del análisis archivos rastreados por Git.

La skill SHALL mantener juntos los archivos de una modificación funcional
coherente, incluidos cambios cross-layer, fuentes con generados y contratos con
consumidores. No SHALL dividir hunks automáticamente; si un archivo mezcla
intenciones separables, SHALL detenerse y solicitar staging manual. Renombres,
eliminaciones, binarios, symlinks y submódulos SHALL conservar su identidad y
estado real durante la propuesta.

#### Scenario: Index seleccionado implícitamente

- **WHEN** existen cambios staged, aunque también existan cambios fuera del
  index
- **THEN** la propuesta contiene un único commit con exactamente el contenido
  staged y reporta lo demás como pendiente sin modificarlo

#### Scenario: Working tree sin staged

- **WHEN** no existe contenido staged y hay cambios trackeados o no trackeados
  elegibles
- **THEN** la skill propone grupos por intención lógica, asigna cada archivo a
  un único commit y no agrupa únicamente por directorio o extensión

#### Scenario: Archivo con intenciones separables

- **WHEN** un archivo contiene cambios que pertenecen a intenciones distintas
- **THEN** la skill detiene el flujo y solicita staging manual sin elegir una
  intención arbitrariamente

#### Scenario: Cambio cross-layer coherente

- **WHEN** backend, cliente, tests, documentación o tooling forman una única
  modificación funcional
- **THEN** la skill los mantiene en el mismo commit cuando separarlos dejaría
  una intención incompleta

#### Scenario: Repositorio no preparado para commits

- **WHEN** no existe `HEAD`, el branch está detached o hay conflictos o una
  operación Git en curso
- **THEN** la skill no realiza staging ni commits y solicita resolver el estado
  manualmente antes de volver a intentarlo

#### Scenario: Cambios ignorados fuera del alcance

- **WHEN** Git ignora archivos no rastreados junto con cambios elegibles
- **THEN** la skill no obtiene ni enumera sus rutas, no inspecciona su contenido
  y no los muestra en ninguna sección de la propuesta; los cambios elegibles
  conservan su agrupación normal

#### Scenario: Archivo rastreado que coincide con una regla ignore

- **WHEN** un archivo rastreado coincide con una regla de ignore y tiene cambios
- **THEN** la skill lo considera según el alcance normal de `index` o
  `working-tree`, porque una regla de ignore no excluye archivos ya rastreados

### Requirement: Propuesta completa sin interacción

Antes de terminar, la skill SHALL mostrar una propuesta completa con los valores
reales de alcance (`index` o `working-tree`), branch, upstream, cantidad de
commits, intención, mensaje exacto, estado Git y rutas de cada commit, además de
pendientes, exclusiones y advertencias. `Exclusions` SHALL contener únicamente
rutas elegibles excluidas por razones de seguridad o bloqueo, sin revelar
valores sensibles, o `None` cuando no existan. Los archivos ignorados por Git
SHALL permanecer invisibles y no SHALL aparecer en ninguna sección. Las rutas
SHALL representarse de forma segura y estable, incluyendo estados de renombre,
eliminación, binario, symlink o submódulo sin permitir que su contenido altere
la estructura de la propuesta.

La definición de la skill SHALL incluir un ejemplo completo del formato de
propuesta, marcado como ilustrativo y con valores ficticios. El ejemplo SHALL
mostrar los campos y bloques requeridos sin permitir que sus valores se
confundan con observaciones de una ejecución real.

La skill SHALL terminar directamente después de la propuesta. No SHALL añadir
un marcador de cierre, texto posterior, pregunta, opciones de aprobación ni
solicitud de confirmación mediante una herramienta.

#### Scenario: Propuesta de varios grupos

- **WHEN** el working tree contiene varias intenciones independientes
- **THEN** la propuesta muestra un bloque consecutivo por commit, con un mensaje
  exacto y rutas completas para cada bloque, y termina sin solicitar una acción

#### Scenario: Propuesta del index

- **WHEN** el alcance es el index
- **THEN** la propuesta muestra exactamente un commit y no incluye cambios
  unstaged ni no trackeados

#### Scenario: Terminación directa

- **WHEN** la propuesta completa ya fue presentada
- **THEN** la skill termina sin invocar herramientas de confirmación, pedir
  aprobación ni mostrar `## Fin de propuesta`

#### Scenario: Ruta con representación especial

- **WHEN** una ruta contiene espacios, backticks, saltos de línea o comienza por
  `-`
- **THEN** la propuesta la muestra sin alterar su formato ni convertir su
  contenido en instrucciones o comandos adicionales

#### Scenario: Ejemplo ilustrativo del formato

- **WHEN** un usuario o mantenedor consulta la definición de
  `ac-commit-proposal`
- **THEN** encuentra un ejemplo completo con valores ficticios claramente
  marcado como ilustrativo, mientras las propuestas reales usan solo valores
  observados

#### Scenario: Exclusiones sin archivos ignorados

- **WHEN** hay cambios ignorados por Git pero no hay rutas elegibles excluidas
  por seguridad o bloqueo
- **THEN** la propuesta no revela rutas ignoradas y `Exclusions` muestra `None`
