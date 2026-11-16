# Tasks

## 1. Actualizar las reglas globales

- [x] 1.1 Reescribir en `AGENTS.md` las convenciones de inputs y firmas de handlers: todas las entradas de negocio, incluso una propiedad o IDs relacionados, van en `Request`; solo el ID de la entidad principal puede quedar separado; `CancellationToken` permanece técnico. Verificar que `GetById`/Delete con únicamente el ID no exijan un `Request` vacío.
- [x] 1.2 Alinear las reglas de controller en `AGENTS.md`: cada action recibe como máximo el ID principal, un único objeto de entrada y `CancellationToken`; los demás datos de negocio son propiedades del objeto. Precisar body JSON ordinario y las excepciones de query/form sin permitir parámetros de negocio escalares separados; revisar que no contradiga las reglas explícitas de binding.
- [x] 1.3 Aclarar en `AGENTS.md` que las restricciones se ejecutan con FluentValidation, que DataAnnotations se agregan solo cuando aportan al schema OpenAPI y que toda restricción anotada debe repetirse en FluentValidation, aunque FluentValidation puede tener reglas adicionales. Un Request sin reglas puede carecer de Validator sin dejar de ser requerido por el contrato.

## 2. Sincronizar la skill

- [x] 2.1 Actualizar `SKILL.md` y `references/handler.md` con la firma uniforme de handlers y ejemplos para operaciones ID-only y operaciones con `Request`, incluida una transición con motivo. En `SKILL.md`, mantener todas las reglas de entrada en FluentValidation y precisar cuándo agregar DataAnnotations.
- [x] 2.2 Actualizar `references/request.md`, `references/controller.md`, `references/validator.md` y `references/module-registration.md`: requerir objetos de entrada aunque tengan una sola propiedad, quitar las prohibiciones de `Request` artificiales para esos casos y mostrar actions con el ID principal más un objeto. Aclarar que DataAnnotations solo se añaden cuando aportan al schema OpenAPI, toda restricción anotada se replica en FluentValidation y FluentValidation puede incluir reglas adicionales; si el Request requerido no tiene reglas, omitir el Validator y su registro DI, no el Request. Mantener Application libre de tipos MVC y agrupar uploads en un modelo del host cuando corresponda.

## 3. Revisar coherencia y validar

- [x] 3.1 Buscar en `AGENTS.md` y en todas las referencias de la skill recomendaciones incompatibles; confirmar que las únicas excepciones sean el ID principal, operaciones sin datos de negocio y parámetros técnicos, y que query/form sean excepciones de binding, no de estructura.
- [x] 3.2 Ejecutar `openspec validate "use-case-request-object-contract" --type change --json` y `dotnet build backend/Production.slnx`; confirmar que el cambio permanece documental, sin modificaciones de runtime ni de OpenAPI que requieran codegen.
