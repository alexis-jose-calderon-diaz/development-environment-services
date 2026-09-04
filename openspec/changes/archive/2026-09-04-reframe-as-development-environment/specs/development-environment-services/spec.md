## Purpose

Proporciona servicios Docker comunes y persistentes para desarrollo local, independientes de cualquier proyecto consumidor y operables mediante Docker Compose.

## ADDED Requirements

### Requirement: Servicios base independientes de proyectos

El ambiente SHALL proporcionar PostgreSQL y pgAdmin como servicios base iniciables sin codigo fuente, configuracion ni migraciones de una aplicacion consumidora.

#### Scenario: Inicio del nucleo sin proyecto consumidor

- **WHEN** el usuario inicia el ambiente con Docker Compose y los prerequisitos documentados
- **THEN** PostgreSQL y pgAdmin se inician como servicios disponibles sin requerir identificadores ni archivos de ningun proyecto de aplicacion

#### Scenario: Reinicio del nucleo

- **WHEN** el usuario detiene y vuelve a iniciar el ambiente
- **THEN** ambos servicios recuperan su estado operativo sin recrear innecesariamente los datos persistidos

### Requirement: Acceso local estable a los servicios base

El ambiente SHALL ofrecer PostgreSQL en `127.0.0.1:5432` y pgAdmin mediante un endpoint local estable y documentado, sin depender del perfil de acceso remoto.

#### Scenario: Conexion local a PostgreSQL

- **WHEN** un cliente de desarrollo se conecta desde la maquina anfitriona al puerto local documentado
- **THEN** puede establecer una conexion con PostgreSQL mientras el servicio esta saludable

#### Scenario: Acceso local a pgAdmin sin Tailscale

- **WHEN** el usuario inicia solo el nucleo y abre el endpoint local documentado de pgAdmin
- **THEN** puede acceder a la interfaz administrativa sin activar Tailscale

### Requirement: Conectividad mediante la red externa compartida

El ambiente SHALL utilizar una red Docker externa llamada `shared` para permitir que proyectos y servicios independientes se conecten al nucleo mediante nombres y puertos estables.

#### Scenario: Consumidor conectado a `shared`

- **WHEN** un contenedor consumidor se conecta a la red externa `shared`
- **THEN** puede resolver y conectarse al servicio PostgreSQL del ambiente sin que el repositorio necesite conocer el nombre o la estructura del proyecto consumidor

#### Scenario: Red externa ausente

- **WHEN** el usuario intenta iniciar el ambiente sin que exista la red externa `shared`
- **THEN** la operacion se detiene con una indicacion clara del prerequisito faltante y no crea silenciosamente una red alternativa

### Requirement: Autenticacion de confianza para desarrollo local

El ambiente SHALL permitir autenticacion `trust` para conexiones de desarrollo realizadas desde la maquina anfitriona o desde contenedores confiables conectados a `shared`, y SHALL advertir que esta politica no es apropiada para redes no confiables ni produccion.

#### Scenario: Conexion sin contrasena desde un consumidor confiable

- **WHEN** un cliente conectado a `shared` usa las credenciales de desarrollo documentadas sin proporcionar una contrasena de PostgreSQL
- **THEN** PostgreSQL acepta la conexion conforme a la politica `trust`

#### Scenario: Advertencia de seguridad

- **WHEN** el usuario consulta la documentacion del ambiente
- **THEN** encuentra la relacion entre `trust`, la confianza requerida en `shared` y la prohibicion de reutilizar esta configuracion en produccion

### Requirement: Perfiles opcionales de servicios auxiliares

El ambiente SHALL permitir iniciar el nucleo sin credenciales ni dependencias de perfiles opcionales, y SHALL ofrecer Tailscale como perfil opcional para publicar de forma remota el acceso administrativo a pgAdmin.

#### Scenario: Inicio sin perfil opcional

- **WHEN** el usuario inicia el ambiente sin seleccionar un perfil auxiliar
- **THEN** PostgreSQL y pgAdmin quedan disponibles y la ausencia de credenciales de Tailscale no impide iniciar el nucleo

#### Scenario: Acceso remoto con Tailscale

- **WHEN** el usuario activa el perfil Tailscale con sus credenciales validas
- **THEN** el ambiente publica el acceso remoto HTTPS a pgAdmin sin cambiar los endpoints locales ni exigir configuracion de un proyecto consumidor

### Requirement: Operacion documentada y agnostica del proyecto

La documentacion SHALL definir los prerequisitos minimos de Docker Compose, la preparacion de `shared`, las variables necesarias, el inicio y detencion del nucleo, la activacion de perfiles y los endpoints disponibles, sin convertir la instalacion de herramientas del host en una responsabilidad del repositorio.

#### Scenario: Operacion desde una copia limpia

- **WHEN** un usuario con Docker Compose disponible sigue la documentacion desde una copia limpia del repositorio
- **THEN** puede preparar la red requerida, iniciar el nucleo, comprobar su estado y conocer como conectarse sin consultar instrucciones especificas de una aplicacion

#### Scenario: Proyecto consumidor nuevo

- **WHEN** un nuevo proyecto necesita PostgreSQL o pgAdmin
- **THEN** puede conectarse al ambiente comun mediante la red y endpoints documentados sin agregar archivos del proyecto al repositorio del ambiente
