# Proposal

## Why

Los README activos mezclan responsabilidades: `skills/README.md` incluye un catálogo de skills de terceros y el README raíz repite detalles que pertenecen a carpetas hijas. Esto dificulta distinguir el alcance de cada superficie y puede llevar a instalar dependencias que no forman parte del baseline. Además, la regla portable de delegación intenta delegar cuando hay subagentes disponibles, aunque todavía no exista información suficiente para saber si la división aporta valor o si la subtarea está correctamente delimitada.

## What Changes

- Retirar de los README activos el catálogo, los enlaces y los comandos de instalación de skills externas; `skills/README.md` quedará centrado en las skills públicas versionadas y su instalación/actualización.
- Añadir `services/README.md` como guía acotada de Docker Compose, y reducir el README raíz a la visión general del repositorio y enlaces hacia los README hijos que sean responsables de un scope concreto.
- Mantener la documentación detallada de la integración portable de OpenCode en el README raíz, sin crear un README hijo de `integrations/` que contradiga su condición de fuente documental única.
- Reforzar `integrations/agents-global.md` con una evaluación previa obligatoria: solo delegar después de reunir contexto suficiente para juzgar independencia, límites, beneficio de coordinación y validación; si no puede justificarse, inspeccionar más o trabajar directamente.
- Actualizar la delta spec de `opencode-integration` para formalizar la separación documental, la ausencia del catálogo externo en los README y el criterio de delegación informada.

## Capabilities

### New Capabilities

<!-- No se introduce una capability independiente; el README de services es una superficie documental del entorno existente. -->

### Modified Capabilities

- `opencode-integration`: ajustar los requisitos de alcance documental de README y el ciclo de atomización/delegación portable.

## Impact

- Documentación activa: `README.md`, `skills/README.md` y el nuevo `services/README.md`.
- Guía portable instalada desde `integrations/agents-global.md`.
- Especificación delta y tareas del cambio OpenSpec.
- No se modifican servicios Docker, imágenes, variables, APIs, dependencias runtime ni la superficie interna `./.agents/`.
