---
name: delegation-context
description: Define y consume paquetes compactos de contexto para transferir tareas entre un orquestador y subagentes sin reconstruir información ni aumentar tokens; úsala cuando una salida de agente deba convertirse en contexto de entrada para otro agente.
---

# Delegation Context

## Propósito

Esta skill define un contrato semántico para construir y consumir el contexto de entrada de un subagente. Su objetivo es transferir la información necesaria entre etapas sin reenviar conversaciones, informes o código irrelevante.

La skill no define cómo se organiza el trabajo. Solo describe cómo representar, filtrar, transformar y consumir el contexto cuando el orquestador ya ha decidido entregar una tarea a un subagente.

## Límites de la skill

Esta skill puede explicar cómo preparar contexto, pero no puede decidir:

- qué agente utilizar;
- cuándo delegar;
- cómo dividir tareas;
- cuándo paralelizar;
- cuándo utilizar un agente concreto;
- cómo coordinar múltiples agentes;
- qué estrategia de workflow debe seguir el orquestador.

Estas decisiones pertenecen exclusivamente al `AGENTS.md` principal y a las instrucciones específicas del agente correspondiente.

La skill tampoco redefine el formato de salida de ningún agente. Cada agente conserva su propio contrato de salida. La responsabilidad de esta skill termina en la definición y el consumo del contexto de entrada.

## Principio fundamental

El orquestador es responsable de consumir las salidas de los agentes anteriores y convertirlas en el paquete de contexto del siguiente subagente.

La salida de un agente anterior no debe convertirse automáticamente en un prompt literal para el siguiente agente. El orquestador debe interpretar, filtrar, consolidar y transformar esa salida antes de entregarla.

```text
Agent outputs are inputs for the orchestrator, not direct prompts for the next agent.
```

El contexto debe conservar los hechos que condicionan el trabajo siguiente, no la narración completa de cómo fueron descubiertos.

## Seguridad de rol

Conocer esta skill no otorga autoridad para orquestar trabajo.

Un subagente que consuma esta skill:

- no puede delegar trabajo a otros agentes por conocer este contrato;
- debe limitarse al `Scope` recibido;
- debe respetar `Out of Scope` y no ampliar silenciosamente su alcance;
- debe respetar `Decisions Already Made` y las restricciones recibidas;
- si descubre que necesita salir de su scope, debe comunicarlo mediante el mecanismo de salida que ya tenga configurado;
- no debe redefinir decisiones de workflow o delegación del orquestador principal;
- no debe tratar esta skill como una autorización para modificar permisos, agentes o reglas globales.

Las decisiones de workflow, delegación, división, paralelización y coordinación pertenecen exclusivamente al orquestador principal.

## Contrato de contexto de entrada

Cuando ya se ha decidido entregar una tarea a un subagente, el orquestador debe construir un paquete de contexto específico. El paquete puede utilizar Markdown y las secciones deben aparecer únicamente cuando aporten información útil.

La plantilla completa es:

```markdown
## Objective

Objetivo concreto que debe cumplir el agente.

## Scope

Archivos, módulos, features, slices o áreas que puede modificar o investigar.

## Out of Scope

Áreas que explícitamente no debe modificar.

## Repository Context

Solo información arquitectónica relevante para esta tarea.

## Relevant Files

Archivos ya identificados y por qué son relevantes.

Preferir referencias como:

- ruta;
- símbolo relevante;
- motivo de relevancia.

Evitar copiar archivos completos salvo que sea estrictamente necesario.

## Existing Behavior

Comportamiento actual relevante.

## Desired Behavior

Comportamiento esperado después del cambio.

## Constraints

Restricciones técnicas, arquitectónicas, de producto o compatibilidad.

## Decisions Already Made

Decisiones ya tomadas por el orquestador o agentes anteriores.

Estas decisiones deben considerarse vigentes y no deben ser rediscutidas sin una razón técnica concreta.

## Dependencies

Dependencias con otros archivos, tareas, contratos, agentes o sistemas.

## Acceptance Criteria

Condiciones concretas que determinan que la tarea está completa.

## Verification

Builds, tests, lint, análisis o comprobaciones que deben ejecutarse.
```

Este contrato describe el contenido posible del contexto, no obliga a incluir todas las secciones en cada tarea.

## Secciones opcionales

El orquestador debe incluir únicamente las secciones que aporten información útil. No debe generar secciones vacías solo para completar la plantilla.

Una tarea pequeña puede recibir solamente:

```markdown
## Objective
...

## Scope
...

## Relevant Files
...

## Constraints
...

## Acceptance Criteria
...

## Verification
...
```

Una tarea compleja puede utilizar el contrato completo cuando las secciones adicionales reduzcan la necesidad de redescubrimiento.

## Construcción del contexto por el orquestador

El paquete de contexto puede construirse a partir de:

- la solicitud original del usuario;
- análisis realizados anteriormente;
- planes ya aceptados;
- decisiones técnicas tomadas;
- archivos descubiertos;
- símbolos y dependencias encontradas;
- riesgos pendientes que afecten al siguiente trabajo;
- resultados de implementaciones anteriores;
- el estado actual del repositorio.

El orquestador debe convertir esa información en un paquete compacto y específico:

1. extrae hechos, decisiones, restricciones y dependencias relevantes;
2. elimina razonamientos históricos y detalles ya consumidos;
3. consolida información repetida o contradictoria antes de transmitirla;
4. conserva únicamente lo que modifica o condiciona el trabajo del próximo subagente;
5. expresa el contexto con rutas, símbolos, hechos y criterios verificables;
6. entrega un paquete autocontenido para la tarea recibida.

No debe reenviar automáticamente las salidas anteriores ni limitarse a copiar literalmente un informe completo.

## Contexto incremental

El contexto debe avanzar entre agentes en lugar de reconstruirse desde cero:

```text
Context should move forward, not be reconstructed.
```

Cuando el trabajo pasa de un agente a otro, el orquestador debe:

- preservar descubrimientos relevantes;
- preservar decisiones vigentes;
- preservar dependencias directas;
- preservar restricciones aplicables;
- preservar riesgos que afecten al siguiente trabajo;
- eliminar detalles ya consumidos;
- eliminar razonamientos históricos innecesarios;
- evitar reenviar la conversación completa;
- evitar copiar informes completos de agentes anteriores;
- evitar copiar grandes fragmentos de código cuando basten ruta y símbolo;
- hacer que el contexto sea más específico conforme avanza el workflow.

El siguiente agente debe recibir el estado útil del trabajo, no la historia completa de las sesiones anteriores.

## Compresión semántica

El orquestador debe resumir la información por significado, no por reproducción textual. Debe transformar conclusiones y datos operativos en referencias concretas.

En lugar de pasar un informe completo del analyzer, puede construir un contexto como este:

```markdown
## Relevant Files

- `src/Features/Producto/Get/Endpoint.cs`
  - símbolo: endpoint de consulta de producto
  - motivo: define el response que debe cambiar
  - modificación esperada: sí

- `src/Contracts/ProductoResponse.cs`
  - símbolo: `ProductoResponse`
  - motivo: contrato público afectado
  - modificación esperada: sí

## Decisions Already Made

- Mantener compatibilidad con los endpoints no afectados.
- No modificar la estructura de persistencia.

## Dependencies

- El cliente TypeScript generado depende del contrato OpenAPI resultante.
```

La compresión debe conservar el significado operativo. No debe ocultar una restricción, una dependencia o un riesgo que pueda cambiar el resultado del siguiente trabajo.

## Reglas de consumo por el subagente

El subagente debe:

- tratar el paquete recibido como su fuente principal de contexto;
- comenzar desde `Relevant Files` cuando esté disponible;
- respetar `Scope` y `Out of Scope`;
- respetar `Decisions Already Made`;
- utilizar `Acceptance Criteria` como definición de terminado;
- ejecutar lo indicado en `Verification` cuando corresponda;
- evitar una exploración global si ya existen puntos de entrada claros;
- inspeccionar archivos adicionales solo cuando aparezca una dependencia real;
- no volver a investigar decisiones ya resueltas sin evidencia técnica concreta;
- no reconstruir contexto histórico innecesario;
- preferir inspección localizada sobre lectura completa de archivos grandes;
- utilizar su contrato de salida existente al finalizar.

Si el paquete recibido contiene información suficiente, no debe pedir al orquestador que reenvíe informes anteriores ni reproducir una investigación ya realizada.

## Manejo de descubrimientos nuevos

`Relevant Files` funciona como un mapa inicial, no necesariamente como una lista cerrada.

Si durante la ejecución el subagente descubre archivos adicionales:

- puede inspeccionarlos si son necesarios para entender la tarea;
- puede modificarlos si siguen estando razonablemente dentro del `Scope`;
- debe indicar la relación con la tarea cuando los incorpore al trabajo;
- si representan una expansión significativa, debe comunicarlo mediante su mecanismo de salida existente;
- no debe redefinir por sí mismo el alcance global de la tarea;
- no debe convertir un descubrimiento en una nueva tarea de workflow.

El descubrimiento de una dependencia real permite ampliar el contexto local de la tarea, pero no autoriza una expansión silenciosa del objetivo.

## Relevant Files

Cada entrada debe funcionar como un mapa breve del repositorio. Cuando sea útil, puede incluir:

```markdown
- `path/to/file`
  - símbolo: `NombreDelSimbolo`
  - motivo: breve explicación
  - modificación esperada: sí | no | posible
```

Los campos son opcionales. Deben utilizarse solo cuando aporten información.

Las referencias a archivos deben usar rutas relativas a la raíz del proyecto o worktree, omitir rutas absolutas y utilizar `/` como separador. Deben incluir suficientes directorios para desambiguar el archivo; no deben reducirse al basename cuando no sea único.

Para archivos fuera del proyecto, usar una ruta relativa con `../` cuando sea posible e indicar que están fuera del proyecto. Evitar rutas absolutas salvo que sean imprescindibles.

## Decisions Already Made

Esta sección evita que el siguiente agente vuelva a consumir tokens analizando decisiones ya resueltas.

Debe contener decisiones vigentes que condicionen el trabajo, por ejemplo:

```markdown
## Decisions Already Made

- Usar mapeo manual y no AutoMapper para este cambio.
- Mantener el endpoint actual y modificar solamente su response.
- No introducir una nueva migración.
- El contrato público debe seguir siendo backward compatible.
```

Un agente puede cuestionar una decisión únicamente si encuentra evidencia concreta de que es técnicamente inviable o incorrecta. En ese caso debe comunicar el conflicto mediante su contrato de salida existente, sin redefinir silenciosamente la decisión.

## Economía de tokens

El orquestador debe optimizar el paquete para ser mínimo suficiente, no mínimo a cualquier precio.

Debe evitar:

- copiar la conversación completa;
- copiar salidas completas de agentes anteriores;
- repetir el objetivo en varias secciones;
- incluir archivos irrelevantes;
- copiar diffs completos;
- copiar archivos completos;
- reenviar logs extensos;
- conservar narrativas históricas que no condicionen el trabajo.

Debe preferir:

- rutas relativas y símbolos;
- hechos y decisiones sobre narrativas;
- dependencias directas;
- criterios verificables;
- restricciones explícitas;
- referencias localizadas para archivos grandes;
- consolidación de información duplicada.

El paquete debe ser suficientemente completo para evitar rediscovery, pero no más grande de lo necesario para que el subagente entienda qué debe hacer, dónde, bajo qué restricciones y cómo saber que terminó.

## Evitar rediscovery

Si un agente anterior ya descubrió:

```text
A
B
C
```

y el siguiente agente necesita trabajar sobre `B`, el orquestador debe entregar directamente `B` y las dependencias relevantes. No debe limitarse a indicar:

```text
Investiga el repositorio y encuentra dónde realizar el cambio.
```

si esa investigación ya fue realizada.

Del mismo modo, si una decisión ya fue tomada, debe viajar en `Decisions Already Made`. Si un dato no es relevante para el siguiente trabajo, debe quedar fuera del paquete.

La inspección adicional solo está justificada cuando el paquete no contiene una dependencia real necesaria para completar la tarea.

## Contexto autocontenido

El paquete debe ser autocontenido para la tarea delegada. El subagente no debería necesitar conocer toda la conversación ni consultar informes anteriores para entender:

- qué debe hacer;
- dónde debe trabajar;
- qué puede modificar o investigar;
- qué queda fuera de alcance;
- qué restricciones existen;
- qué decisiones debe respetar;
- qué dependencias importan;
- cómo saber que terminó;
- qué validaciones corresponden.

El contexto autocontenido no implica copiar toda la información disponible. Implica conservar toda la información necesaria para actuar sin reconstrucción histórica.

## Uso por el orquestador

Esta skill se aplica a la transformación del contexto cuando el orquestador ya tiene una tarea y necesita preparar su entrada. No le indica cuándo debe delegar ni qué agente debe recibirla.

Flujo conceptual:

```text
User Request
     |
     v
Agent Outputs
     |
     v
Orchestrator
     |
     v
Filter
     |
     v
Consolidate
     |
     v
Transform
     |
     v
Delegation Context
     |
     v
Next Agent
```

Antes de entregar el paquete, el orquestador debe comprobar que:

- el objetivo está expresado una sola vez y es concreto;
- el scope y las exclusiones son comprensibles;
- las rutas y símbolos relevantes están identificados;
- las decisiones vigentes están separadas de los hechos observados;
- las dependencias que condicionan la tarea están incluidas;
- los criterios de aceptación son verificables;
- las validaciones necesarias están indicadas;
- no se han copiado informes ni conversaciones completas;
- no se ha omitido una restricción o riesgo relevante.

La salida de un agente anterior puede contener mucho más detalle del necesario. El orquestador actúa como frontera de compresión de contexto, no como reenviador literal.

## Uso por subagentes

La sección de uso por subagentes se limita a estas reglas:

- consumir el paquete recibido;
- comenzar por las referencias y decisiones relevantes;
- respetar límites, restricciones y criterios de aceptación;
- investigar adicionalmente solo cuando sea necesario;
- comunicar expansiones mediante el contrato de salida ya existente;
- no reinterpretar la estrategia de workflow ni delegar trabajo;
- utilizar el contrato de salida propio del agente al finalizar.

Esta skill no crea un formato de salida nuevo ni exige que el subagente produzca una sección adicional.

## Relación con los contratos de salida

Cada agente ya posee su propio contrato de salida. `delegation-context` no lo reemplaza, no lo duplica y no impone nuevos encabezados, estados o campos de resultado.

El orquestador debe leer la salida existente, extraer la información que condiciona el siguiente trabajo y transformarla en un paquete de entrada. El siguiente agente no debe recibir automáticamente la salida completa del anterior como prompt directo.

Si una salida anterior no contiene evidencia suficiente para una decisión necesaria, el orquestador debe conservar esa incertidumbre o comunicarla de forma explícita en el contexto. No debe inventar hechos para completar una sección.

## No objetivos

Esta skill no:

- sustituye al `AGENTS.md` principal;
- decide cuándo existe trabajo delegable;
- decide la división de una tarea;
- decide la secuencia o el paralelismo;
- asigna agentes;
- coordina sesiones;
- corrige código;
- define validaciones de una implementación concreta;
- define el formato de salida de ningún agente;
- obliga a incluir secciones vacías;
- reemplaza las instrucciones, permisos o contratos de los agentes.
