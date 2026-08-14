document.addEventListener('DOMContentLoaded', () => {

    // Navbar: se compacta y gana sombra al hacer scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Menú móvil
    const mobileToggle = document.getElementById('mobile-toggle');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if (mobileToggle && closeMobileMenu && navMenu && mobileOverlay) {
        // Abre el menú lateral y bloquea el scroll del fondo
        const openMenu = () => {
            navMenu.classList.add('open');
            mobileOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            mobileToggle.setAttribute('aria-expanded', 'true');
        };

        // Cierra el menú lateral y libera el scroll
        const closeMenu = () => {
            navMenu.classList.remove('open');
            mobileOverlay.classList.remove('show');
            document.body.style.overflow = '';
            mobileToggle.setAttribute('aria-expanded', 'false');

            // Al cerrar se pliegan todos los dropdowns abiertos
            document.querySelectorAll('.dropdown-menu.open').forEach((menu) => {
                menu.classList.remove('open');
            });
        };

        mobileToggle.addEventListener('click', openMenu);
        closeMobileMenu.addEventListener('click', closeMenu);
        mobileOverlay.addEventListener('click', closeMenu);

        // Al agrandar la ventana se resetea el estado del menú móvil
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                closeMenu();
            }
        });
    }

    // Dropdowns táctiles en móvil
    document.querySelectorAll('.has-dropdown > .nav-link').forEach((toggle) => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                const dropdownMenu = toggle.nextElementSibling;
                if(dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                    dropdownMenu.classList.toggle('open');
                }
            }
        });
    });

    // Validación de formularios (contacto + newsletter)
    // Muestra el error debajo del campo correspondiente
    const showError = (input, message) => {
        if (!input) return;
        input.classList.add('invalid');
        const error = document.getElementById(input.id + '-error');
        if (error) {
            error.textContent = message;
            error.classList.add('visible');
        }
    };
    // Oculta el error de un campo
    const clearError = (input) => {
        if (!input) return;
        input.classList.remove('invalid');
        const error = document.getElementById(input.id + '-error');
        if (error) {
            error.classList.remove('visible');
        }
    };

    // Expresión regular para validar correos electrónicos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Limpia el error en cuanto el usuario corrige el campo
    const bindLiveValidation = (input) => {
        if(input) {
            input.addEventListener('input', () => clearError(input));
        }
    };

    //Formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        [name, email, subject, message].forEach(bindLiveValidation);

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let valid = true;
            
            if (name.value.trim().length < 2) {
                showError(name, 'Ingresá tu nombre completo.');
                valid = false;
            }
            if (!emailRegex.test(email.value.trim())) {
                showError(email, 'Ingresá un correo electrónico válido.');
                valid = false;
            }
            if (subject.value.trim().length < 3) {
                showError(subject, 'Ingresá un asunto.');
                valid = false;
            }
            if (message.value.trim().length < 10) {
                showError(message, 'El mensaje debe tener al menos 10 caracteres.');
                valid = false;
            }

            if (valid) {
                const success = document.getElementById('form-success');
                if(success) {
                    success.classList.add('visible');
                }
                contactForm.reset();
                [name, email, subject, message].forEach(clearError);
            }
        });
    }

    // Formulario de newsletter
    document.querySelectorAll('.form-newsletter').forEach((form) => {
        const email = form.querySelector('#newsletter-email');
        const name = form.querySelector('#newsletter-name');

        [email, name].forEach(bindLiveValidation);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let valid = true;
            if (!email || !emailRegex.test(email.value.trim())) {
                showError(email, 'Ingresá un correo electrónico válido.');
                valid = false;
            }
            if (name && name.value.trim().length < 2) {
                showError(name, 'Ingresá tu nombre.');
                valid = false;
            }

            if (valid) {
                form.innerHTML = '<p class="form-success-msg">¡Gracias por suscribirte al Newsletter del ITEC!</p>';
            }
        });
    });

    // Aparición suave al hacer scroll
    const revealables = document.querySelectorAll('.section, .card, .program-card, .news-card, .staff-list');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealables.forEach((el) => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    } else {
        revealables.forEach((el) => el.classList.add('is-visible'));
    }

    // Año dinámico en el footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
