# Controllers HTTP de las slices CRUD

## Responsabilidad

Adapta HTTP a Application y devuelve el status code del contrato. Cada entidad tiene su propio transporte y un `GetController` que expone **ambos** `GetById` y su **único** `GetAll` paginado. Los controllers son delgados: sin acceso a EF Core, validaciones manuales ni lógica de negocio.

## Cuándo incluirlo

Incluye el controller/acción para cada operación CRUD o transición de negocio que se exponga por HTTP. Si la solución usa otro transporte, adapta la frontera sin mover tipos MVC a Application. Crea controllers del módulo propietario de cada entidad —por ejemplo, `Cotizacion/GetController` y `ProductoCotizacion/GetController`— y conserva siempre juntos GetById/GetAll de la misma entidad.

## Ejemplo

```csharp
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
    [ProducesResponseType(typeof(Get.PaginatedResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<Get.PaginatedResponse>> GetAll(
        [FromBody] Get.Request request,
        CancellationToken cancellationToken
    )
    {
        Get.PaginatedResponse response = await handler.Handle(request, cancellationToken);
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
- GetById recibe el ID desde la ruta; GetAll usa `POST search` con `[FromBody] Get.Request` y devuelve `Get.PaginatedResponse`. Publica exactamente un listado por entidad; incluso cuando el listado filtra por ID de un padre, ese ID va como filtro **nullable** del Request, no como un endpoint que devuelve la colección completa.
- No añadas endpoints de listado sin paginación (`GET /parent/{parentId}`, `GET /all` ni variantes de búsqueda). Si una ruta preexistente contradice la regla, informa la incompatibilidad antes de cambiar su contrato, sin duplicarla en una nueva slice.
- Update enlaza el ID desde ruta y el payload desde body cuando es compuesto; usa el verbo y status code establecidos por el API.
- Delete recibe directamente el ID si no hay payload y suele responder `204 No Content` cuando no devuelve contenido.
- Propaga `CancellationToken` y delega íntegramente en Application.
- Conserva autorización y policies existentes. No añadas roles ni cambies autenticación sin requisito explícito.
- En operaciones especializadas conserva su verbo/segmento y status acordados. El controller no comprueba estados, propietarios, roles de negocio ni gestiona transacciones; delega en el handler.
- Declara los status codes relevantes para el OpenAPI del proyecto.
- Usa nombres, rutas, tags y summaries de acuerdo con las convenciones locales. Consulta `endpoint-names.md` si existen constantes de operation ID.
- Con `[ApiController]`, MVC ejecuta DataAnnotations del DTO enlazado y produce automáticamente 400 cuando ModelState es inválido; no agregues un `ModelState.IsValid` redundante.
- FluentValidation no ejecuta automáticamente los atributos DataAnnotations. El handler de Application ejecuta siempre su validator con `ValidateAsync`/`ValidateAndThrowAsync`, incluidas las reglas reflejadas en atributos; si hay reglas `MustAsync`, no dependas de una validación MVC síncrona.
