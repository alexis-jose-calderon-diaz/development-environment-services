# opencode-integration Specification

## Purpose

Define el comportamiento seguro de la integración global de OpenCode al trabajar con cambios OpenSpec y sus límites frente a la configuración local de cada proyecto.

## Requirements

### Requirement: Activación por contexto OpenSpec heredado

La integración SHALL permitir que un agente active el bootstrap OpenSpec cuando un workflow ya haya resuelto un cambio mediante el CLI y le entregue el `change-id` real junto con el snapshot contractual correspondiente, aunque la solicitud original del usuario no contenga una declaración textual independiente.

#### Scenario: Workflow con contexto resuelto

- **WHEN** un agente delegado recibe un snapshot que identifica el `change-id`, el schema, el root de planificación y el estado contextual emitido por el CLI
- **THEN** inicia el bootstrap OpenSpec usando ese identificador sin pedir al usuario que repita una plantilla de declaración

#### Scenario: Solicitud directa con declaración explícita

- **WHEN** una solicitud directa fuera de un workflow contiene una única declaración OpenSpec con un identificador real
- **THEN** la integración usa esa declaración para resolver el mismo cambio y conserva el comportamiento de validación contractual

### Requirement: Validación fail-closed del contexto heredado

La integración MUST rechazar el contexto OpenSpec heredado cuando falte el identificador, sea ambiguo, contenga un placeholder, contradiga el snapshot o no pueda confirmarse mediante el CLI. El agente SHALL informar el bloqueo al orquestador y no SHALL solicitar al usuario una línea literal para reparar una delegación interna.

#### Scenario: Snapshot sin identificador verificable

- **WHEN** un agente delegado recibe contexto de workflow sin un `change-id` real o con identificadores contradictorios
- **THEN** devuelve `BLOCKED` antes de inspeccionar el repositorio y señala que la delegación debe corregirse

#### Scenario: Cambio no resoluble por el CLI

- **WHEN** el `change-id` heredado no existe o el CLI no puede devolver un contexto válido para él
- **THEN** el agente devuelve `BLOCKED` y no continúa como una tarea genérica ni inventa rutas o artifacts

### Requirement: Propagación del identificador real entre agentes

La integración SHALL transportar entre agentes el `change-id` confirmado y el subconjunto contractual relevante sin sustituirlo por la plantilla `<change-id>`, duplicar declaraciones ni pedir al usuario que complete datos que ya resolvió el workflow.

#### Scenario: Delegación a una nueva sesión

- **WHEN** el orquestador delega una etapa posterior de un cambio OpenSpec resuelto
- **THEN** el agente receptor obtiene el identificador real, el alcance, las exclusiones y el contexto contractual suficiente para revalidar el mismo cambio

#### Scenario: Placeholder en el contexto

- **WHEN** el paquete delegado contiene `<change-id>` u otro valor placeholder en lugar del identificador confirmado
- **THEN** la delegación se considera inválida y se reporta al orquestador como error de propagación

### Requirement: Separación de configuraciones local y global

La documentación del repositorio, principalmente el `README.md` de la integración y el `AGENTS.md` raíz cuando corresponda, SHALL explicar que el `AGENTS.md` raíz y `.opencode/` pertenecen al proyecto anfitrión, mientras `integrations/opencode/` contiene el respaldo versionado de la configuración global que se instala manualmente bajo `~/.config/opencode/`. SHALL distinguir también los comandos globales de OpenCode de los workflows locales de OpenSpec y SHALL evitar instrucciones que mezclen ambas superficies. El `integrations/opencode/AGENTS.md` SHALL limitarse a reglas aplicables a los recursos dentro de su propio scope, ser agnóstico de ubicación y no asumir que es una política global, una instalación operativa o parte de un repositorio consumidor concreto.

#### Scenario: Consulta de la guía de integración

- **WHEN** un usuario consulta el `README.md` de la integración o el `AGENTS.md` raíz
- **THEN** puede identificar el propósito, la ubicación operativa, la relación y los límites de cada superficie sin interpretar `.opencode/` como origen de la instalación global

#### Scenario: Aplicación aislada de las reglas del toolkit

- **WHEN** el `integrations/opencode/AGENTS.md` se aplica bajo cualquier ubicación que contenga sus recursos de scope
- **THEN** sus reglas se mantienen válidas sin depender de una ruta de instalación, un repositorio consumidor, `.opencode/` ni una descripción de su carácter global

#### Scenario: Instalación global sin alterar el proyecto

- **WHEN** el usuario sincroniza manualmente la integración global
- **THEN** copia únicamente los recursos documentados de `integrations/opencode/` hacia `~/.config/opencode/` y conserva separados el `AGENTS.md` raíz y los workflows locales de `.opencode/`
