/**
 * COFFIKO 3D INTERACTIVE ARTISAN COFFEE POURING SCENE
 * Three.js WebGL Engine: Tilted 3D Gooseneck Kettle, Flowing Chocolate-Brown Stream,
 * Dynamic Micro-Droplet Splashes, Rising Thermal Steam & Natural Barista Micro-Shake with 3D Parallax.
 */

(function () {
  'use strict';

  let scene, camera, renderer, container, canvas;
  let kettleGroup, cupGroup, streamMesh, streamCurve;
  let droplets = [], steamParticles = [];
  let rippleMesh;
  let isVisible = true;
  let clock;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let isHovered = false;

  function init() {
    container = document.getElementById('hero3dContainer');
    canvas = document.getElementById('heroCoffeeCanvas');
    if (!container || !canvas || typeof THREE === 'undefined') return;

    clock = new THREE.Clock();

    // 1. Scene & Camera Setup
    scene = new THREE.Scene();

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 480;

    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.8);
    camera.lookAt(0, -0.1, 0);

    // 2. WebGL Renderer with High Performance & Alpha
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 3. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.85);
    scene.add(ambientLight);

    // Warm Key Light (Barista overhead warm lamp)
    const keyLight = new THREE.DirectionalLight(0xffecd2, 1.4);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    // Fill Light (Soft warm bounce from bottom-left)
    const fillLight = new THREE.DirectionalLight(0xd4af37, 0.6);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    // Rim Light (Golden specular highlights on kettle & cup)
    const rimLight = new THREE.DirectionalLight(0xffbd02, 0.9);
    rimLight.position.set(1, 4, -4);
    scene.add(rimLight);

    // Master World Group for Parallax Tilt
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 4. Build 3D Coffee Cup, Saucer & Coffee Liquid
    buildCup(worldGroup);

    // 5. Build 3D Artisan Gooseneck Kettle
    buildKettle(worldGroup);

    // 6. Build Pouring Coffee Stream
    buildPouringStream(worldGroup);

    // 7. Build Dynamic Splashing Micro-Droplets
    buildSplashes(worldGroup);

    // 8. Build Rising Hot Steam Particle System
    buildSteam(worldGroup);

    // 9. Attach Interaction Listeners
    setupInteractions();

    // 10. Pause on background/scroll-out to guarantee 60 FPS efficiency
    setupVisibilityObserver();

    // 11. Start Render Loop
    animate();
  }

  // --- 4. BUILD 3D COFFEE CUP & SAUCER ---
  function buildCup(parent) {
    cupGroup = new THREE.Group();
    cupGroup.position.set(-0.25, -1.05, 0.2);

    // Ceramic Porcelain Material
    const porcelainMat = new THREE.MeshStandardMaterial({
      color: 0xfaf6ef,
      roughness: 0.25,
      metalness: 0.12
    });

    // Golden Rim Trim Material
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2
    });

    // Dark Espresso / Wooden Coaster Base
    const coasterMat = new THREE.MeshStandardMaterial({
      color: 0x261811,
      roughness: 0.6,
      metalness: 0.15
    });

    // Saucer Base
    const saucerGeo = new THREE.CylinderGeometry(1.4, 0.9, 0.1, 48);
    const saucer = new THREE.Mesh(saucerGeo, porcelainMat);
    saucer.position.y = -0.05;
    cupGroup.add(saucer);

    // Saucer Gold Rim
    const saucerRimGeo = new THREE.TorusGeometry(1.4, 0.02, 16, 48);
    saucerRimGeo.rotateX(Math.PI / 2);
    const saucerRim = new THREE.Mesh(saucerRimGeo, goldTrimMat);
    saucerRim.position.y = 0.01;
    cupGroup.add(saucerRim);

    // Cup Body (Tapered Latte Mug)
    const cupOuterGeo = new THREE.CylinderGeometry(0.9, 0.65, 1.15, 48, 1, true);
    const cupOuter = new THREE.Mesh(cupOuterGeo, porcelainMat);
    cupOuter.position.y = 0.55;
    cupGroup.add(cupOuter);

    // Cup Bottom Cap
    const cupBottomGeo = new THREE.CircleGeometry(0.65, 48);
    cupBottomGeo.rotateX(Math.PI / 2);
    const cupBottom = new THREE.Mesh(cupBottomGeo, porcelainMat);
    cupBottom.position.y = -0.02;
    cupGroup.add(cupBottom);

    // Cup Rim (Curved lip)
    const cupRimGeo = new THREE.TorusGeometry(0.9, 0.035, 16, 48);
    cupRimGeo.rotateX(Math.PI / 2);
    const cupRim = new THREE.Mesh(cupRimGeo, goldTrimMat);
    cupRim.position.y = 1.13;
    cupGroup.add(cupRim);

    // Cup Handle (Curved Loop)
    const handleCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.85, 0.95, 0),
      new THREE.Vector3(1.5, 0.9, 0),
      new THREE.Vector3(1.4, 0.2, 0),
      new THREE.Vector3(0.68, 0.25, 0)
    );
    const handleGeo = new THREE.TubeGeometry(handleCurve, 32, 0.08, 16, false);
    const handle = new THREE.Mesh(handleGeo, porcelainMat);
    cupGroup.add(handle);

    // Rich Dark Coffee Surface
    const coffeeLiquidMat = new THREE.MeshStandardMaterial({
      color: 0x2a1308,
      roughness: 0.12,
      metalness: 0.28
    });
    const liquidGeo = new THREE.CircleGeometry(0.84, 48);
    liquidGeo.rotateX(-Math.PI / 2);
    const liquidMesh = new THREE.Mesh(liquidGeo, coffeeLiquidMat);
    liquidMesh.position.y = 0.95;
    cupGroup.add(liquidMesh);

    // Cream / Crema Swirl Ring
    const cremaMat = new THREE.MeshBasicMaterial({
      color: 0xc89666,
      transparent: true,
      opacity: 0.55
    });
    const cremaGeo = new THREE.RingGeometry(0.2, 0.55, 32);
    cremaGeo.rotateX(-Math.PI / 2);
    const cremaMesh = new THREE.Mesh(cremaGeo, cremaMat);
    cremaMesh.position.y = 0.955;
    cupGroup.add(cremaMesh);

    // Impact Ripple Mesh (Concentric wave radiating from impact)
    const rippleGeo = new THREE.RingGeometry(0.02, 0.08, 32);
    rippleGeo.rotateX(-Math.PI / 2);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0xd9a066,
      transparent: true,
      opacity: 0.8
    });
    rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
    rippleMesh.position.set(0, 0.96, 0);
    cupGroup.add(rippleMesh);

    parent.add(cupGroup);
  }

  // --- 5. BUILD 3D ARTISAN GOOSENECK KETTLE ---
  function buildKettle(parent) {
    kettleGroup = new THREE.Group();
    // Positioned in upper right, angled forward-downward pouring
    kettleGroup.position.set(1.4, 1.65, 0.3);
    kettleGroup.rotation.z = -0.58; // ~33 deg tilt
    kettleGroup.rotation.y = 0.35;
    kettleGroup.rotation.x = 0.15;

    // Metallic Titanium / Bronze Material
    const kettleBodyMat = new THREE.MeshStandardMaterial({
      color: 0x221a15,
      metalness: 0.88,
      roughness: 0.22
    });

    // Golden Accent Material for spout tip, lid knob, and rim
    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.18
    });

    // Wood/Matte Ergonomic Handle Grip
    const woodGripMat = new THREE.MeshStandardMaterial({
      color: 0x4a2818,
      roughness: 0.5,
      metalness: 0.1
    });

    // Kettle Pot Body (Tapered Gooseneck Base)
    const bodyGeo = new THREE.CylinderGeometry(0.65, 0.95, 1.4, 48);
    const body = new THREE.Mesh(bodyGeo, kettleBodyMat);
    kettleGroup.add(body);

    // Bottom Base Plate
    const baseGeo = new THREE.CylinderGeometry(0.96, 0.96, 0.08, 48);
    const baseMesh = new THREE.Mesh(baseGeo, goldAccentMat);
    baseMesh.position.y = -0.7;
    kettleGroup.add(baseMesh);

    // Kettle Lid Rim & Top Dome
    const lidRimGeo = new THREE.CylinderGeometry(0.67, 0.67, 0.08, 48);
    const lidRim = new THREE.Mesh(lidRimGeo, goldAccentMat);
    lidRim.position.y = 0.72;
    kettleGroup.add(lidRim);

    const lidDomeGeo = new THREE.SphereGeometry(0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.8);
    const lidDome = new THREE.Mesh(lidDomeGeo, kettleBodyMat);
    lidDome.position.y = 0.73;
    kettleGroup.add(lidDome);

    // Brass Knob on Top of Lid
    const knobGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const knob = new THREE.Mesh(knobGeo, goldAccentMat);
    knob.position.y = 1.05;
    kettleGroup.add(knob);

    // Gooseneck Spout (Iconic S-Curve)
    const spoutCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.7, -0.3, 0),
      new THREE.Vector3(-1.45, -0.15, 0),
      new THREE.Vector3(-1.6, 0.85, 0),
      new THREE.Vector3(-1.95, 0.75, 0) // Nozzle tip
    );
    const spoutGeo = new THREE.TubeGeometry(spoutCurve, 48, 0.09, 20, false);
    const spoutMesh = new THREE.Mesh(spoutGeo, kettleBodyMat);
    kettleGroup.add(spoutMesh);

    // Golden Spout Tip Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.15, 20);
    nozzleGeo.rotateZ(Math.PI / 3);
    const nozzle = new THREE.Mesh(nozzleGeo, goldAccentMat);
    nozzle.position.set(-1.95, 0.75, 0);
    kettleGroup.add(nozzle);

    // Kettle Handle
    const handleCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.68, 0.5, 0),
      new THREE.Vector3(1.35, 0.6, 0),
      new THREE.Vector3(1.4, -0.5, 0),
      new THREE.Vector3(0.88, -0.45, 0)
    );
    const handleGeo = new THREE.TubeGeometry(handleCurve, 32, 0.075, 16, false);
    const handleMesh = new THREE.Mesh(handleGeo, woodGripMat);
    kettleGroup.add(handleMesh);

    parent.add(kettleGroup);
  }

  // --- 6. BUILD POURING COFFEE STREAM ---
  function buildPouringStream(parent) {
    // Parabolic pouring trajectory from kettle nozzle to center of the cup
    // Spout nozzle world pos: ~ (0.05, 1.4, 0.25)
    // Cup liquid world pos: ~ (-0.25, -0.1, 0.2)
    streamCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.08, 1.52, 0.28),   // Starts at kettle spout
      new THREE.Vector3(-0.05, 1.05, 0.25),  // Flowing down curve
      new THREE.Vector3(-0.22, 0.45, 0.22),  // Acceleration gravity curve
      new THREE.Vector3(-0.25, -0.09, 0.2)   // Reaches cup surface
    );

    const streamGeo = new THREE.TubeGeometry(streamCurve, 48, 0.052, 16, false);

    // Liquid Coffee Stream Material (Rich chocolate-brown with translucent sheen)
    const streamMat = new THREE.MeshStandardMaterial({
      color: 0x4a210d,
      roughness: 0.1,
      metalness: 0.25,
      transparent: true,
      opacity: 0.94
    });

    streamMesh = new THREE.Mesh(streamGeo, streamMat);
    parent.add(streamMesh);
  }

  // --- 7. BUILD SPLASHING MICRO-DROPLETS ---
  function buildSplashes(parent) {
    const dropletCount = 45;
    const dropletGeo = new THREE.SphereGeometry(0.032, 8, 8);
    const dropletMat = new THREE.MeshStandardMaterial({
      color: 0x5a2d12,
      roughness: 0.12,
      metalness: 0.25
    });

    for (let i = 0; i < dropletCount; i++) {
      const mesh = new THREE.Mesh(dropletGeo, dropletMat);
      resetDroplet(mesh);
      // Randomize initial progress so they don't all burst in lockstep
      mesh.position.y += Math.random() * 0.4;
      parent.add(mesh);
      droplets.push(mesh);
    }
  }

  function resetDroplet(mesh) {
    // Originates from impact point inside cup
    mesh.position.set(
      -0.25 + (Math.random() - 0.5) * 0.12,
      -0.08,
      0.2 + (Math.random() - 0.5) * 0.12
    );

    // Splash outwards in all radial directions with upward velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.015 + Math.random() * 0.035;

    mesh.userData = {
      vx: Math.cos(angle) * speed,
      vy: 0.045 + Math.random() * 0.065, // Upward burst
      vz: Math.sin(angle) * speed,
      gravity: -0.0028,
      scale: 0.4 + Math.random() * 0.7,
      life: 0,
      maxLife: 35 + Math.floor(Math.random() * 30)
    };
    mesh.scale.setScalar(mesh.userData.scale);
  }

  // --- 8. BUILD RISING STEAM VAPOR ---
  function buildSteam(parent) {
    const steamCount = 50;

    // Canvas-generated procedural soft smoke circle texture
    const steamTexture = createSteamTexture();
    const steamMat = new THREE.SpriteMaterial({
      map: steamTexture,
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    for (let i = 0; i < steamCount; i++) {
      const sprite = new THREE.Sprite(steamMat.clone());
      resetSteamParticle(sprite);
      // Scatter initial height so steam is already flowing on load
      sprite.position.y += Math.random() * 1.5;
      parent.add(sprite);
      steamParticles.push(sprite);
    }
  }

  function createSteamTexture() {
    const size = 128;
    const cvs = document.createElement('canvas');
    cvs.width = size;
    cvs.height = size;
    const ctx = cvs.getContext('2d');

    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 250, 240, 0.85)');
    grad.addColorStop(0.35, 'rgba(240, 230, 215, 0.45)');
    grad.addColorStop(0.7, 'rgba(235, 225, 210, 0.12)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(cvs);
    return texture;
  }

  function resetSteamParticle(sprite) {
    // Originates from hot coffee cup surface
    sprite.position.set(
      -0.25 + (Math.random() - 0.5) * 0.4,
      -0.05 + Math.random() * 0.08,
      0.2 + (Math.random() - 0.5) * 0.4
    );

    sprite.userData = {
      vy: 0.012 + Math.random() * 0.016, // Upward drift
      driftAngle: Math.random() * Math.PI * 2,
      driftSpeed: 0.003 + Math.random() * 0.005,
      scale: 0.25 + Math.random() * 0.3,
      growthRate: 0.008 + Math.random() * 0.006,
      maxOpacity: 0.38 + Math.random() * 0.15,
      age: 0,
      lifespan: 80 + Math.floor(Math.random() * 60)
    };

    sprite.scale.set(sprite.userData.scale, sprite.userData.scale * 1.3, 1);
    sprite.material.opacity = 0;
  }

  // --- 9. INTERACTIVE MICRO-SHAKE & 3D PARALLAX TILT ---
  function setupInteractions() {
    // Mouse tracking on container
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    container.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    container.addEventListener('mouseleave', () => {
      isHovered = false;
      mouse.targetX = 0;
      mouse.targetY = 0;
    });

    // Mobile Gyroscope / DeviceOrientation support
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          mouse.targetX = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
          mouse.targetY = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
        }
      }, { passive: true });
    }

    // Responsive Canvas Resize
    window.addEventListener('resize', onWindowResize, { passive: true });
  }

  function onPointerMove(e) {
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    // Clamped coordinates from -1 to 1
    mouse.targetX = THREE.MathUtils.clamp(dx, -1.2, 1.2);
    mouse.targetY = THREE.MathUtils.clamp(dy, -1.2, 1.2);
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function setupVisibilityObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });

    observer.observe(container);
  }

  // --- 10. ANIMATION & PHYSICS TICK (60 FPS) ---
  function animate() {
    requestAnimationFrame(animate);

    if (!isVisible) return; // Zero CPU/GPU waste when scrolled off-screen

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // 1. Smooth 3D Parallax Interpolation (Lerp)
    mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.06);
    mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.06);

    camera.position.x = mouse.x * 0.45;
    camera.position.y = 1.2 - mouse.y * 0.35;
    camera.lookAt(0, -0.05, 0);

    // 2. Natural Barista Hand Micro-Shake on Kettle
    if (kettleGroup) {
      // Harmonic micro-tremor simulating liquid mass and hand-pour
      const microShake = Math.sin(time * 10.0) * 0.016 + Math.cos(time * 22.0) * 0.008;
      const breathTilt = Math.sin(time * 2.0) * 0.025;

      kettleGroup.rotation.z = -0.58 + microShake + (isHovered ? 0.05 : 0);
      kettleGroup.position.y = 1.65 + Math.sin(time * 3.5) * 0.025;
      kettleGroup.position.x = 1.4 + Math.cos(time * 2.8) * 0.015;
    }

    // 3. Coffee Cup Micro-Vibration & Ripple
    if (cupGroup) {
      cupGroup.position.y = -1.05 + Math.sin(time * 12.0) * 0.003;
    }

    // 4. Liquid Ripple Expansion
    if (rippleMesh) {
      const rippleScale = (time * 1.8) % 1.0; // 0 to 1
      rippleMesh.scale.set(1 + rippleScale * 5.0, 1 + rippleScale * 5.0, 1);
      rippleMesh.material.opacity = (1.0 - rippleScale) * 0.75;
    }

    // 5. Stream Pulsing Fluidity
    if (streamMesh) {
      const streamPulse = 1.0 + Math.sin(time * 16.0) * 0.07;
      streamMesh.scale.set(streamPulse, 1.0, streamPulse);
    }

    // 6. Splashing Micro-Droplets Physics
    for (let i = 0; i < droplets.length; i++) {
      const d = droplets[i];
      const u = d.userData;

      u.life++;
      u.vy += u.gravity; // Apply gravity

      d.position.x += u.vx;
      d.position.y += u.vy;
      d.position.z += u.vz;

      // Shrink droplet as it reaches end of arc
      const progress = u.life / u.maxLife;
      const curScale = u.scale * (1.0 - progress);
      d.scale.setScalar(Math.max(0.001, curScale));

      if (u.life >= u.maxLife || d.position.y < -0.2) {
        resetDroplet(d);
      }
    }

    // 7. Rising Hot Steam Particle Drift
    for (let i = 0; i < steamParticles.length; i++) {
      const s = steamParticles[i];
      const u = s.userData;

      u.age++;
      const progress = u.age / u.lifespan;

      // Upward motion with gentle sin/cos curl
      s.position.y += u.vy;
      s.position.x += Math.sin(u.driftAngle + time * 2.5) * u.driftSpeed;
      s.position.z += Math.cos(u.driftAngle + time * 2.0) * u.driftSpeed * 0.7;

      // Growth as steam expands
      const currentScale = u.scale + progress * 0.75;
      s.scale.set(currentScale, currentScale * 1.35, 1);

      // Smooth bell-curve opacity (fades in, then fades out into thin air)
      if (progress < 0.25) {
        s.material.opacity = (progress / 0.25) * u.maxOpacity;
      } else {
        s.material.opacity = (1.0 - progress) * u.maxOpacity;
      }

      if (u.age >= u.lifespan || s.position.y > 2.8) {
        resetSteamParticle(s);
      }
    }

    renderer.render(scene, camera);
  }

  // Auto-init on load or DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
