## 1. Guia compartida

- [x] 1.1 Reescribir `integrations/opencode/AGENTS.md` como guia portable de herramientas, comportamiento, seguridad, coordinacion y delegacion, incluyendo una plantilla de contexto autocontenido con secciones opcionales y sin activar workflows externos; verificar que el archivo define `Objective`, `Scope`, `Out of Scope`, contexto relevante, restricciones, criterios y validacion sin exigir identificadores o snapshots.

## 2. Contratos de agentes

- [x] 2.1 Simplificar `integrations/opencode/agents/analyzer.md` para conservar solo el analisis read-only de estado, impacto, riesgos y superficie; verificar que puede procesar una tarea generica sin bootstrap externo ni permiso de edicion o delegacion.
- [x] 2.2 Simplificar `integrations/opencode/agents/planner.md` para conservar la planificacion, la matriz de ejecucion, dependencias y validaciones sin protocolo de activacion externo; verificar que el contrato exige scope, exclusiones y criterios cuando correspondan y mantiene permisos read-only.
- [x] 2.3 Simplificar `integrations/opencode/agents/implementer.md` para conservar la ejecucion atomica, validacion local, correcciones dentro del alcance y salida factual; verificar que una subtarea generica no se bloquea por la ausencia de un identificador o skill auxiliar.
- [x] 2.4 Generalizar `integrations/opencode/agents/reviewer.md` para revisar diffs contra el objetivo, scope, restricciones y criterios recibidos, tanto en tareas genericas como contractuales; verificar que mantiene permisos read-only y devuelve findings accionables sin exigir un workflow formal.
- [x] 2.5 Simplificar `integrations/opencode/agents/integration-checker.md` para conservar la verificacion y correccion de fronteras entre modulos, contratos, consumidores y tests; verificar que mantiene permiso de edicion acotado y funciona con el contexto delegado recibido.

## 3. Recursos y documentacion

- [x] 3.1 Actualizar `integrations/opencode/README.md` para describir el toolkit portable, sus recursos instalables, la separacion frente a la configuracion del proyecto consumidor y la limpieza manual de recursos obsoletos; verificar que las instrucciones de sincronizacion ya no copian las skills eliminadas ni presentan activaciones obligatorias.
- [x] 3.2 Eliminar `integrations/opencode/skills/openspec-change-context-bootstrap/` y `integrations/opencode/skills/delegation-context/`; verificar que ninguno de los dos directorios ni sus archivos existe en el respaldo versionado y que los agentes no los referencian.

## 4. Verificacion integrada

- [x] 4.1 Comprobar que `integrations/opencode/AGENTS.md`, `integrations/opencode/agents/` y `integrations/opencode/README.md` no contienen referencias a activacion, identificadores, snapshots o skills del workflow retirado, usando una busqueda textual con resultado sin coincidencias; verificar por separado que `AGENTS.md` raiz y `openspec/` permanecen fuera del cambio.
- [x] 4.2 Revisar el conjunto de recursos portable y su correspondencia con las instrucciones de instalacion manual; verificar que los cinco agentes siguen presentes, que `opencode.jsonc` no cambia y que la lista documentada coincide con los archivos existentes.
- [x] 4.3 Ejecutar `openspec validate --specs` y `git diff --check`; verificar que la delta spec es valida, no hay errores de formato y los artifacts de planificacion siguen siendo coherentes.
