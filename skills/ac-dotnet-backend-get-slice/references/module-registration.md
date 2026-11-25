# Registro de las slices CRUD

## Responsabilidad

Integra los handlers de las slices de **una sola entidad** en el contenedor DI del módulo. Las reglas declarativas pertenecen al `Request` y se ejecutan globalmente en la frontera MVC mediante `[ApiController]`; no requieren registro de validadores por módulo.

## Cuándo incluirlo

Actualiza el registro del módulo cuando el proyecto lo haga explícitamente. Cada entidad de negocio expuesta tiene su propio `Module.cs` con un `Get.Handler` para GetById/GetAll (GetById recibe un ID, no un Request). Registra handlers de mutación solo si esas operaciones se solicitaron. No registres validators de Requests por DI como patrón para funcionalidad nueva; si hay escaneo automático, no dupliques registros de handlers. Al añadir una entidad nueva, crea su módulo propio y conéctalo al registro global; no incluyas sus slices en el módulo de la entidad padre.

## Ejemplo

Dentro del método de registro ya existente para el módulo:

```csharp
services.AddScoped<Get.Handler>();
services.AddScoped<Create.Handler>();
services.AddScoped<Update.Handler>();
services.AddScoped<Delete.Handler>();
```

Adapta namespaces y duraciones (`Scoped`, `Transient`, etc.) a la composición existente. Si introduces un módulo nuevo, revisa también el registro global de features.

## Decisiones importantes

- Registra cada handler en el módulo propietario de la slice; evita un contenedor paralelo o un service locator.
- No registres la extensión ni los atributos de Data Annotations en DI.
- Mantén el módulo limitado a composición DI; las rutas HTTP se descubren por el mecanismo del host, no por enumeración manual, salvo que la solución indique lo contrario.
- Este archivo es integración del backend, no parte de la lógica de negocio de las slices. Omítelo si el registro automático ya cubre los tipos.
- `GetById` y el único `GetAll` paginado comparten siempre `Get.Handler` y el contrato de elemento; registra un solo handler.
- `Cotizacion` y `ProductoCotizacion` se registran en módulos distintos. Una lectura del padre puede proyectar datos de una referencia superior como `Cliente`, pero no ejecuta handlers del hijo ni publica su listado bajo el módulo padre.
- Una entrada anidada reutilizada entre Create y Update conserva un contrato compartido cuando ambas slices lo usan; MVC valida sus miembros al enlazar el modelo, según [validator.md](validator.md). Aprovecha los puertos de tiempo/usuario ya registrados por el host, no crees dobles registros por handler.
