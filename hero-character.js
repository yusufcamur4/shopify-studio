// 3B karakter hero — uzay boşluğu arka plan + dik duruş (kollar ~30° açık) + kafa ile imleç takibi
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Mixamo iskeleti — kafa/boyun + kol kemiklerini ada göre yakala
const RIG = {
  head:  /head$/i,
  neck:  /neck$/i,
  arm:   /right.?arm$|rightupperarm/i,
  fore:  /right.?forearm|rightlowerarm/i,
  armL:  /left.?arm$|leftupperarm/i,
  foreL: /left.?forearm|leftlowerarm/i,
};

const V = (x, y, z) => new THREE.Vector3(x, y, z);

export function initHeroCharacter(modelUrl) {
  const canvas = document.getElementById('hero3d');
  if (!canvas) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.4, 7.4);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xfff2dc, 2.2); key.position.set(3, 6, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xE8B04B, 2.4); rim.position.set(-6, 2, -4); scene.add(rim);

  // ===== UZAY BOŞLUĞU ARKA PLAN =====
  // yıldız alanı
  const STAR = 700;
  const sPos = new Float32Array(STAR * 3);
  for (let i = 0; i < STAR; i++) {
    sPos[i * 3] = (Math.random() - 0.5) * 26;
    sPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
    sPos[i * 3 + 2] = -2 - Math.random() * 14;
  }
  const sGeo = new THREE.BufferGeometry(); sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const stars = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xbfae8a, size: 0.035, transparent: true, opacity: 0.7, depthWrite: false }));
  scene.add(stars);

  // akan meteorlar (çizgi izli)
  const METEOR = 16;
  const meteors = [];
  const mMat = new THREE.LineBasicMaterial({ color: 0xE8B04B, transparent: true, opacity: 0.8 });
  for (let i = 0; i < METEOR; i++) {
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.9, -0.5, 0)]);
    const ln = new THREE.Line(g, mMat.clone());
    const reset = () => { ln.position.set(4 + Math.random() * 10, 4 + Math.random() * 5, -1 - Math.random() * 8); ln.userData.v = 6 + Math.random() * 10; ln.material.opacity = 0.3 + Math.random() * 0.6; };
    reset(); ln.userData.reset = reset; scene.add(ln); meteors.push(ln);
  }

  // ===== bloom =====
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.6, 0.8));

  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); composer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size(); new ResizeObserver(size).observe(canvas);

  // imleç
  const ndc = new THREE.Vector2(0, 0);
  window.addEventListener('mousemove', (e) => {
    ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    ndc.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  // ===== karakter =====
  let model = null, mixer = null, head = null, neck = null;
  const bones = {};        // RIG anahtarı -> kemik
  let arms = [];           // kol segmentleri (dünya-uzayı nişan)
  let baseY = 0, modelX = 2.4, ready = false;

  // KOLLAR: gövde-yerel yön hedefleri (gövde dönüşüyle birlikte döner).
  // +X = karakterin sağı, -Y = aşağı, +Z = öne. Z=0 → eller ne öne ne arkaya,
  // tam yana (gövdenin dışına) ~30° açılır. x/y ≈ tan30° = 0.577.
  const ARM = {
    arm:   V(-1.15, -2.0, 0),      // sağ üst kol — yanal yön ters çevrildi
    fore:  V(-1.25, -2.2, 0),      // sağ ön kol
    armL:  V( 1.15, -2.0, 0),      // sol üst kol
    foreL: V( 1.25, -2.2, 0),      // sol ön kol
  };

  // bir kemiğin "uzama eksenini" (rest) verilen dünya-yönüne nişanla
  const rest = new WeakMap();
  function computeRest(bone) { const ch = bone?.children.find((x) => x.isBone); if (bone && ch) rest.set(bone, ch.position.clone().normalize()); }
  const _dir = new THREE.Vector3(), _pq = new THREE.Quaternion(), _q = new THREE.Quaternion(), _aim = new THREE.Vector3();
  function aimDir(bone, worldDir, k) {
    const r = rest.get(bone); if (!r || !bone || !bone.parent) return;
    bone.parent.getWorldQuaternion(_pq);
    _dir.copy(worldDir).normalize().applyQuaternion(_pq.invert());
    bone.quaternion.slerp(_q.setFromUnitVectors(r, _dir), k);
  }

  const onLoaded = (object, anims) => {
    model = object;
    let box = new THREE.Box3().setFromObject(model);
    const sz = box.getSize(new THREE.Vector3());
    const s = 4.0 / (sz.y || 1); model.scale.setScalar(s); model.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(model);
    const c = box.getCenter(new THREE.Vector3());
    model.position.sub(c);
    model.position.y -= sz.y * s * 0.12;
    baseY = model.position.y; modelX = 2.4;
    model.position.set(modelX, baseY, 0);   // dik, yerinde dur (iniş yok)
    scene.add(model);
    if (anims && anims.length) { mixer = new THREE.AnimationMixer(model); mixer.clipAction(anims.find((a) => /idle|breath/i.test(a.name)) || anims[0]).play(); }
    model.traverse((o) => {
      if (!o.isBone) return;
      for (const key in RIG) { if (!bones[key] && RIG[key].test(o.name)) bones[key] = o; }
    });
    head = bones.head; neck = bones.neck;
    // KOLLAR: ~30° açık duruş için rest eksenini hesapla
    arms = ['arm', 'fore', 'armL', 'foreL']
      .filter((key) => bones[key] && ARM[key])
      .map((key) => { computeRest(bones[key]); return { key, bone: bones[key], dir: ARM[key] }; })
      .filter((a) => rest.has(a.bone));
    ready = true;
    console.log('[char] hazır · kol:', arms.length, '· head:', head?.name);
  };
  const ext = (modelUrl.split('.').pop() || '').toLowerCase();
  if (ext === 'fbx') new FBXLoader().load(modelUrl, (o) => onLoaded(o, o.animations), undefined, (e) => console.warn('[char] fbx:', e));
  else new GLTFLoader().load(modelUrl, (g) => onLoaded(g.scene, g.animations), undefined, (e) => console.warn('[char] glb:', e));

  const YAW = -Math.PI / 3;        // gövde sola 60° dönük (içeriğe doğru; Y ekseni = sol-sağ dönüş)
  const clock = new THREE.Clock();
  let hx = 0, hy = 0;
  function frame() {
    if (canvas.offsetParent === null) { requestAnimationFrame(frame); return; }
    const dt = clock.getDelta(); const t = clock.elapsedTime;
    if (mixer) mixer.update(dt);

    // arka plan hareketi
    stars.rotation.y = t * 0.01; stars.rotation.x = t * 0.004;
    meteors.forEach((m) => { m.position.x -= m.userData.v * dt; m.position.y -= m.userData.v * 0.55 * dt; if (m.position.x < -14 || m.position.y < -8) m.userData.reset(); });

    if (ready && model) {
      // hafif "canlı" nefes ve ağırlık salınımı (reduced-motion'da kapalı)
      model.position.y = baseY + (reduce ? 0 : Math.sin(t * 1.3) * 0.03);
      model.position.x = modelX + (reduce ? 0 : Math.sin(t * 0.45) * 0.025);
      model.rotation.y = YAW;                          // gövde sağa ~60° dönük
      model.rotation.z = reduce ? 0 : Math.sin(t * 0.55) * 0.015;

      const k = 1 - Math.pow(0.0008, dt);              // çerçeve hızından bağımsız yumuşatma
      const bob = reduce ? 0 : Math.sin(t * 1.2) * 0.04; // kollarda hafif nefes salınımı

      // KOLLAR: gövdeye göre ~30° yana-öne açık (gövde dönüşüyle birlikte döner)
      for (const a of arms) {
        _aim.copy(a.dir);
        _aim.y += (a.key === 'arm' || a.key === 'fore') ? bob : -bob;
        _aim.applyQuaternion(model.quaternion);        // gövde-yerel yönü dünyaya taşı
        aimDir(a.bone, _aim, k);
      }

      // KAFA: imleci yumuşak ve sınırlı takip eder
      hx += (ndc.x * 0.55 - hx) * 0.06;
      hy += (-ndc.y * 0.35 - hy) * 0.06;
      if (head) { head.rotation.y = hx; head.rotation.x = hy; }
      if (neck) { neck.rotation.y = hx * 0.4; neck.rotation.x = hy * 0.3; }
    }
    composer.render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
