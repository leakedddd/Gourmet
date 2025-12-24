// ========== ADMIN RESERVAS - FUNCIONALIDAD ==========

// === ANIMACIÓN DE CARGA ===
document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');
    });
});

// === BÚSQUEDA ===
function limpiarBusqueda() {
    const urlParams = new URLSearchParams(window.location.search);
    const estado = urlParams.get('estado');

    if (estado) {
        window.location.href = `/admin/reservas?estado=${estado}`;
    } else {
        window.location.href = '/admin/reservas';
    }
}

// Prevenir envío de búsqueda vacía
const searchForm = document.querySelector('.filters-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        const busqueda = searchForm.querySelector('input[name="busqueda"]').value.trim();
        const estado = searchForm.querySelector('select[name="estado"]').value;

        // Si no hay búsqueda ni filtro, recargar página sin parámetros
        if (!busqueda && !estado) {
            e.preventDefault();
            window.location.href = '/admin/reservas';
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

    // Validar solo números
    searchInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

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
    }, 5000);
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

// Observar filas de la tabla
document.querySelectorAll('.reservas-table tbody tr').forEach(row => {
    row.style.opacity = '0';
    row.style.transform = 'translateY(20px)';
    row.style.transition = 'all 0.5s ease-out';
    observer.observe(row);
});

// === TOOLTIP PARA OBSERVACIONES LARGAS ===
document.querySelectorAll('.observaciones').forEach(obs => {
    const fullText = obs.textContent;
    if (fullText && fullText.length > 30) {
        obs.title = fullText;
        obs.style.cursor = 'help';
    }
});

// === CONFIRMACIÓN MEJORADA PARA CANCELAR ===
document.querySelectorAll('.btn-danger').forEach(btn => {
    if (btn.onclick) return; // Ya tiene confirmación inline

    btn.addEventListener('click', function(e) {
        if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            e.preventDefault();
        }
    });
});

// === HIGHLIGHT DE BÚSQUEDA ===
const urlParams = new URLSearchParams(window.location.search);
const busqueda = urlParams.get('busqueda');

if (busqueda) {
    document.querySelectorAll('.id-badge').forEach(badge => {
        if (badge.textContent.includes(busqueda)) {
            badge.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
            badge.style.color = '#92400e';
            badge.style.animation = 'pulse 1s ease-in-out 3';
        }
    });
}

// Animación de pulso
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(pulseStyle);

// === CAMBIO DE FILTRO AUTOMÁTICO ===
const estadoSelect = document.querySelector('#estado');
if (estadoSelect) {
    // Auto-submit al cambiar filtro (opcional, comentar si no se desea)
    // estadoSelect.addEventListener('change', () => {
    //     searchForm.submit();
    // });
}