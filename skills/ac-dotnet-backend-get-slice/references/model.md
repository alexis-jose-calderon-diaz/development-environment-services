# `Model.cs` para presentación y plantillas

## Responsabilidad

Representa los datos que una plantilla, documento u otra salida de presentación necesita. No es una copia completa de la entidad ni sustituye los contratos `Request`, `Data` o `Response`; mantiene el formato requerido por la presentación.

## Cuándo incluirlo

Incluye un `Model` en la slice que prepara una salida cuando la plantilla o presentación necesita una forma de datos propia. No lo crees por simetría para operaciones que no generan esa salida.

## Forma y nombres

- Incluye únicamente los campos de entidad que la presentación necesita. No copies todos los campos de la entidad ni repitas miembros por simetría.
- Cuando un miembro representa una entidad o una asociación, conserva la jerarquía de objetos y el nombre declarado en la entidad de origen para la propiedad representada, también en asociaciones indirectas. No aplanes ni dupliques propiedades por comodidad.
- Nombra los auxiliares de entidad con el prefijo `Model` y el nombre de la entidad real representada, no con el nombre de la navegación. Por ejemplo, si `SolicitudCotizacionEntity` declara `ComercialUsuario`, el miembro se llama `ComercialUsuario` y puede ser de tipo `ModelUsuario`, no `ModelComercialUsuario`.
- Los auxiliares son clases top-level locales a la slice del modelo principal. Incluye en ellos solo los campos que la presentación necesita; compártelos entre slices únicamente si comparten intencionalmente el mismo contrato.
- Los campos derivados o propios de la operación/presentación que no representan miembros de entidades pueden conservar nombres semánticos. Agrégalos solo cuando los requiera la salida; no inventes entidades ni propiedades de dominio para ajustarlos a esta convención.
- El formato final debe satisfacer la plantilla (por ejemplo, sus nombres, estructura y valores formateados) sin cambiar por ello la identidad, la jerarquía ni los nombres de los miembros de entidad representados.

## Ejemplo conceptual

La forma de presentación conserva la navegación de origen y nombra el tipo auxiliar por la entidad real:

`SolicitudCotizacionEntity.ComercialUsuario` → `Model.ComercialUsuario : ModelUsuario`

`ModelUsuario` contiene solo los datos de `Usuario` que necesita esa salida. Si una propiedad de presentación es un valor calculado que no representa un miembro de entidad, puede nombrarse de acuerdo con su propósito de presentación.
