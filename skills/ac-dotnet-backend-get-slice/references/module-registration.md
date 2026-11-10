# Registro de las slices CRUD

## Responsabilidad

Integra handlers y validators de las slices de **una sola entidad** en el contenedor DI del módulo. El registro permite resolver dependencias sin acoplar casos de uso de entidades distintas ni convertir el módulo en lógica de negocio.

## Cuándo incluirlo

Actualiza el registro del módulo cuando el proyecto lo haga explícitamente. Cada entidad de negocio expuesta tiene su propio `Module.cs` con un `Get.Handler` para GetById/GetAll y un `IValidator<Get.Request>` para el listado paginado (GetById recibe un ID, no un Request). Registra handlers de mutación solo si esas operaciones se solicitaron y los validators de todos sus Requests con reglas; DataAnnotations no reemplaza ni vuelve innecesarios estos validators. Si hay escaneo automático, no dupliques registros. Al añadir una entidad nueva, crea su módulo propio y conéctalo al registro global; no incluyas sus slices en el módulo de la entidad padre.

## Ejemplo

Dentro del método de registro ya existente para el módulo:

```csharp
services.AddScoped<Get.Handler>();
services.AddScoped<Create.Handler>();
services.AddScoped<Update.Handler>();
services.AddScoped<Delete.Handler>();
services.AddScoped<IValidator<Create.Request>, Create.Validator>();
services.AddScoped<IValidator<Get.Request>, Get.Validator>();
services.AddScoped<IValidator<Update.Request>, Update.Validator>();
```

Omite líneas de validators solo en slices sin Request ni reglas de entrada (por ejemplo, Delete con solo un ID). Adapta namespaces y duraciones (`Scoped`, `Transient`, etc.) a la composición existente. Si introduces un módulo nuevo, revisa también el registro global de features.

## Decisiones importantes

- Registra el handler y validator en el módulo propietario de la slice; evita un contenedor paralelo o un service locator.
- No registres validators inexistentes ni dupliques registros ya cubiertos por escaneo.
- Mantén el módulo limitado a composición DI; las rutas HTTP se descubren por el mecanismo del host, no por enumeración manual, salvo que la solución indique lo contrario.
- Este archivo es integración del backend, no parte de la lógica de negocio de las slices. Omítelo si el registro automático ya cubre los tipos.
- `GetById` y el único `GetAll` paginado comparten siempre `Get.Handler` y el contrato de elemento; registra un solo handler y el validator de `Get.Request`.
- `Cotizacion` y `ProductoCotizacion` se registran en módulos distintos. Una lectura del padre puede proyectar datos de una referencia superior como `Cliente`, pero no ejecuta handlers del hijo ni publica su listado bajo el módulo padre.
- Una entrada anidada reutilizada entre Create y Update puede justificar un validator compartido dentro del módulo (`IValidator<RequestPerfilTecnico>`, por ejemplo); regístralo solo si ambas slices usan ese contrato. Aprovecha los puertos de tiempo/usuario ya registrados por el host, no crees dobles registros por handler.
