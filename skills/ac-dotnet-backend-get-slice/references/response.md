# `Response.cs` y resultados de las slices CRUD

## Responsabilidad

Define un resultado/contrato cuando la operación lo necesita. Distingue el resultado de Application del status code HTTP: no todas las acciones requieren un tipo `Response`.

## Cuándo incluirlo

Aplicación por slice:

- **Create**: si retorna el ID autogenerado, devuelve `Task<int>` u otro escalar definido por el proyecto; no lo envuelvas en un `Response` artificial. Un resultado estructurado sí justifica un contrato.
- **Get**: `GetById` devuelve el `Response` del elemento y el único `GetAll` ordinario devuelve `Production.Application.Models.PaginatedResponse<Response>`. El contrato del elemento permanece en la slice; no declares un wrapper paginado local. `Planificacion` conserva su respuesta propia porque incluye `resume` en la raíz.
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

```

Application proporciona `Production.Application.Models.PaginatedResponse<T>`, con `TotalCount`, `TotalPages` e `Items` requeridos. Los handlers ordinarios retornan ese tipo concreto y construyen el resultado mediante `PaginatedResponseFactory`; no retornan `IPaginatedResponse<T>` ni declaran otra clase envolvente. La API puede declarar un status code aunque Application retorne un escalar o nada.

## Estructura y naming

- La forma pública conserva la jerarquía y los nombres de las propiedades de entidad de origen para las asociaciones que el contrato incluye, incluso las indirectas. Por ejemplo, si `SolicitudCotizacionEntity` declara `ComercialUsuario`, la propiedad pública se llama `ComercialUsuario`; solo expón los campos autorizados y requeridos, sin serializar la entidad directamente ni aplanar relaciones en pares de ID/nombre inventados para esa respuesta.
- Limita el `Response` de Get a la entidad y sus referencias superiores; `Cotizacion` puede incluir `ResponseCliente`, pero nunca una colección de `ProductoCotizacion`. Los hijos se leen desde su propio GetById/GetAll. `PaginatedResponse<T>.Items` contiene la página cuando se envía la pareja de paginación y todos los resultados coincidentes cuando se omite.
- Para auxiliares que representan entidades usa el prefijo del transporte y el nombre de la entidad real (`ResponseUsuario`, `ResponseCliente`), no el de la navegación: `ComercialUsuario` puede ser de tipo `ResponseUsuario`. Incluye solo los campos requeridos; las declaraciones son top-level y locales a la slice, en el archivo de la slice o en uno propio si son sustanciales. Para objetos de valor, conserva el nombre del concepto (`ResponsePerfilTecnico`).
- Para otras **alternativas del resultado base** usa **prefijo de variante**: `SummaryResponse`. La paginación ordinaria ya tiene el wrapper global `PaginatedResponse<T>`; no crees una variante local. No uses `ResponsePaginated`/`ResponseSummary` para variantes ni `UsuarioResponse` para componentes del base. GetById y GetAll de la misma entidad comparten siempre el `Response` del elemento; no compartas un Response entre módulos de entidades distintas.
- Un objeto relacionado opcional se representa como nullable y ausente cuando la relación no existe; no crees un usuario/cliente vacío para ocultarlo. Los `Response` no llevan valores por defecto para simular datos válidos.

## Decisiones importantes

- Trata nombres y tipos como parte del contrato OpenAPI/JSON; cualquier cambio puede afectar consumidores.
- Los schemas OpenAPI ordinarios usan el tipo genérico concreto y sus IDs genéricos. Cuando cambie un contrato público, regenera los consumidores Orval según las instrucciones del proyecto.
- Mantén `Planificacion` en su contrato propio con `resume` en la raíz; no la conviertas al wrapper genérico.
- No pongas valores por defecto para ocultar datos que el handler debería proporcionar.
- Mantén fuera del response entidades EF, navegación lazy, tipos de infraestructura y detalles internos de paginación.
- Decide y documenta cómo se representa una respuesta vacía y el total de páginas, siguiendo el contrato existente: con pareja ausente, `totalPages` es `0` sin resultados y `1` cuando hay resultados.
- Distingue `CreatedAtRoute`/201 para Create de `NoContent`/204 para Update/Delete según el contrato HTTP local; el controller decide el status, no un `Response` de Application.
