# `EndpointNames.cs` para operaciones CRUD

## Responsabilidad

Centraliza los nombres estables de las operaciones HTTP cuando el proyecto los usa como operation IDs de OpenAPI o nombres de ruta. No contiene lógica de Application. Normalmente existe un archivo por módulo, no uno por cada slice.

## Cuándo incluirlo

Actualiza el archivo del módulo con las operaciones CRUD que realmente se expongan si ya existe esa convención. Si el proyecto no centraliza nombres, no agregues este archivo por obligación.

## Ejemplo

```csharp
internal static class EndpointNames
{
    public const string GetById = "ProductGetById";
    public const string GetAll = "ProductGetAll";
    public const string Update = "ProductUpdate";
    public const string Delete = "ProductDelete";
    public const string Create = "ProductCreate";
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
- Añade solo las operaciones CRUD realmente solicitadas para el módulo; no reorganices ni renombres otros endpoints.
- `GetById` debe conservar el nombre de ruta si Create usa `CreatedAtRoute` para apuntar a la lectura recién creada.
- Sigue los nombres existentes para Create/Update/Delete y no inventes constants si el framework o el proyecto los deriva automáticamente.
