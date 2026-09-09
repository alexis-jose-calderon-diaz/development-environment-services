## Context

La integracion ya contiene cinco contratos individuales bajo `integrations/opencode/agents/` y un `README.md` que los enumera como recursos instalables. `integrations/opencode/AGENTS.md` concentra reglas comunes de herramientas, coordinacion y delegacion, pero su nivel de detalle dificulta usarlo como punto de entrada. La motivacion y el comportamiento esperado estan definidos en `proposal.md` y en la delta spec.

El cambio debe conservar la independencia del toolkit respecto de los workflows del repositorio consumidor. El `README.md`, `opencode.jsonc`, los prompts individuales y las superficies locales quedan fuera de la edicion.

## Goals / Non-Goals

**Goals:**

- Convertir `AGENTS.md` en una guia comun breve que tambien funcione como indice de los cinco agentes portables.
- Mostrar para cada agente su uso principal y su limite general de edicion.
- Mantener en los archivos individuales el metodo, las restricciones detalladas y el formato de salida de cada rol.
- Conservar solo las reglas comunes y el contexto de delegacion necesarios para orientar una ejecucion segura.

**Non-Goals:**

- Crear un registro runtime, un plugin o una automatizacion para descubrir agentes.
- Cambiar nombres, permisos o contratos de `agents/*.md`.
- Duplicar en `AGENTS.md` los procedimientos completos de los agentes.
- Modificar la configuracion de OpenCode, la instalacion documentada o los workflows locales.

## Decisions

### 1. Usar `AGENTS.md` como indice y fuente de reglas comunes

La guia conservara el alcance, las reglas transversales y una tabla breve de agentes. No se creara un archivo adicional porque separaria el inventario de la guia que ya acompana a todos los recursos portables y aumentaria la superficie de sincronizacion.

Alternativa descartada: mantener `AGENTS.md` como contrato extenso y documentar los agentes solo en `README.md`. Eso conserva la dificultad de seleccion durante una tarea y deja el contexto operativo separado del indice de roles.

### 2. Mantener una ficha minima por agente

La tabla incluira exactamente los cinco archivos existentes, su responsabilidad principal y si el rol es read-only o permite edicion acotada. Los detalles se resolveran en `agents/<name>.md`, que seguira siendo la fuente de verdad para cada contrato.

Alternativa descartada: copiar las descripciones, ciclos de trabajo y formatos completos en `AGENTS.md`. Eso volveria a introducir duplicacion y riesgo de divergencia.

### 3. Reducir el contexto compartido sin eliminar sus limites

La guia mantendra un formato corto para objetivo, alcance, exclusiones, restricciones, criterios y validacion cuando sean necesarios. Las secciones explicativas extensas y las reglas particulares de cada rol permaneceran en sus prompts.

Alternativa descartada: eliminar por completo el contexto delegado y dejar solo una lista de agentes. Eso haria mas sobria la guia, pero perderia el contrato minimo necesario para delegar subtareas con alcance y validacion claros.

## Risks / Trade-offs

- [Deriva entre el indice y los archivos] El nombre o el permiso resumido podria dejar de coincidir con un agente individual -> validar la tabla contra los cinco archivos existentes y revisar ambos niveles cuando cambie un rol.
- [Resumen demasiado breve] Un usuario podria elegir un agente sin conocer una restriccion importante -> conservar limites generales en la tabla y remitir explícitamente al contrato individual antes de ejecutar.
- [Duplicacion futura] Los prompts individuales podrían volver a copiar reglas comunes -> revisar que `AGENTS.md` siga siendo la fuente común y que los agentes conserven solo sus diferencias de rol.

## Migration Plan

1. Actualizar el respaldo versionado de `integrations/opencode/AGENTS.md` y comparar el conjunto de recursos sin cambiar los demás archivos de la integración.
2. Revisar manualmente la diferencia antes de copiar el archivo actualizado a la instalación global documentada.
3. Si la nueva guía no resulta adecuada, restaurar la versión anterior de `AGENTS.md`; no requiere migración de datos ni cambios de runtime.
