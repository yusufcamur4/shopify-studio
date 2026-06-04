// Sinematik 3B hero objesi (three.js) — dönen altın kristal + bloom + parçacık + fare etkileşimi
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export function initHero3D() {
  const canvas = document.getElementById('hero3d');
  if (!canvas) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  // ortam yansıması (stüdyo) — metalik yüzey için
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  // grup (fare ile döndürmek için) — sağa/aşağıya hafif kaydır (metinle çakışmasın)
  const group = new THREE.Group();
  group.position.set(0.7, 0, 0);
  scene.add(group);

  // "</>" kod simgesi — yazılım/web işimizi temsil eder
  const mat = new THREE.MeshStandardMaterial({
    color: 0xE8B04B, metalness: 1, roughness: 0.22, envMapIntensity: 1.25,
  });
  const T = 0.24; // bar kalınlığı
  const D = (deg) => THREE.MathUtils.degToRad(deg);
  const bar = (len, x, y, rotZ) => {
    const m = new THREE.Mesh(new RoundedBoxGeometry(len, T, T, 4, T * 0.48), mat);
    m.position.set(x, y, 0); m.rotation.z = rotZ; return m;
  };
  // "<"  (sol chevron, vertex solda)
  group.add(bar(1.18, -1.18, 0.36, D(38)));
  group.add(bar(1.18, -1.18, -0.36, D(-38)));
  // "/"  (orta eğik çizgi)
  group.add(bar(1.9, 0, 0, D(61)));
  // ">"  (sağ chevron, vertex sağda)
  group.add(bar(1.18, 1.18, 0.36, D(142)));
  group.add(bar(1.18, 1.18, -0.36, D(-142)));

  // parçacık tozu
  const COUNT = 240;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = 3 + Math.random() * 4;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(p) * Math.cos(t);
    pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
    pos[i * 3 + 2] = r * Math.cos(p);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xE8B04B, size: 0.03, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(particles);

  // ışıklar
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xfff0d0, 2.2); key.position.set(4, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xE8B04B, 1.6); rim.position.set(-6, -2, -4); scene.add(rim);

  // bloom (parıltı)
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.5, 0.65);
  composer.addPass(bloom);

  // boyutlandırma — hero alanına göre
  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); // updateStyle=false → CSS boyutu korunur
    composer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size();
  const ro = new ResizeObserver(size); ro.observe(canvas);

  // fare etkileşimi
  let mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  const clock = new THREE.Clock();
  function frame() {
    // hero görünür değilse (başka sayfadayız) render etme — GPU tasarrufu
    if (canvas.offsetParent === null) { requestAnimationFrame(frame); return; }
    const t = clock.getElapsedTime();
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    // tam dönme yerine salınım → "</>" okunaklı kalır, yine de 3B/canlı
    group.rotation.y = Math.sin(t * 0.45) * 0.5 + mx * 0.45;
    group.rotation.x = Math.sin(t * 0.3) * 0.08 - my * 0.3;
    group.scale.setScalar(1 + Math.sin(t * 1.1) * 0.03); // nabız
    particles.rotation.y = t * 0.03;
    composer.render();
    requestAnimationFrame(frame);
  }
  if (reduce) { composer.render(); } // hareketsiz tek kare
  else requestAnimationFrame(frame);
}
