# `Response.cs` y resultados de las slices CRUD

## Responsabilidad

Define un resultado/contrato cuando la operación lo necesita. Distingue el resultado de Application del status code HTTP: no todas las acciones requieren un tipo `Response`.

## Cuándo incluirlo

Aplicación por slice:

- **Create**: si retorna el ID autogenerado, devuelve `Task<int>` u otro escalar definido por el proyecto; no lo envuelvas en un `Response` artificial. Un resultado estructurado sí justifica un contrato.
- **Get**: `GetById` devuelve el `Response` del elemento y el único `GetAll` devuelve `PaginatedResponse` con esos mismos elementos y metadatos de paginación. Ambos contratos existen siempre para una entidad expuesta.
- **Update/Delete**: si no devuelven datos, retorna `Task` y el controller puede responder `204 No Content`; no crees un response vacío.
- **Transiciones**: no crees un `Response` solo para indicar éxito si la operación no retorna datos; respeta el contrato HTTP establecido.

No compartas contratos por casualidad. Un cambio en un `Response` público puede afectar OpenAPI y consumidores.

## Ejemplo

```csharp
public sealed record Response
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required bool Active { get; init; }
    public ResponseUsuario? CreadoPorUsuario { get; init; }
}

public sealed record ResponseUsuario
{
    public required int Id { get; init; }
    public required string Nombre { get; init; }
}

public sealed record PaginatedResponse
{
    public required int TotalCount { get; init; }
    public required int TotalPages { get; init; }
    public required IReadOnlyList<Response> Items { get; init; }
}
```

Si el proyecto ya ofrece un wrapper genérico de paginación, úsalo en vez de duplicar `PaginatedResponse`. La API puede declarar un status code aunque Application retorne un escalar o nada.

## Estructura y naming

- La forma pública corresponde a la estructura de la entidad y al contrato acordado: conserva `Cliente`, `CreadoPorUsuario`, `PerfilTecnico`, etc. como objetos si son relaciones/objetos anidados, no como pares planos de ID y nombre inventados para esa respuesta. Solo expón los campos autorizados; la entidad no se serializa directamente.
- Limita el `Response` de Get a la entidad y sus referencias superiores; `Cotizacion` puede incluir `ResponseCliente`, pero nunca una colección de `ProductoCotizacion`. Los hijos se leen desde su propio GetById/GetAll paginado. `PaginatedResponse.Items` es una página, no la colección completa.
- Para clases componentes del `Response` base usa **sufijo de concepto**: `ResponseUsuario`, `ResponseCliente`, `ResponsePerfilTecnico`; las declaraciones son top-level en el archivo de la slice o en uno propio si son sustanciales.
- Para una **alternativa del resultado base** usa **prefijo de variante**: `PaginatedResponse`, `SummaryResponse`. No uses `ResponsePaginated`/`ResponseSummary` para variantes ni `UsuarioResponse` para componentes del base. GetById y GetAll de la misma entidad comparten siempre `Response`; no compartas un Response entre módulos de entidades distintas.
- Un objeto relacionado opcional se representa como nullable y ausente cuando la relación no existe; no crees un usuario/cliente vacío para ocultarlo. Los `Response` no llevan valores por defecto para simular datos válidos.

## Decisiones importantes

- Trata nombres y tipos como parte del contrato OpenAPI/JSON; cualquier cambio puede afectar consumidores.
- No pongas valores por defecto para ocultar datos que el handler debería proporcionar.
- Mantén fuera del response entidades EF, navegación lazy, tipos de infraestructura y detalles internos de paginación.
- Decide y documenta cómo se representa una página vacía y el total de páginas, siguiendo el contrato existente.
- Distingue `CreatedAtRoute`/201 para Create de `NoContent`/204 para Update/Delete según el contrato HTTP local; el controller decide el status, no un `Response` de Application.
