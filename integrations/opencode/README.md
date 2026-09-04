# Integración global de OpenCode

Esta carpeta contiene un respaldo versionado de la configuración global de OpenCode. Los archivos que OpenCode utiliza operativamente están en `~/.config/opencode/`; esta copia del repositorio sirve para revisar cambios, conservar historial y recuperar una configuración conocida.

La integración es opcional. No conviertas esta carpeta en una segunda ubicación operativa ni asumas que OpenCode la carga directamente.

## Alcance

El respaldo incluye las reglas globales, la configuración JSONC, los agentes, los comandos y las skills reutilizables. Está separado de `.opencode/`, que contiene la configuración y los workflows internos de OpenSpec del repositorio. No mezcles ambas superficies ni instales la integración global desde `.opencode/`.

## Correspondencia de rutas

| Respaldo versionado | Ubicación operativa de OpenCode |
| --- | --- |
| `integrations/opencode/AGENTS.md` | `~/.config/opencode/AGENTS.md` |
| `integrations/opencode/opencode.jsonc` | `~/.config/opencode/opencode.jsonc` |
| `integrations/opencode/agents/` | `~/.config/opencode/agents/` |
| `integrations/opencode/commands/` | `~/.config/opencode/commands/` |
| `integrations/opencode/skills/` | `~/.config/opencode/skills/` |

Después de copiar los contenidos, las referencias operativas a recursos deben resolverse desde `~/.config/opencode/`. Por eso se expresan como `skills/...`, `agents/...` o `commands/...`, y no como rutas hacia el repositorio.

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

Estos comandos son una operación manual, no un instalador automático. Revisa el contenido y adapta `AGENTS.md` si ya tienes reglas globales propias.

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
