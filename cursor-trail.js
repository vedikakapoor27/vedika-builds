// cursor-trail.js
(function () {
  const COLORS = ['#58a6ff', '#3fb950', '#bc8cff', '#f78166', '#e3b341'];
  const trails = [];
  const MAX = 20;

  for (let i = 0; i < MAX; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      pointer-events: none;
      border-radius: 50%;
      z-index: 9997;
      transition: opacity 0.3s;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(dot);
    trails.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    let x = mouseX, y = mouseY;
    trails.forEach((t, i) => {
      const next = trails[i - 1];
      t.x = next ? next.x + (x - next.x) * 0.6 : x;
      t.y = next ? next.y + (y - next.y) * 0.6 : y;
      const size = Math.max(2, (MAX - i) * 0.7);
      const opacity = (MAX - i) / MAX * 0.7;
      t.el.style.cssText += `
        left: ${t.x}px;
        top: ${t.y}px;
        width: ${size}px;
        height: ${size}px;
        opacity: ${opacity};
        background: ${COLORS[i % COLORS.length]};
      `;
      x = t.x; y = t.y;
    });
    requestAnimationFrame(animate);
  }
  animate();
})();