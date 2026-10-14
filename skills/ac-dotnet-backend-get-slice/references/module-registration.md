# Registro de `Handler` y `Validator`

## Responsabilidad

Integra el handler y, cuando corresponda, el validator en el contenedor DI del módulo. El registro permite resolver las dependencias sin convertir el módulo en una capa de lógica de negocio.

## Cuándo incluirlo

Actualiza el registro del módulo cuando el proyecto lo haga explícitamente. Si el proyecto usa escaneo automático, registra solo lo que realmente falte. Al añadir una slice a un módulo existente, modifica su registro; no crees un módulo nuevo sin necesidad.

## Ejemplo

Dentro del método de registro ya existente para el módulo:

```csharp
services.AddScoped<Get.Handler>();
services.AddScoped<IValidator<Get.Request>, Get.Validator>();
```

Adapta las duraciones (`Scoped`, `Transient`, etc.) a la composición existente. Si se introduce un módulo completamente nuevo, revisa también el registro global de features del proyecto.

## Decisiones importantes

- Registra el handler y validator en el módulo propietario de la slice; evita un contenedor paralelo o un service locator.
- No registres validators inexistentes ni dupliques registros ya cubiertos por escaneo.
- Mantén el módulo limitado a composición DI; las rutas HTTP se descubren por el mecanismo del host, no por enumeración manual, salvo que la solución indique lo contrario.
- Este archivo es integración del backend, no parte de la lógica de lectura. Omítelo si el registro automático ya cubre los tipos.
