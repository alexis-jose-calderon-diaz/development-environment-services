# `Response.cs`

## Responsabilidad

Define el contrato público que Application entrega al controller. Para `GetById`, devuelve un elemento estructurado; para `GetAll`, devuelve la colección y los metadatos de paginación definidos por la API.

## Cuándo incluirlo

Incluye `Response` cuando el resultado representa un contrato estructurado. No crees un response para escalares como un ID, booleano o string. Si dos operaciones comparten deliberadamente el mismo elemento de respuesta, reutilízalo; no compartas contratos por casualidad.

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

Si el proyecto ya ofrece un wrapper genérico de paginación, úsalo en vez de duplicar `PaginatedResponse`.

## Decisiones importantes

- Trata nombres y tipos como parte del contrato OpenAPI/JSON; cualquier cambio puede afectar consumidores.
- No pongas valores por defecto para ocultar datos que el handler debería proporcionar.
- Mantén fuera del response entidades EF, navegación lazy, tipos de infraestructura y detalles internos de paginación.
- Decide y documenta cómo se representa una página vacía y el total de páginas, siguiendo el contrato existente.
