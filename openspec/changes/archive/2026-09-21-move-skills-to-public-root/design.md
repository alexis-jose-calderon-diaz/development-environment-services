# Design

## Context

La integración actual mezcla el respaldo portable de OpenCode con la superficie
de skills: `integrations/opencode/skills/` contiene el catálogo, la skill propia
`grouped-commits` y sus evaluaciones. `README.md` e
`integrations/opencode/README.md` también describen la skill como parte de la
copia manual del toolkit.

La skill CLI descubre skills desde un repositorio que expone `skills/<name>/SKILL.md`.
El alcance de proyecto puede usar `./.agents/skills/`, mientras el alcance global
evita esa superficie y deja el destino operativo bajo el directorio global del
usuario. La instalación pública debe permanecer agnóstica del agente.

## Goals / Non-Goals

**Goals:**

- Convertir `/skills/` en la fuente pública y autónoma de skills versionadas.
- Mantener `integrations/opencode/` como respaldo de configuración portable no
  dependiente de una skill concreta.
- Documentar instalación con `npx skills add --global` y actualización con
  `npx skills update --global`, sin imponer `--agent`.
- Hacer visible la frontera entre `/skills/`, `integrations/opencode/` y
  `./.agents/`.

**Non-Goals:**

- No modificar ni trasladar `./.agents/` ni sus skills.
- No modificar `skills-lock.json` ni convertir la instalación global en una
  instalación de proyecto.
- No instalar, actualizar ni eliminar recursos en el directorio personal del
  usuario durante la aplicación del cambio.
- No cambiar el comportamiento interno de `grouped-commits`, agents, commands,
  plugins o servicios Docker.

## Decisions

### Fuente pública única en `/skills/`

Se moverá el contenido público completo de `integrations/opencode/skills/` a
`skills/`, conservando `README.md`, `grouped-commits/SKILL.md` y las
evaluaciones. No se mantendrá una copia duplicada: la duplicación permitiría que
la skill pública y la copia del toolkit diverjan.

Alternativa descartada: conservar la skill en `integrations/opencode/` y añadir
un espejo en la raíz. Mantener dos fuentes contradice la finalidad de una
instalación reproducible y dificulta la revisión de cambios.

### Instalación y actualización mediante el CLI neutral

La documentación usará el repositorio público como fuente y un comando de
instalación de esta forma:

```bash
npx skills add <repositorio> --skill grouped-commits --global
```

No incluirá `--agent opencode`, `--agent '*'` ni una recomendación de agente. El
CLI conserva la selección interactiva o la detección que corresponda al entorno
del usuario. La actualización se documentará así:

```bash
npx skills update grouped-commits --global
```

Alternativa descartada: copiar manualmente `SKILL.md` a
`~/.config/opencode/skills/`. Esa ruta acopla una skill pública a OpenCode y
duplica el mecanismo de instalación que el CLI ya proporciona.

### Separación de sincronización

La guía de `integrations/opencode/` seguirá usando comparación y copia manual
para `AGENTS.md`, `opencode.jsonc`, agents, commands y plugins. La skill pública
se instalará y actualizará por separado con `npx skills`, y no aparecerá como
recurso requerido en la tabla de copia manual de la integración.

Alternativa descartada: hacer que `npx skills` gestione todo
`integrations/opencode/`. El CLI gestiona skills, no el conjunto heterogéneo de
configuración, agents, commands y plugins del toolkit.

### Exclusión explícita de `./.agents/`

La documentación pública nombrará `./.agents/` como superficie interna excluida.
Las instrucciones usarán siempre `--global` y no presentarán comandos de
instalación de proyecto. `skills-lock.json` permanecerá sin cambios porque
representa el inventario externo existente y no debe convertirse en un efecto
colateral de la migración pública.

## Risks / Trade-offs

- **[Ruta antigua usada por consumidores]** -> Marcar el movimiento como
  breaking, actualizar todos los enlaces activos y verificar que no quedan
  instrucciones hacia `integrations/opencode/skills/`.
- **[Instalación global modifica el estado del usuario]** -> Documentar que los
  comandos son manuales y no ejecutarlos durante la aplicación; pedir revisión
  del usuario antes de instalar o actualizar.
- **[Selección de agente no determinista entre entornos]** -> No prometer un
  agente concreto; explicar que el CLI deja la selección al usuario o al entorno
  detectado y conservar el alcance global como requisito.
- **[Skill antigua permanece instalada]** -> Documentar que retirar la fuente del
  repositorio no desinstala copias globales previas; su limpieza queda a cargo
  del usuario tras comparar el estado instalado.
