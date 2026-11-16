# Proposal

## Why

La skill ya recomienda conservar algunos objetos anidados y usa nombres auxiliares para `Request`, `Data` y `Response`, pero no establece una regla transversal para todos los transportes ni aclara de forma consistente que el nombre procede de la entidad real y no de la navegación. Tampoco ofrece una guía propia para `Model`, lo que deja sin criterio uniforme a los modelos de presentación.

## What Changes

- Definir una convención transversal para cualquier objeto de transporte que represente, contenga o proyecte datos de entidades, directa o indirectamente.
- Exigir solo los campos necesarios para el propósito, manteniendo jerarquía, asociaciones anidadas y nombres de propiedades de las entidades de origen sin aplanar ni duplicar por comodidad.
- Fijar nombres de auxiliares top-level, locales a la slice, con prefijo del tipo de transporte principal y nombre de la entidad real representada; documentar que la navegación conserva su nombre y no determina el nombre del tipo auxiliar.
- Integrar la regla en la guía general y en las referencias de transporte/proyección/conversión pertinentes; añadir guía de `Model` para modelos de plantilla y actualizar la tabla de referencias.
- Conservar las reglas particulares de cada transporte, incluidas las restricciones de proyección EF para `Data`, el carácter público de `Request`/`Response` y el formato de presentación de `Model`.
- No modificar código de aplicación ni agregar pruebas; limitar la implementación posterior a `skills/ac-dotnet-backend-get-slice/`.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

Ninguna. Es un cambio documental en una skill, sin cambio de comportamiento del sistema; por ello `.openspec.yaml` declara `skip_specs: true`.

## Impact

- `skills/ac-dotnet-backend-get-slice/SKILL.md` y sus referencias relacionadas.
- Se prevé añadir una referencia específica para `Model` en `skills/ac-dotnet-backend-get-slice/references/` y enlazarla desde la tabla principal.
- Sin cambios en proyectos de aplicación, APIs, dependencias o pruebas.
