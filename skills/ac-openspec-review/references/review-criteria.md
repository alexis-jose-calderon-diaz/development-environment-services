# Criterios por perspectiva

Entregar a cada revisor **solo su apartado** y el inventario mínimo compartido. Evaluar un cambio propuesto, no una implementación terminada. Los requisitos OpenSpec pueden ser deltas `ADDED`, `MODIFIED`, `REMOVED` o `RENAMED`; contrastar las modificaciones/remociones con la spec vigente cuando corresponda. No imponer una solución concreta sin demostrar que la alternativa especificada falla.

## Funcional

- ¿Responden los requisitos y escenarios al objetivo declarado en la propuesta y a cada capacidad prometida? Buscar contradicciones, capacidades sin delta, comportamiento sin definir y exclusiones no aclaradas.
- Comprobar casos principales, alternativos, errores y límites **relevantes al dominio**; entradas, salidas y resultados observables. ¿Podrían convertirse los escenarios y criterios de aceptación en pruebas inequívocas?
- Distinguir una ambigüedad que cambia el comportamiento de una preferencia de redacción. Citar ambos lados de una contradicción y sugerir qué decisión debe fijarse, sin inventarla.

## Técnica

- Contrastar enfoque y decisiones con el código, contratos, interfaces, modelos de datos y patrones **pertinentes**; no afirmar compatibilidad sin revisar la superficie afectada.
- Evaluar dependencias, integración, errores, concurrencia y rendimiento si el diseño los hace relevantes. Identificar decisiones arquitectónicas no resueltas, migraciones o mantenibilidad que condicionen la implementación.
- Señalar la ruta de código o contrato existente que justifique cada incompatibilidad. Si no se dispone del código relevante, indicar el límite de comprobación en vez de asumir que existe un conflicto.

## Seguridad

- Seguir los flujos reales de datos y límites de confianza: autenticación, autorización por recurso, validación de entradas, confidencialidad, integridad y exposición de información según las superficies propuestas.
- Examinar fallos y abuso plausibles a partir de entradas, roles, operaciones y datos descritos. Indicar actor, condición, ruta de ataque y efecto; no inventar vulnerabilidades genéricas ni exigir controles sin superficie de ataque.
- Identificar qué contrato o decisión debe especificar el control y qué prueba o escenario lo verificaría.

## Implementación

- Comprobar si las tareas cubren los comportamientos de las specs y decisiones del diseño, en orden realizable y con dependencias explícitas; no penalizar casillas sin marcar antes de aplicar.
- Revisar pruebas por escenario/riesgo, manejo de fallos, documentación necesaria, migraciones, despliegue/rollback y compatibilidad solo si son aplicables.
- Detectar tareas omitidas, criterios de verificación imposibles, decisiones abiertas que cambian el plan y bloqueos reales. Relacionar cada hueco con un requisito/decisión y con la tarea que debería cubrirlo.
