# Tasks

## 1. Renombrar la superficie pública y sus metadatos

- [x] 1.1 Renombrar `skills/change-impact-analysis/` a `skills/ac-change-impact-analysis/`, actualizar su campo `name` y su `evals/evals.json`; verificar que la ruta, `name` y `skill_name` usan exactamente `ac-change-impact-analysis`
- [x] 1.2 Renombrar `skills/change-planning/` a `skills/ac-change-planning/`, actualizar su campo `name` y su `evals/evals.json`; verificar que la ruta, `name` y `skill_name` usan exactamente `ac-change-planning`
- [x] 1.3 Renombrar `skills/change-review/` a `skills/ac-change-review/`, actualizar su campo `name` y su `evals/evals.json`; verificar que la ruta, `name` y `skill_name` usan exactamente `ac-change-review`
- [x] 1.4 Renombrar `skills/grouped-commits/` a `skills/ac-grouped-commits/`, actualizar su campo `name` y su `evals/evals.json`; verificar que la ruta, `name` y `skill_name` usan exactamente `ac-grouped-commits`
- [x] 1.5 Renombrar `skills/integration-boundary-audit/` a `skills/ac-integration-boundary-audit/`, actualizar su campo `name` y su `evals/evals.json`; verificar que la ruta, `name` y `skill_name` usan exactamente `ac-integration-boundary-audit`

## 2. Actualizar el catálogo y las referencias activas

- [x] 2.1 Actualizar `skills/README.md` para que la tabla de skills versionadas y todos los comandos `npx skills add` y `npx skills update` usen los cinco identificadores `ac-*`; verificar que el catálogo no ofrece nombres sin prefijo
- [x] 2.2 Buscar referencias activas a los nombres antiguos en la documentación y configuración pública, actualizar solo las referencias que describan estas cinco skills y verificar que no queden identificadores antiguos fuera de históricos, artifacts del cambio y fuentes externas excluidas
- [x] 2.3 Confirmar que `skills-lock.json`, `./.agents/` y la lógica interna de cada `SKILL.md` permanecen fuera del cambio salvo referencias de identidad estrictamente necesarias; verificarlo mediante revisión del diff y una búsqueda de cambios no autorizados

## 3. Validar la migración

- [x] 3.1 Ejecutar `python .agents/skills/skill-creator/scripts/quick_validate.py` sobre cada `skills/ac-*/SKILL.md`; verificar que las cinco skills pasan la validación de estructura y frontmatter
- [x] 3.2 Ejecutar comprobaciones estructurales para que existan exactamente los cinco directorios públicos esperados, cada uno contenga `SKILL.md` y `evals/evals.json`, y no existan los cinco directorios antiguos
- [x] 3.3 Ejecutar `git diff --check` y revisar el diff completo; verificar que el cambio solo contiene renombres, actualizaciones de identidad, documentación y referencias autorizadas
- [x] 3.4 Ejecutar `openspec validate --specs`; verificar que la implementación y los artifacts mantienen válida la delta de `opencode-integration`
