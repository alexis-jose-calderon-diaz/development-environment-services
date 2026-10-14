# `Extensions.cs`

## Responsabilidad

Convierte el modelo interno `Data` en el `Response` público después de materializar la consulta. Mantiene separadas la expresión traducible de EF Core y las transformaciones ejecutadas en memoria.

## Cuándo incluirlo

Inclúyelo si la slice transforma `Data` a `Response` y el proyecto asigna esa transformación a un archivo `Extensions.cs`. No lo crees para una conversión trivial si el proyecto la coloca directamente en otro lugar.

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
