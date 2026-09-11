## Context

`integrations/opencode/commands/commit.md` es una plantilla Markdown ejecutada
por el agente `build`. La skill externa `git-commit` se descubre por separado y
OpenCode no ofrece un campo de frontmatter soportado para importar una skill
desde un command. Por tanto, la relación entre ambos recursos debe quedar
expresada como una frontera de instrucciones: la skill aporta capacidades
generales y el command orquesta el workflow local.

El command actual contiene reglas generales repetidas y también políticas
locales que no pueden delegarse: selección explícita del index, agrupación por
intención, confirmación, protección ante concurrencia y restricciones de
seguridad. La propuesta y la delta spec definen el contrato observable; este
diseño concreta cómo mantener esa separación.

## Goals / Non-Goals

**Goals:**

- Convertir el command en una capa de orquestación local sobre `git-commit`.
- Hacer explícita la precedencia de las políticas locales cuando sean más
  restrictivas que la skill.
- Mantener el flujo seguro de dos modos y la agrupación semántica sin staging
  parcial automático.
- Hacer que la propuesta, la confirmación, la detección de concurrencia y la
  verificación posterior sean inequívocas para el agente.
- Reducir duplicación sin eliminar las instrucciones que son necesarias para
  preservar el comportamiento local.

**Non-Goals:**

- Modificar `.agents/skills/git-commit/SKILL.md`,
  `/home/dev/.agents/skills/git-commit/SKILL.md` o cualquier otra copia de la
  skill.
- Añadir un plugin, un parser externo o un nuevo campo de configuración para
  componer commands y skills.
- Cambiar `opencode.jsonc`, la documentación de instalación o la especificación
  principal durante la implementación de este cambio.
- Ejecutar validaciones del proyecto, crear commits reales o automatizar la
  sincronización con `~/.config/opencode/`.

## Decisions

### Usar la skill como base mediante una frontera explícita

El command indicará que `git-commit` es responsable del formato Conventional
Commits, tipos, análisis general, `type`, `scope`, breaking changes, generación
del mensaje y mecánica general de commit. A continuación impondrá las reglas
locales de modo, agrupación, idioma, staging, confirmación, secretos,
concurrencia y verificación.

Se descarta añadir `skill: git-commit` o `skills: [git-commit]` al frontmatter:
esas formas no están soportadas por el contrato de commands de OpenCode. Se
descarta también eliminar el cuerpo del command y confiar únicamente en el
descubrimiento automático, porque no garantiza que el command conserve sus
políticas locales ni su orden de ejecución.

### Mantener solo la especificidad local

La nueva estructura separará las instrucciones en estas fases:

```text
argumentos y preflight
        |
        v
selección working-tree / staged
        |
        v
resumen Git y revisión dirigida
        |
        v
agrupación local + mensaje asistido por git-commit
        |
        v
propuesta exacta + question
        |
        v
revalidación + staging controlado + commit
        |
        v
verificación de cada resultado
```

Las explicaciones generales de la skill que no agreguen una restricción local
se eliminarán. Se conservarán las reglas concretas necesarias para que un
archivo pertenezca a un solo grupo, para detenerse ante hunks mezclados y para
separar únicamente intenciones independientes.

### Precedencia local sobre la skill

La precedencia será explícita y no dependerá de inferencias del agente:

| Área | Base de `git-commit` | Regla local de `/commit` |
| --- | --- | --- |
| Conventional Commits | Formato, tipos, breaking changes | Tipo en inglés y texto en español |
| Análisis | Lectura del diff y generación del mensaje | Revisión superficial progresiva y evidencia de scope |
| Selección | Puede usar staged automáticamente | `--staged` obligatorio para procesar el index |
| Agrupación | Un cambio lógico por commit | Archivos completos, sin dividir hunks y con reglas cross-layer |
| Staging | Rutas, patrones o staging interactivo | Solo rutas explícitas del grupo aprobado |
| Secretos | No cometer secretos | Excluir working tree y detener staged sin autorización de inclusión |
| Hooks | Respetar hooks salvo la excepción general de la skill | Nunca omitirlos, hacer amend ni corregir automáticamente |

La tabla documenta diferencias de responsabilidad, no se copiará literalmente
si deja de ser necesaria para entender el command.

### Capturar y comparar el estado del repositorio

El preflight construirá una fotografía de branch, upstream, estado, rutas,
operaciones en curso y diffs superficiales antes de proponer commits. El plan
conservará la evidencia suficiente para comparar el estado tras la
confirmación. Antes de cada escritura se volverán a leer el estado y el diff
del alcance correspondiente; cualquier diferencia invalida el plan completo.

No se usará interpolación shell del contenido del repositorio ni comandos
globales de búsqueda de secretos. Las rutas se transmitirán como datos y el
commit multilínea usará la forma segura descrita por la skill, siempre que no
contradiga el mensaje exacto aprobado.

### Aplicar la política de secretos sin autorización de inclusión

La revisión de seguridad se limitará a las rutas elegibles. Un nombre sensible
por sí solo no bastará para bloquear una ruta si la evidencia dirigida confirma
que no contiene un secreto. Si existe evidencia razonable, el working tree la
excluirá y el modo staged se detendrá para que el usuario corrija manualmente
el index. No habrá una opción local que autorice incluirla, aunque la versión
general de la skill describa esa posibilidad.

### Tratar el plan como contrato de escritura

La propuesta usará el formato exacto de la spec, con estados Git normalizados,
rutas relativas estables, grupos en orden de ejecución, mensaje único por
commit, pendientes y advertencias. `question` aparecerá inmediatamente después
de la propuesta y `Crear commits` autorizará únicamente esa versión del plan.
Cualquier ajuste, cambio de orden o variación del estado exigirá reconstruir la
propuesta y confirmarla otra vez.

### Verificar commits secuenciales y fallos de hooks

En working tree se hará staging solo del grupo aprobado y se comprobará el
index antes del commit. En staged no se hará staging. Después de cada commit se
comprobarán SHA corto, mensaje, rutas incluidas y estado residual antes de
avanzar al siguiente grupo.

Un hook fallido se tratará como una detención: primero se comprobará si el
commit llegó a crearse y después se informará el estado real. No se usará
`--no-verify`, `--amend` ni una corrección automática del código o del index.

## Risks / Trade-offs

- [Composición no ejecutable] OpenCode no tiene una primitiva de herencia de
  commands sobre skills. -> La frontera de instrucciones será explícita y las
  tareas de verificación comprobarán que el command delega lo general sin
  perder las políticas locales.
- [Cumplimiento textual] El command es un prompt, por lo que las secuencias y
  condiciones no son un parser determinista. -> El formato obligatorio,
  escenarios dirigidos y comprobaciones antes de cada escritura reducen la
  superficie de interpretación.
- [Falsos positivos de secretos] Una ruta sensible puede no contener un valor
  secreto. -> Inspeccionar evidencia dirigida y no bloquear únicamente por el
  nombre; nunca mostrar valores.
- [Cambios concurrentes] El repositorio puede cambiar entre grupos o durante
  un hook. -> Comparar el snapshot antes de cada escritura y detenerse ante
  cualquier discrepancia.
- [Sincronización portable] El respaldo versionado no actualiza por sí solo la
  copia instalada. -> Tras la implementación, comparar manualmente ambas
  ubicaciones y reiniciar OpenCode según el README de integración.

## Migration Plan

1. Reemplazar únicamente el contenido de
   `integrations/opencode/commands/commit.md` conforme a esta propuesta y
   conservar intactas las copias de `git-commit`.
2. Revisar el diff del respaldo y validar los artifacts y los escenarios del
   command sin ejecutar commits ni validaciones de proyecto.
3. Cuando se quiera instalar el cambio, comparar manualmente el respaldo con
   `~/.config/opencode/commands/commit.md`, copiar solo el command aprobado y
   reiniciar OpenCode.
4. Para rollback, restaurar manualmente la versión anterior del command desde
   una copia revisada; no se requieren cambios en Git, refs ni en la skill.
