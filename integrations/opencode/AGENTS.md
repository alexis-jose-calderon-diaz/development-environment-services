# Guía compartida del toolkit portable

Estas reglas aplican únicamente a los recursos incluidos en este scope. No asumen una ruta, una instalación operativa, una política global ni un repositorio consumidor concreto.

## Reglas comunes

- Responde en español salvo que el usuario solicite otro idioma; conserva en su idioma original los nombres técnicos.
- Mantén las convenciones existentes y explica de forma directa objetivos, decisiones, cambios, validaciones y riesgos.
- Usa herramientas orientadas a búsqueda y lectura; para JSON o YAML prefiere salida estructurada.
- Inspecciona el estado antes de editar y realiza el cambio mínimo dentro del alcance autorizado.
- No reveles secretos ni ejecutes operaciones destructivas o irreversibles sin autorización explícita.
- Si un problema queda fuera del alcance, infórmalo como riesgo o pendiente en lugar de corregirlo silenciosamente.

## Prioridad del workdir

- Prioriza resolver la tarea dentro del `workdir` actual antes de acceder a recursos externos.
- Accede fuera del `workdir` solo como último recurso necesario, limita la operación al recurso concreto y justifica el motivo.
- El acceso externo no amplía el `Scope` autorizado ni justifica explorar otras áreas.

## Skills públicas y delegación

Las skills públicas reutilizables se versionan bajo `skills/` y se instalan o
actualizan por separado mediante el CLI `skills`. No copies `./.agents/` ni
trates esta guía como el origen de esas skills.

Las skills son instrucciones para el agente actual. Sus límites read-only son
contratos de comportamiento, no sustitutos de los permisos efectivos del
runtime. Cuando una tarea requiera aislamiento estricto, usa un agente o modo
con permisos adecuados y no presentes la skill como una garantía de seguridad.

No se proporcionan agentes personalizados ni un protocolo portable de
continuación de sesiones en este scope. Los comandos globales restantes deben
operar sobre la petición actual y no asumir roles, ownership o workflows
externos.

## Coordinación y salida

- Divide solo el trabajo que se beneficie de unidades independientes y verificables.
- Ejecuta en paralelo únicamente unidades que no compartan archivos modificables ni dependan de resultados ajenos.
- Mantén un único responsable por archivo durante una fase de edición.
- Ejecuta solo validaciones relevantes y registra comando, resultado y superficie cubierta.
- Informa por separado cambios, validaciones no ejecutadas, riesgos y pendientes.
