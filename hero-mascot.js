// Kodla inşa edilen 3B maskot (asset gerekmez) — idle + sağ kol/parmak imleci takip eder
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export function initHeroMascot() {
  const canvas = document.getElementById('hero3d');
  if (!canvas) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xfff2dc, 2.0); key.position.set(3, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xE8B04B, 1.8); rim.position.set(-5, 1, -4); scene.add(rim);

  // ---- materyaller ----
  const gold = new THREE.MeshStandardMaterial({ color: 0xE8B04B, metalness: 1, roughness: 0.28, envMapIntensity: 1.2 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x16140f, metalness: 0.6, roughness: 0.5 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xfff0c0, emissive: 0xE8B04B, emissiveIntensity: 3 });
  const rbox = (w, h, d, r = 0.12) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, r), gold);

  // ---- maskot iskeleti ----
  const root = new THREE.Group(); root.position.set(0, -0.2, 0); root.scale.setScalar(0.85); scene.add(root);

  // gövde
  const torso = rbox(1.5, 1.7, 0.95, 0.3); torso.material = gold; root.add(torso);
  const chest = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.6, 0.12, 4, 0.1), dark); chest.position.set(0, 0.15, 0.5); root.add(chest);

  // baş (imlece bakar)
  const headPivot = new THREE.Group(); headPivot.position.set(0, 1.45, 0); root.add(headPivot);
  const head = rbox(1.35, 1.05, 1.05, 0.3); headPivot.add(head);
  const visor = new THREE.Mesh(new RoundedBoxGeometry(1.05, 0.42, 0.1, 4, 0.12), dark); visor.position.set(0, 0.05, 0.52); headPivot.add(visor);
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), eyeMat); eyeL.position.set(-0.22, 0.06, 0.6); headPivot.add(eyeL);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.22; headPivot.add(eyeR);
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5), gold); antenna.position.set(0, 0.75, 0); headPivot.add(antenna);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), eyeMat); tip.position.set(0, 1.0, 0); headPivot.add(tip);

  // sol kol (durağan, hafif)
  const armL = new THREE.Group(); armL.position.set(-0.92, 0.55, 0); armL.rotation.z = -0.5; root.add(armL);
  const upL = rbox(0.95, 0.26, 0.26, 0.1); upL.position.set(-0.48, 0, 0); armL.add(upL);
  const loL = rbox(0.85, 0.24, 0.24, 0.1); loL.position.set(-1.2, 0, 0); armL.add(loL);

  // sağ kol — OMUZ PİVOT'u imleci nişanlar; +X ekseni boyunca uzanır
  const armR = new THREE.Group(); armR.position.set(0.92, 0.55, 0); root.add(armR);
  const upR = rbox(0.95, 0.26, 0.26, 0.1); upR.position.set(0.48, 0, 0); armR.add(upR);
  const loR = rbox(0.8, 0.24, 0.24, 0.1); loR.position.set(1.15, 0, 0); armR.add(loR);
  const hand = rbox(0.3, 0.3, 0.3, 0.1); hand.position.set(1.62, 0, 0); armR.add(hand);
  // işaret parmağı (uçta, hafif parlayan) — "fingertip"
  const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.42), gold); finger.rotation.z = Math.PI / 2; finger.position.set(1.95, 0, 0); armR.add(finger);
  const fingerTip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), eyeMat); fingerTip.position.set(2.18, 0, 0); armR.add(fingerTip);

  // hover taban halkası
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.04, 12, 40), gold); ring.rotation.x = Math.PI / 2; ring.position.y = -1.35; root.add(ring);

  // ---- bloom ----
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.45, 0.55, 0.8));

  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); composer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size(); new ResizeObserver(size).observe(canvas);

  // ---- imleç ----
  const ndc = new THREE.Vector2(0.3, 0.2);
  window.addEventListener('mousemove', (e) => {
    ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    ndc.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.5);
  const target = new THREE.Vector3();

  function aim(pivot, k) {
    pivot.updateWorldMatrix(true, false);
    const wp = new THREE.Vector3().setFromMatrixPosition(pivot.matrixWorld);
    const dirW = target.clone().sub(wp).normalize();
    const pq = new THREE.Quaternion(); pivot.parent.getWorldQuaternion(pq);
    const dirL = dirW.applyQuaternion(pq.invert());
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), dirL);
    pivot.quaternion.slerp(q, k);
  }

  const clock = new THREE.Clock();
  function frame() {
    if (canvas.offsetParent === null) { requestAnimationFrame(frame); return; }
    const t = clock.getElapsedTime();
    root.position.y = -0.2 + Math.sin(t * 1.6) * 0.08;     // idle hover
    root.rotation.z = Math.sin(t * 0.8) * 0.02;
    root.rotation.y += (ndc.x * 0.35 - root.rotation.y) * 0.05;
    headPivot.rotation.y += (ndc.x * 0.5 - headPivot.rotation.y) * 0.1;
    headPivot.rotation.x += (-ndc.y * 0.35 - headPivot.rotation.x) * 0.1;
    ring.rotation.z = t * 0.4;
    // imleç hedefi → sağ kol nişanı (parmak ucu takibi)
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, target)) aim(armR, 0.22);
    composer.render();
    requestAnimationFrame(frame);
  }
  if (reduce) composer.render();
  else requestAnimationFrame(frame);
}
