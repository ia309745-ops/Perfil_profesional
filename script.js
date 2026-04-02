/* ============================================
   ISMAEL LUNA — script.js
   • Dark/Light toggle
   • Mobile menu
   • Scroll reveal
   • Skill bar animation
   • Radar chart (Canvas API, no deps)
   ============================================ */

// ─── THEME TOGGLE ──────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  setTimeout(() => { drawRadar(); }, 50);
});

// ─── MOBILE MENU ───────────────────────────────
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Close on outside click
document.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ─── SMOOTH SCROLL ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── SCROLL REVEAL ─────────────────────────────
const revealEls = document.querySelectorAll(
  '.hero-text, .hero-visual, .about-text, .about-xp, .radar-wrap, .skill-groups, .project-card, .contact-link, .contact-sub'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80 * i);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ─── SKILL BAR ANIMATION ───────────────────────
function animateBars() {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    bar.classList.add('animated');
  });
}

// Observe the skills section container, not the tiny bars themselves
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const barObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateBars();
      barObserver.disconnect();
    }
  }, { threshold: 0.1 });
  barObserver.observe(skillsSection);
}

// ─── NAVBAR SCROLL EFFECT ──────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.borderBottomColor = 'var(--border)';
  } else {
    navbar.style.borderBottomColor = 'transparent';
  }
});

// ─── RADAR CHART ───────────────────────────────
function drawRadar() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  // Use fixed 380×380 — matches the HTML width/height attributes
  const SIZE = 380;
  canvas.width  = SIZE;
  canvas.height = SIZE;

  const ctx = canvas.getContext('2d');
  const cx  = SIZE / 2;
  const cy  = SIZE / 2;
  const R   = SIZE * 0.30; // radius of chart area

  const isDark     = document.documentElement.getAttribute('data-theme') !== 'light';
  const gridColor  = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)';
  const labelColor = isDark ? 'rgba(200,200,200,0.80)' : 'rgba(30,30,30,0.75)';
  const accent     = '#00c9b1';
  const accentFill = 'rgba(0,201,177,0.18)';

  const skills = [
    { label: 'QGIS',       value: 0.95 },
    { label: 'Dron/3D',    value: 0.90 },
    { label: 'Diseño UI',  value: 0.88 },
    { label: 'JavaScript', value: 0.90 },
    { label: 'ArcGIS',     value: 0.80 },
    { label: 'GeoDa',      value: 0.75 },
    { label: 'Metashape',  value: 0.90 },
    { label: 'ProCreate',  value: 0.90 },
  ];

  const n     = skills.length;
  const step  = (Math.PI * 2) / n;
  const start = -Math.PI / 2;

  ctx.clearRect(0, 0, SIZE, SIZE);

  // ── Grid rings ──
  for (let ring = 1; ring <= 5; ring++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = start + i * step;
      const r = R * (ring / 5);
      i === 0 ? ctx.moveTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r)
              : ctx.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
    }
    ctx.closePath();
    ctx.strokeStyle = gridColor; ctx.lineWidth = 1; ctx.stroke();
  }

  // ── Spokes ──
  for (let i = 0; i < n; i++) {
    const a = start + i * step;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a)*R, cy + Math.sin(a)*R);
    ctx.strokeStyle = gridColor; ctx.lineWidth = 1; ctx.stroke();
  }

  // ── Data polygon ──
  ctx.beginPath();
  skills.forEach((s, i) => {
    const a = start + i * step;
    const r = R * s.value;
    i === 0 ? ctx.moveTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r)
            : ctx.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
  });
  ctx.closePath();
  ctx.fillStyle = accentFill; ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.stroke();

  // ── Dots ──
  skills.forEach((s, i) => {
    const a = start + i * step;
    const r = R * s.value;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a)*r, cy + Math.sin(a)*r, 5, 0, Math.PI*2);
    ctx.fillStyle = accent; ctx.fill();
  });

  // ── Labels ──
  ctx.font = 'bold 11px sans-serif'; // sans-serif guaranteed to render
  ctx.fillStyle = labelColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  skills.forEach((s, i) => {
    const a = start + i * step;
    const lr = R + 34;
    ctx.fillText(s.label, cx + Math.cos(a)*lr, cy + Math.sin(a)*lr);
  });
}

// Draw on every possible trigger
window.addEventListener('load',   drawRadar);
document.addEventListener('DOMContentLoaded', drawRadar);
setTimeout(drawRadar, 500);   // safety net fallback
window.addEventListener('resize', drawRadar);

const radarCanvas = document.getElementById('radarChart');
if (radarCanvas) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { drawRadar(); setTimeout(drawRadar, 200); }
  }, { threshold: 0.1 }).observe(radarCanvas);
}


// ─── INIT ──────────────────────────────────────
window.addEventListener('load', () => {
  document.querySelector('.hero-text')?.classList.add('visible');
  setTimeout(() => {
    document.querySelector('.hero-visual')?.classList.add('visible');
  }, 200);
});

// ─── GLOW EFFECT ───────────────────────────────
document.querySelectorAll('.glow-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ─── LAZY IFRAMES ──────────────────────────────
document.querySelectorAll('.lazy-iframe').forEach(container => {
  const btn = container.querySelector('.iframe-load-btn');
  if(btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const src = container.getAttribute('data-src');
      container.innerHTML = `<iframe src="${src}" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
      <div class="iframe-overlay">
        <a href="${src}" target="_blank" class="iframe-open-btn">Abrir Externo ↗</a>
      </div>`;
    });
  }
});