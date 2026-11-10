# `Projections.cs` en las lecturas

## Responsabilidad

Define una proyección traducible de EF Core al modelo `Data`. Su ámbito normal es una lectura como `Get`, pero también una consulta al origen para construir un snapshot en `Create`. Selecciona columnas explícitas y permite filtrar, ordenar y paginar antes de materializar.

## Cuándo incluirlo

Dónde/cuándo aplicarlo:

- **Get**: úsalo en `Get/Projections.cs` para `GetById` y el único `GetAll` paginado; ambos consumen el mismo `ToData` de la entidad propietaria.
- **Create**: si crea un snapshot desde una entidad/colección de origen, define `Create/Projections.cs` y proyecciones propias hacia `SolicitudData`, `ProductoSolicitudData` u otros datos concretos; usa `AsNoTracking()` para las lecturas del origen, materializa y después crea entidades nuevas.
- **Update/Delete**: no lo generes por simetría; las mutaciones trabajan sobre entidades rastreadas cuando deben modificar o eliminar. Para consultar una precondición de otra entidad, proyecta solo los datos requeridos sin intentar guardar la proyección.
- Una lectura especializada que no sea un listado de esta entidad puede tener su propia proyección si el caso de uso lo requiere; no abras otra slice de búsqueda para duplicar GetAll.

Para una consulta EF pública, sigue la convención local de proyección manual aunque sea pequeña.

## Ejemplo

```csharp
internal static class Projections
{
    public static readonly Expression<Func<ProductEntity, Data>> ToData = product =>
        new Data
        {
            Id = product.Id,
            Name = product.Name,
            Active = product.Active,
            CreadoPorUsuario = product.CreadoPorUsuario == null
                ? null
                : new DataUsuario
                {
                    Id = product.CreadoPorUsuario.Id,
                    Nombre = product.CreadoPorUsuario.Nombre,
                },
        };
}
```

La navegación `CreadoPorUsuario` del ejemplo solo representa el caso en que esa relación existe en la entidad; no agregues relaciones ficticias para copiarlo.

## Decisiones importantes

- Conserva el tipo `Expression<Func<TEntity, Data>>` cuando EF Core debe traducirla a SQL; una función `Func` ejecutada en memoria no es equivalente.
- Respeta relaciones y nullabilidad del modelo original al proyectar; un usuario/cliente relacionado requerido o opcional no se aplana si el contrato lo representa anidado. Para objetos opcionales, proyecta `null` explícitamente cuando falte la navegación.
- En Get solo navega desde la entidad a sus referencias superiores (`Cotizacion` → `Cliente`, por ejemplo); nunca proyectes colecciones hijas (`Cotizacion` → `ProductosCotizacion`). El Get de la entidad hija es el dueño de su consulta, sin reutilizar `ToData` del padre.
- Proyecta directamente los campos requeridos; no uses `Include`/`ThenInclude` para una consulta que puede expresarse mediante `Select`.
- Mantén la proyección pura y traducible. Coloca cálculos o formatos no traducibles después de materializar, en la conversión correspondiente.
- No dependas de AutoMapper ni de `ProjectTo` si la convención local exige proyección manual.
- Mantén la proyección dentro de la slice; compártela solo si el diseño y las reglas arquitectónicas autorizan explícitamente ese acoplamiento.
- Si una mutación necesita consultar datos relacionados para una regla, carga el estado requerido de forma explícita; no uses `ToData` para mutar ni guardar la proyección.
- En snapshots de Create, incluye todos los campos que deban permanecer independientes (también los de objetos de valor anidados) y ningún campo ajeno al contrato. Mantén proyección y modelos dentro de la slice Create, sin reutilizar la proyección de Get.
