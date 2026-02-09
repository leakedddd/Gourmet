# Guia de Instalacion y Configuracion - Gourmet

## Prerequisitos

Antes de instalar el proyecto, asegurese de contar con el siguiente software instalado:

| Software | Version requerida | Enlace de descarga |
|---|---|---|
| Java JDK | 21 o superior | https://www.oracle.com/java/technologies/downloads/#java21 |
| Apache Maven | 3.9 o superior | https://maven.apache.org/download.cgi |
| MySQL Server | 8.0 o superior | https://dev.mysql.com/downloads/mysql/ |
| Git | Cualquier version reciente | https://git-scm.com/downloads |
| IDE recomendado | IntelliJ IDEA / VS Code | https://www.jetbrains.com/idea/download/ |

---

## Paso 1: Clonar el repositorio

```bash
git clone https://github.com/leakedddd/Gourmet.git
cd Gourmet
```

---

## Paso 2: Crear la base de datos

Abrir MySQL desde la terminal o desde un cliente como MySQL Workbench y ejecutar:

```sql
CREATE DATABASE GourmetDB;
```

> **Nota:** No es necesario crear las tablas manualmente. Spring Data JPA se encargara de generarlas automaticamente al iniciar la aplicacion.

---

## Paso 3: Configurar la conexion a la base de datos

Abrir el archivo `src/main/resources/application.properties` y verificar que los datos de conexion coincidan con su entorno:

```properties
spring.application.name=appspringsecurity
spring.datasource.url=jdbc:mysql://localhost:3306/GourmetDB?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=mysql
```

Si su usuario o contrasena de MySQL es diferente, modifique las lineas `spring.datasource.username` y `spring.datasource.password` segun corresponda.

---

## Paso 4: Compilar el proyecto

Desde la raiz del proyecto, ejecutar:

```bash
mvn clean install
```

Esto descargara todas las dependencias y compilara el proyecto. Espere a que el proceso finalice sin errores.

---

## Paso 5: Ejecutar la aplicacion

```bash
mvn spring-boot:run
```

Al ejecutar, debera ver en la consola un mensaje similar a:

```
Started GourmetApplication in X.XX seconds
```

---

## Paso 6: Acceder al sistema

Abrir un navegador web e ingresar a:

```
http://localhost:8080
```

Desde ahi podra acceder a la pagina principal del restaurante Gourmet.

---

## Paso 7: Crear el primer usuario

1. Ir a `/register` para crear una cuenta de cliente.
2. Para crear un usuario administrador o empleado, debera insertarlo manualmente en la base de datos la primera vez:

```sql
INSERT INTO usuario (nombres, correo, telefono, clave, rol, activo)
VALUES ('Admin Gourmet', 'admin@gourmet.pe', '999999999',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'ADMIN', true);
```

> **Nota:** La clave cifrada del ejemplo corresponde a la contrasena `admin` en BCrypt. Se recomienda cambiarla despues del primer inicio de sesion.

---

## Estructura de dependencias del proyecto

| Dependencia | Funcion |
|---|---|
| spring-boot-starter-data-jpa | ORM para acceso a base de datos con JPA/Hibernate |
| spring-boot-starter-security | Autenticacion y autorizacion con Spring Security |
| spring-boot-starter-thymeleaf | Motor de plantillas para las vistas HTML |
| spring-boot-starter-webmvc | Framework web MVC |
| spring-boot-starter-validation | Validaciones de formularios con anotaciones |
| thymeleaf-extras-springsecurity6 | Integracion de Thymeleaf con Spring Security |
| mysql-connector-j | Driver JDBC para MySQL |
| spring-boot-devtools | Recarga automatica en desarrollo |

---

## Posibles errores comunes

| Error | Causa | Solucion |
|---|---|---|
| `Communications link failure` | MySQL no esta ejecutandose | Iniciar el servicio de MySQL |
| `Access denied for user 'root'` | Credenciales incorrectas | Verificar usuario y contrasena en `application.properties` |
| `Unknown database 'GourmetDB'` | La base de datos no existe | Ejecutar `CREATE DATABASE GourmetDB;` en MySQL |
| `Port 8080 already in use` | Otro proceso usa el puerto | Cerrar el proceso o cambiar el puerto en `application.properties` agregando `server.port=8081` |
