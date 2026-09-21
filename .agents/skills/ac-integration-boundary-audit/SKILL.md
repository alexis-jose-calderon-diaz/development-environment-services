---
name: ac-integration-boundary-audit
description: Audita de forma read-only si las piezas de un cambio distribuido encajan entre sí. Activa esta skill cuando el usuario pida comprobar fronteras entre implementación, contratos, clientes o consumidores, modelos, persistencia, migraciones, salidas generadas y tests, o cuando necesite identificar incompatibilidades, bloqueos o decisiones de diseño antes de corregirlas. No la uses para implementar cambios, revisar estilo interno ni organizar commits.
---

# Integration Boundary Audit

Audita la coherencia entre las piezas directamente relacionadas con un cambio. El
objetivo es responder si las interfaces siguen encajando, no inspeccionar todo el
repositorio ni sustituir una revisión general de calidad.

## Límite read-only

No edites, crees, elimines ni formatees archivos. No apliques correcciones
automáticas aunque encuentres una incompatibilidad concreta. Informa la evidencia,
el impacto y la acción recomendada para que el usuario decida el siguiente paso.

Esta instrucción read-only es un contrato de comportamiento, no un aislamiento de
permisos del runtime: una skill se carga dentro del agente seleccionado. Si se
requiere una garantía efectiva de no modificación, el usuario debe ejecutar la
auditoría con un agente o modo cuyos permisos sean read-only.

No dependas de un prompt de orquestador, un `Scope` delegado, un `Analysis Report`,
un identificador OpenSpec ni una sesión previa. Trabaja con la petición actual, el
estado del repositorio y la evidencia que el usuario proporcione. No delegues el
trabajo a otros agentes.

## Procedimiento

1. **Delimita la auditoría.** Extrae el objetivo, el cambio o diff a comprobar, el
   alcance, las exclusiones, los criterios disponibles y las validaciones
   relevantes. Si falta información, inspecciona solo el contexto mínimo que pueda
   establecer la frontera; no inventes contratos ni asumas que una pieza funciona.
2. **Identifica la superficie.** Enumera los módulos, archivos modificados o
   relevantes, contratos afectados, modelos, almacenamiento, migraciones, salidas
   generadas, consumidores y tests. Prioriza el diff y las referencias directas.
3. **Traza cada frontera aplicable.** Compara nombres, tipos, parámetros,
   respuestas, formatos, versiones, rutas, comportamiento y errores entre ambos
   lados. Comprueba únicamente las fronteras necesarias para el cambio:
    implementación → contratos, contratos → consumidores, modelo → persistencia,
    persistencia → migraciones, modelo → salidas generadas, implementación → tests
    y salidas generadas → consumidores.
4. **Busca evidencia suficiente.** Usa lecturas, búsquedas y validaciones
   proporcionales. Distingue hechos observados de inferencias. Si una frontera no
   tiene evidencia suficiente, márcala `NO VERIFICADA` (o `NO APLICA` cuando no
   pertenezca a la superficie), nunca como éxito.
5. **Clasifica los resultados.** Reporta solo incompatibilidades respaldadas por
   evidencia. Asigna `CRITICAL`, `HIGH`, `MEDIUM` o `LOW`, e indica la frontera,
   rutas, evidencia concreta, impacto y acción recomendada. Una incompatibilidad
   que requiera cambiar una decisión pública, ampliar alcance, escoger entre
   diseños o autorizar una modificación es un bloqueo; no inventes una solución.
6. **Registra validaciones.** Ejecuta build, tests, generación, type checking,
   linting o comparación de salidas solo cuando aporten evidencia sobre una
   frontera. Registra el comando, la superficie cubierta y el resultado. Una
   validación ausente, fallida o invalidada por cambios posteriores no es un
   `PASS`.

### Estados y evidencia

`NO VERIFICADA` significa ausencia o insuficiencia de evidencia: no implica que
exista un defecto. Explica qué archivo, consumidor, resultado o validación falta y
no lo sustituyas por una inferencia. `FAIL` en una frontera significa una
incompatibilidad concreta demostrada por dos lados comparables. Si esa
incompatibilidad, o una compatibilidad de datos pendiente, exige elegir un diseño,
cambiar un contrato público, ampliar el alcance o recibir autorización, conserva
el hallazgo como bloqueo y usa `BLOCKED` para el estado global; no elijas por el
usuario. Una decisión explícitamente demostrada en el material auditado también
puede cerrar la frontera como `PASS`, pero una decisión pendiente es `BLOCKED`.

Calcula el estado global con esta precedencia:

1. `BLOCKED`: existe al menos un bloqueo de diseño, compatibilidad o autorización
   sin resolver, aunque otras fronteras pasen.
2. `FAIL`: existe una incompatibilidad demostrada que no requiere una decisión de
   diseño para actuar y no hay un bloqueo de mayor precedencia.
3. `PASS WITH WARNINGS`: no hay incompatibilidades ni bloqueos, pero queda al
   menos una frontera `NO VERIFICADA`, validación ausente o riesgo residual
   explícito.
4. `PASS`: todas las fronteras aplicables están verificadas y pasan, y no quedan
   hallazgos, validaciones relevantes ausentes ni riesgos pendientes.

No confundas `NO VERIFICADA` con `BLOCKED`: la primera describe lo que aún no se
pudo demostrar; la segunda describe una incompatibilidad o decisión pendiente ya
demostrada que impide cerrar la integración.

## Qué comprobar

- **Implementación → contratos:** firmas, tipos, estados, errores, versiones y
  comportamiento expuesto.
- **Contratos → consumidores:** clientes, adaptadores, comandos, endpoints,
  eventos o documentación que consuman nombres, formatos y respuestas.
- **Modelo → persistencia:** campos, nulabilidad, serialización, relaciones,
  índices y conversiones.
- **Persistencia → migraciones:** esquema esperado, orden, defaults, reversibilidad
  cuando aplique y compatibilidad con datos existentes.
- **Modelo → salidas generadas:** campos, tipos, nulabilidad, nombres,
  serialización y cualquier otra representación que el generador deba producir.
- **Implementación → tests:** casos que realmente ejerciten la interfaz cambiada,
  aserciones coherentes y brechas de cobertura relevantes.
- **Salidas generadas → consumidores:** archivos, código, artefactos o reportes
  producidos; formato, ubicación, nombres y consumidores que dependan de ellos.

No conviertas la auditoría en una inspección de estilo, refactor, seguridad
genérica o implementación. No reportes problemas hipotéticos sin una ruta,
contrato, resultado o referencia concreta que los sustente.

El estilo queda fuera de alcance aunque sea inconsistente. Solo entra en la
auditoría si el supuesto problema de estilo cambia una interfaz o contrato que
otro componente consume (por ejemplo, nombre, tipo, formato, ruta o serialización);
en ese caso reporta el efecto de compatibilidad, no una preferencia estética.

## Informe

Devuelve un informe conciso con esta estructura. Conserva `/` como separador y usa
rutas válidas con los directorios necesarios.

```markdown
# Integration Boundary Audit

## Estado

`PASS` | `PASS WITH WARNINGS` | `FAIL` | `BLOCKED`

Aplica la precedencia definida arriba. No uses `FAIL` o `BLOCKED` para rellenar
evidencia ausente: una frontera sin prueba es `NO VERIFICADA` y normalmente deja
el estado global en `PASS WITH WARNINGS`, salvo que exista además un bloqueo.

## Bloqueos

- `None`, o cada bloqueo con causa concreta, evidencia, superficie afectada y
  decisión o acción requerida.

## Superficie verificada

- Módulos:
- Archivos modificados o relevantes:
- Contratos:
- Modelos y persistencia:
- Migraciones:
- Salidas generadas:
- Consumidores:
- Tests:

## Fronteras verificadas

- Implementación → Contratos: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Contratos → Consumidores: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Modelo → Persistencia: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Persistencia → Migraciones: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Modelo → Salidas generadas: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Implementación → Tests: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`
- Salidas generadas → Consumidores: `PASS` | `FAIL` | `NO VERIFICADA` | `NO APLICA`

## Hallazgos

Para cada hallazgo incluye:

- severidad: `CRITICAL` | `HIGH` | `MEDIUM` | `LOW`
- frontera:
- archivos:
- descripción:
- evidencia:
- impacto:
- acción recomendada:

Escribe `Ninguno` cuando no haya hallazgos.

## Validaciones ejecutadas

- comando: resultado y superficie cubierta

## Riesgos pendientes

- Riesgos residuales, incertidumbres o brechas de evidencia; `Ninguno` si no
  quedan.

## Resumen para el usuario

Estado general, fronteras no verificadas, bloqueos, siguiente decisión o acción
recomendada. No afirmes correcciones aplicadas: esta skill nunca modifica archivos.
```

Cuando el contexto no permita auditar una frontera, explica qué evidencia falta y
qué tendría que aportar el usuario o una futura validación. Si una incompatibilidad
requiere una decisión de diseño, conserva el estado `BLOCKED` aunque las demás
fronteras pasen.
