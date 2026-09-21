# Design

## Context

La integración conserva un respaldo versionado bajo `integrations/opencode/`
que se copia manualmente a `~/.config/opencode/`. El command actual
`commands/commit.md` recibe sustituciones propias de OpenCode, usa una skill
externa como base y concentra en un prompt extenso las reglas de selección,
agrupación, seguridad, aprobación y ejecución.

OpenCode descubre skills mediante una carpeta que contiene `SKILL.md`; el
formato requiere únicamente `name` y `description` para que la skill sea
detectable. El cuerpo puede mantenerse independiente del runtime. El
repositorio no contiene un parser ejecutable ni una suite propia para probar
prompts Markdown.

## Goals / Non-Goals

**Goals:**

- Convertir el flujo de commits en una skill versionada, autocontenida y
  reutilizable por distintas herramientas.
- Mantener la propuesta antes de escribir, la agrupación por intención, la
  selección segura del index, la revalidación y la verificación posterior.
- Reducir la superficie específica de OpenCode a la metadata mínima necesaria
  para descubrir `SKILL.md`.
- Documentar la instalación de la skill propia sin confundirla con el catálogo
  de skills externas.

**Non-Goals:**

- No crear un parser, plugin, instalador automático ni una API de Git.
- No conservar un alias `/commit` ni una sintaxis formal `--staged`.
- No modificar `opencode.jsonc`, los commands `pr` o `tag`, los agentes
  portables ni la instalación global directamente.
- No ejecutar commits, validaciones del proyecto ni sincronización automática
  durante la implementación.

## Decisions

### Skill local con metadata mínima

Se añadirá `integrations/opencode/skills/grouped-commits/SKILL.md` con el nombre
de carpeta y `name` coincidentes. El frontmatter tendrá solo los campos
necesarios y una descripción que indique qué hace la skill y cuándo activarla.
No se añadirá `agent`, placeholders de commands, `allowed-tools` ni una
dependencia de composición.

**Alternativa descartada:** mantener el command y añadir una referencia a la
skill. El runtime de OpenCode no ofrece herencia de commands sobre skills y la
skill seguiría dependiendo de una interfaz específica.

### Alcance determinado por el estado de Git

La skill no interpreta opciones formales. Primero inspecciona el estado del
repositorio:

```text
staged presente  -->  alcance = index       -->  un commit
staged ausente   -->  alcance = working-tree -->  grupos por intención
```

El index se considera selección explícita del usuario. Los cambios unstaged y
no trackeados se informan como pendientes cuando el alcance es el index. En el
working tree, los archivos completos se asignan a un único grupo; los hunks
mixtos requieren staging manual.

**Alternativas descartadas:** conservar `--staged`, porque depende de
`$ARGUMENTS` y `$1`; y mezclar automáticamente el index con el working tree,
porque haría ambiguo el alcance aprobado.

### Flujo de propuesta como contrato de escritura

La skill capturará una fotografía del branch, estado, rutas, diff relevante e
index. La propuesta mostrará alcance, branch, upstream, cantidad, intención,
mensaje exacto, rutas, pendientes y advertencias, y terminará con
`## Fin de propuesta`.

La aprobación se solicitará mediante el mecanismo explícito que ofrezca la
herramienta anfitriona. Si la herramienta tiene una interfaz de opciones, se
usarán `Crear commits`, `Ajustar propuesta` y `Cancelar`; si no, se solicitará
una respuesta inequívoca con esas mismas decisiones. La skill no debe asumir
que una respuesta ordinaria equivale a aprobación.

**Alternativa descartada:** mencionar directamente `question`, porque haría el
contrato dependiente de OpenCode aunque el comportamiento de aprobación sea
portable.

### Mensajes contextuales y capacidades propias

La skill conservará solo las reglas mínimas necesarias para generar mensajes
Conventional Commits: `type` en inglés, `scope` sustentado por evidencia y
descripción/body en el idioma de la petición. Usará el historial reciente como
señal secundaria de estilo, sin imponer un idioma fijo.

**Alternativa descartada:** delegar el formato a `git-commit`, porque una skill
externa ausente no debe impedir el flujo propio. La entrada de catálogo de
`git-commit` se conservará únicamente como opción externa, no como dependencia.

### Escritura explícita y verificación secuencial

Después de una aprobación válida, la skill volverá a comparar la fotografía
con el estado actual. En working tree usará staging solo con las rutas
explícitas del grupo aprobado; en index no modificará el staging. Creará cada
commit con el mensaje exacto aprobado, respetará hooks y verificará SHA,
mensaje, rutas y estado antes de continuar.

**Alternativa descartada:** usar staging global o corregir automáticamente un
fallo de hook, porque rompería el contrato de alcance y podría alterar cambios
no aprobados.

### Documentación de instalación

La skill propia se añadirá a la tabla de recursos instalables y a las
instrucciones manuales de `integrations/opencode/README.md` y del README raíz.
`integrations/opencode/skills/README.md` explicará que la carpeta contiene una
skill propia versionada además del catálogo externo. No se requiere un cambio
de configuración para el directorio global estándar de skills.

## Risks / Trade-offs

- **[Descubrimiento según herramienta]** Una herramienta que no implemente
  `SKILL.md` no cargará automáticamente la skill. -> Mantener el cuerpo sin
  primitivas específicas y documentar que el formato de distribución es
  Agent Skills/OpenCode.
- **[Menor determinismo de la aprobación]** Un host puede no tener una UI de
  opciones. -> Fijar las tres decisiones y exigir una respuesta inequívoca
  antes de cualquier escritura.
- **[Selección staged implícita]** Un usuario puede querer agrupar cambios del
  working tree mientras conserva un stage unrelated. -> Tratar el index como
  alcance explícito y reportar el resto como pendiente, sin mezclarlo ni
  modificarlo.
- **[Skill instalada obsoleta]** La copia global puede diferir del respaldo.
  -> Mantener la comparación y sincronización manual documentadas; no añadir un
  instalador automático.
- **[Cambios ajenos en el worktree]** El repositorio ya contiene modificaciones
  fuera de este cambio. -> No incluir `opencode.jsonc` ni `.prettierrc.json` en
  la implementación ni en sus validaciones dirigidas.

## Migration Plan

1. Añadir la skill propia y actualizar la documentación del respaldo y de la
   instalación manual.
2. Eliminar `integrations/opencode/commands/commit.md` y retirar de la
   documentación la dependencia obligatoria de `git-commit`.
3. Revisar el diff y validar la skill y los artifacts sin crear commits ni
   ejecutar validaciones del proyecto.
4. Cuando se quiera instalarla, comparar el respaldo con
   `~/.config/opencode/`, copiar la skill y reiniciar OpenCode según la guía.
5. Para rollback, restaurar manualmente el command anterior o retirar la skill
   nueva después de revisar la copia instalada; no modificar refs ni usar
   operaciones destructivas.
