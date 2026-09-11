## 1. Delimitar la extensión sobre la skill

- [x] 1.1 Reorganizar `integrations/opencode/commands/commit.md` para declarar `git-commit` como base de Conventional Commits, análisis general, type/scope, breaking changes y mecánica general, y eliminar únicamente las explicaciones generales duplicadas; verificar el diff contra la skill y confirmar que las capacidades locales siguen expresadas.
- [x] 1.2 Mantener las reglas de argumentos, preflight, contenido no confiable y restricciones Git locales; verificar con escenarios de opciones desconocidas, detached HEAD, conflictos y operaciones Git en curso que el flujo se detiene antes de escribir.
- [x] 1.3 Confirmar que no se modifica ninguna copia de `git-commit` ni se añade un campo de composición no soportado al frontmatter; verificar con `git diff --name-status` limitado al command y comparación de hash de la skill.

## 2. Aplicar selección y agrupación local

- [x] 2.1 Preservar el modo `--staged` como un único commit del index y bloquear el modo normal cuando exista staging; verificar en repositorios Git temporales que no se ejecuta `git add`, no se divide el index y los cambios unstaged o untracked permanecen intactos.
- [x] 2.2 Definir en el command la agrupación de archivos completos por intención, la separación de cambios independientes y el bloqueo ante archivos con hunks de intenciones separables; verificar escenarios con backend/frontend, tests, documentación y tooling independientes o coherentes.
- [x] 2.3 Documentar la permanencia conjunta de fuentes y archivos generados, y de contratos compartidos con consumidores cuando formen una unidad incompleta al separarlos; verificar la regla mediante una revisión dirigida del command y casos representativos.
- [x] 2.4 Restringir el staging del working tree a rutas explícitas de cada grupo aprobado, sin patrones globales ni staging parcial automático; verificar que nunca aparecen `git add .`, `git add -A`, `git add -u` ni `git add -p` en el flujo local y que el index coincide con el grupo antes del commit.

## 3. Formalizar plan, seguridad y ejecución

- [x] 3.1 Incorporar la plantilla exacta de propuesta con modo, branch, upstream, cantidad, bloques consecutivos de commits, intención, mensaje, cambios, pendientes y advertencias; verificar estados Git, rutas `./`, renombrados y orden lexicográfico conforme a la spec.
- [x] 3.2 Mantener mensajes con type en inglés, descripción y body en español, scope sustentado por evidencia y un único mensaje exacto por commit; verificar propuestas con y sin body, footer y breaking change sin alterar la sintaxis normativa.
- [x] 3.3 Hacer obligatoria la llamada a `question` inmediatamente después de la propuesta con las opciones exactas `Crear commits`, `Ajustar plan` y `Cancelar`; verificar que ninguna escritura ocurre antes de `Crear commits` y que cualquier ajuste reconstruye el plan completo.
- [x] 3.4 Añadir la captura y revalidación del estado relevante y del index después de confirmar y antes de cada escritura; verificar que cualquier cambio concurrente invalida el plan sin reconciliación automática ni continuación.
- [x] 3.5 Reemplazar la autorización explícita de secretos por la política local de exclusión en working tree y detención en `--staged`, sin mostrar valores; verificar rutas sospechosas por nombre y por evidencia de contenido sin búsquedas globales.
- [x] 3.6 Mantener hooks y firma, prohibir `--no-verify`, amend y correcciones automáticas ante fallos, y verificar después de cada commit SHA corto, mensaje, rutas y estado residual antes de continuar.

## 4. Revisión final del command

- [x] 4.1 Releer completamente el command refactorizado y compararlo de nuevo con la skill externa, la delta spec y el design; verificar que la skill no fue modificada, que no desapareció ninguna política propia y que las duplicaciones eliminadas no eran restricciones locales.
- [x] 4.2 Revisar que el command no ejecute ni afirme ejecutar build, tests, lint, format, type-check, migraciones, generación de clientes, instalaciones o servicios; verificarlo mediante una búsqueda dirigida de instrucciones y comandos prohibidos.
- [x] 4.3 Validar la implementación y los artifacts con OpenSpec y registrar explícitamente las comprobaciones no ejecutadas, sin crear commits ni sincronizar automáticamente la copia instalada bajo `~/.config/opencode/`.
