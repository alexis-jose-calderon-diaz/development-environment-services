# Design

## Context

El respaldo portable contiene dos commands globales: `tag`, que analiza la
historia Git y solo propone un tag, y `pr`, que analiza una branch limpia y
puede publicar la branch y crear una Pull Request después de una confirmación.
Ambos prompts dependen actualmente de metadata y sustituciones de OpenCode,
pero el flujo de commits ya fue migrado a una skill pública independiente en
`skills/`.

La migración seguirá el mismo límite de distribución: `integrations/opencode/`
continuará conteniendo solo configuración portable, mientras las skills
reutilizables vivirán en `skills/<name>/SKILL.md` y se instalarán mediante el
CLI `skills`.

## Goals / Non-Goals

**Goals:**

- Publicar dos skills autónomas y detectables fuera de OpenCode.
- Conservar el comportamiento de análisis, seguridad, formatos, preflight y
  revalidación de los commands actuales.
- Hacer que el flujo de tag sea completamente read-only.
- Mantener la publicación de PR como una operación explícita, verificable y
  posterior a la confirmación del usuario.
- Actualizar el catálogo, las instrucciones de instalación y el contrato
  OpenSpec sin duplicar la instalación de skills dentro del respaldo global.
- Añadir evaluaciones aisladas que permitan comprobar casos positivos y de
  bloqueo sin crear tags ni publicar ramas reales.

**Non-Goals:**

- Mantener aliases o wrappers `/tag` y `/pr`.
- Cambiar el algoritmo de selección de base, clasificación SemVer o formato de
  salida del flujo de tag.
- Crear un parser, plugin, instalador automático o API propia para GitHub.
- Cambiar `opencode.jsonc`, la configuración del proveedor, MCP, Docker,
  workflows locales de `.opencode/` o la superficie interna `./.agents/`.
- Ejecutar tags, pushes, Pull Requests, builds o tests del proyecto durante la
  implementación de la migración.

## Decisions

### Dos skills con responsabilidades y permisos diferentes

Se crearán `ac-release-tag-proposal` y `ac-pull-request` como skills separadas.
La primera solo puede producir una propuesta textual; la segunda combina
análisis read-only con publicación condicionada. Separarlas evita que una
petición de release cargue instrucciones de publicación y mantiene descripciones
de activación específicas.

**Alternativa descartada:** una skill única para releases y Pull Requests. La
mezcla tendría una superficie de activación más ambigua y haría menos visible la
diferencia entre una operación siempre read-only y otra con efectos remotos.

### Sustitución completa de commands

Se eliminarán `integrations/opencode/commands/tag.md` y `pr.md` y no se crearán
wrappers. Las skills recibirán la petición del usuario como entrada y
reconocerán únicamente los overrides documentados (`--version` para release y
los cuatro overrides de PR). El texto del repositorio, diffs, mensajes y
argumentos editoriales continuará siendo datos no confiables.

**Alternativa descartada:** conservar commands finos que deleguen en las
skills. No existe un mecanismo portable de herencia de prompts entre commands
y skills; mantenerlos produciría dos interfaces y conservaría la dependencia
específica de OpenCode que motiva el cambio.

### Confirmación independiente del proveedor

Las skills describirán las decisiones de confirmación en términos de
comportamiento, no de una herramienta concreta. `ac-pull-request` mostrará el
plan completo y usará el mecanismo de opciones del host cuando exista; si no,
solicitará las decisiones inequívocas `Crear y publicar PR`, `Ajustar propuesta`
o `Cancelar`. Una aprobación genérica nunca autorizará publicación.

**Alternativa descartada:** referenciar directamente `question` o cualquier
API de OpenCode. Eso haría que la skill dejara de ser reutilizable en otros
hosts.

### Conservación del contrato de seguridad del tag

`ac-release-tag-proposal` mantendrá la selección de tags mediante
`git for-each-ref`, el análisis limitado al rango de commits, la exclusión del
working tree del cálculo y la salida manual de un único `git tag -a`. No
ejecutará el bloque mostrado ni modificará refs. La skill no leerá políticas o
áreas no relacionadas para decidir la versión.

**Alternativa descartada:** simplificar el flujo a una regla basada en mensajes
de commit o prefijos `feat`/`fix`. El contrato existente basa el nivel en el
impacto observable y exige revisar el diff cuando la ruta no sea suficiente.

### Preflight y publicación de PR con valores verificados

`ac-pull-request` conservará la detección explícita de repositorio, base,
remote, owner y branch, sin ejecutar `git fetch` automáticamente. La propuesta
se generará antes de cualquier push; tras la confirmación se capturará de nuevo
el estado y solo se usarán valores ya comprobados. El push será no forzado y
`gh pr create` recibirá todos los campos explícitos. Un push exitoso seguido de
un fallo de creación se informará como estado parcial y no se reintentará.

**Alternativa descartada:** publicar automáticamente con el primer remote
disponible o hacer fetch para completar una referencia faltante. Esas
decisiones ampliarían el alcance y podrían publicar en un destino equivocado.

### Evaluación con fixtures y herramientas simuladas

Las evaluaciones se conservarán junto a cada skill en `evals/evals.json`.
Usarán repositorios fixture o escenarios aislados para verificar la selección de
base, los bloqueos y el formato. Los escenarios de publicación usarán una
instalación `gh` simulada o un remote de prueba explícito; nunca utilizarán el
remote real del repositorio ni dependerán de credenciales personales.

Además de las evaluaciones de comportamiento, se comprobará estáticamente que
las skills tienen metadata mínima, que la carpeta y `name` coinciden y que no
contienen `$ARGUMENTS`, `$1`, `agent` ni dependencias de `question`.

## Risks / Trade-offs

- **[Breaking change de aliases]** Los usuarios que ejecuten `/tag` o `/pr`
  dejarán de tener esos commands. → Documentar la sustitución y los nombres
  públicos de las skills; no mantener dos contratos contradictorios.
- **[Activación dependiente del host]** Un host puede no detectar una skill o
  interpretar de forma distinta una petición natural. → Usar descripciones
  explícitas y pushy, conservar ejemplos de activación y validar prompts
  representativos.
- **[Permisos del runtime]** Una skill no puede impedir técnicamente una edición
  o un push si el agente tiene permisos excesivos. → Documentar la limitación y
  exigir confirmación dentro del workflow; usar controles efectivos del host
  para aislamiento estricto.
- **[Ambigüedad de GitHub]** Múltiples remotes, forks o referencias faltantes
  pueden producir un destino incierto. → Detenerse y pedir aclaración; no
  hacer fetch ni asumir convenciones locales.
- **[Pruebas de publicación]** Los escenarios positivos de PR dependen de GitHub
  CLI y credenciales. → Simular `gh` y separar la prueba de publicación real,
  que queda fuera de la validación automática.

## Migration Plan

1. Añadir las dos skills públicas con sus evaluaciones y trasladar el contrato
   de cada command a una interfaz independiente de OpenCode.
2. Actualizar la especificación delta, el catálogo `skills/`, el README raíz,
   el README de la integración y `integrations/opencode/AGENTS.md`.
3. Eliminar los dos archivos de `integrations/opencode/commands/` y retirar de
   las instrucciones de instalación la creación y copia de esa carpeta.
4. Revisar referencias residuales a `/tag`, `/pr`, `commands/tag.md` y
   `commands/pr.md`; comprobar que `opencode.jsonc` queda fuera del diff.
5. Ejecutar validaciones estructurales, `openspec validate --specs` y las
   evaluaciones aisladas sin publicar refs ni ejecutar validaciones del
   proyecto consumidor.
6. Para instalar la nueva versión, comparar manualmente el respaldo con la
   configuración operativa, instalar las skills mediante `npx skills` y
   reiniciar OpenCode según la guía existente.

El rollback consiste en restaurar manualmente los commands desde una revisión
anterior y retirar las skills nuevas después de revisar la instalación; no
requiere operaciones destructivas de Git ni sincronización automática.

## Open Questions

None. La decisión de eliminar los aliases `/tag` y `/pr` fue confirmada antes
de crear este cambio.
