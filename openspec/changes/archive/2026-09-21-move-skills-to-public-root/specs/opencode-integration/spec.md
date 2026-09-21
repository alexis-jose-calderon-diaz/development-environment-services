# Spec Delta

## MODIFIED Requirements

### Requirement: Separación de configuraciones local y global

La documentación del repositorio, principalmente el `README.md` de la
integración y el `AGENTS.md` raíz cuando corresponda, SHALL explicar que el
`AGENTS.md` raíz y la configuración del proyecto consumidor pertenecen a ese
proyecto, mientras `integrations/opencode/` contiene el respaldo versionado de
la configuración portable que se instala manualmente bajo
`~/.config/opencode/`. SHALL distinguir también la superficie pública de skills
versionadas bajo `skills/`, las dependencias externas gestionadas por el CLI
`skills` y la superficie interna `./.agents/`, que no forma parte del catálogo
público ni de la instalación documentada. SHALL distinguir los comandos globales
de OpenCode de los workflows locales del proyecto y SHALL evitar instrucciones
que mezclen ambas superficies. El `integrations/opencode/AGENTS.md` SHALL
limitarse a reglas aplicables a los recursos dentro de su propio scope, ser
agnóstico de ubicación y no asumir que es una política global, una instalación
operativa o parte de un repositorio consumidor concreto.

#### Scenario: Consulta de la guia de integracion

- **WHEN** un usuario consulta el `README.md` de la integración o el
  `AGENTS.md` raíz
- **THEN** puede identificar el propósito, la ubicación operativa, la relación
  y los límites de `integrations/opencode/`, `skills/` y `./.agents/` sin
  interpretar la superficie interna como un recurso público

#### Scenario: Aplicacion aislada de las reglas del toolkit

- **WHEN** el `integrations/opencode/AGENTS.md` se aplica bajo cualquier
  ubicación que contenga sus recursos de scope
- **THEN** sus reglas se mantienen válidas sin depender de una ruta de
  instalación, un repositorio consumidor, una estructura de workflows o una
  política local concreta

#### Scenario: Instalacion portable sin alterar el proyecto

- **WHEN** el usuario sincroniza manualmente la configuración portable
- **THEN** copia únicamente los recursos documentados de
  `integrations/opencode/` hacia `~/.config/opencode/`, conserva separadas las
  reglas y configuraciones del proyecto consumidor y no copia `./.agents/`

### Requirement: Skill propia documentada como recurso portable

La integración SHALL versionar las skills públicas dentro de `skills/`,
mantener cada skill ejecutable en `skills/<name>/SKILL.md` y documentar su
instalación mediante `npx skills add <repository> --skill <name> --global`.
La documentación SHALL permitir que el usuario seleccione los agentes mediante
el comportamiento neutral del CLI, sin recomendar ni imponer `opencode` u otro
agente concreto. SHALL documentar la actualización mediante
`npx skills update <name> --global`, distinguir las skills públicas de las
dependencias externas opcionales y excluir explícitamente `./.agents/` de esta
superficie. La sincronización manual de `integrations/opencode/` SHALL seguir
limitada a su configuración, agents, commands y plugins, y SHALL mantener
alineados el README raíz y el README de la integración.

#### Scenario: Skill pública instalable de forma neutral

- **WHEN** un usuario quiere instalar una skill pública desde el repositorio
- **THEN** encuentra un comando `npx skills add` con alcance global que no
  recomienda ni impone un agente concreto y no instala la skill en
  `./.agents/skills/`

#### Scenario: Actualización de una skill pública

- **WHEN** una skill pública ya está instalada y el usuario quiere sincronizar
  una versión posterior
- **THEN** puede ejecutar `npx skills update <name> --global` sin copiar
  manualmente la skill ni modificar el respaldo de `integrations/opencode/`

#### Scenario: Catálogo externo separado

- **WHEN** el usuario consulta el catálogo de skills
- **THEN** puede identificar las skills públicas versionadas en `skills/`, las
  dependencias externas opcionales y la superficie interna excluida, sin
  confundir el catálogo con una copia de `./.agents/`

#### Scenario: Copia del respaldo portable

- **WHEN** el usuario instala el respaldo portable de OpenCode
- **THEN** puede sincronizar manualmente agents, commands, plugins y
  configuración desde `integrations/opencode/` sin requerir que la skill
  pública forme parte de esa copia manual

#### Scenario: Eliminación del command anterior

- **WHEN** el respaldo se sincroniza después del cambio
- **THEN** la instalación documentada no incluye `commands/commit.md` y conserva
  separados los commands restantes, las skills públicas y los workflows locales
