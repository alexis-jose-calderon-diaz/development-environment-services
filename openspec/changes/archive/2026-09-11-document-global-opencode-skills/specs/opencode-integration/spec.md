## ADDED Requirements

### Requirement: Catalogo de skills externas para uso global

La integracion portable SHALL documentar un catalogo curado de skills externas para OpenCode, distinguiendo como minimo las dependencias recomendadas de las opciones bajo demanda. Cada entrada SHALL indicar su fuente, su proposito, su relacion con los agentes o commands existentes y cualquier solapamiento o limite relevante.

#### Scenario: Consulta del catalogo recomendado

- **WHEN** un usuario consulta la documentacion de skills globales
- **THEN** puede identificar `git-commit` como dependencia de `/commit` y distinguirla de las skills opcionales sin instalar el catalogo completo

#### Scenario: Consulta de una skill opcional

- **WHEN** el usuario evalua una skill opcional del catalogo
- **THEN** encuentra el caso de uso que la activa y la limitacion que impide tratarla como parte obligatoria del baseline global

#### Scenario: Skill externa no versionada

- **WHEN** el usuario revisa el respaldo versionado de la integracion
- **THEN** puede distinguir el catalogo documental de los `SKILL.md` externos y no interpreta que el repositorio conserve una copia ejecutable de esas skills

### Requirement: Instalacion global dirigida de skills

La documentacion SHALL proporcionar comandos de `npx skills add` que instalen las skills seleccionadas en el alcance global y las dirijan a OpenCode. No SHALL recomendar la instalacion masiva de skills del catalogo externo como baseline, y SHALL indicar que los commands locales pueden imponer restricciones mas fuertes que una skill externa.

#### Scenario: Instalacion global para OpenCode

- **WHEN** el usuario instala una skill documentada siguiendo el comando proporcionado
- **THEN** el comando usa `--global` y `--agent opencode` y la skill queda destinada al directorio global de skills de OpenCode

#### Scenario: Instalacion selectiva

- **WHEN** el usuario instala el baseline o un grupo opcional
- **THEN** el comando selecciona nombres concretos mediante `--skill` y no usa una opcion equivalente a instalar todo el repositorio

#### Scenario: Precedencia del command local

- **WHEN** `/commit` utiliza la skill externa `git-commit`
- **THEN** conserva las restricciones locales de confirmacion, seguridad, staging y validacion aunque la skill externa describa un comportamiento menos restrictivo

### Requirement: Documentacion coherente de superficies globales

Los README del repositorio y de la integracion SHALL distinguir los recursos versionados instalables manualmente de las dependencias externas de skills, SHALL describir el mismo destino global y SHALL evitar referencias a skills OpenSpec eliminadas del respaldo. La instalacion manual del respaldo SHALL incluir todos sus recursos versionados, incluido el plugin portable.

#### Scenario: README raiz y README de integracion alineados

- **WHEN** el usuario consulta cualquiera de los README de instalacion
- **THEN** encuentra una explicacion compatible sobre el respaldo versionado, las skills externas y la configuracion operativa global

#### Scenario: Referencia a skill eliminada

- **WHEN** el usuario sigue la instalacion global desde el README raiz
- **THEN** no se le exige instalar `openspec-change-context-bootstrap` como dependencia del respaldo actual

#### Scenario: Plugin incluido en la instalacion manual

- **WHEN** el usuario copia los recursos versionados de la integracion
- **THEN** la instruccion incluye `plugins/context-handoff.ts` ademas de las reglas, la configuracion, los agentes y los commands documentados
