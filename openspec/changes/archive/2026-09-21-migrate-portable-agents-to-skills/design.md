# Design

## Context

Los recursos actuales bajo `integrations/opencode/agents/` están diseñados como
subagentes con `mode`, permisos de edición y contratos de salida para un
orquestador. Las skills públicas se descubren y cargan como instrucciones por
el agente actual, por lo que no pueden reproducir aislamiento de permisos,
ownership de archivos ni continuidad de sesiones.

La solución debe conservar la utilidad observable de los roles read-only y
evitar presentar una skill como sustituto seguro de un agente con permisos
restringidos. La integración de presupuesto de contexto y `HANDOFF` solo tiene
consumidores en esos workers, por lo que se retirará junto con ellos.

## Goals / Non-Goals

**Goals:**

- Proporcionar cuatro skills públicas, autosuficientes y neutrales respecto al
  agente: `change-impact-analysis`, `change-planning`, `change-review` e
  `integration-boundary-audit`.
- Extraer los métodos útiles de análisis, planificación, revisión, evidencia,
  validación y auditoría de fronteras.
- Mantener los flujos de análisis, revisión y auditoría sin edición por
  contrato, dejando explícito que la skill no es una barrera de permisos.
- Eliminar los cinco agentes personalizados y el plugin de presupuesto/HANDOFF
  cuando la documentación y las referencias ya estén migradas.
- Mantener separadas las skills públicas de `integrations/opencode/`, `.agents/`
  y los comandos globales.

**Non-Goals:**

- Crear una skill `implementer` o automatizar la implementación mediante una
  skill que pretenda reemplazar el ownership de un worker.
- Mantener continuidad automática entre sesiones agotadas.
- Modificar los comandos `pr` y `tag` o la skill `grouped-commits` salvo para
  corregir referencias documentales que apunten a recursos eliminados.
- Cambiar la configuración de proyectos consumidores o la instalación operativa
  del usuario fuera de la documentación versionada.

## Decisions

### Skills públicas como workflows iniciados por el usuario

Las cuatro capacidades se versionarán bajo `skills/<name>/SKILL.md`, siguiendo
la superficie pública existente. Cada descripción de frontmatter expresará
cuándo activar la skill y el cuerpo será un workflow autocontenido.

**Alternativa descartada:** copiar los cinco archivos de agente como
`SKILL.md`. Eso conservaría referencias a prompts de orquestador, permisos y
sesiones hijas que no existen en el modelo de skills.

### Separar análisis, planificación, revisión y auditoría

Se conservarán cuatro skills pequeñas porque representan intenciones de usuario
distintas. `change-planning` incluirá la inspección mínima que necesite y no
exigirá que el usuario le entregue el informe de `change-impact-analysis`.

**Alternativa descartada:** una única skill de workflow completo. Sería más
difícil de activar correctamente y forzaría revisión o planificación cuando el
usuario solo pide una de esas operaciones.

### Auditoría de integración sin parches automáticos

`integration-boundary-audit` conservará la detección de incompatibilidades entre
capas y contratos, pero solo producirá hallazgos. Las correcciones del antiguo
`integration-checker` dependían de un `Scope` delegado y de coordinación de
ownership, garantías que una skill no puede imponer.

**Alternativa descartada:** permitir edición opcional desde la skill. Mezclar
auditoría y corrección aumentaría el riesgo de modificar archivos fuera del
alcance que el usuario esperaba revisar.

### Read-only como contrato, no como permiso

Las skills read-only explicarán su límite y usarán lenguaje explícito para no
editar. La documentación señalará que la garantía efectiva depende del agente y
de sus permisos, y recomendará un agente o modo read-only cuando el usuario
requiera aislamiento estricto.

**Alternativa descartada:** afirmar que la skill garantiza seguridad. OpenCode
carga las skills como instrucciones dentro del agente seleccionado; una skill
no sustituye las reglas de permisos del agente.

### Retirar el plugin de contexto junto con los agentes

Se eliminarán `context-handoff.ts`, sus instrucciones de instalación y las
reglas de `HANDOFF` porque no quedará un contrato portable que las consuma. La
gestión nativa de contexto y compactación del agente seleccionado queda fuera
de este cambio.

**Alternativa descartada:** conservar el plugin sin consumidores. Eso dejaría
señales y bloqueos que pedirían un formato `HANDOFF` inexistente y mantendría
una dependencia operativa que el modelo basado en skills ya no necesita.

### Validación antes de eliminar recursos

Las skills se validarán con casos representativos de activación, salida,
read-only, incertidumbre y ausencia de contexto externo. La eliminación de
agentes y plugin se hará después de comprobar referencias activas, validar las
especificaciones y revisar que la instalación documentada solo enumere recursos
existentes.

## Risks / Trade-offs

- **[Pérdida de aislamiento read-only]** → Documentar la limitación y probar las
  skills en un agente/mode con permisos read-only cuando el flujo lo requiera.
- **[Activación incorrecta por descripciones solapadas]** → Usar descripciones
  específicas, evitar que `change-planning` se anuncie como implementación y
  evaluar prompts cercanos entre análisis, revisión y auditoría.
- **[Pérdida de continuidad tras agotar contexto]** → Declarar el cambio como
  breaking, retirar las instrucciones `HANDOFF` y depender de compactación o una
  nueva petición explícita del usuario.
- **[Referencias históricas confundidas con referencias activas]** → Buscar solo
  configuraciones, READMEs y recursos activos; no modificar artifacts archivados
  salvo que el workflow de mantenimiento lo exija.
- **[Usuarios con instalación global antigua]** → Documentar que deben comparar
  y sincronizar manualmente el respaldo, reiniciar OpenCode y retirar recursos
  obsoletos tras revisar el diff.
