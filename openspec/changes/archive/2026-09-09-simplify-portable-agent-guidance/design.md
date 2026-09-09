## Context

La integracion portable contiene una guia comun, cinco agentes con contratos de rol y dos skills auxiliares de contexto. La misma politica de activacion y transferencia se repite en varias superficies, mientras el runtime de OpenCode entrega el prompt de delegacion al sub-agente pero no genera automaticamente un snapshot contractual.

Este diseno aplica la motivacion de `proposal.md` y los contratos de `specs/opencode-integration/spec.md` sin cambiar la configuracion del proyecto consumidor ni los workflows locales.

## Goals / Non-Goals

**Goals:**

- Convertir `integrations/opencode/AGENTS.md` en la fuente unica de las reglas compartidas del toolkit portable.
- Definir alli un formato breve y opcional de prompt delegado, con objetivo, alcance, exclusiones, contexto relevante, restricciones, criterios y validacion.
- Mantener en cada agente solo su responsabilidad, permisos, limites y formato de salida especificos.
- Permitir que `reviewer` opere tanto sobre tareas genericas como sobre cambios que reciban criterios contractuales en el contexto.
- Retirar las skills auxiliares y documentar la migracion de la instalacion global.

**Non-Goals:**

- Modificar `AGENTS.md` raiz, `openspec/`, `.opencode/` o cualquier workflow local del repositorio.
- Crear un hook, plugin o automatizacion para interceptar llamadas a `task`.
- Cambiar `opencode.jsonc`, Docker Compose, servicios, APIs o persistencia.
- Eliminar las capacidades de planificacion, implementacion, revision o comprobacion de integracion de los agentes.

## Decisions

### 1. Centralizar el contexto delegado en `AGENTS.md`

`integrations/opencode/AGENTS.md` definira una plantilla semantica de prompt y las reglas para filtrar, consolidar y transportar contexto. Las secciones seran opcionales segun la tarea, pero `Objective`, `Scope`, `Out of Scope`, `Acceptance Criteria` y `Verification` se exigiran cuando resulten necesarios para delimitar y validar una subtarea.

Se elige esta opcion porque mantiene el contrato cerca de las reglas comunes y evita una skill adicional. No se elige una automatizacion de runtime porque el toolkit actual no contiene un hook que pueda generar o validar prompts de forma fiable.

### 2. Mantener contratos de rol pequenos y especializados

Cada archivo de `agents/` conservara un contrato independiente:

- `analyzer`: inspeccion read-only de estado, impacto, superficie y riesgos.
- `planner`: planificacion y matriz de ejecucion sin editar.
- `implementer`: una unidad atomica, con cambios y validacion dentro de su scope.
- `reviewer`: revision read-only contra el contexto y los criterios recibidos.
- `integration-checker`: comprobacion y correccion de fronteras despues de las implementaciones.

Las reglas duplicadas de transporte de contexto, validacion de snapshots y activacion de workflows se eliminaran de esos archivos. Esta separacion evita que la guia comun vuelva a multiplicarse en cada rol.

### 3. Eliminar las skills auxiliares como recursos instalables

Se eliminaran los directorios de `openspec-change-context-bootstrap` y `delegation-context` del respaldo versionado. Los agentes no dependeran de su presencia; la instalacion documentada dejara de copiarlos.

La eliminacion es preferible a conservar aliases o compatibilidad porque el objetivo es que el toolkit no sugiera ni active un protocolo externo. Los usuarios con una instalacion anterior deberan retirar manualmente los directorios obsoletos antes o despues de sincronizar.

### 4. Conservar la sincronizacion manual y las fronteras del repositorio

`README.md` seguira documentando que el respaldo se copia manualmente a `~/.config/opencode/`, pero describira un conjunto de recursos sin skills auxiliares. La migracion no intentara modificar automaticamente la instalacion operativa y no tocara el `AGENTS.md` raiz ni los workflows locales.

## Risks / Trade-offs

- [Perdida de validacion especifica de workflows] Los usuarios que dependian de bloqueos automaticos ya no los recibiran desde el toolkit portable -> mantener esas reglas en el workflow o configuracion local que las necesite y documentar la frontera.
- [Recursos obsoletos instalados] Copiar archivos nuevos no elimina necesariamente skills antiguas bajo `~/.config/opencode/skills/` -> incluir una instruccion explicita de limpieza y verificar la comparacion antes de reiniciar OpenCode.
- [Contexto delegado insuficiente] Un prompt demasiado corto puede provocar rediscovery o una implementacion incompleta -> exigir scope, exclusiones y criterios cuando sean necesarios, y conservar validaciones en los contratos de rol.
- [Duplicacion futura] Los agentes pueden volver a incorporar reglas comunes -> revisar que el diff de cada agente contenga solo comportamiento especifico del rol y usar `AGENTS.md` como fuente compartida.
