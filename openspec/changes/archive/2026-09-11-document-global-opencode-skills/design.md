## Context

El respaldo portable contiene reglas, agentes, commands, configuración y un plugin en `integrations/opencode/`. Las skills externas se descubren e instalan por separado mediante `npx skills`; OpenCode las carga bajo demanda desde sus directorios globales. `/commit` ya declara `git-commit` como base, mientras los README actuales mezclan la copia del respaldo con la instalación de skills y mantienen una referencia a una skill OpenSpec eliminada.

## Goals / Non-Goals

**Goals:**

- Mantener un catálogo corto, razonado y útil entre repositorios.
- Separar claramente recursos versionados de dependencias externas.
- Documentar instalación global exclusiva para OpenCode.
- Alinear las instrucciones de instalación y mantener la precedencia de las políticas locales.

**Non-Goals:**

- Vender, copiar o modificar skills externas.
- Instalar automáticamente skills o cambiar la configuración operativa del usuario.
- Añadir skills específicas de un framework, proveedor cloud o dominio sin una necesidad transversal.
- Cambiar el comportamiento de agentes, commands, plugins o MCP.

## Decisions

### Catálogo por niveles

`git-commit` se documentará como dependencia explícita de `/commit`. `excalidraw-diagram-generator` será una opción de uso frecuente para visualización. `documentation-writer`, `docs-sync-audit`, `test-gap-audit` y `security-review` quedarán bajo demanda por ser útiles pero más opinadas, amplias o costosas en contexto.

Se excluyen skills que dupliquen `planner`, `reviewer`, `/commit`, `/pr` o `/tag`, y skills específicas de stack. Esto reduce ambigüedad en el selector de skills y conserva una integración global agnóstica.

### Dependencias externas sin vendoring

El respaldo conservará únicamente el catálogo y sus instrucciones. La fuente será `github/awesome-copilot`, y cada instalación seleccionará skills por nombre. No se añadirá ningún `SKILL.md` externo al repositorio ni se tratará el README del catálogo como una skill ejecutable.

Alternativa descartada: versionar copias locales. Aunque mejora la reproducibilidad, crea una segunda fuente de verdad, aumenta el mantenimiento y contradice la intención de consumir la skill externa que `/commit` ya declara.

### Instalación global dirigida

Los comandos usarán `npx skills add ... --skill <name> --global --agent opencode`. `--global` evita una instalación accidental en el proyecto actual y `--agent opencode` evita propagar la skill a otros agentes detectados. No se recomendará `--all`.

Alternativa descartada: confiar en la detección automática de agentes. Es cómoda, pero no garantiza que la skill quede limitada a OpenCode ni hace explícito el alcance global deseado.

### Alineación de README

`integrations/opencode/README.md` seguirá enumerando los recursos versionados y enlazará el catálogo de dependencias externas sin presentarlo como parte de la copia manual. `README.md` eliminará la referencia a `openspec-change-context-bootstrap`, dejará de copiar el README de skills como si instalara dependencias y añadirá el plugin portable a la copia manual. `integrations/opencode/skills/README.md` será la fuente documental de selección e instalación de skills externas.

Las reglas específicas de `/commit` seguirán siendo la autoridad local cuando entren en conflicto con `git-commit`.

## Risks / Trade-offs

- [Fuente externa mutable] -> Registrar la URL, los nombres exactos y la fecha o referencia revisada; aceptar que la instalación sin pin puede cambiar con el upstream.
- [Confusión entre catálogo y runtime] -> Explicar que el README solo documenta dependencias y que OpenCode carga los `SKILL.md` desde el directorio global.
- [Solapamiento de instrucciones] -> Marcar explícitamente las skills que complementan o duplican capacidades existentes y mantener el baseline pequeño.
- [Instalación global sobre recursos existentes] -> Mantener la revisión y comparación manual antes de instalar o actualizar; no automatizar limpieza ni sobrescritura.

## Migration Plan

Los usuarios actuales deben comparar su instalación global, instalar únicamente las skills seleccionadas con los comandos documentados y reiniciar OpenCode después de cambiar recursos globales. La reversión consiste en restaurar los README anteriores; cualquier skill instalada externamente se gestiona por separado y no se elimina automáticamente.
