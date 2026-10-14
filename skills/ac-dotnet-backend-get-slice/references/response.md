# `Response.cs` y resultados de las slices CRUD

## Responsabilidad

Define un resultado/contrato cuando la operación lo necesita. Distingue el resultado de Application del status code HTTP: no todas las acciones requieren un tipo `Response`.

## Cuándo incluirlo

Aplicación por slice:

- **Create**: si retorna el ID autogenerado, devuelve `Task<int>` u otro escalar definido por el proyecto; no lo envuelvas en un `Response` artificial. Un resultado estructurado sí justifica un contrato.
- **Get**: `GetById` devuelve el contrato del elemento; `GetAll` devuelve elementos más metadatos de paginación. Comparte el contrato de elemento cuando sea intencional.
- **Update/Delete**: si no devuelven datos, retorna `Task` y el controller puede responder `204 No Content`; no crees un response vacío.

No compartas contratos por casualidad. Un cambio en un `Response` público puede afectar OpenAPI y consumidores.

## Ejemplo

```csharp
public sealed record Response
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required bool Active { get; init; }
}

public sealed record PaginatedResponse
{
    public required int TotalCount { get; init; }
    public required int TotalPages { get; init; }
    public required IReadOnlyList<Response> Items { get; init; }
}
```

Si el proyecto ya ofrece un wrapper genérico de paginación, úsalo en vez de duplicar `PaginatedResponse`. La API puede declarar un status code aunque Application retorne un escalar o nada.

## Decisiones importantes

- Trata nombres y tipos como parte del contrato OpenAPI/JSON; cualquier cambio puede afectar consumidores.
- No pongas valores por defecto para ocultar datos que el handler debería proporcionar.
- Mantén fuera del response entidades EF, navegación lazy, tipos de infraestructura y detalles internos de paginación.
- Decide y documenta cómo se representa una página vacía y el total de páginas, siguiendo el contrato existente.
- Distingue `CreatedAtRoute`/201 para Create de `NoContent`/204 para Update/Delete según el contrato HTTP local; el controller decide el status, no un `Response` de Application.
