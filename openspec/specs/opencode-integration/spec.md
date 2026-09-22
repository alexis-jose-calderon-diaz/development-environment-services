# opencode-integration Specification

## Purpose

Define el comportamiento seguro de la integración global de OpenCode al trabajar con cambios OpenSpec y sus límites frente a la configuración local de cada proyecto.

## Requirements

### Requirement: Ciclo de trabajo, preguntas y delegación portable

La guía portable SHALL establecer un ciclo operativo ordenado de revisión del
alcance, planificación, implementación, revisión, integración y finalización.
El ciclo SHALL poder volver a una fase anterior cuando una decisión, hallazgo,
validación o conflicto lo requiera. Cuando sea necesario formular una pregunta
al humano y exista una herramienta especializada disponible, SHALL utilizar esa
herramienta en lugar de formular la pregunta directamente en el texto.

En cada tarea SHALL intentar atomizar el trabajo en unidades cohesivas,
independientes y verificables. Antes de delegar, el orquestador SHALL reunir un
contexto proporcional que permita decidir si la delegación es apropiada,
incluyendo el objetivo, el alcance afectado, las dependencias conocidas, la
salida esperada y la validación necesaria. Solo SHALL delegar cuando pueda
justificar que la unidad está suficientemente delimitada, que puede ejecutarse
sin compartir la edición de un mismo archivo ni depender de resultados todavía
inexistentes, y que la coordinación aporta un beneficio verificable. La
delegación SHALL transportar alcance, exclusiones, contexto, restricciones,
criterios y validación suficientes. Si la información disponible no permite
tomar esa decisión, el agente SHALL inspeccionar primero la superficie
relevante o continuar directamente; no SHALL delegar únicamente porque haya
subagentes disponibles. Si no hay subagentes disponibles o la atomización no
aporta valor real, el trabajo puede continuar de forma directa y SHALL informar
brevemente el motivo.

Todas las respuestas, resúmenes, feedback, mensajes de commit y textos de Pull
Request dirigidos al humano SHALL estar en español. Los nombres técnicos,
identificadores, rutas, comandos y tokens normativos podrán conservar su forma
requerida.

#### Scenario: Ciclo completo con repetición

- **WHEN** una tarea requiere trabajo en varias fases
- **THEN** se ejecuta en el orden alcance, plan, implementación, revisión,
  integración y finalización, repitiendo las fases necesarias cuando la
  evidencia cambie el alcance o el resultado esperado

#### Scenario: Pregunta mediante herramienta especializada

- **WHEN** el agente necesita una respuesta, aclaración o confirmación del
  humano y existe una herramienta especializada disponible
- **THEN** realiza la pregunta mediante esa herramienta y no la presenta como
  una pregunta textual ordinaria

#### Scenario: Evaluación previa a delegar

- **WHEN** hay subagentes disponibles pero el contexto no permite decidir si una
  unidad es independiente, está delimitada o aporta un beneficio de
  coordinación
- **THEN** el agente no delega todavía, inspecciona la superficie relevante o
  continúa directamente con una justificación breve

#### Scenario: Delegación de unidades independientes

- **WHEN** el objetivo, el alcance, las dependencias, la salida y la validación
  de una unidad ya son suficientes para comprobar que la delegación es
  apropiada y la unidad es independiente y verificable
- **THEN** el agente delega con un prompt autocontenido, asigna un único
  responsable por archivo y conserva las dependencias entre unidades

#### Scenario: Trabajo directo justificado

- **WHEN** no hay subagentes disponibles, falta información para justificar una
  delegación o dividir la tarea añadiría coordinación sin beneficio verificable
- **THEN** el agente continúa directamente e informa el motivo sin crear
  coordinación artificial

#### Scenario: Idioma de salida

- **WHEN** el agente genera una respuesta, resumen, feedback, mensaje de commit
  o texto de Pull Request para el humano
- **THEN** usa español para el texto natural y conserva sin traducir los tokens
  técnicos necesarios

### Requirement: Guia portable agnostica de workflow

La configuracion portable SHALL limitar sus reglas obligatorias a herramientas disponibles, comportamiento, seguridad y convenciones generales de trabajo. No SHALL exigir una declaracion, identificador, snapshot, comando o protocolo perteneciente a un workflow externo para iniciar una tarea generica. Al ejecutar una tarea, SHALL priorizar la resolucion dentro del `workdir` efectivo y SHALL permitir el acceso externo solo cuando un recurso necesario no pueda obtenerse dentro de esa superficie. La guia y los contratos de agentes SHALL no imponer un formato general de rutas como condicion para trabajar.

#### Scenario: Tarea generica sin contexto externo

- **WHEN** un agente recibe una tarea ordinaria sin contexto de un workflow especifico
- **THEN** puede analizar, planificar, implementar o integrar respetando el objetivo y las restricciones recibidas, sin devolver `BLOCKED` por la ausencia de un identificador externo

#### Scenario: Toolkit instalado en otro proyecto

- **WHEN** la configuracion portable se aplica en un repositorio consumidor con sus propias reglas y workflows
- **THEN** las reglas del toolkit siguen siendo validas sin asumir una estructura de artifacts, una branch, una ruta de planificacion o un CLI del consumidor

#### Scenario: Resolucion prioritaria dentro del workdir

- **WHEN** los recursos disponibles dentro del `workdir` son suficientes para resolver la tarea
- **THEN** el agente trabaja con esa superficie sin buscar ni acceder externamente de forma innecesaria

#### Scenario: Recurso externo necesario

- **WHEN** un recurso necesario no esta disponible dentro del `workdir`
- **THEN** el agente puede acceder al recurso externo concreto, limita la operacion a lo necesario, explica el motivo y no amplia por ello el `Scope` autorizado para modificar archivos

#### Scenario: Rutas adecuadas al contexto

- **WHEN** una herramienta o un resultado requiere representar una ruta
- **THEN** el agente usa el formato valido para esa herramienta y contexto, sin bloquear la tarea unicamente por no usar rutas relativas

### Requirement: Contexto estructurado para delegacion

El orquestador SHALL entregar a cada sub-agente un prompt autocontenido y proporcional a la tarea, usando cuando sean relevantes las secciones `Objective`, `Scope`, `Out of Scope`, `Repository Context`, `Relevant Files`, `Existing Behavior`, `Desired Behavior`, `Constraints`, `Decisions Already Made`, `Dependencies`, `Acceptance Criteria` y `Verification`. SHALL transportar hechos, decisiones, dependencias y criterios verificables, y SHALL omitir historiales, informes completos y contenido irrelevante.

#### Scenario: Delegacion con alcance definido

- **WHEN** el orquestador delega una subtarea a un agente
- **THEN** el agente recibe el objetivo, los archivos o areas autorizados, las exclusiones, las restricciones y las condiciones de terminado necesarias para actuar sin reconstruir la conversacion previa

#### Scenario: Contexto innecesario o historico

- **WHEN** los resultados de agentes anteriores contienen razonamientos o detalles que no condicionan la subtarea siguiente
- **THEN** el orquestador conserva solo las conclusiones, decisiones y dependencias relevantes en el prompt delegado

### Requirement: Skills portables de análisis y planificación

La superficie pública SHALL proporcionar skills independientes y autosuficientes para analizar el impacto de un cambio y preparar un plan de ejecución. `ac-change-impact-analysis` SHALL operar en modo read-only, identificar la superficie directamente relevante, riesgos, consumidores y complejidad, y distinguir hechos confirmados de incertidumbres. `ac-change-planning` SHALL poder iniciar su propia inspección proporcional cuando el usuario pida un plan y SHALL producir unidades, dependencias, modos de ejecución y validaciones sin exigir un informe interno de otro agente.

#### Scenario: Análisis de impacto solicitado por el usuario

- **WHEN** el usuario pide evaluar el impacto, alcance o riesgos de un cambio antes de implementarlo
- **THEN** `ac-change-impact-analysis` devuelve un análisis fundamentado en el repositorio actual sin modificar archivos

#### Scenario: Plan solicitado sin contexto de orquestador

- **WHEN** el usuario pide un plan técnico para una tarea y no proporciona un `Analysis Report` previo
- **THEN** `ac-change-planning` inspecciona el contexto mínimo necesario y devuelve un plan verificable sin bloquear por la ausencia de una delegación previa

#### Scenario: Tarea pequeña

- **WHEN** la tarea no obtiene beneficio real de dividirse
- **THEN** la skill de planificación recomienda una única unidad en lugar de crear coordinación artificial

### Requirement: Skills portables de revisión e integración

La superficie pública SHALL proporcionar una skill para revisar cambios contra un objetivo y sus criterios, y una skill para auditar fronteras de integración. `ac-change-review` SHALL ser read-only por contrato, priorizar incumplimientos con evidencia y distinguir hallazgos confirmados, incertidumbres, riesgos residuales y brechas de pruebas. `ac-integration-boundary-audit` SHALL limitarse a comprobar coherencia entre módulos, contratos, consumidores, persistencia, salidas generadas y tests; no SHALL aplicar correcciones automáticamente.

#### Scenario: Revisión contra criterios

- **WHEN** el usuario pide revisar un diff o una implementación con un objetivo y criterios disponibles
- **THEN** `ac-change-review` informa hallazgos accionables con ubicación, evidencia, impacto y recomendación, sin editar archivos

#### Scenario: Revisión sin workflow formal

- **WHEN** el usuario pide una revisión genérica sin especificación OpenSpec
- **THEN** `ac-change-review` usa el objetivo, el alcance y la evidencia disponible sin exigir un identificador o workflow externo

#### Scenario: Auditoría de fronteras

- **WHEN** el usuario pide verificar que varias piezas de un cambio distribuido encajan entre sí
- **THEN** `ac-integration-boundary-audit` comprueba únicamente las fronteras relevantes y marca como no verificadas las que carecen de evidencia suficiente

#### Scenario: Problema que requiere una decisión de diseño

- **WHEN** una incompatibilidad no puede resolverse sin cambiar una decisión pública o ampliar el alcance
- **THEN** la auditoría informa el bloqueo y no modifica archivos ni inventa una corrección

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

### Requirement: Agentes de rol reutilizables

La integración portable SHALL dejar de proporcionar agentes personalizados para analizar, planificar, implementar, revisar e integrar. En su lugar, SHALL proporcionar skills públicas autosuficientes para los flujos de análisis de impacto, planificación, revisión y auditoría de integración. Esas skills SHALL operar sobre la petición del usuario y el estado actual del repositorio, sin depender de un prompt de orquestador, un informe interno previo, un identificador externo o un `Scope` delegado implícito.

Las skills de análisis y revisión SHALL conservar la disciplina de contexto mínimo, alcance, evidencia, validación y riesgos. La auditoría de integración SHALL ser read-only y no SHALL sustituir la coordinación de ownership que antes correspondía a un agente delegado.

#### Scenario: Flujo de análisis sin agente personalizado

- **WHEN** los agentes portables personalizados no están instalados
- **THEN** el usuario puede cargar una skill pública para analizar el cambio y obtener un informe basado en el contexto disponible

#### Scenario: Flujo de revisión genérica

- **WHEN** `ac-change-review` recibe un objetivo, un alcance, criterios de aceptación y un diff sin una especificación externa
- **THEN** identifica hallazgos concretos contra ese contexto y devuelve su informe sin bloquear por la ausencia de un workflow formal

#### Scenario: Flujo de integración sin corrección automática

- **WHEN** `ac-integration-boundary-audit` encuentra una incompatibilidad concreta
- **THEN** informa la frontera, la evidencia, el impacto y la acción recomendada sin editar archivos

### Requirement: Separación de configuraciones local y global

La documentación del repositorio SHALL explicar que el `AGENTS.md` raíz y la
configuración del proyecto consumidor pertenecen a ese proyecto, mientras
`integrations/` contiene el respaldo versionado de la configuración portable
que se instala manualmente bajo `~/.config/opencode/`. SHALL distinguir la
superficie pública de skills versionadas bajo `skills/` de la superficie interna
`./.agents/`, que no forma parte del catálogo público ni de la instalación
documentada. Los README activos SHALL quedar limitados a su propio scope: el
README raíz SHALL ofrecer la visión general del repositorio y documentar la
integración portable que no tiene README hijo; un README dentro de una carpeta
SHALL ser la fuente de los detalles operativos de esa carpeta, y el README
padre SHALL enlazarlo sin duplicar su contenido. La documentación SHALL
distinguir los commands globales de OpenCode que puedan existir en un consumidor
de los workflows locales del proyecto y SHALL evitar instrucciones que mezclen
ambas superficies. Los README activos SHALL no catalogar, enlazar ni incluir
comandos de instalación de skills de terceros.

El respaldo SHALL usar nombres que no sean descubiertos automáticamente como
reglas o configuración: `integrations/agents-global.md` para las reglas y
`integrations/opencode-config.jsonc` para la configuración. La carpeta
`integrations/opencode/` SHALL dejar de existir. La documentación SHALL indicar
que se copian manualmente como `~/.config/opencode/AGENTS.md` y
`~/.config/opencode/opencode.jsonc`, respectivamente. `agents-global.md` SHALL
limitarse a reglas generales de su propio scope, ser agnóstico de ubicación y
no asumir una política local, una instalación operativa ni un repositorio
consumidor concreto.

El README de la integración SHALL dejar de existir como fuente documental
separada. El README raíz SHALL contener el propósito, inventario, instalación,
comparación, sincronización, migración y límites de esta integración. La
documentación SHALL dejar de presentar recursos retirados o superficies locales
como parte de la copia manual.

#### Scenario: Consulta de la guía de integración

- **WHEN** un usuario consulta el `README.md` raíz o el `AGENTS.md` raíz
- **THEN** puede identificar el propósito, los nombres de respaldo, los
  destinos operativos, la relación y los límites de las superficies sin
  depender de `integrations/opencode/README.md`

#### Scenario: Alcance documental de una carpeta hija

- **WHEN** un usuario necesita instrucciones específicas de `services/` o
  `skills/`
- **THEN** el README raíz enlaza el README hijo correspondiente y el README
  hijo contiene los detalles de su scope sin exigir que el README raíz los
  repita

#### Scenario: Aplicación aislada de las reglas del toolkit

- **WHEN** `integrations/agents-global.md` se encuentra bajo `integrations/`
  junto a la configuración portable de su scope
- **THEN** sus reglas se mantienen válidas sin depender de una ruta de
  instalación, un repositorio consumidor, una estructura de workflows o una
  política local concreta

#### Scenario: Respaldo no descubierto automáticamente

- **WHEN** OpenCode o un agente busca sus nombres convencionales dentro del
  repositorio
- **THEN** no carga `agents-global.md` como reglas ni
  `opencode-config.jsonc` como configuración operativa

#### Scenario: Instalación con nombres operativos

- **WHEN** el usuario sincroniza manualmente la configuración portable
- **THEN** copia `integrations/agents-global.md` a
  `~/.config/opencode/AGENTS.md` y `integrations/opencode-config.jsonc` a
  `~/.config/opencode/opencode.jsonc`, preservando separadas las reglas del
  proyecto consumidor

#### Scenario: Instalación portable sin commands sustituidos

- **WHEN** el usuario sincroniza manualmente la configuración portable
- **THEN** copia únicamente los recursos de configuración y plugins que
  permanezcan en `integrations/`, instala las skills públicas por separado,
  conserva separadas las reglas y configuraciones del proyecto consumidor y no
  copia `./.agents/`

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
la actualización mediante `npx skills update <name> --global` y excluir
explícitamente `./.agents/` de esta superficie. `skills/README.md` SHALL
concentrarse en las skills públicas versionadas y SHALL omitir catálogos,
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
- **THEN** puede identificar las siete skills públicas versionadas, sus límites
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

### Requirement: English-first language for public skill content

Each public `skills/<name>/SKILL.md` SHALL use English as the default authoring language for explanatory prose, frontmatter descriptions, headings, instructions, and output templates. The public catalog `skills/README.md` MAY remain Spanish. Skill names, commands, identifiers, status values, required section labels, and other language-independent contract tokens MAY retain their established form.

#### Scenario: Public skill content is standardized

- **WHEN** a user or maintainer reads any of the seven versioned skill definitions
- **THEN** the explanatory content is consistently written in English without changing the skill names, installation commands, safety boundaries, or behavioral contracts

#### Scenario: Public catalog language is preserved

- **WHEN** a user or maintainer reads `skills/README.md`
- **THEN** the catalog remains in Spanish and its documented names, commands, and surface boundaries are unchanged

#### Scenario: Language-independent contract tokens are preserved

- **WHEN** the content is translated or normalized
- **THEN** CLI commands, paths, identifiers, Conventional Commits types, status values, and required machine-readable section labels retain the exact forms needed for operation and validation

### Requirement: Consistent default language for generated skill responses

Public skills SHALL generate natural-language responses in the user's explicitly requested language when one is provided. When the request does not establish a language, the skills SHALL use English by default. This language policy SHALL NOT alter language-independent tokens or safety and workflow requirements.

#### Scenario: User requests a non-English response

- **WHEN** the user explicitly asks to use a particular language for the skill response
- **THEN** the natural-language response uses that language while preserving required identifiers, commands, status values, and normative tokens

#### Scenario: User does not specify a response language

- **WHEN** the user invokes a public skill without establishing a response language
- **THEN** the natural-language response is written in English

#### Scenario: Existing language-specific output contract remains compatible

- **WHEN** a skill produces Conventional Commits text or another structured output with language-independent fields
- **THEN** only the natural-language portions follow the selected language and the required type, field names, commands, and structural markers remain unchanged

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
  SHALL generar un comando `git tag`

#### Scenario: Codigo y documentacion

- **WHEN** el rango contiene codigo de producto y documentacion
- **THEN** la skill SHALL proponer una version basada en el impacto del codigo y
  y SHALL resumir la documentacion solo cuando aporte contexto

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
  command, placeholders de argumentos ni una convención de OpenCode

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

### Requirement: Skill portable para commits agrupados

La integración SHALL proporcionar una skill versionada que pueda activarse cuando
el usuario pida revisar, agrupar, separar, organizar o crear una propuesta de
commits lógicos a partir de cambios Git. La skill SHALL analizar el repositorio
actual y preparar una propuesta completa, pero SHALL permanecer exclusivamente
en modo read-only: no SHALL solicitar aprobación interactiva, modificar el
index, crear commits ni ejecutar otra operación de escritura. SHALL ser
independiente de la interfaz de invocación y no SHALL requerir placeholders,
frontmatter adicional ni herramientas específicas de un proveedor.

#### Scenario: Activación por una petición de commits agrupados

- **WHEN** el usuario pide revisar cambios y crear commits agrupados, aunque no
  mencione el nombre de la skill
- **THEN** la skill analiza el repositorio actual y devuelve únicamente una
  propuesta completa sin depender de un command o de argumentos de OpenCode

#### Scenario: Petición de separación de cambios

- **WHEN** el usuario pide separar cambios en commits lógicos o limpiar la
  organización del working tree
- **THEN** la skill activa el mismo flujo de análisis y propuesta sin pedir una
  decisión ni ejecutar escrituras

#### Scenario: Solicitud posterior de creación

- **WHEN** el usuario pide posteriormente generar los commits a partir de la
  propuesta
- **THEN** esta skill no ejecuta la solicitud y termina en modo propuesta; la
  creación debe gestionarse mediante otro flujo o instrucción explícita fuera de
  esta skill

#### Scenario: Ausencia de una skill externa

- **WHEN** la skill externa `git-commit` no está instalada
- **THEN** la skill puede preparar propuestas aplicando sus propias reglas
  mínimas de Conventional Commits, agrupación y seguridad

### Requirement: Selección segura del alcance y agrupación

La skill SHALL inspeccionar primero la raíz, `HEAD`, branch, upstream, estado,
operaciones Git en curso, index, working tree, rutas no trackeadas y cambios
relevantes del repositorio. Si el repositorio no tiene `HEAD`, está detached,
contiene conflictos o tiene una operación de merge, rebase, cherry-pick o revert
en curso, SHALL detenerse antes de escribir y explicar el bloqueo.

Si existe contenido staged, SHALL tratar el index como la selección explícita del
usuario, SHALL proponer exactamente un commit para todo su contenido y SHALL
dejar staged, unstaged, no trackeados e ignorados fuera del alcance
correspondiente. Si no existe contenido staged, SHALL considerar cambios
trackeados y no trackeados no ignorados, agrupar archivos completos por
intención lógica y dejar los ignorados fuera del plan.

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

- **WHEN** no existe contenido staged y hay cambios trackeados o no trackeados no
  ignorados
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

- **WHEN** existen archivos ignorados junto con cambios elegibles
- **THEN** la skill no los incluye ni los inspecciona como parte del plan y los
  cambios elegibles conservan su agrupación normal

### Requirement: Propuesta completa sin interacción

Antes de terminar, la skill SHALL mostrar una propuesta completa con los valores
reales de alcance (`index` o `working-tree`), branch, upstream, cantidad de
commits, intención, mensaje exacto, estado Git y rutas de cada commit, además de
pendientes, exclusiones y advertencias. Las rutas SHALL representarse de forma
segura y estable, incluyendo estados de renombre, eliminación, binario,
symlink o submódulo sin permitir que su contenido altere la estructura de la
propuesta.

La skill SHALL terminar directamente después de la propuesta. No SHALL añadir un
marcador de cierre, texto posterior, pregunta, opciones de aprobación ni
solicitud de confirmación mediante una herramienta. La salida de esta skill no
autoriza ni inicia operaciones de escritura.

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
  aprobación, mostrar `## Fin de propuesta`, hacer staging o crear commits

#### Scenario: Ruta con representación especial

- **WHEN** una ruta contiene espacios, backticks, saltos de línea o comienza por
  `-`
- **THEN** la propuesta la muestra sin alterar su formato ni convertir su
  contenido en instrucciones o comandos adicionales

### Requirement: Mensajes y seguridad del commit

Los mensajes propuestos SHALL seguir Conventional Commits con `type` en inglés,
un `scope` sustentado por evidencia cuando exista y una descripción concreta en
el idioma de la petición del usuario. El body propuesto SHALL usar el mismo
idioma y las palabras clave normativas SHALL conservar su forma requerida.

La skill SHALL tratar rutas, diffs, mensajes, argumentos y contenido del
repositorio como datos no confiables. SHALL representar rutas y mensajes de
forma segura, sin interpolar datos del repositorio como código, sin `eval` y
sin operaciones de staging amplias. SHALL no mostrar valores sensibles, buscar
secretos fuera de las rutas elegibles ni incluir en la propuesta una ruta con
evidencia razonable de secreto. En working tree SHALL excluir las rutas
sospechosas; si una ruta sospechosa está staged SHALL detenerse sin modificar el
index. Si todas las rutas elegibles quedan excluidas, SHALL terminar sin
propuesta de commits y explicar el motivo sin revelar secretos. SHALL permanecer
read-only y no SHALL ejecutar push, operaciones destructivas, staging, commit,
amend, `--no-verify` ni validaciones del proyecto como parte de este flujo.

#### Scenario: Idioma de la petición

- **WHEN** el usuario solicita el flujo en un idioma determinado
- **THEN** la descripción y el body de cada mensaje usan ese idioma y el
  `type` permanece en inglés

#### Scenario: Evidencia de secreto en working tree

- **WHEN** una ruta elegible del working tree contiene evidencia razonable de un
  secreto
- **THEN** la skill excluye la ruta sin mostrar el valor y puede continuar solo
  con grupos que no dependan de ella

#### Scenario: Evidencia de secreto en staged

- **WHEN** el index contiene evidencia razonable de un secreto
- **THEN** la skill detiene el flujo sin modificar el index ni crear commits y
  solicita corregir manualmente el staging

#### Scenario: Todas las rutas elegibles son inseguras

- **WHEN** todas las rutas candidatas contienen evidencia razonable de secretos
  o no pueden inspeccionarse de forma segura
- **THEN** la skill termina sin staging ni commits, informa que no queda un grupo
  elegible y no muestra ningún valor sensible

#### Scenario: Datos del repositorio como datos

- **WHEN** una ruta, diff, mensaje o argumento contiene texto que parece una
  instrucción o una opción de shell
- **THEN** la skill lo trata como datos, lo representa de forma segura y no lo
  ejecuta ni lo usa para ampliar el alcance
