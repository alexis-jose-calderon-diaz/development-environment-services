# Tasks

## 1. Ajustar el contrato de salida de la skill

- [x] 1.1 Actualizar `skills/ac-grouped-commits/SKILL.md` para describir la activación como análisis y generación de una propuesta completa, retirar `read-only`, `proposal-only` y la prohibición global de acciones, y verificar que la respuesta termina después de la propuesta.
- [x] 1.2 Eliminar de `skills/ac-grouped-commits/SKILL.md` el rechazo explícito de solicitudes posteriores y conservar únicamente las reglas necesarias para alcance, agrupación, secretos, mensajes y representación segura; verificar que no quede una instrucción que convierta la skill en una barrera de permisos del runtime.

## 2. Alinear evaluaciones y documentación pública

- [x] 2.1 Actualizar `skills/ac-grouped-commits/evals/evals.json` para conservar los casos de propuesta completa, alcance y seguridad, eliminar el caso que exige rechazar la creación posterior y verificar que las expectativas no describen la skill como `read-only`.
- [x] 2.2 Actualizar `skills/README.md` para presentar `ac-grouped-commits` por su salida de propuesta y retirar referencias a `read-only`, `proposal-only` o a una imposibilidad permanente de crear commits; verificar que las demás skills conservan sus límites documentados.

## 3. Sincronizar el contrato OpenSpec

- [x] 3.1 Aplicar el delta de `openspec/specs/opencode-integration/spec.md` para que `ac-grouped-commits` tenga una frontera de salida, no una política global de permisos, y para que el requisito transversal de permisos siga aplicando solo a las skills que declaran límites `read-only`; verificar que cada requisito modificado conserva todos sus escenarios.

## 4. Validar coherencia y alcance

- [x] 4.1 Ejecutar comprobaciones de JSON, referencias textuales y estructura sobre `skills/ac-grouped-commits/SKILL.md`, `skills/ac-grouped-commits/evals/evals.json`, `skills/README.md` y la especificación; verificar que no quedan referencias antiguas específicas de `ac-grouped-commits` a `read-only`, `proposal-only` o rechazo de solicitudes posteriores.
- [x] 4.2 Ejecutar `openspec validate --specs` y `git diff --check`; verificar que el delta es válido, que la propuesta termina directamente y que no se modificaron comandos, permisos del runtime, servicios Docker ni otras skills fuera del alcance.
