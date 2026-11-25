# `Handler.cs` en las slices CRUD

## Responsabilidad

Coordina el caso de uso de su slice. Cada handler pertenece a una operación/capacidad y concentra la interacción de Application con sus puertos; no contiene lógica HTTP. La referencia es única para explicar las variantes CRUD, aunque el código tenga `Create/Handler.cs`, `Get/Handler.cs`, `Update/Handler.cs` y `Delete/Handler.cs`.

## Cuándo incluirlo

Incluye un `Handler.cs` por slice de código del módulo propietario de cada entidad; no agrupes todo el CRUD en una clase ni traslades operaciones de una entidad hija al handler del padre.

- **Create**: recibe un `Request` con todos los datos de negocio, aunque tenga una sola propiedad; ejecuta las comprobaciones de negocio necesarias, construye/agrega la entidad o invoca el agregado y persiste; retorna directamente el ID cuando esa es la convención. Si crea un snapshot de otra entidad, consulta el origen mediante modelos `Data` y proyecciones propios de Create, y construye entidades nuevas.
- **Get**: siempre contiene `Handle(id, cancellationToken)` y `Handle(request, cancellationToken)` para `GetById` y el único `GetAll`. Ambos usan la misma proyección, transformación y respuesta de elemento. El `Request` admite búsqueda opcional y una pareja opcional de paginación; no crees otro Get para devolver el conjunto completo.
- **Update**: recibe el ID principal aparte y un `Request` con todos los campos editables, incluso si solo hay uno; carga el estado necesario, aplica invariantes y persiste.
- **Delete**: recibe directamente el ID si es su único dato de negocio; si requiere cualquier otro dato, lo recibe en `Request`. Ejecuta borrado físico o lógico según el dominio y traduce conflictos de negocio conforme al proyecto.
- **Operación especializada**: modela una transición (`Liberar`, `Anular`, `UpdateEstado`, etc.) en su propia slice; recibe el ID principal separado y un `Request` para cualquier dato adicional, como el motivo o estado, incluso si es un único escalar. Valida rol, propietario y estado, registra actor/instante cuando corresponda y no la disfraza de Update/Delete genérico.

## Ejemplo

El ejemplo siguiente se concentra en la slice `Get` de la entidad `ProductEntity`. Usa un puerto `IAppDbContext`, EF Core, el enum `PageSize` del proyecto y el contrato de retorno `Production.Application.Models.PaginatedResponse<Response>`, construido con `PaginatedResponseFactory`. La búsqueda es opcional y el handler omite su filtro cuando está ausente o vacío. Las demás variantes se muestran después.

```csharp
public sealed class Handler(
    IAppDbContext dbContext
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

    public async Task<PaginatedResponse<Response>> Handle(
        Request request,
        CancellationToken cancellationToken
    )
    {
        IQueryable<ProductEntity> query = dbContext.Products.AsNoTracking();

        if (request.Active.HasValue)
        {
            query = query.Where(product => product.Active == request.Active.Value);
        }

        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query.Where(product => product.Name.Contains(request.Search));
        }

        int totalCount = await query.CountAsync(cancellationToken);
        query = query.OrderBy(product => product.Name).ThenBy(product => product.Id);

        if (request.Page is int page && request.PageSize is PageSize pageSize)
        {
            int offset = checked((page - 1) * (int)pageSize);
            query = query.Skip(offset).Take((int)pageSize);
        }

        List<Data> rows = await query
            .Select(Projections.ToData)
            .ToListAsync(cancellationToken);

        return PaginatedResponseFactory.Create(
            totalCount,
            (int?)request.PageSize,
            rows.ConvertAll(row => row.ToResponse())
        );
    }
}
```

## Forma de los otros handlers

```csharp
// Create/Handler.cs: resultado escalar directo; no crear Response para envolver el ID.
public async Task<int> Handle(Request request, CancellationToken cancellationToken)
{
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

// Delete/Handler.cs: sin Request cuando el ID principal es el único dato de negocio.
public async Task Handle(int id, CancellationToken cancellationToken)
{
    ProductEntity product = await dbContext.Products
        .SingleOrDefaultAsync(item => item.Id == id, cancellationToken)
        ?? throw new NotFoundException();
    dbContext.Products.Remove(product);
    await dbContext.SaveChangesAsync(cancellationToken);
}

// Annul/Handler.cs: el motivo es una propiedad de Request, no un argumento escalar.
public async Task Handle(int id, Request request, CancellationToken cancellationToken)
{
    // Cargar la entidad y aplicar la transición usando request.Motivo.
}
```

Los fragmentos son esquemáticos: adapta la construcción de entidades, mutaciones, borrado lógico/físico, transacciones y manejo de conflictos a las reglas del dominio.

## Decisiones importantes

- Todo dato de negocio distinto del ID principal se recibe dentro de un único `Request`, incluso si es un escalar o un ID relacionado. Solo las operaciones ID-only omiten el `Request`; `CancellationToken` permanece como parámetro técnico final.
- En el único `GetAll` paginado de la entidad, aplica autorización y alcance por usuario antes de filtrar y contar: no reveles datos ajenos ni siquiera en los totales. En `GetById`, filtra por propietario antes de buscar cuando la lectura ajena deba responder `404`.
- `Search` es opcional; si está ausente, `null` o vacío, no aplica filtro textual. En el handler usa `!string.IsNullOrEmpty(request.Search)` antes de agregar el predicado. Los demás filtros opcionales solo restringen la consulta cuando tienen valor.
- Filtra antes de contar y calcula `TotalCount` antes de `Skip`/`Take`. Usa un orden estable con desempate único (`OrderBy(...).ThenBy(...)`); un segundo `OrderBy` reemplaza el anterior.
- Propaga `CancellationToken` a EF Core y a validaciones asíncronas.
- Mantén la consulta como `IQueryable` hasta completar filtros, orden y proyección; aplica `Skip`/`Take` solo cuando `Page` y `PageSize` estén presentes.
- Define cómo tratar un ID inexistente en Get/Update/Delete según el contrato del proyecto; no devuelvas éxito por accidente.
- `Page` y `PageSize` son una pareja nullable opcional: omitir ambas devuelve todos los resultados coincidentes en el mismo listado; una pareja parcial se rechaza mediante `IValidatableObject`. Cuando ambas están presentes, Data Annotations valida la página y la pertenencia de `PageSize` al enum vigente; el handler aplica `Skip`/`Take`.
- Proyecta únicamente la entidad del módulo y sus referencias hacia entidades superiores; no incluyas colecciones hijas en `GetById` ni en los items del listado. Las entidades hijas disponen de su propio módulo Get, también paginado.
- Si el proveedor de EF Core no puede traducir un filtro o método, revisa la traducción y el SQL; no materialices toda la tabla para aplicar el filtro en memoria.
- Propaga `CancellationToken` como último parámetro en todas las operaciones asíncronas y pásalo a persistencia/servicios compatibles.
- En endpoints MVC, `[ApiController]` ejecuta Data Annotations e `IValidatableObject` antes de invocar el handler. Una llamada directa al handler fuera de MVC no obtiene validación declarativa automáticamente. Las reglas que consultan persistencia, permisos o servicios externos se resuelven en Application con `CancellationToken`, antes de los efectos. Consulta [validator.md](validator.md) para la frontera HTTP.
- No traslades invariantes del dominio al controller ni confíes en validaciones del cliente para protegerlas.
- Para Create, una comprobación previa de duplicados no reemplaza la restricción única de la BD cuando corresponda; traduce conflictos concurrentes según el patrón existente.
- Para Update/Delete, carga solo lo necesario. Si el dominio requiere estado o dependencias para validar la mutación, consulta ese estado explícitamente; no uses una proyección de lectura como entidad editable.
- Para snapshots de Create, proyecta solo las columnas necesarias, materializa antes de convertir y clona los objetos anidados; no adjuntes al nuevo agregado las instancias/navegaciones del origen. Mantén la comprobación de estado del origen y la copia dentro de la misma transacción cuando el requisito exija consistencia.
- Para transiciones, valida estados y roles en Application/dominio, no en el controller. Si la autorización depende del propietario, aplica el alcance al consultar para evitar revelar un recurso ajeno; usa el proveedor UTC del proyecto para fechas de creación y cambios de estado.
- Si una operación requiere múltiples escrituras atómicas o control de concurrencia, consulta [concurrency.md](concurrency.md).
