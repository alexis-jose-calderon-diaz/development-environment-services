# Tasks

## 1. Reorganizar la documentación por scope

- [x] 1.1 Crear `services/README.md` con la operación actual de Docker Compose: `.env`, red `shared`, inicio, detención, endpoints, persistencia, consumidores, perfil `tailscale`, advertencia `trust` y validación; verificar cada comando y valor contra `services/docker-compose.yaml` y `services/.env.example`.
- [x] 1.2 Reducir `README.md` a la orientación general del repositorio, el inventario de superficies, un resumen del ambiente y la documentación detallada de la integración portable; enlazar `services/README.md` y `skills/README.md` sin repetir sus scopes, y verificar que todos los enlaces activos apunten a archivos existentes.
- [x] 1.3 Reescribir `skills/README.md` como catálogo exclusivo de las siete skills públicas `ac-*`, conservando instalación, actualización, límites y exclusión de `./.agents/`; retirar catálogo, enlaces y comandos de skills de terceros y verificarlo con una búsqueda dirigida sobre los README activos.

## 2. Mejorar la regla portable de delegación

- [x] 2.1 Actualizar `integrations/agents-global.md` para exigir una inspección proporcional y una decisión explícita sobre objetivo, scope, dependencias, salida, validación, independencia y beneficio de coordinación antes de delegar; verificar que también documenta cuándo continuar directamente y que permanece agnóstico del repositorio consumidor.

## 3. Revisar coherencia y validar el cambio

- [x] 3.1 Comparar `README.md`, `services/README.md`, `skills/README.md` e `integrations/agents-global.md` con la delta spec y comprobar que no quedan referencias activas a `github/awesome-copilot`, catálogos de terceros, `integrations/opencode/README.md` ni scopes duplicados; verificar con búsquedas dirigidas y revisión del diff.
- [x] 3.2 Ejecutar `openspec validate --specs` y validar la configuración Compose base y `tailscale` con `docker compose --env-file services/.env.example -f services/docker-compose.yaml config --quiet` y `docker compose --env-file services/.env.example -f services/docker-compose.yaml --profile tailscale config --quiet`; registrar resultados y cualquier validación no ejecutada.
- [x] 3.3 Ejecutar `git diff --check` y una revisión final de `git diff --stat`/`git status --short`; verificar que el alcance solo contiene los README previstos, `integrations/agents-global.md` y los artifacts OpenSpec del cambio.
