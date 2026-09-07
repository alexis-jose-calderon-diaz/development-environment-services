# Integración global de OpenCode

Esta carpeta contiene un respaldo versionado de la configuración global de OpenCode. Los archivos que OpenCode utiliza operativamente están en `~/.config/opencode/`; esta copia del repositorio sirve para revisar cambios, conservar historial y recuperar una configuración conocida.

La integración es opcional, global y reutilizable. No conviertas esta carpeta en una segunda ubicación operativa ni asumas que OpenCode la carga directamente: su instalación y sincronización son operaciones manuales hacia `~/.config/opencode/`.

## Alcance

El respaldo incluye las reglas globales, la configuración JSONC, los agentes, los comandos y las skills reutilizables. `AGENTS.md` y `.opencode/` pertenecen al proyecto anfitrión o consumidor: `.opencode/` contiene su configuración y workflows internos de OpenSpec. `integrations/opencode/` es una superficie separada y no se debe instalar desde `.opencode/` ni mezclar con ella.

## Correspondencia de rutas

| Respaldo versionado | Ubicación operativa de OpenCode |
| --- | --- |
| `integrations/opencode/AGENTS.md` | `~/.config/opencode/AGENTS.md` |
| `integrations/opencode/opencode.jsonc` | `~/.config/opencode/opencode.jsonc` |
| `integrations/opencode/agents/` | `~/.config/opencode/agents/` |
| `integrations/opencode/commands/` | `~/.config/opencode/commands/` |
| `integrations/opencode/skills/` | `~/.config/opencode/skills/` |

Después de copiar los contenidos, las referencias operativas a recursos deben resolverse desde `~/.config/opencode/`. Por eso se expresan como `skills/...`, `agents/...` o `commands/...`, y no como rutas hacia el repositorio.

`integrations/opencode/commands/` son comandos globales de OpenCode incluidos en este respaldo. `.opencode/commands/` son workflows o comandos locales de OpenSpec del proyecto consumidor y permanecen fuera de la instalación global; no son una fuente alternativa para estos comandos.

## Activación de OpenSpec

La integración reconoce dos fuentes explícitas y conserva el flujo genérico cuando ninguna aplica:

- **Directa:** una solicitud independiente contiene una única línea independiente, sin prefijos ni texto adicional, `OpenSpec change: <change-id>` con un ID real.
- **Heredada:** un workflow que ya resolvió el cambio mediante el CLI entrega un snapshot validado con el `change-id` real y su contexto contractual. El agente receptor lo revalida y no pide repetir una declaración textual.
- **Genérica:** solo una tarea que no declara ni transporta contexto OpenSpec, y que por tanto no tiene un canal inválido que corregir, conserva el flujo genérico; no se activa por nombres, branches, rutas o menciones aisladas. Si la tarea declara trabajo OpenSpec sin un canal válido, se bloquea.

`reviewer` es la excepción: permanece limitado a revisiones OpenSpec y no ofrece un modo de revisión genérica.

La forma `OpenSpec change: <change-id>` es metasyntax documental; `<change-id>` no es un valor operativo. Si llegan ambos canales, sus IDs deben coincidir exactamente. Si el contexto heredado carece de un ID verificable, es ambiguo u obsoleto, contiene placeholders, es insuficiente o contradice la resolución del CLI, la delegación se bloquea y se informa al orquestador en lugar de solicitar al usuario completar la plantilla.

## Instalación manual

Desde la raíz del repositorio:

```bash
mkdir -p ~/.config/opencode/agents ~/.config/opencode/commands ~/.config/opencode/skills
cp integrations/opencode/AGENTS.md ~/.config/opencode/AGENTS.md
cp integrations/opencode/opencode.jsonc ~/.config/opencode/opencode.jsonc
cp integrations/opencode/agents/*.md ~/.config/opencode/agents/
cp integrations/opencode/commands/*.md ~/.config/opencode/commands/
cp -R integrations/opencode/skills/* ~/.config/opencode/skills/
```

Estos comandos son una operación manual, no un instalador automático. Revisa el contenido antes de copiarlo. La guía global instalada coexiste con el `AGENTS.md` raíz del proyecto consumidor y no lo reemplaza; adapta la configuración global solo si ya tienes reglas propias. El proyecto conserva su `.opencode/` y sus workflows locales separados de este procedimiento.

## Comparación y sincronización

La sincronización es manual y bidireccional:

```text
~/.config/opencode/ <--> integrations/opencode/
       |                         |
       |                         +--> respaldo versionado
       +--> configuración operativa real
```

Antes de copiar en cualquier dirección:

1. Compara las dos ubicaciones, por ejemplo con `diff -ru integrations/opencode ~/.config/opencode`.
2. Identifica cambios locales deliberados y decide cuál copia debe conservarlos.
3. No sobrescribas archivos sin revisar las diferencias; una copia ciega puede eliminar reglas o recursos locales.
4. Tras una modificación intencional de la configuración operativa, actualiza el respaldo y revisa el diff antes de versionarlo.
5. Tras actualizar el respaldo desde Git, compara de nuevo antes de copiarlo a `~/.config/opencode/`.

No se proporcionan scripts de sincronización, enlaces simbólicos ni copias automáticas. OpenCode carga su configuración al iniciar; reinícialo después de cambiar archivos globales.
