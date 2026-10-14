# `Validator.cs` en las slices CRUD

## Responsabilidad

Contiene reglas de entrada para el `Request` de su propia slice, normalmente con FluentValidation cuando el proyecto lo usa. Mantén cada validator junto a su operación; esta guía única explica las variantes sin crear una referencia por acción.

## Cuándo incluirlo

Inclúyelo cuando existan reglas de entrada relevantes o cuando el proyecto exija registro uniforme:

- **Create**: requeridos, longitudes, rangos y formatos del payload de creación.
- **Get**: límites de búsqueda/paginación y reglas entre filtros (por ejemplo, restricciones de una opción `ALL`).
- **Update**: rangos y valores permitidos para campos editables; no supongas que son las mismas reglas de Create.
- **Delete**: normalmente no requiere validator si solo recibe un ID; not-found y reglas de dependencia son comportamiento del caso de uso/dominio, no validación de un body inexistente.

No crees validators vacíos salvo que la arquitectura los requiera expresamente.

## Ejemplo

```csharp
// Ejemplo de Get/Validator.cs para la paginación.
internal sealed class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("El número de página debe ser mayor o igual a 1.");

        RuleFor(request => request.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("El tamaño de página debe estar entre 1 y 100.");

        RuleFor(request => request.Search)
            .MaximumLength(100)
            .WithMessage("El término de búsqueda no puede exceder los 100 caracteres.");
    }
}

// En Create/Validator.cs o Update/Validator.cs, las reglas apuntan
// al Request propio de esa slice; no reutilices este validator por conveniencia.
```

## Decisiones importantes

- Valida la entrada ya normalizada si `Request` transforma sus valores.
- Mantén mensajes explícitos en las reglas cuando esa sea la convención del proyecto; evita constantes externas para mensajes de una sola regla.
- No dupliques reglas entre atributos, filtros MVC y FluentValidation sin una razón clara.
- Define límites de página y tamaño para proteger la base de datos. Ajusta los valores a los requisitos reales, no copies el máximo del ejemplo.
- Si el proyecto permite tamaños especiales (por ejemplo, `ALL`), valida también sus interacciones con `Page` y el cálculo de páginas.
- No confundas errores de payload con reglas de negocio que requieren consultar el estado persistido. La unicidad concurrente debe protegerse también en persistencia cuando aplique.
- Si una operación recibe solo un ID, no agregues un validator/request de cuerpo para validar el route binding; usa el mecanismo apropiado del host y el tratamiento del caso de uso.
