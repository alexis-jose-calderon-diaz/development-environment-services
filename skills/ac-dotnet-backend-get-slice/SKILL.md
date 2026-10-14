---
name: ac-dotnet-backend-get-slice
description: "Diseña o implementa slices CRUD de backend en .NET para APIs ASP.NET Core. Úsala cuando se solicite crear, completar o revisar Create, Get, Update o Delete; explica los archivos por tipo y conserva GetById y GetAll juntos en la slice Get cuando compartan proyección y contrato. Cubre Application, controllers e integración backend, sin frontend ni codegen."
---

# Slices CRUD para backend .NET

Ayuda a implementar y explicar un CRUD de backend .NET, desde los casos de uso hasta los controllers HTTP. Las referencias se organizan por tipo de archivo —no por acción— y explican dónde, cuándo y cómo aplica cada artefacto en `Create`, `Get`, `Update` y `Delete`. Adapta las capas y el transporte a las instrucciones y convenciones del repositorio.

## Alcance

- Cubre las slices de Application y sus controllers HTTP delgados.
- Mantén `Create`, `Get`, `Update` y `Delete` como slices independientes si esa es la arquitectura del proyecto. No crees un único handler de código para todo el CRUD.
- Dentro de `Get`, `GetById` y `GetAll` pueden compartir `Get/Handler.cs` con overloads cuando comparten deliberadamente proyección, transformación y contrato de elemento. No los separes solo por ser endpoints distintos.
- El ejemplo de `GetAll` usa un body con filtros y paginación, expuesto mediante `POST search`. Si el proyecto establece otra convención HTTP, respétala y explica el motivo.
- No incluye frontend, clientes generados, codegen ni cambios de esquema de base de datos, salvo petición explícita.
- No infieras reglas de negocio para crear, actualizar o eliminar. Conserva las invariantes del dominio, el tratamiento de not-found y el comportamiento de borrado existentes.

## Flujo de trabajo

1. Lee instrucciones, TFM/versión de C# y slices CRUD vecinas. Identifica persistencia, validación, contratos, rutas, seguridad y DI antes de elegir una estructura.
2. Delimita las operaciones solicitadas y su comportamiento: resultado de Create, lecturas de Get, mutación de Update y política de Delete. No agregues operaciones ni reglas de negocio implícitas.
3. Separa las validaciones: DataAnnotations en el DTO `Request` para reglas simples de contrato; FluentValidation para contrato complejo, enums y reglas de comportamiento. No dupliques la misma regla en ambos mecanismos.
4. Organiza cada caso de uso en su slice y decide archivo por archivo si aplica. Un archivo de referencia explica las variantes de un mismo tipo a través del CRUD; no implica juntar las acciones en un mismo archivo de código.
5. Para `Get`, conserva la combinación de `GetById` y `GetAll` cuando compartan deliberadamente su contrato y proyección. `GetById` recibe el ID como escalar; `GetAll` recibe un `Request` compuesto cuando necesite filtros/paginación.
6. Para mutaciones, valida la entrada, respeta invariantes, persiste los cambios y propaga `CancellationToken`. Usa el modelo de dominio/entidad apropiado; no reutilices `Data` de lectura para escribir.
7. Expón las operaciones mediante controllers delgados, declara explícitamente el origen de parámetros y conserva autenticación/policies. Integra DI y nombres de endpoint según las convenciones existentes.
8. Explica qué archivos se crearon/modificaron, a qué slice pertenecen, por qué aplican o se omitieron, los resultados HTTP y las decisiones funcionales. Ejecuta solo las validaciones pertinentes al cambio de código solicitado.

## Referencias por archivo

Consulta las guías por tipo de archivo. Cada una indica en qué slices CRUD aplica y cuándo omitirla:

| Archivo o responsabilidad  | Guía                                                        |
| -------------------------- | ----------------------------------------------------------- |
| Handler de Application     | [handler.md](references/handler.md)                         |
| Request de entrada         | [request.md](references/request.md)                         |
| Validación de entrada      | [validator.md](references/validator.md)                     |
| Modelo de lectura          | [data.md](references/data.md)                               |
| Resultados y contratos     | [response.md](references/response.md)                       |
| Proyección de lectura      | [projections.md](references/projections.md)                 |
| Conversión de lectura      | [extensions.md](references/extensions.md)                   |
| Controllers HTTP           | [controller.md](references/controller.md)                   |
| Nombres/operation IDs HTTP | [endpoint-names.md](references/endpoint-names.md)           |
| Registro DI del módulo     | [module-registration.md](references/module-registration.md) |

`Data`, `Projections` y `Extensions` suelen corresponder a consultas; no los generes para mutaciones por simetría. `EndpointNames` y el registro de módulo son condicionales a las convenciones del proyecto. Sigue el TFM y las convenciones existentes: los ejemplos orientan, no son una plantilla que deba copiarse sin adaptación.
