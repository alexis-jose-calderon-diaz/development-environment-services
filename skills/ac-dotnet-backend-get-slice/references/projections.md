# `Projections.cs`

## Responsabilidad

Define la proyección traducible de la entidad o consulta EF Core al modelo `Data`. La proyección selecciona explícitamente las columnas necesarias y permite aplicar filtros, orden y paginación antes de materializar.

## Cuándo incluirlo

Inclúyelo si el proyecto centraliza proyecciones de consultas en archivos propios de la slice. Para una consulta EF pública, sigue esa convención aunque la proyección sea pequeña.

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
