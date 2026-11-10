# `Extensions.cs` para conversiones de lectura

## Responsabilidad

En lecturas convierte `Data` en el `Response` público después de materializar; en una creación basada en snapshot puede convertir el `Data` de origen en una nueva entidad. Mantiene separadas las proyecciones traducibles de EF Core y las transformaciones en memoria.

## Cuándo incluirlo

Aplica a `Get/Extensions.cs`: `GetById` y el único `GetAll` paginado transforman el mismo `Data` al mismo contrato de elemento. También a `Create/Extensions.cs` si una creación copia un snapshot de entidades de origen y la conversión merece separarse del handler. No lo crees para Update/Delete por simetría ni reutilices la conversión de Get para persistir.

## Ejemplo con extension blocks de C# 14

```csharp
internal static class Extensions
{
    extension(Data data)
    {
        public Response ToResponse() => new()
        {
            Id = data.Id,
            Name = data.Name,
            Active = data.Active,
            CreadoPorUsuario = data.CreadoPorUsuario == null
                ? null
                : new ResponseUsuario
                {
                    Id = data.CreadoPorUsuario.Id,
                    Nombre = data.CreadoPorUsuario.Nombre,
                },
        };
    }
}
```

La sintaxis de extension blocks requiere C# 14. Comprueba el TFM y `LangVersion` antes de usarla. En versiones anteriores, sigue el estilo de extensiones o mapeo adoptado por el proyecto; no eleves la versión del lenguaje solo para copiar este ejemplo.

## Decisiones importantes

- Ejecuta aquí los cálculos y formatos que EF Core no puede traducir, una vez que `Data` está materializado.
- En Get conserva la misma forma anidada para relaciones como `DataUsuario` → `ResponseUsuario`, respetando relaciones opcionales; no aplanes campos para simplificar el mapeo.
- No transformes colecciones hijas en `Get/Extensions.cs` del padre: cada hijo tiene su propio `Data`, `Response` y Get paginado en su módulo.
- En un snapshot de Create, usa métodos explícitos como `ToCotizacionEntity(...)` y `ToProductoCotizacionEntity(...)` sobre datos locales de Create; recibe como parámetros el ID/actor/instante UTC que no vienen del origen y construye nuevas instancias de objetos anidados.
- No consultes servicios ni bases de datos desde la conversión.
- No agregues valores por defecto que conviertan datos ausentes en aparentes valores válidos.
- Mantén la conversión local a su slice y reutiliza la respuesta compartida solo cuando el contrato público sea intencionalmente el mismo.
- No conviertas entidades de comando en `Data`/`Response` de lectura como paso obligatorio. Aplica los cambios mediante métodos del dominio/agregado y el flujo de persistencia definido por el proyecto; la excepción es la lectura previa de origen necesaria para un snapshot.
