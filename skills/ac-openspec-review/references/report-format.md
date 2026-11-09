# Informe de revisión

Escribir en español directamente en la respuesta final, sin crear archivos ni borradores temporales. Priorizar problemas con impacto real, agrupados por causa, y omitir secciones vacías salvo el estado del inventario. Formato:

```markdown
# Revisión OpenSpec: <cambio>

**Estado:** APPROVED | CHANGES_REQUIRED | BLOCKED
**Modo:** quick | full (explícito o justificación de selección)
**Esquema y raíz:** <schemaName>, <changeRoot>
**Cobertura:** <artefactos revisados; ausentes opcionales, skipped y faltantes requeridos; revisores ejecutados/no ejecutados>
**Aislamiento:** <sesiones hijas nuevas / una sesión; qué se comprobó y qué instrucciones o accesos podrían heredarse>

## Resumen ejecutivo
<Preparación para /opsx:apply, principales riesgos y límites de la evaluación.>

## Hallazgos
<Escribir «Sin hallazgos» si no hay problemas concretos; si los hay, agruparlos por severidad.>
### CRITICAL / WARNING / SUGGESTION
- **REV-001 · <categoría> · <severidad>** (perspectivas: ...)
  - Ubicación: `ruta:línea` [y `otra-ruta:línea` si hay contradicción].
  - Evidencia: «fragmento breve comprobado» [y diagnóstico del CLI, si procede].
  - Problema: <discrepancia o ausencia concreta>.
  - Impacto: <resultado observable si no se corrige>.
  - Corrección: <cambio específico a proponer en los artefactos existentes>.

## Evolución (solo si existe revisión anterior)
- Corregidos: <IDs y evidencia nueva>.
- Pendientes: <IDs>.
- Nuevos: <IDs>.

## Conclusión
<Siguiente decisión o corrección recomendada; nunca aplicar cambios automáticamente.>
```

Los IDs `REV-001`, `REV-002`, ... son únicos por cambio y se conservan entre rondas para el mismo problema; nuevos IDs no reutilizan los ya asignados. En una ausencia, citar el requisito/decisión que exige lo omitido y el archivo que debería contenerlo; si no existe ningún archivo, indicar la ruta prevista por `status` y el estado `no existe`, sin inventar una línea. Para una contradicción, citar ambos lados. Un límite técnico sin hallazgo concreto va en **Cobertura/Aislamiento** y puede producir `BLOCKED`, no un hallazgo sin evidencia.

No añadir hallazgos sobre criterios ya satisfechos, cumplidos o simplemente deseables. Una mejora opcional solo merece `SUGGESTION` si describe una carencia concreta, una consecuencia observable y una corrección útil; «mantener lo existente» no es una corrección.

- **CRITICAL:** impide implementar correctamente, hace inviable el plan o crea un riesgo grave aplicable.
- **WARNING:** defecto importante que conviene resolver antes de implementar (incluye contradicción funcional o tarea esencial omitida).
- **SUGGESTION:** mejora opcional con utilidad clara; nunca bloquea por sí sola.

`APPROVED` permite continuar con reservas explícitas pero no significa validación automática de OpenSpec. `CHANGES_REQUIRED` requiere corregir los problemas importantes y repetir revisión. `BLOCKED` significa evidencia insuficiente o incapacidad técnica de ejecutar el alcance acordado; especificar cómo desbloquearlo y distinguir hallazgos parciales de una aprobación. Registrar discrepancias entre revisores en el hallazgo correspondiente y pedir decisión humana si afectan a la corrección.
