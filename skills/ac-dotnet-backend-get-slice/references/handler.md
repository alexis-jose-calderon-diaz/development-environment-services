# `Handler.cs` en las slices CRUD

## Responsabilidad

Coordina el caso de uso de su slice. Cada handler pertenece a una operación/capacidad y concentra la interacción de Application con sus puertos; no contiene lógica HTTP. La referencia es única para explicar las variantes CRUD, aunque el código tenga `Create/Handler.cs`, `Get/Handler.cs`, `Update/Handler.cs` y `Delete/Handler.cs`.

## Cuándo incluirlo

Incluye un `Handler.cs` por slice de código según la estructura del proyecto; no agrupes todo el CRUD en una clase ni crees un handler por cada endpoint GET sin necesidad.

- **Create**: recibe el `Request` compuesto, valida, construye/agrega la entidad o invoca el agregado y persiste; retorna directamente el ID cuando esa es la convención.
- **Get**: puede tener `Handle(id, cancellationToken)` y `Handle(request, cancellationToken)` para `GetById` y `GetAll`. Manténlos juntos si comparten proyección, transformación y contrato de elemento. Si no, considera slices independientes.
- **Update**: recibe el ID aparte y un `Request` con los campos editables cuando la entrada sea compuesta; carga el estado necesario, aplica invariantes y persiste.
- **Delete**: recibe directamente el ID cuando no hay otra entrada; ejecuta borrado físico o lógico según el dominio y traduce conflictos de negocio conforme al proyecto.

## Ejemplo

El ejemplo siguiente se concentra en la slice `Get`. Usa un puerto `IAppDbContext`, `ProductEntity`, EF Core y `PageSize` entero validado; sustituye los nombres por los del proyecto. Las demás variantes se muestran después.

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

## Forma de los otros handlers

```csharp
// Create/Handler.cs: resultado escalar directo; no crear Response para envolver el ID.
public async Task<int> Handle(Request request, CancellationToken cancellationToken)
{
    await validator.ValidateAndThrowAsync(request, cancellationToken);
    ProductEntity product = new()
    {
        Name = request.Name,
        // Inicializa también los demás miembros requeridos por el dominio.
    };
    dbContext.Products.Add(product);
    await dbContext.SaveChangesAsync(cancellationToken);
    return product.Id;
}

// Update/Handler.cs: ID separado del payload de actualización.
public async Task Handle(int id, Request request, CancellationToken cancellationToken)
{
    ProductEntity product = await dbContext.Products
        .SingleOrDefaultAsync(item => item.Id == id, cancellationToken)
        ?? throw new NotFoundException();
    product.Rename(request.Name); // aplica invariantes del dominio
    await dbContext.SaveChangesAsync(cancellationToken);
}

// Delete/Handler.cs: sin Request artificial cuando solo recibe un ID.
public async Task Handle(int id, CancellationToken cancellationToken)
{
    ProductEntity product = await dbContext.Products
        .SingleOrDefaultAsync(item => item.Id == id, cancellationToken)
        ?? throw new NotFoundException();
    dbContext.Products.Remove(product);
    await dbContext.SaveChangesAsync(cancellationToken);
}
```

Los fragmentos son esquemáticos: adapta la construcción de entidades, mutaciones, borrado lógico/físico, transacciones y manejo de conflictos a las reglas del dominio.

## Decisiones importantes

- En `GetAll`, filtra antes de contar y calcula `TotalCount` antes de aplicar `Skip`/`Take`.
- Usa un orden estable, incluyendo un desempate único, para que los elementos no salten entre páginas.
- Propaga `CancellationToken` a EF Core y a validaciones asíncronas.
- Mantén la consulta como `IQueryable` hasta completar filtros, orden, paginación y proyección.
- Define cómo tratar un ID inexistente en Get/Update/Delete según el contrato del proyecto; no devuelvas éxito por accidente.
- No asumas que se puede devolver “todo” con `PageSize = ALL`. Si el proyecto lo permite, sigue sus límites, reglas y significado de `TotalPages`.
- Si el proveedor de EF Core no puede traducir un filtro o método, revisa la traducción y el SQL; no materialices toda la tabla para aplicar el filtro en memoria.
- Propaga `CancellationToken` como último parámetro en todas las operaciones asíncronas y pásalo a persistencia/servicios compatibles.
- No traslades invariantes del dominio al controller ni confíes en validaciones del cliente para protegerlas.
- Para Create, una comprobación previa de duplicados no reemplaza la restricción única de la BD cuando corresponda; traduce conflictos concurrentes según el patrón existente.
- Para Update/Delete, carga solo lo necesario. Si el dominio requiere estado o dependencias para validar la mutación, consulta ese estado explícitamente; no uses una proyección de lectura como entidad editable.
