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

    [MaxLength(100, ErrorMessage = "La búsqueda no puede exceder los 100 caracteres.")]
    public string? Search { get; init; }

    [Range(1, int.MaxValue, ErrorMessage = "La página debe ser mayor o igual a 1.")]
    public required int Page { get; init; }

    [Range(1, 100, ErrorMessage = "El tamaño de página debe estar entre 1 y 100.")]
    public required int PageSize { get; init; }
}
```

`Update/Request.cs` tiene el mismo nombre simple dentro del namespace de su slice y solo contiene campos editables:

```csharp
using System.ComponentModel.DataAnnotations;

public sealed record Request
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(45, MinimumLength = 4)]
    public string Name { get; init; } = string.Empty;

    [Range(0, 99)]
    public required int Order { get; init; }

    public bool? Active { get; init; }
}
```

`Create/Request.cs` sigue el mismo principio, con los campos requeridos para crear. Si el proyecto asigna defaults o usa un enum de page size, conserva su semántica.

## Validaciones contractuales simples: DataAnnotations

Declara en cada DTO `Request` las reglas simples, locales a una propiedad y expresables con atributos estándar: presencia, longitud, rango o formato. Así el contrato queda visible junto al campo que limita.

```csharp
using System.ComponentModel.DataAnnotations;

public sealed record Request
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(45, MinimumLength = 4,
        ErrorMessage = "El nombre debe tener entre 4 y 45 caracteres.")]
    public string Name { get; init; } = string.Empty;

    [Range(0, 99, ErrorMessage = "El orden debe estar entre 0 y 99.")]
    public required int Order { get; init; }

    public required ProductStatus Status { get; init; }
}
```

Aplica estas reglas simples a los DTOs de Create, Get o Update según sus contratos; no agregues `Request` a Delete si solo recibe un ID. Si `PageSize` es `int`, un rango simple puede ir en DataAnnotations; si es enum, valida sus valores con FluentValidation (`IsInEnum`). La pertenencia de otros enums también se valida con FluentValidation, no con `[EnumDataType]`.

## Decisiones importantes

- Usa nullable para filtros opcionales cuando `null` signifique “no aplicar filtro”. No vuelvas obligatorio un filtro opcional por comodidad.
- En cuerpos JSON, usa DataAnnotations para restricciones simples de contrato y los tipos/`required` conforme al TFM; FluentValidation cubre reglas complejas, enums y comportamiento. No uses atributos de binding de query (`[BindRequired]`) como sustituto de validación del body.
- Normaliza strings en un solo lugar y antes de validarlas, si así lo hace el proyecto. No conviertas mayúsculas/minúsculas sin considerar la cultura y la semántica de búsqueda.
- No pongas `IFormFile`, tipos MVC ni dependencias de transporte en un request de Application.
- Asegura límites razonables de página y tamaño para evitar consultas ilimitadas. Las reglas concretas pertenecen a `Validator.cs`.
- En Update, incluye solo campos que la operación permite cambiar; no reutilices automáticamente el Request de Create.
- En Create, no aceptes campos controlados por el servidor (por ejemplo, ID autogenerado) salvo que el contrato lo requiera expresamente.
- Los parámetros escalares de significado claro (`id`, estado) suelen ir directamente al handler/controller; evita requests artificiales.
- DataAnnotations y FluentValidation son mecanismos distintos: `[ApiController]` hace que MVC ejecute la validación de contrato del DTO y responda automáticamente con 400 si ModelState es inválido; `ValidateAndThrowAsync` no ejecuta automáticamente los atributos DataAnnotations. Si Application tiene callers que no pasan por MVC, asegúrate de que reciban la validación de contrato correspondiente.
