// LOADER
// LOADING SCREEN
const steps = [
  [15, 'loading assets...'],
  [35, 'compiling projects...'],
  [55, 'rendering skills...'],
  [75, 'calibrating matrix...'],
  [90, 'almost ready...'],
  [100, 'welcome, explorer.']
];
let stepIdx = 0;
const bar = document.getElementById('pre-bar');
const pct = document.getElementById('pre-percent');
const status = document.getElementById('pre-status');

function runLoader() {
  if (stepIdx >= steps.length) {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
    }, 400);
    return;
  }
  const [width, text] = steps[stepIdx++];
  bar.style.width = width + '%';
  pct.textContent = width + '%';
  status.textContent = text;
  setTimeout(runLoader, 320);
}
runLoader();

// CUSTOM CURSOR
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX - 4 + 'px';
  cursor.style.top = mouseY - 4 + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX - 16 + 'px';
  follower.style.top = followerY - 16 + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .project-card, .skill-tags span').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(2)';
    follower.style.transform = 'scale(1.5)';
    follower.style.opacity = '0.2';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    follower.style.transform = 'scale(1)';
    follower.style.opacity = '0.4';
  });
});

// TYPING ANIMATION
const phrases = [
  'full-stack developer',
  'AI/ML enthusiast',
  'blockchain builder',
  'sustainability advocate',
  'social impact driven'
];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const word = phrases[pi];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ci + 1);
    ci++;
    if (ci === word.length) {
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typedEl.textContent = word.slice(0, ci - 1);
    ci--;
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 45 : 90);
}
type();

// MATRIX CANVAS
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const chars = '01アイウエオカキクケコABCDEF{}[]<>/\\=+-';
const fontSize = 13;
const cols = Math.floor(canvas.width / fontSize);
const drops = Array(cols).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(13,17,23,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#58a6ff';
  ctx.font = fontSize + 'px Fira Code';
  drops.forEach((y, i) => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(char, i * fontSize, y * fontSize);
    if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 50);
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// SCROLL ANIMATIONS
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .ach-card, .info-card, .timeline-item, .skill-group').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// NAVBAR SCROLL
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.4)' : 'none';
});

// DARK / LIGHT MODE
const toggle = document.getElementById('theme-toggle');
const saved = localStorage.getItem('theme');
if (saved === 'light') {
  document.body.classList.add('light-mode');
  toggle.textContent = '☀️';
}
toggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  toggle.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// HAMBURGER MENU
document.getElementById('hamburger').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  links.style.flexDirection = 'column';
  links.style.position = 'absolute';
  links.style.top = '60px'; links.style.right = '20px';
  links.style.background = '#161b22';
  links.style.padding = '16px'; links.style.borderRadius = '8px';
  links.style.border = '1px solid #30363d';
});
// EASTER EGG — KONAMI CODE ↑↑↓↓←→←→BA
(function () {
  const code = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let idx = 0;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(13,17,23,0.96);
    z-index: 99999;
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
    font-family: Fira Code, monospace;
    text-align: center;
  `;
  overlay.innerHTML = `
    <div style="font-size:clamp(40px,8vw,72px)">🎮</div>
    <div style="font-size:clamp(18px,4vw,28px);color:#58a6ff;font-weight:600;">
      cheat code activated
    </div>
    <div style="font-size:13px;color:#8b949e;max-width:360px;line-height:1.8;">
      you found the easter egg.<br/>
      clearly you pay attention to detail —<br/>
      <span style="color:#3fb950">exactly the kind of person i want to work with.</span>
    </div>
    <div style="font-size:12px;color:#6e7681;margin-top:8px;">
      → vedikakapoor.work@gmail.com
    </div>
    <button id="close-egg" style="
      margin-top:16px;
      background:transparent;
      border:1px solid #30363d;
      color:#8b949e;
      padding:10px 24px;
      border-radius:6px;
      font-family:Fira Code,monospace;
      font-size:12px;
      cursor:pointer;
    ">esc to close</button>
  `;
  document.body.appendChild(overlay);

  document.getElementById('close-egg')
    .addEventListener('click', () => overlay.style.display = 'none');

  document.addEventListener('keydown', e => {
    if (e.key === code[idx]) {
      idx++;
      if (idx === code.length) {
        overlay.style.display = 'flex';
        idx = 0;
      }
    } else {
      idx = 0;
    }
    if (e.key === 'Escape') overlay.style.display = 'none';
  });
})();