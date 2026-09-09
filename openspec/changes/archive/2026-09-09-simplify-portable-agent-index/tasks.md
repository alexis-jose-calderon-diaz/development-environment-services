## 1. Guia comun e indice de agentes

- [x] 1.1 Reescribir `integrations/opencode/AGENTS.md` como una guia comun breve, conservando alcance, seguridad, coordinacion y limites portables; verificar que no introduzca dependencias de rutas, configuraciones o workflows externos.
- [x] 1.2 Incorporar un indice de `analyzer`, `planner`, `implementer`, `reviewer` e `integration-checker` con responsabilidad principal y limite general de edicion; verificar que los cinco nombres coincidan exactamente con los archivos existentes bajo `integrations/opencode/agents/`.
- [x] 1.3 Reducir el contexto de delegacion a las secciones necesarias para objetivo, alcance, exclusiones, restricciones, criterios y validacion; verificar que `AGENTS.md` remita al contrato individual sin duplicar sus metodos ni formatos de salida.

## 2. Coherencia de la integracion

- [x] 2.1 Comparar el indice de `AGENTS.md` con los front matter de los cinco agentes y el inventario de `README.md`; verificar responsabilidades, permisos generales y ausencia de agentes documentados que no existan.
- [x] 2.2 Revisar el diff del cambio y verificar que solo `integrations/opencode/AGENTS.md` se modifique dentro del alcance, manteniendo intactos `agents/*.md`, `README.md`, `opencode.jsonc` y las superficies locales.
- [x] 2.3 Ejecutar `openspec validate --specs` y `git diff --check`; verificar que la delta spec sea valida y no existan errores de formato o whitespace.
