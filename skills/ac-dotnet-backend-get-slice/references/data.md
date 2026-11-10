# `Data.cs`

## Responsabilidad

Es un modelo interno y específico de una slice que transporta desde EF Core solo los campos necesarios para producir una respuesta o un snapshot de creación. Separa la forma de la consulta del contrato público y de la entidad que se escribirá. No es un DTO genérico para todo el CRUD.

## Cuándo incluirlo

Siempre vive en `Get/Data.cs` cuando `GetById` y el único `GetAll` paginado de la entidad comparten proyección y contrato. También cabe en `Create/Data.cs` si Create lee entidades de origen para construir un snapshot independiente (`SolicitudData`, `ProductoSolicitudData`, etc.). En Update/Delete solo si deben consultar datos relacionados para una regla concreta; no lo crees por simetría ni lo uses como entidad editable. Sigue la separación `Data`/`Response` del proyecto incluso cuando tengan los mismos campos y no expongas `Data` por HTTP.

## Ejemplo

```csharp
internal sealed record Data
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required bool Active { get; init; }
    public DataUsuario? CreadoPorUsuario { get; init; }
}

internal sealed record DataUsuario
{
    public required int Id { get; init; }
    public required string Nombre { get; init; }
}
```

## Decisiones importantes

- Declara únicamente campos que la respuesta o su transformación necesitan.
- Parte de la estructura de la entidad consultada: agrupa una relación como `DataUsuario` en vez de multiplicar campos planos `UsuarioId`/`UsuarioNombre` si el contrato requiere un usuario anidado. Mantén null en relaciones opcionales y no crees objetos ficticios para relaciones ausentes.
- En Get incluye solo escalares/objetos de valor de la entidad y propiedades de referencias superiores (`ProductoCotizacion` → `Cotizacion`, `Cotizacion` → `Cliente`). Nunca incluyas en `Cotizacion/Get/Data` una colección de `ProductoCotizacion`: esa entidad tiene su propio Get, con GetById y listado paginado.
- Los tipos auxiliares del dato base usan el nombre `Data` como prefijo y el concepto como sufijo (`DataUsuario`, `DataCliente`, `DataPerfilTecnico`), top-level y locales a su slice. GetById y GetAll comparten siempre la proyección de Get; no compartas `Data` entre slices distintas.
- Mantén el tipo interno de Application y evita atributos de serialización, binding o MVC.
- Usa tipos compatibles con la traducción de la proyección a SQL.
- No agregues valores centinela ni defaults para ocultar datos faltantes; resuelve esa semántica en el dominio o en la transformación correspondiente.
- En consultas Get públicas mantén siempre `Data` interno separado de `Response` público, aunque ambos tengan la misma forma.
- El mismo `Get/Data` produce el elemento de GetById y de GetAll; no generes modelos alternativos para el listado. Es de solo lectura: no lo cargues, modifiques y guardes como si fuera la entidad persistida.
- Un `Data` de Create para snapshot se transforma después de materializar en una **nueva** entidad; copia objetos de valor anidados para no retener instancias ni estado del origen.
