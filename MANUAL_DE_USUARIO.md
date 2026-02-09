# Manual de Usuario - Gourmet

## 1. Acceso al sistema

### 1.1. Pagina principal
Al ingresar a la direccion del sistema, se muestra la pagina de inicio del restaurante Gourmet con informacion general y el horario de atencion (1:00 PM - 10:00 PM).

*[Captura de pantalla: Pagina principal - home]*

---

### 1.2. Registro de cuenta (Cliente)
**Ruta:** `/register`

Para crear una cuenta como cliente:
1. Hacer clic en "Registrarse" desde la barra de navegacion.
2. Completar los campos:
   - **Nombres** (obligatorio)
   - **Correo electronico** (obligatorio, debe ser unico)
   - **Telefono** (obligatorio)
   - **Contrasena** (obligatorio, minimo 4 caracteres)
   - **Confirmar contrasena** (debe coincidir con la contrasena)
3. Hacer clic en "Registrarse".
4. Si los datos son correctos, se redirige al inicio de sesion.

*[Captura de pantalla: Formulario de registro]*

---

### 1.3. Inicio de sesion
**Ruta:** `/login`

1. Ingresar el **correo electronico** registrado.
2. Ingresar la **contrasena**.
3. Hacer clic en "Iniciar sesion".
4. El sistema redirige segun el rol:
   - **CLIENTE** → Pagina principal
   - **EMPLEADO** → Panel de administracion de reservas
   - **ADMIN** → Panel de administracion de reservas

*[Captura de pantalla: Formulario de inicio de sesion]*

---

## 2. Modulo del Cliente

### 2.1. Crear una reserva
**Ruta:** `/reservar`

1. Hacer clic en "Reservar" desde la barra de navegacion.
2. Seleccionar una **fecha** en el calendario:
   - Solo se permiten fechas desde hoy hasta 3 meses a futuro.
   - Los dias pasados aparecen deshabilitados.
3. Seleccionar una **hora** de las franjas disponibles.
   - Si la reserva es para el mismo dia, solo se muestran horarios con al menos 3 horas de anticipacion.
   - Despues de las 6:30 PM no se puede reservar para el mismo dia.
4. Seleccionar la **cantidad de personas** (1 a 8).
5. Opcionalmente, escribir **observaciones** (maximo 500 caracteres).
6. Hacer clic en "Confirmar reserva".
7. Se muestra una pantalla de confirmacion con los datos de la reserva.

*[Captura de pantalla: Formulario de reserva - seleccion de fecha]*
*[Captura de pantalla: Formulario de reserva - seleccion de hora y personas]*
*[Captura de pantalla: Confirmacion de reserva exitosa]*

---

### 2.2. Ver mis reservas
**Ruta:** `/mis-reservas`

1. Hacer clic en "Mis Reservas" desde la barra de navegacion.
2. Se muestra el listado de todas las reservas del usuario, ordenadas por fecha.
3. Cada reserva muestra: fecha, hora, cantidad de personas, observaciones y estado (ACTIVA, ATENDIDA o CANCELADA).

*[Captura de pantalla: Listado de mis reservas]*

---

### 2.3. Cancelar una reserva
**Desde:** `/mis-reservas`

1. Ubicar la reserva con estado **ACTIVA** que desea cancelar.
2. Hacer clic en el boton "Cancelar".
3. Confirmar la accion.
4. El estado de la reserva cambia a **CANCELADA**.

> Nota: Solo se pueden cancelar reservas en estado ACTIVA.

*[Captura de pantalla: Boton de cancelar reserva]*

---

### 2.4. Reprogramar una reserva
**Ruta:** `/reserva/{id}/reprogramar`

1. Ubicar la reserva con estado **ACTIVA** que desea reprogramar.
2. Hacer clic en el boton "Reprogramar".
3. Seleccionar una **nueva fecha** (minimo desde manana, maximo 3 meses).
4. Seleccionar una **nueva hora**.
5. Opcionalmente, modificar las **observaciones**.
6. Hacer clic en "Confirmar reprogramacion".

> Nota: No se puede reprogramar para el mismo dia.

*[Captura de pantalla: Formulario de reprogramacion]*

---

### 2.5. Calificar una reserva
**Desde:** `/mis-reservas`

1. Ubicar la reserva con estado **ATENDIDA** que desea calificar.
2. Hacer clic en el boton "Calificar".
3. Se abre un modal con:
   - **Estrellas** (1 a 5): hacer clic en la estrella deseada (obligatorio).
   - **Comentario** (opcional, maximo 500 caracteres): escribir su opinion.
4. Hacer clic en "Enviar calificacion".

> Nota: Solo se puede calificar una vez por reserva.

*[Captura de pantalla: Modal de calificacion con estrellas]*

---

## 3. Modulo del Empleado

### 3.1. Panel de administracion de reservas
**Ruta:** `/admin/reservas`

1. Al iniciar sesion como EMPLEADO, se accede al panel de reservas.
2. Se muestra el listado de **todas las reservas** del sistema con paginacion (10 por pagina).
3. Funcionalidades disponibles:
   - **Filtrar por estado:** Seleccionar ACTIVA, ATENDIDA o CANCELADA en el filtro superior.
   - **Buscar por ID:** Ingresar el numero de reserva en el campo de busqueda.
   - **Marcar como atendida:** Hacer clic en "Atender" en una reserva ACTIVA.
   - **Cancelar reserva:** Hacer clic en "Cancelar" en una reserva ACTIVA.

*[Captura de pantalla: Panel de administracion de reservas]*
*[Captura de pantalla: Filtro por estado]*

---

## 4. Modulo del Administrador

### 4.1. Gestion de reservas
El administrador tiene acceso a las mismas funcionalidades del empleado descritas en la seccion 3.1.

---

### 4.2. Gestion de personal
**Ruta:** `/admin/personal`

1. Hacer clic en "Personal" desde la barra de navegacion (solo visible para ADMIN).
2. Se muestra el listado de empleados con paginacion (10 por pagina).

**Crear nuevo empleado:**
1. Hacer clic en "Nuevo empleado".
2. Completar los campos:
   - **Nombres** (obligatorio)
   - **Correo electronico** (obligatorio, debe ser unico)
   - **Telefono** (opcional)
   - **Contrasena** (obligatorio)
   - **Rol** (EMPLEADO o ADMIN)
3. Hacer clic en "Crear".

**Cambiar rol de un empleado:**
1. Ubicar al empleado en el listado.
2. Hacer clic en "Cambiar rol".
3. Confirmar la accion en el modal de confirmacion.
4. El rol cambia de EMPLEADO a ADMIN o viceversa.

**Activar/desactivar cuenta:**
1. Ubicar al empleado en el listado.
2. Hacer clic en "Activar" o "Desactivar" segun corresponda.
3. Confirmar la accion.
4. Un empleado desactivado no podra iniciar sesion.

**Buscar empleado:**
1. Escribir el nombre en el campo de busqueda.
2. Se filtra el listado automaticamente.

*[Captura de pantalla: Panel de gestion de personal]*
*[Captura de pantalla: Formulario de nuevo empleado]*
*[Captura de pantalla: Modal de cambio de rol]*

---

## 5. Cerrar sesion

1. Hacer clic en "Cerrar sesion" desde la barra de navegacion.
2. El sistema cierra la sesion y redirige a la pagina de inicio.

*[Captura de pantalla: Boton de cerrar sesion en navbar]*
