# Tasks

## 1. Renombrar y rediseñar los respaldos portables

- [x] 1.1 Mover y renombrar `integrations/opencode/AGENTS.md` a `integrations/agents-global.md` y `integrations/opencode/opencode.jsonc` a `integrations/opencode-config.jsonc`, verificando mediante `git diff --find-renames` que el contenido de la configuración no cambió y que la carpeta `integrations/opencode/` desaparece.
- [x] 1.2 Reescribir `integrations/agents-global.md` con las reglas comunes de idioma español, preguntas mediante la herramienta especializada, ciclo repetible de alcance a finalización, prioridad del workdir, seguridad, cambios mínimos, atomización y delegación; verificar que no incluya referencias a superficies específicas del repositorio ni menciones a `skills`, `commands` o agentes explícitos.

## 2. Consolidar y alinear la documentación

- [x] 2.1 Trasladar al `README.md` raíz el propósito, inventario, mapeo respaldo-destino, copia manual, comparación individual, sincronización, migración, limpieza prudente y reinicio de OpenCode; verificar que los comandos usen `integrations/agents-global.md` y `integrations/opencode-config.jsonc` como origen y `AGENTS.md` y `opencode.jsonc` solo como destino.
- [x] 2.2 Eliminar la carpeta `integrations/opencode/` y actualizar `skills/README.md` para enlazar al README raíz; verificar con una búsqueda acotada que no queden enlaces operativos al README eliminado fuera de artifacts históricos.
- [x] 2.3 Alinear `AGENTS.md` raíz para conservar únicamente reglas del repositorio, sin duplicar ni dirigir reglas transversales; verificar que sus secciones específicas de Docker, OpenSpec, integración y validación permanezcan presentes.

## 3. Revisar la integración completa

- [x] 3.1 Comparar las rutas del respaldo y del destino documentado mediante diferencias individuales, revisar el contenido JSONC renombrado con un parser apropiado y verificar que los archivos operativos de `~/.config/opencode/` no sean modificados automáticamente.
- [x] 3.2 Ejecutar búsquedas acotadas en las superficies operativas y documentales, excluyendo artifacts históricos y de planificación, para detectar referencias antiguas, enlaces rotos, nombres descubribles dentro de `integrations/` y reglas contradictorias; verificar que los usos restantes de `AGENTS.md` y `opencode.jsonc` sean destinos operativos o tokens contractuales documentados.
- [x] 3.3 Ejecutar `git diff --check`, `openspec validate --specs` y revisar `git diff --name-status` para confirmar que el cambio cubre únicamente los archivos autorizados, no modifica `services/` ni `prospectos/` y deja documentadas las validaciones no ejecutadas.
