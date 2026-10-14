# `Request.cs` en las slices CRUD

## Responsabilidad

Describe el payload compuesto de una operación de Application. No es un envoltorio universal para cada parámetro: cada `Request` vive junto a su slice y solo se crea cuando aporta significado.

## Cuándo incluirlo

Dónde/cuándo aplicarlo:

- **Create**: normalmente tiene `Create/Request.cs` para los datos necesarios para crear.
- **Get**: `Get/Request.cs` representa filtros y paginación de `GetAll`; `GetById` sigue recibiendo el ID directamente si ese es el patrón.
- **Update**: usa `Update/Request.cs` para los campos editables; pasa el ID de ruta aparte del payload.
- **Delete**: no crees `Delete/Request.cs` si solo necesita un ID. Si hay una razón funcional para datos adicionales, modela esa entrada y nómbrala con claridad.

No crees requests vacíos ni envelopes que solo contengan un ID. Mantén los tipos compatibles con JSON y las convenciones del proyecto.

## Ejemplo

`Get/Request.cs` representa filtros y paginación del listado:

```csharp
public sealed record Request
{
    public bool? Active { get; init; }
    public string? Search { get; init; }

    public required int Page { get; init; }
    public required int PageSize { get; init; }
}
```

`Update/Request.cs` tiene el mismo nombre simple dentro del namespace de su slice y solo contiene campos editables:

```csharp
public sealed record Request
{
    public required string Name { get; init; }
    public bool? Active { get; init; }
}
```

`Create/Request.cs` sigue el mismo principio, con los campos requeridos para crear. Si el proyecto asigna defaults o usa un enum de page size, conserva su semántica.

## Decisiones importantes

- Usa nullable para filtros opcionales cuando `null` signifique “no aplicar filtro”. No vuelvas obligatorio un filtro opcional por comodidad.
- En cuerpos JSON, expresa presencia y validez con los tipos, `required`, deserialización y el validador del proyecto. No uses atributos de binding de query (`[BindRequired]`) como sustituto de validación del body.
- Normaliza strings en un solo lugar y antes de validarlas, si así lo hace el proyecto. No conviertas mayúsculas/minúsculas sin considerar la cultura y la semántica de búsqueda.
- No pongas `IFormFile`, tipos MVC ni dependencias de transporte en un request de Application.
- Asegura límites razonables de página y tamaño para evitar consultas ilimitadas. Las reglas concretas pertenecen a `Validator.cs`.
- En Update, incluye solo campos que la operación permite cambiar; no reutilices automáticamente el Request de Create.
- En Create, no aceptes campos controlados por el servidor (por ejemplo, ID autogenerado) salvo que el contrato lo requiera expresamente.
- Los parámetros escalares de significado claro (`id`, estado) suelen ir directamente al handler/controller; evita requests artificiales.
