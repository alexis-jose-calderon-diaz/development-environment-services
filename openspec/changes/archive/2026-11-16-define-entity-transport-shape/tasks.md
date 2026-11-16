# Tasks

## 1. Regla transversal y referencias existentes

- [x] 1.1 Actualizar la guía general de diseño en `skills/ac-dotnet-backend-get-slice/SKILL.md` para cubrir cualquier transporte que represente, contenga o proyecte datos de entidades, directa o indirectamente; precisar selección mínima de campos, conservación de jerarquía y nombres de propiedades, naming desde la entidad real y tipos auxiliares top-level locales a la slice; incluir `ComercialUsuario` → `DataUsuario`/`ModelUsuario` y verificar que los siete criterios de aceptación estén visibles en la guía.
- [x] 1.2 Alinear `references/request.md`, `references/data.md`, `references/response.md`, `references/projections.md`, `references/extensions.md`, `references/controller.md` y `references/domain-persistence.md` con la regla común sin eliminar sus restricciones particulares; verificar que `Data` conserve proyecciones EF explícitas/traducibles, `Request`/`Response` mantengan sus contratos y Get siga excluyendo colecciones hijas.

## 2. Guía de Model y enlaces

- [x] 2.1 Crear `skills/ac-dotnet-backend-get-slice/references/model.md` con orientación para modelos de presentación/plantilla, incluidos campos mínimos, asociaciones anidadas, propiedades con nombres de origen, auxiliares `Model<Entidad>` top-level locales a la slice y propiedades semánticas que no representen entidades; verificar el caso `ComercialUsuario` de tipo `ModelUsuario`.
- [x] 2.2 Actualizar la tabla de referencias de `SKILL.md` para enlazar `model.md` y revisar los enlaces internos de todos los archivos tocados; verificar que cada destino enlazado existe y que no se haya previsto modificar archivos fuera de `skills/ac-dotnet-backend-get-slice/`.

## 3. Revisión documental

- [x] 3.1 Revisar la consistencia entre la guía principal y las referencias para confirmar alcance transversal, jerarquía de relaciones directas e indirectas, selección solo de campos necesarios y excepciones por tipo; verificar con búsquedas de los términos y ejemplos definidos en la propuesta.
