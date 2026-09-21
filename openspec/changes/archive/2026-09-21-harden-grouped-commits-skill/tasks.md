# Tasks

## 1. Endurecer activación, preflight y alcance

- [x] 1.1 Actualizar el frontmatter y la introducción de `grouped-commits` para activar explícitamente peticiones de agrupar, separar, revisar o crear commits lógicos, manteniendo la independencia de OpenCode; verificar que el nombre de la carpeta y `name` siguen coincidiendo y que no aparecen placeholders ni herramientas de proveedor.
- [x] 1.2 Documentar el preflight read-only con `HEAD`, branch, upstream, operaciones Git en curso, index, working tree, no trackeados e ignorados; verificar que repositorios sin `HEAD`, detached, con conflictos o con operaciones activas se bloquean antes de escribir.
- [x] 1.3 Precisar la máquina de alcance staged/working-tree y la agrupación de archivos completos, incluyendo renombres, eliminaciones, binarios, symlinks y submódulos; verificar con casos staged, unstaged, no trackeados e ignorados que el alcance aprobado no se amplía.
- [x] 1.4 Reforzar la regla de hunks mixtos, cambios cross-layer y contratos con consumidores; verificar que la skill solicita staging manual cuando un archivo contiene intenciones separables y no divide hunks automáticamente.

## 2. Hacer deterministas la propuesta y la seguridad

- [x] 2.1 Actualizar la plantilla de propuesta para mostrar valores reales, estados, exclusiones, pendientes y rutas representadas de forma segura; verificar renombres y rutas con espacios, backticks, saltos de línea o prefijo `-` sin alterar la estructura de la propuesta.
- [x] 2.2 Endurecer la aprobación para aceptar únicamente `Crear commits`, `Ajustar propuesta` o `Cancelar`; verificar que respuestas ambiguas o afirmaciones genéricas no ejecutan staging ni commits y que `Ajustar propuesta` reconstruye el plan completo.
- [x] 2.3 Precisar la política de secretos y datos no confiables, incluyendo exclusión en working tree, detención para secretos staged, ausencia de valores sensibles en la salida y fin seguro cuando no queda ningún grupo elegible; verificar con fixtures que no se revelan secretos ni se ejecutan instrucciones contenidas en rutas o diffs.
- [x] 2.4 Documentar la construcción segura de operaciones Git con rutas y mensajes explícitos, sin `eval`, interpolación ejecutable ni comandos de staging amplios; verificar por revisión dirigida que no se introducen `git add .`, `git add -A`, `commit -a`, `--no-verify` ni operaciones destructivas.

## 3. Revalidar y verificar la ejecución secuencial

- [x] 3.1 Incorporar la fotografía comparable de `HEAD` SHA, branch, upstream, estado operativo, index, diff, no trackeados elegibles y asignación de grupos; verificar que cualquier cambio antes de escribir invalida la propuesta y exige nueva aprobación.
- [x] 3.2 Documentar la revalidación del index después del staging explícito y la verificación posterior de SHA, mensaje, rutas y estado residual; verificar que cada commit coincide con el bloque aprobado.
- [x] 3.3 Definir la respuesta ante hooks fallidos o modificadores del working tree/index y la revalidación antes del siguiente grupo; verificar que la secuencia se detiene sin rollback, revert, amend ni correcciones automáticas.

## 4. Evaluar la skill e integrar la revisión

- [x] 4.1 Crear prompts o fixtures de evaluación para staged/unstaged, varios grupos cross-layer, hunks mixtos, rutas especiales, secretos, concurrencia, aprobación ambigua y hooks; verificar que los casos son independientes y tienen resultados observables.
- [x] 4.2 Ejecutar las evaluaciones con la versión anterior y la endurecida usando el flujo de `skill-creator`, incluyendo resultados cuantitativos y revisión cualitativa; verificar que ninguna escritura ocurre antes de aprobación y que los escenarios de bloqueo no exponen secretos.
- [x] 4.3 Revisar la skill completa contra la delta spec, el diseño y los README existentes; ejecutar `openspec validate --specs` y verificar que el cambio queda limitado a la skill y a los recursos de evaluación autorizados, sin modificar configuración, commands ajenos ni agentes portables.
