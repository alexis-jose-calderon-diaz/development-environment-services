## 1. Documentación raíz

- [x] 1.1 Actualizar `README.md` para reflejar el mapa actual del repositorio, presentar `integrations/opencode/` como integración opcional y enlazar su guía específica; verificar que las rutas enlazadas existan y que no se describan recursos OpenCode como si estuvieran en la raíz.
- [x] 1.2 Revisar las instrucciones de instalación de OpenCode en `README.md` para que usen `integrations/opencode/` como origen versionado y `~/.config/opencode/` como destino operativo; verificar que cada comando y ruta documentados coincidan con los directorios versionados actuales.

## 2. Guía de la integración OpenCode

- [x] 2.1 Crear `integrations/opencode/README.md` explicando que la carpeta contiene respaldos versionados de la configuración global real ubicada en `~/.config/opencode/`; verificar que incluya propósito, alcance, advertencia de fuente operativa y separación respecto de `.opencode/`.
- [x] 2.2 Añadir a `integrations/opencode/README.md` la tabla de correspondencia entre `AGENTS.md`, `opencode.jsonc`, `agents/`, `commands/`, `skills/` y sus destinos bajo `~/.config/opencode/`; verificar que todas las entradas tengan origen y destino inequívocos.
- [x] 2.3 Documentar el flujo manual de comparación y sincronización entre la configuración global y el respaldo versionado, sin introducir scripts, enlaces simbólicos ni copias automáticas; verificar que se advierta sobre diferencias, cambios locales y sobrescrituras.

## 3. Consistencia de rutas y revisión

- [x] 3.1 Auditar los archivos Markdown de `integrations/opencode/` y corregir únicamente referencias operativas que apunten a rutas padre o a la ubicación del repositorio en lugar de rutas relativas a la raíz global; verificar con búsquedas acotadas que las referencias de `skills/...`, `agents/...` y `commands/...` sigan siendo válidas tras copiarse a `~/.config/opencode/`.
- [x] 3.2 Revisar el diff final de los documentos y validar que el cambio se limite a `README.md`, `integrations/opencode/README.md` y los artifacts de planificación, sin modificaciones funcionales en agentes, commands, skills, configuración o servicios; verificar el alcance con `git diff --name-only`.
