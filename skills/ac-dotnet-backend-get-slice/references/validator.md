# `Validator.cs`

## Responsabilidad

Contiene las reglas semánticas de entrada de `GetAll`, normalmente con FluentValidation cuando el proyecto lo usa. Mantén las reglas cerca de la slice para que los límites y mensajes sean fáciles de descubrir.

## Cuándo incluirlo

Inclúyelo si la solicitud tiene restricciones útiles más allá de la deserialización (por ejemplo, rango de página, tamaño máximo o longitud de búsqueda). Si no hay reglas y el proyecto no requiere un validator para registro uniforme, no crees uno vacío.

## Ejemplo

```csharp
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
```

## Decisiones importantes

- Valida la entrada ya normalizada si `Request` transforma sus valores.
- Mantén mensajes explícitos en las reglas cuando esa sea la convención del proyecto; evita constantes externas para mensajes de una sola regla.
- No dupliques reglas entre atributos, filtros MVC y FluentValidation sin una razón clara.
- Define límites de página y tamaño para proteger la base de datos. Ajusta los valores a los requisitos reales, no copies el máximo del ejemplo.
- Si el proyecto permite tamaños especiales (por ejemplo, `ALL`), valida también sus interacciones con `Page` y el cálculo de páginas.
