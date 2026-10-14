# `{CasoDeUso}Controller.cs`

## Responsabilidad

Adapta el transporte HTTP a Application y devuelve el resultado con el status code correspondiente. Debe ser delgado: sin acceso directo a EF Core, filtros de negocio ni duplicación de validaciones.

## Cuándo incluirlo

Inclúyelo cuando la operación se exponga por HTTP en una API ASP.NET Core con controllers. Si la solución usa otro transporte, adapta la frontera sin mover tipos MVC a Application.

## Ejemplo

```csharp
[ApiController]
[Route("api/v1/products")]
public sealed class GetController(Handler handler) : ControllerBase
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
```

## Decisiones importantes

- Declara explícitamente `[FromRoute]`, `[FromBody]` o el origen que corresponda; no dependas de inferencias implícitas.
- El patrón base para un listado paginado con filtros en body es `POST search`. Si el proyecto ya define otro contrato, no lo cambies como parte de una nueva slice sin autorización.
- Propaga `CancellationToken` y delega íntegramente en Application.
- Conserva autorización y policies existentes. No añadas roles ni cambies autenticación sin requisito explícito.
- Declara los status codes relevantes para el OpenAPI del proyecto.
- Usa nombres, rutas, tags y summaries de acuerdo con las convenciones locales. Consulta `endpoint-names.md` si existen constantes de operation ID.
