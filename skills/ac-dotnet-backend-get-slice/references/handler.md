# `Handler.cs`

## Responsabilidad

Coordina el caso de uso de lectura: consulta persistencia, aplica validación y filtros, materializa la proyección y devuelve el contrato público. No debe contener lógica HTTP ni mutar datos.

## Cuándo incluirlo

Siempre que se implemente una slice. Si ambas operaciones comparten deliberadamente proyección, transformación y contrato de elemento, el handler puede exponer dos overloads: uno recibe `id` y el otro un `Request`. Si las lecturas tienen responsabilidades o contratos diferentes, separarlas es más claro.

## Ejemplo

El ejemplo asume un puerto `IAppDbContext`, una entidad `ProductEntity`, EF Core y un `PageSize` entero validado. Sustituye estos nombres y abstracciones por los del proyecto.

```csharp
public sealed class Handler(
    IAppDbContext dbContext,
    IValidator<Request> validator
)
{
    public async Task<Response> Handle(int id, CancellationToken cancellationToken)
    {
        Data data = await dbContext.Products
            .AsNoTracking()
            .Where(product => product.Id == id)
            .Select(Projections.ToData)
            .SingleOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException();

        return data.ToResponse();
    }

    public async Task<PaginatedResponse> Handle(
        Request request,
        CancellationToken cancellationToken
    )
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        IQueryable<ProductEntity> query = dbContext.Products.AsNoTracking();

        if (request.Active.HasValue)
        {
            query = query.Where(product => product.Active == request.Active.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(product => product.Name.Contains(request.Search));
        }

        int totalCount = await query.CountAsync(cancellationToken);
        int offset = checked((request.Page - 1) * request.PageSize);

        List<Data> rows = await query
            .OrderBy(product => product.Name)
            .ThenBy(product => product.Id)
            .Skip(offset)
            .Take(request.PageSize)
            .Select(Projections.ToData)
            .ToListAsync(cancellationToken);

        int totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

        return new PaginatedResponse
        {
            TotalCount = totalCount,
            TotalPages = totalPages,
            Items = rows.ConvertAll(row => row.ToResponse()),
        };
    }
}
```

## Decisiones importantes

- Filtra antes de contar y calcula `TotalCount` antes de aplicar `Skip`/`Take`.
- Usa un orden estable, incluyendo un desempate único, para que los elementos no salten entre páginas.
- Propaga `CancellationToken` a EF Core y a validaciones asíncronas.
- Mantén la consulta como `IQueryable` hasta completar filtros, orden, paginación y proyección.
- Define cómo tratar un ID inexistente según el proyecto (`NotFoundException`, `null` u otro resultado); no devuelvas una respuesta exitosa vacía por accidente.
- No asumas que se puede devolver “todo” con `PageSize = ALL`. Si el proyecto lo permite, sigue sus límites, reglas y significado de `TotalPages`.
- Si el proveedor de EF Core no puede traducir un filtro o método, revisa la traducción y el SQL; no materialices toda la tabla para aplicar el filtro en memoria.
