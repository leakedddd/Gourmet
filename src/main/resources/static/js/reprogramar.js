// === CALENDARIO DINÁMICO CON MEJORAS ===
let calIndex = 0;
const calTitle = document.getElementById('calTitle');
const calDays = document.getElementById('calDays');
const btnPrev = document.getElementById('calPrev');
const btnNext = document.getElementById('calNext');
const hiddenFecha = document.getElementById('fecha');

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

            // Marcar el día actual de la reserva
            if (dia.iso === hiddenFecha.value) {
                btn.classList.add('active');
            }

            if (dia.desactivado) {
                btn.classList.add("disabled");
            } else {
                btn.addEventListener('click', () => {
                    // Remover active de todos los días
                    calDays.querySelectorAll('.day').forEach(dd => dd.classList.remove('active'));

                    // Agregar active al día seleccionado
                    btn.classList.add('active');
                    hiddenFecha.value = dia.iso;

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

        // Actualizar estado de botones de navegación
        btnPrev.disabled = (calIndex === 0);
        btnNext.disabled = (calIndex === MESES_DATA.length - 1);
    }, 150);
}

// Agregar transición CSS al contenedor de días
calDays.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

// Inicializar calendario
if (Array.isArray(MESES_DATA) && MESES_DATA.length > 0) {
    renderCalendar();
}

// Navegación del calendario
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

// === SELECCIÓN DE HORAS CON MEJORAS ===
const hiddenHora = document.getElementById('hora');

document.querySelectorAll('.hour-btn').forEach(h => {
    // Marcar hora inicial al cargar
    if (hiddenHora.value && h.dataset.value === hiddenHora.value) {
        h.classList.add('active');
    }

    h.addEventListener('click', () => {
        // Remover active de todos los botones
        document.querySelectorAll('.hour-btn').forEach(x => x.classList.remove('active'));

        // Agregar active al botón seleccionado
        h.classList.add('active');
        hiddenHora.value = h.dataset.value;

        // Feedback visual con micro-animación
        h.style.transform = 'scale(1.05)';
        setTimeout(() => {
            h.style.transform = '';
        }, 200);
    });
});

// === MODAL DE VALIDACIÓN ===
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
document.getElementById('formReprogramar').addEventListener('submit', (e) => {
    const fecha = hiddenFecha.value;
    const hora = hiddenHora.value;

    const faltantes = [];

    if (!fecha) {
        faltantes.push('Selecciona una fecha en el calendario.');
    }

    if (!hora) {
        faltantes.push('Selecciona una hora.');
    }

    if (faltantes.length > 0) {
        e.preventDefault();
        abrirModalValidacion('Antes de guardar los cambios, completa:', faltantes);

        // Scroll suave al primer campo faltante
        if (!fecha) {
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

// === ANIMACIÓN DE CARGA ===
// Agregar clase 'loaded' al body cuando todo esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Pequeño delay para asegurar que todo esté renderizado
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');
    });
});

// === CONFIRMACIÓN ANTES DE SALIR SI HAY CAMBIOS ===
let cambiosRealizados = false;
let formularioEnviado = false;

// Detectar cambios en fecha
hiddenFecha.addEventListener('change', () => {
    if (hiddenFecha.value !== FECHA_INICIAL) {
        cambiosRealizados = true;
    }
});

// Detectar cambios en hora
hiddenHora.addEventListener('change', () => {
    if (hiddenHora.value !== HORA_INICIAL) {
        cambiosRealizados = true;
    }
});

// Detectar cambios en observaciones
const textareaObs = document.querySelector('textarea[name="observaciones"]');
if (textareaObs) {
    const valorInicial = textareaObs.value;
    textareaObs.addEventListener('input', () => {
        if (textareaObs.value !== valorInicial) {
            cambiosRealizados = true;
        }
    });
}

// Advertir antes de salir si hay cambios sin guardar
window.addEventListener('beforeunload', (e) => {
    if (cambiosRealizados && !formularioEnviado) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// No advertir si se está enviando el formulario
document.getElementById('formReprogramar').addEventListener('submit', () => {
    formularioEnviado = true;
});

// === CONTADOR DE CARACTERES PARA OBSERVACIONES ===
if (textareaObs) {
    const maxChars = 500;

    // Crear contador
    const counter = document.createElement('div');
    counter.style.cssText = 'text-align: right; font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; transition: color 0.2s;';

    const updateCounter = () => {
        const length = textareaObs.value.length;
        counter.textContent = `${length} / ${maxChars} caracteres`;

        if (length > maxChars) {
            textareaObs.value = textareaObs.value.substring(0, maxChars);
            counter.textContent = `${maxChars} / ${maxChars} caracteres (límite alcanzado)`;
            counter.style.color = '#dc2626';
        } else if (length > maxChars * 0.9) {
            counter.style.color = '#f59e0b';
        } else {
            counter.style.color = '#6b7280';
        }
    };

    updateCounter();
    textareaObs.parentElement.appendChild(counter);
    textareaObs.addEventListener('input', updateCounter);
}