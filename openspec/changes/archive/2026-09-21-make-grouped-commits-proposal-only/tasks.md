# Tasks

## 1. Convertir la skill pública a proposal-only

- [x] 1.1 Actualizar `skills/ac-grouped-commits/SKILL.md` para que su descripción, introducción y flujo sean exclusivamente de análisis y propuesta; verificar que ya no instruye a invocar `question`, pedir aprobación, hacer staging o crear commits.
- [x] 1.2 Conservar en `skills/ac-grouped-commits/SKILL.md` el preflight read-only, la selección de alcance, la agrupación por intención, el tratamiento de secretos y la representación segura de rutas; verificar que la propuesta mantiene todos los campos requeridos y termina sin `## Fin de propuesta` ni texto posterior.

## 2. Alinear evaluaciones y documentación pública

- [x] 2.1 Actualizar `skills/ac-grouped-commits/evals/evals.json` para comprobar la terminación directa, la ausencia de `question`, la ausencia de escrituras y el comportamiento proposal-only ante una petición posterior de crear commits; verificar que el JSON conserva el schema de evaluaciones.
- [x] 2.2 Actualizar `skills/README.md` para describir `ac-grouped-commits` como una skill que solo prepara propuestas; verificar que el catálogo no promete aprobación ni creación de commits por esta skill.

## 3. Sincronizar el contrato OpenSpec

- [x] 3.1 Aplicar el delta de `specs/opencode-integration/spec.md` a `openspec/specs/opencode-integration/spec.md`, eliminando la aprobación interactiva y la ejecución de commits de `ac-grouped-commits`; verificar que los requisitos y escenarios describen la terminación directa sin marcador.

## 4. Validar alcance y coherencia

- [x] 4.1 Ejecutar comprobaciones de texto y JSON sobre la skill pública, evaluaciones y README para detectar referencias obsoletas a `question`, `## Fin de propuesta` o aprobación interactiva; verificar que no hay cambios bajo `.agents/`.
- [x] 4.2 Ejecutar `openspec validate --specs` y `git diff --check`; verificar que la especificación y los artifacts son válidos y que no existen errores de whitespace.
