# Development Environment Services

Repositorio público de la capa de servicios y configuraciones compartidas del ambiente de desarrollo.

Este repositorio complementa a `development-environment-host`: el repositorio host prepara la máquina y sus herramientas base; este repositorio levanta los servicios comunes y conserva configuraciones reutilizables para los proyectos consumidores.

## Propósito

El ambiente proporciona servicios Docker persistentes e independientes de
cualquier aplicación concreta. PostgreSQL y pgAdmin forman el núcleo; los
proyectos consumidores pueden conectarse mediante la red Docker externa
`shared` sin agregar código ni configuración de esos proyectos a este
repositorio. La operación del Compose está documentada en la [guía de
servicios](services/README.md).

## Componentes

- `services/`: definición Docker Compose, variables de ejemplo y servicios
  compartidos del ambiente. Consulta la [guía operativa](services/README.md).
- `skills/`: skills públicas versionadas y reutilizables. Consulta el
  [catálogo e instalación](skills/README.md); no incluye la superficie interna
  `./.agents/`.
- `integrations/`: respaldo versionado de la configuración portable global. Es una integración opcional; consulta la [sección de integración de OpenCode](#integración-opcional-de-opencode).
- `openspec/`: especificaciones y cambios del workflow OpenSpec de este repositorio.
- `.opencode/`: comandos y skills internos para trabajar con OpenSpec en este repositorio. No es el origen de la instalación global de OpenCode.

## Integración opcional de OpenCode

La instalación global de OpenCode no es necesaria para operar los servicios.
`integrations/` es un respaldo versionado y no se carga directamente
desde el checkout. La configuración operativa se encuentra en
`~/.config/opencode/`.

### Recursos instalables

El respaldo contiene únicamente estos recursos:

| Respaldo versionado | Instalación operativa |
| --- | --- |
| `integrations/agents-global.md` | `~/.config/opencode/AGENTS.md` |
| `integrations/opencode-config.jsonc` | `~/.config/opencode/opencode.jsonc` |

Los nombres del respaldo son deliberadamente neutros para evitar que OpenCode o
un agente los descubra automáticamente dentro del repositorio. Los nombres de
la segunda columna son los que se deben usar únicamente en la instalación
operativa.

Las skills públicas versionadas bajo `skills/` se instalan y actualizan por
separado; consulta el [catálogo de skills](skills/README.md). No forman parte
de esta copia manual. La superficie interna `./.agents/` tampoco forma parte de
la instalación global.

### Instalación manual

Desde la raíz del repositorio, crea la carpeta de destino si falta y copia los
recursos al nombre operativo correspondiente:

```bash
git clone https://github.com/alexis-jose-calderon-diaz/development-environment-services.git
cd development-environment-services
mkdir -p ~/.config/opencode
cp integrations/agents-global.md ~/.config/opencode/AGENTS.md
cp integrations/opencode-config.jsonc ~/.config/opencode/opencode.jsonc
```

Revisa y combina `AGENTS.md` con las reglas globales existentes antes de
reemplazarlo. Reinicia OpenCode después de cambiar archivos globales para que
cargue la configuración actualizada.

### Comparación y sincronización

La sincronización es manual y bidireccional. Antes de copiar en cualquier
dirección, compara cada respaldo con su destino porque los nombres de origen y
destino son distintos:

```bash
diff -u integrations/agents-global.md ~/.config/opencode/AGENTS.md
diff -u integrations/opencode-config.jsonc ~/.config/opencode/opencode.jsonc
```

Revisa cada diferencia y decide qué copia debe conservarla. Para incorporar
intencionalmente cambios de la instalación al respaldo:

```bash
cp ~/.config/opencode/AGENTS.md integrations/agents-global.md
cp ~/.config/opencode/opencode.jsonc integrations/opencode-config.jsonc
```

Después vuelve a comparar, revisa el diff del repositorio y no sobrescribas
reglas locales sin autorización. Estas operaciones son manuales; no hay scripts,
enlaces simbólicos ni copias automáticas.

### Migración y limpieza

El destino operativo conserva los nombres `AGENTS.md` y `opencode.jsonc`; no es
necesario renombrar esos archivos al actualizar el respaldo. Si una instalación
anterior contiene recursos adicionales, identifícalos mediante una comparación,
revisa cada diferencia y elimina manualmente solo los recursos obsoletos que no
sean deliberados. Esta documentación no modifica ni limpia automáticamente
`~/.config/opencode/`.
