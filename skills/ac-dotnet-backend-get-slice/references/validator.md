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

## Ejecución objetivo en Application

Los handlers usan la extensión compartida; no repiten directamente la configuración de `Validator`:

```csharp
using Production.Application.Features.Shared.Extensions;

request.Validate();
```

La utilidad objetivo se define una sola vez en `Production.Application/Features/Shared/Extensions/ValidationExtensions.cs`. Esquema conceptual —la excepción propia aún debe implementarse—:

```csharp
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Production.Application.Features.Shared.Extensions;

public static class ValidationExtensions
{
    extension(object model)
    {
        public void Validate()
        {
            List<ValidationResult> results = [];
            ValidationContext context = new(model);

            if (
                Validator.TryValidateObject(
                    model,
                    context,
                    results,
                    validateAllProperties: true
                )
            )
                return;

            throw new RequestValidationException(results);
        }
    }
}
```

`RequestValidationException` representa una excepción propia de Application; debe conservar los `ValidationResult` producidos, incluidos `ErrorMessage` y todos sus `MemberNames`. No la sustituyas por `System.ComponentModel.DataAnnotations.ValidationException` ni por `FluentValidation.ValidationException`: evita la ambigüedad de tipos y no pierdas el conjunto de resultados. En particular, `Validator.ValidateObject` termina lanzando una `ValidationException` basada en un resultado, en vez de exponer la colección agregada. El helper no requiere registro DI.

`TryValidateObject(..., validateAllProperties: true)` valida por etapas:

1. Propiedades del objeto.
2. Atributos aplicados al tipo.
3. Validación del objeto, incluida `IValidatableObject.Validate(...)`.

Una etapa se ejecuta solo si la anterior tuvo éxito. Por tanto, `IValidatableObject` no se ejecuta si falló la validación de propiedades, y los resultados representan únicamente los errores que Data Annotations produjo en las etapas alcanzadas; no prometas que se ejecutarán todas las reglas posibles. El argumento `validateAllProperties: true` hace que se evalúen los atributos de todas las propiedades. La API no recorre recursivamente los valores de las propiedades.

Application valida antes de consultar o mutar estado. El middleware debe adaptar la excepción propia al `400 ValidationProblemDetails` vigente; no se duplica en el controller la validación automática que MVC ya hizo.

## Objetos anidados y colecciones

`TryValidateObject` no recorre automáticamente objetos anidados ni elementos de colecciones. Cuando formen parte del contrato, el recorrido debe centralizarse en la utilidad compartida:

1. Valida explícitamente cada objeto y elemento pertinente. Si un nodo produce errores, continúa recorriendo sus otros miembros y los nodos hermanos para recoger errores independientes; la semántica por etapas de `TryValidateObject` sigue aplicando dentro de cada nodo.
2. Prefija cada `MemberName` con la ruta de acceso, por ejemplo `Perfil.Nombre` o `Items[2].Nombre`. Conserva todos los miembros informados por cada `ValidationResult`; si el resultado no incluye miembros, usa la clave general `request`.
3. Protege el recorrido contra ciclos con una pila o conjunto de referencias activas y comparación por referencia. Omite solo la reentrada a un objeto que ya esté en la ruta actual y retíralo al salir: así una misma instancia compartida se puede validar desde rutas distintas y producir errores con cada ruta.
4. No recorras valores escalares ni expandas el contrato a entidades que no forman parte de la entrada.

La validación del objeto raíz no reemplaza esta estrategia explícita. Evita asumir que la recursividad de MVC o la anotación de una propiedad anidada resolverá también la validación ejecutada en Application.

## Adaptación HTTP conceptual

`GlobalExceptionMiddleware` debe capturar específicamente la excepción propia de Application, convertir cada `ValidationResult` en mensajes agrupados por miembro y escribir un `400 ValidationProblemDetails`. Antepondrá las rutas calculadas por Application y usará `request` para resultados sin `MemberNames`. La validación automática de `[ApiController]` sigue cubriendo el binding HTTP, pero no sustituye la llamada explícita del handler ni debe introducir dependencias de MVC en Application.

## Pruebas para una futura implementación

La migración deberá añadir pruebas que cubran al menos:

| Caso | Comprobación |
|---|---|
| Request válido | No lanza la excepción propia. |
| Varios errores de propiedades | Conserva todos los `ValidationResult` emitidos en esa etapa y sus miembros; confirma que las etapas posteriores no se ejecutan tras un fallo anterior. |
| `IValidatableObject` | Se ejecuta cuando las etapas previas tienen éxito y conserva sus mensajes y miembros. |
| `ValidationAttribute` personalizado | Conserva mensaje y miembro para resultados válido e inválido. |
| Objeto anidado | Un error del hijo queda bajo una ruta como `Perfil.Nombre`. |
| Colección | Un error de elemento incluye el índice, por ejemplo `Items[2].Nombre`. |
| Ciclo de referencias | El recorrido termina sin recursión infinita y valida los nodos alcanzables pertinentes. |
| Instancia compartida | Se puede validar desde rutas distintas, preservando cada ruta de error. |
| Resultado sin miembros | Se agrupa bajo `request`. |
| Middleware | Traduce la excepción propia a HTTP 400 y agrupa mensajes correctamente en `ValidationProblemDetails`. |

Estos casos son criterios de una futura implementación; este cambio documental no añade ni ejecuta pruebas de código.

## Reglas asíncronas y límites de capa

Los atributos y `IValidatableObject` son síncronos y no reciben `CancellationToken`; no los uses para consultas, permisos ni efectos secundarios. Las comprobaciones de existencia, unicidad, reglas temporales que dependen de estado persistido y servicios externos se ejecutan en Application mediante sus puertos, antes de producir efectos. Propaga `CancellationToken` a cada operación asíncrona. Una consulta previa no garantiza unicidad ante concurrencia: conserva la restricción autoritativa en persistencia y las invariantes del dominio.

## Transición del runtime

El runtime actual todavía no implementa el estándar objetivo: `ValidationExtensions.Validate()` usa `Validator.ValidateObject(..., validateAllProperties: true)`, que lanza una `System.ComponentModel.DataAnnotations.ValidationException` basada en un resultado, y las slices existentes conservan FluentValidation, sus registros y su manejo de excepciones en `GlobalExceptionMiddleware`. Aún no existen la excepción propia con una colección de `ValidationResult`, el recorrido agregado ni el adaptador descrito arriba. Esta guía no afirma que el backend ya esté migrado ni autoriza retirar parcialmente los componentes heredados; su sustitución requiere una migración coordinada.
