# Alcance del Proyecto - Gourmet

## Descripcion General

**Gourmet** es un sistema web de reservas para restaurante desarrollado con Spring Boot 4.0.0 (Java 21), MySQL y Thymeleaf. Permite a los clientes realizar y gestionar reservas, calificar experiencias, y al personal administrativo gestionar reservas y empleados.

**Stack tecnologico:** Spring Boot 4.0.0 | Spring Security | Spring Data JPA | Thymeleaf | MySQL | BCrypt | Maven

---

## Cuadro Comparativo: Funcionalidades del Cliente vs Administrador/Empleado

| Aspecto | Cliente (CLIENTE) | Empleado (EMPLEADO) | Administrador (ADMIN) |
|---|---|---|---|
| **Registro** | Se registra por cuenta propia desde `/register` | Creado por un ADMIN desde el panel `/admin/personal` | Creado por otro ADMIN desde el panel `/admin/personal` |
| **Inicio de sesion** | Con correo y clave | Con correo y clave | Con correo y clave |
| **Crear reservas** | Si | No | No |
| **Ver sus reservas** | Si (solo las propias) | No aplica | No aplica |
| **Cancelar reservas** | Solo las propias y en estado ACTIVA | Puede cancelar cualquier reserva ACTIVA | Puede cancelar cualquier reserva ACTIVA |
| **Reprogramar reservas** | Solo las propias y en estado ACTIVA | No | No |
| **Calificar reservas** | Solo las propias en estado ATENDIDA | No | No |
| **Ver todas las reservas** | No | Si (con filtros y paginacion) | Si (con filtros y paginacion) |
| **Marcar reserva como atendida** | No | Si | Si |
| **Gestionar empleados** | No | No | Si (crear, cambiar rol, activar/desactivar) |
| **Acceso a `/reservar/**`** | Si | No | No |
| **Acceso a `/mis-reservas/**`** | Si | No | No |
| **Acceso a `/admin/reservas`** | No | Si | Si |
| **Acceso a `/admin/personal`** | No | No | Si |

---

## Restricciones del Modulo de Autenticacion y Cuentas

### Registro de Cliente

| Restriccion | Detalle | Validacion |
|---|---|---|
| Nombre obligatorio | Campo `nombres` no puede estar vacio | Backend (`@NotBlank`) + Frontend (`required`) |
| Correo obligatorio y valido | Debe tener formato de email valido | Backend (`@Email`, `@NotBlank`) + Frontend (`type="email"`) |
| Correo unico | No puede existir otro usuario con el mismo correo | Backend (`existsByCorreo()`) |
| Telefono obligatorio | Campo `telefono` no puede estar vacio | Backend (`@NotBlank`) + Frontend (`required`) |
| Clave minimo 4 caracteres | La contrasena debe tener al menos 4 caracteres | Backend (`@Size(min = 4)`) |
| Confirmacion de clave | La clave y la confirmacion deben coincidir | Backend (comparacion en `UsuarioService`) |
| Rol asignado automaticamente | Todo registro publico se crea como `CLIENTE` | Backend (asignacion automatica) |
| Cuenta activa por defecto | La cuenta se crea habilitada (`activo = true`) | Backend (valor por defecto) |
| Contrasena cifrada | Se almacena con BCrypt, nunca en texto plano | Backend (`BCryptPasswordEncoder`) |

### Registro de Empleado (por Admin)

| Restriccion | Detalle | Validacion |
|---|---|---|
| Nombre obligatorio | Campo `nombres` no puede estar vacio | Backend (`@NotBlank`) |
| Correo obligatorio y valido | Debe tener formato de email valido | Backend (`@Email`, `@NotBlank`) |
| Correo unico | No puede existir otro usuario con el mismo correo | Backend (`existsByCorreo()`) |
| Clave obligatoria | Campo `clave` no puede estar vacio | Backend (`@NotBlank`) |
| Rol obligatorio | Debe ser `EMPLEADO` o `ADMIN` | Backend (`@NotBlank` + `RolUsuario.valueOf()`) |
| Telefono opcional | No tiene validacion requerida | Sin validacion |
| Solo ADMIN puede crear | Requiere rol ADMIN para acceder al endpoint | Backend (`@PreAuthorize("hasRole('ADMIN')")`) |

### Inicio de Sesion

| Restriccion | Detalle | Validacion |
|---|---|---|
| Autenticacion por correo | El campo de usuario es el correo electronico | Configuracion de Spring Security (`correo`) |
| Cuenta debe estar activa | Cuentas desactivadas no pueden iniciar sesion | Backend (`isEnabled()` en `GourmetUserDetails`) |
| Error generico | Mensaje: "Correo o clave incorrectos" (no revela si el correo existe) | Frontend (mensaje generico) |
| Proteccion CSRF | Todas las peticiones POST incluyen token CSRF | Spring Security (automatico) |
| Sin limite de intentos | No hay proteccion contra fuerza bruta | **No implementado** |

---

## Restricciones del Modulo de Reservas

### Crear Reserva (Cliente)

| Restriccion | Detalle | Validacion |
|---|---|---|
| Fecha obligatoria | Debe seleccionar una fecha | Backend (`@NotNull`) + Frontend (validacion JS) |
| Fecha no pasada | Solo se puede reservar desde hoy en adelante | Backend (`@FutureOrPresent` + validacion manual) |
| Fecha maxima 3 meses | No se puede reservar mas alla de 3 meses a futuro | Backend (`hoy.plusMonths(3)`) + Frontend (calendario deshabilitado) |
| Hora obligatoria | Debe seleccionar una hora de las disponibles | Backend (`@NotNull`) + Frontend (validacion JS) |
| Horarios fijos disponibles | 21 franjas predefinidas: 13:00-15:30, 16:00-16:30, 19:00-20:30, 21:30 | Backend (`HORARIOS_VALIDOS`) + Frontend (opciones fijas en HTML) |
| Corte mismo dia 18:30 | Despues de las 6:30 PM no se puede reservar para el mismo dia | Backend (validacion en `ReservaService`) |
| Anticipacion minima 3 horas | Para reservas del mismo dia, se requieren al menos 3 horas de anticipacion | Backend (`ahora.plusHours(3)`) |
| Cantidad de personas obligatoria | Debe indicar el numero de comensales | Backend (`@NotNull`, `@Min(1)`) |
| Minimo 1 persona | No se permite reservar para 0 personas | Backend (`@Min(value = 1)`) |
| Maximo 8 personas | No se permite reservar para mas de 8 personas | Backend (`@Max(value = 8)`) + Frontend (botones fijos) |
| Observaciones hasta 500 caracteres | Campo opcional con limite de texto | Frontend (truncado JS) + Base de datos (`length = 500`) |
| Estado inicial ACTIVA | Toda reserva nueva se crea como ACTIVA | Backend (valor por defecto) |
| Sin verificacion de disponibilidad | No se valida si ya existen reservas en el mismo horario | **No implementado** |

### Cancelar Reserva (Cliente)

| Restriccion | Detalle | Validacion |
|---|---|---|
| Solo reservas propias | El usuario solo puede cancelar sus propias reservas | Backend (comparacion de `idUsuario`) |
| Solo estado ACTIVA | No se pueden cancelar reservas ATENDIDA o CANCELADA | Backend (validacion de estado) |
| Sin plazo limite | No hay restriccion de tiempo minimo antes de la reserva para cancelar | **No implementado** |

### Reprogramar Reserva (Cliente)

| Restriccion | Detalle | Validacion |
|---|---|---|
| Solo reservas propias | El usuario solo puede reprogramar sus propias reservas | Backend (comparacion de `idUsuario`) + Controller (redirect) |
| Solo estado ACTIVA | No se pueden reprogramar reservas ATENDIDA o CANCELADA | Backend (validacion de estado) |
| Fecha minima: manana | No se puede reprogramar para el mismo dia | Backend (`hoy.plusDays(1)`) + (`@Future`) |
| Fecha maxima: 3 meses | Misma ventana que reserva nueva | Backend (`hoy.plusMonths(3)`) |
| Hora obligatoria y valida | Debe seleccionar una hora de las 21 franjas permitidas | Backend (`@NotNull` + `HORARIOS_VALIDOS`) |
| Observaciones hasta 500 caracteres | Campo opcional con limite | Frontend (truncado JS) |

### Gestionar Reservas (Empleado/Admin)

| Restriccion | Detalle | Validacion |
|---|---|---|
| Acceso restringido | Solo roles EMPLEADO y ADMIN | Backend (`@PreAuthorize("hasAnyRole('EMPLEADO','ADMIN')")`) |
| Marcar como atendida | Solo reservas en estado ACTIVA | Backend (validacion de estado) |
| Cancelar | Solo reservas en estado ACTIVA | Backend (validacion de estado) |
| Filtro por estado | Puede filtrar: ACTIVA, ATENDIDA, CANCELADA | Backend (query por estado) |
| Busqueda por ID | Busca reserva por su numero identificador | Backend (query por ID) |
| Paginacion | 10 reservas por pagina | Backend (`PageRequest.of(page, 10)`) |

---

## Restricciones del Modulo de Opiniones/Calificaciones

| Restriccion | Detalle | Validacion |
|---|---|---|
| Solo reservas propias | El usuario solo puede calificar sus propias reservas | Backend (comparacion de `idUsuario`) |
| Solo estado ATENDIDA | No se pueden calificar reservas ACTIVA o CANCELADA | Backend (validacion de estado) |
| Una opinion por reserva | No se puede calificar la misma reserva dos veces | Backend (`existsByReserva_IdReserva()`) + BD (constraint `UNIQUE` en `id_reserva`) |
| Calificacion 1-5 estrellas | Debe seleccionar entre 1 y 5 estrellas | Frontend (selector visual) |
| Calificacion obligatoria | No se puede enviar sin seleccionar estrellas | Frontend (validacion JS con animacion) |
| Comentario opcional | Puede o no incluir texto adicional | Campo nullable en BD |
| Comentario hasta 500 caracteres | Limite maximo con contador en tiempo real | Frontend (contador JS) + BD (`length = 500`) |

---

## Restricciones del Modulo de Gestion de Personal (Solo ADMIN)

| Restriccion | Detalle | Validacion |
|---|---|---|
| Acceso exclusivo ADMIN | Solo el rol ADMIN puede acceder | Backend (`@PreAuthorize("hasRole('ADMIN')")`) |
| Crear empleados | Requiere nombre, correo valido, clave y rol | Backend (validaciones DTO) |
| Correo unico | No puede repetirse al crear empleado | Backend (`existsByCorreo()`) |
| Cambio de rol inmediato | Al cambiar rol (EMPLEADO <-> ADMIN), el efecto es inmediato | Backend (update directo) |
| Activar/desactivar cuenta | Al desactivar, el empleado no puede iniciar sesion | Backend (campo `activo`) |
| Confirmacion requerida | Cambios de rol y estado requieren confirmacion via modal | Frontend (modales de confirmacion) |
| Paginacion | 10 empleados por pagina, ordenados por nombre ascendente | Backend (`PageRequest.of(page, size, Sort.by("nombres").ascending())`) |
| Busqueda por nombre | Busqueda con texto libre, se ignora si esta vacio | Backend + Frontend (validacion de campo vacio) |

---

## Restricciones de Seguridad General

| Restriccion | Detalle |
|---|---|
| Contrasenas cifradas con BCrypt | Nunca se almacenan en texto plano |
| Proteccion CSRF en todos los formularios | Token automatico de Spring Security |
| Rutas protegidas por rol | Configuracion centralizada en `SecurityConfig.java` |
| Sesion gestionada por Spring Security | Cookie de sesion, destruida al cerrar sesion |
| Navegacion condicionada por rol | El navbar muestra opciones segun el rol del usuario autenticado |

---

## Lo que el proyecto NO abarca (Fuera del alcance)

| Funcionalidad | Estado |
|---|---|
| Gestion de mesas o capacidad del restaurante | No implementado |
| Verificacion de disponibilidad por horario | No implementado |
| Prevencion de reservas duplicadas en el mismo horario | No implementado |
| Limite de intentos de inicio de sesion (anti fuerza bruta) | No implementado |
| Recuperacion de contrasena | No implementado |
| Notificaciones por correo electronico | No implementado |
| Pasarela de pagos o depositos | No implementado |
| Menu o carta del restaurante | No implementado |
| API REST para consumo externo | No implementado (es server-side rendering con Thymeleaf) |
| Aplicacion movil | No implementado |
| Reportes o estadisticas de reservas | No implementado |
| Historial de cambios o auditoria | No implementado |
| Gestion de multiples sucursales | No implementado |
| Politica de cancelacion con penalidad | No implementado |
| Fechas de cierre o dias feriados | No implementado |
