## Context

La guia comun y los contratos portables contienen reglas de rutas relativas, pero no expresan una prioridad operativa para el `workdir`. Ver `proposal.md` para la motivacion.

## Goals / Non-Goals

**Goals:**

- Establecer una regla comun y breve: `workdir` primero, acceso externo solo cuando sea necesario.
- Retirar las restricciones de formato de rutas de los seis documentos portables afectados.
- Mantener el `Scope` como limite independiente de la necesidad de consultar un recurso externo.

**Non-Goals:**

- No cambiar permisos de OpenCode ni convertir el acceso externo en un bloqueo tecnico.
- No modificar codigo, dependencias, servicios ni la copia instalada automaticamente.

## Decisions

- La prioridad se documentara en `integrations/opencode/AGENTS.md` para que aplique a todos los roles sin duplicar el procedimiento.
- El acceso externo sera una excepcion basada en necesidad concreta, con la operacion minima y una justificacion en el resultado. Se descarta exigir confirmacion previa porque la decision acordada es justificar y continuar.
- Se retiraran solo las menciones que convierten las rutas relativas en requisito de los contratos de `analyzer`, `planner`, `implementer`, `reviewer` e `integration-checker`. Se conservaran sus formatos de salida y limites de edicion.
- No se modificara `integrations/opencode/opencode.jsonc`; esta propuesta ajusta instrucciones, no permisos.

## Risks / Trade-offs

- [Control basado en instrucciones] Un agente podria acceder externamente sin necesidad → exigir que identifique el recurso concreto y explique el motivo.
- [Permisos externos amplios] La configuracion actual permite rutas bajo `/workspace/**` → mantener el acceso minimo como requisito de comportamiento y reportar cualquier acceso externo.
- [Menor uniformidad de rutas] Los informes pueden usar formatos distintos → conservar rutas claras y validas para la herramienta o contexto correspondiente.

## Migration Plan

1. Actualizar los seis archivos versionados de `integrations/opencode/`.
2. Validar la especificacion y comprobar que no permanezcan exigencias de rutas relativas en esos contratos.
3. Sincronizar manualmente la copia bajo `~/.config/opencode/` cuando se apruebe la implementacion.
