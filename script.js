/* ===== MATRIX CANVAS ===== */
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
const fontSize = 13;
let drops = Array(Math.floor(canvas.width / fontSize)).fill(1);

window.addEventListener('resize', () => {
  drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
});

function drawMatrix() {
  ctx.fillStyle = 'rgba(8, 12, 18, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize}px JetBrains Mono, monospace`;
  drops.forEach((y, i) => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    const brightness = Math.random() > 0.95 ? 1 : 0.4;
    ctx.fillStyle = `rgba(0, 255, 135, ${brightness})`;
    ctx.fillText(char, i * fontSize, y * fontSize);
    if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 55);

/* ===== NAVBAR SCROLL ===== */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.borderBottomColor = window.scrollY > 60
    ? 'rgba(0, 255, 135, 0.14)'
    : 'rgba(255,255,255,0.07)';
});

/* ===== ACTIVE NAV ON SCROLL ===== */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

let isThrottled = false;
window.addEventListener('scroll', () => {
  if (isThrottled) return;
  isThrottled = true;
  requestAnimationFrame(() => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - s.clientHeight / 3)
        current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
    isThrottled = false;
  });
});

/* ===== SCROLL REVEAL ===== */
// Sections slide up
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(s => sectionObserver.observe(s));

// Cards stagger inside sections
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in-view'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card, .cert-card, .timeline-item').forEach(el => {
  cardObserver.observe(el);
});

/* ===== SKILL BAR ANIMATION ON SCROLL ===== */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting)
      entry.target.style.animationPlayState = 'running';
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-fill').forEach(b => barObserver.observe(b));

/* ===== TERMINAL TYPING EFFECT ===== */
const terminalLines = document.querySelectorAll('.terminal-output');
terminalLines.forEach((line, i) => {
  const html = line.innerHTML;
  line.innerHTML = '';
  line.style.opacity = '0';
  setTimeout(() => {
    line.style.opacity = '1';
    line.innerHTML = html;
  }, 900 + i * 420);
});

/* ===== FLOATING DATA NODES ===== */
(function spawnNodes() {
  const bg = document.createElement('div');
  bg.className = 'cyber-nodes';
  document.body.appendChild(bg);
  for (let i = 0; i < 20; i++) {
    const node = document.createElement('div');
    node.className = 'data-node';
    node.style.left   = `${Math.random() * 100}%`;
    node.style.top    = `${Math.random() * 100}%`;
    node.style.setProperty('--dur',   `${7 + Math.random() * 10}s`);
    node.style.setProperty('--delay', `${Math.random() * 9}s`);
    const size = 2 + Math.random() * 4;
    node.style.width  = `${size}px`;
    node.style.height = `${size}px`;
    bg.appendChild(node);
  }
})();

/* ===== PIXEL MOUSE TRAIL ===== */
let lastX = 0, lastY = 0, trailThrottle = false;
document.addEventListener('mousemove', e => {
  if (trailThrottle) return;
  trailThrottle = true;
  requestAnimationFrame(() => { trailThrottle = false; });

  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  if (Math.sqrt(dx*dx + dy*dy) < 6) return;
  lastX = e.clientX; lastY = e.clientY;

  const count = Math.floor(Math.random() * 2) + 1;
  for (let n = 0; n < count; n++) {
    const p = document.createElement('div');
    p.className = 'mouse-pixel';
    p.style.left = `${e.clientX + (Math.random()*16-8)}px`;
    p.style.top  = `${e.clientY + (Math.random()*16-8)}px`;
    const colors = ['#00ff87','#00e07a','#22d3ee','#00ffcc','#39ff14'];
    const c    = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 5 + 3;
    p.style.width      = `${size}px`;
    p.style.height     = `${size}px`;
    p.style.background = c;
    p.style.boxShadow  = `0 0 6px ${c}, 0 0 12px ${c}`;
    p.style.setProperty('--tx', `${(Math.random()-.5)*40}px`);
    p.style.setProperty('--ty', `${(Math.random()-.5)*40 - 20}px`);
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
});

/* ===== CYBER RETICLE CURSOR ===== */
const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursorDot);

// Build reticle
const reticle = document.createElement('div');
reticle.className = 'cyber-reticle';
reticle.innerHTML = `
  <div class="reticle-corner tl"></div>
  <div class="reticle-corner tr"></div>
  <div class="reticle-corner bl"></div>
  <div class="reticle-corner br"></div>
  <div class="reticle-dot"></div>
  <div class="reticle-h"></div>
  <div class="reticle-v"></div>
  <div class="reticle-scan"></div>
`;
document.body.appendChild(reticle);

let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

document.addEventListener('mousemove', e => {
  dotX = e.clientX; dotY = e.clientY;
  cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
});

function animateReticle() {
  ringX += (dotX - ringX) * 0.12;
  ringY += (dotY - ringY) * 0.12;
  reticle.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateReticle);
}
animateReticle();

