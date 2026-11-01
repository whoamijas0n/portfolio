/* ==========================================================================
   Lógica interactiva principal — Portfolio Jason Caballero
   Cyberpunk Dark Red Edition
   ========================================================================== */

// ═══════════════════════════════════════════════════════════════
// 1. CUSTOM CURSOR + TRAIL
// ═══════════════════════════════════════════════════════════════
const cursor     = document.getElementById('cyber-cursor');
const trailCont  = document.getElementById('cursor-trail');

let mx = 0, my = 0, cx = 0, cy = 0;
const LERP = 0.15;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;

    // Trail dot
    if (trailCont) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
        trailCont.appendChild(dot);
        setTimeout(() => dot.remove(), 600);
    }
});

// Hover effect on interactive elements
document.querySelectorAll('a, button, [role="button"], .cyber-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hovered'));
});

function animateCursor() {
    if (cursor) {
        cx += (mx - cx) * LERP;
        cy += (my - cy) * LERP;
        cursor.style.left = cx + 'px';
        cursor.style.top  = cy + 'px';
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ═══════════════════════════════════════════════════════════════
// 2. CIRCUIT PCB CANVAS BACKGROUND
// ═══════════════════════════════════════════════════════════════
const canvas = document.getElementById('canvas-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initPCB(); });

    const RED  = 'rgba(220,38,38,';
    const REDF = '#dc2626';
    let nodes = [], lines = [];

    function randRange(a, b) { return a + Math.random() * (b - a); }

    function initPCB() {
        nodes = []; lines = [];
        const count = Math.floor((canvas.width * canvas.height) / 18000);
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: randRange(0, canvas.width),
                y: randRange(0, canvas.height),
                r: randRange(.5, 2.2),
                vx: randRange(-.15, .15),
                vy: randRange(-.15, .15),
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: randRange(.005, .015),
            });
        }
    }

    function drawPCB() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update node positions
        nodes.forEach(n => {
            n.x += n.vx; n.y += n.vy;
            n.pulse += n.pulseSpeed;
            if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
            if (n.y < 0 || n.y > canvas.height)  n.vy *= -1;
        });

        const maxDist  = (canvas.width / 6.5) * (canvas.height / 6.5);
        const maxPx    = Math.min(canvas.width, canvas.height) * .18;
        const maxPxSq  = maxPx * maxPx;

        // Lines (circuit traces)
        for (let a = 0; a < nodes.length; a++) {
            for (let b = a + 1; b < nodes.length; b++) {
                const dx = nodes[a].x - nodes[b].x;
                const dy = nodes[a].y - nodes[b].y;
                const d2 = dx*dx + dy*dy;
                if (d2 < maxPxSq) {
                    const alpha = (1 - d2 / maxPxSq) * .22;
                    // Route with L-shaped paths (PCB style)
                    ctx.beginPath();
                    ctx.moveTo(nodes[a].x, nodes[a].y);
                    // random elbow
                    if (Math.random() > .5) {
                        ctx.lineTo(nodes[a].x, nodes[b].y);
                    } else {
                        ctx.lineTo(nodes[b].x, nodes[a].y);
                    }
                    ctx.lineTo(nodes[b].x, nodes[b].y);
                    ctx.strokeStyle = RED + alpha + ')';
                    ctx.lineWidth   = .6;
                    ctx.stroke();
                }
            }
        }

        // Nodes (solder points)
        nodes.forEach(n => {
            const glow = .5 + .5 * Math.sin(n.pulse);
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * (1 + .3 * glow), 0, Math.PI * 2);
            ctx.fillStyle = RED + (.3 + .5 * glow) + ')';
            ctx.fill();

            // outer ring pulse
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * 3 * glow, 0, Math.PI * 2);
            ctx.strokeStyle = RED + (.08 * glow) + ')';
            ctx.lineWidth   = .5;
            ctx.stroke();
        });

        requestAnimationFrame(drawPCB);
    }

    initPCB();
    drawPCB();
}

// ═══════════════════════════════════════════════════════════════
// 3. TYPEWRITER EFFECT
// ═══════════════════════════════════════════════════════════════
const texts = [
    "Red Team Cybersecurity",
    "Telecomunicaciones & Redes",
    "Servidores con Proxmox VE",
    "Bases de Datos (PostgreSQL & MariaDB)",
    "Infraestructura & Linux",
    "Desarrollo & IoT",
];
let tIdx = 0, cIdx = 0, deleting = false;

function typeEffect() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const current = texts[tIdx];
    if (!deleting) {
        el.textContent = current.slice(0, ++cIdx);
        if (cIdx === current.length) {
            deleting = true;
            setTimeout(typeEffect, 2200);
            return;
        }
        setTimeout(typeEffect, 85);
    } else {
        el.textContent = current.slice(0, --cIdx);
        if (cIdx === 0) {
            deleting = false;
            tIdx = (tIdx + 1) % texts.length;
            setTimeout(typeEffect, 400);
            return;
        }
        setTimeout(typeEffect, 42);
    }
}
typeEffect();

// ═══════════════════════════════════════════════════════════════
// 4. SCROLL REVEAL
// ═══════════════════════════════════════════════════════════════
function revealOnScroll() {
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 120) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ═══════════════════════════════════════════════════════════════
// 5. 3D TILT EFFECT
// ═══════════════════════════════════════════════════════════════
function handleTilt(e, card) {
    const inner = card.querySelector('.cyber-card-inner');
    if (!inner) return;
    const rect = card.getBoundingClientRect();
    const rotX = ((e.clientY - rect.top  - rect.height / 2) / rect.height) * -12;
    const rotY = ((e.clientX - rect.left - rect.width  / 2) / rect.width)  *  12;
    inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

function resetTilt(card) {
    const inner = card.querySelector('.cyber-card-inner');
    if (inner) inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
}

window.handleTilt = handleTilt;
window.resetTilt  = resetTilt;

// ═══════════════════════════════════════════════════════════════
// 6. PROJECT FILTERING
// ═══════════════════════════════════════════════════════════════
function filterProjects(cat) {
    document.querySelectorAll('.project-btn').forEach(btn => {
        const active = btn.dataset.filter === cat;
        btn.classList.toggle('bg-primary', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('border-primary', active);
        btn.classList.toggle('shadow-[0_0_15px_rgba(220,38,38,0.4)]', active);
        btn.classList.toggle('text-gray-400', !active);
        btn.classList.toggle('bg-black/40', !active);
        btn.classList.toggle('border-gray-800', !active);
    });

    document.querySelectorAll('.project-card').forEach(card => {
        const show = cat === 'all' || card.classList.contains(cat);
        if (show) {
            card.style.display  = 'flex';
            setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 30);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}
window.filterProjects = filterProjects;

// ═══════════════════════════════════════════════════════════════
// 7. TERMINAL INTERACTIVA
// ═══════════════════════════════════════════════════════════════
const terminalData = {
    skills: [
        { cmd: 'whoami', delay: 200, out: ['<span class="t-green">jason_caballero</span> <span class="t-cyan">// Red Team | Telecom | Infra</span>'] },
        { cmd: 'cat skills.conf', delay: 800, out: [
            '<span class="t-red">[OFENSIVO]</span>  Pentesting · OSINT · BadUSB/HID · Wi-Fi Auditing',
            '<span class="t-yellow">[DEFENSIVO]</span> SOC Tier1 · Hardening · Wireshark · Firewalls',
            '<span class="t-cyan">[REDES]</span>     Cisco IOS · VLANs · OSPF · IPv4/IPv6 · Fibra',
            '<span class="t-green">[INFRA]</span>    Proxmox VE · KVM · LXC · ZFS · Linux Bridges',
            '<span class="t-out">[DB]</span>        PostgreSQL · MariaDB · ACID · PL/pgSQL',
            '<span class="t-out">[DEV]</span>       Python · Bash · C++ · C# · ESP32 · RPi',
        ]},
        { cmd: 'nmap --top-ports 6 localhost', delay: 1200, out: [
            '22/tcp   open  <span class="t-green">ssh</span>',
            '80/tcp   open  <span class="t-green">http</span>',
            '443/tcp  open  <span class="t-green">https</span>',
            '5900/tcp open  <span class="t-yellow">vnc</span>',
            '8006/tcp open  <span class="t-cyan">proxmox-api</span>',
            '5432/tcp open  <span class="t-cyan">postgresql</span>',
        ]},
        { cmd: 'aircrack-ng --status', delay: 900, out: [
            '<span class="t-red">[ MONITOR MODE ]</span> wlan0mon → active',
            'Handshakes captured: <span class="t-green">3</span>',
            'WPA2 cracking: <span class="t-yellow">wordlist attack running…</span>',
        ]},
        { cmd: '_', delay: 0, out: [] },
    ],
    certs: [
        { cmd: 'credly verify --all', delay: 200, out: [
            '<span class="t-green">✔</span> Network Technician Career Path — Cisco (2024)',
            '<span class="t-yellow">⟳</span> Junior Cybersecurity Analyst — Cisco (80% done)',
            '<span class="t-green">✔</span> Networking Basics — Cisco Credly',
            '<span class="t-green">✔</span> Endpoint Security — Cisco Credly',
            '<span class="t-green">✔</span> Network Support & Security — Cisco Credly',
            '<span class="t-cyan">→</span> Cisco Ethical Hacker — En Progreso',
        ]},
        { cmd: '_', delay: 0, out: [] },
    ],
    tools: [
        { cmd: 'ls /opt/redteam/', delay: 200, out: [
            '<span class="t-red">DragonFly/</span>  <span class="t-out">— Wireless audit · BadUSB · RF suite</span>',
            '<span class="t-cyan">Soranin/</span>    <span class="t-out">— OSINT framework async engine</span>',
            '<span class="t-yellow">REI-Hub/</span>    <span class="t-out">— RPi Zero 2W diagnostic device</span>',
            '<span class="t-green">ServoPipe/</span>  <span class="t-out">— Gesture control + ESP32</span>',
            '<span class="t-out">Nmap-Manager/</span><span class="t-out">— CLI nmap wrapper</span>',
        ]},
        { cmd: 'python3 dragonfly.py --module wifi', delay: 700, out: [
            '<span class="t-red">[ DragonFly ]</span> Initializing wireless engine…',
            'Interface: <span class="t-green">wlan0</span>  Mode: <span class="t-yellow">MONITOR</span>',
            'Scanning: <span class="t-cyan">2.4 GHz + 5 GHz</span>',
            'APs found: <span class="t-green">14</span>  WPA2: <span class="t-red">11</span>  Open: <span class="t-yellow">3</span>',
        ]},
        { cmd: '_', delay: 0, out: [] },
    ],
};

let currentTermTab = 'skills';
let terminalBusy   = false;

function typeTerminalLines(lines, idx, body, callback) {
    if (idx >= lines.length) { if (callback) callback(); return; }
    const entry = lines[idx];
    const cmdEl = document.createElement('span');
    cmdEl.className = 'terminal-line';

    if (entry.cmd !== '_') {
        cmdEl.innerHTML = `<span class="t-prompt">jason@dragonfly:~$ </span><span class="t-cmd">${entry.cmd}</span>`;
        body.appendChild(cmdEl);
    }

    setTimeout(() => {
        entry.out.forEach(line => {
            const outEl = document.createElement('span');
            outEl.className = 'terminal-line t-out';
            outEl.innerHTML = line;
            body.appendChild(outEl);
        });
        body.scrollTop = body.scrollHeight;
        setTimeout(() => typeTerminalLines(lines, idx + 1, body, callback), 250);
    }, entry.delay || 100);
}

function loadTerminalTab(tab) {
    if (terminalBusy || tab === currentTermTab) return;
    currentTermTab = tab;
    terminalBusy   = true;

    const body = document.getElementById('terminal-body');
    if (!body) return;

    body.innerHTML = '';

    // Update tab active state
    document.querySelectorAll('.term-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });

    typeTerminalLines(terminalData[tab] || [], 0, body, () => {
        // Add blinking cursor
        const cur = document.createElement('span');
        cur.className = 'terminal-line';
        cur.innerHTML = '<span class="t-prompt">jason@dragonfly:~$ </span><span class="terminal-cursor"></span>';
        body.appendChild(cur);
        body.scrollTop = body.scrollHeight;
        terminalBusy = false;
    });
}

window.loadTerminalTab = loadTerminalTab;

// Init terminal on load
document.addEventListener('DOMContentLoaded', () => {
    const body = document.getElementById('terminal-body');
    if (body) {
        terminalBusy = false;
        currentTermTab = null;
        loadTerminalTab('skills');
    }
});

// ═══════════════════════════════════════════════════════════════
// 8. AWARDS CAROUSEL
// ═══════════════════════════════════════════════════════════════
let slideIndex = 0;
const slides   = document.getElementsByClassName('award-slide');
const dots     = document.getElementsByClassName('award-dot');
const tabs     = document.getElementsByClassName('award-tab');
const counterEl = document.getElementById('award-counter');

const awardCertificates = [
    { img: 'img/primer.jpg',   title: 'Primer Lugar en Desarrollo de Software — FLIA UGB 2026',       badge: '1ER LUGAR 🥇 FLIA 2026',  badgeClass: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' },
    { img: 'img/coninfo.jpg',  title: 'Tercer Lugar Nacional — CONINFO 2026 «MakeSing» (ASPROC)',     badge: '3ER LUGAR 🥉 CONINFO 2026', badgeClass: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' },
    { img: 'img/secon.jpeg',   title: 'Segundo Lugar en Automatización y Robótica — FLIA UGB 2025',   badge: '2DO LUGAR 🥈 ROBÓTICA 2025', badgeClass: 'bg-slate-400/20 text-slate-300 border border-slate-400/40' },
    { img: 'img/tercero.jpeg', title: 'Tercer Lugar en Automatización y Robótica — FLIA UGB 2025',    badge: '3ER LUGAR 🥉 ROBÓTICA 2025', badgeClass: 'bg-amber-600/20 text-amber-500 border border-amber-600/40' },
];

function changeAward(n) { showSlides(slideIndex += n); }
function setAward(n)    { showSlides(slideIndex = n);  }

function showSlides(n) {
    if (!slides.length) return;
    if (n >= slides.length) slideIndex = 0;
    if (n < 0)              slideIndex = slides.length - 1;

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        slides[i].style.display = 'none';
        if (dots[i]) { dots[i].classList.remove('bg-primary','w-8'); dots[i].classList.add('bg-gray-700','w-3'); }
        if (tabs[i]) tabs[i].classList.remove('active');
    }

    slides[slideIndex].classList.add('active');
    slides[slideIndex].style.display = 'flex';
    if (dots[slideIndex]) { dots[slideIndex].classList.remove('bg-gray-700','w-3'); dots[slideIndex].classList.add('bg-primary','w-8'); }
    if (tabs[slideIndex]) tabs[slideIndex].classList.add('active');
    if (counterEl) counterEl.textContent = `${String(slideIndex+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
}

function openCertificateModal(idx) {
    const data = awardCertificates[idx] || awardCertificates[slideIndex];
    if (!data) return;
    const modal    = document.getElementById('certificate-modal');
    const modalImg = document.getElementById('modal-image');
    const mTitle   = document.getElementById('modal-title');
    const mBadge   = document.getElementById('modal-badge');
    if (modal && modalImg) {
        modalImg.src = data.img;
        if (mTitle) mTitle.textContent = data.title;
        if (mBadge) { mBadge.textContent = data.badge; mBadge.className = `px-3 py-1 rounded-full text-xs font-mono font-bold ${data.badgeClass}`; }
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) {
        modal.classList.remove('modal-open');
        setTimeout(() => { modal.classList.add('hidden'); document.body.style.overflow = ''; }, 280);
    }
}

// Touch swipe
const carousel = document.getElementById('awards-carousel-container');
if (carousel) {
    let tStart = 0;
    carousel.addEventListener('touchstart', e => tStart = e.changedTouches[0].screenX, { passive: true });
    carousel.addEventListener('touchend',   e => {
        const diff = e.changedTouches[0].screenX - tStart;
        if (Math.abs(diff) > 45) changeAward(diff < 0 ? 1 : -1);
    }, { passive: true });
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertificateModal(); });
if (slides.length) showSlides(slideIndex);

window.changeAward = changeAward;
window.setAward    = setAward;
window.openCertificateModal  = openCertificateModal;
window.closeCertificateModal = closeCertificateModal;

// ═══════════════════════════════════════════════════════════════
// 9. CONTACT FORM
// ═══════════════════════════════════════════════════════════════
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Enviando…';
        btn.disabled = true;
        try {
            const res = await fetch(form.action, { method: form.method, body: new FormData(form), headers: { Accept: 'application/json' } });
            if (res.ok) { form.reset(); alert('Mensaje enviado con éxito ✓'); }
            else alert('Error al enviar. Inténtalo de nuevo.');
        } catch { alert('Error de conexión.'); }
        finally { btn.innerHTML = orig; btn.disabled = false; }
    });
}

// ═══════════════════════════════════════════════════════════════
// 10. ACTIVE NAV LINK
// ═══════════════════════════════════════════════════════════════
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (pageYOffset >= sec.offsetTop - sec.clientHeight / 3) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.remove('text-white','bg-white/10','text-primary');
        if (link.getAttribute('href')?.includes(current)) link.classList.add('text-white','bg-white/10');
    });
}, { passive: true });

// ═══════════════════════════════════════════════════════════════
// 11. SKILL PROGRESS BARS (animate on scroll)
// ═══════════════════════════════════════════════════════════════
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.dataset.width || '0%';
                io.unobserve(bar);
            }
        });
    }, { threshold: .3 });
    bars.forEach(b => io.observe(b));
}
document.addEventListener('DOMContentLoaded', initSkillBars);

// ═══════════════════════════════════════════════════════════════
// 12. COUNTER ANIMATION (stats hero)
// ═══════════════════════════════════════════════════════════════
function animateCounter(el, target, suffix='', duration=1800) {
    let start = 0;
    const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-count]').forEach(el => {
                const t   = +el.dataset.count;
                const sfx = el.dataset.suffix || '';
                animateCounter(el, t, sfx);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: .5 });

const statsSection = document.getElementById('hero-stats');
if (statsSection) statsObserver.observe(statsSection);
