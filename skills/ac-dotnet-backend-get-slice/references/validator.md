# `Validator.cs` en las slices CRUD

## Responsabilidad

Contiene **todas** las reglas de validación de entrada del `Request` de su slice en FluentValidation: presencia, longitud, rango, formato, pertenencia al enum y reglas condicionales. Mantén cada validator junto a su operación; DataAnnotations equivalentes en `Request.cs` enriquecen OpenAPI/MVC, pero nunca sustituyen la validación de Application.

## Cuándo incluirlo

Inclúyelo **siempre que exista un `Request` con restricciones de entrada**; no omitas el validator por haber agregado DataAnnotations:

- **Create**: presencia, rangos, enums y reglas específicas de creación.
- **Get**: siempre tiene `Get/Validator.cs` para `Search` requerido (nulo inválido, `""` válido), `Page` y `PageSize` requeridos/positivos/finitos; valida filtros opcionales solo cuando tengan valor.
- **Update**: valida de nuevo todas las reglas del Request de actualización, incluidas las simples ya descritas con atributos; no supongas que son iguales a Create.
- **Delete**: no requiere validator si solo recibe un ID. Si el caso de uso tiene un payload o una precondición de comportamiento expresable para esa entrada, puede tener `Delete/Validator.cs`; not-found y las invariantes de dependencia deben seguir protegidas autoritativamente por el caso de uso/dominio.

No crees validators vacíos para handlers sin Request. Si un Request no tiene ninguna regla, revisa si realmente aporta valor; el Get paginado siempre tiene reglas.

## Qué mecanismo usar

| Tipo de regla | FluentValidation obligatorio | DataAnnotations cuando aplica |
|---|---|---|
| Presencia o vacío | `NotNull()` si `""` es válido; `NotEmpty()` si no | `[Required(AllowEmptyStrings = true)]` o `[Required]` con la misma semántica |
| Longitud, rango, formato | `MaximumLength`, `InclusiveBetween`, `Matches`, etc. | `[MaxLength]`, `[Range]`, `[RegularExpression]` compatibles |
| Enum recibido | `IsInEnum()`; en filtros nullable, solo si existe un valor | `[EnumDataType]` si aplica al campo |
| Subconjunto permitido | `Must(...)`/`NotEqual(...)` además de pertenencia | Solo un atributo que represente **exactamente** la regla; de lo contrario, documenta con OpenAPI |
| Escala decimal o condición entre campos | `Must(...)`, `When(...)`, etc. | Solo si existe un atributo estándar equivalente |
| Precondición de negocio consultada | Regla asíncrona o comprobación autoritativa en handler/dominio | Ninguna DataAnnotation de contrato puede sustituirla |

Duplicar restricciones representables es intencional: FluentValidation protege Application y DataAnnotations describen el contrato y participan en MVC. Mantén límites, mensajes y semántica equivalentes; si el atributo no refleja la regla exacta, usa solo FluentValidation y completa la documentación OpenAPI por el mecanismo del proyecto. Las invariantes críticas siguen teniendo protección autoritativa en handler/dominio/persistencia.

## Ejemplos

```csharp
// Get/Validator.cs para un Request con Search, Page y PageSize entero.
internal sealed class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Search)
            .NotNull()
            .WithMessage("El término de búsqueda es obligatorio.")
            .MaximumLength(100)
            .WithMessage("La búsqueda no puede exceder los 100 caracteres.");

        RuleFor(request => request.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("La página debe ser mayor o igual a 1.");

        RuleFor(request => request.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("El tamaño de página debe estar entre 1 y 100.");

        RuleFor(request => request)
            .Must(request => (request.Page - 1L) * request.PageSize <= int.MaxValue)
            .WithMessage("La página y el tamaño de página superan el rango permitido.");
    }
}
```

`NotEmpty()` rechazaría `""`; por eso Get usa `NotNull()` y acepta una búsqueda normalizada vacía. Si `PageSize` es un enum con miembro `ALL`, valida pertenencia con `IsInEnum()` y rechaza explícitamente `ALL` con `NotEqual(PageSize.ALL)`; los listados nunca omiten la paginación.

Para un filtro adicional opcional de tipo `EstadoCotizacion?`, usa una regla FluentValidation que no convierta `null` en obligatorio:

```csharp
RuleFor(request => request.Estado)
    .IsInEnum()
    .When(request => request.Estado.HasValue)
    .WithMessage("El estado especificado no es válido.");
```

Si la operación recibe un enum `ResultadoCotizacion` con miembros `PENDIENTE`, `GANADA`, `RECHAZADA`, `VENCIDA` pero solo permite asignar dos:

```csharp
RuleFor(request => request.Resultado)
    .Must(resultado => resultado is ResultadoCotizacion.GANADA or ResultadoCotizacion.RECHAZADA)
    .WithMessage("El resultado solo puede ser GANADA o RECHAZADA.");
```

Esto valida un subconjunto de negocio, no equivale a comprobar únicamente `IsInEnum()`.

### Validación de comportamiento que requiere consultar estado

Cuando una precondición de la operación depende de datos persistidos o de un servicio, FluentValidation puede usar una regla asíncrona y un puerto de Application. No inyectes Infrastructure directamente en el validator.

```csharp
internal sealed class Validator : AbstractValidator<Request>
{
    public Validator(IProductNameAvailability nameAvailability)
    {
        RuleFor(request => request.Name)
            .MustAsync(async (name, cancellationToken) =>
            {
                bool exists = await nameAvailability.ExistsAsync(name, cancellationToken);
                return !exists;
            })
            .WithMessage("Ya existe un producto con ese nombre.");
    }
}
```

Usa estas reglas para rechazar pronto una petición con feedback de validación. Una consulta previa no garantiza unicidad frente a concurrencia ni reemplaza una invariante: protege la operación también en dominio/persistencia (por ejemplo, con una restricción única) y traduce el conflicto según el patrón del proyecto. Para reglas de transición críticas, el dominio/handler conserva la decisión autoritativa.

## Decisiones importantes

- Valida los valores ya normalizados por `Request`.
- Declara mensajes en la regla cuando esa sea la convención del proyecto; evita constantes externas para reglas locales.
- Usa `IsInEnum()` en Application para los enums recibidos y `[EnumDataType]` para documentar pertenencia en el Request cuando corresponda. No confíes en casts de valores numéricos. Los miembros de enums siguen `UPPER_SNAKE_CASE` (ver [domain-persistence.md](domain-persistence.md)).
- Expresa también las reglas simples en FluentValidation aunque estén reflejadas en DataAnnotations; las relaciones entre campos y condiciones (`Equal`, `When`, `Must`, etc.) permanecen allí cuando ningún atributo las describe.
- Si una regla usa `MustAsync`/`CustomAsync`/condición asíncrona, ejecuta `ValidateAsync` o `ValidateAndThrowAsync` y propaga el `CancellationToken`; no uses validación síncrona.
- Coloca los validators en la slice del Request al que validan: `Create/Validator.cs`, `Get/Validator.cs` o `Update/Validator.cs`. No crees `Delete/Validator.cs` por simetría si Delete solo recibe un ID.
- No pongas validación manual en el controller. Las invariantes críticas pueden y deben tener protección autoritativa en dominio/persistencia además del pre-chequeo de FluentValidation.
- Rechaza `ALL` si el enum del proyecto lo admite y mantén `Page`/`PageSize` positivos; `""` debe seguir siendo un `Search` válido.
- Valida rango decimal en FluentValidation y descríbelo con `[Range]` cuando aplique; valida también la escala máxima en Application antes de persistir, sin truncar ni redondear silenciosamente. Para objetos anidados, reutiliza un validator de `RequestPerfilTecnico` solo si más de una slice comparte el contrato; usa `SetValidator` y valida la obligatoriedad del objeto y de sus campos.
