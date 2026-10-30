/* ==========================================================================
   Lógica interactiva principal - Portfolio Jason Caballero
   ========================================================================== */

// --- 1. Typewriter Effect ---
const texts = [
    "Ciberseguridad Defensiva",
    "Telecomunicaciones & Redes",
    "Servidores con Proxmox VE",
    "Bases de Datos (PostgreSQL & MariaDB)",
    "Infraestructura & Linux",
    "Desarrollo & IoT"
];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type() {
    const typewriterElem = document.getElementById('typewriter');
    if (!typewriterElem) return;

    if (count === texts.length) count = 0;
    currentText = texts[count];
    letter = currentText.slice(0, ++index);
    typewriterElem.textContent = letter;

    if (letter.length === currentText.length) {
        setTimeout(() => {
            const deleteInterval = setInterval(() => {
                letter = currentText.slice(0, --index);
                typewriterElem.textContent = letter;
                if (index === 0) {
                    clearInterval(deleteInterval);
                    count++;
                    type();
                }
            }, 50);
        }, 2000);
    } else {
        setTimeout(type, 100);
    }
})();

// --- 2. Canvas Background Animation ---
const canvas = document.getElementById('canvas-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.directionX = (Math.random() * 0.4) - 0.2;
            this.directionY = (Math.random() * 0.4) - 0.2;
            this.size = Math.random() * 2;
            this.color = '#dc2626';
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(220, 38, 38,' + opacityValue * 0.2 + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    initParticles();
    animateParticles();
}

// --- 3. Scroll Reveal Animation ---
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal();

// --- 4. 3D Tilt Effect ---
function handleTilt(e, card) {
    const inner = card.querySelector('.cyber-card-inner');
    if (!inner) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetTilt(card) {
    const inner = card.querySelector('.cyber-card-inner');
    if (!inner) return;
    inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
}

// Exportar globalmente para eventos en línea
window.handleTilt = handleTilt;
window.resetTilt = resetTilt;

// --- 5. Project Filtering ---
function filterProjects(category) {
    document.querySelectorAll('.project-btn').forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('bg-primary', 'text-white', 'border-primary', 'shadow-[0_0_15px_rgba(220,38,38,0.35)]');
            btn.classList.remove('text-gray-400', 'bg-black/40', 'border-gray-800');
        } else {
            btn.classList.remove('bg-primary', 'text-white', 'border-primary', 'shadow-[0_0_15px_rgba(220,38,38,0.35)]');
            btn.classList.add('text-gray-400', 'bg-black/40', 'border-gray-800');
        }
    });

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'flex';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}
window.filterProjects = filterProjects;

// --- 6. Awards Carousel & Modal Logic ---
let slideIndex = 0;
const slides = document.getElementsByClassName("award-slide");
const dots = document.getElementsByClassName("award-dot");
const tabs = document.getElementsByClassName("award-tab");
const counterEl = document.getElementById("award-counter");

const awardCertificates = [
    {
        img: 'img/primer.jpg',
        title: 'Primer Lugar en Desarrollo de Software — FLIA UGB 2026',
        badge: '1ER LUGAR 🥇 FLIA 2026',
        badgeClass: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
    },
    {
        img: 'img/coninfo.jpg',
        title: 'Tercer Lugar Nacional — CONINFO 2026 «MakeSing» (ASPROC)',
        badge: '3ER LUGAR 🥉 CONINFO 2026',
        badgeClass: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
    },
    {
        img: 'img/secon.jpeg',
        title: 'Segundo Lugar en Automatización y Robótica — FLIA UGB 2025',
        badge: '2DO LUGAR 🥈 ROBÓTICA 2025',
        badgeClass: 'bg-slate-400/20 text-slate-300 border border-slate-400/40'
    },
    {
        img: 'img/tercero.jpeg',
        title: 'Tercer Lugar en Automatización y Robótica — FLIA UGB 2025',
        badge: '3ER LUGAR 🥉 ROBÓTICA 2025',
        badgeClass: 'bg-amber-600/20 text-amber-500 border border-amber-600/40'
    }
];

function changeAward(n) {
    showSlides(slideIndex += n);
}

function setAward(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    if (slides.length === 0) return;
    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
        slides[i].style.display = "none";
        
        if (dots[i]) {
            dots[i].classList.remove("bg-primary", "w-8");
            dots[i].classList.add("bg-gray-700", "w-3");
        }
        if (tabs[i]) {
            tabs[i].classList.remove("active");
        }
    }
    
    // Show active slide
    slides[slideIndex].classList.add("active");
    slides[slideIndex].style.display = "flex";
    
    if (dots[slideIndex]) {
        dots[slideIndex].classList.remove("bg-gray-700", "w-3");
        dots[slideIndex].classList.add("bg-primary", "w-8");
    }
    if (tabs[slideIndex]) {
        tabs[slideIndex].classList.add("active");
    }
    if (counterEl) {
        counterEl.textContent = `${String(slideIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }
}

// Modal Functions
function openCertificateModal(idx) {
    const data = awardCertificates[idx] || awardCertificates[slideIndex];
    if (!data) return;

    const modal = document.getElementById("certificate-modal");
    const modalImg = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalBadge = document.getElementById("modal-badge");

    if (modal && modalImg) {
        modalImg.src = data.img;
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalBadge) {
            modalBadge.textContent = data.badge;
            modalBadge.className = `px-3 py-1 rounded-full text-xs font-mono font-bold ${data.badgeClass}`;
        }
        modal.classList.remove("hidden");
        // Force reflow for CSS transition
        void modal.offsetWidth;
        modal.classList.add("modal-open");
        document.body.style.overflow = "hidden";
    }
}

function closeCertificateModal() {
    const modal = document.getElementById("certificate-modal");
    if (modal) {
        modal.classList.remove("modal-open");
        setTimeout(() => {
            modal.classList.add("hidden");
            document.body.style.overflow = "";
        }, 250);
    }
}

// Touch swipe support for awards carousel
const carouselContainer = document.getElementById("awards-carousel-container");
if (carouselContainer) {
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 45) {
            if (diffX < 0) changeAward(1);
            else changeAward(-1);
        }
    }, { passive: true });
}

// Global ESC key listener for modal
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeCertificateModal();
    }
});

// Initialize on DOM load
if (slides.length > 0) {
    showSlides(slideIndex);
}

window.changeAward = changeAward;
window.setAward = setAward;
window.openCertificateModal = openCertificateModal;
window.closeCertificateModal = closeCertificateModal;

// --- 7. Form Submission ---
const form = document.getElementById("contact-form");
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;

        const data = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                form.reset();
                alert("Mensaje enviado con éxito");
            } else {
                alert("Error al enviar.");
            }
        } catch (error) {
            alert("Error de conexión.");
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}

// --- 8. Active Nav Link Logic ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-white', 'bg-white/10');
        if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
            if (!link.getAttribute('href').includes('contacto')) {
                link.classList.add('text-white', 'bg-white/10');
            }
        }
    });
});
