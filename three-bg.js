// three-bg.js
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'three-bg';
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: -1; pointer-events: none;
  `;
  document.body.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // PARTICLES
  const count = 3000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
    colors[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // FLOATING GEOMETRIC SHAPES
  const shapes = [];
  const shapeGeometries = [
    new THREE.OctahedronGeometry(0.3),
    new THREE.TetrahedronGeometry(0.3),
    new THREE.IcosahedronGeometry(0.25),
    new THREE.BoxGeometry(0.4, 0.4, 0.4)
  ];

  for (let i = 0; i < 12; i++) {
    const geo = shapeGeometries[i % shapeGeometries.length];
    const mat = new THREE.MeshBasicMaterial({
      color: i % 3 === 0 ? 0x58a6ff : i % 3 === 1 ? 0x3fb950 : 0xbc8cff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    shapes.push(mesh);
    scene.add(mesh);
  }

  // CONNECTING LINES
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x58a6ff, transparent: true, opacity: 0.06
  });
  for (let i = 0; i < 30; i++) {
    const points = [
      new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 6),
      new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 6)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    scene.add(new THREE.Line(lineGeo, lineMaterial));
  }

  // MOUSE INTERACTION
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  // ANIMATE
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame += 0.003;

    particles.rotation.y = frame * 0.08;
    particles.rotation.x = frame * 0.04;

    shapes.forEach((s, i) => {
      s.rotation.x += 0.003 + i * 0.0003;
      s.rotation.y += 0.005 + i * 0.0002;
      s.position.y += Math.sin(frame + i) * 0.002;
    });

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();