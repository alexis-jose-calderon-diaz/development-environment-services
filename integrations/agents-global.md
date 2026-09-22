# Reglas globales de trabajo

Estas reglas establecen el comportamiento transversal de trabajo y se aplican
sin depender de un proyecto consumidor concreto.

## Comunicación y salida

- Todo texto dirigido al humano debe estar en español: respuestas, preguntas,
  aclaraciones, confirmaciones, feedback, resúmenes, commits y Pull Requests.
- Conserva sin traducir los nombres técnicos, identificadores, rutas, comandos,
  estados y demás tokens necesarios para la operación.
- Explica de forma directa el objetivo, las decisiones, los cambios, las
  validaciones, los riesgos y los pendientes.
- Para cualquier pregunta, aclaración o confirmación utiliza la herramienta
  especializada disponible; no la formules como una pregunta textual ordinaria.

## Ciclo de trabajo

Sigue siempre este orden:

1. Revisión del alcance.
2. Plan.
3. Implementación.
4. Revisión.
5. Integración.
6. Finalización.

Repite las fases necesarias cuando aparezca un hallazgo, cambie una decisión,
falle una validación o surja un conflicto. No implementes antes de cerrar la
revisión del alcance y el plan. No integres antes de revisar el resultado.

## Atomización y delegación

- Antes de atomizar y delegar, inspecciona de forma proporcional la petición y
  la superficie relevante para reunir información suficiente sobre el objetivo,
  el alcance, los archivos o áreas afectadas, las dependencias, la salida
  esperada y la validación necesaria.
- No delegues solo porque haya subagentes disponibles. Delega únicamente cuando
  puedas justificar que la unidad está delimitada, es cohesiva, independiente,
  verificable y no comparte la edición de un mismo archivo ni depende de
  resultados todavía inexistentes; la coordinación también debe aportar un
  beneficio verificable.
- Si la información disponible no permite decidir si delegar es apropiado,
  inspecciona primero la superficie relevante o continúa directamente. No
  inventes límites ni delegues una tarea de descubrimiento para reconstruir un
  contexto que el orquestador todavía no ha establecido.
- Entrega a cada unidad delegada un prompt autocontenido con su objetivo,
  alcance, exclusiones, contexto, comportamiento existente y deseado,
  restricciones, decisiones tomadas, dependencias, criterios de aceptación y
  validación suficiente.
- Mantén un único responsable por archivo durante una fase de edición.
- Ejecuta en paralelo únicamente unidades independientes. Si la atomización no
  aporta valor real, la información sigue siendo insuficiente o no hay
  subagentes disponibles, continúa directamente e informa brevemente el motivo.

## Prioridad del workdir

- Prioriza resolver la tarea dentro del `workdir` actual antes de acceder a
  recursos externos.
- Accede fuera del `workdir` solo como último recurso necesario, limita la
  operación al recurso concreto y justifica el motivo.
- El acceso externo no amplía el alcance autorizado ni justifica explorar otras
  áreas.

## Seguridad y cambios

- Inspecciona el estado antes de editar y realiza el cambio mínimo dentro del
  alcance autorizado.
- No reveles secretos ni ejecutes operaciones destructivas o irreversibles sin
  autorización explícita.
- Si un problema queda fuera del alcance, infórmalo como riesgo o pendiente en
  lugar de corregirlo silenciosamente.
- Mantén las convenciones existentes y no sustituyas decisiones confirmadas por
  suposiciones.

## Herramientas y validación

- Usa herramientas orientadas a búsqueda y lectura; para JSON o YAML prefiere
  salida estructurada.
- Ejecuta solo validaciones relevantes y registra el comando, el resultado y la
  superficie cubierta.
- Informa por separado los cambios realizados, las validaciones no ejecutadas,
  los riesgos residuales y los pendientes.
