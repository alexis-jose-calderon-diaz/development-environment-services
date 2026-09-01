# OpenCode Toolkit

Repositorio público para centralizar recursos reutilizables de OpenCode y mantenerlos disponibles entre proyectos.

## Propósito

Este repositorio reúne comandos, agentes e instrucciones globales para trabajar con OpenCode de forma consistente, segura y orientada a mantener sesiones pequeñas. Está pensado para crecer con nuevas herramientas y futuras `skills` sin quedar asociado a un proyecto, lenguaje o framework específico.

## Contenido

- `commands/`: comandos reutilizables de OpenCode.
- `agents/`: agentes globales especializados para planificación, implementación, revisión e integración.
- `AGENTS.md`: reglas globales de orquestación, protección del contexto y uso de agentes.
- `CLI-TOOLS.md`: inventario operativo de herramientas agent-first y human-first, políticas de selección e instalación.
- `skills/`: skills reutilizables, incluido el bootstrap de contexto OpenSpec.

## Instalación manual

Clona el repositorio y copia los recursos que quieras utilizar en la configuración global de OpenCode:

```bash
git clone https://github.com/alexis-jose-calderon-diaz/opencode-toolkit.git
cd opencode-toolkit
mkdir -p ~/.config/opencode/commands ~/.config/opencode/agents ~/.config/opencode/skills
cp commands/*.md ~/.config/opencode/commands/
cp agents/*.md ~/.config/opencode/agents/
cp -R skills/* ~/.config/opencode/skills/
```

Combina `AGENTS.md` con las reglas globales existentes antes de reemplazarlo. La skill `openspec-change-context-bootstrap` debe estar instalada en `~/.config/opencode/skills/` para que el bootstrap esté disponible en tareas OpenSpec. Las reglas y recursos instalados se combinan con la configuración existente; reinicia OpenCode después de cambiar comandos, agentes, skills o instrucciones globales.

## Instalación de CLI

La instalación de los recursos de OpenCode no instala automáticamente binarios del sistema ni garantiza que estén disponibles. Consulta [`CLI-TOOLS.md`](CLI-TOOLS.md) para elegir la instalación mínima en Ubuntu 24.04, separar herramientas base de dependencias de desarrollo/infraestructura y comprobar capacidades con `command -v`. No instales por defecto herramientas pesadas o específicas del stack que el proyecto no necesite.

## Principios

- Mantener recursos independientes del proyecto cuando sea posible.
- Separar planificación, implementación, pruebas, integración y revisión.
- Minimizar el contexto transferido entre sesiones.
- Evitar secretos, credenciales y rutas privadas.
- Preferir cambios pequeños, verificables y reutilizables.
