# Skills globales para OpenCode

Esta carpeta documenta dependencias externas de skills que encajan con el
toolkit portable. No contiene copias de sus `SKILL.md`: las skills se instalan
por separado en la configuración global de OpenCode y se cargan bajo demanda.

La fuente curada es [`github/awesome-copilot`](https://github.com/github/awesome-copilot).
La referencia fue revisada el 2026-09-11 sobre la rama `main`; el contenido de
la fuente externa puede cambiar después de esa fecha.

## Recomendadas

| Skill | Uso | Relación y límites |
| --- | --- | --- |
| [`git-commit`](https://github.com/github/awesome-copilot/tree/main/skills/git-commit) | Base para Conventional Commits, análisis de diff y organización de commits | Es dependencia explícita de `/commit`. Las reglas locales del command, incluida la confirmación, la seguridad, el staging y la ausencia de validaciones del proyecto, prevalecen sobre esta skill. |

## Opcionales

Instala estas skills solo cuando el tipo de trabajo las justifique. No forman
parte del baseline global.

| Skill | Uso | Relación y límites |
| --- | --- | --- |
| [`excalidraw-diagram-generator`](https://github.com/github/awesome-copilot/tree/main/skills/excalidraw-diagram-generator) | Crear diagramas de flujo, arquitectura, relaciones, secuencias y otros archivos `.excalidraw` | Complementa la exploración visual y la documentación arquitectónica. Solo es útil cuando se trabaja con el formato y el ecosistema Excalidraw. |
| [`documentation-writer`](https://github.com/github/awesome-copilot/tree/main/skills/documentation-writer) | Redactar documentación técnica siguiendo Diátaxis | Es una skill opinada: exige identificar tipo de documento, audiencia, objetivo y alcance, y aprobar una estructura antes de redactar. No sustituye las convenciones documentales del repositorio. |
| [`docs-sync-audit`](https://github.com/github/awesome-copilot/tree/main/skills/docs-sync-audit) | Auditar divergencias entre código, configuración, comandos y documentación | Complementa a `reviewer` con una auditoría documental read-only. No es una revisión general de código y debe mantenerse dentro del alcance documental necesario. |
| [`test-gap-audit`](https://github.com/github/awesome-copilot/tree/main/skills/test-gap-audit) | Detectar cobertura de pruebas ausente, débil o desactualizada | Complementa a `reviewer` e `integration-checker` con una auditoría read-only de tests. Su valor principal está en repositorios consumidores que sí tienen código y suite de pruebas. |
| [`security-review`](https://github.com/github/awesome-copilot/tree/main/skills/security-review) | Revisar vulnerabilidades, secretos, dependencias y flujos de datos | Es una revisión amplia y bajo demanda. Proporciona siempre un alcance concreto cuando sea posible, revisa sus hallazgos y no apliques automáticamente sus propuestas de parche. |

## Instalación global

`npx skills add` instala en el proyecto actual por defecto. Para que una skill
esté disponible en todos los repositorios mediante OpenCode, usa `--global` y
limita el destino con `--agent opencode`:

```bash
npx skills add https://github.com/github/awesome-copilot \
  --skill git-commit \
  --global \
  --agent opencode
```

Para instalar un grupo opcional, repite `--skill` para cada nombre seleccionado:

```bash
npx skills add https://github.com/github/awesome-copilot \
  --skill excalidraw-diagram-generator \
  --skill documentation-writer \
  --skill docs-sync-audit \
  --skill test-gap-audit \
  --skill security-review \
  --global \
  --agent opencode
```

No uses `--all` como instalación base. La selección automática puede incluir
skills específicas de frameworks, proveedores cloud o dominios que no forman
parte de este toolkit.

## Precedencia y mantenimiento

- Las skills externas amplían capacidades, pero no autorizan a cambiar el
  alcance, los permisos ni las reglas del toolkit.
- `/commit` conserva sus reglas locales cuando contradicen a `git-commit`.
- Revisa el contenido de una skill antes de instalarla y compara los cambios
  antes de actualizar una instalación global existente.
- Consulta las skills instaladas globalmente con `npx skills ls -g` y
  actualízalas de forma selectiva con `npx skills update --global`.
- Estas instrucciones no instalan, actualizan ni eliminan ninguna skill por sí
  mismas.

La instalación manual del respaldo versionado y la instalación de estas
dependencias externas son operaciones separadas. Consulta la
[guía de integración](../README.md) para sincronizar reglas, agents,
commands, configuración y plugins sin copiar este catálogo como si fuera una
skill ejecutable.
