# Controllers HTTP de las slices CRUD

## Responsabilidad

Adapta HTTP a Application y devuelve el status code del contrato. El código puede tener controllers separados por operación y un `GetController` que agrupe `GetById`/`GetAll`, según la convención del proyecto. Deben ser delgados: sin acceso a EF Core ni lógica de negocio.

## Cuándo incluirlo

Incluye el controller/acción para cada operación CRUD que se exponga por HTTP. Si la solución usa otro transporte, adapta la frontera sin mover tipos MVC a Application. El código sigue la distribución local —por ejemplo, controllers separados para Create/Update/Delete y un GetController que agrupe ambas lecturas—; esta guía explica las variantes en un único documento.

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
    [ProducesResponseType(typeof(Response), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Response>> GetById(
        [FromRoute] int id,
        CancellationToken cancellationToken
    )
    {
        Response response = await handler.Handle(id, cancellationToken);
        return Ok(response);
    }

    [HttpPost("search")]
    [EndpointName(EndpointNames.GetAll)]
    [ProducesResponseType(typeof(PaginatedResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResponse>> GetAll(
        [FromBody] Request request,
        CancellationToken cancellationToken
    )
    {
        PaginatedResponse response = await handler.Handle(request, cancellationToken);
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
- GetById recibe el ID desde la ruta. El patrón base para GetAll paginado con filtros en body es `POST search`; respeta otra convención local si existe.
- Update enlaza el ID desde ruta y el payload desde body cuando es compuesto; usa el verbo y status code establecidos por el API.
- Delete recibe directamente el ID si no hay payload y suele responder `204 No Content` cuando no devuelve contenido.
- Propaga `CancellationToken` y delega íntegramente en Application.
- Conserva autorización y policies existentes. No añadas roles ni cambies autenticación sin requisito explícito.
- Declara los status codes relevantes para el OpenAPI del proyecto.
- Usa nombres, rutas, tags y summaries de acuerdo con las convenciones locales. Consulta `endpoint-names.md` si existen constantes de operation ID.
