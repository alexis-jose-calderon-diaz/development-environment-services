# `Request.cs`

## Responsabilidad

Describe la entrada compuesta de `GetAll`: filtros y parámetros de paginación. `GetById` normalmente recibe solo un identificador y no necesita un `Request` que lo envuelva.

## Cuándo incluirlo

Inclúyelo cuando `GetAll` recibe filtros o paginación como un conjunto coherente. Para un listado sin parámetros, no crees un request vacío. Mantén los nombres y tipos compatibles con el contrato JSON y las convenciones del proyecto.

## Ejemplo

```csharp
public sealed record Request
{
    public bool? Active { get; init; }
    public string? Search { get; init; }

    public required int Page { get; init; }
    public required int PageSize { get; init; }
}
```

El ejemplo marca obligatoria la paginación. Si el proyecto asigna valores predeterminados o usa un enum para los tamaños permitidos, conserva esa semántica en lugar de cambiar silenciosamente el contrato.

## Decisiones importantes

- Usa nullable para filtros opcionales cuando `null` signifique “no aplicar filtro”. No vuelvas obligatorio un filtro opcional por comodidad.
- En cuerpos JSON, expresa presencia y validez con los tipos, `required`, deserialización y el validador del proyecto. No uses atributos de binding de query (`[BindRequired]`) como sustituto de validación del body.
- Normaliza strings en un solo lugar y antes de validarlas, si así lo hace el proyecto. No conviertas mayúsculas/minúsculas sin considerar la cultura y la semántica de búsqueda.
- No pongas `IFormFile`, tipos MVC ni dependencias de transporte en un request de Application.
- Asegura límites razonables de página y tamaño para evitar consultas ilimitadas. Las reglas concretas pertenecen a `Validator.cs`.
