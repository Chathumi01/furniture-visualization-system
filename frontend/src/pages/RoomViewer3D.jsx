import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import logoImg from "../assets/LOGO.png";

// ─────────────────────────────────────────────────────────────────────────────
// FURNITURE HEIGHT MAP  (metres)
// Maps icon type → { height, legH, special }
// ─────────────────────────────────────────────────────────────────────────────
const FURN_3D = {
  sofa2:    { h:0.85, seatH:0.42, backH:0.85, armH:0.60, type:"sofa"     },
  sofa3:    { h:0.85, seatH:0.42, backH:0.85, armH:0.60, type:"sofa"     },
  chair:    { h:0.90, seatH:0.45, backH:0.90, armH:0.62, type:"sofa"     },
  dtable:   { h:0.75, legH:0.72,              type:"table"    },
  dchair:   { h:0.90, seatH:0.45, backH:0.88,            type:"chair"    },
  ctable:   { h:0.42, legH:0.38,              type:"table"    },
  stable:   { h:0.55, legH:0.50,              type:"table"    },
  bed2:     { h:0.55, frameH:0.20, mattH:0.25,pillowH:0.10, type:"bed"   },
  bed1:     { h:0.55, frameH:0.20, mattH:0.25,pillowH:0.10, type:"bed"   },
  wardrobe: { h:2.00,                          type:"box"      },
  desk:     { h:0.75, legH:0.72,              type:"table"    },
  book:     { h:1.80,                          type:"shelf"    },
  tv:       { h:0.45, standH:0.60,            type:"tv"       },
  plant:    { h:1.20,                          type:"plant"    },
  rug:      { h:0.02,                          type:"rug"      },
  lamp:     { h:1.60,                          type:"lamp"     },
};

// ─────────────────────────────────────────────────────────────────────────────
// HEX → THREE COLOR
// ─────────────────────────────────────────────────────────────────────────────
function hexToThree(THREE, hex) {
  return new THREE.Color(hex);
}
function lightenHex(hex, amt) {
  const n = parseInt(hex.replace("#",""),16);
  const r = Math.min(255,((n>>16)&0xff)+amt);
  const g = Math.min(255,((n>>8)&0xff)+amt);
  const b = Math.min(255,(n&0xff)+amt);
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}
function darkenHex(hex, amt) {
  const n = parseInt(hex.replace("#",""),16);
  const r = Math.max(0,((n>>16)&0xff)-amt);
  const g = Math.max(0,((n>>8)&0xff)-amt);
  const b = Math.max(0,(n&0xff)-amt);
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// FURNITURE BUILDER  – returns a THREE.Group
// ─────────────────────────────────────────────────────────────────────────────
function buildFurniture3D(THREE, item) {
  const group = new THREE.Group();
  const info = FURN_3D[item.icon] || { h:0.5, type:"box" };
  const W = item.w, D = item.h /* depth in plan = h */, color = item.color;

  function mat(hex, rough=0.8, metal=0.0) {
    return new THREE.MeshStandardMaterial({ color: hexToThree(THREE, hex), roughness: rough, metalness: metal });
  }
  function box(w,h,d, hex, x=0,y=0,z=0, rough=0.8) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat(hex,rough));
    m.position.set(x,y,z);
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    return m;
  }
  function cyl(rt,rb,h,hex,x=0,y=0,z=0,seg=8) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg), mat(hex));
    m.position.set(x,y,z);
    m.castShadow = true;
    group.add(m);
    return m;
  }

  const t = info.type;

  if (t === "sofa") {
    const sH = info.seatH, bH = info.backH, aH = info.armH;
    const thick = 0.08, armW = 0.12;
    const seatD = D - armW*2;
    // seat
    box(W, sH, seatD, color, 0, sH/2, 0);
    // back
    box(W, bH-sH, thick, darkenHex(color,15), 0, sH+(bH-sH)/2, -seatD/2+thick/2);
    // arms
    box(armW, aH, D, darkenHex(color,10), -W/2+armW/2, aH/2, 0);
    box(armW, aH, D, darkenHex(color,10),  W/2-armW/2, aH/2, 0);
    // cushions
    const cw = (W-armW*2-0.06) / (t==="sofa"&&W>1.5 ? 3 : 2);
    const nc = W>1.5 ? 3 : 2;
    for(let i=0;i<nc;i++){
      const cx = -W/2 + armW + cw/2 + i*(cw+0.02);
      box(cw-0.02, 0.10, seatD-0.05, lightenHex(color,30), cx, sH+0.06, 0);
    }
    // legs
    const legH=0.08, legR=0.03;
    [[W/2-0.1, -D/2+0.1],[W/2-0.1, D/2-0.1],[-W/2+0.1,-D/2+0.1],[-W/2+0.1,D/2-0.1]].forEach(([lx,lz])=>{
      cyl(legR,legR,legH,darkenHex(color,30), lx, legH/2, lz);
    });
  }

  else if (t === "chair") {
    const sH=info.seatH, bH=info.backH;
    box(W, sH, D, color, 0, sH/2, 0);
    box(W, bH-sH, 0.06, darkenHex(color,15), 0, sH+(bH-sH)/2, -D/2+0.03);
    box(W-0.04, 0.08, D-0.04, lightenHex(color,25), 0, sH+0.05, 0);
    [[W/2-0.06,sH/2,-D/2+0.06],[W/2-0.06,sH/2,D/2-0.06],[-W/2+0.06,sH/2,-D/2+0.06],[-W/2+0.06,sH/2,D/2-0.06]].forEach(([lx,ly,lz])=>{
      box(0.04,ly*2,0.04,darkenHex(color,30),lx,ly/2,lz);
    });
  }

  else if (t === "table") {
    const legH = info.legH || 0.72, topT = 0.05;
    box(W, topT, D, lightenHex(color,20), 0, legH+topT/2, 0, 0.6);
    const lw=0.06;
    [[W/2-lw, -D/2+lw],[W/2-lw, D/2-lw],[-W/2+lw,-D/2+lw],[-W/2+lw,D/2-lw]].forEach(([lx,lz])=>{
      box(lw,legH,lw,darkenHex(color,25),lx,legH/2,lz);
    });
  }

  else if (t === "bed") {
    const fH=info.frameH, mH=info.mattH, pH=info.pillowH;
    // frame
    box(W+0.04, fH, D+0.04, darkenHex(color,10), 0, fH/2, 0, 0.7);
    // headboard
    box(W, 0.60, 0.08, darkenHex(color,5), 0, fH+0.30, -D/2+0.04, 0.7);
    // footboard
    box(W, 0.30, 0.06, darkenHex(color,5), 0, fH+0.15, D/2-0.03, 0.7);
    // mattress
    box(W-0.08, mH, D-0.20, "#F5F0E8", 0, fH+mH/2, 0.05, 0.9);
    // blanket
    box(W-0.12, 0.08, D*0.55, "#E8E0D0", 0, fH+mH+0.04, D*0.15, 0.85);
    // pillows
    const nc = W>1.2 ? 2 : 1;
    const pw=(W-0.20)/(nc);
    for(let i=0;i<nc;i++){
      const px=-W/2+0.10+pw/2+i*(pw);
      box(pw-0.04, pH, 0.30, "#FFFFFF", px, fH+mH+pH/2, -D/2+0.20, 0.95);
    }
  }

  else if (t === "shelf") {
    const shelves = 5, shelfT=0.03, sideT=0.03;
    box(sideT, info.h, D, darkenHex(color,10), -W/2+sideT/2, info.h/2, 0);
    box(sideT, info.h, D, darkenHex(color,10),  W/2-sideT/2, info.h/2, 0);
    box(W, shelfT, D, color, 0, shelfT/2, 0); // bottom
    box(W, shelfT, D, color, 0, info.h-shelfT/2, 0); // top
    for(let i=1;i<shelves-1;i++){
      const sy = (info.h/(shelves-1))*i;
      box(W-sideT*2, shelfT, D, lightenHex(color,15), 0, sy, 0);
    }
    // books on shelves
    const bookColors=["#8B4E4E","#4E6B8B","#4E8B5A","#8B7A4E","#6B4E8B"];
    for(let s=1;s<shelves-1;s++){
      const sy=(info.h/(shelves-1))*s + shelfT;
      let bx=-W/2+sideT+0.02;
      while(bx < W/2-sideT-0.04){
        const bw=0.02+Math.random()*0.03, bh=0.10+Math.random()*0.08;
        const bc=bookColors[Math.floor(Math.random()*bookColors.length)];
        box(bw,bh,D*0.8,bc,bx+bw/2,sy+bh/2,0);
        bx+=bw+0.003;
      }
    }
  }

  else if (t === "tv") {
    // stand
    box(W*0.25, info.standH||0.60, 0.06, darkenHex(color,10), 0, (info.standH||0.60)/2, 0);
    box(W*0.5,  0.04, D, darkenHex(color,10), 0, 0.02, 0);
    // screen frame
    const fh=info.h||0.55;
    const sy=(info.standH||0.60)+fh/2;
    box(W, fh, 0.06, "#1A1A1A", 0, sy, 0, 0.3);
    box(W-0.04, fh-0.04, 0.02, "#1A2030", 0, sy, 0.025, 0.1);
  }

  else if (t === "plant") {
    // pot
    cyl(W*0.28, W*0.22, info.h*0.25, darkenHex(color,20), 0, info.h*0.125, 0, 12);
    // soil
    cyl(W*0.27, W*0.27, 0.03, "#3A2A1A", 0, info.h*0.25+0.015, 0, 12);
    // stem
    cyl(0.015,0.015, info.h*0.5, darkenHex(color,5), 0, info.h*0.25+info.h*0.25, 0, 6);
    // foliage balls
    [[0,info.h,0],[W*0.18,info.h*0.85,W*0.1],[-W*0.18,info.h*0.80,-W*0.08],[W*0.1,info.h*0.90,-W*0.14]].forEach(([fx,fy,fz],i)=>{
      const fr=W*(0.28-i*0.02);
      const fc=i===0?lightenHex(color,20):i===1?lightenHex(color,10):color;
      const sphere=new THREE.Mesh(new THREE.SphereGeometry(fr,10,8), mat(fc,0.9));
      sphere.position.set(fx,fy,fz);
      sphere.castShadow=true;
      group.add(sphere);
    });
  }

  else if (t === "lamp") {
    // base
    cyl(0.10,0.12,0.04,darkenHex(color,20),0,0.02,0,12);
    // pole
    cyl(0.02,0.02,info.h-0.20,darkenHex(color,10),0,info.h*0.5-0.08,0,8);
    // shade
    cyl(0.18,0.08,0.25,color,0,info.h-0.10,0,12);
    // light glow disk
    cyl(0.06,0.06,0.01,lightenHex(color,60),0,info.h-0.22,0,12);
  }

  else if (t === "rug") {
    box(W, 0.015, D, color, 0, 0.0075, 0, 1.0);
    box(W-0.08, 0.016, D-0.08, darkenHex(color,15), 0, 0.008, 0, 1.0);
  }

  else {
    // generic box
    const h = info.h || 0.5;
    box(W, h, D, color, 0, h/2, 0);
    box(W-0.04, h-0.04, D-0.04, lightenHex(color,15), 0, h/2+0.01, 0);
  }

  return group;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function RoomViewer3D({ items = [], room = { w:5, d:4, shape:"rect", wallColor:"#F5F0E8", floorColor:"#C8A97A" }, onBackTo2D, canExport = false, onOpenExport }) {

  const mountRef   = useRef(null);
  const sceneRef   = useRef(null);
  const rendRef    = useRef(null);
  const camRef     = useRef(null);
  const controlsRef = useRef(null);
  const frameRef   = useRef(null);
  const orbitRef   = useRef({ theta:0.6, phi:0.9, radius:8, dragging:false, lastX:0, lastY:0 });

  const [loaded, setLoaded]     = useState(false);
  const [toast,  setToast]      = useState({ msg:"", show:false });
  const [camMode, setCamMode]   = useState("orbit"); // orbit | walk | top
  const [shadows, setShadows]   = useState(true);
  const [showCeiling, setShowCeiling] = useState(false);
  const toastTimer = useRef(null);

  function showToast(msg) {
    setToast({msg,show:true});
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(()=>setToast(t=>({...t,show:false})),2200);
  }

  // ── Load Three.js from CDN then build scene ─────────────────────────────
  useEffect(() => {
    let animId;

    function init() {
      const mount = mountRef.current;
      if (!mount) return;
      const W = mount.clientWidth, H = mount.clientHeight;

      // ── Renderer
      const renderer = new THREE.WebGLRenderer({ antialias:true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.touchAction = "none";
      rendRef.current = renderer;

      // ── Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#D4D0C8");
      scene.fog = new THREE.FogExp2("#D4D0C8", 0.04);
      sceneRef.current = scene;

      // ── Camera
      const camera = new THREE.PerspectiveCamera(55, W/H, 0.1, 200);
      camRef.current = camera;
      const cx = room.w/2, cz = room.d/2;
      const ob = orbitRef.current;
      updateCamera(camera, cx, cz, ob.theta, ob.phi, ob.radius);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.minDistance = 1.5;
      controls.maxDistance = 20;
      controls.minPolarAngle = 0.15;
      controls.maxPolarAngle = 1.45;
      controls.target.set(cx, 0.8, cz);
      controls.update();
      controlsRef.current = controls;

      // ── Ambient light
      const ambient = new THREE.AmbientLight(0xffffff, 0.55);
      scene.add(ambient);

      // ── Ceiling light (warm)
      const ceiling = new THREE.PointLight(0xFFF5E0, 1.2, 20);
      ceiling.position.set(cx, 2.8, cz);
      ceiling.castShadow = true;
      ceiling.shadow.mapSize.width  = 1024;
      ceiling.shadow.mapSize.height = 1024;
      ceiling.shadow.camera.near = 0.1;
      ceiling.shadow.camera.far  = 15;
      scene.add(ceiling);

      // ── Sun directional light
      const sun = new THREE.DirectionalLight(0xFFFAF0, 0.8);
      sun.position.set(room.w+3, 6, -3);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048,2048);
      sun.shadow.camera.near = 0.5;
      sun.shadow.camera.far  = 30;
      sun.shadow.camera.left = -10;
      sun.shadow.camera.right = 10;
      sun.shadow.camera.top  = 10;
      sun.shadow.camera.bottom = -10;
      scene.add(sun);

      // ── Window fill light (cool blue)
      const fill = new THREE.DirectionalLight(0xC0D8FF, 0.35);
      fill.position.set(-4, 3, cz);
      scene.add(fill);

      // ── Build room geometry
      buildRoom(THREE, scene, room);

      // ── Build furniture
      items.forEach(item => {
        const group = buildFurniture3D(THREE, item);
        // Position: item.x & item.y are plan coords (item.y = depth/z)
        // Centre the group on the item footprint
        group.position.set(item.x + item.w/2, 0, item.y + item.h/2);
        // Rotation: item.rot is clockwise degrees in 2D plan → negate for Three.js Y rotation
        group.rotation.y = -(item.rot||0) * Math.PI/180;
        // Flip
        if (item.flipped) group.scale.x = -1;
        scene.add(group);
      });

      // ── Animate
      function animate() {
        animId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
      frameRef.current = () => cancelAnimationFrame(animId);
    }

    init();
    setLoaded(true);

    // ── Resize
    function onResize() {
      const mount = mountRef.current;
      const renderer = rendRef.current;
      const camera = camRef.current;
      if (!mount||!renderer||!camera) return;
      const W=mount.clientWidth, H=mount.clientHeight;
      renderer.setSize(W,H);
      camera.aspect = W/H;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (frameRef.current) frameRef.current();
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      const r = rendRef.current;
      if (r) { r.dispose(); const el=r.domElement; if(el.parentNode) el.parentNode.removeChild(el); }
    };
  }, [items, room]);

  // ── Update shadow when toggle changes ──────────────────────────────────
  useEffect(() => {
    const r = rendRef.current;
    if (r) r.shadowMap.enabled = shadows;
  }, [shadows]);

  function updateCamera(camera, cx, cz, theta, phi, radius) {
    const x = cx + radius * Math.sin(phi) * Math.sin(theta);
    const y =      radius * Math.cos(phi);
    const z = cz + radius * Math.sin(phi) * Math.cos(theta);
    camera.position.set(x, y, z);
    camera.lookAt(cx, 0.8, cz);
  }

  // ── Camera presets ───────────────────────────────────────────────────────
  function setCameraPreset(preset) {
    if (!camRef.current) return;
    const ob = orbitRef.current;
    if (preset==="front")  { ob.theta=0;     ob.phi=0.85; ob.radius=8; }
    if (preset==="side")   { ob.theta=Math.PI/2; ob.phi=0.85; ob.radius=8; }
    if (preset==="top")    { ob.theta=0.6;   ob.phi=0.15; ob.radius=10; }
    if (preset==="corner") { ob.theta=0.6;   ob.phi=0.75; ob.radius=9; }
    updateCamera(camRef.current, room.w/2, room.d/2, ob.theta, ob.phi, ob.radius);
    if (controlsRef.current) {
      controlsRef.current.target.set(room.w/2, 0.8, room.d/2);
      controlsRef.current.update();
    }
    setCamMode(preset);
    showToast(`${preset.charAt(0).toUpperCase()+preset.slice(1)} view`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
        .rv-root *, .rv-root *::before, .rv-root *::after { box-sizing:border-box; margin:0; padding:0; }
        .rv-root {
          --bg:#F7F5F0; --surface:#FFFFFF; --surface2:#F2EFE9;
          --border:#E0DCD4; --border2:#C8C3B8;
          --text:#1A1916; --text2:#6B6760; --text3:#9A9791;
          --accent:#3D5A47; --accent-light:#EDF2EF;
          --accent2:#B8824A;
          font-family:'DM Sans',sans-serif;
          background:#1A1916; height:100vh; display:flex; flex-direction:column; overflow:hidden;
        }
        .rv-header {
          background:rgba(26,25,22,0.92); backdrop-filter:blur(12px);
          border-bottom:1px solid rgba(255,255,255,0.08);
          padding:0 20px; height:52px; display:flex; align-items:center;
          justify-content:space-between; flex-shrink:0; z-index:100; position:relative;
        }
        .rv-logo { display:flex; align-items:center; gap:8px; font-family:'DM Serif Display',serif; font-size:18px; color:#F5F0E8; letter-spacing:-0.3px; }
        .rv-logo-img { width:24px; height:24px; object-fit:contain; border-radius:6px; background:#fff; }
        .rv-logo span { color:var(--accent2); }
        .rv-actions { display:flex; gap:8px; align-items:center; }
        .rv-btn {
          display:inline-flex; align-items:center; gap:6px;
          font-family:inherit; font-size:12px; font-weight:500;
          padding:6px 12px; border-radius:6px;
          border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.08);
          color:#E8E4DC; cursor:pointer; transition:all 0.15s; white-space:nowrap;
        }
        .rv-btn:hover { background:rgba(255,255,255,0.15); }
        .rv-btn.active { background:var(--accent); border-color:var(--accent); color:#fff; }
        .rv-btn.primary { background:#F0A500; border-color:#F0A500; color:#fff; }
        .rv-btn.primary:hover { background:#D89200; border-color:#D89200; }
        .rv-canvas-wrap {
          flex:1; position:relative; overflow:hidden;
          cursor:grab; touch-action:none;
        }
        .rv-canvas-wrap:active { cursor:grabbing; }
        .rv-canvas-wrap canvas { display:block; width:100% !important; height:100% !important; }
        .rv-controls {
          position:absolute; left:16px; top:16px;
          display:flex; flex-direction:column; gap:6px;
        }
        .rv-ctrl-group {
          background:rgba(26,25,22,0.75); backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,0.10); border-radius:8px;
          padding:8px; display:flex; flex-direction:column; gap:4px;
        }
        .rv-ctrl-title {
          font-size:9px; font-weight:600; letter-spacing:0.1em;
          text-transform:uppercase; color:rgba(255,255,255,0.35);
          padding:0 2px 4px; border-bottom:1px solid rgba(255,255,255,0.08); margin-bottom:2px;
        }
        .rv-icon-btn {
          display:flex; align-items:center; gap:7px;
          font-family:inherit; font-size:11px; font-weight:500;
          padding:5px 10px; border-radius:5px;
          border:1px solid transparent; background:transparent;
          color:rgba(255,255,255,0.65); cursor:pointer; transition:all 0.12s;
          white-space:nowrap;
        }
        .rv-icon-btn:hover { background:rgba(255,255,255,0.10); color:#fff; }
        .rv-icon-btn.active { background:rgba(61,90,71,0.5); border-color:rgba(61,90,71,0.8); color:#8FC99C; }
        .rv-info {
          position:absolute; right:16px; bottom:16px;
          background:rgba(26,25,22,0.75); backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,0.10); border-radius:8px;
          padding:10px 14px; font-size:11px; color:rgba(255,255,255,0.50);
          line-height:1.8;
        }
        .rv-info b { color:rgba(255,255,255,0.80); font-weight:500; }
        .rv-loading {
          position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          flex-direction:column; gap:12px; background:#1A1916; z-index:50;
        }
        .rv-spinner {
          width:32px; height:32px; border-radius:50%;
          border:3px solid rgba(61,90,71,0.3); border-top-color:#3D5A47;
          animation:rv-spin 0.8s linear infinite;
        }
        @keyframes rv-spin { to { transform:rotate(360deg); } }
        .rv-loading p { font-size:13px; color:rgba(255,255,255,0.4); }
        .rv-toast {
          position:fixed; bottom:40px; left:50%; transform:translateX(-50%) translateY(16px);
          background:#F5F0E8; color:#1A1916; padding:8px 18px;
          border-radius:20px; font-size:13px; font-weight:500;
          opacity:0; pointer-events:none; transition:all 0.25s; z-index:999;
        }
        .rv-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
        .rv-divider { width:1px; height:16px; background:rgba(255,255,255,0.12); margin:0 4px; align-self:center; }
      `}</style>

      <div className="rv-root">

        {/* ── HEADER ── */}
        <header className="rv-header">
           <div style={{ background: "#FBF5E8", fontFamily: "'Inter', sans-serif", color: "#ffffff" }}>
                          <div style={{ background: "#1A1916", borderBottom: "1px solid #E5E7EB", padding: "0 40px", height: 55, display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                              style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
           >
                              <div style={{ width: 36, height: 36, background: "#fff", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                <img src={logoImg} alt="Comforta logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>Comforta</div>
                                <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "#b3b8c1" }}>Studio Library</div>
                              </div>
                            </div>
                            </div>
                            </div>
          <div className="rv-actions" >
            <span style={{fontSize:"11px",color:"rgba(255,255,255,0.35)"}}>
              {items.length} item{items.length!==1?"s":""} · {room.w}m × {room.d}m
            </span>
            <div className="rv-divider" />
            <button className={`rv-btn${shadows?" active":""}`} onClick={()=>{setShadows(s=>!s); showToast(shadows?"Shadows off":"Shadows on");}}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Shadows
            </button>
            <button className={`rv-btn${showCeiling?" active":""}`} onClick={()=>{ setShowCeiling(c=>!c); showToast(!showCeiling?"Ceiling shown":"Ceiling hidden"); }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M5 5v9M11 5v9M2 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Ceiling
            </button>
            {canExport ? (
              <button className="rv-btn" onClick={()=> onOpenExport ? onOpenExport() : showToast("Export page is not connected") }>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v7M5.5 6.5L8 9l2.5-2.5M3 11.5v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Project Export
              </button>
            ) : null}
            <div className="rv-divider" />
            <button className="rv-btn primary" onClick={()=> onBackTo2D ? onBackTo2D() : showToast("onBackTo2D prop not connected")}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 2v4h3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6 9l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to 2D
            </button>
          </div>
        </header>

        {/* ── 3D CANVAS ── */}
        <div className="rv-canvas-wrap" ref={mountRef}>
          {/* Loading overlay */}
          {!loaded && (
            <div className="rv-loading">
              <div className="rv-spinner" />
              <p>Building 3D scene…</p>
            </div>
          )}

          {/* Camera controls */}
          {loaded && (
            <div className="rv-controls">
              <div className="rv-ctrl-group">
                <div className="rv-ctrl-title">Camera</div>
                {[["corner","Corner","M3 3l4 4M13 3l-4 4M3 13l4-4M13 13l-4-4"],
                  ["front","Front","M2 8h12M8 2v12"],
                  ["side","Side","M4 2v12M4 8h8"],
                  ["top","Top","M2 2h12v12H2z"],
                ].map(([id,label,path])=>(
                  <button key={id} className={`rv-icon-btn${camMode===id?" active":""}`} onClick={()=>setCameraPreset(id)}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d={path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    {label}
                  </button>
                ))}
              </div>
              <div className="rv-ctrl-group">
                <div className="rv-ctrl-title">Zoom</div>
                <button className="rv-icon-btn" onClick={()=>{orbitRef.current.radius=Math.max(1.5,orbitRef.current.radius-1.5);if(camRef.current)updateCamera_();}}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 14l-3-3M7 5v4M5 7h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Zoom In
                </button>
                <button className="rv-icon-btn" onClick={()=>{orbitRef.current.radius=Math.min(20,orbitRef.current.radius+1.5);if(camRef.current)updateCamera_();}}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 14l-3-3M5 7h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Zoom Out
                </button>
              </div>
            </div>
          )}

          {/* Info overlay */}
          {loaded && (
            <div className="rv-info">
              <b>Drag</b> to orbit &nbsp;·&nbsp; <b>Scroll</b> to zoom<br/>
              Room: <b>{room.w}m × {room.d}m</b> &nbsp;·&nbsp; <b>{items.length}</b> items
            </div>
          )}
        </div>

        <div className="rv-toast show" style={{display:"none"}} />
        <div className={`rv-toast${toast.show?" show":""}`}>{toast.msg}</div>
      </div>
    </>
  );

  function updateCamera_() {
    const ob = orbitRef.current;
    updateCamera(camRef.current, room.w/2, room.d/2, ob.theta, ob.phi, ob.radius);
    if (controlsRef.current) {
      controlsRef.current.target.set(room.w/2, 0.8, room.d/2);
      controlsRef.current.update();
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOM GEOMETRY BUILDER
// ─────────────────────────────────────────────────────────────────────────────
function buildRoom(THREE, scene, room) {
  const W = room.w, D = room.d, H = 2.80;
  const wallColor   = room.wallColor  || "#F5F0E8";
  const floorColor  = room.floorColor || "#C8A97A";

  function mat(hex, rough=0.85, metal=0) {
    return new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness:rough, metalness:metal, side: THREE.FrontSide });
  }
  function box(w,h,d,hex,x,y,z,rough=0.85) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat(hex,rough));
    m.position.set(x,y,z);
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }

  // Floor — warm wood planks via vertex colors / texture approximation
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D, Math.ceil(W*4), Math.ceil(D*4)),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(floorColor), roughness:0.9, metalness:0 })
  );
  floor.rotation.x = -Math.PI/2;
  floor.position.set(W/2, 0, D/2);
  floor.receiveShadow = true;
  scene.add(floor);

  // Floor plank lines
  for(let i=0;i<=Math.ceil(W/0.15);i++){
    const lx=i*0.15;
    const plk=new THREE.Mesh(
      new THREE.PlaneGeometry(0.008,D),
      new THREE.MeshStandardMaterial({color:new THREE.Color(darkenHex(floorColor,18)),roughness:1})
    );
    plk.rotation.x=-Math.PI/2; plk.position.set(lx,0.001,D/2);
    scene.add(plk);
  }

  const wallT = 0.12;

  if (room.shape === "L") {
    // L-shape: main section + notch cut
    // Floor already full — clip with walls
    // Walls for L
    // Back wall (full width)
    box(W+wallT*2, H, wallT, wallColor, W/2, H/2, -wallT/2);
    // Left wall (full depth)
    box(wallT, H, D+wallT*2, wallColor, -wallT/2, H/2, D/2);
    // Right wall (only top 55%)
    box(wallT, H, D*0.55+wallT, wallColor, W+wallT/2, H/2, D*0.55/2-wallT/2);
    // Inner horizontal wall
    box(W*0.45+wallT, H, wallT, wallColor, W*0.775+wallT/2, H/2, D*0.55+wallT/2);
    // Inner vertical wall
    box(wallT, H, D*0.45+wallT, wallColor, W*0.55-wallT/2, H/2, D*0.775);
    // Bottom wall (55% of width)
    box(W*0.55+wallT*2, H, wallT, wallColor, W*0.275, H/2, D+wallT/2);
  } else {
    // Back wall
    box(W+wallT*2, H, wallT, wallColor, W/2, H/2, -wallT/2);
    // Front wall (with opening)
    box((W-2)/2, H, wallT, wallColor, (W-2)/4, H/2, D+wallT/2);
    box((W-2)/2, H, wallT, wallColor, W-(W-2)/4, H/2, D+wallT/2);
    box(W+wallT*2, H*0.25, wallT, wallColor, W/2, H*0.875, D+wallT/2); // top strip
    // Left wall
    box(wallT, H, D, wallColor, -wallT/2, H/2, D/2);
    // Right wall (with window cutout)
    box(wallT, H, (D-1.8)/2, wallColor, W+wallT/2, H/2, (D-1.8)/4);
    box(wallT, H, (D-1.8)/2, wallColor, W+wallT/2, H/2, D-(D-1.8)/4);
    box(wallT, H*0.28, 1.8, wallColor, W+wallT/2, H*0.86, D/2); // window top
    box(wallT, H*0.18, 1.8, wallColor, W+wallT/2, H*0.09, D/2); // window sill
    // Window glass
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, H*0.54),
      new THREE.MeshStandardMaterial({color:new THREE.Color("#A8C8E8"),transparent:true,opacity:0.3,metalness:0.1,roughness:0.05,side:THREE.DoubleSide})
    );
    glass.rotation.y = Math.PI/2;
    glass.position.set(W+wallT/2, H*0.27+H*0.18, D/2);
    scene.add(glass);
    // Window frame
    [[W+wallT/2, H*0.18+H*0.54/2, D/2-0.9],[W+wallT/2,H*0.18+H*0.54/2,D/2+0.9]].forEach(([fx,fy,fz])=>{
      const fr=new THREE.Mesh(new THREE.BoxGeometry(0.04,H*0.54+0.04,0.04),mat("#F0EBE0"));
      fr.position.set(fx,fy,fz); scene.add(fr);
    });
  }

  // Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(W,D),
    new THREE.MeshStandardMaterial({color:new THREE.Color(lightenHex(wallColor,15)),roughness:0.95,side:THREE.DoubleSide})
  );
  ceiling.rotation.x = Math.PI/2;
  ceiling.position.set(W/2, H, D/2);
  ceiling.name = "ceiling";
  scene.add(ceiling);

  // Ceiling light fixture
  const fixture = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15,0.12,0.08,16),
    new THREE.MeshStandardMaterial({color:new THREE.Color("#E8E4D8"),roughness:0.4,metalness:0.3})
  );
  fixture.position.set(W/2, H-0.04, D/2);
  scene.add(fixture);
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.06,12,8),
    new THREE.MeshStandardMaterial({color:new THREE.Color("#FFF8E0"),emissive:new THREE.Color("#FFF5C0"),emissiveIntensity:1.5,roughness:0})
  );
  bulb.position.set(W/2, H-0.12, D/2);
  scene.add(bulb);

  // Skirting boards
  const skirtH=0.08, skirtD=0.03;
  box(W, skirtH, skirtD, darkenHex(wallColor,8), W/2, skirtH/2, skirtD/2);       // back
  box(skirtD, skirtH, D, darkenHex(wallColor,8), skirtD/2, skirtH/2, D/2);       // left
  box(skirtD, skirtH, D, darkenHex(wallColor,8), W-skirtD/2, skirtH/2, D/2);     // right

  // Rug sheen layer
  const rugSheen = new THREE.Mesh(
    new THREE.PlaneGeometry(W,D),
    new THREE.MeshStandardMaterial({transparent:true,opacity:0,roughness:1})
  );
  rugSheen.rotation.x=-Math.PI/2;
  rugSheen.position.set(W/2,0.001,D/2);
  scene.add(rugSheen);
}

