# Skills públicas

Esta carpeta es la superficie pública y versionada de skills reutilizables. No
es una copia de las skills internas del workflow del repositorio: `./.agents/`
queda explícitamente fuera de este catálogo, del movimiento y de las
instrucciones de instalación.

Cada skill ejecutable se conserva en `skills/<name>/SKILL.md`; el README de esta
carpeta es únicamente el catálogo y no se instala como una skill.

## Skills versionadas

| Skill | Uso | Fuente y límites |
| --- | --- | --- |
| `grouped-commits` | Agrupar cambios Git por intención, mostrar una propuesta completa y crear commits tras aprobación explícita | `grouped-commits/SKILL.md`; no depende de otra skill y conserva sus propias reglas de aprobación y seguridad |

La fuente pública de este repositorio es
[`alexis-jose-calderon-diaz/development-environment-services`](https://github.com/alexis-jose-calderon-diaz/development-environment-services).

## Skills externas opcionales

Instala estas skills solo cuando el tipo de trabajo las justifique. No forman
parte del baseline de este repositorio.

La fuente curada es [`github/awesome-copilot`](https://github.com/github/awesome-copilot).
La referencia fue revisada el 2026-09-11 sobre la rama `main`; el contenido de
la fuente externa puede cambiar después de esa fecha.

| Skill | Uso | Relación y límites |
| --- | --- | --- |
| [`git-commit`](https://github.com/github/awesome-copilot/tree/main/skills/git-commit) | Base general para Conventional Commits y análisis de diffs | Es opcional; `grouped-commits` no depende de ella y conserva sus propias reglas de aprobación y seguridad. |
| [`excalidraw-diagram-generator`](https://github.com/github/awesome-copilot/tree/main/skills/excalidraw-diagram-generator) | Crear diagramas de flujo, arquitectura, relaciones, secuencias y otros archivos `.excalidraw` | Complementa la exploración visual y la documentación arquitectónica. Solo es útil cuando se trabaja con el formato y el ecosistema Excalidraw. |
| [`documentation-writer`](https://github.com/github/awesome-copilot/tree/main/skills/documentation-writer) | Redactar documentación técnica siguiendo Diátaxis | Es una skill opinada: exige identificar tipo de documento, audiencia, objetivo y alcance, y aprobar una estructura antes de redactar. No sustituye las convenciones documentales del repositorio. |
| [`docs-sync-audit`](https://github.com/github/awesome-copilot/tree/main/skills/docs-sync-audit) | Auditar divergencias entre código, configuración, comandos y documentación | Complementa a `reviewer` con una auditoría documental read-only. No es una revisión general de código y debe mantenerse dentro del alcance documental necesario. |
| [`test-gap-audit`](https://github.com/github/awesome-copilot/tree/main/skills/test-gap-audit) | Detectar cobertura de pruebas ausente, débil o desactualizada | Complementa a `reviewer` e `integration-checker` con una auditoría read-only de tests. Su valor principal está en repositorios consumidores que sí tienen código y suite de pruebas. |
| [`security-review`](https://github.com/github/awesome-copilot/tree/main/skills/security-review) | Revisar vulnerabilidades, secretos, dependencias y flujos de datos | Es una revisión amplia y bajo demanda. Proporciona siempre un alcance concreto cuando sea posible, revisa sus hallazgos y no apliques automáticamente sus propuestas de parche. |

## Instalación y actualización

El alcance global evita instalar skills en `./.agents/skills/`. El CLI mantiene
la selección de agentes neutral: el usuario decide los agentes disponibles o
usa la detección que corresponda a su entorno.

Para instalar la skill versionada:

```bash
npx skills add https://github.com/alexis-jose-calderon-diaz/development-environment-services \
  --skill grouped-commits \
  --global
```

Para actualizarla:

```bash
npx skills update grouped-commits --global
```

Para instalar skills externas seleccionadas explícitamente:

```bash
npx skills add https://github.com/github/awesome-copilot \
  --skill excalidraw-diagram-generator \
  --skill documentation-writer \
  --skill docs-sync-audit \
  --skill test-gap-audit \
  --skill security-review \
  --global
```

No uses `--all` como instalación base. La selección automática puede incluir
skills específicas de frameworks, proveedores cloud o dominios que no forman
parte de este catálogo.

## Precedencia y mantenimiento

- Las skills externas amplían capacidades, pero no autorizan a cambiar el
  alcance, los permisos ni las reglas del toolkit.
- `grouped-commits` es la skill pública para organizar commits y no requiere
  instalar `git-commit`.
- Revisa el contenido de una skill antes de instalarla y compara los cambios
  antes de actualizar una instalación global existente.
- Consulta las skills instaladas globalmente con `npx skills ls -g` y
  actualízalas de forma selectiva con `npx skills update --global`.
- Estas instrucciones no instalan, actualizan ni eliminan ninguna skill por sí
  mismas.

La instalación de skills públicas y la sincronización manual de la
configuración portable son operaciones separadas. Consulta la [guía de
integración](../integrations/opencode/README.md) para sincronizar reglas,
agents, commands, configuración y plugins. No copies este README ni uses
`./.agents/` como fuente de skills públicas.
