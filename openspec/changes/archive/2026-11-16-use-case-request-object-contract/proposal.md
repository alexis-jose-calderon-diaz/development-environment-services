# Proposal

## Why

Las convenciones actuales permiten que handlers y controllers reciban parámetros de negocio escalares directamente y desalientan los `Request` de una sola propiedad. Esto produce contratos inconsistentes entre casos de uso y dificulta ampliar, validar y describir sus entradas de forma uniforme.

## What Changes

- Actualizar `AGENTS.md` para exigir que todos los parámetros de negocio de un caso de uso se agrupen en un objeto `Request`, aunque exista una sola propiedad.
- Mantener como únicas excepciones el identificador de la entidad principal y parámetros técnicos como `CancellationToken`; un caso de uso que solo recibe ese identificador no necesita `Request`.
- Exigir la misma agrupación en las acciones de controllers: identificador principal más un objeto de entrada, sin parámetros de negocio escalares adicionales. Los valores ligados desde otras partes de la ruta, query o formulario se representan dentro del objeto de entrada, respetando los orígenes explícitos permitidos por el proyecto.
- Sincronizar `SKILL.md` y las guías de `handler.md`, `request.md`, `controller.md`, `validator.md` y `module-registration.md`, eliminando recomendaciones contradictorias sobre escalares, `Request` artificiales y registro de validators.
- Precisar que un `Request` puede ser obligatorio por el contrato de entrada aunque no requiera validación; en ese caso se omite el validator vacío, no el `Request`. Usar DataAnnotations solo cuando describan útilmente el schema OpenAPI; toda restricción declarada así debe validarse también con FluentValidation, que puede contener reglas adicionales sin DataAnnotations.
- Mantener los tipos de Application libres de dependencias MVC; cuando el transporte requiera tipos como `IFormFile`, agruparlos en un modelo exclusivo del host y adaptarlos en la frontera.
- No migrar handlers/controllers existentes ni cambiar rutas, payloads o clientes en este cambio documental. La aplicación futura de la convención a un endpoint podrá requerir cambios deliberados de contrato y regeneración OpenAPI/Orval.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

Ninguna. Este cambio solo actualiza documentación y convenciones de desarrollo; `.openspec.yaml` declara `skip_specs: true`.

## Impact

- `AGENTS.md`, secciones de convenciones de slices y firmas de handlers/controllers.
- `.agents/skills/ac-dotnet-backend-get-slice/SKILL.md` y sus referencias `handler.md`, `request.md`, `controller.md`, `validator.md` y `module-registration.md`.
- No hay cambios de runtime, endpoints, persistencia, dependencias ni clientes generados dentro de este cambio.
