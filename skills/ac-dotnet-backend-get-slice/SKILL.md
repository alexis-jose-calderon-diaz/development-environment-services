---
name: ac-dotnet-backend-get-slice
description: "Diseña o implementa una slice GET de backend en .NET que reúna GetById y GetAll paginado cuando compartan deliberadamente el mismo contrato de elemento. Úsala cuando se solicite crear, completar o revisar una consulta de este tipo en una API ASP.NET Core; cubre Application, controller e integración backend, sin frontend ni generación de clientes."
---

# Slice GET para backend .NET

Ayuda a implementar y explicar una slice de lectura en una API backend .NET, desde la consulta de aplicación hasta el controller HTTP. El patrón de referencia cubre `GetById` y `GetAll` paginado; adapta los tipos, las capas y el transporte a las convenciones del repositorio en vez de imponer una arquitectura fija.

## Alcance

- Cubre el caso de uso backend y su controller HTTP delgado.
- El ejemplo de `GetAll` usa un body con filtros y paginación, expuesto mediante `POST search`. Si el proyecto ya establece otra convención HTTP, respétala y explica el motivo.
- No incluye frontend, clientes generados, codegen ni cambios de esquema de base de datos, salvo petición explícita.
- No combines las dos lecturas solo por compartir la entidad. Mantén `GetById` y `GetAll` en una misma slice cuando compartan deliberadamente proyección, transformación y contrato de elemento. Si divergen, señala la diferencia y recomienda separar las operaciones.

## Flujo de trabajo

1. Lee las instrucciones del repositorio, revisa el TFM y la versión de C#, y localiza una consulta existente y el controller más cercanos. Identifica cómo se resuelven persistencia, validación, paginación, autorización, rutas y registro DI.
2. Decide qué archivos hacen falta. No crees archivos vacíos ni artefactos que la operación no necesite. Las referencias de abajo explican el propósito y los criterios de inclusión de cada archivo.
3. Implementa la lectura por ID con el identificador como parámetro escalar; crea un `Request` para `GetAll` cuando sus filtros y paginación formen una entrada compuesta.
4. Proyecta desde la consulta a un modelo interno de lectura antes de materializar; transforma ese modelo al contrato público siguiendo el patrón del proyecto. Evita traer entidades completas o usar `Include` si basta una proyección.
5. Expón ambas operaciones mediante acciones delgadas. Declara el origen de cada parámetro y conserva la autenticación y las policies existentes; no inventes requisitos de seguridad.
6. Registra handler y validator en el módulo existente cuando el proyecto use registro explícito. Actualiza los nombres de endpoint si son parte de la convención local.
7. Explica los archivos creados o modificados, por qué aplican, las decisiones sobre paginación y el contrato HTTP, y los archivos deliberadamente omitidos. Ejecuta solo las validaciones relevantes para el cambio de código solicitado.

## Referencias por archivo

Consulta únicamente las guías aplicables al proyecto y a la operación:

| Archivo o responsabilidad | Guía |
|---|---|
| Handler de Application | [handler.md](references/handler.md) |
| Entrada compuesta de GetAll | [request.md](references/request.md) |
| Reglas de entrada | [validator.md](references/validator.md) |
| Modelo interno de lectura | [data.md](references/data.md) |
| Contrato público | [response.md](references/response.md) |
| Proyección EF Core | [projections.md](references/projections.md) |
| Conversión de Data a Response | [extensions.md](references/extensions.md) |
| Controller HTTP | [controller.md](references/controller.md) |
| Constantes/operation IDs HTTP | [endpoint-names.md](references/endpoint-names.md) |
| Registro de handler y validator | [module-registration.md](references/module-registration.md) |

Las guías de `EndpointNames` y registro de módulo son condicionales: aplícalas solo si el proyecto separa esas responsabilidades. Sigue el TFM y las convenciones existentes; los ejemplos muestran una forma posible, no una plantilla que deba copiarse sin adaptación.
