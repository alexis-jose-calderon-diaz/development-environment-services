# Toolkit de CLI — Inventario de herramientas

Sistema: Ubuntu 24.04 LTS (x86_64)
Fecha de inventario: 2026-09-01

Este documento inventaría las herramientas de línea de comandos del toolkit, tanto las ya instaladas como las recomendadas para ampliarlo.

## Tools AI-friendly

Herramientas con salida determinista, composición por pipelines, automatización o interfaces adecuadas para agentes.

| Herramienta       | Comando                                            | Nivel                       | Descripción                                                               |
| ----------------- | -------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| `git`             | `sudo apt install git`                             | Esenciales                  | Control de versiones distribuido. Base del flujo de trabajo con OpenCode. |
| `gh`              | `sudo apt install gh`                              | Esenciales                  | Interactuar con GitHub: PRs, issues, repos y Actions.                     |
| `jq`              | `sudo apt install jq`                              | Esenciales                  | Filtrar, transformar y analizar JSON en pipelines.                        |
| `curl`            | `sudo apt install curl`                            | Esenciales                  | Transferencia de datos HTTP/FTP y descarga de archivos.                   |
| `wget`            | `sudo apt install wget`                            | Esenciales                  | Descargas recursivas, reanudables y desde espejos.                        |
| `rg` (ripgrep)    | `sudo apt install ripgrep`                         | Esenciales                  | Búsqueda de texto ultrarrápida (sustituto moderno de grep).               |
| `fd`              | `sudo apt install fd-find` (binario `fdfind`)      | Esenciales                  | `find` moderno, rápido y con sintaxis simple.                             |
| `tree`            | `sudo apt install tree`                            | Esenciales                  | Visualizar la jerarquía de directorios.                                   |
| `node`            | `nvm install node`                                 | Productividad de desarrollo | Runtime JavaScript/TypeScript. Base de herramientas modernas.             |
| `npm`             | incluye con node                                   | Productividad de desarrollo | Gestor de paquetes Node.                                                  |
| `pnpm`            | `corepack enable pnpm`                             | Productividad de desarrollo | Gestor de paquetes Node rápido y eficiente.                               |
| `yarn`            | `corepack enable yarn`                             | Productividad de desarrollo | Gestor de paquetes Node (legacy, vía Corepack).                           |
| `uv`              | `curl -LsSf https://astral.sh/uv/install.sh \| sh` | Productividad de desarrollo | Gestor de Python ultrarrápido (pip/venv/pipx alternativo).                |
| `uvx`             | incluye con uv                                     | Productividad de desarrollo | Ejecutar herramientas Python sin instalarlas globalmente.                 |
| `python3`         | `sudo apt install python3`                         | Productividad de desarrollo | Intérprete Python para scripts y automatización.                          |
| `docker`          | `sudo apt install docker.io`                       | Productividad de desarrollo | Construir y ejecutar contenedores.                                        |
| `sqlite3`         | `sudo apt install sqlite3`                         | Productividad de desarrollo | Base de datos embebida para pruebas y herramientas locales.               |
| `shellcheck`      | `sudo apt install shellcheck`                      | Productividad de desarrollo | Detecta errores y malas prácticas en scripts de shell.                    |
| `kubectl`         | binario oficial (dl.k8s.io)                        | Infraestructura y cloud     | Gestionar clústeres Kubernetes.                                           |
| `terraform`       | repos oficiales de HashiCorp                       | Infraestructura y cloud     | Infraestructura como código multi-proveedor.                              |
| `awscli`          | bundle oficial AWS CLI v2                          | Infraestructura y cloud     | Gestionar servicios de AWS.                                               |
| `psql`            | `sudo apt install postgresql-client`               | Infraestructura y cloud     | Cliente de bases PostgreSQL.                                              |
| `redis-tools`     | `sudo apt install redis-tools`                     | Infraestructura y cloud     | `redis-cli` para bases Redis.                                             |
| `yq`              | binario oficial mikefarah (GitHub releases)        | Infraestructura y cloud     | Procesador YAML/TOML (equivalente a jq).                                  |
| `hadolint`        | descarga binaria (GitHub releases)                 | Extras                      | Detecta malas prácticas en Dockerfiles.                                   |
| `universal-ctags` | `sudo apt install universal-ctags`                 | Extras                      | Índices de símbolos para navegar grandes codebases.                       |
| `go`              | `sudo apt install golang-go`                       | Extras                      | Compilar herramientas escritas en Go.                                     |
| `cargo` / `rustc` | `sudo apt install cargo`                           | Extras                      | Compilar herramientas escritas en Rust.                                   |

## Tools human-friendly

Herramientas centradas en interacción, visualización, TUI o ergonomía de terminal.

| Herramienta | Comando                                   | Nivel                       | Descripción                                                 |
| ----------- | ----------------------------------------- | --------------------------- | ----------------------------------------------------------- |
| `fzf`       | `sudo apt install fzf`                    | Esenciales                  | Filtro difuso interactivo (historial, archivos, procesos).  |
| `bat`       | `sudo apt install bat` (binario `batcat`) | Esenciales                  | `cat` con resaltado de sintaxis y paginación.               |
| `zoxide`    | `sudo apt install zoxide`                 | Esenciales                  | `cd` inteligente basado en frecuencia de uso.               |
| `eza`       | `sudo apt install eza`                    | Esenciales                  | `ls` moderno con colores, iconos y árbol integrado.         |
| `btop`      | `sudo apt install btop`                   | Esenciales                  | Monitor de recursos (CPU, memoria, disco, red) en TUI.      |
| `ncdu`      | `sudo apt install ncdu`                   | Esenciales                  | Análisis y liberación de espacio en disco interactivo.      |
| `tldr`      | `sudo apt install tldr`                   | Esenciales                  | Ejemplos de uso concisos de comandos (sin manpages).        |
| `vim`       | `sudo apt install vim`                    | Productividad de desarrollo | Editor de texto en terminal (respaldo).                     |
| `lazygit`   | binario oficial (GitHub releases)         | Productividad de desarrollo | Git en TUI (ramas, stashes, commits). Complementa OpenCode. |
| `delta`     | `sudo apt install git-delta`              | Productividad de desarrollo | Diffs de git legibles con color (pager para `git diff`).    |
| `tig`       | `sudo apt install tig`                    | Productividad de desarrollo | Git en TUI liviano para historial y árbol.                  |
| `tmux`      | `sudo apt install tmux`                   | Productividad de desarrollo | Multiplexor de terminal: sesiones y paneles persistentes.   |
| `neovim`    | `sudo apt install neovim`                 | Productividad de desarrollo | Editor moderno (evolución de vim, con LSP).                 |
| `xh`        | script oficial o `cargo install`          | Productividad de desarrollo | Cliente HTTP amigable (alternativa moderna a curl).         |
| `thefuck`   | `uv tool install thefuck`                 | Productividad de desarrollo | Corrige automáticamente comandos anteriores con errores.    |
| `k9s`       | descarga binaria (GitHub releases)        | Infraestructura y cloud     | Monitorizar y gestionar clústeres Kubernetes en TUI.        |
| `duf`       | `sudo apt install duf`                    | Infraestructura y cloud     | `df` moderno y legible.                                     |
| `cheat`     | binario oficial (GitHub releases)         | Extras                      | Hojas de referencia rápidas para comandos.                  |

---

## Fuera de apt: métodos oficiales verificados

Estas herramientas no existen en los repositorios de Ubuntu 24.04 o el paquete `apt` no corresponde a la herramienta oficial. Métodos verificados contra la documentación oficial (2026-09):

- **`kubectl`** (kubernetes.io/docs/tasks/tools/install-kubectl-linux/): no está en los repos de Ubuntu. Instalar el binario oficial o añadir el repo `pkgs.k8s.io`:

  ```bash
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
  ```

- **`awscli`** (docs.aws.amazon.com/cli): no existe paquete `awscli` en noble y AWS no mantiene repos apt (solo snap). Bundle oficial AWS CLI v2:

  ```bash
  curl -fsSL https://awscli.amazonaws.com/v2/install.sh | bash
  ```

  Instala en `~/.local/bin`; con `| sudo bash -s -- --system` se instala globalmente en `/usr/local/bin`.

- **`yq`** (github.com/mikefarah/yq): `sudo apt install yq` instala el yq de Python v3.1 (proyecto distinto, sintaxis incompatible con la v4 moderna, p. ej. `yq eval` no existe). Instalar el binario oficial v4:

  ```bash
  sudo wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -O /usr/local/bin/yq
  sudo chmod +x /usr/local/bin/yq
  ```

  Alternativas oficiales: `snap install yq`, `brew install yq`, imagen docker `mikefarah/yq`.

- **`lazygit`** (github.com/jesseduffield/lazygit): no está en apt. Binario oficial:

  ```bash
  LAZYGIT_VERSION=$(curl -s https://api.github.com/repos/jesseduffield/lazygit/releases/latest | jq -r .tag_name | cut -c2-)
  curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
  tar xf lazygit.tar.gz lazygit
  sudo install lazygit /usr/local/bin/
  ```

- **`xh`** (github.com/ducaale/xh): el paquete apt solo existe desde Ubuntu 25.04 / Debian 13; en 24.04 no hay candidato. Script oficial (evita `cargo install`, que requiere Rust >= 1.85 y el `cargo` de noble es 1.75):

  ```bash
  curl -sfL https://raw.githubusercontent.com/ducaale/xh/master/install.sh | sh
  ```

- **`cheat`** (github.com/cheat/cheat): no está en apt y `go install` requiere Go >= 1.26 (el de noble es 1.22). Binario oficial:

  ```bash
  cd /tmp
  curl -LO https://github.com/cheat/cheat/releases/latest/download/cheat-linux-amd64.gz
  gunzip -f cheat-linux-amd64.gz
  sudo install -m 755 cheat-linux-amd64 /usr/local/bin/cheat
  ```

---

## Resumen de instalación recomendada

Prioridad 1 (esenciales, un solo comando):

```bash
sudo apt install ripgrep fzf bat fd-find zoxide eza tree btop ncdu tldr
```

Prioridad 2 (productividad):

```bash
sudo apt install git-delta tig tmux neovim shellcheck
```

`lazygit` y `xh` no están en apt en Ubuntu 24.04; usa sus métodos oficiales de la sección anterior.

Prioridad 3 (infra, según necesidades):

```bash
sudo apt install duf postgresql-client redis-tools
```

`kubectl`, `awscli` y `yq` no están en apt (o el paquete no corresponde); usa sus métodos oficiales de la sección anterior.

Prioridad 4 (herramientas de usuario, sin sudo):

```bash
uv tool install thefuck
```
