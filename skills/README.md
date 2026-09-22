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
| `ac-grouped-commits` | Agrupar cambios Git por intención y mostrar una propuesta completa como salida de la activación | `ac-grouped-commits/SKILL.md`; define el formato y el análisis de la propuesta |
| `ac-change-impact-analysis` | Analizar impacto, superficie, consumidores, complejidad, riesgos e incertidumbres antes de implementar | `ac-change-impact-analysis/SKILL.md`; read-only por contrato, sin aislamiento de permisos del runtime |
| `ac-change-planning` | Preparar planes técnicos verificables con unidades, dependencias, validaciones y puntos de decisión | `ac-change-planning/SKILL.md`; no implementa ni requiere OpenSpec u orquestación previa |
| `ac-change-review` | Revisar diffs o implementaciones contra objetivos, alcance, restricciones y criterios | `ac-change-review/SKILL.md`; read-only por contrato y basado en evidencia |
| `ac-integration-boundary-audit` | Auditar fronteras entre implementación, contratos, consumidores, persistencia, generados y tests | `ac-integration-boundary-audit/SKILL.md`; read-only por contrato y no aplica correcciones |
| `ac-release-tag-proposal` | Analizar commits y proponer una versión SemVer y un tag anotado sin crearlo ni publicarlo | `ac-release-tag-proposal/SKILL.md`; read-only por contrato y sin modificar refs |
| `ac-pull-request` | Revisar commits y preparar o crear una Pull Request después de confirmación explícita | `ac-pull-request/SKILL.md`; requiere GitHub CLI para publicar y no crea commits |

La fuente pública de este repositorio es
[`alexis-jose-calderon-diaz/development-environment-services`](https://github.com/alexis-jose-calderon-diaz/development-environment-services).

## Instalación y actualización

El alcance global evita instalar skills en `./.agents/skills/`. El CLI mantiene
la selección de agentes neutral: el usuario decide los agentes disponibles o
usa la detección que corresponda a su entorno.

Para instalar las skills públicas versionadas:

```bash
npx skills add https://github.com/alexis-jose-calderon-diaz/development-environment-services \
  --skill ac-grouped-commits \
  --skill ac-change-impact-analysis \
  --skill ac-change-planning \
  --skill ac-change-review \
  --skill ac-integration-boundary-audit \
  --skill ac-release-tag-proposal \
  --skill ac-pull-request \
  --global
```

Para actualizar cualquier skill pública instalada:

```bash
npx skills update <name> --global
```

## Precedencia y mantenimiento

- `ac-grouped-commits` es la skill pública para organizar propuestas de commits y
  termina al entregar la propuesta completa.
- Revisa el contenido de una skill antes de instalarla y compara los cambios
  antes de actualizar una instalación global existente.
- Consulta las skills instaladas globalmente con `npx skills ls -g` y
  actualízalas de forma selectiva con `npx skills update <name> --global`.
- Estas instrucciones no instalan, actualizan ni eliminan ninguna skill por sí
  mismas.

La instalación de skills públicas y la sincronización manual de la
configuración portable son operaciones separadas. Consulta la [sección de
integración de OpenCode](../README.md#integración-opcional-de-opencode) para
sincronizar reglas y configuración. No copies este README ni uses `./.agents/`
como fuente de skills públicas.
