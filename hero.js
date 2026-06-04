import * as THREE from 'three';
import { vertexShader, fluidFragmentShader, displayFragmentShader } from './shaders.js';

const CONFIG = {
  simSize: 500, decay: 0.97, lineWidth: 0.09, perFrameIntensity: 0.3,
  revealThreshold: 0.02, edgeWidthBase: 0.004,
  haloUpperMul: 2.0, haloMixStrength: 0.35, haloGold: [0.91, 0.69, 0.29],
  idleThresholdMs: 2500, idleEaseInMs: 1500, autoLerp: 0.05,
  stopAfterMs: 50, maxTextureSize: 4096,
};

export function initHero() {
  const canvas = document.querySelector('.hero canvas');
  if (!canvas) { console.warn('[hero] canvas bulunamadı'); return; }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, precision: 'highp' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);

  // 3. Scene + camera
  const scene = new THREE.Scene();
  const simScene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // 4. Ping-pong render targets (FloatType → HalfFloatType fallback)
  const gl = renderer.getContext();
  let texType = THREE.FloatType;
  const hasFloatLinear = !!gl.getExtension('OES_texture_float_linear') ||
    !!gl.getExtension('EXT_color_buffer_float');
  if (!hasFloatLinear) {
    const hasHalf = !!gl.getExtension('OES_texture_half_float_linear') ||
      !!gl.getExtension('EXT_color_buffer_half_float');
    if (hasHalf) {
      texType = THREE.HalfFloatType;
      console.warn('[hero] FloatType desteklenmiyor, HalfFloatType kullanılıyor');
    } else {
      texType = THREE.HalfFloatType;
      console.error('[hero] Float doku desteği yok; HalfFloatType ile deneniyor, görsel düşebilir');
    }
  }

  function makeTarget() {
    return new THREE.WebGLRenderTarget(CONFIG.simSize, CONFIG.simSize, {
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat, type: texType,
    });
  }
  const pingPong = [makeTarget(), makeTarget()];
  let currentTarget = 0;
  // başta ikisini de temizle
  for (const t of pingPong) {
    renderer.setRenderTarget(t);
    renderer.clear();
  }
  renderer.setRenderTarget(null);

  // 5. State
  const mouse = new THREE.Vector2(0.5, 0.5);
  const prevMouse = new THREE.Vector2(0.5, 0.5);
  let isMoving = false;
  let lastMoveTime = 0; // sayfa açılışında iz kendiliğinden uyansın

  // 6. Placeholder textures
  function solidTexture(r, g, b) {
    const c = document.createElement('canvas');
    c.width = c.height = 2;
    const ctx = c.getContext('2d');
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, 2, 2);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }
  const topTexture = solidTexture(0, 0, 255);
  const bottomTexture = solidTexture(255, 0, 0);

  // 8. Materials
  const trailsMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: fluidFragmentShader,
    uniforms: {
      uPrevTrails: { value: null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(CONFIG.simSize, CONFIG.simSize) },
      uDecay: { value: CONFIG.decay },
      uIsMoving: { value: false },
    },
  });

  const displayMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: displayFragmentShader,
    uniforms: {
      uFluid: { value: null },
      uTopTexture: { value: topTexture },
      uBottomTexture: { value: bottomTexture },
      uResolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
      uTopTextureSize: { value: new THREE.Vector2(0, 0) },
      uBottomTextureSize: { value: new THREE.Vector2(0, 0) },
      uDpr: { value: dpr },
    },
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const simMesh = new THREE.Mesh(geometry, trailsMaterial);
  const displayMesh = new THREE.Mesh(geometry, displayMaterial);
  simScene.add(simMesh);
  scene.add(displayMesh);

  // 7. Gerçek görselleri yükle
  function loadImage(src, uniform, sizeUniform, label) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let source = img;
      let w = img.naturalWidth, h = img.naturalHeight;
      const max = CONFIG.maxTextureSize;
      if (w > max || h > max) {
        const scale = Math.min(max / w, max / h);
        const oc = document.createElement('canvas');
        oc.width = Math.round(w * scale);
        oc.height = Math.round(h * scale);
        oc.getContext('2d').drawImage(img, 0, 0, oc.width, oc.height);
        source = oc; w = oc.width; h = oc.height;
      }
      const tex = new THREE.Texture(source);
      tex.needsUpdate = true;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      displayMaterial.uniforms[uniform].value = tex;
      displayMaterial.uniforms[sizeUniform].value.set(w, h);
      console.log(`[hero] ${label} yüklendi (${w}×${h})`);
    };
    img.onerror = () => console.error(`[hero] ${label} yüklenemedi: ${src}`);
    img.src = src;
  }
  loadImage('/store_plain.svg', 'uTopTexture', 'uTopTextureSize', 'store_plain');
  loadImage('/store_premium.svg', 'uBottomTexture', 'uBottomTextureSize', 'store_premium');

  // IDLE AUTO-TRAIL state
  const autoMouse = new THREE.Vector2(0.5, 0.5);
  const prevAutoMouse = new THREE.Vector2(0.5, 0.5);

  // INPUT
  function onMove(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const inside = clientX >= rect.left && clientX <= rect.right &&
      clientY >= rect.top && clientY <= rect.bottom;
    if (inside) {
      prevMouse.copy(mouse);
      mouse.x = (clientX - rect.left) / rect.width;
      mouse.y = 1.0 - (clientY - rect.top) / rect.height;
      isMoving = true;
      lastMoveTime = performance.now();
    } else {
      isMoving = false;
      // dışarıdayken lastMoveTime'a dokunma → auto-trail çalışmaya devam etsin
    }
  }
  window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length) {
      onMove(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    }
  }, { passive: false });

  // RESIZE
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    const d = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(d);
    displayMaterial.uniforms.uResolution.value.set(window.innerWidth * d, window.innerHeight * d);
    displayMaterial.uniforms.uDpr.value = d;
  });

  // RENDER LOOP
  function frame() {
    const now = performance.now();
    if (isMoving && now - lastMoveTime > CONFIG.stopAfterMs) isMoving = false;
    const idleTime = now - lastMoveTime;
    const autoActive = !reducedMotion && idleTime > CONFIG.idleThresholdMs;

    const prevT = pingPong[currentTarget];
    currentTarget = (currentTarget + 1) % 2;
    const writeTarget = pingPong[currentTarget];
    trailsMaterial.uniforms.uPrevTrails.value = prevT.texture;

    if (autoActive) {
      const easeIn = Math.min(1, (idleTime - CONFIG.idleThresholdMs) / CONFIG.idleEaseInMs);
      const tt = now * 0.001;
      const targetX = 0.5 + 0.30 * Math.sin(tt * 0.41) + 0.12 * Math.sin(tt * 0.93 + 1.3);
      const targetY = 0.5 + 0.28 * Math.cos(tt * 0.37 + 0.5) + 0.10 * Math.cos(tt * 1.11 + 2.7);
      prevAutoMouse.copy(autoMouse);
      autoMouse.x += (targetX - autoMouse.x) * CONFIG.autoLerp * easeIn;
      autoMouse.y += (targetY - autoMouse.y) * CONFIG.autoLerp * easeIn;
      trailsMaterial.uniforms.uMouse.value.copy(autoMouse);
      trailsMaterial.uniforms.uPrevMouse.value.copy(prevAutoMouse);
      trailsMaterial.uniforms.uIsMoving.value = true;
      mouse.copy(autoMouse); prevMouse.copy(prevAutoMouse);
    } else {
      trailsMaterial.uniforms.uMouse.value.copy(mouse);
      trailsMaterial.uniforms.uPrevMouse.value.copy(prevMouse);
      trailsMaterial.uniforms.uIsMoving.value = isMoving;
      autoMouse.copy(mouse); prevAutoMouse.copy(mouse);
    }

    renderer.setRenderTarget(writeTarget);
    renderer.render(simScene, camera);
    displayMaterial.uniforms.uFluid.value = writeTarget.texture;
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  console.log('[hero] başlatıldı');
}
