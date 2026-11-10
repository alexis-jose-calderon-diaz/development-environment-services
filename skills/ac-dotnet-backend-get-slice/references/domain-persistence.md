# Entidades, enums y persistencia

## Cuándo aplica

Consulta esta referencia cuando una slice introduce o usa entidades, estados, fechas, snapshots o restricciones de persistencia. Cambia esquema/migraciones **solo si el usuario lo solicitó**; en otro caso, explica la dependencia pendiente sin modificar la base de datos. Sigue las convenciones del repositorio para capas, herencia, tipos escalares, nombres de tablas y configuraciones.

## Enums: miembros siempre en `UPPER_SNAKE_CASE`

```csharp
public enum ResultadoCotizacion
{
    PENDIENTE = 0,
    GANADA = 1,
    RECHAZADA = 2,
    VENCIDA = 3,
}

public enum EstadoProceso
{
    EN_ANALISIS = 1,
    EN_PRODUCCION = 2,
}
```

- Usa este formato **para todos los miembros** de cada enum nuevo o editado; en nombres de varias palabras separa con `_`. Conserva el nombre del tipo en PascalCase y sus valores numéricos explícitos cuando formen parte del contrato o de datos persistidos.
- Al renombrar miembros existentes, revisa referencias, defaults en entidades y configuración EF, comparaciones, validadores y serialización. Un conversor JSON por nombre puede cambiar el valor público de `"Ganada"` a `"GANADA"`: no presupongas compatibilidad ni cambies nombres publicados sin alinear el contrato acordado. Una discrepancia entre spec y nomenclatura requerida se debe resolver antes de implementar, no ocultar con un mapeo improvisado.
- Distingue un miembro válido del enum de un estado/resultado permitido por **esa operación**. `IsInEnum()` o `[EnumDataType]` validan pertenencia; una transición puede admitir solo `GANADA` o `RECHAZADA` aunque también existan `PENDIENTE` y `VENCIDA`.

## Modelo y snapshot

- Cada entidad de negocio expuesta conserva sus propios casos de uso en un módulo independiente. En lecturas/contratos Get, `Request`, `Data`, `Response` y proyecciones representan solo la entidad y sus referencias superiores con la misma estructura conceptual (p. ej. `Cotizacion` → `Cliente`, `CreadoPorUsuario`); nunca navegan hacia hijos como `Cotizacion` → `ProductosCotizacion`. No copies la entidad completa al contrato ni aplanes relaciones solo para acortar el código; conserva nulabilidad de referencias opcionales.
- La restricción de no traer hijos se aplica a **lecturas y respuestas Get**. Si Create debe crear un snapshot de negocio, puede consultar hijos del origen para copiarlos: consulta solo los campos que deben fijarse, incluidos objetos anidados completos; convierte el `Data` materializado en **nuevas** entidades y objetos de valor, sin trasladar la gestión CRUD del hijo al módulo padre ni exponerlos en el Get del padre.
- Para instantes de negocio usa el proveedor UTC existente y conserva UTC hasta persistencia/respuesta; para fechas de calendario usa el tipo previsto por el dominio, sin conversiones horarias. No sustituyas el reloj del proyecto por `DateTime.Now` o `DateTime.UtcNow` directo si hay un puerto inyectable.

## Si se solicitó un cambio de esquema

- Ubica las nuevas entidades en Domain, el puerto `IProductionDbContext` en Application y los `DbSet`/configuraciones EF en Infrastructure según la estructura del proyecto. Mantén las reglas de negocio en Application/dominio, no en la configuración EF.
- Refuerza invariantes con FK, índices únicos, precisión/escala decimal, defaults y restricciones de base de datos cuando corresponda; no sustituyas validación de entrada por redondeo de la BD. Para objetos de valor, mapea cada propiedad según las convenciones locales y conserva campos no nulos/nullable según el contrato.
- Genera migraciones y snapshot mediante EF Core CLI, no editando archivos de migración a mano. Examina impacto de renombrar enums serializados o mapeados como string y evita migraciones no solicitadas o que alteren datos ajenos.
