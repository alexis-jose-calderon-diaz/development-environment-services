## Why

La integración global de OpenCode trata la línea `OpenSpec change: <change-id>` como única puerta de entrada incluso cuando un workflow OpenSpec ya resolvió el cambio mediante el CLI. Como las sesiones delegadas no heredan automáticamente los argumentos del comando, los agentes pueden pedir al usuario una plantilla literal y bloquear un cambio cuyo contexto ya está disponible.

El repositorio además contiene superficies con responsabilidades distintas: `AGENTS.md` y `.opencode/` pertenecen al proyecto local, mientras `integrations/opencode/` es un respaldo reutilizable de la configuración global. La separación no está definida con suficiente precisión para evitar que una política global se confunda con los workflows locales.

## What Changes

- Permitir que los agentes de la integración acepten un snapshot OpenSpec validado por `status` e `instructions` como contexto heredado de un workflow, sin exigir al usuario repetir una declaración textual.
- Mantener la declaración explícita con un ID real para solicitudes directas que no provengan de un workflow OpenSpec.
- Exigir que el `change-id` heredado sea verificable, coherente con el CLI y transportado junto con el snapshot contractual; los IDs ausentes, ambiguos, placeholder o contradictorios seguirán bloqueando.
- Ajustar las reglas de `AGENTS.md`, `integrations/opencode/AGENTS.md`, los agentes especializados y las skills de contexto para distinguir activación directa de contexto heredado y evitar que se solicite la plantilla al usuario.
- Documentar la diferencia, separación y propósito de `AGENTS.md` raíz, `.opencode/` e `integrations/opencode/` en la documentación que describe el repositorio; mantener `integrations/opencode/AGENTS.md` centrado únicamente en las reglas de su propio scope, agnóstico de ubicación y sin asumir que es global, instalado o consumido desde un repositorio concreto.
- Mantener fuera del cambio los comandos y skills locales de `.opencode/`, los comandos globales no relacionados, `opencode.jsonc` y la configuración operativa de `~/.config/opencode/`; la sincronización global seguirá siendo manual.
- **BREAKING** No aplica a APIs ni servicios; cambia el contrato operativo de activación y transporte de contexto entre agentes.

## Capabilities

### New Capabilities

- `opencode-integration`: Define la activación segura de OpenSpec y la propagación de contexto entre los agentes de la integración global de OpenCode, incluyendo la separación de sus recursos respecto del proyecto anfitrión.

### Modified Capabilities

Ninguna. No existe una capability funcional existente para la integración global; la especificación se incorporará como capability independiente.

## Impact

- Reglas y documentación locales: `AGENTS.md`.
- Respaldo versionado de la integración global: `integrations/opencode/AGENTS.md`, `integrations/opencode/README.md`, `integrations/opencode/agents/` e `integrations/opencode/skills/`.
- Configuración operativa: no se modifica automáticamente `~/.config/opencode/`; deberá sincronizarse manualmente después de revisar las diferencias.
- `.opencode/` y sus comandos OpenSpec: fuera de alcance y sin cambios.
- Servicios Docker, APIs, dependencias y persistencia: sin impacto.
