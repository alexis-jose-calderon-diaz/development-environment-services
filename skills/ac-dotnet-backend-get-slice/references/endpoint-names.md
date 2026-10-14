# `EndpointNames.cs`

## Responsabilidad

Centraliza los nombres estables de las operaciones HTTP cuando el proyecto los usa como operation IDs de OpenAPI o como nombres de ruta. No contiene lógica de Application.

## Cuándo incluirlo

Actualiza el archivo del módulo si ya existe esa convención. Si el proyecto no centraliza nombres, no agregues este archivo por obligación.

## Ejemplo

```csharp
internal static class EndpointNames
{
    public const string GetById = "ProductGetById";
    public const string GetAll = "ProductGetAll";
}
```

En el controller, usa las constantes en los atributos correspondientes:

```csharp
[HttpGet("{id:int}", Name = EndpointNames.GetById)]
[EndpointName(EndpointNames.GetById)]
```

`Name` identifica una ruta para enlaces como `CreatedAtRoute`; `[EndpointName]` fija el nombre de endpoint/operation ID según el framework y la configuración. No los trates como intercambiables si el proyecto usa ambos.

## Decisiones importantes

- Sigue el formato de nombres existente y evita duplicados.
- Conserva operation IDs estables porque clientes OpenAPI generados pueden depender de ellos.
- No hardcodees el mismo nombre en varios atributos si el proyecto ya provee constantes.
- Añade solo las operaciones de esta slice; no reorganices ni renombres otros endpoints.
