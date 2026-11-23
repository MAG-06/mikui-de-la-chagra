/* =========================================================
   Mikui de la Chagra · Landing 3D
   Three.js r160 minificado (incluido en /vendor, sin CDN)
   ========================================================= */
import * as THREE from '../vendor/three/three.module.min.js';
import { OrbitControls } from '../vendor/three/OrbitControls.js';
import { RoomEnvironment } from '../vendor/three/RoomEnvironment.js';
import { CAT, INGS, TABS } from './data.js';

/* =========================================================
   UI: panel, lista, etiquetas
   ========================================================= */
const cardEl = document.getElementById('card');
const listEl = document.getElementById('list');
const labelsEl = document.getElementById('labels');
const chipsEl = document.getElementById('chips');
const panelEl = document.getElementById('panel');
const handleTxt = document.getElementById('handleTxt');
const isPhone = ()=> innerWidth <= 820 && innerHeight > 520;
let tab = 'producto', selected = null;



function renderCard(){
  if(selected){
    const d = INGS.find(i=>i.id===selected), c = CAT[d.cat];
    cardEl.innerHTML = `
      <span class="badge ${c.cls}">${c.txt}</span>
      <h2>${d.name}</h2>
      <div class="qty"><b>${d.qty}</b><span>${d.qtyNote}</span></div>
      <p>${d.role}</p>
      ${d.note?`<p class="note">${d.note}</p>`:''}
      ${d.allergen?`<div class="facts"><span class="alerta">Alérgeno: huevo</span></div>`:''}
      <div class="nav">
        <button class="back" id="back">← La tortica</button>
        <span>${INGS.indexOf(d)+1} / ${INGS.length}</span>
        <div style="display:flex;gap:6px"><button id="prev" aria-label="Anterior">←</button><button id="next" aria-label="Siguiente">→</button></div>
      </div>`;
    const k = INGS.indexOf(d);
    document.getElementById('back').onclick = ()=>select(null);
    document.getElementById('prev').onclick = ()=>select(INGS[(k+INGS.length-1)%INGS.length].id, true);
    document.getElementById('next').onclick = ()=>select(INGS[(k+1)%INGS.length].id, true);
  } else {
    cardEl.innerHTML = `<div class="tabs">
        <button data-t="producto" class="${tab==='producto'?'on':''}">Producto</button>
        <button data-t="prep" class="${tab==='prep'?'on':''}">Preparación</button>
        <button data-t="chagra" class="${tab==='chagra'?'on':''}">La chagra</button>
      </div>${TABS[tab]}`;
    cardEl.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;renderCard();});
  }
  listEl.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.id===selected));
  INGS.forEach(d=>{
    d.label.classList.toggle('on', d.id===selected);
    d.chip.classList.toggle('on', d.id===selected);
  });
  const ch = INGS.find(d=>d.id===selected)?.chip;
  if(ch && isPhone()) ch.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
}

INGS.forEach((d,i)=>{
  const li = document.createElement('li');
  li.innerHTML = `<button data-id="${d.id}"><span class="dot" style="background:${CAT[d.cat].color}"></span>${d.name}</button>`;
  li.firstChild.onclick = ()=>{ if(tTarget<0.5) setTarget(1); select(d.id, true); };
  listEl.appendChild(li);

  const l = document.createElement('div');
  l.className = 'lbl';
  l.innerHTML = `<span class="n" style="background:${CAT[d.cat].color}">${i+1}</span><span class="nm">${d.name}</span>`;
  l.onclick = ()=>select(d.id);
  labelsEl.appendChild(l);
  d.label = l;

  const ch = document.createElement('button');
  ch.dataset.id = d.id;
  ch.innerHTML = `<span class="n" style="background:${CAT[d.cat].color}">${i+1}</span>${d.name}`;
  ch.onclick = ()=>{ if(tTarget<0.5) setTarget(1); select(d.id, true); };
  chipsEl.appendChild(ch);
  d.chip = ch;
});
const tortLabel = document.createElement('div');
tortLabel.className = 'lbl tort';
tortLabel.textContent = 'Tócala para desarmarla';
tortLabel.onclick = ()=>setTarget(1);
labelsEl.appendChild(tortLabel);

function select(id, force){
  selected = (!force && selected===id) ? null : id;
  if(selected){ try{ navigator.vibrate && navigator.vibrate(12); }catch(_){} if(isPhone()) openSheet(true); }
  renderCard();
}

/* ---------- hoja inferior (solo celular) ---------- */
function openSheet(v){
  panelEl.classList.toggle('open', v);
  handleTxt.textContent = v ? 'Desliza hacia abajo para ocultar' : 'Desliza hacia arriba para ver más';
}
(()=>{
  const h = document.getElementById('handle');
  let y0 = null;
  h.addEventListener('pointerdown', e=>{ y0 = e.clientY; h.setPointerCapture(e.pointerId); });
  h.addEventListener('pointerup', e=>{
    if(y0 === null) return;
    const dy = e.clientY - y0; y0 = null;
    if(dy < -25) openSheet(true);
    else if(dy > 25) openSheet(false);
    else openSheet(!panelEl.classList.contains('open'));
  });
})();

/* =========================================================
   ESCENA
   ========================================================= */
const canvas = document.getElementById('c');
const loader = document.getElementById('loader');
if(!hasWebGL()){
  loader.innerHTML = '<p>Tu navegador no soporta 3D (WebGL).<br>Prueba con Chrome, Safari o Edge actualizados.</p>';
  throw new Error('WebGL no disponible');
}
function hasWebGL(){
  try{ const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch(_){ return false; }
}
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touchDevice = matchMedia('(pointer: coarse)').matches;
if(touchDevice){
  document.getElementById('hint').textContent = 'Desliza para girar · pellizca para desarmar · toca un ingrediente';
}
// iOS Safari: evitar que el pellizco haga zoom a toda la página
['gesturestart','gesturechange','gestureend'].forEach(ev =>
  document.addEventListener(ev, e => e.preventDefault(), {passive:false}));
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;   // Fase 1: más liviano que PCFSoft; la suavidad la da sun.shadow.radius
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(0, 3.8, 9.6);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1.05, 0);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;
controls.minPolarAngle = 0.65;
controls.maxPolarAngle = 1.38;
controls.autoRotate = !reduceMotion;
controls.autoRotateSpeed = 0.7;
let idleTimer;
controls.addEventListener('start', ()=>{ controls.autoRotate=false; clearTimeout(idleTimer); });
controls.addEventListener('end', ()=>{ idleTimer=setTimeout(()=>controls.autoRotate=!reduceMotion, 4000); });

scene.add(new THREE.HemisphereLight('#fff4dc', '#6b5a3a', 0.45));
const sun = new THREE.DirectionalLight('#fff1d6', 1.7);
sun.position.set(4, 8, 5);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);   // Fase 1: antes 2048 en PC (4 veces más píxeles por cuadro)
Object.assign(sun.shadow.camera, {left:-6,right:6,top:6,bottom:-6,near:1,far:25});
sun.shadow.bias = -0.0005;
sun.shadow.radius = 4;
scene.add(sun);

/* utilidades */
const noise = (x,y,z)=> Math.sin(x*5.1+y*3.7)*Math.sin(z*4.3+x*2.1)*0.55
                      + Math.sin(x*11.3+z*9.7+y*7.1)*0.3 + Math.sin(z*17.1-x*13.3)*0.15;
function canvasTex(size, draw){
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  draw(cv.getContext('2d'), size);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
const rnd = (a,b)=>a+Math.random()*(b-a);
// Fase 1: las piezas diminutas (granos, cristales) no proyectan sombra: no se notaría y cuesta un pase extra cada una
function shadowAll(o){ o.traverse(m=>{ if(m.isMesh){ m.castShadow = !m.userData.noCast; m.receiveShadow = true; }}); return o; }

/* ---------- hoja de base y sombra ---------- */
const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(40,40), new THREE.ShadowMaterial({opacity:.16}));
shadowPlane.rotation.x = -Math.PI/2; shadowPlane.receiveShadow = true;
scene.add(shadowPlane);

function leaf(L, W, color, rib){
  const s = new THREE.Shape();
  s.moveTo(-L,0); s.quadraticCurveTo(0, W, L, 0); s.quadraticCurveTo(0, -W, -L, 0);
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.ShapeGeometry(s, 40),
    new THREE.MeshStandardMaterial({color, roughness:.55, side:THREE.DoubleSide}));
  m.rotation.x = -Math.PI/2; m.receiveShadow = true; g.add(m);
  const r = new THREE.Mesh(new THREE.BoxGeometry(L*1.85, .012, .04), new THREE.MeshStandardMaterial({color:rib, roughness:.6}));
  r.position.y = .008; g.add(r);
  // Fase 3: las 14 venas son un solo InstancedMesh (1 llamada de dibujo en vez de 14)
  const veins = new THREE.InstancedMesh(new THREE.BoxGeometry(W*.36, .01, .018), r.material, 14);
  const v = new THREE.Object3D();
  let k = 0;
  for(let i=-3;i<=3;i++){
    const w = 1 - Math.abs(i)/4.2;
    [1,-1].forEach(side=>{
      v.scale.set(w, 1, 1);
      v.position.set(i*L*.24 + W*.12*w, .008, side*W*.13*w);
      v.rotation.set(0, -side*0.75, 0);
      v.updateMatrix();
      veins.setMatrixAt(k++, v.matrix);
    });
  }
  g.add(veins);
  return g;
}
const leaf1 = leaf(3.1, 2.1, '#3e6b33', '#6f9a56'); leaf1.rotation.y = 0.45; leaf1.position.y = .01; scene.add(leaf1);
const leaf2 = leaf(2.4, 1.6, '#5b8a43', '#8cb36d'); leaf2.rotation.y = -0.9; leaf2.position.set(-0.6,.005,-0.7); scene.add(leaf2);

/* ---------- la tortica (dos mitades) ---------- */
const R = 1.55, H = 0.36, BASE_Y = 0.42;
function halfProfile(top){
  const pts = [], N = 30;
  for(let i=0;i<=N;i++){
    const th = (i/N)*Math.PI/2;
    const x = R*Math.pow(Math.max(Math.cos(th),0), .45);
    const y = H*Math.pow(Math.sin(th), .7);
    pts.push(new THREE.Vector2(Math.max(x, 1e-4), top ? y : -y));
  }
  if(!top) pts.reverse();
  return pts;
}
const cLight = new THREE.Color('#e3a84c'), cDark = new THREE.Color('#a25e1e'), cToast = new THREE.Color('#6f3c12');
function crustGeo(top){
  const g = new THREE.LatheGeometry(halfProfile(top), 72);
  const p = g.attributes.position, col = [], c = new THREE.Color();
  for(let i=0;i<p.count;i++){
    const x=p.getX(i), y=p.getY(i), z=p.getZ(i);
    const n = noise(x,y,z), k = 1 + n*0.03;
    p.setXYZ(i, x*k, y + Math.sign(y)*n*0.03*(Math.abs(y)/H), z*k);
    const n2 = noise(x*2.7+5, y*2.7, z*2.7);
    let m = THREE.MathUtils.clamp(.3 + .35*n2 + (Math.abs(y)/H)*.25, 0, 1);
    c.copy(cLight).lerp(cDark, m);
    if(n2 > .62) c.lerp(cToast, .55);
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}
const crustMat = new THREE.MeshStandardMaterial({vertexColors:true, roughness:.72, side:THREE.DoubleSide, envMapIntensity:.6});
const cutTex = canvasTex(512, (x,s)=>{
  const gr = x.createRadialGradient(s/2,s/2,s*.3,s/2,s/2,s/2);
  gr.addColorStop(0,'#efd9a2'); gr.addColorStop(.86,'#e9cd8c'); gr.addColorStop(.95,'#c98a3a'); gr.addColorStop(1,'#8f531c');
  x.fillStyle = gr; x.fillRect(0,0,s,s);
  for(let i=0;i<420;i++){
    const a=Math.random()*Math.PI*2, r=Math.sqrt(Math.random())*s*.44;
    x.fillStyle = Math.random()<.55 ? 'rgba(226,160,62,.55)' : 'rgba(250,242,220,.8)';
    x.beginPath(); x.arc(s/2+Math.cos(a)*r, s/2+Math.sin(a)*r, rnd(2,7), 0, Math.PI*2); x.fill();
  }
});
const cutMat = new THREE.MeshStandardMaterial({map:cutTex, roughness:.9});

function half(top){
  const g = new THREE.Group();
  g.add(new THREE.Mesh(crustGeo(top), crustMat));
  const disc = new THREE.Mesh(new THREE.CircleGeometry(R*.99, 72), cutMat);
  disc.rotation.x = top ? Math.PI/2 : -Math.PI/2;
  g.add(disc);
  return shadowAll(g);
}
const tortica = new THREE.Group();
const topHalf = half(true), botHalf = half(false);
tortica.add(topHalf, botHalf);
scene.add(tortica);

/* ---------- ingredientes ---------- */
function yuca(){
  const g = new THREE.Group();
  const cap = canvasTex(256,(x,s)=>{
    x.fillStyle='#6b4428'; x.fillRect(0,0,s,s);
    x.fillStyle='#d9c9ad'; x.beginPath(); x.arc(s/2,s/2,s*.46,0,7); x.fill();
    x.fillStyle='#f7f2e4'; x.beginPath(); x.arc(s/2,s/2,s*.42,0,7); x.fill();
    x.strokeStyle='rgba(200,185,150,.5)'; x.lineWidth=2;
    for(let r=.12;r<.4;r+=.07){ x.beginPath(); x.arc(s/2,s/2,s*r,0,7); x.stroke(); }
    x.fillStyle='#e6dcc4'; x.beginPath(); x.arc(s/2,s/2,s*.05,0,7); x.fill();
  });
  const bark = new THREE.MeshStandardMaterial({color:'#6e4529', roughness:1});
  const capM = new THREE.MeshStandardMaterial({map:cap, roughness:.8});
  [[0,0,0,1.15,.27],[.2,-.06,.42,.75,.24],[-.25,.02,-.38,.6,.22]].forEach(([x,y,z,l,r],i)=>{
    const geo = new THREE.CylinderGeometry(r, r*1.05, l, 40, 6);
    const p = geo.attributes.position;
    for(let k=0;k<p.count;k++){ const n = noise(p.getX(k)*3,p.getY(k)*3,p.getZ(k)*3)*.02;
      p.setX(k,p.getX(k)*(1+n*3)); p.setZ(k,p.getZ(k)*(1+n*3)); }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, [bark, capM, capM]);
    m.rotation.set(0, i*.7, Math.PI/2); m.position.set(x, y, z);
    g.add(m);
  });
  return g;
}
function platano(){
  const g = new THREE.Group();
  const cap = canvasTex(256,(x,s)=>{
    x.fillStyle='#b8772a'; x.fillRect(0,0,s,s);
    const gr = x.createRadialGradient(s/2,s/2,4,s/2,s/2,s*.45);
    gr.addColorStop(0,'#f6cf6a'); gr.addColorStop(.8,'#eaa944'); gr.addColorStop(1,'#d48a2e');
    x.fillStyle=gr; x.beginPath(); x.arc(s/2,s/2,s*.45,0,7); x.fill();
    x.strokeStyle='rgba(170,100,30,.4)'; x.lineWidth=3; x.beginPath(); x.arc(s/2,s/2,s*.38,0,7); x.stroke();
    x.fillStyle='#5a3414';
    for(let i=0;i<3;i++){ const a=i*2.09; x.beginPath(); x.arc(s/2+Math.cos(a)*14, s/2+Math.sin(a)*14, 4, 0, 7); x.fill(); }
  });
  const side = new THREE.MeshStandardMaterial({color:'#c58a3a', roughness:.6});
  const capM = new THREE.MeshStandardMaterial({map:cap, roughness:.45});
  for(let i=0;i<3;i++){
    const m = new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.13,40), [side, capM, capM]);
    m.scale.z = .86;
    m.position.set(i*.2-.2, i*.03, -i*.08);
    m.rotation.set(Math.PI/2 - .35, 0, i*.35 - .3);
    g.add(m);
  }
  return g;
}
function huevo(){
  const geo = new THREE.SphereGeometry(.34, 48, 32);
  const p = geo.attributes.position;
  for(let i=0;i<p.count;i++){ const y=p.getY(i); const k = y>0 ? 1 - .2*(y/.34) : 1;
    p.setXYZ(i, p.getX(i)*k, y*1.28, p.getZ(i)*k); }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({color:'#f1e0c2', roughness:.42}));
  m.rotation.z = .25;
  return new THREE.Group().add(m);
}
function fecula(){
  const g = new THREE.Group();
  const pts = [];
  for(let i=0;i<=24;i++){ const x = .6*(1-i/24); pts.push(new THREE.Vector2(Math.max(x,1e-4), .36*Math.exp(-((x/.3)**2)))); }
  const geo = new THREE.LatheGeometry(pts, 48);
  const p = geo.attributes.position;
  for(let i=0;i<p.count;i++){ const n = noise(p.getX(i)*4,p.getY(i)*4,p.getZ(i)*4); p.setY(i, p.getY(i)*(1+n*.12)); }
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({color:'#fbfaf4', roughness:1, side:THREE.DoubleSide});
  const heap = new THREE.Mesh(geo, mat); heap.position.y = -.2; g.add(heap);
  // Fase 3: los 26 granitos son un solo InstancedMesh
  const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(.025, 8, 6), mat, 26);
  dots.userData.noCast = true;
  const s = new THREE.Object3D();
  for(let i=0;i<26;i++){
    const a = Math.random()*7, r = rnd(.45,.85);
    s.position.set(Math.cos(a)*r, -.19, Math.sin(a)*r); s.updateMatrix();
    dots.setMatrixAt(i, s.matrix);
  }
  dots.computeBoundingSphere();
  g.add(dots);
  return g;
}
function sal(){
  const g = new THREE.Group();
  // Fase 1: sin "transmission" (obligaba a dibujar la escena dos veces por cuadro)
  const mat = new THREE.MeshPhysicalMaterial({color:'#ffffff', roughness:.15, transparent:true, opacity:.88, clearcoat:1});
  // Fase 3: los 14 cristales son un solo InstancedMesh
  const crystals = new THREE.InstancedMesh(new THREE.BoxGeometry(.11,.11,.11), mat, 14);
  crystals.userData.noCast = true;
  const m = new THREE.Object3D();
  for(let i=0;i<14;i++){
    const a = Math.random()*7, r = Math.random()*.28;
    m.position.set(Math.cos(a)*r, Math.random()*.18 - (r*.4), Math.sin(a)*r);
    m.rotation.set(Math.random()*3, Math.random()*3, Math.random()*3);
    m.scale.setScalar(rnd(.6,1.2));
    m.updateMatrix();
    crystals.setMatrixAt(i, m.matrix);
  }
  crystals.computeBoundingSphere();
  g.add(crystals);
  return g;
}
function aceite(){
  const pts = [];
  for(let i=0;i<=40;i++){ const t = (i/40)*Math.PI;
    pts.push(new THREE.Vector2(Math.max(.34*Math.sin(t)*Math.pow(Math.sin((Math.PI-t)/2), 1.1), 1e-4), -Math.cos(t)*.44)); }
  const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 48),
    // Fase 1: vidrio "falso" con transparencia + reflejo del entorno, sin pase extra de render
    new THREE.MeshPhysicalMaterial({color:'#d8920e', emissive:'#6a3a00', emissiveIntensity:.35, roughness:.04,
      transparent:true, opacity:.9, ior:1.47, clearcoat:1, envMapIntensity:1.2, side:THREE.DoubleSide}));
  return new THREE.Group().add(m);
}
const BUILD = {yuca, platano, huevo, fecula, sal, aceite};
const HEIGHTS = [1.05, 1.55, 1.0, 1.5, 1.1, 1.6];
const pickables = [];
INGS.forEach((d,i)=>{
  const g = shadowAll(BUILD[d.id]());
  g.userData.id = d.id;
  const a = (i/INGS.length)*Math.PI*2 + Math.PI/6;
  d.target = new THREE.Vector3(Math.sin(a)*3.05, HEIGHTS[i], Math.cos(a)*3.05);
  d.obj = g; d.idx = i;
  g.traverse(m=>{ if(m.isMesh){ m.userData.id = d.id; pickables.push(m); }});
  scene.add(g);
});
const center = new THREE.Vector3(0, BASE_Y, 0);

/* aro de selección */
const ring = new THREE.Mesh(new THREE.RingGeometry(.58,.66,64),
  new THREE.MeshBasicMaterial({color:'#f2d38a', transparent:true, opacity:0, side:THREE.DoubleSide, depthWrite:false}));
ring.rotation.x = -Math.PI/2;
scene.add(ring);

/* =========================================================
   INTERACCIÓN
   ========================================================= */
let tCur = 0, tTarget = 0;
const toggle = document.getElementById('toggle');
const slider = document.getElementById('slider');
let sliding = false;
function setTarget(v){
  tTarget = THREE.MathUtils.clamp(v, 0, 1);
  toggle.classList.remove('pulse');
  if(tTarget < .5 && selected){ selected = null; renderCard(); }
}
toggle.onclick = ()=> setTarget(tTarget > .5 ? 0 : 1);
slider.addEventListener('input', ()=>{ sliding = true; setTarget(slider.value/1000); });
slider.addEventListener('change', ()=> sliding = false);
canvas.addEventListener('wheel', e=>{ e.preventDefault(); setTarget(tTarget + e.deltaY*0.0012); }, {passive:false});

// pellizcar con dos dedos = desarmar / armar
let pinch = null;
const dist = t => Math.hypot(t[0].clientX-t[1].clientX, t[0].clientY-t[1].clientY);
canvas.addEventListener('touchstart', e=>{ if(e.touches.length===2) pinch = {d0:dist(e.touches), t0:tTarget}; }, {passive:true});
canvas.addEventListener('touchmove', e=>{
  if(pinch && e.touches.length===2){ e.preventDefault(); setTarget(pinch.t0 + (dist(e.touches)-pinch.d0)/220); }
}, {passive:false});
canvas.addEventListener('touchend', e=>{
  if(pinch && e.touches.length<2){ setTarget(tTarget > .5 ? 1 : 0); pinch = null; }
});

const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
let downAt = null;
function hit(e){
  const r = canvas.getBoundingClientRect();
  ptr.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1);
  ray.setFromCamera(ptr, camera);
  const objs = tCur > .3 ? pickables : [...topHalf.children, ...botHalf.children];
  return ray.intersectObjects(objs, false)[0];
}
canvas.addEventListener('pointerdown', e=> downAt = [e.clientX, e.clientY]);
canvas.addEventListener('pointerup', e=>{
  if(!downAt || Math.hypot(e.clientX-downAt[0], e.clientY-downAt[1]) > 6) return;
  const h = hit(e);
  if(!h) return;
  if(h.object.userData.id) select(h.object.userData.id); else setTarget(1);
});
// Fase 2: el mouse puede mandar varios eventos por cuadro; se hace un solo raycast por cuadro
let hoverEvt = null, hoverQueued = false, lastCursor = '';
canvas.addEventListener('pointermove', e=>{
  if(e.buttons || e.pointerType === 'touch') return;
  hoverEvt = e;
  if(hoverQueued) return;
  hoverQueued = true;
  requestAnimationFrame(()=>{
    hoverQueued = false;
    const c = hit(hoverEvt) ? 'pointer' : 'grab';
    if(c !== lastCursor){ canvas.style.cursor = c; lastCursor = c; }
  });
});

/* =========================================================
   LOOP
   ========================================================= */
const ease = t => t<.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const clamp01 = v => Math.min(1, Math.max(0, v));
const tmp = new THREE.Vector3();
let W = 0, Hh = 0, baseFov = 34, ringK = 1;
const tgt = new THREE.Vector3();

// Fase 2: resize() solo cambia el tamaño del canvas cuando cambia la ventana.
// layout() reacomoda la cámara; es lo único que hace falta mientras se abre/cierra la hoja del celular.
let sizedW = 0, sizedH = 0, sizedPR = 0;
let prCap = 2;   // Fase 3: tope que baja solo si el equipo no alcanza a dibujar fluido (ver adaptQuality)
function resize(){
  W = innerWidth; Hh = innerHeight;
  // Fase 3: en PC 1.75 en vez de 2; con antialias la diferencia no se ve y son ~25 % menos píxeles
  const pr = Math.min(devicePixelRatio, isPhone() || Hh <= 520 ? 1.5 : 1.75, prCap);
  if(W !== sizedW || Hh !== sizedH || pr !== sizedPR){
    renderer.setPixelRatio(pr);
    renderer.setSize(W, Hh, false);
    sizedW = W; sizedH = Hh; sizedPR = pr;
  }
  layout();
}
function layout(){
  camera.aspect = W/Hh;
  const phone = isPhone(), landscape = Hh <= 520;
  // corre la escena para que no la tape el panel
  if(phone){
    const sh = panelEl.offsetHeight + 64;          // hoja + botones
    const tablet = W >= 600;                       // iPad / tablet en vertical
    camera.setViewOffset(W, Hh, 0, Math.max(0, sh - 220)*.78 + (tablet ? Hh*.02 : -Hh*.06), W, Hh);
    baseFov = tablet ? 37 : (W/Hh < .6 ? 50 : 42);
    ringK   = tablet ? .86 : (W/Hh < .6 ? .7 : .85);
  } else if(landscape){                            // celular acostado
    camera.setViewOffset(W, Hh, -160, 0, W, Hh); baseFov = 31; ringK = 1;
  } else if(W < 1300){                             // tablet acostada / laptop pequeño
    camera.setViewOffset(W, Hh, -Math.min(90, W*.07), 0, W, Hh); baseFov = 37; ringK = .8;
  } else {                                         // PC
    camera.setViewOffset(W, Hh, -Math.min(110, W*.07), 0, W, Hh); baseFov = 34; ringK = 1;
  }
  camera.fov = baseFov;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
new ResizeObserver(()=>{
  document.documentElement.style.setProperty('--sheet', panelEl.offsetHeight + 'px');
  if(isPhone()) layout();   // Fase 2: antes llamaba resize() y recreaba el canvas en cada cuadro de la animación
}).observe(panelEl);
resize();

let lastSlider = -1, lastToggle = '';
// Fase 2: opacidad y clic de una etiqueta, escritos solo si cambian
function setFade(el, op){
  op = Math.round(op*100)/100;
  if(el._op !== op){ el.style.opacity = op; el._op = op; }
  const pe = op > .5 ? 'auto' : 'none';
  if(el._pe !== pe){ el.style.pointerEvents = pe; el._pe = pe; }
}

// Fase 3: calidad adaptable. Cada 2 s mira cuánto tarda un cuadro; si va a menos de ~28 fps,
// baja un poco la resolución interna del 3D (nunca por debajo de 1). Solo baja, nunca sube,
// para no quedar saltando entre calidades.
let qT = 0, qN = 0, qWarm = 3;
function adaptQuality(raw){
  if(raw > .25) return;                  // volvió de otra pestaña: no cuenta
  if(qWarm > 0){ qWarm -= raw; return; } // ignora los primeros segundos (carga)
  qT += raw; qN++;
  if(qT < 2) return;
  const avg = qT/qN; qT = 0; qN = 0;
  // 28 y no 40: algunos celulares en ahorro de batería limitan a 30 fps y no hay que castigarlos
  if(avg > 1/28 && sizedPR > 1){
    prCap = Math.max(1, sizedPR - .25);
    resize();
  }
}

const clock = new THREE.Clock();
function frame(){
  const raw = clock.getDelta();
  adaptQuality(raw);
  const dt = Math.min(raw, .05), time = clock.elapsedTime;
  tCur += (tTarget - tCur) * Math.min(1, dt*3.2);
  if(Math.abs(tTarget-tCur) < 1e-4) tCur = tTarget;
  // Fase 2: solo se toca el DOM cuando el valor cambia (escribir igual obliga al navegador a recalcular)
  const sv = Math.round(tCur*1000);
  if(!sliding && sv !== lastSlider){ slider.value = sv; lastSlider = sv; }
  const tt = tTarget > .5 ? 'Armar' : 'Desarmar';
  if(tt !== lastToggle){ toggle.textContent = tt; lastToggle = tt; }

  const e = ease(tCur);
  // al desarmar, la cámara se abre para que quepa todo
  camera.fov = baseFov*(1 + .42*e); camera.updateProjectionMatrix();
  // la tortica siempre muestra el corte hacia la cámara
  tortica.rotation.y = Math.atan2(camera.position.x, camera.position.z);
  topHalf.position.y = BASE_Y + e*2.15;
  topHalf.rotation.x = -e*.55;
  topHalf.position.z = -e*.2;
  botHalf.position.y = BASE_Y + e*.12;
  botHalf.rotation.x = e*.32;
  // respiración suave cuando está armada
  const breathe = 1 + Math.sin(time*1.6)*.006*(1-e);
  tortica.scale.setScalar(breathe);

  INGS.forEach((d,i)=>{
    const ti = ease(clamp01(tCur*1.35 - i*.06));
    const o = d.obj;
    tgt.set(d.target.x*ringK, d.target.y, d.target.z*ringK);
    o.position.lerpVectors(center, tgt, ti);
    o.position.y += Math.sin(time*1.4 + i)*.06*ti;
    const sel = d.id === selected ? 1.15 : 1;
    const s = THREE.MathUtils.lerp(o.scale.x, (0.05 + .95*ti)*sel, .15);
    o.scale.setScalar(s);
    o.visible = ti > .01;
    o.rotation.y = time*.35 + i;

    // etiqueta (si está invisible no hace falta moverla)
    const op = clamp01((ti-.6)/.4);
    if(op > 0){
      tmp.copy(o.position); tmp.y += .62; tmp.project(camera);
      const x = (tmp.x*.5+.5)*W, y = (-tmp.y*.5+.5)*Hh;
      d.label.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-100%)`;
    }
    setFade(d.label, op);
  });

  // aro bajo el seleccionado
  const sd = INGS.find(d=>d.id===selected);
  ring.material.opacity += (((sd && tCur>.5) ? .9 : 0) - ring.material.opacity)*.15;
  if(sd){ ring.position.set(sd.obj.position.x, sd.obj.position.y - .5, sd.obj.position.z); ring.scale.setScalar(1 + Math.sin(time*3)*.05); }

  // etiqueta de la tortica armada
  const tOp = clamp01(1 - tCur*4) * (tTarget < .5 ? 1 : 0);
  if(tOp > 0){
    tmp.set(0, BASE_Y + .9, 0).project(camera);
    tortLabel.style.transform = `translate(${((tmp.x*.5+.5)*W).toFixed(1)}px,${((-tmp.y*.5+.5)*Hh).toFixed(1)}px) translate(-50%,-100%)`;
  }
  setFade(tortLabel, tOp);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
renderCard();

// Fase 1: "calentar" la GPU detrás del loader. Se dibuja una vez con todos los ingredientes
// visibles para que sus shaders (y los de sombra) se compilen ahora y no al tocar "Desarmar".
INGS.forEach(d=>{ d.obj.visible = true; });
renderer.render(scene, camera);
pmrem.dispose();   // el entorno ya quedó generado; el generador no se vuelve a usar

frame();
requestAnimationFrame(()=>requestAnimationFrame(()=>loader.classList.add('hide')));
