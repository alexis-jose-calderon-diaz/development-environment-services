# Spec Delta

## REMOVED Requirements

### Requirement: Presupuesto de contexto aislado por sesión

**Reason**: El plugin portable dejará de gestionar presupuestos de workers hijos después de eliminar los agentes personalizados y su protocolo de continuidad.

**Migration**: El agente principal usará la gestión de contexto nativa de OpenCode. Si se necesita una política de presupuesto futura, se definirá como una capacidad independiente y compatible con el runtime vigente.

### Requirement: Transiciones y señales de presupuesto

**Reason**: Las señales `NORMAL`, `SOFT` y `HARD` eran instrucciones dirigidas a workers monitorizados por el plugin, no una capacidad de las skills públicas.

**Migration**: Las skills limitarán su propio alcance mediante instrucciones de contexto mínimo y resultados concisos, sin depender de señales inyectadas por un plugin.

### Requirement: HANDOFF textual en estado HARD

**Reason**: El formato `HANDOFF` era un contrato específico entre el plugin y los agentes personalizados.

**Migration**: Las skills devolverán su informe normal y señalarán trabajo pendiente cuando corresponda. No existirá una continuación automática basada en `HANDOFF`.

### Requirement: Protección de herramientas para workers hijos

**Reason**: El bloqueo de herramientas posterior a `HARD` solo tenía sentido junto con workers hijos que conocían y producían el formato `HANDOFF`.

**Migration**: Los límites de herramientas serán los permisos y controles nativos del agente seleccionado; no se instalará una protección portable adicional para este protocolo retirado.

### Requirement: Configuración y validación segura

**Reason**: Los límites, variables de entorno y filtros de agentes del plugin dejarán de tener consumidores dentro de la integración portable.

**Migration**: Retirar la configuración documentada del plugin y eliminar variables o referencias de despliegue que solo lo activaban.

### Requirement: Ciclo de vida y diagnóstico

**Reason**: El estado por sesión y sus logs pertenecían exclusivamente al plugin que será retirado.

**Migration**: Eliminar el plugin, sus referencias de instalación y la documentación asociada; no conservar un componente sin consumidores solo para mantener sus diagnósticos.
