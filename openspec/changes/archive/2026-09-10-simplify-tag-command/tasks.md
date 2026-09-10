## 1. Reducir la interfaz y resolver la base

- [x] 1.1 Reescribir el contrato de argumentos para aceptar solo `--version <version>` y verificar que las opciones retiradas produzcan un resultado breve de argumento no soportado.
- [x] 1.2 Implementar la seleccion automatica del ultimo tag numerico alcanzable en `first-parent` y verificar con un repositorio temporal que, sin tags, se use toda la historia disponible con `v0.0.0` como base virtual.
- [x] 1.3 Mantener la inspeccion exclusivamente de lectura del repositorio y excluir del rango los cambios staged, unstaged y no trackeados; verificar que el estado de `HEAD` no sea modificado.

## 2. Analizar cambios y clasificar impacto

- [x] 2.1 Limitar el analisis a commits, rutas, estadisticas y diffs del rango base-`HEAD`; verificar que no se solicite ni se use contenido de areas no modificadas para decidir la version.
- [x] 2.2 Distinguir codigo de producto de documentacion, tests, configuracion, tooling e infraestructura mediante la evidencia del diff; verificar que codigo mezclado con documentacion sea versionable y documentacion pura no lo sea.
- [x] 2.3 Aplicar la escala `PATCH`, `MINOR` y `MAJOR` segun adaptacion del usuario, incluyendo los casos de boton o inputs, modal o componente, flujo central y modulo nuevo; verificar que la ambiguedad elija el nivel menor.

## 3. Calcular la propuesta y simplificar la salida

- [x] 3.1 Calcular el siguiente tag numerico con un minimo `PATCH` para codigo de producto y validar que `--version` use exactamente el numero recibido sin recalcularlo ni reutilizar un tag existente.
- [x] 3.2 Reducir la salida a base, version objetivo, impacto, estado breve, resumen agrupado y un unico comando manual de tag anotado apuntado al SHA completo de `HEAD`; verificar que no incluya changelog exhaustivo ni `git push`.
- [x] 3.3 Retirar del comando las reglas y ejemplos de `--base`, `--strict`, `--prerelease` y `--stable`; verificar que la documentacion final solo describa la interfaz reducida.

## 4. Validacion del cambio

- [x] 4.1 Ejecutar escenarios de validacion en repositorios Git temporales para cambios solo documentales, codigo interno, cambios localizados, cambios de componente, cambios drasticos, version explicita, ausencia de tags y working tree sucio; verificar cada resultado contra la especificacion.
- [x] 4.2 Ejecutar `openspec validate --specs` y revisar el diff final para confirmar que solo se modificaron el comando portable y los artifacts relacionados con este cambio.
