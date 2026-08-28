# OpenCode Toolkit

Repositorio público para centralizar recursos reutilizables de OpenCode y mantenerlos disponibles entre proyectos.

## Propósito

Este repositorio reúne comandos, agentes e instrucciones globales para trabajar con OpenCode de forma consistente, segura y orientada a mantener sesiones pequeñas. Está pensado para crecer con nuevas herramientas y futuras `skills` sin quedar asociado a un proyecto, lenguaje o framework específico.

## Contenido

- `commands/`: comandos reutilizables de OpenCode.
- `agents/`: agentes globales especializados para planificación, implementación, revisión e integración.
- `AGENTS.md`: reglas globales de orquestación, protección del contexto y uso de agentes.
- `skills/`: espacio reservado para futuras skills reutilizables.

## Instalación manual

Clona el repositorio y copia los recursos que quieras utilizar en la configuración global de OpenCode:

```bash
git clone https://github.com/alexis-jose-calderon-diaz/opencode-toolkit.git
cd opencode-toolkit
cp commands/*.md ~/.config/opencode/commands/
cp agents/*.md ~/.config/opencode/agents/
```

Revisa y combina `AGENTS.md` con las reglas globales existentes antes de reemplazarlo. Reinicia OpenCode después de cambiar comandos, agentes o instrucciones globales.

## Principios

- Mantener recursos independientes del proyecto cuando sea posible.
- Separar planificación, implementación, pruebas, integración y revisión.
- Minimizar el contexto transferido entre sesiones.
- Evitar secretos, credenciales y rutas privadas.
- Preferir cambios pequeños, verificables y reutilizables.
