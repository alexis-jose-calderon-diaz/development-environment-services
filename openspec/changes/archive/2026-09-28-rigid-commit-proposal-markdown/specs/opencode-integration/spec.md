# Spec Delta

## MODIFIED Requirements

### Requirement: Propuesta completa sin interacción

Antes de terminar, la skill SHALL mostrar una propuesta completa con los valores
reales de alcance (`index` o `working-tree`), branch, upstream, cantidad de
commits, intención, mensaje exacto, estado Git y rutas de cada commit, además de
pendientes, exclusiones y advertencias. `Exclusions` SHALL contener únicamente
rutas elegibles excluidas por razones de seguridad o bloqueo, sin revelar
valores sensibles, o `None` cuando no existan. Los archivos ignorados por Git
SHALL permanecer invisibles y no SHALL aparecer en ninguna sección.
Las rutas SHALL conservar la identidad y el estado reales de renombres,
eliminaciones, binarios, symlinks y submódulos; su representación no SHALL
inventar archivos ni borrar esos estados.

La propuesta SHALL usar Markdown normal, no SHALL estar envuelta en un bloque de
código y SHALL conservar exactamente estos encabezados de sección, etiquetas y
orden: `## Commit Proposal`; metadatos `Scope`, `Branch`, `Upstream` y `Commits`;
un bloque consecutivo `### Commit N` por cada commit; y las secciones `## Pending`,
`## Exclusions` y `## Warnings`. Los valores de `Scope`, `Branch` y `Upstream`
SHALL aparecer entre backticks cuando sean observados; el literal `None` SHALL
aparecer sin backticks. `Commits` SHALL ser el conteo decimal que corresponde a
los bloques. Cada bloque de commit SHALL incluir, en este orden, `Intent`,
`Message` y `Git states and paths`. Cada sección final SHALL contener una lista
Markdown de elementos o el literal `None`, sin viñeta, cuando esté vacía.

El mensaje exacto SHALL aparecer debajo de `Message:` en un bloque cercado con
etiqueta `text`. El fence SHALL usar al menos tres tildes y ser más largo que
cualquier secuencia consecutiva de tildes presente en el mensaje, para que el
contenido multilínea, el body y los trailers se conserven sin cerrar el bloque
antes de tiempo.

Cada estado Git SHALL aparecer como código inline. Cada ruta SHALL aparecer
como una cadena JSON entre backticks, SHALL empezar por `./` y SHALL usar los
escapes JSON correspondientes para comillas, barras inversas y caracteres de
control; los backticks SHALL representarse como `\u0060`. Cada renombre SHALL
conservarse en un único elemento de lista con sus rutas de origen y destino como
cadenas JSON separadas por ` → `. Las rutas SHALL representarse de forma segura
y estable sin permitir que espacios, backticks, saltos de línea o un prefijo
`-` alteren la estructura ni se conviertan en comandos.

La definición de la skill SHALL incluir un ejemplo completo del formato de
propuesta y al menos dos variantes breves. Todos los ejemplos SHALL estar
marcados como ilustrativos y usar valores ficticios, sin permitir que se
confundan con observaciones de una ejecución real. En conjunto, SHALL mostrar
una propuesta `working-tree` con varios grupos, el alcance `index` con cambios
pendientes y el tratamiento de mensajes multilínea o rutas/estados especiales.

La skill SHALL terminar directamente después del contenido de `## Warnings`. No
SHALL añadir un marcador de cierre, texto posterior, pregunta, opciones de
aprobación ni solicitud de confirmación mediante una herramienta.

#### Scenario: Estructura Markdown exacta

- **WHEN** la skill entrega una propuesta completa
- **THEN** usa Markdown normal con los encabezados, etiquetas, orden, listas y
  representación de secciones vacías definidos, sin envolver la propuesta en
  otro bloque de código

#### Scenario: Propuesta de varios grupos

- **WHEN** el working tree contiene varias intenciones independientes
- **THEN** la propuesta muestra un bloque consecutivo por commit, con un mensaje
  exacto en un bloque `text` y rutas completas en listas Markdown, y termina
  después de `## Warnings`

#### Scenario: Propuesta del index

- **WHEN** el alcance es el index
- **THEN** la propuesta muestra exactamente un commit, no incluye cambios
  unstaged ni no trackeados en él, y representa esos cambios fuera del plan en
  `## Pending`

#### Scenario: Mensaje multilínea

- **WHEN** un mensaje propuesto contiene body o trailers como `BREAKING CHANGE`
- **THEN** la skill conserva el mensaje completo y su orden dentro de un bloque
  `text` cuyo fence de tildes no puede cerrarse con contenido del mensaje

#### Scenario: Ruta con representación especial

- **WHEN** una ruta contiene espacios, backticks, saltos de línea, comillas,
  barras inversas o comienza por `-`
- **THEN** la skill la presenta como cadena JSON entre backticks con los escapes
  requeridos y no permite que altere la estructura ni se convierta en una
  instrucción o comando

#### Scenario: Renombre en una ruta de propuesta

- **WHEN** un cambio elegible es un renombre
- **THEN** aparece como una sola entrada con su estado real y las cadenas JSON
  separadas de las rutas de origen y destino

#### Scenario: Terminación directa

- **WHEN** la propuesta completa ya fue presentada
- **THEN** la skill termina después del contenido de `## Warnings` sin invocar
  herramientas de confirmación, pedir aprobación, añadir texto ni mostrar
  `## Fin de propuesta`

#### Scenario: Ejemplo ilustrativo del formato

- **WHEN** un usuario o mantenedor consulta la definición de
  `ac-commit-proposal`
- **THEN** encuentra un ejemplo completo y al menos dos variantes breves con
  valores ficticios claramente marcados, que cubren working-tree, index con
  pendientes y casos multilínea o de rutas/estados especiales

#### Scenario: Exclusiones sin archivos ignorados

- **WHEN** hay cambios ignorados por Git pero no hay rutas elegibles excluidas
  por seguridad o bloqueo
- **THEN** la propuesta no revela rutas ignoradas y `Exclusions` muestra `None`
