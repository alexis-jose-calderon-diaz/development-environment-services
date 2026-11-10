# `Request.cs` en las slices CRUD

## Responsabilidad

Describe el payload compuesto de una operación de Application. No es un envoltorio universal para cada parámetro: cada `Request` vive junto a su slice y solo se crea cuando aporta significado. Sus propiedades y su anidamiento deben corresponder al modelo de la entidad de origen y a los campos editables del caso de uso, sin copiar propiedades no autorizadas.

## Cuándo incluirlo

Dónde/cuándo aplicarlo:

- **Create**: normalmente tiene `Create/Request.cs` para los datos necesarios para crear.
- **Get**: siempre existe `Get/Request.cs` para el único `GetAll` paginado de la entidad; `GetById` recibe el ID directamente, sin Request artificial, dentro de la misma slice Get.
- **Update**: usa `Update/Request.cs` para los campos editables; pasa el ID de ruta aparte del payload.
- **Delete**: no crees `Delete/Request.cs` si solo necesita un ID. Si hay una razón funcional para datos adicionales, modela esa entrada y nómbrala con claridad.
- **Transiciones**: recibe un ID directamente cuando no hay payload; si la operación requiere motivo u otros datos compuestos, crea su propio `Request` sin reutilizar el de Update.

No crees requests vacíos ni envelopes que solo contengan un ID. Mantén los tipos compatibles con JSON y las convenciones del proyecto.

## Ejemplo

`Get/Request.cs` representa filtros y paginación obligatorios del listado; el filtro adicional `Active` sigue siendo opcional:

```csharp
using System.ComponentModel.DataAnnotations;

public sealed record Request
{
    public bool? Active { get; init; }

    [Required(AllowEmptyStrings = true, ErrorMessage = "El término de búsqueda es obligatorio.")]
    [MaxLength(100, ErrorMessage = "La búsqueda no puede exceder los 100 caracteres.")]
    public required string? Search
    {
        get;
        init => field = value?.Trim().ToUpperInvariant();
    }

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
    public required string Name
    {
        get;
        init => field = value?.Trim().ToUpperInvariant() ?? string.Empty;
    } = string.Empty;

    [Range(0, 99)]
    public required int Order { get; init; }

    public bool? Active { get; init; }
}
```

`Create/Request.cs` sigue el mismo principio, con los campos requeridos para crear. Si el proyecto asigna defaults o usa un enum de page size, conserva su semántica.

## DataAnnotations para OpenAPI y MVC

Declara en cada DTO `Request` los atributos estándar aplicables (presencia, longitud, rango, formato o pertenencia a enum) para enriquecer OpenAPI y el contrato MVC. **Repite todas esas restricciones en FluentValidation**: Application debe poder validarlas sin depender del binding HTTP. Mantén mensajes y límites equivalentes; no agregues atributos que contradigan una regla del validator.

```csharp
using System.ComponentModel.DataAnnotations;

public sealed record Request
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(45, MinimumLength = 4,
        ErrorMessage = "El nombre debe tener entre 4 y 45 caracteres.")]
    public required string Name
    {
        get;
        init => field = value?.Trim().ToUpperInvariant() ?? string.Empty;
    } = string.Empty;

    [Range(0, 99, ErrorMessage = "El orden debe estar entre 0 y 99.")]
    public required int Order { get; init; }

    [EnumDataType(typeof(ProductStatus), ErrorMessage = "El estado no es válido.")]
    public required ProductStatus Status { get; init; }
}
```

Aplica estas reglas a Create, Get o Update según su contrato; no agregues Request a Delete si solo recibe un ID. Si `PageSize` es `int`, `[Range]` describe el límite finito; si es un enum que incluye `ALL`, `[EnumDataType]` solo comprueba pertenencia y el validator debe **rechazar `ALL`**. Si el esquema generado aún ofrece un valor prohibido, ajusta el contrato/OpenAPI en lugar de asumir que el atributo lo elimina.

## Asociaciones y nombres de tipos

- Respeta la estructura de la entidad que representa la entrada: un objeto de valor/perfil técnico anidado sigue anidado como `PerfilTecnico`; un usuario relacionado no se convierte automáticamente en campos planos `UsuarioId`/`UsuarioNombre` si el contrato exige un objeto usuario.
- Nombra los tipos auxiliares asociados con sufijo del concepto: `RequestUsuario`, `RequestPerfilTecnico`. Por ejemplo, un `Request` puede declarar `public required RequestPerfilTecnico PerfilTecnico { get; init; } = null!;`. No anides declaraciones de clases dentro de `Request`; los tipos siguen siendo top-level en el archivo apropiado y pueden ir en `Shared/` si realmente los comparten varias slices.
- Si un campo anidado es obligatorio, admite `""` pero rechaza `null`, no lo normalices a `string.Empty` al deserializar: conserva la nulabilidad en la entrada para detectar el nulo y valida no-nulo y longitud, sin exigir `NotEmpty`.
- El `Request` solo incluye datos permitidos por la operación. En Update no aceptes IDs de asociaciones inmutables, trazas ni tokens internos de concurrencia como datos de negocio; el ID de la entidad va separado si está en ruta.

## Decisiones importantes

- `Search`, `Page` y `PageSize` son siempre requeridos en GetAll. `Search` admite `""`/espacios normalizados a `""`, pero no nulos: usa `required string?` para preservar `null` hasta que `NotNull()` lo rechace y `[Required(AllowEmptyStrings = true)]` para el contrato MVC; no normalices `null` a `""`. Si el binding HTTP convierte `""` a `null`, corrige esa frontera sin volver inválida la búsqueda vacía.
- Todos los filtros adicionales de GetAll (incluidos enums y booleanos) son nullable y no `required`; `null` significa no aplicar el filtro. No agregues varios listados para representar filtros distintos.
- En cuerpos JSON usa `required` para presencia, DataAnnotations compatibles para describir restricciones y FluentValidation para **ejecutar todas las validaciones** en Application. No uses `[BindRequired]` ni `[FromQuery]` para sustituir el body del listado.
- Normaliza strings en un solo lugar y antes de validarlas, si así lo hace el proyecto (por ejemplo, `Trim().ToUpperInvariant()`); no conviertas mayúsculas/minúsculas sin considerar semántica de búsqueda. Usa `string?` cuando `null` tenga significado propio, incluso para distinguir Search nulo de cadena vacía.
- No pongas `IFormFile`, tipos MVC ni dependencias de transporte en un request de Application.
- Asegura límites positivos y finitos para `Page` y `PageSize`; el validator rechaza tamaños ilimitados como `ALL` aunque el enum del proyecto los incluya.
- En Update, incluye solo campos que la operación permite cambiar; no reutilices automáticamente el Request de Create.
- En Create, no aceptes campos controlados por el servidor (por ejemplo, ID autogenerado) salvo que el contrato lo requiera expresamente.
- Los parámetros escalares de significado claro (`id`, estado) suelen ir directamente al handler/controller; evita requests artificiales.
- DataAnnotations y FluentValidation son mecanismos distintos: `[ApiController]` ejecuta atributos del DTO enlazado y responde 400 si ModelState es inválido, mientras que `ValidateAndThrowAsync` ejecuta reglas FluentValidation pero no atributos. Ambos deben describir las mismas restricciones aplicables; Application no puede confiar en que MVC validó antes.
