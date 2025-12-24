// ========== NAVBAR - FUNCIONALIDAD MEJORADA ==========

document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.user-btn');
    const dropdown = document.getElementById('userMenuDropdown');
    const topbar = document.querySelector('.topbar');

    // === TOGGLE DROPDOWN ===
    if (btn && dropdown) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();

            const isOpen = dropdown.classList.contains('open');

            if (isOpen) {
                cerrarDropdown();
            } else {
                abrirDropdown();
            }
        });

        // Cerrar al hacer click fuera
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.user-menu-wrapper')) {
                cerrarDropdown();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && dropdown.classList.contains('open')) {
                cerrarDropdown();
            }
        });
    }

    function abrirDropdown() {
        dropdown.classList.add('open');
        btn.classList.add('active');

        // Animación de los items del menú
        const menuItems = dropdown.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(10px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 50 * index);
        });
    }

    function cerrarDropdown() {
        dropdown.classList.remove('open');
        btn.classList.remove('active');
    }

    // === EFECTO DE SCROLL EN NAVBAR ===
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Agregar/quitar clase 'scrolled' para cambiar estilos
        if (currentScroll > 50) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }

        // Cerrar dropdown al hacer scroll
        if (Math.abs(currentScroll - lastScroll) > 50) {
            cerrarDropdown();
        }

        lastScroll = currentScroll;
    });

    // === SMOOTH SCROLL PARA LINKS INTERNOS ===
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Solo aplicar smooth scroll si es un hash válido
            if (href.startsWith('#') && href.length > 1) {
                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    // Obtener la altura del navbar
                    const navbarHeight = topbar.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // === EFECTO HOVER EN BOTÓN RESERVAR ===
    const btnReservar = document.querySelector('.btn-reservar');

    if (btnReservar) {
        btnReservar.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });

        btnReservar.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    // === CERRAR DROPDOWN AL CAMBIAR TAMAÑO DE VENTANA ===
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (dropdown && dropdown.classList.contains('open')) {
                cerrarDropdown();
            }
        }, 250);
    });

    // === PREVENIR COMPORTAMIENTO POR DEFECTO EN FORMS DEL DROPDOWN ===
    const dropdownForms = dropdown?.querySelectorAll('form');

    if (dropdownForms) {
        dropdownForms.forEach(form => {
            form.addEventListener('submit', function (e) {
                // Agregar indicador de carga al botón
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.7';
                    submitBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Cerrando...';
                }
            });
        });
    }

    // === ANIMACIÓN INICIAL DEL NAVBAR ===
    setTimeout(() => {
        topbar.style.transform = 'translateY(0)';
        topbar.style.opacity = '1';
    }, 100);
});

// === EFECTO DE ENTRADA AL CARGAR LA PÁGINA ===
window.addEventListener('load', function () {
    const topbar = document.querySelector('.topbar');

    if (topbar) {
        topbar.style.transition = 'all 0.5s ease';
        topbar.style.transform = 'translateY(-100%)';
        topbar.style.opacity = '0';

        requestAnimationFrame(() => {
            topbar.style.transform = 'translateY(0)';
            topbar.style.opacity = '1';
        });
    }
});