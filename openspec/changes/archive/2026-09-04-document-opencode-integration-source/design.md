## Context

El repositorio contiene dos superficies relacionadas pero distintas: los recursos globales de OpenCode bajo `integrations/opencode/` y los workflows internos de OpenSpec bajo `.opencode/`. La primera superficie ya tiene la forma que necesita la configuración global, pero se versiona en el repositorio como respaldo; la instalación operativa de OpenCode se encuentra en `~/.config/opencode/`.

La documentación actual de `README.md` no refleja completamente esta separación. No se requieren cambios de runtime ni de los archivos de configuración; el diseño se limita a hacer explícita la topología documental y la regla de resolución de rutas.

## Goals / Non-Goals

**Goals:**

- Hacer que el README raíz describa la integración OpenCode desde su ubicación actual.
- Proporcionar en `integrations/opencode/README.md` una guía autónoma para identificar, instalar, comparar y respaldar los archivos globales.
- Usar una tabla de correspondencia clara entre cada ruta versionada y su ubicación en `~/.config/opencode/`.
- Mantener las referencias internas de la integración relativas a la raíz de la configuración global, de modo que sigan siendo válidas después de copiarse.
- Dejar explícita la separación entre el respaldo global y `.opencode/`.

**Non-Goals:**

- Cambiar `AGENTS.md`, `agents/`, `commands/`, `skills/` u `opencode.jsonc`.
- Crear scripts automáticos de sincronización, enlaces simbólicos o una nueva herramienta de instalación.
- Convertir la copia del repositorio en una segunda ubicación operativa de OpenCode.
- Documentar rutas absolutas específicas de una máquina distinta de `~/.config/opencode/`.
- Modificar los servicios Docker o la configuración de OpenSpec.

## Decisions

### 1. Dos niveles de documentación

El README raíz conservará la visión general del repositorio y enlazará la integración. El README dentro de `integrations/opencode/` será la autoridad documental para esa integración y contendrá el detalle de instalación y mantenimiento.

Se descarta concentrar toda la información en el README raíz porque obligaría a mezclar el ambiente de desarrollo, las integraciones y las reglas de una configuración global en un único documento.

### 2. `~/.config/opencode/` como ubicación operativa

La documentación tratará `~/.config/opencode/` como la ubicación desde la que OpenCode carga los archivos globales. `integrations/opencode/` se describirá como respaldo versionado para revisión, historial y recuperación.

El flujo documentado será explícito y manual:

```text
~/.config/opencode/ <--> integrations/opencode/
       |                         |
       |                         +--> respaldo versionado
       +--> configuracion operativa real
```

Antes de copiar en cualquier dirección se recomendará comparar diferencias y preservar cambios locales deliberados. No se asumirá que una copia ciega pueda resolver conflictos.

### 3. Tabla de mapeo de rutas

El README de la integración incluirá el mapeo de los elementos versionados principales:

```text
AGENTS.md       --> ~/.config/opencode/AGENTS.md
opencode.jsonc  --> ~/.config/opencode/opencode.jsonc
agents/         --> ~/.config/opencode/agents/
commands/       --> ~/.config/opencode/commands/
skills/         --> ~/.config/opencode/skills/
```

Esto evita que el lector interprete la carpeta del repositorio como la ruta que OpenCode consume directamente.

### 4. Regla de rutas internas

Los documentos y recursos dentro de la integración usarán rutas relativas a la raíz de la configuración global (`skills/...`, `agents/...`, `commands/...`) cuando describan referencias consumidas por OpenCode. No se introducirán referencias operativas a `../`, a la raíz del repositorio ni a `integrations/opencode/` dentro de esos archivos para resolver recursos.

Las menciones a `integrations/opencode/` se reservarán para la documentación raíz o para explicar la ubicación del respaldo, no para sustituir las rutas que deben funcionar después de la instalación global.

### 5. Separación de `.opencode/`

Ambos READMEs distinguirán la integración global de OpenCode de `.opencode/`, que contiene la configuración y los comandos internos de OpenSpec del repositorio. La integración no se instalará desde `.opencode/` ni se mezclará con ella.

## Risks / Trade-offs

- **[Edición en la ubicación equivocada]** Un lector podría modificar solo el respaldo o solo la configuración global. -> Documentar el mapeo, el flujo bidireccional y la comparación previa a la sincronización.
- **[Desfase entre copias]** La configuración operativa y el respaldo pueden divergir. -> Explicar que el respaldo debe actualizarse después de cambios intencionales y recomendar revisar diferencias antes de copiar.
- **[Confusión entre OpenSpec y OpenCode global]** Las dos carpetas contienen archivos de configuración relacionados con agentes. -> Incluir una sección de separación explícita y enlaces con contexto.
- **[Rutas inválidas tras la instalación]** Una referencia con una ruta del repositorio dejaría de funcionar bajo `~/.config/opencode/`. -> Auditar las referencias internas y conservar rutas relativas a la raíz global.

## Migration Plan

1. Actualizar el README raíz con el mapa actual del repositorio y el enlace a la guía de integración.
2. Crear `integrations/opencode/README.md` con propósito, mapeo, flujo manual de sincronización y reglas de rutas.
3. Auditar las referencias textuales dentro de `integrations/opencode/` para confirmar que no dependan de rutas padre del repositorio.
4. Revisar los documentos resultantes con búsquedas acotadas y comprobar que los comandos de copia apunten a `~/.config/opencode/`.

El rollback consiste en retirar el README nuevo y restaurar el README raíz anterior. No se deben borrar ni alterar archivos de `~/.config/opencode/` como parte de este cambio documental.

## Open Questions

Ninguna. La ubicación operativa y la función de respaldo quedaron definidas por el alcance solicitado.
