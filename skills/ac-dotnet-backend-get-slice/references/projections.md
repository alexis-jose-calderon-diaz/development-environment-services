# `Projections.cs` en las lecturas

## Responsabilidad

Define una proyección traducible de EF Core al modelo `Data`. Su ámbito normal es una consulta de lectura como `Get`; selecciona columnas explícitas y permite filtrar, ordenar y paginar antes de materializar.

## Cuándo incluirlo

Dónde/cuándo aplicarlo:

- **Get**: úsalo en `Get/Projections.cs` para `GetById` y `GetAll` cuando comparten el modelo de lectura; pueden consumir el mismo `ToData`.
- **Create/Update/Delete**: no lo generes como requisito CRUD. Las mutaciones necesitan agregar o modificar el modelo de dominio persistido, no proyectarlo a un `Data` de lectura.
- Otras consultas de lectura pueden tener sus propias proyecciones si el proyecto organiza cada capacidad en slices.

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
        };
}
```

## Decisiones importantes

- Conserva el tipo `Expression<Func<TEntity, Data>>` cuando EF Core debe traducirla a SQL; una función `Func` ejecutada en memoria no es equivalente.
- Proyecta directamente los campos requeridos; no uses `Include`/`ThenInclude` para una consulta que puede expresarse mediante `Select`.
- Mantén la proyección pura y traducible. Coloca cálculos o formatos no traducibles después de materializar, en la conversión correspondiente.
- No dependas de AutoMapper ni de `ProjectTo` si la convención local exige proyección manual.
- Mantén la proyección dentro de la slice; compártela solo si el diseño y las reglas arquitectónicas autorizan explícitamente ese acoplamiento.
- Si una mutación necesita consultar datos relacionados para una regla, carga el estado requerido de forma explícita; no uses `ToData` para mutar ni guardar la proyección.
