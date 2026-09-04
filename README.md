# OpenCode Toolkit

Repositorio público para centralizar recursos reutilizables de OpenCode y mantenerlos disponibles entre proyectos.

## Propósito

Este repositorio reúne documentación, servicios auxiliares y un respaldo versionado de recursos globales para trabajar con OpenCode de forma consistente, segura y orientada a mantener sesiones pequeñas. La integración global es opcional y está separada del flujo interno de OpenSpec del propio repositorio.

## Contenido

- `integrations/opencode/`: respaldo versionado de la configuración global de OpenCode, con `AGENTS.md`, `opencode.jsonc`, `agents/`, `commands/` y `skills/`. Consulta su [guía de integración](integrations/opencode/README.md).
- `services/`: servicios auxiliares y su configuración Docker Compose.
- `openspec/`: cambios y configuración del workflow OpenSpec.
- `.opencode/`: configuración y extensiones internas de OpenSpec para este repositorio; no es el origen de la instalación global de OpenCode.

## Instalación manual de OpenCode

La instalación global es opcional. Clona el repositorio y copia manualmente desde el respaldo versionado de `integrations/opencode/` hacia la configuración operativa de OpenCode:

```bash
git clone https://github.com/alexis-jose-calderon-diaz/opencode-toolkit.git
cd opencode-toolkit
mkdir -p ~/.config/opencode/agents ~/.config/opencode/commands ~/.config/opencode/skills
cp integrations/opencode/AGENTS.md ~/.config/opencode/AGENTS.md
cp integrations/opencode/opencode.jsonc ~/.config/opencode/opencode.jsonc
cp integrations/opencode/agents/*.md ~/.config/opencode/agents/
cp integrations/opencode/commands/*.md ~/.config/opencode/commands/
cp -R integrations/opencode/skills/* ~/.config/opencode/skills/
```

Revisa y combina `AGENTS.md` con las reglas globales existentes antes de reemplazarlo. La skill `openspec-change-context-bootstrap` debe estar instalada en `~/.config/opencode/skills/` para que el bootstrap esté disponible en tareas OpenSpec. Las reglas y recursos instalados se combinan con la configuración existente; reinicia OpenCode después de cambiar comandos, agentes, skills, configuración o instrucciones globales. Para comparar y mantener ambas ubicaciones, consulta [`integrations/opencode/README.md`](integrations/opencode/README.md).

## Principios

- Mantener recursos independientes del proyecto cuando sea posible.
- Separar planificación, implementación, pruebas, integración y revisión.
- Minimizar el contexto transferido entre sesiones.
- Evitar secretos, credenciales y rutas privadas.
- Preferir cambios pequeños, verificables y reutilizables.
