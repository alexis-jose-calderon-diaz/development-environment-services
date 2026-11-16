# Design

## Context

See `proposal.md` - Why. `AGENTS.md` permite actualmente que los handlers reciban escalares de negocio directamente y desalienta los `Request` de una propiedad. La skill repite esa convención en `handler.md`, `request.md` y `controller.md`.

El proyecto ya separa los `Request` de Application de los tipos MVC, exige binding explícito en controllers y usa body JSON para payloads ordinarios. `DataFeed` y `Pdf/*` conservan excepciones de query; las subidas usan `multipart/form-data` e `IFormFile`. La spec `controllers-http-transport` también requiere que los cambios de contrato sean deliberados.

## Goals / Non-Goals

**Goals:**

- Establecer un único contrato de entrada de negocio por caso de uso: un objeto `Request` con todas las propiedades excepto el identificador de la entidad principal.
- Aplicar la misma regla a la firma de handlers de Application y a la acción HTTP que los invoca.
- Mantener separados los parámetros técnicos, como `CancellationToken`, y evitar `Request` vacíos cuando el único dato de negocio sea el ID principal.
- Conservar la separación entre modelos de Application y tipos exclusivos del transporte HTTP.

**Non-Goals:**

- Migrar handlers, controllers ni contratos existentes en este cambio documental.
- Modificar rutas, verbos, autenticación, validación de negocio, persistencia o clientes generados.
- Introducir una regla que exija crear validators cuando el `Request` no tenga restricciones que validar.

## Decisions

### Un `Request` agrupa todos los datos de negocio salvo el ID principal

Cada handler recibe todos sus datos de negocio en una sola instancia de `Request`, incluso si el objeto tiene una propiedad o si el valor es un ID de otra entidad. Si el caso de uso opera sobre una entidad identificada, su ID principal permanece como argumento separado; si ese es el único dato de negocio, no se crea `Request`. Casos como Create o consultas sin entidad principal llevan todos sus datos en `Request`.

`CancellationToken` permanece como último parámetro técnico y no se incorpora al contrato de negocio. Las dependencias de Application siguen resolviéndose por inyección, no desde el `Request`.

Alternativa considerada: permitir escalares directos cuando su significado se deduce del nombre del caso de uso. Se descarta porque recrea las firmas dispares que motivan la propuesta y obliga a cambiar firmas cuando se agregan más campos.

### El contrato `Request` es independiente de la necesidad de un validator

La necesidad del objeto depende de los datos de negocio de la operación, no de si esos datos tienen restricciones que validar. Si el `Request` requerido no tiene reglas de validación, se omite el validator vacío, pero se conserva el objeto de entrada. FluentValidation ejecuta todas las restricciones; los DataAnnotations solo se agregan cuando aportan una descripción útil al schema OpenAPI. Toda restricción declarada con DataAnnotations debe tener su equivalente en FluentValidation, mientras que FluentValidation puede contener reglas adicionales sin DataAnnotations.

Alternativa considerada: eliminar un `Request` de una propiedad cuando no exige validación o crear un validator vacío para cada Request. Se descartan ambas: la primera rompe el contrato uniforme de entrada y la segunda añade artefactos sin reglas que ejecutar.

### El controller también agrupa los datos de negocio en un objeto

La acción HTTP declara, cuando corresponde, el ID principal de ruta, un único objeto de entrada y `CancellationToken`; no declara parámetros de negocio escalares adicionales. Para endpoints ordinarios con payload, el objeto se enlaza explícitamente desde `[FromBody]`. Los valores que antes aparecían como parámetros adicionales de ruta se convierten en propiedades del objeto de entrada, aunque eso requiera un cambio deliberado de ruta o contrato.

Las excepciones vigentes de `DataFeed` y `Pdf/*` pueden conservar query binding, pero sus valores se agrupan en un objeto de entrada. Las subidas `multipart/form-data` usan un modelo exclusivo del host cuando sea necesario para encapsular `IFormFile`; el controller adapta esos valores al `Request` de Application, que no puede depender de tipos MVC.

Alternativa considerada: permitir que el controller mantenga varios escalares HTTP y solo construya un `Request` al invocar Application. Se descarta porque no cumpliría la decisión confirmada de aplicar el objeto también en la frontera del controller.

### Los cambios de contrato se identifican y gestionan explícitamente

La regla documental no modifica endpoints. Al aplicarla en un cambio posterior, cualquier traslado de valores de ruta o cuerpo escalar a un objeto puede cambiar OpenAPI y consumidores. Ese impacto debe aparecer en el alcance de ese cambio; cuando cambie un contrato público, se actualizan sus specs y se regenera el cliente Orval conforme al flujo vigente. No se conserva un parámetro HTTP escalar solo para ocultar la nueva forma de entrada dentro de la llamada al handler.

Alternativa considerada: imponer compatibilidad externa incondicional. Se descarta porque la convención elegida exige un objeto también en el controller y el usuario aceptó cambios de ruta o contrato cuando sean necesarios.

### Las reglas y ejemplos se sincronizan en ambas fuentes de instrucciones

`AGENTS.md` es la guía global del repositorio. La skill replica el contrato en su resumen, flujo y guías por tipo de archivo. Se actualizarán los pasajes contradictorios de `SKILL.md`, `handler.md`, `request.md`, `controller.md`, `validator.md` y `module-registration.md`; las guías que solo indican que una operación ID-only no necesita `Request` permanecen válidas.

Alternativa considerada: editar solo `AGENTS.md` o solo la guía de Requests. Se descarta porque la otra fuente mantendría instrucciones incompatibles para futuras implementaciones.

## Risks / Trade-offs

- **Un `Request` de una propiedad agrega estructura para entradas simples** → mantener el tipo local a la slice, omitir validators vacíos sin eliminar el `Request` exigido por el contrato y no crear el objeto cuando solo existe el ID principal.
- **Mover valores HTTP puede cambiar rutas o schemas** → no migrar endpoints en este cambio; documentar el impacto en cada cambio posterior y actualizar specs/OpenAPI/Orval según corresponda.
- **Las excepciones de query y multipart pueden interpretarse como permiso para declarar escalares en actions** → describirlas como excepciones de origen de binding, no de forma: el action sigue recibiendo un único objeto de entrada y los tipos MVC permanecen en el host.

## Migration Plan

1. Actualizar las reglas en `AGENTS.md` y alinear `SKILL.md`, `handler.md`, `request.md`, `controller.md` y `validator.md`, incluyendo la relación direccional entre DataAnnotations y FluentValidation.
2. Revisar referencias relacionadas para confirmar que las excepciones ID-only, `CancellationToken` y la omisión de validators sin reglas no contradicen el contrato `Request`.
3. Validar el cambio OpenSpec y la coherencia textual, y ejecutar `dotnet build backend/Production.slnx` según la validación mínima del repositorio. No se requiere codegen mientras no cambie OpenAPI.

## Open Questions

Ninguna.
