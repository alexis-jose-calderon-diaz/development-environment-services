# Integración portable de OpenCode

`integrations/opencode/` es el respaldo versionado y portable de la configuración global de OpenCode. La instalación operativa está en `~/.config/opencode/`; este respaldo sirve para revisar cambios, conservar historial y recuperar una configuración conocida. No es una segunda ubicación operativa ni OpenCode lo carga directamente.

El toolkit global se mantiene separado del `AGENTS.md` raíz, `.opencode/` y los workflows o la configuración del proyecto consumidor. Copiar estos recursos no reemplaza ni modifica por sí solo esas superficies locales.

## Recursos instalables

El conjunto de recursos versionados instalable documentado es exactamente el
siguiente:

| Respaldo versionado | Instalación operativa |
| --- | --- |
| `integrations/opencode/AGENTS.md` | `~/.config/opencode/AGENTS.md` |
| `integrations/opencode/opencode.jsonc` | `~/.config/opencode/opencode.jsonc` |
| `integrations/opencode/agents/analyzer.md` | `~/.config/opencode/agents/analyzer.md` |
| `integrations/opencode/agents/planner.md` | `~/.config/opencode/agents/planner.md` |
| `integrations/opencode/agents/implementer.md` | `~/.config/opencode/agents/implementer.md` |
| `integrations/opencode/agents/reviewer.md` | `~/.config/opencode/agents/reviewer.md` |
| `integrations/opencode/agents/integration-checker.md` | `~/.config/opencode/agents/integration-checker.md` |
| `integrations/opencode/commands/commit.md` | `~/.config/opencode/commands/commit.md` |
| `integrations/opencode/commands/pr.md` | `~/.config/opencode/commands/pr.md` |
| `integrations/opencode/commands/tag.md` | `~/.config/opencode/commands/tag.md` |
| `integrations/opencode/plugins/context-handoff.ts` | `~/.config/opencode/plugins/context-handoff.ts` |

Los comandos de `integrations/opencode/commands/` son comandos globales. Los comandos y workflows de `.opencode/` pertenecen al proyecto consumidor y permanecen fuera de esta instalación.

## Dependencias externas de skills

Las skills no forman parte de la copia manual de este respaldo. La carpeta
`integrations/opencode/skills/` contiene un catálogo documental de dependencias
externas que OpenCode puede cargar bajo demanda desde
`~/.config/opencode/skills/`.

Consulta el [catálogo de skills globales](skills/README.md) para conocer las
opciones recomendadas, los límites de cada skill y los comandos selectivos de
`npx skills add --global --agent opencode`. No copies el README ni ningún
`SKILL.md` externo desde este respaldo.

## Instalación manual

Desde la raíz del repositorio, crea las carpetas de destino si faltan y copia únicamente los recursos enumerados:

```bash
mkdir -p ~/.config/opencode/agents ~/.config/opencode/commands ~/.config/opencode/plugins
cp integrations/opencode/AGENTS.md ~/.config/opencode/AGENTS.md
cp integrations/opencode/opencode.jsonc ~/.config/opencode/opencode.jsonc
cp integrations/opencode/agents/analyzer.md ~/.config/opencode/agents/analyzer.md
cp integrations/opencode/agents/planner.md ~/.config/opencode/agents/planner.md
cp integrations/opencode/agents/implementer.md ~/.config/opencode/agents/implementer.md
cp integrations/opencode/agents/reviewer.md ~/.config/opencode/agents/reviewer.md
cp integrations/opencode/agents/integration-checker.md ~/.config/opencode/agents/integration-checker.md
cp integrations/opencode/commands/commit.md ~/.config/opencode/commands/commit.md
cp integrations/opencode/commands/pr.md ~/.config/opencode/commands/pr.md
cp integrations/opencode/commands/tag.md ~/.config/opencode/commands/tag.md
cp integrations/opencode/plugins/context-handoff.ts ~/.config/opencode/plugins/context-handoff.ts
```

Estas operaciones son manuales, no un instalador automático. Revisa el contenido y las diferencias antes de copiar. La configuración global instalada coexiste con el `AGENTS.md` raíz y la configuración local del proyecto consumidor; conserva sus reglas locales y no las reemplaces.

## Comparación y sincronización

La sincronización es manual y bidireccional entre el respaldo versionado y la instalación operativa. Antes de copiar en cualquier dirección:

1. Compara ambas ubicaciones, por ejemplo con `diff -ru integrations/opencode ~/.config/opencode`.
2. Revisa cada diferencia y decide qué copia debe conservarla.
3. Preserva las reglas y recursos locales deliberados; no sobrescribas sin revisar.
4. Tras cambiar intencionalmente la instalación operativa, incorpora el cambio al respaldo solo después de revisar el diff.
5. Tras actualizar el respaldo, vuelve a comparar antes de copiarlo a `~/.config/opencode/`.

No se proporcionan scripts, enlaces simbólicos ni copias automáticas. Reinicia OpenCode después de cambiar archivos globales para que cargue la configuración actualizada.

## Limpieza manual

Una instalación anterior puede conservar recursos que ya no pertenecen al conjunto enumerado. Identifícalos mediante la comparación entre `integrations/opencode/` y `~/.config/opencode/`, revisa cada diferencia antes de eliminarla y confirma que no sea un recurso local deliberado. Elimina manualmente solo los recursos obsoletos de `~/.config/opencode/`; esta documentación no realiza esa limpieza ni borra recursos locales.
