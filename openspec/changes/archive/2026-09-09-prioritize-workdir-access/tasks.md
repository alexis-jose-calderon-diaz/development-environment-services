## 1. Regla comun

- [x] 1.1 Actualizar `integrations/opencode/AGENTS.md` para priorizar el `workdir`, permitir acceso externo solo como ultimo recurso necesario y exigir que sea minimo y justificado; verificar la redaccion contra el delta de `opencode-integration`.

## 2. Contratos de agentes

- [x] 2.1 Retirar las exigencias de rutas relativas de `analyzer.md`, `planner.md` y `reviewer.md` sin alterar sus responsabilidades ni permisos; verificar que sus contratos sigan conservando sus formatos de salida.
- [x] 2.2 Retirar las exigencias de rutas relativas de `implementer.md` e `integration-checker.md` sin alterar sus limites de edicion; verificar que sus contratos sigan exigiendo archivos y resultados identificables.

## 3. Validacion

- [x] 3.1 Ejecutar `openspec validate --specs` y una busqueda acotada en los seis archivos portables para confirmar que no quede una exigencia normativa de rutas relativas y que la regla de `workdir` permanezca coherente.
