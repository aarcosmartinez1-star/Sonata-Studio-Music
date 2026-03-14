// Funcionalidad del carrusel de imágenes
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del carrusel
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    
    // Variables de estado
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 segundos
    
    // Inicializar el carrusel
    function initCarousel() {
        // Mostrar el primer slide
        updateCarousel();
        
        // Iniciar cambio automático de slides
        startSlideInterval();
        
        // Agregar event listeners para los controles
        prevBtn.addEventListener('click', showPrevSlide);
        nextBtn.addEventListener('click', showNextSlide);
        
        // Agregar event listeners para los indicadores
        indicators.forEach(indicator => {
            indicator.addEventListener('click', function() {
                const slideIndex = parseInt(this.getAttribute('data-slide'));
                goToSlide(slideIndex);
            });
        });
        
        // Pausar el carrusel cuando el mouse está sobre él
        carousel.addEventListener('mouseenter', pauseSlideInterval);
        carousel.addEventListener('mouseleave', startSlideInterval);
        
        // Pausar el carrusel cuando está en vista (para ahorro de batería en móviles)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                pauseSlideInterval();
            } else {
                startSlideInterval();
            }
        });
    }
    
    // Función para mostrar el slide anterior
    function showPrevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
        restartSlideInterval();
    }
    
    // Función para mostrar el siguiente slide
    function showNextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
        restartSlideInterval();
    }
    
    // Función para ir a un slide específico
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
        restartSlideInterval();
    }
    
    // Función para actualizar la posición del carrusel
    function updateCarousel() {
        // Mover el carrusel
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Función para iniciar el intervalo automático
    function startSlideInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(showNextSlide, slideDuration);
    }
    
    // Función para pausar el intervalo automático
    function pauseSlideInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // Función para reiniciar el intervalo automático
    function restartSlideInterval() {
        pauseSlideInterval();
        startSlideInterval();
    }
    
    // Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // Cambiar el ícono del menú
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Cerrar el menú al hacer clic en un enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Cerrar el menú móvil si está abierto
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                
                // Scroll suave
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efecto de aparición al hacer scroll
    function checkScroll() {
        const elements = document.querySelectorAll('.service-card, .about-content, .contact-content, .talleres-row, .taller-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Inicializar efectos de scroll
    document.querySelectorAll('.service-card, .about-content, .contact-content, .talleres-row, .taller-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('load', checkScroll);
    
    // Inicializar el carrusel
    initCarousel();
    
    // Inicializar efectos de scroll
    checkScroll();
    
    // Inicializar talleres - cerrar todos al cargar
    document.querySelectorAll('.taller-body').forEach(body => {
        body.style.maxHeight = '0';
        body.style.opacity = '0';
    });
    
    document.querySelectorAll('.taller-toggle i').forEach(icon => {
        icon.style.transform = 'rotate(0deg)';
    });
});

// Funciones para los talleres acordeón
function toggleTaller(tallerId) {
    const card = document.querySelector(`[data-taller="${tallerId}"]`);
    const body = document.getElementById(tallerId);
    const toggleIcon = card.querySelector('.taller-toggle i');
    
    // Si ya está activo, lo cerramos
    if (card.classList.contains('active')) {
        card.classList.remove('active');
        body.style.maxHeight = '0';
        body.style.opacity = '0';
        toggleIcon.style.transform = 'rotate(0deg)';
    } else {
        // Cerramos cualquier otro abierto en la MISMA FILA
        const row = card.closest('.talleres-row');
        if (row) {
            const activeCardsInRow = row.querySelectorAll('.taller-card.active');
            activeCardsInRow.forEach(activeCard => {
                if (activeCard !== card) {
                    const activeId = activeCard.getAttribute('data-taller');
                    const activeBody = document.getElementById(activeId);
                    const activeIcon = activeCard.querySelector('.taller-toggle i');
                    
                    activeCard.classList.remove('active');
                    activeBody.style.maxHeight = '0';
                    activeBody.style.opacity = '0';
                    activeIcon.style.transform = 'rotate(0deg)';
                }
            });
        }
        
        // Abrimos el seleccionado
        card.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
        body.style.opacity = '1';
        toggleIcon.style.transform = 'rotate(180deg)';
    }
}

// Función para mostrar más talleres
function mostrarMasTalleres() {
    const extraSection = document.getElementById('talleres-adicionales');
    const boton = document.querySelector('.mas-talleres .btn-secondary');
    
    if (extraSection.classList.contains('mostrar')) {
        extraSection.classList.remove('mostrar');
        boton.innerHTML = '<i class="fas fa-plus"></i> Ver más talleres disponibles';
        
        // Cerrar todos los talleres dentro de la sección adicional al ocultarla
        const activeCards = extraSection.querySelectorAll('.taller-card.active');
        activeCards.forEach(card => {
            const tallerId = card.getAttribute('data-taller');
            const body = document.getElementById(tallerId);
            const toggleIcon = card.querySelector('.taller-toggle i');
            
            card.classList.remove('active');
            body.style.maxHeight = '0';
            body.style.opacity = '0';
            toggleIcon.style.transform = 'rotate(0deg)';
        });
    } else {
        extraSection.classList.add('mostrar');
        boton.innerHTML = '<i class="fas fa-minus"></i> Ver menos talleres';
    }
}