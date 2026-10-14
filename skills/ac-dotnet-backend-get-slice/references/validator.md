# `Validator.cs` en las slices CRUD

## Responsabilidad

Contiene reglas con FluentValidation para el `Request` de su propia slice. Mantén cada validator junto a su operación; esta guía única explica las variantes sin crear una referencia por acción.

## Cuándo incluirlo

Inclúyelo cuando existan reglas complejas de contrato, enums o validaciones de comportamiento, y cuando el proyecto exija registro uniforme:

- **Create**: validaciones de comportamiento propias de crear, reglas entre campos y enums del payload.
- **Get**: pertenencia de enums, reglas entre filtros y condiciones de paginación que no sean una regla simple de una propiedad.
- **Update**: comportamiento de la actualización, reglas condicionales entre campos y enums; no supongas que son iguales a Create.
- **Delete**: no requiere validator si solo recibe un ID. Si el caso de uso tiene un payload o una precondición de comportamiento expresable para esa entrada, puede tener `Delete/Validator.cs`; not-found y las invariantes de dependencia deben seguir protegidas autoritativamente por el caso de uso/dominio.

No crees validators vacíos salvo que la arquitectura los requiera expresamente.

## Qué mecanismo usar

| Tipo de regla | Ubicación recomendada | Ejemplos |
|---|---|---|
| Contrato simple, local a un campo | DataAnnotations en `Request.cs` | `[Required]`, `[StringLength]`, `[Range]`, `[RegularExpression]` |
| Contrato complejo o condicionado | FluentValidation en `Validator.cs` | Comparación entre propiedades, campo obligatorio según otro campo, reglas condicionales |
| Validez de enum recibido | FluentValidation en `Validator.cs` | `RuleFor(x => x.Status).IsInEnum()` |
| Comportamiento/precondición del caso de uso | FluentValidation en `Validator.cs` | Nombre no duplicado, transición permitida, combinación de entrada válida para la operación |

No implementes la misma restricción simple en DataAnnotations y FluentValidation a la vez. Si la misma invariantes debe proteger también invocaciones internas, asegúrate de que esa ruta ejecute el mecanismo correcto.

## Ejemplos

```csharp
// Get/Validator.cs: reglas de contrato complejas, condiciones y enum.
internal sealed class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Status)
            .IsInEnum()
            .WithMessage("El estado especificado no es válido.");

        RuleFor(request => request.Confirmation)
            .Equal(request => request.Name)
            .WithMessage("La confirmación debe coincidir con el nombre.");

        RuleFor(request => request.ApprovalCode)
            .NotEmpty()
            .When(request => request.RequiresApproval)
            .WithMessage("El código de aprobación es obligatorio para esta operación.");
    }
}
```

Las propiedades `Confirmation`, `ApprovalCode` y `RequiresApproval` solo ilustran relaciones entre campos; usa las propiedades reales del Request de la operación. Las restricciones de una sola propiedad —por ejemplo, rango de `Page` o longitud máxima de `Name`— permanecen en DataAnnotations.

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
- Usa `IsInEnum()` para validar enums recibidos; no confíes en el cast del model binder ni dupliques la regla con `[EnumDataType]`.
- Expresa reglas entre campos y condicionales con FluentValidation (`Equal`, `When`, `Must`, etc.); deja la regla simple de campo en DataAnnotations.
- Si una regla usa `MustAsync`/`CustomAsync`/condición asíncrona, ejecuta `ValidateAsync` o `ValidateAndThrowAsync` y propaga el `CancellationToken`; no uses validación síncrona.
- Coloca los validators en la slice del Request al que validan: `Create/Validator.cs`, `Get/Validator.cs` o `Update/Validator.cs`. No crees `Delete/Validator.cs` por simetría si Delete solo recibe un ID.
- No dupliques la misma regla entre DataAnnotations, FluentValidation y el controller. Las invariantes críticas pueden y deben tener protección autoritativa en el dominio/persistencia además de un pre-chequeo de validación.
- Mantén mensajes explícitos y límites de paginación ajustados al contrato; si existe `ALL`, valida también su interacción con `Page`.
