# Design

## Context

Consulta `proposal.md` para la motivación. El repositorio tiene tres superficies
documentales activas relevantes: el README raíz, `skills/README.md` y la
documentación operativa que actualmente está mezclada en el README raíz. La
integración portable no tiene un README propio por decisión vigente; sus reglas
se respaldan en `integrations/agents-global.md` y su configuración en
`integrations/opencode-config.jsonc`.

El cambio es documental y de guía operativa. No requiere modificar el Compose,
las imágenes, las variables de entorno, la instalación global existente ni la
superficie interna `./.agents/`. La delta spec de `opencode-integration` debe
mantener completos los requisitos modificados para que el comportamiento
documentado siga siendo verificable.

## Goals / Non-Goals

**Goals:**

- Establecer una jerarquía documental explícita: README raíz para orientación e
  integración portable; `services/README.md` para operación Docker; y
  `skills/README.md` para el catálogo público versionado.
- Eliminar del contenido activo del repositorio toda referencia documental a
  catálogos o comandos de instalación de skills de terceros.
- Conservar en el README raíz el detalle requerido para sincronizar la
  configuración portable de OpenCode, porque no se creará un README hijo de
  `integrations/`.
- Convertir la delegación en una decisión justificada después de una inspección
  proporcional, no en una reacción automática a la disponibilidad de
  subagentes.
- Dejar validaciones reproducibles para enlaces, comandos, alcance y
  configuración Compose.

**Non-Goals:**

- No cambiar servicios, imágenes, puertos, volúmenes, redes, credenciales ni
  perfiles Docker.
- No eliminar ni administrar skills instaladas fuera de este repositorio.
- No modificar `skills-lock.json`, las skills públicas ejecutables ni
  `./.agents/`.
- No crear `integrations/README.md` ni mover la fuente documental de la
  integración fuera del README raíz.
- No imponer una delegación obligatoria cuando la inspección determine que el
  trabajo directo es más seguro o eficiente.

## Decisions

### 1. README hijo para el scope operativo de services

Se añadirá `services/README.md` y se trasladará allí la guía específica de
Compose: preparación de `.env`, red `shared`, inicio y detención, endpoints,
perfil `tailscale`, persistencia, consumidores, advertencia de `trust` y
validación. El README raíz conservará la identidad del repositorio, un resumen
del ambiente y un enlace al documento hijo, sin repetir sus instrucciones.

**Alternativa descartada:** mantener toda la operación en el README raíz. Es
más corto en número de archivos, pero mezcla la orientación del repositorio con
un scope operativo que ya tiene límites y comandos propios.

### 2. README de skills limitado a recursos versionados

`skills/README.md` conservará el inventario de las siete skills `ac-*`, sus
límites, instalación y actualización mediante el CLI neutral. Se eliminarán la
sección de skills externas, la fuente `github/awesome-copilot`, sus tablas y el
comando de instalación correspondiente. No se reemplazarán por otro catálogo
externo en una carpeta hija.

**Alternativa descartada:** mover el catálogo externo a otro README. Eso
preservaría la referencia que la petición busca retirar y volvería a mezclar
dependencias no versionadas con la superficie pública del repositorio.

### 3. README raíz como autoridad de la integración portable

La sección de integración de OpenCode permanecerá en el README raíz e incluirá
únicamente los recursos actualmente versionados, su mapeo a destinos
operativos, copia manual, comparación, sincronización, migración y límites.
`integrations/agents-global.md` seguirá siendo solo una guía de reglas
generales, no una guía de instalación.

**Alternativa descartada:** crear `integrations/README.md`. La spec activa
declara que el README raíz es la fuente documental única de esa integración y
un README hijo produciría dos autoridades para el mismo scope.

### 4. Compuerta de decisión antes de delegar

La sección de atomización y delegación de `integrations/agents-global.md`
seguirá este orden conceptual:

```text
[Petición]
    |
    v
[Inspección proporcional]
    |
    v
[¿Objetivo, scope, dependencias, salida y validación suficientes?]
    | sí                         | no
    v                            v
[¿Unidad independiente          [Inspeccionar más
  y coordinación útil?]          o trabajar directo]
    | sí       | no
    v          v
[Delegar]   [Trabajo directo]
```

La regla no exigirá completar una investigación global antes de delegar. La
información debe ser suficiente para tomar la decisión y para construir un
prompt autocontenido, pero la inspección seguirá siendo proporcional. Si la
coordinación no reduce riesgo, no separa ownership real o introduce
dependencias artificiales, el orquestador trabajará directamente.

**Alternativa descartada:** delegar siempre que existan subagentes y corregir
el contexto después. Esa estrategia crea coordinación artificial y puede
exponer a un subagente a un scope incompleto o a archivos compartidos.

## Risks / Trade-offs

- **[README raíz más breve puede reducir descubrimiento inmediato]** -> Añadir
  enlaces directos y visibles a `services/README.md` y `skills/README.md`, y
  conservar en la raíz el inventario de superficies y la guía completa de
  integración portable.
- **[Comandos documentados pueden divergir del Compose]** -> Verificar los
  comandos y endpoints contra `services/docker-compose.yaml` y ejecutar las
  dos variantes de `docker compose ... config --quiet` definidas por el
  repositorio.
- **[La eliminación del catálogo externo puede sorprender a usuarios actuales]**
  -> Hacer explícito en el scope de `skills/README.md` que solo documenta
  recursos versionados del repositorio y no pretende ser un índice de
  dependencias externas.
- **[La compuerta previa puede añadir tiempo en tareas pequeñas]** -> Exigir
  solo una inspección proporcional y permitir trabajo directo inmediato cuando
  ya sea evidente que delegar no aporta valor.
- **[La delta spec puede quedar desalineada con la documentación]** -> Revisar
  los requisitos completos contra los tres README, `agents-global.md` y los
  comandos de validación antes de aplicar el cambio.

## Migration Plan

1. Crear `services/README.md` a partir del comportamiento actual de Compose y
   retirar del README raíz el detalle que ahora pertenece a ese scope.
2. Reducir `skills/README.md` al catálogo público versionado y actualizar el
   README raíz para enlazar ambos README hijos sin duplicar contenido.
3. Actualizar `integrations/agents-global.md` y revisar los tres documentos
   contra la delta spec.
4. Ejecutar búsquedas dirigidas para confirmar que los README activos no
   contienen referencias a skills de terceros ni a rutas documentales
   retiradas.
5. Validar OpenSpec y Compose. El rollback consiste en revertir este cambio
   documental; no requiere tocar volúmenes, servicios ni la instalación global.
