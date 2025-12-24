// ========== ADMIN PERSONAL - FUNCIONALIDAD ==========

// === ANIMACIÓN DE CARGA ===
document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');
    });
});

// === BÚSQUEDA ===
function limpiarBusqueda() {
    window.location.href = '/admin/personal';
}

// Prevenir envío de búsqueda vacía
const searchForm = document.querySelector('.search-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        const busqueda = searchForm.querySelector('input[name="busqueda"]').value.trim();
        if (!busqueda) {
            e.preventDefault();
            window.location.href = '/admin/personal';
        }
    });
}

// Limpiar búsqueda con tecla Escape
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            limpiarBusqueda();
        }
    });
}

// === MODAL CREAR EMPLEADO ===
function abrirModalCrear() {
    const modal = document.getElementById('modalCrear');
    modal.style.display = 'flex';

    setTimeout(() => modal.classList.add('show'), 10);

    // Focus en el primer input
    setTimeout(() => {
        const firstInput = modal.querySelector('input[type="text"]');
        if (firstInput) firstInput.focus();
    }, 300);

    // Cerrar con ESC
    document.addEventListener('keydown', cerrarCrearConEscape);
}

function cerrarModalCrear() {
    const modal = document.getElementById('modalCrear');
    modal.classList.remove('show');

    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);

    document.removeEventListener('keydown', cerrarCrearConEscape);
}

function cerrarCrearConEscape(e) {
    if (e.key === 'Escape') {
        cerrarModalCrear();
    }
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    const modalCrear = document.getElementById('modalCrear');
    if (modalCrear && modalCrear.style.display === 'flex' && e.target === modalCrear) {
        cerrarModalCrear();
    }
});

// === MODAL CAMBIAR ROL ===
function abrirModalCambiarRol(btn) {
    const id = btn.dataset.id;
    const rolActual = btn.dataset.rol;
    const nombre = btn.dataset.nombre;

    const modal = document.getElementById('modalCambiarRol');
    const form = document.getElementById('formCambiarRol');
    const selectRol = document.getElementById('nuevoRol');
    const nombreDisplay = document.getElementById('nombreEmpleado');

    // Configurar formulario
    form.action = `/admin/personal/${id}/rol`;
    selectRol.value = rolActual;
    nombreDisplay.textContent = nombre;

    // Mostrar modal
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);

    // Cerrar con ESC
    document.addEventListener('keydown', cerrarRolConEscape);
}

function cerrarModalCambiarRol() {
    const modal = document.getElementById('modalCambiarRol');
    modal.classList.remove('show');

    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);

    document.removeEventListener('keydown', cerrarRolConEscape);
}

function cerrarRolConEscape(e) {
    if (e.key === 'Escape') {
        cerrarModalCambiarRol();
    }
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    const modalRol = document.getElementById('modalCambiarRol');
    if (modalRol && modalRol.style.display === 'flex' && e.target === modalRol) {
        cerrarModalCambiarRol();
    }
});

// === MODAL CAMBIAR ESTADO (ACTIVAR/DESACTIVAR) ===
function abrirModalEstado(btn) {
    const id = btn.dataset.id;
    const nombre = btn.dataset.nombre;
    const activo = btn.dataset.activo === 'true';

    const modal = document.getElementById('modalEstado');
    const form = document.getElementById('formEstado');
    const inputActivo = document.getElementById('estadoActivo');
    const titulo = document.getElementById('tituloEstado');
    const nombreDisplay = document.getElementById('nombreEmpleadoEstado');
    const mensaje = document.getElementById('mensajeEstado');
    const btnConfirmar = document.getElementById('btnConfirmarEstado');
    const icono = document.getElementById('iconoEstado');
    const infoBox = document.getElementById('infoEstado');

    // Configurar formulario
    form.action = `/admin/personal/${id}/estado`;
    inputActivo.value = !activo; // Toggle: si está activo, se desactiva y viceversa
    nombreDisplay.textContent = nombre;

    // Cambiar contenido según la acción
    if (activo) {
        // Desactivar
        titulo.textContent = 'Desactivar Cuenta';
        mensaje.textContent = 'Al desactivar esta cuenta, el empleado no podrá iniciar sesión hasta que sea reactivado.';
        btnConfirmar.innerHTML = '<i class="bi bi-x-circle"></i> Desactivar';
        btnConfirmar.className = 'btn-danger';
        icono.className = 'modal-icon danger';
        icono.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i>';
        infoBox.className = 'info-box danger';
        infoBox.querySelector('i').className = 'bi bi-exclamation-triangle-fill';
    } else {
        // Activar
        titulo.textContent = 'Activar Cuenta';
        mensaje.textContent = 'Al activar esta cuenta, el empleado podrá iniciar sesión nuevamente en el sistema.';
        btnConfirmar.innerHTML = '<i class="bi bi-check-circle"></i> Activar';
        btnConfirmar.className = 'btn-primary';
        icono.className = 'modal-icon';
        icono.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        infoBox.className = 'info-box';
        infoBox.querySelector('i').className = 'bi bi-info-circle';
    }

    // Mostrar modal
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);

    // Cerrar con ESC
    document.addEventListener('keydown', cerrarEstadoConEscape);
}

function cerrarModalEstado() {
    const modal = document.getElementById('modalEstado');
    modal.classList.remove('show');

    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);

    document.removeEventListener('keydown', cerrarEstadoConEscape);
}

function cerrarEstadoConEscape(e) {
    if (e.key === 'Escape') {
        cerrarModalEstado();
    }
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    const modalEstado = document.getElementById('modalEstado');
    if (modalEstado && modalEstado.style.display === 'flex' && e.target === modalEstado) {
        cerrarModalEstado();
    }
});

// === VALIDACIÓN DE FORMULARIOS ===
const formCrear = document.getElementById('formCrear');
if (formCrear) {
    formCrear.addEventListener('submit', (e) => {
        const submitBtn = formCrear.querySelector('button[type="submit"]');

        // Deshabilitar botón y cambiar texto
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Creando...';
        submitBtn.style.opacity = '0.7';
    });
}

const formCambiarRol = document.getElementById('formCambiarRol');
if (formCambiarRol) {
    formCambiarRol.addEventListener('submit', (e) => {
        const submitBtn = formCambiarRol.querySelector('button[type="submit"]');

        // Deshabilitar botón y cambiar texto
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Guardando...';
        submitBtn.style.opacity = '0.7';
    });
}

// === VALIDACIÓN EN TIEMPO REAL ===
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.validity.valid) {
            this.style.borderColor = '#10b981';
        } else {
            this.style.borderColor = '#e5e7eb';
        }
    });

    input.addEventListener('blur', function() {
        if (this.value && !this.validity.valid) {
            this.style.borderColor = '#ef4444';
        }
    });
});

// === ANIMACIONES DE ENTRADA ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos animables
document.querySelectorAll('.usuarios-table tbody tr').forEach(row => {
    row.style.opacity = '0';
    row.style.transform = 'translateY(20px)';
    row.style.transition = 'all 0.5s ease-out';
    observer.observe(row);
});

// === AUTO-CERRAR ALERTAS ===
const alerts = document.querySelectorAll('.alert');
alerts.forEach(alert => {
    setTimeout(() => {
        alert.style.transition = 'all 0.5s ease';
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(100%)';

        setTimeout(() => {
            alert.remove();
        }, 500);
    }, 5000); // Se cierran después de 5 segundos
});

// === CONFIRMACIÓN DE CAMBIO DE ROL ===
document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', function() {
        // Efecto visual al hacer click
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// === TOOLTIP PARA BADGES ===
document.querySelectorAll('.badge').forEach(badge => {
    badge.title = badge.classList.contains('badge-admin')
        ? 'Acceso completo al sistema'
        : 'Acceso limitado al backoffice';
});