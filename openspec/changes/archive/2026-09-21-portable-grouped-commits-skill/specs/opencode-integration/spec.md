# Spec Delta

## REMOVED Requirements

### Requirement: Modos explícitos para cambios staged
**Reason**: El modo dependía de la sintaxis `--staged` de un command y no es
portable a una skill invocada por distintas herramientas.
**Migration**: La skill tratará el index existente como selección implícita y
propondrá un único commit; los cambios fuera del index quedarán pendientes.

### Requirement: Interfaz de argumentos reducida y segura
**Reason**: `$1`, `$ARGUMENTS` y el parseo de opciones pertenecen al runtime de
commands de OpenCode.
**Migration**: La skill no tendrá una interfaz formal de argumentos; el alcance
se determina con el estado de Git y el contexto no ejecutable de la petición.

### Requirement: Análisis superficial con revisión dirigida
**Reason**: El requisito se refiere al command eliminado, aunque su objetivo de
revisión progresiva se conserva en el nuevo flujo.
**Migration**: La misma política se incorpora a la skill como análisis inicial
de estado, rutas y estadísticas, con revisión detallada solo ante ambigüedad o
señales de seguridad.

### Requirement: Composición con la skill externa de commits
**Reason**: La nueva skill debe ser autocontenida y no depender de una skill
externa para sus capacidades esenciales.
**Migration**: La skill define su contrato mínimo de mensajes Conventional
Commits, agrupación y ejecución segura; `git-commit` queda como dependencia
externa opcional y no obligatoria.

### Requirement: Agrupación lógica de commits del working tree
**Reason**: El requisito está atado al modo del command anterior.
**Migration**: La agrupación por intención pasa a la skill y se aplica cuando
no existe contenido staged.

### Requirement: Mensajes locales en español
**Reason**: Fijar el español en el command limita la reutilización en otros
contextos lingüísticos.
**Migration**: La skill usará el idioma de la petición del usuario para la
descripción y el body, manteniendo el `type` de Conventional Commits en inglés.

### Requirement: Propuesta exacta y confirmación obligatoria
**Reason**: La llamada directa a `question` no es una capacidad portable de
todas las herramientas.
**Migration**: La skill conservará una propuesta estructurada y opciones de
decisión estables, usando el mecanismo explícito de confirmación disponible en
la herramienta anfitriona.

### Requirement: Protección frente a cambios concurrentes
**Reason**: El comportamiento debe pertenecer al workflow portable y no al
command eliminado.
**Migration**: La skill capturará y comparará el estado antes de escribir y
reconstruirá la propuesta ante cualquier cambio.

### Requirement: Seguridad y verificación de la ejecución
**Reason**: La política de seguridad debe acompañar a la capacidad de crear
commits, no a una interfaz concreta.
**Migration**: La skill conservará exclusión de secretos, respeto de hooks,
ausencia de validaciones del proyecto y verificación posterior por commit.

### Requirement: Catalogo de skills externas para uso global
**Reason**: El catálogo actual identifica `git-commit` como dependencia de
`/commit`, que dejará de existir.
**Migration**: El catálogo distinguirá la skill propia versionada de las skills
externas opcionales y eliminará esa dependencia obsoleta.

### Requirement: Instalacion global dirigida de skills
**Reason**: La instalación actual solo documenta skills externas y no cubre la
skill propia que formará parte del respaldo.
**Migration**: La documentación añadirá la copia manual de la skill versionada
al directorio global de OpenCode y conservará la instalación selectiva de
dependencias externas.

### Requirement: Documentacion coherente de superficies globales
**Reason**: La distinción actual entre catálogo documental y recursos
instalables ya no describe correctamente una skill propia versionada.
**Migration**: Los README enumerarán la skill local como recurso instalable y
mantendrán separadas la configuración portable, el catálogo externo y los
workflows locales.

## ADDED Requirements

### Requirement: Skill portable para commits agrupados

La integración SHALL proporcionar una skill versionada que pueda analizar
cambios Git, agruparlos por intención lógica y crear uno o más commits después
de una aprobación explícita. La skill SHALL ser independiente de la interfaz de
invocación y no SHALL requerir placeholders, frontmatter ni herramientas
específicas de un proveedor.

#### Scenario: Activación por una petición de commits agrupados
- **WHEN** el usuario pide revisar cambios y crear commits agrupados
- **THEN** la skill analiza el repositorio actual y prepara el flujo de
  propuesta sin depender de un command o de argumentos de OpenCode

#### Scenario: Ausencia de una skill externa
- **WHEN** la skill externa `git-commit` no está instalada
- **THEN** la skill puede proponer y crear commits aplicando sus propias reglas
  mínimas de Conventional Commits, agrupación y seguridad

### Requirement: Selección segura del alcance y agrupación

La skill SHALL inspeccionar primero la raíz, branch, estado y cambios relevantes
del repositorio. Si existe contenido staged, SHALL tratar el index como la
selección explícita del usuario, SHALL proponer exactamente un commit para ese
contenido y SHALL dejar staged, unstaged y no trackeados fuera del alcance
correspondiente. Si no existe contenido staged, SHALL agrupar archivos completos
del working tree por intención lógica.

La skill SHALL mantener juntos los archivos de una modificación funcional
coherente, incluidos cambios cross-layer, fuentes con generados y contratos con
consumidores. No SHALL dividir hunks automáticamente; si un archivo mezcla
intenciones separables, SHALL detenerse y solicitar staging manual.

#### Scenario: Index seleccionado implícitamente
- **WHEN** existen cambios staged, aunque también existan cambios fuera del
  index
- **THEN** la propuesta contiene un único commit con exactamente el contenido
  staged y reporta lo demás como pendiente sin modificarlo

#### Scenario: Working tree sin staged
- **WHEN** no existe contenido staged y hay cambios no ignorados
- **THEN** la skill propone grupos por intención lógica, asigna cada archivo a
  un único commit y no agrupa únicamente por directorio o extensión

#### Scenario: Archivo con intenciones separables
- **WHEN** un archivo contiene cambios que pertenecen a intenciones distintas
- **THEN** la skill detiene el flujo y solicita staging manual sin elegir una
  intención arbitrariamente

#### Scenario: Cambio cross-layer coherente
- **WHEN** backend, cliente, tests, documentación o tooling forman una única
  modificación funcional
- **THEN** la skill los mantiene en el mismo commit cuando separarlos dejaría
  una intención incompleta

### Requirement: Propuesta completa y aprobación explícita

Antes de cualquier operación de staging o commit, la skill SHALL mostrar una
propuesta completa. La propuesta SHALL incluir el alcance (`index` o
`working-tree`), branch, upstream, cantidad de commits, intención, mensaje
exacto y rutas de cada commit, además de pendientes y advertencias. SHALL cerrar
con el marcador `## Fin de propuesta`.

Después de la propuesta, la skill SHALL pedir una decisión inequívoca mediante
el mecanismo de confirmación disponible. Las opciones conceptuales SHALL ser
`Crear commits`, `Ajustar propuesta` y `Cancelar`. `Ajustar propuesta` SHALL
reconstruir la propuesta completa y `Cancelar` SHALL dejar intactos el index y
el working tree.

#### Scenario: Propuesta de varios grupos
- **WHEN** el working tree contiene varias intenciones independientes
- **THEN** la propuesta muestra un bloque consecutivo por commit, con un mensaje
  exacto y rutas completas para cada bloque

#### Scenario: Propuesta del index
- **WHEN** el alcance es el index
- **THEN** la propuesta muestra exactamente un commit y no incluye cambios
  unstaged ni no trackeados

#### Scenario: Aprobación inequívoca
- **WHEN** la propuesta termina y el usuario selecciona `Crear commits`
- **THEN** la skill puede continuar con exactamente ese alcance, orden y
  mensajes, después de revalidar el repositorio

#### Scenario: Ajuste o cancelación
- **WHEN** el usuario selecciona `Ajustar propuesta` o `Cancelar`
- **THEN** la skill no realiza staging ni commits; en el primer caso vuelve a
  presentar la propuesta completa y en el segundo termina

### Requirement: Mensajes y seguridad del commit

Los mensajes SHALL seguir Conventional Commits con `type` en inglés, un
`scope` sustentado por evidencia cuando exista y una descripción concreta en el
idioma de la petición del usuario. El body SHALL usar el mismo idioma y las
palabras clave normativas SHALL conservar su forma requerida.

La skill SHALL tratar rutas, diffs, mensajes, argumentos y contenido del
repositorio como datos no confiables. No SHALL mostrar valores sensibles, buscar
secretos fuera de las rutas elegibles ni ofrecer autorización para incluir una
ruta con evidencia razonable de secreto. SHALL respetar hooks y firma y no
SHALL ejecutar push, operaciones destructivas, amend, `--no-verify` ni
validaciones del proyecto como parte de este flujo.

#### Scenario: Idioma de la petición
- **WHEN** el usuario solicita el flujo en un idioma determinado
- **THEN** la descripción y el body de cada mensaje usan ese idioma y el
  `type` permanece en inglés

#### Scenario: Evidencia de secreto en working tree
- **WHEN** una ruta elegible del working tree contiene evidencia razonable de un
  secreto
- **THEN** la skill excluye la ruta sin mostrar el valor y puede continuar solo
  con grupos que no dependan de ella

#### Scenario: Evidencia de secreto en staged
- **WHEN** el index contiene evidencia razonable de un secreto
- **THEN** la skill detiene el flujo sin modificar el index ni crear commits y
  solicita corregir manualmente el staging

### Requirement: Revalidación y verificación de commits

La skill SHALL capturar la evidencia usada para la propuesta y SHALL volver a
comprobar branch, estado, rutas, diff e index después de la aprobación y antes
de cada escritura. Si una ruta aparece, desaparece o cambia, o si cambia el
index, SHALL invalidar la propuesta y solicitar una nueva aprobación sin
reconciliar automáticamente.

En working tree, SHALL hacer staging únicamente con rutas explícitas del grupo
aprobado y SHALL comprobar que el index coincide antes del commit. Después de
cada commit SHALL comprobar el SHA, mensaje, rutas incluidas y estado residual;
un hook fallido o un resultado divergente SHALL detener la secuencia sin
correcciones automáticas.

#### Scenario: Cambio concurrente tras aprobar
- **WHEN** el repositorio cambia después de la aprobación y antes de escribir
- **THEN** la skill detiene el flujo y exige reconstruir y aprobar una nueva
  propuesta

#### Scenario: Commit verificado
- **WHEN** un commit termina correctamente y coincide con la propuesta
- **THEN** la skill informa su SHA, mensaje, rutas y estado residual antes de
  continuar con otro commit

#### Scenario: Hook fallido
- **WHEN** un hook falla o modifica el working tree o el index
- **THEN** la skill comprueba el estado real, informa el resultado y se detiene
  sin omitir hooks, hacer amend ni corregir automáticamente

### Requirement: Skill propia documentada como recurso portable

La integración SHALL versionar la skill dentro de `integrations/opencode/skills/`
y SHALL documentar su instalación manual en
`~/.config/opencode/skills/<name>/SKILL.md`. La documentación SHALL distinguir
esta skill propia de las skills externas opcionales, SHALL conservar la
instalación selectiva de estas últimas y SHALL mantener alineados el README
raíz y el README de la integración.

#### Scenario: Copia del respaldo portable
- **WHEN** el usuario instala manualmente los recursos documentados
- **THEN** puede copiar la skill propia a su directorio global sin instalar una
  dependencia externa para ejecutar el flujo de commits

#### Scenario: Catálogo externo separado
- **WHEN** el usuario consulta el catálogo de skills externas
- **THEN** puede identificar que `git-commit` ya no es una dependencia obligatoria
  del flujo propio y que las demás skills se instalan selectivamente

#### Scenario: Eliminación del command anterior
- **WHEN** el respaldo se sincroniza después del cambio
- **THEN** la instalación documentada deja de incluir `commands/commit.md` y
  conserva separados los commands restantes y los workflows locales
