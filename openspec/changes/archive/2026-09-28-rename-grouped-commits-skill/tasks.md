# Tasks

## 1. Renombrar y aclarar la skill

- [x] 1.1 Renombrar `skills/ac-grouped-commits/` a `skills/ac-commit-proposal/` y actualizar `name` y la descripción; verificar que carpeta e identidad pública coinciden y que la skill presenta la propuesta como su resultado.
- [x] 1.2 Revisar las instrucciones de selección Git para que los archivos no rastreados ignorados no se enumeren ni inspeccionen y no aparezcan en `Exclusions`; verificar que la propuesta conserva `Exclusions: None` cuando no haya otras exclusiones elegibles.
- [x] 1.3 Añadir un ejemplo completo, rotulado como ilustrativo y con valores ficticios, que cubra todos los campos y bloques en el orden requerido; verificar que no se confunde con datos de una ejecución real.

## 2. Sincronizar evaluaciones y catálogo

- [x] 2.1 Actualizar `evals/evals.json` para usar `ac-commit-proposal` y evaluar la estructura completa de la propuesta; verificar que el JSON parsea y que los criterios cubren los campos obligatorios.
- [x] 2.2 Ajustar el caso de archivos ignorados para exigir que sus rutas no se enumeren ni aparezcan en la respuesta y que sus contenidos no se lean; verificar que el caso conserva cambios elegibles en la propuesta.
- [x] 2.3 Actualizar `skills/README.md`, sus comandos de instalación y el nombre de la carpeta documentado; verificar que las referencias activas de `skills/` ya no usan `ac-grouped-commits` y que el nombre nuevo aparece en el catálogo.

## 3. Actualizar el contrato OpenSpec

- [x] 3.1 Aplicar la delta a `openspec/specs/opencode-integration/spec.md`, incluido el inventario de nueve skills con `ac-dotnet-testing`; verificar el nuevo identificador, los escenarios de ejemplo e invisibilidad de ignorados y ejecutar `openspec validate --specs`.

## 4. Validación de integración

- [x] 4.1 Revisar las referencias activas al nombre anterior en la skill, catálogo, evaluaciones y especificaciones; verificar que no quedan referencias operativas obsoletas y que los artifacts archivados permanecen intactos.
- [x] 4.2 Ejecutar `openspec validate rename-grouped-commits-skill --strict` y revisar el diff final; verificar que todos los artifacts del cambio son válidos y no se han modificado otras skills ni configuraciones.
