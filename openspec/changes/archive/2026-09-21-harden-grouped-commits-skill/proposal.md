# Proposal

## Why

`grouped-commits` ya define el flujo principal de agrupación, aprobación y creación segura de commits, pero deja ambiguos varios detalles que pueden producir decisiones no reproducibles o ampliar accidentalmente el alcance: la fotografía del repositorio, la revalidación entre commits, el tratamiento de rutas y secretos, y algunos estados límite de Git. Conviene endurecer ahora el contrato antes de reutilizar la skill en más herramientas o repositorios consumidores.

## What Changes

- Precisar la activación de la skill para peticiones de agrupación, separación y creación de commits lógicos.
- Definir una fotografía verificable del repositorio que incluya `HEAD`, branch, upstream, index, working tree, rutas no trackeadas y estado de operaciones Git.
- Revalidar esa fotografía antes de cada escritura y después de cada commit o hook antes de continuar con otro grupo.
- Establecer reglas seguras para construir comandos y mostrar rutas, incluyendo rutas extrañas, renombres, eliminaciones, binarios, symlinks y submódulos.
- Hacer operativa la política de secretos: clasificación, exclusión sin revelar valores, detención para secretos staged y comportamiento cuando no queda ningún grupo elegible.
- Precisar el alcance de archivos staged, unstaged, no trackeados e ignorados y el comportamiento de archivos con hunks de intenciones mixtas.
- Hacer inequívocas las decisiones `Crear commits`, `Ajustar propuesta` y `Cancelar`, sin aceptar aprobaciones implícitas.
- Documentar estados límite como repositorios sin `HEAD`, renombres, eliminaciones y fallos de hooks sin rollback automático.
- Añadir casos de evaluación reproducibles para verificar staged/unstaged, agrupación cross-layer, hunks mixtos, secretos, concurrencia y hooks.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `opencode-integration`: endurecer los requisitos de la skill portable `grouped-commits` para selección segura del alcance, propuestas deterministas, ejecución y verificación de commits.

## Impact

- Afecta principalmente `integrations/opencode/skills/grouped-commits/SKILL.md`.
- Puede añadir fixtures o prompts de evaluación para validar el contrato de la skill, sin introducir una suite de tests de producto ni un parser Git nuevo.
- No modifica APIs, servicios, comandos `pr` o `tag`, configuración global, agentes portables ni la instalación manual documentada.
- Puede hacer que la skill se detenga antes en situaciones ambiguas o inseguras; no autoriza operaciones Git destructivas, push, amend, `--no-verify` ni validaciones del proyecto.
