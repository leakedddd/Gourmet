// === ANIMACIÓN DE CARGA ===
document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');
    });
});

// ===================== CALIFICAR =====================
function abrirModalCalificar(btn) {
    const id = btn.getAttribute("data-reserva-id");

    document.getElementById("reservaIdSeleccionada").value = id;

    // Texto de ayuda
    const texto = document.getElementById("textoReserva");
    texto.textContent = `Califica tu experiencia en la reserva #${id}`;

    // Reset visual
    document.getElementById("calificacionInput").value = "";
    document.getElementById("comentario").value = "";
    document.querySelectorAll("#ratingStars span").forEach(s => s.classList.remove("active"));

    // Set action del form
    const form = document.getElementById("formCalificar");
    form.action = `/reserva/${id}/calificar`;

    // Mostrar modal con animación
    const modal = document.getElementById("modalCalificar");
    modal.style.display = "flex";

    // Aplicar animación después de un frame
    setTimeout(() => modal.classList.add('show'), 10);

    // Cerrar con ESC
    document.addEventListener("keydown", cerrarCalificarConEscape);
}

function cerrarModalCalificar() {
    const modal = document.getElementById("modalCalificar");
    modal.classList.remove('show');

    setTimeout(() => {
        modal.style.display = "none";
    }, 300);

    document.removeEventListener("keydown", cerrarCalificarConEscape);
}

function cerrarCalificarConEscape(e) {
    if (e.key === 'Escape') {
        cerrarModalCalificar();
    }
}

function seleccionarEstrella(valor) {
    document.getElementById("calificacionInput").value = valor;

    // Visual con animación
    document.querySelectorAll("#ratingStars span").forEach((s, i) => {
        if (i < valor) {
            s.classList.add("active");
            // Micro-animación escalonada
            s.style.animation = `none`;
            setTimeout(() => {
                s.style.animation = `starPop 0.3s ease ${i * 0.05}s`;
            }, 10);
        } else {
            s.classList.remove("active");
        }
    });
}

// Agregar animación de estrella
const starPopStyle = document.createElement('style');
starPopStyle.textContent = `
    @keyframes starPop {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(starPopStyle);

// Hover effect en estrellas
document.querySelectorAll("#ratingStars span").forEach((star, index) => {
    star.addEventListener('mouseenter', () => {
        document.querySelectorAll("#ratingStars span").forEach((s, i) => {
            if (i <= index) {
                s.style.color = '#fbbf24';
            } else {
                s.style.color = '#e5e7eb';
            }
        });
    });
});

// Restaurar colores originales al salir del contenedor
document.getElementById("ratingStars").addEventListener('mouseleave', () => {
    const valorActual = document.getElementById("calificacionInput").value;
    document.querySelectorAll("#ratingStars span").forEach((s, i) => {
        if (valorActual && i < parseInt(valorActual)) {
            s.style.color = '#fbbf24';
        } else {
            s.style.color = '#e5e7eb';
        }
    });
});

// Cerrar modal calificar si haces click fuera
document.addEventListener("click", (e) => {
    const overlay = document.getElementById("modalCalificar");
    if (overlay && overlay.style.display === "flex" && e.target === overlay) {
        cerrarModalCalificar();
    }
});

// Validación del formulario de calificación
document.getElementById("formCalificar").addEventListener("submit", (e) => {
    const calificacion = document.getElementById("calificacionInput").value;

    if (!calificacion) {
        e.preventDefault();

        // Animar estrellas para indicar que falta seleccionar
        document.querySelectorAll("#ratingStars span").forEach((star, index) => {
            setTimeout(() => {
                star.style.animation = 'shake 0.3s ease';
            }, index * 50);
        });

        // Mostrar mensaje
        const texto = document.getElementById("textoReserva");
        texto.textContent = "⚠️ Por favor selecciona una calificación";
        texto.style.color = '#dc2626';

        setTimeout(() => {
            texto.style.color = '#6b7280';
            const id = document.getElementById("reservaIdSeleccionada").value;
            texto.textContent = `Califica tu experiencia en la reserva #${id}`;
        }, 2000);
    }
});

// Animación shake
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// ===================== CANCELAR =====================
let reservaIdCancelar = null;

function abrirModalCancelar(btn) {
    reservaIdCancelar = btn.dataset.id;

    const fecha = btn.dataset.fecha || "";
    const hora = btn.dataset.hora || "";

    const msg = document.getElementById("modalCancelarMsg");
    msg.textContent = `¿Seguro que deseas cancelar la reserva #${reservaIdCancelar} (${fecha} - ${hora})?`;

    // Set action del form
    const form = document.getElementById("formCancelar");
    form.action = `/reserva/${reservaIdCancelar}/cancelar`;

    // Mostrar modal con animación
    const modal = document.getElementById("modalCancelar");
    modal.style.display = "flex";

    setTimeout(() => modal.classList.add('show'), 10);

    // Cerrar con ESC
    document.addEventListener("keydown", cerrarCancelarConEscape);
}

function cerrarModalCancelar() {
    const modal = document.getElementById("modalCancelar");
    modal.classList.remove('show');

    setTimeout(() => {
        modal.style.display = "none";
    }, 300);

    reservaIdCancelar = null;
    document.removeEventListener("keydown", cerrarCancelarConEscape);
}

function cerrarCancelarConEscape(e) {
    if (e.key === 'Escape') {
        cerrarModalCancelar();
    }
}

// Cerrar modal cancelar si haces click fuera
document.addEventListener("click", (e) => {
    const overlay = document.getElementById("modalCancelar");
    if (overlay && overlay.style.display === "flex" && e.target === overlay) {
        cerrarModalCancelar();
    }
});

// Confirmación adicional antes de cancelar
document.getElementById("formCancelar").addEventListener("submit", (e) => {
    const btnSubmit = e.target.querySelector('.g-btn-danger');

    // Deshabilitar botón para evitar doble click
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Cancelando...';
    btnSubmit.style.opacity = '0.7';
});

// === MEJORA VISUAL: Contador de caracteres en textarea ===
const textarea = document.getElementById("comentario");
if (textarea) {
    const maxChars = 500;

    // Crear contenedor para el contador
    const counterWrapper = document.createElement('div');
    counterWrapper.style.cssText = 'margin-top: 0.5rem;';

    const counter = document.createElement('div');
    counter.style.cssText = 'text-align: right; font-size: 0.85rem; color: #6b7280; transition: color 0.2s;';

    counterWrapper.appendChild(counter);

    const updateCounter = () => {
        const length = textarea.value.length;
        counter.textContent = `${length} / ${maxChars} caracteres`;

        if (length > maxChars) {
            textarea.value = textarea.value.substring(0, maxChars);
            counter.textContent = `${maxChars} / ${maxChars} caracteres (límite alcanzado)`;
            counter.style.color = '#dc2626';
        } else if (length > maxChars * 0.9) {
            counter.style.color = '#f59e0b';
        } else {
            counter.style.color = '#6b7280';
        }
    };

    updateCounter();
    textarea.parentElement.appendChild(counterWrapper);
    textarea.addEventListener('input', updateCounter);
}

// === ANIMACIÓN DE HOVER EN CARDS ===
document.querySelectorAll('.reserva-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});