# Controllers HTTP de las slices CRUD

## Responsabilidad

Adapta HTTP a Application y devuelve el status code del contrato. Cada entidad tiene su propio transporte y un `GetController` que expone **ambos** `GetById` y su **único** `GetAll` paginado. Los controllers son delgados: sin acceso a EF Core, validaciones manuales ni lógica de negocio.

La action agrupa todos los datos de negocio en un único objeto de entrada, aunque tenga una sola propiedad. Solo el ID de la entidad principal puede declararse como parámetro de negocio separado; `CancellationToken` es técnico. Si la acción solo recibe el ID principal, no necesita objeto de entrada. Si no hay ID principal, todos los datos de negocio van en el objeto.

## Cuándo incluirlo

Incluye el controller/acción para cada operación CRUD o transición de negocio que se exponga por HTTP. Si la solución usa otro transporte, adapta la frontera sin mover tipos MVC a Application. Crea controllers del módulo propietario de cada entidad —por ejemplo, `Cotizacion/GetController` y `ProductoCotizacion/GetController`— y conserva siempre juntos GetById/GetAll de la misma entidad.

## Ejemplo

```csharp
using Production.Application.Models;

[ApiController]
[Route("api/v1/products")]
public sealed class CreateController(Create.Handler handler) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(
        [FromBody] Create.Request request,
        CancellationToken cancellationToken
    )
    {
        int id = await handler.Handle(request, cancellationToken);
        return CreatedAtRoute(EndpointNames.GetById, new { id }, id);
    }
}

[ApiController]
[Route("api/v1/products")]
public sealed class GetController(Get.Handler handler) : ControllerBase
{
    [HttpGet("{id:int}", Name = EndpointNames.GetById)]
    [EndpointName(EndpointNames.GetById)]
    [ProducesResponseType(typeof(Get.Response), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Get.Response>> GetById(
        [FromRoute] int id,
        CancellationToken cancellationToken
    )
    {
        Get.Response response = await handler.Handle(id, cancellationToken);
        return Ok(response);
    }

    [HttpPost("search")]
    [EndpointName(EndpointNames.GetAll)]
    [ProducesResponseType(typeof(PaginatedResponse<Get.Response>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResponse<Get.Response>>> GetAll(
        [FromBody] Get.Request request,
        CancellationToken cancellationToken
    )
    {
        PaginatedResponse<Get.Response> response = await handler.Handle(
            request,
            cancellationToken
        );
        return Ok(response);
    }
}

[ApiController]
[Route("api/v1/products")]
public sealed class UpdateController(Update.Handler handler) : ControllerBase
{
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        [FromRoute] int id,
        [FromBody] Update.Request request,
        CancellationToken cancellationToken
    )
    {
        await handler.Handle(id, request, cancellationToken);
        return NoContent();
    }
}

[ApiController]
[Route("api/v1/products")]
public sealed class AnnulController(Annul.Handler handler) : ControllerBase
{
    [HttpPut("{id:int}/annul")]
    public async Task<IActionResult> Annul(
        [FromRoute] int id,
        [FromBody] Annul.Request request,
        CancellationToken cancellationToken
    )
    {
        await handler.Handle(id, request, cancellationToken);
        return NoContent();
    }
}

[ApiController]
[Route("api/v1/products")]
public sealed class DeleteController(Delete.Handler handler) : ControllerBase
{
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(
        [FromRoute] int id,
        CancellationToken cancellationToken
    )
    {
        await handler.Handle(id, cancellationToken);
        return NoContent();
    }
}
```

## Decisiones importantes

- Declara explícitamente `[FromRoute]`, `[FromBody]` o el origen que corresponda; no dependas de inferencias implícitas.
- Create recibe normalmente `[FromBody] Request`; si devuelve un ID y el contrato lo requiere, usa `201 Created` con una ruta de lectura enlazable.
- GetById recibe el ID desde la ruta; GetAll usa el endpoint y binding establecidos por el proyecto y devuelve `Production.Application.Models.PaginatedResponse<Get.Response>`. Publica exactamente un listado por entidad; incluso cuando el listado filtra por ID de un padre, ese ID va como filtro **nullable** del Request.
- La pareja `Page`/`PageSize` es opcional: omitir ambas propiedades devuelve todos los resultados coincidentes en ese mismo listado. No añadas un endpoint separado para obtener la colección completa. Si una ruta preexistente contradice el contrato, informa la incompatibilidad antes de cambiarlo.
- Los listados ordinarios exponen el wrapper genérico en `ProducesResponseType`; `Planificacion` mantiene su response propio con `resume` en la raíz. Cuando cambie un contrato público, regenera los consumidores OpenAPI/Orval según las instrucciones del proyecto.
- Update enlaza el ID principal desde ruta y el `Request` desde body, aunque el request solo tenga un campo editable; usa el verbo y status code establecidos por el API.
- Delete recibe directamente el ID si no hay payload y suele responder `204 No Content` cuando no devuelve contenido.
- Ninguna action declara parámetros de negocio escalares aparte del ID principal. Todos los demás valores, incluidos IDs relacionados, son propiedades del objeto de entrada. En endpoints ordinarios el objeto va en el body; los parámetros adicionales que antes estaban en la ruta se trasladan al objeto y cualquier cambio de ruta/schema debe ser deliberado.
- Las excepciones `DataFeed` y `Pdf/*` pueden conservar query binding agrupado en un objeto. Para `multipart/form-data`, agrupa archivos y campos en un modelo exclusivo del host y adapta sus datos a Application; nunca pongas `IFormFile` ni tipos MVC en el `Request` de Application.
- Propaga `CancellationToken` y delega íntegramente en Application.
- Conserva autorización y policies existentes. No añadas roles ni cambies autenticación sin requisito explícito.
- En operaciones especializadas conserva su verbo/segmento y status acordados. El controller no comprueba estados, propietarios, roles de negocio ni gestiona transacciones; delega en el handler.
- Declara los status codes relevantes para el OpenAPI del proyecto.
- Usa nombres, rutas, tags y summaries de acuerdo con las convenciones locales. Consulta `endpoint-names.md` si existen constantes de operation ID.
- Con `[ApiController]`, MVC ejecuta DataAnnotations del DTO enlazado y produce automáticamente 400 cuando ModelState es inválido; no agregues un `ModelState.IsValid` redundante.
- FluentValidation no ejecuta automáticamente los atributos DataAnnotations. El handler de Application ejecuta siempre su validator con `ValidateAsync`/`ValidateAndThrowAsync`, incluidas las reglas reflejadas en atributos; si hay reglas `MustAsync`, no dependas de una validación MVC síncrona.
