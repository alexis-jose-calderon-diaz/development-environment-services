## 1. Definir la interfaz y la selección de modo

- [x] 1.1 Actualizar `integrations/opencode/commands/commit.md` para reconocer `--staged`, conservar texto sin opciones como contexto y rechazar opciones desconocidas; verificar que una opción no soportada termina sin modificar Git.
- [x] 1.2 Hacer que el preflight bloquee `/commit` ante cualquier cambio staged y que `/commit --staged` bloquee cuando no haya contenido staged; verificar ambos estados con repositorios Git temporales.

## 2. Implementar el alcance de cada modo

- [x] 2.1 Implementar el modo `--staged` como un único commit del index exacto, sin `git add`, `git restore --staged`, `git reset` ni reagrupación; verificar que cambios unstaged y no trackeados permanecen intactos.
- [x] 2.2 Reducir el análisis inicial de ambos modos a estado, rutas, estados y estadísticas, ampliando el diff solo ante ambigüedad o señales de seguridad; verificar que no se inspeccionen áreas no relacionadas cuando el resumen sea suficiente.
- [x] 2.3 Mantener en el modo working tree la agrupación semántica existente y el staging por rutas aprobadas; verificar con cambios de dos intenciones que los grupos continúan produciendo commits separados cuando corresponda.
- [x] 2.4 Conservar la confirmación explícita, la ejecución normal de hooks, la revisión segura de rutas sospechosas y las restricciones contra operaciones destructivas; verificar que el plan muestre el alcance y que una cancelación no escriba en Git.

## 3. Validar el contrato completo

- [x] 3.1 Ejecutar escenarios en repositorios Git temporales para `/commit`, `/commit --staged`, index mixto, cambios residuales, argumentos inválidos, archivos nuevos, eliminaciones y agrupación del working tree; verificar estado, rutas y commits resultantes.
- [x] 3.2 Ejecutar `openspec validate --specs` y revisar el diff final para confirmar que solo se modificaron el comando portable y los artifacts de este cambio.
