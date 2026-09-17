## 1. Actualizar el contrato del comando

- [x] 1.1 Añadir `## Fin de propuesta` al formato de propuesta de `integrations/opencode/commands/commit.md` y verificar que aparece después de `## Advertencias`.
- [x] 1.2 Ajustar la instrucción de confirmación para invocar `question` después del marcador, manteniendo las opciones exactas y verificando que no se repitan archivos ni el plan detallado.

## 2. Verificar los flujos de confirmación

- [x] 2.1 Revisar los flujos `working-tree`, `staged` y `Ajustar plan` y verificar que cada propuesta termina con el marcador antes de la confirmación.
- [x] 2.2 Ejecutar una comprobación controlada del command y verificar que la propuesta visible conserva todas las rutas, que `question` permanece breve y que no se ejecuta Git antes de `Crear commits`.

## 3. Sincronizar la instalación operativa

- [x] 3.1 Comparar el respaldo versionado con `~/.config/opencode/commands/commit.md` y verificar las diferencias antes de copiar.
- [x] 3.2 Sincronizar manualmente la copia operativa si corresponde, reiniciar OpenCode y verificar que carga el formato actualizado.
