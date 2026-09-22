# Spec Delta

## MODIFIED Requirements

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
