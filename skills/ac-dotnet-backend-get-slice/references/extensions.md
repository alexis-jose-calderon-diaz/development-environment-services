# `Extensions.cs` para conversiones de lectura

## Responsabilidad

En este patrón convierte `Data` en el `Response` público después de materializar una lectura. Mantiene separadas la proyección traducible de EF Core y las transformaciones ejecutadas en memoria.

## Cuándo incluirlo

Normalmente aplica a `Get/Extensions.cs` cuando `GetById` y `GetAll` transforman el mismo `Data` al mismo contrato de elemento. No es un archivo CRUD obligatorio: no lo crees para Create/Update/Delete si no hay esa conversión. Si el proyecto coloca el mapeo en otro sitio, sigue su patrón.

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
        };
    }
}
```

La sintaxis de extension blocks requiere C# 14. Comprueba el TFM y `LangVersion` antes de usarla. En versiones anteriores, sigue el estilo de extensiones o mapeo adoptado por el proyecto; no eleves la versión del lenguaje solo para copiar este ejemplo.

## Decisiones importantes

- Ejecuta aquí los cálculos y formatos que EF Core no puede traducir, una vez que `Data` está materializado.
- No consultes servicios ni bases de datos desde la conversión.
- No agregues valores por defecto que conviertan datos ausentes en aparentes valores válidos.
- Mantén la conversión local a su slice y reutiliza la respuesta compartida solo cuando el contrato público sea intencionalmente el mismo.
- No conviertas entidades de comando en `Data`/`Response` de lectura como paso obligatorio. Aplica los cambios mediante métodos del dominio/agregado y el flujo de persistencia definido por el proyecto.
