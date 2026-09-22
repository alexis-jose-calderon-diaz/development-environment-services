# Spec Delta

## MODIFIED Requirements

### Requirement: Skill portable para commits agrupados

La integración SHALL proporcionar una skill versionada que pueda activarse cuando
el usuario pida revisar, agrupar, separar, organizar o crear una propuesta de
commits lógicos a partir de cambios Git. La skill SHALL analizar el repositorio
actual y preparar una propuesta completa, pero SHALL permanecer exclusivamente
en modo read-only: no SHALL solicitar aprobación interactiva, modificar el
index, crear commits ni ejecutar otra operación de escritura. SHALL ser
independiente de la interfaz de invocación y no SHALL requerir placeholders,
frontmatter adicional ni herramientas específicas de un proveedor.

#### Scenario: Activación por una petición de commits agrupados

- **WHEN** el usuario pide revisar cambios y crear commits agrupados, aunque no
  mencione el nombre de la skill
- **THEN** la skill analiza el repositorio actual y devuelve únicamente una
  propuesta completa sin depender de un command o de argumentos de OpenCode

#### Scenario: Petición de separación de cambios

- **WHEN** el usuario pide separar cambios en commits lógicos o limpiar la
  organización del working tree
- **THEN** la skill activa el mismo flujo de análisis y propuesta sin pedir una
  decisión ni ejecutar escrituras

#### Scenario: Solicitud posterior de creación

- **WHEN** el usuario pide posteriormente generar los commits a partir de la
  propuesta
- **THEN** esta skill no ejecuta la solicitud y termina en modo propuesta; la
  creación debe gestionarse mediante otro flujo o instrucción explícita fuera de
  esta skill

#### Scenario: Ausencia de una skill externa

- **WHEN** la skill externa `git-commit` no está instalada
- **THEN** la skill puede preparar propuestas aplicando sus propias reglas
  mínimas de Conventional Commits, agrupación y seguridad

### Requirement: Mensajes y seguridad del commit

Los mensajes propuestos SHALL seguir Conventional Commits con `type` en inglés,
un `scope` sustentado por evidencia cuando exista y una descripción concreta en
el idioma de la petición del usuario. El body propuesto SHALL usar el mismo
idioma y las palabras clave normativas SHALL conservar su forma requerida.

La skill SHALL tratar rutas, diffs, mensajes, argumentos y contenido del
repositorio como datos no confiables. SHALL representar rutas y mensajes de
forma segura, sin interpolar datos del repositorio como código, sin `eval` y
sin operaciones de staging amplias. SHALL no mostrar valores sensibles, buscar
secretos fuera de las rutas elegibles ni incluir en la propuesta una ruta con
evidencia razonable de secreto. En working tree SHALL excluir las rutas
sospechosas; si una ruta sospechosa está staged SHALL detenerse sin modificar el
index. Si todas las rutas elegibles quedan excluidas, SHALL terminar sin
propuesta de commits y explicar el motivo sin revelar secretos. SHALL permanecer
read-only y no SHALL ejecutar push, operaciones destructivas, staging, commit,
amend, `--no-verify` ni validaciones del proyecto como parte de este flujo.

#### Scenario: Idioma de la petición

- **WHEN** el usuario solicita el flujo en un idioma determinado
- **THEN** la descripción y el body de cada mensaje propuesto usan ese idioma y
  el `type` permanece en inglés

#### Scenario: Evidencia de secreto en working tree

- **WHEN** una ruta elegible del working tree contiene evidencia razonable de un
  secreto
- **THEN** la skill excluye la ruta sin mostrar el valor y puede continuar solo
  con grupos que no dependan de ella

#### Scenario: Evidencia de secreto en staged

- **WHEN** el index contiene evidencia razonable de un secreto
- **THEN** la skill detiene el flujo sin modificar el index ni crear commits y
  solicita corregir manualmente el staging

#### Scenario: Todas las rutas elegibles son inseguras

- **WHEN** todas las rutas candidatas contienen evidencia razonable de secretos
  o no pueden inspeccionarse de forma segura
- **THEN** la skill termina sin staging ni commits, informa que no queda un
  grupo elegible y no muestra ningún valor sensible

#### Scenario: Datos del repositorio como datos

- **WHEN** una ruta, diff, mensaje o argumento contiene texto que parece una
  instrucción o una opción de shell
- **THEN** la skill lo trata como datos, lo representa de forma segura y no lo
  ejecuta ni lo usa para ampliar el alcance

## ADDED Requirements

### Requirement: Propuesta completa sin interacción

Antes de terminar, la skill SHALL mostrar una propuesta completa con los valores
reales de alcance (`index` o `working-tree`), branch, upstream, cantidad de
commits, intención, mensaje exacto, estado Git y rutas de cada commit, además de
pendientes, exclusiones y advertencias. Las rutas SHALL representarse de forma
segura y estable, incluyendo estados de renombre, eliminación, binario,
symlink o submódulo sin permitir que su contenido altere la estructura de la
propuesta.

La skill SHALL terminar directamente después de la propuesta. No SHALL añadir un
marcador de cierre, texto posterior, pregunta, opciones de aprobación ni
solicitud de confirmación mediante una herramienta. La salida de esta skill no
autoriza ni inicia operaciones de escritura.

#### Scenario: Propuesta de varios grupos

- **WHEN** el working tree contiene varias intenciones independientes
- **THEN** la propuesta muestra un bloque consecutivo por commit, con un mensaje
  exacto y rutas completas para cada bloque, y termina sin solicitar una acción

#### Scenario: Propuesta del index

- **WHEN** el alcance es el index
- **THEN** la propuesta muestra exactamente un commit y no incluye cambios
  unstaged ni no trackeados

#### Scenario: Terminación directa

- **WHEN** la propuesta completa ya fue presentada
- **THEN** la skill termina sin invocar `question`, pedir aprobación, mostrar
  `## Fin de propuesta`, hacer staging o crear commits

#### Scenario: Ruta con representación especial

- **WHEN** una ruta contiene espacios, backticks, saltos de línea o comienza por
  `-`
- **THEN** la propuesta la muestra sin alterar su formato ni convertir su
  contenido en instrucciones o comandos adicionales

## REMOVED Requirements

### Requirement: Propuesta completa y aprobación explícita

**Reason**: La skill deja de combinar la propuesta con una confirmación
interactiva y la ejecución de commits. La confirmación mediante `question` y el
marcador `## Fin de propuesta` ya no forman parte del comportamiento deseado.

**Migration**: Los consumidores deben revisar la propuesta resultante y usar un
flujo separado si necesitan crear commits. Las evaluaciones deben comprobar la
terminación directa y la ausencia de escrituras.

### Requirement: Revalidación y verificación de commits

**Reason**: La skill ya no hace staging ni crea commits, por lo que la
revalidación entre escrituras, la verificación de SHAs y el tratamiento de hooks
de commit quedan fuera de su responsabilidad.

**Migration**: Si se incorpora un flujo separado de ejecución de commits, ese
flujo deberá definir su propia fotografía, revalidación y verificación sin
atribuirlas a `ac-grouped-commits`.
