# `Data.cs`

## Responsabilidad

Es el modelo interno, simple y específico de una lectura que transporta desde EF Core solo los campos necesarios para producir el contrato público. Separa la forma de la consulta de la respuesta. No es un DTO genérico para las cuatro operaciones CRUD.

## Cuándo incluirlo

Normalmente vive en `Get/Data.cs` cuando `GetById`/`GetAll` usan una proyección de EF Core. Puede aplicarse a otra slice de consulta si existe, pero no lo crees para Create, Update o Delete por simetría: las mutaciones trabajan con el agregado/entidad adecuado. Sigue la separación `Data`/`Response` del proyecto incluso cuando tengan los mismos campos y no expongas `Data` por HTTP.

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
- Un `Data` de Get es de solo lectura; no lo cargues, modifiques y guardes como si fuera la entidad persistida.
