# Transacciones, unicidad y conflictos

## Cuándo aplica

Aplica únicamente si el caso de uso requiere escrituras atómicas, transiciones competidoras, unicidad o control de versión. No conviertas todas las slices en transacciones serializables por defecto; deriva aislamiento, restricciones y códigos HTTP del contrato y del proveedor del repositorio.

## Responsabilidades por capa

- **Application**: valida entrada y permisos antes de escribir, consulta estado/propietario dentro del alcance, aplica la transición y persiste dentro de la transacción cuando la operación requiere atomicidad. Propaga `CancellationToken` a consultas, guardados y commit; ante error, revierte la transacción sin dejar cambios parciales.
- **Domain/persistencia**: conserva la invariante con índice único, FK, check o token de concurrencia según el caso. Una consulta previa de duplicados mejora el mensaje, pero no sustituye una restricción atómica; un token interno de versión no se expone ni se edita como propiedad de negocio.
- **Infrastructure**: traduce errores específicos del proveedor en excepciones de dominio/aplicación comprensibles para el host, tanto si ocurren en `SaveChangesAsync` como en `CommitTransactionAsync`. La concurrencia optimista de EF puede aparecer como `DbUpdateConcurrencyException`; un fallo de serialización PostgreSQL (`SQLSTATE 40001`) puede llegar como excepción del proveedor directa o envuelta, no necesariamente como `DbUpdateException`. No asumas un único tipo de envoltorio ni captures todas las excepciones como conflictos.
- **HTTP**: traduce conflicto de concurrencia confirmado a `409` genérico y duplicados de negocio identificados a su código acordado (por ejemplo, `422`); no devuelvas SQLSTATE ni detalles de la base de datos. No dupliques detección del proveedor de forma inconsistente entre DbContext y middleware.

## Secuencia para una operación competidora

1. Autoriza y valida lo que puede rechazarse antes de efectos. Abre la transacción con el aislamiento exigido y consulta el estado relevante dentro de ella.
2. Verifica precondiciones del dominio, construye o modifica entidades rastreadas, guarda y confirma. Usa el reloj UTC del proyecto para registrar actor/instante cuando corresponda.
3. Si ocurre una violación única o un conflicto de serialización, haz rollback **antes** de consultar datos confirmados. No consultes dentro de una transacción PostgreSQL abortada; el rollback debe poder completarse incluso si se canceló la solicitud.
4. Solo reclasifica un `40001` como duplicado si, después del rollback, puedes acreditar el mismo identificador/código normalizado en el mismo ámbito; realiza la nueva consulta con un contexto/estado válido. Si no se confirma el duplicado, conserva el conflicto original. No reintentes automáticamente salvo requisito explícito.
5. Conserva las excepciones no clasificadas y evita ocultar fallos de infraestructura bajo una respuesta de negocio. Ajusta la traducción del host y de Infrastructure de forma coherente con el manejo existente.

En un `Get` paginado, la seguridad del alcance importa tanto como en las mutaciones: aplica filtros por usuario **antes** de `CountAsync` y de proyectar los items para no filtrar datos ajenos ni revelar totales.
