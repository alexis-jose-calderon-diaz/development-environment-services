---
name: ac-dotnet-backend-get-slice
description: "Diseña o implementa slices CRUD y operaciones relacionadas en backend .NET para APIs ASP.NET Core. Cada entidad expuesta tiene módulo propio con GetById y un único GetAll paginado en Get; orienta contratos, FluentValidation, DataAnnotations e integración backend, sin frontend ni pruebas."
---

# Slices CRUD para backend .NET

Ayuda a implementar y explicar slices de backend .NET, desde los casos de uso hasta los controllers HTTP. Las referencias se organizan por tipo de archivo —no por acción— y explican dónde, cuándo y cómo aplica cada artefacto en `Create`, `Get`, `Update`, `Delete` y operaciones especializadas. Adapta las capas y el transporte a las instrucciones y convenciones del repositorio.

## Alcance

- Cubre las slices de Application y sus controllers HTTP delgados; Domain/Infrastructure solo cuando sean necesarios y estén dentro del alcance solicitado.
- **Contrato uniforme de entrada**: todo dato de negocio del caso de uso va en un único `Request`, aunque sea un solo valor o un ID relacionado. Solo el ID de la entidad principal puede quedar como argumento separado; `CancellationToken` sigue siendo técnico. Si la operación solo recibe ese ID, no crees un `Request` vacío. Aplica el mismo contrato a las acciones de controllers: ID principal más un objeto de entrada, sin parámetros de negocio escalares adicionales.
- Cada entidad de negocio expuesta tiene su propio módulo y casos de uso; `Cotizacion` y `ProductoCotizacion` no comparten slices ni trasladan el CRUD del hijo al módulo del padre. Mantén `Create`, `Get`, `Update` y `Delete` como slices independientes dentro de cada módulo cuando se soliciten; no crees un handler para todo el CRUD.
- Cada módulo expuesto incluye **ambos** `GetById` y un **único** `GetAll` en la misma slice `Get`, compartiendo proyección, conversión y contrato de elemento. No crees `GetAll` alternativos ni listados separados por contexto.
- Todo listado usa un único `Get/Request.cs` y el endpoint establecido por el proyecto (para nuevos listados HTTP, `POST search`). `Search` es opcional: ausencia, `null` o `""` no aplican filtro textual y el handler lo omite con `!string.IsNullOrEmpty(request.Search)`. `Page` y `PageSize` son nullable y opcionales como pareja: si ambas se omiten o son `null`, se devuelven todos los resultados coincidentes; si solo una tiene valor, la validación responde `400`; si ambas tienen valor, se valida la página y que `PageSize` pertenezca al enum vigente, y se pagina. Los filtros adicionales son nullable y opcionales; no se crea otro endpoint para obtener todos los resultados.
- En Get y sus respuestas solo proyecta propiedades de la entidad y referencias **hacia arriba** (p. ej. `Cotizacion` → `Cliente`), nunca entidades hijas/colecciones hacia abajo (p. ej. `Cotizacion` → `ProductosCotizacion`). Los hijos se consultan mediante su propio módulo. Un comando puede consultar/copiar hijos para un snapshot cuando el caso de uso lo requiera, sin incorporarlos al contrato Get del padre.
- Cubre también transiciones de estado y otras operaciones propias del módulo cuando se soliciten; no inventes acciones para completar una plantilla CRUD.
- No incluye frontend, clientes generados, codegen ni cambios de esquema de base de datos salvo petición explícita; si las instrucciones del proyecto requieren trabajo adicional, coordínalo o repórtalo como pendiente.
- No cubre ningún tipo de pruebas: no propongas ni añadas guías, casos o archivos de pruebas desde esta skill. La compilación y demás verificaciones no basadas en pruebas siguen las instrucciones del repositorio.
- No infieras reglas de negocio para crear, actualizar o eliminar. Conserva las invariantes del dominio, el tratamiento de not-found y el comportamiento de borrado existentes.

## Forma y nombres de objetos de transporte de entidades

Esta convención aplica de forma transversal a cualquier contrato u objeto de transporte que represente, contenga o proyecte datos de entidades, directa o indirectamente; `Request`, `Data`, `Model` y `Response` son ejemplos, no una lista exhaustiva.

- Cada objeto incluye solo los campos necesarios para su propósito. No copies todos los campos de una entidad por simetría.
- En los miembros que representan entidades o sus relaciones, conserva la jerarquía de objetos y las asociaciones anidadas que requiere el propósito, incluso cuando una asociación sea indirecta. No aplanes ni dupliques propiedades por comodidad.
- Conserva el nombre declarado en la entidad de origen para cada miembro que la representa, incluidas las propiedades de navegación. Por ejemplo, si `SolicitudCotizacionEntity` declara `ComercialUsuario`, la propiedad se llama `ComercialUsuario`.
- Nombra cada tipo auxiliar top-level con el prefijo del tipo de transporte principal y el nombre de la entidad real representada, no el nombre de la navegación. Así, el miembro `ComercialUsuario` puede tener tipo `DataUsuario` o `ModelUsuario`, no `DataComercialUsuario`. Los auxiliares son locales a su slice; solo se comparten cuando comparten intencionalmente el mismo contrato.
- Aplica la misma convención a cualquier otro tipo de transporte, sustituyendo el prefijo por el nombre de su tipo principal: por ejemplo, `RequestUsuario`, `DataCliente`, `ModelUsuario` o `ResponseCliente`.
- Las propiedades propias de una operación o de presentación que no representen miembros de entidades pueden conservar nombres semánticos. No inventes entidades ni propiedades para forzar la correspondencia.
- Estas reglas no sustituyen las restricciones propias de cada tipo: `Data` conserva sus requisitos de proyección EF, `Request`/`Response` sus contratos y `Model` el formato de presentación de la plantilla. En Get se mantienen solo la entidad consultada y sus referencias hacia arriba; nunca se incluyen colecciones hijas.

## Flujo de trabajo

1. Lee instrucciones, TFM/versión de C#, specs del cambio y slices vecinas. Identifica entidades de origen, relaciones, contratos, persistencia, validación, rutas, seguridad y DI. Si spec y código no coinciden, no conviertas la discrepancia en convención: aclara cuál manda.
2. Delimita las operaciones y sus resultados: creación, consultas, mutaciones, borrado o transiciones. Fija roles, alcance por propietario, estados permitidos, efectos y códigos HTTP a partir del requisito, sin inventarlos.
3. Diseña todos los objetos de transporte que representen datos de entidades conforme a [Forma y nombres de objetos de transporte de entidades](#forma-y-nombres-de-objetos-de-transporte-de-entidades), además de las guías por tipo. En Get conserva solo las asociaciones hacia entidades superiores. Para listados ordinarios reutiliza `Production.Application.Models.PaginatedResponse<T>` y `PaginatedResponseFactory`, manteniendo `Response` específico del elemento. `Planificacion` conserva su respuesta propia.
4. Nombra **todos** los miembros de enums en `UPPER_SNAKE_CASE` (`PENDIENTE`, `EN_ANALISIS`); conserva sus valores numéricos y revisa referencias, defaults, persistencia y serialización si se renombra un enum existente. No presupongas que el nombre JSON anterior es equivalente al nuevo.
5. Implementa **todas** las reglas de validación del `Request` con FluentValidation (incluidas longitud, rango, pertenencia a enum y consistencia entre campos). Añade DataAnnotations solo cuando una anotación estándar aporte al schema OpenAPI; toda restricción declarada con DataAnnotations debe tener regla equivalente en FluentValidation, que puede incluir reglas adicionales sin DataAnnotations. Nunca dependas solo de DataAnnotations para validar Application. Si el `Request` requerido por el contrato no tiene restricciones, omite el `Validator` vacío, no el `Request`. `Search` es opcional y una cadena nula/vacía no filtra; `Page` y `PageSize` son opcionales, deben venir juntas y, cuando tienen valor, representar una página válida.
6. Organiza cada entidad en su módulo, sin acoplar los casos de uso de sus hijos. En su única slice `Get`, implementa siempre `GetById` y `GetAll` con el mismo `Data`, `Projections.ToData`, `Extensions.ToResponse` y `Response`; filtra por permisos y opciones nullable, ordena y, si la pareja de paginación está presente, pagina antes de materializar.
7. Para mutaciones, valida antes de producir efectos, respeta invariantes y propaga `CancellationToken`. Cuando Create copie un snapshot, proyecta origen a `Data` local de la slice y conviértelo a **nuevas** entidades; no reutilices `Data` de Get para persistir. Usa el proveedor de tiempo UTC del proyecto para instantes de negocio.
8. Si el requisito implica concurrencia, transacciones o unicidad, separa comprobaciones de negocio de garantías de persistencia, realiza rollback antes de reclasificar un conflicto y mantén respuestas HTTP genéricas sin filtrar detalles del proveedor.
9. Expón operaciones con controllers delgados, binding explícito y seguridad intacta; integra handlers, validators y nombres de endpoint. Explica archivos y omisiones, códigos HTTP, decisiones de contrato y pendientes; realiza únicamente verificaciones no basadas en pruebas exigidas por el proyecto.

## Referencias por archivo

Consulta las guías por tipo de archivo. Cada una indica en qué slices aplica y cuándo omitirla:

| Archivo o responsabilidad  | Guía                                                        |
| -------------------------- | ----------------------------------------------------------- |
| Handler de Application     | [handler.md](references/handler.md)                         |
| Request de entrada         | [request.md](references/request.md)                         |
| Validación de entrada      | [validator.md](references/validator.md)                     |
| Modelo interno o snapshot  | [data.md](references/data.md)                               |
| Modelo de presentación     | [model.md](references/model.md)                             |
| Resultados y contratos     | [response.md](references/response.md)                       |
| Proyecciones EF            | [projections.md](references/projections.md)                 |
| Conversión y copia         | [extensions.md](references/extensions.md)                   |
| Controllers HTTP           | [controller.md](references/controller.md)                   |
| Nombres/operation IDs HTTP | [endpoint-names.md](references/endpoint-names.md)           |
| Registro DI del módulo     | [module-registration.md](references/module-registration.md) |
| Entidades, enums y esquema | [domain-persistence.md](references/domain-persistence.md)   |
| Transacciones y conflictos | [concurrency.md](references/concurrency.md)                 |

`Data`, `Projections` y `Extensions` corresponden a lecturas y también a comandos que requieren un snapshot del origen; no los generes para mutaciones por simetría. `EndpointNames`, registro de módulo y cambios de esquema son condicionales al proyecto y al alcance. Sigue el TFM y las convenciones existentes en lo demás: los ejemplos orientan, no son una plantilla que deba copiarse sin adaptación.
