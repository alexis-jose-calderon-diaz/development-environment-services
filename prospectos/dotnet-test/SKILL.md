---
name: dotnet-tests
description: Use when creating, completing, reviewing, fixing, or maintaining automated .NET tests for vertical slices, handlers, validators, endpoints, EF Core/PostgreSQL behavior, or architecture rules in this repository.
---

# Tests Automatizados .NET

## Objetivo

Crear, revisar y mantener tests claros, deterministas y alineados con la arquitectura Vertical Slice de este repositorio .NET 10.

Esta skill cubre tests unitarios, de integración y de arquitectura para handlers, validators, endpoints, reglas de negocio, EF Core y PostgreSQL. También cubre la revisión de cobertura, el diagnóstico de fallos y pequeños cambios de testabilidad.

## Cuándo Usar Esta Skill

Usar cuando se solicite:

- crear o completar tests para una slice o componente existente;
- revisar, corregir o estabilizar tests;
- probar validaciones, reglas de negocio, persistencia o endpoints;
- verificar consultas EF Core, restricciones PostgreSQL o concurrencia;
- comprobar reglas estructurales de arquitectura;
- detectar código difícil de probar durante una tarea de tests.

No usar como guía principal para implementar funcionalidad sin trabajo de tests, realizar benchmarks o pruebas de carga, ni cambiar comportamiento productivo solo para obtener tests verdes. No inventar comportamientos no implementados ni especificados.

Si la tarea modifica una vertical slice, aplicar también `AGENTS.md` y, cuando esté disponible, la skill `vertical-slice`.

## Contexto del Repositorio

Existe un único proyecto de tests: `tests/Production.App.Test`. Es un proyecto de integración sobre PostgreSQL real (Testcontainers) y `WebApplicationFactory<Program>`, que comparte `ProductionApiFixture` (contenedor + migraciones + usuarios de prueba) vía la colección `ProductionApi`.

El nivel de prueba canónico es **handler + `ProductionDbContext` real**: cada `HandlerTests.cs` instancia el handler con un `ProductionDbContext` conectado al contenedor (helper `TestDbContext.Create(connectionString)` o `CreateDbContext()` de un fixture) y verifica el estado persistido con un contexto nuevo. Los validators se prueban directo con FluentValidation (`ValidatorTests.cs`). Un `EndpointTests.cs` fino por módulo cubre solo lo que el handler no observa: autorización (401/403), binding de query/route y `[BindRequired]`, y el contrato HTTP happy-path.

La estructura refleja las vertical slices productivas:

```text
tests/Production.App.Test/Features/{Modulo}/
├── {Modulo}Fixture.cs              # solo si el módulo tiene cadena de datos propia
├── {CasoDeUso}/
│   ├── HandlerTests.cs
│   ├── ValidatorTests.cs           # solo si el caso de uso tiene validator no trivial
│   └── EndpointTests.cs            # solo si aporta cobertura HTTP
```

Los datos compartidos se siembran mediante un único seed canónico `Seeds/ProductionSeed.cs` (idempotente, con constantes públicas para IDs/códigos estables). Los módulos con cadena propia definen un `{Modulo}Fixture.cs` que invoca el seed base en `InitializeAsync()` y añade su data específica encima.

La ubicación productiva puede evolucionar. Localizar la slice real y reflejar su módulo y caso de uso. No crear `Production.UnitTests`, `Production.IntegrationTests` ni otro proyecto de tests.

Antes de escribir, inspeccionar:

- archivos `.csproj` y paquetes instalados;
- implementación completa y dependencias de la slice;
- tests relacionados y convenciones de nombres;
- fixtures, collections, factories, builders y helpers;
- infraestructura Testcontainers existente.

El stack esperado incluye xUnit, EF Core, PostgreSQL, Testcontainers, FluentValidation y NSubstitute. Usar FluentAssertions solo si el proyecto objetivo ya lo utiliza; de lo contrario, conservar las aserciones existentes. No agregar una librería si el repositorio ya ofrece una alternativa equivalente. Si falta una dependencia imprescindible, agregar únicamente la mínima y justificarla.

## Principios

- Probar comportamiento observable y contratos, no detalles internos accidentales.
- Cada test debe verificar un comportamiento principal con Arrange, Act y Assert claros.
- Implementar el conjunto mínimo que cubra reglas, riesgos y regresiones plausibles.
- No probar métodos privados, asignaciones triviales ni el funcionamiento interno de EF Core, FluentValidation u otras librerías.
- No duplicar reglas del validator en tests del handler o endpoint, salvo que se pruebe el pipeline que las ejecuta.
- Mantener tests deterministas, independientes, repetibles y sin estado mutable compartido.
- No depender del orden de ejecución, servicios externos reales, esperas arbitrarias ni fechas globales no controladas.
- No modificar código productivo sin un defecto o problema concreto de testabilidad.
- No afirmar que los tests pasan si no se ejecutaron.

Para comportamiento temporal, preferir `TimeProvider`. Para sincronización o cancelación, usar señales controladas; no usar `Task.Delay` ni tiempos de espera reales para provocar el escenario.

## Flujo Obligatorio

1. Localizar la slice o componente real.
2. Leer implementación, dependencias, configuración y tests relacionados.
3. Identificar comportamientos observables y riesgos relevantes.
4. Clasificar cada prueba como unitaria, de integración o de arquitectura.
5. Implementar el conjunto mínimo de tests valiosos.
6. Ejecutar primero un filtro específico para la clase o namespace afectado.
7. Corregir la causa raíz de cualquier fallo sin debilitar las aserciones.
8. Ejecutar el proyecto de tests o la solución cuando corresponda al alcance.
9. Ejecutar un build adicional solo cuando sea necesario según la política de verificación.
10. Reportar resultados, límites, comandos omitidos y bloqueos reales.

## Clasificación de Pruebas

Elegir el nivel más bajo que represente fielmente el comportamiento, no el más fácil de simular.

### Tests Unitarios

Usar cuando la unidad pueda aislarse y sus dependencias puedan sustituirse de forma razonable:

- reglas de negocio y servicios de dominio;
- transformaciones, normalizaciones y cálculos;
- decisiones condicionales;
- validators;
- handlers sin dependencia relevante de consultas ejecutadas por EF Core;
- traducciones puras entre `Data` y `Response`.

Usar xUnit y NSubstitute para dependencias simples. Configurar solo lo necesario y verificar llamadas con `Received` o `DidNotReceive` únicamente cuando la llamada o su ausencia sea el efecto observable. Evitar mocks frágiles, orden estricto y verificaciones exhaustivas de implementación. No crear una interfaz por clase solo para sustituirla.

### Tests de Integración

Usar PostgreSQL real mediante la infraestructura Testcontainers existente cuando el comportamiento dependa de:

- traducción LINQ a SQL, proyecciones o filtros globales;
- persistencia, relaciones, claves foráneas o cascadas;
- restricciones únicas, índices parciales o valores predeterminados de base de datos;
- transacciones, concurrencia o comportamiento específico de PostgreSQL;
- serialización, middleware, autenticación o pipeline HTTP completo.

No simular `DbSet<T>`, `IQueryable<T>` ni consultas complejas de EF Core. Si `IProductionDbContext` requiere hacerlo, reclasificar la prueba como integración. No usar EF Core InMemory para validar comportamiento relacional o consultas destinadas a PostgreSQL.

Reutilizar `ProductionApiFixture`, collections y helpers existentes. Aislar datos con identificadores únicos o limpieza controlada y consultar con un contexto nuevo cuando el tracking pueda ocultar el estado persistido.

### Tests de Arquitectura

Usar para reglas estructurales globales:

- dependencias permitidas entre proyectos;
- namespaces, ubicación y nombres de tipos;
- registro de handlers o validators;
- ubicación de endpoints;
- ausencia de dependencias prohibidas.

Mantenerlos en archivos o carpetas dedicados a arquitectura, nunca dentro de `HandlerTests`, `ValidatorTests` o tests funcionales. Una prueba que resuelve DI o recorre HTTP es de integración aunque verifique una convención arquitectónica; describir ambas dimensiones sin clasificarla como unitaria.

## Estrategia por Componente

### Validators FluentValidation

Probar el validator directamente con `TestValidate` o `TestValidateAsync`, según la versión instalada. Cubrir solo reglas aplicables:

- campos requeridos;
- longitudes, rangos y límites;
- formatos y enums;
- valores válidos representativos;
- reglas condicionales relevantes.

No probar todas las combinaciones si no agregan valor.

### Handlers

Evaluar, sin crear tests mecánicamente, estos escenarios:

- solicitud válida y resultado esperado;
- entidad inexistente;
- duplicidad o regla de negocio incumplida;
- persistencia y estado inicial correctos;
- excepción de infraestructura traducida a excepción de negocio;
- ausencia de persistencia ante error;
- concurrencia cuando pueda romper la regla.

Para excepciones, comprobar el tipo concreto, el mensaje cuando sea parte del contrato y la ausencia de efectos secundarios indebidos. Para persistencia, comprobar según corresponda la entidad agregada, valores normalizados, campos obligatorios, estado inicial y cantidad relevante de llamadas a `SaveChangesAsync`; en integración, comprobar el estado realmente persistido.

La validación fallida pertenece normalmente al test directo del validator o al pipeline de integración. Probarla en el handler solo si este invoca la validación como parte de su contrato.

### Endpoints

Enfocar los tests en binding de route, query string y body, códigos HTTP, contratos, autorización, integración con el handler, validación del pipeline y serialización relevante. Preferir `WebApplicationFactory` y las fixtures existentes para comprobar el endpoint completo.

## Unicidad y Concurrencia

### `UniqueViolationException` en Tests Unitarios

Se puede sustituir `SaveChangesAsync` para lanzar `UniqueViolationException` solo cuando:

- `IProductionDbContext` sea sustituible de forma limpia;
- no sea necesario simular `DbSet<T>` ni consultas de EF Core;
- el objetivo exclusivo sea comprobar que el handler traduce una excepción de infraestructura a una excepción de negocio.

Ejemplo:

```csharp
Handle_CuandoSaveChangesProduceUniqueViolationException_LanzaBusinessRuleException()
```

Comprobar el tipo de excepción de negocio, el mensaje cuando sea parte de la regla, la ausencia de una segunda persistencia y que el handler no oculte excepciones distintas. Para este último punto, agregar un escenario separado solo si existe riesgo de un `catch` demasiado amplio.

### Violación Única en Tests de Integración

Usar PostgreSQL real con Testcontainers para comprobar:

- que la restricción o índice produce realmente una violación única;
- el código PostgreSQL `23505`;
- la traducción realizada por la infraestructura del proyecto;
- condiciones de carrera;
- que dos operaciones concurrentes no persistan un estado inválido.

No simular una violación de PostgreSQL cuando el objetivo sea validar la configuración real del índice o restricción.

No exigir automáticamente ambos niveles. Crear el unitario si aporta cobertura específica de la traducción del handler y el de integración si valida base de datos e infraestructura real. Si una integración cubre claramente ambos riesgos y el unitario no aporta valor adicional, no duplicarlo.

## `[Fact]` y `[Theory]`

Usar `[Theory]` cuando varios datos representen el mismo comportamiento conceptual, por ejemplo entradas vacías, nulas o con espacios; valores fuera de rango; formatos inválidos; estados equivalentes; o límites mínimos y máximos.

- Usar `InlineData` para valores simples y legibles.
- Usar `MemberData` para objetos, fechas, colecciones o casos compartidos.
- Usar `ClassData` solo para un conjunto grande o reutilizable que justifique una clase dedicada.

Usar `[Fact]` para un escenario único, preparación específica, efectos secundarios, infraestructura particular o una identidad de negocio propia. No agrupar comportamientos distintos en una teoría para reducir líneas; cada fila debe comprobar el mismo resultado conceptual.

## `CancellationToken`

No probar su propagación en cada handler ni verificar mecánicamente que todas las dependencias reciban exactamente el mismo token. Probar cancelación solo cuando:

- el handler tenga lógica específica al cancelarse;
- una dependencia propia cambie su comportamiento según el token;
- deba evitarse persistencia después de una cancelación;
- exista una regresión conocida;
- la operación sea de larga duración;
- la cancelación forme parte explícita del contrato.

Cuando solo sea necesario invocar un método asíncrono, usar un token explícito o `CancellationToken.None` según las convenciones existentes, sin convertirlo en el objetivo del test. Para provocar cancelación, aplicar la prohibición de esperas reales y `Task.Delay` definida en Principios.

## Nombres y Estructura

Usar clases como `HandlerTests`, `ValidatorTests` y `EndpointTests`. El namespace (`Production.App.Test.Features.{Modulo}.{CasoDeUso}`) aporta el contexto, por lo que no hace falta el prefijo `{Modulo}{CasoDeUso}Tests`.

Usar nombres de métodos en español sin caracteres especiales con el formato:

```text
Metodo_Escenario_ResultadoEsperado
```

Ejemplos:

```csharp
Handle_CuandoElNombreYaExiste_LanzaBusinessRuleException()
Validate_CuandoElNombreEstaVacio_RetornaError()
```

Reflejar la estructura productiva sin crear archivos sin valor:

```text
tests/Production.App.Test/Features/{Modulo}/{CasoDeUso}/
├── HandlerTests.cs
├── ValidatorTests.cs
└── EndpointTests.cs
```

No es obligatorio crear los tres archivos. Omitir comentarios `Arrange`, `Act` y `Assert` cuando la estructura ya sea evidente.

## Datos y Testabilidad

Usar los datos mínimos del escenario. Reutilizar helpers existentes y crear builders o fixtures solo cuando reduzcan duplicación real; preferir inicializadores simples antes que infraestructura genérica. Los builders deben permitir sobrescribir únicamente los datos relevantes.

Se permiten cambios productivos pequeños y justificados, como introducir `TimeProvider`, extraer un límite externo o separar una regla pura. No cambiar comportamiento funcional, contratos, persistencia o arquitectura solo para facilitar un test, ni introducir interfaces innecesarias. Si mejorar la testabilidad excede el alcance, documentar el riesgo y el escenario no cubierto en vez de forzar mocks.

## Revisión y Corrección

Al revisar, presentar primero hallazgos ordenados por severidad con archivo y línea. Buscar especialmente:

- tests que pasan sin demostrar lo declarado;
- clasificación incorrecta o persistencia simulada;
- aserciones débiles o acopladas a detalles internos;
- escenarios importantes ausentes;
- dependencia entre tests o datos compartidos;
- flakiness, tiempo no controlado o esperas arbitrarias;
- excepciones sin comprobar efectos secundarios;
- duplicación entre validator, handler y endpoint;
- fixtures o builders más complejos que los escenarios.

Ante un fallo, reproducirlo de forma aislada, determinar si la causa está en producto, test, datos, infraestructura o concurrencia, corregir la causa raíz y ejecutar nuevamente el alcance relevante. No ocultar flakiness con reintentos indiscriminados, orden forzado o aserciones menos precisas.

Si no hay hallazgos, indicarlo y mencionar riesgos residuales o validaciones no ejecutadas.

## Ejecución y Build

Descubrir primero el `.csproj` real. Preferir rutas explícitas y filtros por nombre completamente calificado.

```bash
dotnet test tests/Production.App.Test/Production.App.Test.csproj \
  --filter "FullyQualifiedName~Features.Area.Create"

dotnet test tests/Production.App.Test/Production.App.Test.csproj \
  --filter "FullyQualifiedName~AreaCreateTests"
```

Después del filtro específico, ejecutar el proyecto afectado o toda la solución cuando el alcance lo justifique:

```bash
dotnet test tests/Production.App.Test/Production.App.Test.csproj
dotnet test Production.sln
```

Los tests de integración requieren Docker para Testcontainers. Si Docker, PostgreSQL u otro prerrequisito no está disponible, conservar y reportar el error real. Una compilación no equivale a tests ejecutados.

Ejecutar `dotnet build Production.sln` cuando:

- ningún comando de tests haya compilado el alcance afectado;
- se hayan modificado proyectos productivos;
- cambien referencias, paquetes o archivos `.csproj`;
- cambien reglas de compilación, generación de código o configuración;
- sea necesario verificar proyectos no incluidos en los tests ejecutados.

No es obligatorio un build adicional cuando `dotnet test Production.sln` ya compiló correctamente toda la solución, o cuando los tests específicos y el proyecto afectado cubren completamente cambios limitados a tests sin modificaciones productivas ni estructurales.

La respuesta final debe indicar si se ejecutó el build o por qué no era necesario. No presentar la omisión de un build redundante como una validación faltante.

## Criterios de Finalización

La tarea termina cuando:

- se leyeron la implementación y los tests relacionados;
- cada test agregado tiene una clasificación y un comportamiento observable claro;
- se respetan nombres, ubicación e infraestructura existentes;
- se ejecutó el filtro específico y el alcance adicional razonable, o se documentó un bloqueo real;
- no quedaron cambios productivos injustificados;
- el reporte distingue comandos ejecutados, validaciones no ejecutadas, comandos omitidos por redundancia y bloqueos de infraestructura.

## Formato de Respuesta Final

Omitir categorías vacías:

```markdown
## Tests implementados

- `Handle_Cuando...`

## Tipo de pruebas

- Unitarias: ...
- Integración: ...
- Arquitectura: ...

## Verificación

- Comandos ejecutados: `dotnet test ...`
- Resultado: N aprobados, N fallidos.
- Build: `dotnet build Production.sln` ejecutado correctamente.
- Build omitido: no era necesario porque ...
- Validaciones no ejecutadas: ...

## Observaciones

- Comportamientos no cubiertos.
- Riesgos detectados.
- Cambios productivos realizados.
- Bloqueos de infraestructura.
```

No incluir simultáneamente las dos líneas alternativas de build. Si un comando falla o no puede ejecutarse, informar el estado exacto, el motivo y el alcance que sí se verificó.
