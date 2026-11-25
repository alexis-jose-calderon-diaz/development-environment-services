# Validación de `Request` con APIs nativas de .NET

## Responsabilidad

Las reglas declarativas del contrato pertenecen al `Request` de Application:

- Data Annotations (`System.ComponentModel.DataAnnotations`) expresan restricciones de propiedades.
- `IValidatableObject` expresa condiciones y relaciones entre propiedades del mismo objeto.
- Un `ValidationAttribute` personalizado se reserva para una regla reutilizable que no pueda expresarse con atributos nativos.

Cada handler que recibe un `Request` valida antes de producir efectos, aunque `[ApiController]` ya haya validado el mismo objeto en una llamada HTTP. El estándar objetivo concentra la llamada a Data Annotations y la agregación en una utilidad compartida de Application: el handler no repite la creación de `ValidationContext` y Application no depende del transporte ni de una validación previa de MVC. No se crean archivos `Validator.cs` ni registros DI de validators como patrón para slices nuevas.

## Cuándo incluir reglas

- **Create**: restricciones de presencia, longitud, rango, formato y enum en el `Request`; usa `IValidatableObject` para consistencia entre campos.
- **Get**: `Search` y demás filtros siguen siendo opcionales. La pareja nullable `Page`/`PageSize` se omite completa para obtener todos los resultados coincidentes o se proporciona completa; los atributos validan cada valor y `IValidatableObject` rechaza una pareja parcial.
- **Update**: expresa las restricciones del contrato de actualización, que pueden diferir de Create.
- **Delete**: no agregues una validación ni un `Request` artificial si solo se recibe el ID principal.
- **Regla reutilizable no nativa**: crea un `ValidationAttribute` solo si la misma regla declarativa se comparte entre contratos. Incluye pruebas unitarias para los casos válidos e inválidos y para la asociación del error.

Si un `Request` no tiene restricciones, no agregues validación artificial. Esto no elimina un `Request` exigido por los datos de negocio o el contrato uniforme de entrada.

## Qué mecanismo usar

| Tipo de regla | Mecanismo |
|---|---|
| Presencia/no nulo | `[Required]`; declara nulabilidad y `required` de acuerdo con el contrato |
| Longitud | `[MinLength]` y `[MaxLength]` como restricciones separadas |
| Rango numérico | `[Range]` |
| Formato estándar | Atributos especializados, como `[EmailAddress]`, `[Url]` o `[Phone]` |
| Formato propio | `[RegularExpression]` solo cuando el patrón represente realmente el contrato |
| Pertenencia a enum | Metadata de enum, por ejemplo `[EnumDataType]`, y validación explícita en Application |
| Condición o relación entre propiedades | `IValidatableObject` |
| Regla reutilizable no cubierta por .NET | `ValidationAttribute` personalizado con pruebas unitarias |
| Existencia, unicidad, permisos, persistencia o servicio externo | Comprobación síncrona o asíncrona en Application, fuera de atributos |
| Invariante fundamental del negocio | Dominio; mantener además las restricciones autoritativas de integridad en persistencia cuando correspondan |

Declara cada restricción una sola vez en el contrato. MVC y Application pueden ejecutar esa misma declaración en sus respectivas fronteras; no hace falta duplicarla en dos mecanismos. Los atributos no deben consultar bases de datos, servicios externos ni dependencias de Infrastructure.

## Ejemplos

### Reglas de propiedad y validación entre propiedades

```csharp
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Production.Domain.Enums;

public sealed record Request : IValidatableObject
{
    [MaxLength(100, ErrorMessage = "La búsqueda no puede exceder los 100 caracteres.")]
    public string? Search
    {
        get;
        init => field = value?.Trim().ToUpperInvariant();
    }

    [Range(1, int.MaxValue, ErrorMessage = "La página debe ser mayor o igual a 1.")]
    public int? Page { get; init; }

    [EnumDataType(typeof(PageSize), ErrorMessage = "El tamaño de página no es válido.")]
    public PageSize? PageSize { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Page.HasValue != PageSize.HasValue)
        {
            yield return new ValidationResult(
                "Los parámetros de página y tamaño deben especificarse juntos.",
                new[] { nameof(Page), nameof(PageSize) }
            );
        }
    }
}
```

`Search` ausente, `null` o vacío no aplica filtro. Si `Page` y `PageSize` se omiten juntos, el handler devuelve todos los resultados coincidentes; si solo uno tiene valor, `IValidatableObject` asocia el error a ambos miembros. Cuando están presentes, `[Range]` y `[EnumDataType]` validan sus valores.

Un campo requerido puede declarar por separado presencia y longitud:

```csharp
[Required(ErrorMessage = "El nombre es obligatorio.")]
[MinLength(4, ErrorMessage = "El nombre debe tener al menos 4 caracteres.")]
[MaxLength(45, ErrorMessage = "El nombre no puede exceder los 45 caracteres.")]
public required string Name
{
    get;
    init => field = value?.Trim().ToUpperInvariant() ?? string.Empty;
} = string.Empty;
```

Normaliza strings antes de validarlos, según la semántica de la operación. No conviertas una regla de negocio de subconjunto de enum en una mera comprobación de pertenencia; expresa la condición entre valores en `IValidatableObject` o en Application, según necesite infraestructura.

### Atributo reutilizable

Cuando una regla personalizada se reutiliza en varios contratos y no existe un atributo nativo equivalente, implementa `ValidationAttribute`. Mantén la regla síncrona y sin acceso a infraestructura:

```csharp
using System;
using System.ComponentModel.DataAnnotations;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
public sealed class NonEmptyGuidAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(
        object? value,
        ValidationContext validationContext
    )
    {
        if (value is Guid id && id == Guid.Empty)
        {
            return new ValidationResult(
                ErrorMessage ?? "El identificador no puede estar vacío.",
                new[] { validationContext.MemberName! }
            );
        }

        return ValidationResult.Success;
    }
}
```

La nulabilidad y `[Required]` determinan si `null` es admisible; el atributo anterior solo rechaza un `Guid.Empty`. Prueba el resultado válido, el inválido y los miembros asociados. Si la regla solo aplica a un único modelo, prefiere `IValidatableObject` antes que crear un atributo.

## Ejecución en ASP.NET Core

Los controllers de la API usan `[ApiController]`. Tras enlazar y deserializar el input, ASP.NET Core ejecuta Data Annotations e `IValidatableObject`; si el `ModelState` no es válido, responde automáticamente con `400 ValidationProblemDetails` antes de invocar el action.

La validación MVC recorre el grafo de modelos enlazados, incluidos objetos anidados y elementos de colecciones, y conserva rutas de miembro como `Perfil.Nombre` o `Items[2].Nombre`. Los endpoints HTTP deben mantener sus reglas declarativas en los `Request` enlazados y probar el comportamiento mediante solicitudes a la API.

Application no ejecuta validación declarativa de `Request`. Las llamadas directas a handlers desde jobs, otros casos de uso o pruebas no atraviesan el model binding y, por tanto, no reciben automáticamente esas validaciones. Mantén en Application las reglas manuales, asíncronas y de negocio que correspondan; no las sustituyas por atributos.

`GlobalExceptionMiddleware` sigue adaptando `RequestValidationException` a `400 ValidationProblemDetails` cuando Application lanza explícitamente errores de validación manuales. No es el mecanismo para ejecutar las Data Annotations del model binding.

## Pruebas de validación

Las pruebas unitarias pueden comprobar las reglas declaradas en cada `Request`; las pruebas de integración HTTP verifican que `[ApiController]` las ejecuta antes del handler y devuelve el `ValidationProblemDetails` esperado, incluidos errores anidados. Todo nuevo `ValidationAttribute` personalizado debe tener además pruebas unitarias para sus resultados válidos e inválidos.

## Reglas asíncronas y límites de capa

Los atributos y `IValidatableObject` son síncronos y no reciben `CancellationToken`; no los uses para consultas, permisos ni efectos secundarios. Las comprobaciones de existencia, unicidad, reglas temporales que dependen de estado persistido y servicios externos se ejecutan en Application mediante sus puertos, antes de producir efectos. Propaga `CancellationToken` a cada operación asíncrona. Una consulta previa no garantiza unicidad ante concurrencia: conserva la restricción autoritativa en persistencia y las invariantes del dominio.

## Estado vigente

El runtime valida contratos HTTP mediante el model binding nativo de ASP.NET Core y `[ApiController]`. Application no repite la validación declarativa; `RequestValidationException` permanece para errores manuales que deban traducirse a `400 ValidationProblemDetails`.
