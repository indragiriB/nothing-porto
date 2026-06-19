// ===================================================
// NOTHING OS PORTFOLIO — SCRIPT.JS
// ===================================================

function pad(num) {
  return num.toString().padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     1. THEME TOGGLE (DARK / LIGHT)
  --------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const toggleLabel = document.getElementById('toggleLabel');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggleLabel.textContent = theme === 'light' ? 'LIGHT' : 'DARK';
    localStorage.setItem('portfolio-theme', theme);
  }

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------------------------------------------------
     2. DYNAMIC AGE CALCULATOR (Birthdate: Feb 13, 2007)
  --------------------------------------------------- */
  function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    return age;
  }

  const birthDate = new Date(2007, 1, 13);
  const currentAge = calculateAge(birthDate);
  const ageValueEl = document.getElementById('ageValue');
  const ageDisplayEl = document.getElementById('ageDisplay');
  if (ageValueEl) ageValueEl.textContent = currentAge;
  if (ageDisplayEl) ageDisplayEl.textContent = currentAge;

  /* ---------------------------------------------------
     3. NOTHING LOCKSCREEN LIVE CLOCK
  --------------------------------------------------- */
  const hoursEl = document.getElementById('clockHours');
  const minutesEl = document.getElementById('clockMinutes');
  const secondsEl = document.getElementById('clockSeconds');
  const dateEl = document.getElementById('clockDate');

  function updateClock() {
    const now = new Date();
    hoursEl.textContent = pad(now.getHours());
    minutesEl.textContent = pad(now.getMinutes());
    secondsEl.textContent = pad(now.getSeconds());
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', dateOptions).toUpperCase();
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ---------------------------------------------------
     4. SESSION UPTIME (time since page loaded)
  --------------------------------------------------- */
  function initSessionUptime() {
    const startTime = Date.now();
    const uptimeEls = document.querySelectorAll('.live-uptime');
    if (!uptimeEls.length) return;

    function tick() {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const h = pad(Math.floor(diff / 3600));
      const m = pad(Math.floor((diff % 3600) / 60));
      const s = pad(diff % 60);
      uptimeEls.forEach((el) => { el.textContent = `${h}:${m}:${s}`; });
    }
    tick();
    setInterval(tick, 1000);
  }
  initSessionUptime();

  /* ---------------------------------------------------
     5. SKILL DOT-RATING RENDERER
  --------------------------------------------------- */
  function renderSkillDots() {
    document.querySelectorAll('.skill-dots').forEach((container) => {
      const level = parseInt(container.dataset.level, 10) || 0;
      const max = parseInt(container.dataset.max, 10) || 5;
      container.innerHTML = '';
      for (let i = 0; i < max; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i < level ? ' filled' : '');
        container.appendChild(dot);
      }
    });
  }
  renderSkillDots();

  /* ---------------------------------------------------
     6. GLYPH STRIP GENERATOR
  --------------------------------------------------- */
  function renderGlyphStrip() {
    const strip = document.getElementById('glyphStrip');
    if (!strip) return;
    const count = 28;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      dot.className = 'glyph-dot';
      dot.style.animationDelay = `${i * 0.08}s`;
      strip.appendChild(dot);
    }
  }
  renderGlyphStrip();

  /* ---------------------------------------------------
     7. SIDE DOT-NAV (SCROLLSPY + SMOOTH SCROLL)
  --------------------------------------------------- */
  function initDotNav() {
    const navItems = document.querySelectorAll('.dot-nav-item');
    if (!navItems.length) return;

    const sections = Array.from(navItems)
      .map((item) => document.getElementById(item.dataset.target))
      .filter(Boolean);

    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        const target = document.getElementById(item.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navItems.forEach((item) => item.classList.remove('active'));
            const activeItem = document.querySelector(
              `.dot-nav-item[data-target="${entry.target.id}"]`
            );
            if (activeItem) activeItem.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }
  initDotNav();

  /* ---------------------------------------------------
     8. CUSTOM CURSOR (DOT + RING)
  --------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (hasFinePointer && cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    function bindHoverTargets() {
      const hoverTargets = document.querySelectorAll('[data-cursor="hover"], a, button, .pill');
      hoverTargets.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursorDot.classList.add('cursor-hover');
          cursorRing.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
          cursorDot.classList.remove('cursor-hover');
          cursorRing.classList.remove('cursor-hover');
        });
      });
    }
    bindHoverTargets();

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '0.5';
    });
  } else if (cursorDot && cursorRing) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  /* ---------------------------------------------------
     9. FOOTER — AUTO YEAR
  --------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});