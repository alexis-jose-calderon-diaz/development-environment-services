# `Request.cs` en las slices CRUD

## Responsabilidad

Describe los datos de negocio de entrada de una operación de Application. Cada `Request` vive junto a su slice y agrupa todos esos datos salvo el ID de la entidad principal, incluso cuando solo haya una propiedad escalar. Sus propiedades y su anidamiento deben corresponder al modelo de la entidad de origen y a los campos editables del caso de uso, sin copiar propiedades no autorizadas.

## Cuándo incluirlo

Dónde/cuándo aplicarlo:

- **Create**: usa `Create/Request.cs` para todos los datos necesarios para crear, aunque exista una sola propiedad.
- **Get**: siempre existe `Get/Request.cs` para el único `GetAll` paginado de la entidad; `GetById` recibe el ID directamente, sin Request artificial, dentro de la misma slice Get.
- **Update**: usa `Update/Request.cs` para todos los campos editables, aunque exista uno solo; pasa el ID principal aparte.
- **Delete**: no crees `Delete/Request.cs` si solo necesita el ID principal. Si recibe cualquier otro dato de negocio, inclúyelo en su `Request`, aunque sea un único escalar.
- **Transiciones**: si no hay datos adicionales, recibe solo el ID principal; si requiere motivo, estado u otro dato de negocio, crea su propio `Request`, incluso cuando tenga una propiedad, sin reutilizar automáticamente el de Update.

No crees requests vacíos ni envelopes que solo contengan el ID principal. Un `Request` de una sola propiedad de negocio no es artificial. Cuando no existe ID principal, todos los datos de negocio van en `Request`.

## Ejemplo

`Get/Request.cs` representa filtros opcionales y una pareja nullable de paginación. `Search` es opcional; su ausencia, `null` o cadena vacía se interpretan como una búsqueda sin filtro:

```csharp
using System.ComponentModel.DataAnnotations;
using Production.Domain.Enums;

public sealed record Request
{
    public bool? Active { get; init; }

    [MaxLength(100, ErrorMessage = "La búsqueda no puede exceder los 100 caracteres.")]
    public string? Search
    {
        get;
        init => field = value?.Trim().ToUpperInvariant();
    }

    [Range(1, int.MaxValue, ErrorMessage = "La página debe ser mayor o igual a 1.")]
    public int? Page { get; init; }

    [EnumDataType(typeof(PageSize), ErrorMessage = "El tamaño de página no es válido.")]
    public PageSize? PageSize { get; init; }
}
```

`Search` ausente o vacío no aplica filtro textual; el handler lo omite con `!string.IsNullOrEmpty(request.Search)`. `Page` y `PageSize` se omiten juntos para solicitar todos los resultados coincidentes. Si solo se proporciona uno, FluentValidation rechaza la pareja inconsistente con `400`; si ambos están presentes, se valida la página y la pertenencia de `PageSize` al enum del proyecto, y se aplica la paginación. OpenAPI los documenta como opcionales y nullable.

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

Una transición que recibe un motivo mantiene el ID principal separado y representa el motivo como propiedad del `Request`:

```csharp
public sealed record Request
{
    [Required(ErrorMessage = "El motivo es obligatorio.")]
    public required string Motivo
    {
        get;
        init => field = value?.Trim().ToUpperInvariant() ?? string.Empty;
    } = string.Empty;
}
```

`Create/Request.cs` sigue el mismo principio, con los campos requeridos para crear. Si el proyecto asigna defaults o usa un enum de page size, conserva su semántica.

## DataAnnotations para OpenAPI y MVC

Agrega a las propiedades del `Request` DataAnnotations estándar solo cuando describan una restricción útil para el schema OpenAPI (presencia, longitud, rango, formato o pertenencia a enum). **Toda restricción declarada con DataAnnotations debe repetirse en FluentValidation**, con límites y semántica equivalentes, para que Application la valide sin depender del binding HTTP. FluentValidation puede incluir reglas adicionales que no tengan una DataAnnotation equivalente.

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

Aplica estas reglas a cada `Request` que tenga restricciones; no agregues Request a Delete si solo recibe el ID principal. En la pareja opcional, los atributos de rango y enum describen los valores cuando están presentes; FluentValidation debe validar la pertenencia de `PageSize` al enum y exigir que ambos campos tengan valor o que ambos sean `null`.

## Asociaciones y nombres de tipos

- Respeta la estructura de la entidad que representa la entrada: un objeto de valor/perfil técnico anidado sigue anidado como `PerfilTecnico`; un usuario relacionado no se convierte automáticamente en campos planos `UsuarioId`/`UsuarioNombre` si el contrato exige un objeto usuario.
- Nombra los tipos auxiliares asociados con sufijo del concepto: `RequestUsuario`, `RequestPerfilTecnico`. Por ejemplo, un `Request` puede declarar `public required RequestPerfilTecnico PerfilTecnico { get; init; } = null!;`. No anides declaraciones de clases dentro de `Request`; los tipos siguen siendo top-level en el archivo apropiado y pueden ir en `Shared/` si realmente los comparten varias slices.
- Si un campo anidado es obligatorio, admite `""` pero rechaza `null`, no lo normalices a `string.Empty` al deserializar: conserva la nulabilidad en la entrada para detectar el nulo y valida no-nulo y longitud, sin exigir `NotEmpty`.
- El `Request` solo incluye datos permitidos por la operación. En Update no aceptes IDs de asociaciones inmutables, trazas ni tokens internos de concurrencia como datos de negocio; solo el ID principal de la entidad va separado.

## Decisiones importantes

- `Search` es opcional y nullable; ausencia, `null` o vacío significa que no se aplica el filtro textual. El handler omite el filtro con `!string.IsNullOrEmpty(request.Search)`. `Page` y `PageSize` son opcionales y nullable como pareja completa: ambos ausentes o `null` solicitan todos los resultados, mientras que una pareja parcial es inválida.
- Todos los filtros adicionales de GetAll (incluidos enums y booleanos) son nullable y no `required`; `null` significa no aplicar el filtro. No agregues varios listados para representar filtros distintos.
- En cuerpos JSON usa `required` y nulabilidad para la presencia, DataAnnotations solo cuando aporten al schema OpenAPI y FluentValidation para **ejecutar todas las validaciones** en Application. Toda restricción DataAnnotations debe estar también en FluentValidation; no se exige la relación inversa. No uses `[BindRequired]` ni `[FromQuery]` para sustituir el body del listado.
- Normaliza strings en un solo lugar y antes de validarlas, si así lo hace el proyecto (por ejemplo, `Trim().ToUpperInvariant()`); no conviertas mayúsculas/minúsculas sin considerar semántica de búsqueda. Usa `string?` cuando `null` tenga significado propio, incluso para distinguir Search nulo de cadena vacía.
- No pongas `IFormFile`, tipos MVC ni dependencias de transporte en un request de Application.
- Asegura que `Page` sea positiva y que `PageSize` pertenezca al enum del proyecto cuando la pareja está presente.
- En Update, incluye solo campos que la operación permite cambiar; no reutilices automáticamente el Request de Create.
- En Create, no aceptes campos controlados por el servidor (por ejemplo, ID autogenerado) salvo que el contrato lo requiera expresamente.
- Todo dato de negocio distinto del ID principal (por ejemplo, `motivo`, `estado` o IDs relacionados permitidos) va en `Request`, aunque sea un único escalar. No se pasa directamente al handler/controller por tener un significado claro. `CancellationToken` permanece como parámetro técnico separado.
- DataAnnotations y FluentValidation son mecanismos distintos: `[ApiController]` ejecuta atributos del DTO enlazado y responde 400 si ModelState es inválido, mientras que `ValidateAndThrowAsync` ejecuta reglas FluentValidation pero no atributos. Toda restricción declarada con DataAnnotations debe repetirse en FluentValidation; FluentValidation puede incluir reglas adicionales sin DataAnnotations. Application no puede confiar en que MVC validó antes.
