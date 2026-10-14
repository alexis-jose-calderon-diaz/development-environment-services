# Registro de las slices CRUD

## Responsabilidad

Integra handlers de cada slice y validators que realmente existan en el contenedor DI del módulo. El registro permite resolver dependencias sin convertir el módulo en una capa de lógica de negocio.

## Cuándo incluirlo

Actualiza el registro del módulo cuando el proyecto lo haga explícitamente. Al completar un CRUD, registra cada Handler propietario de su slice (`Create`, `Get`, `Update`, `Delete`) y solo los validators presentes. Si hay escaneo automático, no dupliques registros. Al añadir operaciones a un módulo existente, modifica su registro; no crees otro módulo sin necesidad.

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

Elimina las líneas de validators si esa slice no los necesita. Adapta namespaces y duraciones (`Scoped`, `Transient`, etc.) a la composición existente. Si introduces un módulo nuevo, revisa también el registro global de features.

## Decisiones importantes

- Registra el handler y validator en el módulo propietario de la slice; evita un contenedor paralelo o un service locator.
- No registres validators inexistentes ni dupliques registros ya cubiertos por escaneo.
- Mantén el módulo limitado a composición DI; las rutas HTTP se descubren por el mecanismo del host, no por enumeración manual, salvo que la solución indique lo contrario.
- Este archivo es integración del backend, no parte de la lógica de negocio de las slices. Omítelo si el registro automático ya cubre los tipos.
- `GetById` y `GetAll` comparten el mismo `Get.Handler`; no registres handlers separados para ambos si son overloads de una sola slice.
