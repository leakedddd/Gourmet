// === PERSONAS CON MEJORAS ===
document.querySelectorAll('.people-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.people-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('cantidadPersonas').value = btn.dataset.value;

        // Feedback visual con micro-animación
        btn.style.transform = 'scale(1.15)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    });
});

// === CALENDARIO DINÁMICO CON MEJORAS ===
let calIndex = 0;
const calTitle = document.getElementById('calTitle');
const calDays = document.getElementById('calDays');
const btnPrev = document.getElementById('calPrev');
const btnNext = document.getElementById('calNext');

function renderCalendar() {
    const mes = MESES_DATA[calIndex];
    if (!mes) return;

    // Animación suave al cambiar de mes
    calDays.style.opacity = '0';
    calDays.style.transform = 'translateY(10px)';

    setTimeout(() => {
        calTitle.textContent = mes.nombre;
        calDays.innerHTML = "";

        for (let i = 0; i < (mes.offset || 0); i++) {
            const empty = document.createElement('div');
            empty.className = "day empty";
            calDays.appendChild(empty);
        }

        mes.dias.forEach(dia => {
            const btn = document.createElement('button');
            btn.type = "button";
            btn.textContent = dia.numero;
            btn.className = "day big";
            btn.dataset.date = dia.iso;

            if (dia.desactivado) {
                btn.classList.add("disabled");
            } else {
                btn.addEventListener('click', () => {
                    // Quitar active de todos
                    calDays.querySelectorAll('.day').forEach(dd => dd.classList.remove('active'));
                    // Marcar este
                    btn.classList.add('active');
                    // Poner en hidden
                    document.getElementById('fecha').value = dia.iso;

                    // Feedback visual con micro-animación
                    btn.style.transform = 'scale(1.15)';
                    setTimeout(() => {
                        btn.style.transform = '';
                    }, 200);
                });
            }

            calDays.appendChild(btn);
        });

        // Restaurar animación
        setTimeout(() => {
            calDays.style.opacity = '1';
            calDays.style.transform = 'translateY(0)';
        }, 50);

        // Desactivar flechas cuando toque
        btnPrev.disabled = (calIndex === 0);
        btnNext.disabled = (calIndex === MESES_DATA.length - 1);
    }, 150);
}

// Agregar transición CSS al contenedor de días
calDays.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

if (Array.isArray(MESES_DATA) && MESES_DATA.length > 0) {
    renderCalendar();
}

btnPrev.addEventListener('click', () => {
    if (calIndex > 0) {
        calIndex--;
        renderCalendar();
    }
});

btnNext.addEventListener('click', () => {
    if (calIndex < MESES_DATA.length - 1) {
        calIndex++;
        renderCalendar();
    }
});

// === HORAS CON MEJORAS ===
document.querySelectorAll('.hour-btn').forEach(h => {
    h.addEventListener('click', () => {
        document.querySelectorAll('.hour-btn').forEach(x => x.classList.remove('active'));
        h.classList.add('active');
        document.getElementById('hora').value = h.dataset.value;

        // Feedback visual con micro-animación
        h.style.transform = 'scale(1.05)';
        setTimeout(() => {
            h.style.transform = '';
        }, 200);
    });
});

// === MODAL DE VALIDACIÓN MEJORADO ===
function abrirModalValidacion(mensaje, items = []) {
    const overlay = document.getElementById("modalValidacion");
    const msg = document.getElementById("modalValidacionMsg");
    const lista = document.getElementById("modalValidacionLista");

    msg.textContent = mensaje;
    lista.innerHTML = "";

    items.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        lista.appendChild(li);
    });

    overlay.style.display = "flex";
    // Agregar clase para animación
    setTimeout(() => overlay.classList.add('show'), 10);

    // Cerrar con ESC
    document.addEventListener("keydown", escCloseOnce);
    function escCloseOnce(e){
        if (e.key === "Escape") cerrarModalValidacion();
    }
    // Guardamos referencia para remover
    overlay._escHandler = escCloseOnce;
}

function cerrarModalValidacion() {
    const overlay = document.getElementById("modalValidacion");
    overlay.classList.remove('show');

    setTimeout(() => {
        overlay.style.display = "none";
    }, 300);

    if (overlay._escHandler) {
        document.removeEventListener("keydown", overlay._escHandler);
        overlay._escHandler = null;
    }
}

// Cerrar si haces click fuera de la caja
document.addEventListener("click", (e) => {
    const overlay = document.getElementById("modalValidacion");
    if (overlay && overlay.style.display === "flex" && e.target === overlay) {
        cerrarModalValidacion();
    }
});

// === VALIDACIÓN FINAL CON MEJOR UX ===
document.getElementById('formReserva').addEventListener('submit', (e) => {
    const cant = document.getElementById('cantidadPersonas').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    const faltantes = [];
    if (!cant) faltantes.push("Selecciona la cantidad de personas.");
    if (!fecha) faltantes.push("Selecciona una fecha en el calendario.");
    if (!hora) faltantes.push("Selecciona una hora.");

    if (faltantes.length > 0) {
        e.preventDefault();
        abrirModalValidacion("Antes de confirmar tu reserva, completa:", faltantes);

        // Scroll suave al primer campo faltante
        if (!cant) {
            document.querySelector('.people-selector').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        } else if (!fecha) {
            document.querySelector('.calendar-shell').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        } else if (!hora) {
            document.querySelector('.hours-grid').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
});

// === MEJORAS VISUALES PARA EL MODAL ===
const modalOverlay = document.getElementById("modalValidacion");
if (modalOverlay) {
    // Agregar clase show para controlar animación
    modalOverlay.style.transition = 'opacity 0.3s ease';
    modalOverlay.style.opacity = '0';

    // Cuando se muestra el modal
    const originalDisplay = modalOverlay.style.display;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style') {
                if (modalOverlay.style.display === 'flex' && !modalOverlay.classList.contains('show')) {
                    modalOverlay.style.opacity = '0';
                    setTimeout(() => {
                        modalOverlay.style.opacity = '1';
                    }, 10);
                }
            }
        });
    });

    observer.observe(modalOverlay, { attributes: true });
}

// === ANIMACIÓN DE CARGA ===
// Agregar clase 'loaded' al body cuando todo esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Pequeño delay para asegurar que todo esté renderizado
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');
    });
});

// === MEJORAR ANIMACIÓN DEL MODAL EXISTENTE ===
const gModalOverlay = document.getElementById("modalValidacion");
if (gModalOverlay) {
    const gModalContent = gModalOverlay.querySelector('.g-modal');
    if (gModalContent) {
        // Cuando el modal se muestra, animar el contenido
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style') {
                    if (gModalOverlay.style.display === 'flex') {
                        gModalContent.style.transform = 'translateY(20px) scale(0.95)';
                        gModalContent.style.opacity = '0';
                        setTimeout(() => {
                            gModalContent.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                            gModalContent.style.transform = 'translateY(0) scale(1)';
                            gModalContent.style.opacity = '1';
                        }, 10);
                    }
                }
            });
        });

        observer.observe(gModalOverlay, { attributes: true, attributeFilter: ['style'] });
    }
}

// === CONTADOR DE CARACTERES PARA OBSERVACIONES (OPCIONAL) ===
const textareaObs = document.querySelector('textarea[name="observaciones"]');
if (textareaObs) {
    const maxChars = 500;

    // Crear contador
    const counter = document.createElement('div');
    counter.style.cssText = 'text-align: right; font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem;';
    counter.textContent = `0 / ${maxChars} caracteres`;

    textareaObs.parentElement.appendChild(counter);

    textareaObs.addEventListener('input', () => {
        const length = textareaObs.value.length;
        counter.textContent = `${length} / ${maxChars} caracteres`;

        if (length > maxChars * 0.9) {
            counter.style.color = '#dc2626';
        } else {
            counter.style.color = '#6b7280';
        }

        if (length > maxChars) {
            textareaObs.value = textareaObs.value.substring(0, maxChars);
            counter.textContent = `${maxChars} / ${maxChars} caracteres (límite alcanzado)`;
        }
    });
}