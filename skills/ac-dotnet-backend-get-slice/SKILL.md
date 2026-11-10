---
name: ac-dotnet-backend-get-slice
description: "Diseña o implementa slices CRUD y operaciones relacionadas en backend .NET para APIs ASP.NET Core. Cada entidad expuesta tiene módulo propio con GetById y un único GetAll paginado en Get; orienta contratos, FluentValidation, DataAnnotations e integración backend, sin frontend ni pruebas."
---

# Slices CRUD para backend .NET

Ayuda a implementar y explicar slices de backend .NET, desde los casos de uso hasta los controllers HTTP. Las referencias se organizan por tipo de archivo —no por acción— y explican dónde, cuándo y cómo aplica cada artefacto en `Create`, `Get`, `Update`, `Delete` y operaciones especializadas. Adapta las capas y el transporte a las instrucciones y convenciones del repositorio.

## Alcance

- Cubre las slices de Application y sus controllers HTTP delgados; Domain/Infrastructure solo cuando sean necesarios y estén dentro del alcance solicitado.
- Cada entidad de negocio expuesta tiene su propio módulo y casos de uso; `Cotizacion` y `ProductoCotizacion` no comparten slices ni trasladan el CRUD del hijo al módulo del padre. Mantén `Create`, `Get`, `Update` y `Delete` como slices independientes dentro de cada módulo cuando se soliciten; no crees un handler para todo el CRUD.
- Cada módulo expuesto incluye **ambos** `GetById` y un **único** `GetAll` en la misma slice `Get`, compartiendo proyección, conversión y contrato de elemento. No crees `GetAll` alternativos ni listados separados por contexto.
- Todo listado es paginado mediante `POST search` con `Get/Request.cs`: `Search`, `Page` y `PageSize` requeridos; `Search` admite `""` pero no `null`; los filtros adicionales son siempre nullable y opcionales. No hay listado sin paginación ni se admite `PageSize = ALL`.
- En Get y sus respuestas solo proyecta propiedades de la entidad y referencias **hacia arriba** (p. ej. `Cotizacion` → `Cliente`), nunca entidades hijas/colecciones hacia abajo (p. ej. `Cotizacion` → `ProductosCotizacion`). Los hijos se consultan mediante su propio módulo. Un comando puede consultar/copiar hijos para un snapshot cuando el caso de uso lo requiera, sin incorporarlos al contrato Get del padre.
- Cubre también transiciones de estado y otras operaciones propias del módulo cuando se soliciten; no inventes acciones para completar una plantilla CRUD.
- No incluye frontend, clientes generados, codegen ni cambios de esquema de base de datos salvo petición explícita; si las instrucciones del proyecto requieren trabajo adicional, coordínalo o repórtalo como pendiente.
- No cubre ningún tipo de pruebas: no propongas ni añadas guías, casos o archivos de pruebas desde esta skill. La compilación y demás verificaciones no basadas en pruebas siguen las instrucciones del repositorio.
- No infieras reglas de negocio para crear, actualizar o eliminar. Conserva las invariantes del dominio, el tratamiento de not-found y el comportamiento de borrado existentes.

## Flujo de trabajo

1. Lee instrucciones, TFM/versión de C#, specs del cambio y slices vecinas. Identifica entidades de origen, relaciones, contratos, persistencia, validación, rutas, seguridad y DI. Si spec y código no coinciden, no conviertas la discrepancia en convención: aclara cuál manda.
2. Delimita las operaciones y sus resultados: creación, consultas, mutaciones, borrado o transiciones. Fija roles, alcance por propietario, estados permitidos, efectos y códigos HTTP a partir del requisito, sin inventarlos.
3. Diseña `Request`, `Data` y `Response` a partir de la estructura original de la entidad: preserva sus objetos de valor y, en Get, solo las asociaciones hacia entidades superiores; distingue relaciones requeridas y opcionales sin aplanar o duplicar propiedades por comodidad. Para tipos auxiliares anidados usa `RequestUsuario`, `DataUsuario`, `ResponseUsuario`; para variantes del contrato base usa un prefijo como `PaginatedResponse`.
4. Nombra **todos** los miembros de enums en `UPPER_SNAKE_CASE` (`PENDIENTE`, `EN_ANALISIS`); conserva sus valores numéricos y revisa referencias, defaults, persistencia y serialización si se renombra un enum existente. No presupongas que el nombre JSON anterior es equivalente al nuevo.
5. Implementa **todas** las reglas de validación del `Request` con FluentValidation (incluidas presencia, longitud, rango y pertenencia a enum); añade DataAnnotations equivalentes cuando existan para enriquecer OpenAPI/MVC. Mantén ambas descripciones alineadas; nunca dependas solo de DataAnnotations para validar Application. `Search = ""` es válido; `Page` y `PageSize` deben representar una página finita positiva.
6. Organiza cada entidad en su módulo, sin acoplar los casos de uso de sus hijos. En su única slice `Get`, implementa siempre `GetById` y `GetAll` con el mismo `Data`, `Projections.ToData`, `Extensions.ToResponse` y `Response`; filtra por permisos y opciones nullable, ordena y pagina antes de materializar.
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
| Resultados y contratos     | [response.md](references/response.md)                       |
| Proyecciones EF            | [projections.md](references/projections.md)                 |
| Conversión y copia         | [extensions.md](references/extensions.md)                   |
| Controllers HTTP           | [controller.md](references/controller.md)                   |
| Nombres/operation IDs HTTP | [endpoint-names.md](references/endpoint-names.md)           |
| Registro DI del módulo     | [module-registration.md](references/module-registration.md) |
| Entidades, enums y esquema | [domain-persistence.md](references/domain-persistence.md)   |
| Transacciones y conflictos | [concurrency.md](references/concurrency.md)                 |

`Data`, `Projections` y `Extensions` corresponden a lecturas y también a comandos que requieren un snapshot del origen; no los generes para mutaciones por simetría. `EndpointNames`, registro de módulo y cambios de esquema son condicionales al proyecto y al alcance. Sigue el TFM y las convenciones existentes en lo demás: los ejemplos orientan, no son una plantilla que deba copiarse sin adaptación.
