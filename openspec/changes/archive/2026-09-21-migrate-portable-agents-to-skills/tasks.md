# Tasks

## 1. Crear las skills públicas

- [x] 1.1 Crear `skills/change-impact-analysis/SKILL.md` con frontmatter válido, activación por peticiones de impacto y un workflow read-only que conserve contexto mínimo, superficie, complejidad, riesgos, consumidores e incertidumbres; verificarlo con `python .agents/skills/skill-creator/scripts/quick_validate.py skills/change-impact-analysis`.
- [x] 1.2 Crear `skills/change-planning/SKILL.md` con un workflow autosuficiente para inspección mínima, unidades atómicas, dependencias, modos `Parallel`/`Sequential`, validaciones y puntos de decisión; verificar que no exija un `Analysis Report` ni una delegación previa y ejecutar `quick_validate.py` sobre la skill.
- [x] 1.3 Crear `skills/change-review/SKILL.md` a partir del contrato útil de `reviewer`, con revisión contra objetivo, alcance, restricciones y criterios, findings basados en evidencia y salida read-only; verificar con `quick_validate.py` y una revisión de contenido que no incluya permisos de agente, delegación ni edición automática.
- [x] 1.4 Crear `skills/integration-boundary-audit/SKILL.md` a partir de la parte read-only de `integration-checker`, cubriendo contratos, consumidores, persistencia, salidas generadas y tests sin aplicar correcciones; verificar con `quick_validate.py` y comprobar que los bloqueos de diseño se reportan sin modificar archivos.
- [x] 1.5 Añadir a cada skill una descripción de activación específica, límites frente a permisos y formato de salida coherente; verificar que las cuatro descripciones no se solapan de forma ambigua con `grouped-commits` ni con las skills `openspec-*`.

## 2. Validar utilidad y activación

- [x] 2.1 Crear casos de evaluación realistas para las cuatro skills, incluyendo peticiones directas, tareas pequeñas, falta de criterios, cambios distribuidos y solicitudes cercanas que no deberían activar cada skill; verificar que cada caso tiene un resultado observable y queda documentado en su `evals/evals.json` o en el formato de evaluación elegido.
- [x] 2.2 Ejecutar la validación estructural de las cuatro skills y pruebas cualitativas contra los casos definidos, verificando ausencia de edición en análisis, revisión y auditoría, planes autosuficientes y hallazgos con evidencia; registrar los fallos antes de retirar los agentes.
- [x] 2.3 Revisar las skills con el flujo de `skill-creator` y corregir descripciones o instrucciones que produzcan activaciones ambiguas, duplicación de trabajo o pérdida de las restricciones read-only; verificar que la segunda ejecución mejora los casos fallidos sin introducir dependencias de agentes.

## 3. Actualizar especificaciones y documentación

- [x] 3.1 Actualizar `skills/README.md` para catalogar las cuatro skills públicas, explicar su utilidad y límites, documentar instalación y actualización mediante el CLI neutral y mantener separadas `skills/`, `integrations/opencode/` y `./.agents/`; verificar los comandos y rutas contra los `SKILL.md` existentes.
- [x] 3.2 Simplificar `integrations/opencode/AGENTS.md` eliminando el índice de cinco agentes, las reglas específicas de delegación y HANDOFF retiradas, y conservando únicamente reglas generales aplicables al scope portable; verificar que no describe agentes eliminados ni promete continuidad automática.
- [x] 3.3 Actualizar `integrations/opencode/README.md` y el `README.md` raíz para retirar recursos de agentes y `context-handoff.ts` de las instrucciones de instalación, documentar las skills como superficie pública separada y conservar las instrucciones de sincronización manual restantes; verificar que cada ruta documentada existe.
- [x] 3.4 Actualizar cualquier configuración o catálogo activo que enumere agentes personalizados, skills antiguas o el plugin de contexto; verificar mediante búsqueda dirigida que no quedan referencias activas fuera de artifacts históricos y del cambio OpenSpec.

## 4. Retirar infraestructura sustituida

- [x] 4.1 Eliminar `integrations/opencode/agents/analyzer.md`, `planner.md`, `implementer.md`, `reviewer.md` e `integration-checker.md` después de confirmar que las cuatro skills cubren la utilidad aprobada; verificar que las rutas ya no aparecen en la instalación documentada ni en configuraciones activas.
- [x] 4.2 Eliminar `integrations/opencode/plugins/context-handoff.ts` y cualquier registro activo del plugin porque el contrato de presupuesto/HANDOFF se retira; verificar que no quedan referencias activas a `context-handoff`, `[context-handoff:budget]` o `CONTEXT_BUDGET_HARD_STOP` fuera de artifacts históricos.
- [x] 4.3 Dejar preparado el delta de `context-budget-plugin` para que el workflow de archive retire la especificación principal junto con el plugin, evitando conservar una capability sin implementación ni consumidores después del archive; verificar que el delta cubre los seis requisitos actuales y que `openspec show` confirma que la especificación principal permanece sin sincronizar hasta archive.

## 5. Validación final de la integración

- [x] 5.1 Validar todos los artifacts del cambio con `openspec validate --specs` y corregir cualquier requisito, escenario o dependencia inválida; verificar que la validación termina correctamente.
- [x] 5.2 Ejecutar una búsqueda final de recursos instalables y referencias activas a los cinco agentes, `HANDOFF`, el plugin y las nuevas skills fuera de `openspec/` y del change actual; verificar que la documentación, el catálogo y la estructura del repositorio son coherentes y que las referencias restantes en las especificaciones principales son las que archive debe sincronizar.
- [x] 5.3 Ejecutar las validaciones disponibles del repositorio para las skills y la configuración portable, incluyendo `git diff --check` y validación estructural de cada skill; registrar explícitamente cualquier validación no aplicable o no ejecutada.
