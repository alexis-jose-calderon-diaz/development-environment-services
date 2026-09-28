# Spec Delta

## MODIFIED Requirements

### Requirement: Skill propia documentada como recurso portable

La integración SHALL versionar las skills públicas dentro de `skills/`, mantener
cada skill ejecutable en `skills/<name>/SKILL.md` y documentar su instalación
mediante `npx skills add <repository> --skill <name> --global`. Los ocho
nombres públicos SHALL usar el prefijo `ac-`:
`ac-change-impact-analysis`, `ac-change-planning`, `ac-change-review`,
`ac-grouped-commits`, `ac-integration-boundary-audit`,
`ac-release-tag-proposal`, `ac-pull-request` y
`ac-dotnet-clean-architecture`. La documentación SHALL permitir
que el usuario seleccione el agente mediante el comportamiento neutral del CLI,
sin recomendar ni imponer `opencode` u otro agente concreto. SHALL documentar
la actualización mediante `npx skills update <name> --global` y excluir
explícitamente `./.agents/` de esta superficie. `skills/README.md` SHALL
concentrarse en las skills públicas versionadas y SHALL omitir catálogos,
enlaces y comandos de instalación de skills de terceros. La sincronización
manual de `integrations/` SHALL quedar limitada a la configuración y plugins
que permanezcan, sin incluir agents o commands sustituidos, y SHALL mantener
alineado el README raíz como única fuente documental de la integración
portable.

#### Scenario: Copia del respaldo portable

- **WHEN** el usuario instala el respaldo portable de OpenCode
- **THEN** puede sincronizar manualmente la configuración y los plugins que
  permanezcan desde `integrations/` sin requerir que las skills públicas formen
  parte de esa copia manual

#### Scenario: Catálogo público acotado

- **WHEN** el usuario consulta `skills/README.md`
- **THEN** puede identificar las ocho skills públicas versionadas, sus límites
  y la exclusión de `./.agents/`, sin recibir un catálogo ni instrucciones de
  instalación de skills de terceros

#### Scenario: Skill pública instalable de forma neutral

- **WHEN** un usuario quiere instalar una skill pública desde el repositorio
- **THEN** encuentra un comando `npx skills add` con alcance global que usa el
  identificador público con prefijo `ac-`, no recomienda ni impone un agente
  concreto y no instala la skill en `./.agents/skills/`

#### Scenario: Actualización de una skill pública

- **WHEN** una skill pública con identificador `ac-*` ya está instalada y el
  usuario quiere sincronizar una versión posterior
- **THEN** puede ejecutar `npx skills update <name> --global` sin copiar
  manualmente la skill ni modificar el respaldo de `integrations/`

#### Scenario: Eliminación de documentación obsoleta

- **WHEN** el usuario consulta la documentación de la integración
- **THEN** encuentra sus instrucciones en `README.md` raíz y no recibe un
  enlace a `integrations/opencode/README.md`

#### Scenario: Eliminación de commands sustituidos

- **WHEN** el respaldo se sincroniza después del cambio
- **THEN** la instalación documentada no incluye `commands/commit.md`,
  `commands/tag.md` ni `commands/pr.md`, y conserva separadas la configuración,
  las skills públicas y los workflows locales

## ADDED Requirements

### Requirement: Skill pública de estructura .NET Clean Architecture

La integración SHALL proporcionar `ac-dotnet-clean-architecture` para responder
a peticiones de estructura de soluciones .NET siguiendo exclusivamente Clean
Architecture. La skill SHALL proponer el mapa de proyectos de producción y sus
responsabilidades, las referencias permitidas y prohibidas y la dirección de
dependencias hacia el núcleo; SHALL distinguir la referencia de composición
del punto de entrada a la infraestructura de las dependencias funcionales.
La skill SHALL limitar la salida a la estructura de solución y a las relaciones
entre proyectos, sin generar código, organización interna de clases o carpetas,
instrucciones de implementación, alternativas arquitectónicas ni menciones a
pruebas o proyectos de pruebas. SHALL ajustar nombres y puntos de entrada al
contexto conocido sin atribuir al repositorio proyectos inexistentes.

#### Scenario: Nueva solución .NET sin contexto previo

- **WHEN** el usuario pide una estructura de solución .NET basada en Clean Architecture sin aportar un repositorio
- **THEN** la skill propone proyectos para dominio, aplicación, infraestructura y punto de entrada, describe sus responsabilidades y muestra referencias permitidas y prohibidas sin inventar archivos existentes

#### Scenario: Solución .NET existente

- **WHEN** el usuario pide evaluar la estructura de una solución .NET disponible
- **THEN** la skill distingue proyectos observados de proyectos propuestos, identifica referencias contrarias a la dirección de dependencias y entrega una estructura objetivo acotada

#### Scenario: Frontera estricta del contenido

- **WHEN** el usuario pide solo estructura de solución y relaciones
- **THEN** la salida omite código, detalles internos de proyectos, alternativas de arquitectura y toda mención a pruebas o proyectos de pruebas
