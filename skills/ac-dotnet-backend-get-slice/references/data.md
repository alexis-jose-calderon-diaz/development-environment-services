# `Data.cs`

## Responsabilidad

Es el modelo interno, simple y específico de la consulta que transporta desde EF Core solo los campos necesarios para producir el contrato público. Separa la forma de la consulta de la forma pública de la respuesta.

## Cuándo incluirlo

Inclúyelo cuando se proyecte una entidad o consulta a un contrato de lectura. En una consulta EF Core pública, sigue la separación `Data`/`Response` del proyecto incluso cuando hoy tengan los mismos campos. No lo expongas como tipo HTTP.

## Ejemplo

```csharp
internal sealed record Data
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required bool Active { get; init; }
}
```

## Decisiones importantes

- Declara únicamente campos que la respuesta o su transformación necesitan.
- Mantén el tipo interno de Application y evita atributos de serialización, binding o MVC.
- Usa tipos compatibles con la traducción de la proyección a SQL.
- No agregues valores centinela ni defaults para ocultar datos faltantes; resuelve esa semántica en el dominio o en la transformación correspondiente.
- Si una regla arquitectónica del proyecto no usa un `Data` separado, sigue esa regla y explica la excepción.
