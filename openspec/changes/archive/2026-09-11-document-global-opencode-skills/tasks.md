## 1. Catalogo de skills externas

- [x] 1.1 Reescribir `integrations/opencode/skills/README.md` como catalogo de dependencias externas, separando `git-commit` de las skills opcionales y describiendo para cada entrada su uso, fuente, solapamiento y limite; verificar que aparecen todas las skills definidas por la especificacion y que no se copia ningun `SKILL.md`.
- [x] 1.2 Documentar comandos selectivos de `npx skills add` para el alcance global de OpenCode, incluyendo `--global`, `--agent opencode` y `--skill`; verificar que no se recomienda `--all` y que la fuente y los nombres coinciden con `github/awesome-copilot`.

## 2. Alineacion de documentacion de instalacion

- [x] 2.1 Actualizar `integrations/opencode/README.md` para distinguir sus recursos versionados de las skills externas y enlazar el catalogo sin incluirlo en la copia manual; verificar que la lista de recursos versionados conserva el plugin `plugins/context-handoff.ts`.
- [x] 2.2 Actualizar `README.md` para copiar todos los recursos versionados, incluido `plugins/context-handoff.ts`, dejar de presentar `skills/README.md` como instalacion de skills y retirar la referencia a `openspec-change-context-bootstrap`; verificar mediante busqueda dirigida que no quedan instrucciones activas obsoletas.

## 3. Validacion transversal

- [x] 3.1 Revisar los tres README contra la delta spec y el design, comprobando que el destino global, el modelo de dependencia externa, la precedencia de `/commit` y las categorias del catalogo sean coherentes; verificar los enlaces y los nombres de skills documentados.
- [x] 3.2 Ejecutar `openspec validate --specs` y `git diff --check`; verificar que los artifacts y la documentacion cumplen el formato OpenSpec y no contienen errores de whitespace.
