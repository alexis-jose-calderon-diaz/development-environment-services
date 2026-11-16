# Design

## Context

See `proposal.md` - Why. La guía principal ya habla de `Request`, `Data` y `Response`, y las referencias contienen criterios parciales de anidamiento y nombres auxiliares. No existe una referencia clara para `Model`. La implementación es documental y queda limitada a `skills/ac-dotnet-backend-get-slice/`.

## Goals / Non-Goals

**Goals:**

- Establecer una regla común, aplicable a cualquier transporte que represente, contenga o proyecte datos de entidades.
- Mantener explícita la diferencia entre la forma de la entidad y el subconjunto de datos permitido o necesario para cada propósito.
- Alinear ejemplos, reglas especializadas y enlaces internos, incorporando una referencia de modelos de presentación.

**Non-Goals:**

- Cambiar comportamiento de APIs, código de aplicación, entidades, persistencia o pruebas.
- Eliminar restricciones propias de un transporte ni cambiar los límites existentes de las consultas Get.

## Decisions

1. **Declarar la regla en la guía principal y especializarla en las referencias existentes.** La sección general de diseño presentará el alcance transversal y el orden para decidir forma, miembros y nombres. `request.md`, `data.md`, `response.md`, `projections.md` y `extensions.md` explicarán cómo se aplica en contratos y mapeos; `controller.md` y `domain-persistence.md` conservarán las restricciones de su frontera. Se elige esta distribución frente a centralizar todo en una página nueva porque los lectores consultan guías por tipo y las decisiones actuales están repartidas en esos documentos.

2. **Nombrar miembros y tipos a partir de la entidad de origen, no de la navegación.** Si una entidad declara una navegación `ComercialUsuario`, el miembro de transporte que la representa conserva el nombre `ComercialUsuario`, mientras el tipo auxiliar usa el prefijo del transporte y el nombre de la entidad representada (`DataUsuario`, `ModelUsuario`, etc.), nunca `DataComercialUsuario` por el nombre de la navegación. Los auxiliares son tipos top-level y locales a su slice; solo se comparten si varias slices comparten intencionalmente el mismo contrato. La regla sigue siendo aplicable al transporte principal y a sus auxiliares anidados.

3. **Proyectar el subconjunto necesario sin alterar la jerarquía representada.** Cada objeto contiene únicamente los miembros requeridos por su caso de uso o presentación. Cuando representa asociaciones incluidas en ese contrato, conserva la jerarquía de objetos y nombres de propiedades de origen, también en asociaciones indirectas; no aplana ni duplica campos por comodidad. Las propiedades específicas de operación o presentación pueden tener nombres semánticos si no representan miembros de una entidad. Esto evita inventar entidades o propiedades para forzar el patrón.

4. **Mantener las reglas especializadas por transporte como límites adicionales.** `Data` sigue siendo interno a Application y sus proyecciones EF deben seleccionar explícitamente los campos necesarios y ser traducibles; `Request`/`Response` siguen las reglas de validación y contrato público; `Model` conserva el formato que necesita la plantilla o presentación. En Get, se mantiene la regla existente de incluir solo la entidad consultada y sus referencias hacia entidades superiores, nunca colecciones hijas. La convención común no amplía ese alcance.

5. **Añadir una referencia para `Model` y enlazarla desde la tabla principal.** La guía especificará modelos de presentación/plantilla, su aplicación del subconjunto y naming de entidades, y la libertad para miembros puramente presentacionales. Se rechaza tratar `Model` solo como una mención en el texto general porque hoy carece de orientación dedicada.

## Risks / Trade-offs

- [Actualizar ejemplos sin distinguir miembros de entidad de campos de presentación podría forzar nombres inadecuados] → Etiquetar en las guías qué miembros representan una entidad y permitir nombres semánticos para datos de operación/presentación.
- [La regla general podría interpretarse como permiso para incluir cualquier navegación en Get] → Repetir que las reglas particulares de cada tipo siguen vigentes y preservar explícitamente el límite Get de referencias hacia arriba, sin colecciones hijas.
- [Los enlaces cruzados podrían quedar obsoletos al añadir `model.md`] → Revisar las rutas de la tabla principal y los enlaces de las referencias modificadas contra los archivos presentes.
