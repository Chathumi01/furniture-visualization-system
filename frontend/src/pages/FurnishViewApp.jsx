import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_PROJECTS = {
  "FV-2847": {
    id: "FV-2847", customer: "Amara Perera", designer: "Nilufar Hassan",
    room: "Living Room", status: "ready", createdAt: "12 Mar 2026",
    budget: 2400, spent: 2150,
    furniture: [
      { name: "3-Seat Sofa",    color: "#8B7B6B", qty: 1, price: 850 },
      { name: "Coffee Table",   color: "#B89870", qty: 1, price: 320 },
      { name: "Area Rug",       color: "#D4B890", qty: 1, price: 180 },
      { name: "Floor Lamp",     color: "#C8B870", qty: 2, price: 140 },
      { name: "Side Table",     color: "#C8A87A", qty: 2, price: 160 },
      { name: "TV Unit",        color: "#505050", qty: 1, price: 500 },
    ],
    dimensions: "5m × 4m",
    notes: "Customer prefers warm neutrals. Needs good reading light near sofa.",
  },
  "FV-3901": {
    id: "FV-3901", customer: "Roshan Silva", designer: "Tomas Brecht",
    room: "Bedroom", status: "draft", createdAt: "14 Mar 2026",
    budget: 3200, spent: 2980,
    furniture: [
      { name: "Double Bed",     color: "#9A8EAA", qty: 1, price: 1200 },
      { name: "Wardrobe",       color: "#7A6858", qty: 1, price: 980 },
      { name: "Side Table",     color: "#C8A87A", qty: 2, price: 200 },
      { name: "Desk",           color: "#B0966A", qty: 1, price: 600 },
    ],
    dimensions: "4m × 3.5m",
    notes: "Minimalist style. Light wood tones preferred.",
  },
};

const FURNITURE_CATALOG = [
  { id:1, name:"Harlow Sofa",      category:"Seating",  price:850,  color:"#8B7B6B", w:2.2, d:0.9, icon:"sofa3"    },
  { id:2, name:"Brio Armchair",    category:"Seating",  price:420,  color:"#9A7B6B", w:0.9, d:0.9, icon:"chair"    },
  { id:3, name:"Mesa Coffee Table",category:"Tables",   price:320,  color:"#B89870", w:1.1, d:0.6, icon:"ctable"   },
  { id:4, name:"Alto Dining Set",  category:"Dining",   price:1200, color:"#C8936A", w:1.6, d:0.9, icon:"dtable"   },
  { id:5, name:"Lux Double Bed",   category:"Bedroom",  price:1200, color:"#9A8EAA", w:1.6, d:2.0, icon:"bed2"     },
  { id:6, name:"Haven Wardrobe",   category:"Bedroom",  price:980,  color:"#7A6858", w:1.8, d:0.65,icon:"wardrobe" },
  { id:7, name:"Studio Desk",      category:"Office",   price:600,  color:"#B0966A", w:1.4, d:0.7, icon:"desk"     },
  { id:8, name:"Vista Bookshelf",  category:"Storage",  price:380,  color:"#8A7060", w:1.0, d:0.35,icon:"book"     },
  { id:9, name:"Frame TV Unit",    category:"Storage",  price:500,  color:"#505050", w:1.6, d:0.45,icon:"tv"       },
  {id:10, name:"Serene Rug 2×1.5", category:"Decor",   price:180,  color:"#D4B890", w:2.0, d:1.5, icon:"rug"      },
  {id:11, name:"Arc Floor Lamp",   category:"Lighting", price:140,  color:"#C8B870", w:0.35,d:0.35,icon:"lamp"     },
  {id:12, name:"Olive Plant",      category:"Decor",    price:95,   color:"#5A9A60", w:0.4, d:0.4, icon:"plant"    },
];

const DESIGNERS = [
  { id:1, name:"Nilufar Hassan",  specialty:"Contemporary",  projects:42, avatar:"NH" },
  { id:2, name:"Tomas Brecht",    specialty:"Scandinavian",  projects:38, avatar:"TB" },
  { id:3, name:"Yuki Tanaka",     specialty:"Minimalist",    projects:55, avatar:"YT" },
];

// ─── CANVAS ICON DRAW ─────────────────────────────────────────────────────────
function drawIcon(canvas, icon, color) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = color;
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 1;
  const r = 4;
  function rr(x,y,bw,bh) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+bw-r,y);
    ctx.quadraticCurveTo(x+bw,y,x+bw,y+r);
    ctx.lineTo(x+bw,y+bh-r);
    ctx.quadraticCurveTo(x+bw,y+bh,x+bw-r,y+bh);
    ctx.lineTo(x+r,y+bh);
    ctx.quadraticCurveTo(x,y+bh,x,y+bh-r);
    ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
  }
  const p = 6;
  rr(p,p,w-p*2,h-p*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = `rgba(255,255,255,0.3)`;
  rr(p+4,p+4,w-p*2-8,(h-p*2)*0.45); ctx.fill();
}

function FurnIcon({ icon, color, size=48 }) {
  const ref = useRef(null);
  useEffect(() => { drawIcon(ref.current, icon, color); }, [icon, color]);
  return <canvas ref={ref} width={size} height={size} style={{borderRadius:8}} />;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

:root {
  --cream: #F8F4EE;
  --warm:  #F2EBE0;
  --sand:  #E8DDD0;
  --tan:   #C8B89A;
  --bark:  #8A7055;
  --soil:  #4A3728;
  --forest:#3D5A47;
  --moss:  #5A7A60;
  --sage:  #EDF2EF;
  --ink:   #1A1512;
  --muted: #7A6A5A;
  --light: #AFA08C;
  --gold:  #B8924A;
  --gold-l:#FBF5ED;
  --red:   #C0392B;
  --border:#DDD5C8;
  --shadow: 0 2px 12px rgba(74,55,40,0.10);
  --shadow-lg: 0 8px 40px rgba(74,55,40,0.15);
  --r: 10px; --r2: 16px; --r3: 24px;
}

body { font-family:'Jost',sans-serif; background:var(--cream); color:var(--ink); }

h1,h2,h3,.serif { font-family:'Cormorant Garamond',serif; }

/* NAV */
.nav {
  position:sticky; top:0; z-index:200;
  background:rgba(248,244,238,0.92); backdrop-filter:blur(16px);
  border-bottom:1px solid var(--border);
  height:64px; display:flex; align-items:center;
  padding:0 40px; gap:32px;
}
.nav-logo { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--soil); cursor:pointer; letter-spacing:-0.3px; }
.nav-logo span { color:var(--forest); }
.nav-links { display:flex; gap:4px; margin-left:auto; }
.nav-link {
  font-size:13px; font-weight:500; padding:7px 14px; border-radius:var(--r);
  border:none; background:none; color:var(--muted); cursor:pointer; transition:all 0.15s;
  letter-spacing:0.02em;
}
.nav-link:hover { background:var(--warm); color:var(--ink); }
.nav-link.active { background:var(--forest); color:#fff; }
.nav-link.gold { background:var(--gold); color:#fff; }
.nav-link.gold:hover { background:#a07d3a; }

/* BUTTONS */
.btn {
  display:inline-flex; align-items:center; gap:8px;
  font-family:'Jost',sans-serif; font-size:13px; font-weight:500; letter-spacing:0.03em;
  padding:10px 22px; border-radius:var(--r); border:1.5px solid transparent;
  cursor:pointer; transition:all 0.18s; white-space:nowrap;
}
.btn-primary { background:var(--forest); color:#fff; border-color:var(--forest); }
.btn-primary:hover { background:#2e4436; }
.btn-secondary { background:transparent; color:var(--forest); border-color:var(--forest); }
.btn-secondary:hover { background:var(--sage); }
.btn-gold { background:var(--gold); color:#fff; border-color:var(--gold); }
.btn-gold:hover { background:#a07d3a; }
.btn-ghost { background:transparent; color:var(--muted); border-color:var(--border); }
.btn-ghost:hover { background:var(--warm); color:var(--ink); }
.btn-danger { background:var(--red); color:#fff; border-color:var(--red); }
.btn-sm { padding:7px 14px; font-size:12px; }
.btn-lg { padding:14px 32px; font-size:15px; }

/* CARDS */
.card {
  background:#fff; border:1px solid var(--border); border-radius:var(--r2);
  box-shadow:var(--shadow);
}
.card-hover { transition:transform 0.2s, box-shadow 0.2s; cursor:pointer; }
.card-hover:hover { transform:translateY(-3px); box-shadow:var(--shadow-lg); }

/* BADGE */
.badge {
  display:inline-flex; align-items:center; gap:4px;
  font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase;
  padding:3px 10px; border-radius:20px;
}
.badge-green  { background:#EAF3DE; color:#3B6D11; }
.badge-amber  { background:#FBF5ED; color:#854F0B; }
.badge-blue   { background:#E6F1FB; color:#185FA5; }
.badge-gray   { background:#F1EFE8; color:#5F5E5A; }

/* FORM */
.form-group { display:flex; flex-direction:column; gap:6px; }
.form-label { font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--muted); }
.form-input {
  font-family:'Jost',sans-serif; font-size:14px;
  padding:10px 14px; border:1.5px solid var(--border); border-radius:var(--r);
  background:var(--cream); color:var(--ink); outline:none; transition:border-color 0.15s;
}
.form-input:focus { border-color:var(--forest); background:#fff; }
.form-input::placeholder { color:var(--light); }

/* PAGE SHELL */
.page { min-height:calc(100vh - 64px); }

/* HERO */
.hero {
  background:var(--soil);
  min-height:88vh; display:flex; align-items:center;
  position:relative; overflow:hidden;
}
.hero-bg {
  position:absolute; inset:0;
  background: radial-gradient(ellipse 80% 60% at 70% 50%, rgba(93,138,97,0.18) 0%, transparent 70%),
              radial-gradient(ellipse 40% 40% at 20% 80%, rgba(184,146,74,0.12) 0%, transparent 60%);
}
.hero-grid {
  position:absolute; inset:0; opacity:0.04;
  background-image: linear-gradient(var(--tan) 1px, transparent 1px), linear-gradient(90deg, var(--tan) 1px, transparent 1px);
  background-size: 40px 40px;
}
.hero-content { position:relative; z-index:2; padding:80px 80px; max-width:680px; }
.hero-tag { font-size:11px; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; color:var(--gold); margin-bottom:20px; }
.hero h1 { font-size:clamp(42px,5vw,72px); font-weight:300; color:#F8F4EE; line-height:1.08; margin-bottom:28px; }
.hero h1 em { font-style:italic; color:var(--gold); }
.hero p { font-size:16px; color:rgba(248,244,238,0.65); line-height:1.7; margin-bottom:40px; max-width:480px; }
.hero-actions { display:flex; gap:12px; flex-wrap:wrap; }
.hero-stats { display:flex; gap:40px; margin-top:60px; }
.hero-stat-num { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:300; color:#F8F4EE; }
.hero-stat-label { font-size:11px; color:rgba(248,244,238,0.45); letter-spacing:0.08em; text-transform:uppercase; margin-top:2px; }

/* SECTION */
.section { padding:80px 60px; }
.section-alt { background:var(--warm); }
.section-dark { background:var(--soil); }
.section-header { text-align:center; margin-bottom:56px; }
.section-tag { font-size:11px; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; color:var(--gold); margin-bottom:12px; }
.section-title { font-size:clamp(28px,3vw,44px); font-weight:300; color:var(--ink); line-height:1.15; }
.section-dark .section-title { color:var(--cream); }
.section-sub { font-size:15px; color:var(--muted); line-height:1.7; margin-top:12px; max-width:520px; margin-left:auto; margin-right:auto; }

/* HOW IT WORKS */
.steps-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:32px; }
.step-card { text-align:center; padding:32px 24px; }
.step-num { font-family:'Cormorant Garamond',serif; font-size:56px; font-weight:300; color:var(--tan); line-height:1; margin-bottom:16px; }
.step-title { font-size:16px; font-weight:600; margin-bottom:8px; }
.step-desc { font-size:13px; color:var(--muted); line-height:1.6; }
.step-arrow { display:flex; align-items:center; justify-content:center; color:var(--tan); font-size:24px; padding-top:28px; }

/* FEATURES */
.features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
.feature-card { padding:32px 28px; }
.feature-icon { width:44px; height:44px; border-radius:12px; background:var(--sage); display:flex; align-items:center; justify-content:center; margin-bottom:20px; }
.feature-title { font-size:16px; font-weight:600; margin-bottom:8px; }
.feature-desc { font-size:13px; color:var(--muted); line-height:1.6; }

/* DESIGNERS */
.designers-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
.designer-card { padding:28px; text-align:center; }
.designer-avatar { width:72px; height:72px; border-radius:50%; background:var(--forest); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:600; color:#fff; margin:0 auto 16px; font-family:'Cormorant Garamond',serif; }
.designer-name { font-size:18px; font-weight:400; font-family:'Cormorant Garamond',serif; margin-bottom:4px; }
.designer-spec { font-size:12px; color:var(--muted); letter-spacing:0.05em; }
.designer-projects { font-size:11px; color:var(--light); margin-top:6px; }

/* CATALOG GRID */
.catalog-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; }
.catalog-item { padding:20px; }
.catalog-item-img { width:100%; aspect-ratio:1; background:var(--warm); border-radius:var(--r); display:flex; align-items:center; justify-content:center; margin-bottom:14px; overflow:hidden; }
.catalog-item-name { font-size:15px; font-weight:500; margin-bottom:4px; }
.catalog-item-cat { font-size:11px; color:var(--muted); letter-spacing:0.06em; text-transform:uppercase; margin-bottom:8px; }
.catalog-item-price { font-size:18px; font-family:'Cormorant Garamond',serif; color:var(--forest); }
.catalog-filters { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:28px; }
.filter-btn { font-family:'Jost',sans-serif; font-size:12px; font-weight:500; padding:6px 16px; border-radius:20px; border:1.5px solid var(--border); background:#fff; color:var(--muted); cursor:pointer; transition:all 0.15s; }
.filter-btn.active { background:var(--forest); color:#fff; border-color:var(--forest); }
.filter-btn:hover:not(.active) { background:var(--warm); }

/* CONSULTATION FORM */
.consultation-layout { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:start; max-width:1000px; margin:0 auto; }
.consultation-info h2 { font-size:38px; font-weight:300; margin-bottom:16px; }
.consultation-info p { font-size:14px; color:var(--muted); line-height:1.7; margin-bottom:24px; }
.consult-steps { display:flex; flex-direction:column; gap:16px; }
.consult-step { display:flex; gap:16px; align-items:flex-start; }
.consult-step-dot { width:28px; height:28px; border-radius:50%; background:var(--forest); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0; margin-top:2px; }
.consult-step-text strong { display:block; font-size:14px; margin-bottom:2px; }
.consult-step-text span { font-size:12px; color:var(--muted); }

/* DESIGNER DASHBOARD */
.dash-layout { display:grid; grid-template-columns:260px 1fr; min-height:calc(100vh - 64px); }
.dash-sidebar { background:var(--soil); padding:32px 0; display:flex; flex-direction:column; }
.dash-sidebar-logo { padding:0 24px 24px; border-bottom:1px solid rgba(255,255,255,0.08); margin-bottom:16px; font-family:'Cormorant Garamond',serif; font-size:18px; color:#F8F4EE; font-weight:300; }
.dash-nav-item { display:flex; align-items:center; gap:12px; padding:11px 24px; font-size:13px; font-weight:500; color:rgba(248,244,238,0.55); cursor:pointer; transition:all 0.15s; border-left:3px solid transparent; }
.dash-nav-item:hover { background:rgba(255,255,255,0.05); color:rgba(248,244,238,0.9); }
.dash-nav-item.active { color:#F8F4EE; background:rgba(255,255,255,0.07); border-left-color:var(--gold); }
.dash-main { background:var(--cream); padding:40px; overflow-y:auto; }
.dash-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; }
.dash-title { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:300; }
.dash-metrics { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
.metric-card { padding:20px 24px; }
.metric-label { font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
.metric-val { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:300; }
.metric-sub { font-size:11px; color:var(--light); margin-top:4px; }
.projects-table { width:100%; border-collapse:collapse; }
.projects-table th { font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); padding:10px 16px; text-align:left; border-bottom:1px solid var(--border); }
.projects-table td { padding:14px 16px; border-bottom:1px solid var(--border); font-size:13px; vertical-align:middle; }
.projects-table tr:hover td { background:var(--warm); }
.projects-table tr:last-child td { border-bottom:none; }

/* PROJECT BUILDER */
.builder-layout { display:grid; grid-template-columns:1fr 360px; gap:0; min-height:calc(100vh - 64px); }
.builder-main { padding:32px 40px; overflow-y:auto; }
.builder-sidebar { background:#fff; border-left:1px solid var(--border); padding:24px; overflow-y:auto; display:flex; flex-direction:column; gap:20px; }
.furniture-picker { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.furn-pick-item { padding:12px; border:1.5px solid var(--border); border-radius:var(--r); cursor:pointer; text-align:center; transition:all 0.15s; }
.furn-pick-item:hover { border-color:var(--forest); background:var(--sage); }
.furn-pick-item.selected { border-color:var(--forest); background:var(--sage); }
.furn-pick-name { font-size:11px; font-weight:500; margin-top:6px; }
.furn-pick-price { font-size:10px; color:var(--muted); }
.budget-bar { height:8px; background:var(--sand); border-radius:4px; overflow:hidden; margin-top:8px; }
.budget-fill { height:100%; background:var(--forest); border-radius:4px; transition:width 0.4s; }
.budget-fill.over { background:var(--red); }
.selected-list { display:flex; flex-direction:column; gap:8px; }
.selected-item { display:flex; align-items:center; gap:10px; padding:10px 12px; background:var(--warm); border-radius:var(--r); }
.selected-item-dot { width:14px; height:14px; border-radius:50%; flex-shrink:0; }
.selected-item-name { font-size:12px; font-weight:500; flex:1; }
.selected-item-price { font-size:12px; color:var(--forest); font-weight:600; }
.selected-item-remove { background:none; border:none; color:var(--light); cursor:pointer; padding:2px; line-height:1; font-size:16px; transition:color 0.12s; }
.selected-item-remove:hover { color:var(--red); }

/* TRACKING / CUSTOMER */
.track-hero { background:var(--soil); padding:80px 60px; text-align:center; }
.track-hero h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,4vw,56px); font-weight:300; color:#F8F4EE; margin-bottom:16px; }
.track-hero p { color:rgba(248,244,238,0.55); font-size:15px; margin-bottom:36px; }
.track-input-row { display:flex; gap:8px; max-width:440px; margin:0 auto; }
.track-input { flex:1; font-family:'Jost',sans-serif; font-size:15px; padding:12px 18px; border:1.5px solid rgba(255,255,255,0.15); border-radius:var(--r); background:rgba(255,255,255,0.08); color:#F8F4EE; outline:none; letter-spacing:0.08em; }
.track-input::placeholder { color:rgba(248,244,238,0.3); }
.track-input:focus { border-color:var(--gold); background:rgba(255,255,255,0.12); }

/* PROJECT VIEW (customer) */
.project-view { max-width:1100px; margin:0 auto; padding:48px 40px; }
.project-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:40px; gap:24px; }
.project-id { font-size:12px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); margin-bottom:6px; }
.project-title { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:300; }
.project-meta { display:flex; gap:20px; margin-top:10px; flex-wrap:wrap; }
.project-meta-item { font-size:12px; color:var(--muted); }
.project-meta-item strong { color:var(--ink); font-weight:500; }
.project-grid { display:grid; grid-template-columns:1fr 340px; gap:32px; }
.project-3d-preview { aspect-ratio:16/9; background:var(--soil); border-radius:var(--r2); overflow:hidden; position:relative; display:flex; align-items:center; justify-content:center; }
.project-3d-badge { position:absolute; top:12px; left:12px; }
.project-3d-cta { text-align:center; }
.project-3d-cta p { font-size:13px; color:rgba(248,244,238,0.5); margin-top:8px; }
.order-card { padding:28px; display:flex; flex-direction:column; gap:20px; }
.order-section-title { font-size:12px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); margin-bottom:12px; }
.order-line { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border); font-size:13px; }
.order-line:last-of-type { border-bottom:none; }
.order-line-name { display:flex; align-items:center; gap:8px; }
.order-line-dot { width:10px; height:10px; border-radius:50%; }
.order-total { display:flex; justify-content:space-between; padding-top:12px; border-top:2px solid var(--border); font-weight:600; font-size:15px; }
.order-total-price { font-family:'Cormorant Garamond',serif; font-size:24px; color:var(--forest); }

/* LOGIN */
.login-layout { display:grid; grid-template-columns:1fr 1fr; min-height:calc(100vh - 64px); }
.login-panel { display:flex; align-items:center; justify-content:center; padding:60px 40px; }
.login-panel.dark { background:var(--soil); }
.login-form { width:100%; max-width:380px; }
.login-form h2 { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:300; margin-bottom:8px; }
.login-form .sub { font-size:13px; color:var(--muted); margin-bottom:32px; line-height:1.6; }
.login-divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
.login-divider-line { flex:1; height:1px; background:var(--border); }
.login-divider-text { font-size:11px; color:var(--light); text-transform:uppercase; letter-spacing:0.06em; }
.login-decor { display:flex; align-items:center; justify-content:center; flex-direction:column; gap:24px; text-align:center; padding:40px; }
.login-decor h3 { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:300; color:#F8F4EE; }
.login-decor p { font-size:13px; color:rgba(248,244,238,0.5); line-height:1.7; max-width:280px; }

/* TOAST */
.toast { position:fixed; bottom:32px; left:50%; transform:translateX(-50%) translateY(20px); background:var(--soil); color:var(--cream); padding:10px 22px; border-radius:20px; font-size:13px; font-weight:500; opacity:0; pointer-events:none; transition:all 0.25s; z-index:999; }
.toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

/* MODAL */
.modal-backdrop { position:fixed; inset:0; background:rgba(26,21,18,0.55); display:flex; align-items:center; justify-content:center; z-index:500; }
.modal { background:#fff; border-radius:var(--r2); padding:36px; width:440px; box-shadow:var(--shadow-lg); }
.modal h3 { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300; margin-bottom:16px; }
.modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:24px; }

/* DIVIDERS & SPACING */
.divider { height:1px; background:var(--border); margin:0; }
.mt-4 { margin-top:16px; }
.mt-6 { margin-top:24px; }
.mt-8 { margin-top:32px; }
.gap-4 { gap:16px; }
.flex { display:flex; }
.flex-col { flex-direction:column; }
.items-center { align-items:center; }
.justify-between { justify-content:space-between; }
.text-muted { color:var(--muted); font-size:13px; }
.text-small { font-size:12px; }
.font-serif { font-family:'Cormorant Garamond',serif; }

/* ANIMATIONS */
@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
.fade-up { animation:fadeUp 0.55s ease both; }
.fade-up-1 { animation-delay:0.05s; }
.fade-up-2 { animation-delay:0.15s; }
.fade-up-3 { animation-delay:0.25s; }
.fade-up-4 { animation-delay:0.35s; }

/* 3D PREVIEW MOCK */
.preview-3d { width:100%; height:100%; background:linear-gradient(135deg,#2C2018 0%,#3A2E22 40%,#2A3828 100%); position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; }
.preview-floor { position:absolute; bottom:0; left:0; right:0; height:55%; background:linear-gradient(180deg,rgba(100,74,42,0.6),rgba(80,58,30,0.9)); transform:perspective(600px) rotateX(30deg); transform-origin:bottom; }
.preview-wall-back { position:absolute; top:0; left:0; right:0; height:50%; background:rgba(245,240,232,0.08); }
.preview-wall-left { position:absolute; top:0; left:0; width:30%; height:100%; background:rgba(245,240,232,0.04); transform:perspective(600px) rotateY(-20deg); transform-origin:left; }
.preview-sofa { position:absolute; bottom:22%; left:50%; transform:translateX(-50%); width:42%; height:14%; background:rgba(139,123,107,0.85); border-radius:6px 6px 3px 3px; }
.preview-sofa::before { content:''; position:absolute; top:-55%; left:2%; right:2%; height:55%; background:rgba(139,123,107,0.7); border-radius:4px; }
.preview-table { position:absolute; bottom:17%; left:50%; transform:translateX(-50%); width:22%; height:5%; background:rgba(184,152,112,0.7); border-radius:3px; }
.preview-rug { position:absolute; bottom:14%; left:50%; transform:translateX(-50%); width:50%; height:8%; background:rgba(212,184,144,0.25); border-radius:4px; }
.preview-label { position:absolute; bottom:8px; right:12px; font-size:10px; color:rgba(255,255,255,0.3); letter-spacing:0.06em; font-weight:500; }

/* RESPONSIVE FIXES */
@media(max-width:900px) {
  .steps-grid, .features-grid, .designers-grid { grid-template-columns:1fr 1fr; }
  .consultation-layout, .dash-layout, .login-layout, .project-grid, .builder-layout { grid-template-columns:1fr; }
  .hero-content { padding:60px 32px; }
  .section { padding:60px 24px; }
}
`;

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function ComfortaApp() {
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState({ msg:"", show:false });
  const [modal, setModal] = useState(null);
  const [trackId, setTrackId] = useState("");
  const [trackedProject, setTrackedProject] = useState(null);
  const [trackError, setTrackError] = useState("");
  const [designerTab, setDesignerTab] = useState("dashboard");
  const [catalogFilter, setCatalogFilter] = useState("All");
  const [selectedFurn, setSelectedFurn] = useState([]);
  const [budgetLimit, setBudgetLimit] = useState(3000);
  const [consultForm, setConsultForm] = useState({ name:"", phone:"", room:"", designer:"", date:"", notes:"" });
  const [loginForm, setLoginForm] = useState({ email:"", pass:"" });
  const toastTimer = useRef(null);

  function showToast(msg) {
    setToast({msg,show:true});
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(()=>setToast(t=>({...t,show:false})),2400);
  }

  function nav(p) { setPage(p); window.scrollTo(0,0); }

  const totalSpent = selectedFurn.reduce((s,i)=>s+i.price,0);
  const overBudget = totalSpent > budgetLimit;

  const categories = ["All", ...new Set(FURNITURE_CATALOG.map(f=>f.category))];
  const filteredCatalog = catalogFilter==="All" ? FURNITURE_CATALOG : FURNITURE_CATALOG.filter(f=>f.category===catalogFilter);

  function handleTrack() {
    const p = MOCK_PROJECTS[trackId.trim().toUpperCase()];
    if (p) { setTrackedProject(p); setTrackError(""); }
    else { setTrackError("Project ID not found. Try FV-2847 or FV-3901"); }
  }

  function toggleFurn(item) {
    setSelectedFurn(prev => {
      const exists = prev.find(f=>f.id===item.id);
      if (exists) return prev.filter(f=>f.id!==item.id);
      if (totalSpent + item.price > budgetLimit * 1.2) { showToast("Adding this would exceed budget significantly"); return prev; }
      return [...prev, item];
    });
  }

  // ── PAGES ─────────────────────────────────────────────────────────────────

  function HomePage() {
    return (
      <div className="page">
        {/* HERO */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-grid" />
          <div className="hero-content">
            <div className="hero-tag fade-up">Bespoke Interior Design Studio</div>
            <h1 className="fade-up fade-up-1">Design your space with <em>precision</em> and vision</h1>
            <p className="fade-up fade-up-2">Work with expert designers to visualise your perfect room — in 2D layouts and immersive 3D — before a single piece arrives.</p>
            <div className="hero-actions fade-up fade-up-3">
              <button className="btn btn-gold btn-lg" onClick={()=>nav("consult")}>Book a Consultation</button>
              <button className="btn btn-secondary btn-lg" style={{color:"rgba(248,244,238,0.8)",borderColor:"rgba(248,244,238,0.25)"}} onClick={()=>nav("track")}>Track My Project</button>
            </div>
            <div className="hero-stats fade-up fade-up-4">
              {[["420+","Rooms Designed"],["98%","Customer Satisfaction"],["16","Expert Designers"]].map(([n,l])=>(
                <div key={l}>
                  <div className="hero-stat-num">{n}</div>
                  <div className="hero-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section">
          <div className="section-header">
            <div className="section-tag">The Process</div>
            <h2 className="section-title">From consultation to delivery</h2>
            <p className="section-sub">A seamless journey from choosing your furniture to seeing it rendered in your exact room dimensions.</p>
          </div>
          <div className="steps-grid">
            {[
              ["01","Visit & Consult","Meet your dedicated designer in-store. Share your room dimensions, style preferences, and budget."],
              ["02","Browse & Select","Choose from our curated furniture catalogue. Your designer adds each piece to your design project."],
              ["03","Visualise in 3D","Your designer builds the 2D layout and renders a photorealistic 3D view of your room."],
              ["04","Approve & Order","Log in with your project ID to review the 3D design. Satisfied? Place your order in one click."],
            ].map(([n,t,d],i)=>(
              <div key={n} className="card step-card">
                <div className="step-num">{n}</div>
                <div className="step-title">{t}</div>
                <div className="step-desc">{d}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* FEATURES */}
        <section className="section section-alt">
          <div className="section-header">
            <div className="section-tag">Features</div>
            <h2 className="section-title">Everything you need to decide with confidence</h2>
          </div>
          <div className="features-grid">
            {[
              ["🪑","2D Room Layout","Precise top-down floor plan showing every furniture piece to scale within your room dimensions."],
              ["🧊","3D Visualisation","Immersive 3D walkthrough of your designed room — orbit, zoom, and inspect every angle."],
              ["💰","Budget Tracker","Real-time budget tracking as your designer adds items. Never get surprised by the final bill."],
              ["🎨","Colour Customisation","Change wall colours, floor finishes, and furniture upholstery to match your exact taste."],
              ["📱","Project Tracking","Access your unique design project from anywhere using your personal project tracking ID."],
              ["🛒","One-Click Purchase","When you're happy, purchase your entire design in a single seamless checkout."],
            ].map(([ic,t,d])=>(
              <div key={t} className="card feature-card">
                <div className="feature-icon" style={{fontSize:20}}>{ic}</div>
                <div className="feature-title">{t}</div>
                <div className="feature-desc">{d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* DESIGNERS */}
        <section className="section">
          <div className="section-header">
            <div className="section-tag">Our Team</div>
            <h2 className="section-title">Meet your designers</h2>
          </div>
          <div className="designers-grid">
            {DESIGNERS.map(d=>(
              <div key={d.id} className="card designer-card card-hover" onClick={()=>nav("consult")}>
                <div className="designer-avatar">{d.avatar}</div>
                <div className="designer-name">{d.name}</div>
                <div className="designer-spec">{d.specialty} Specialist</div>
                <div className="designer-projects">{d.projects} projects completed</div>
                <button className="btn btn-secondary btn-sm mt-4" style={{margin:"16px auto 0",display:"flex"}}>Book</button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA DARK */}
        <section className="section section-dark" style={{textAlign:"center"}}>
          <div className="section-tag">Ready to Begin?</div>
          <h2 className="section-title" style={{marginBottom:16}}>Your ideal room is one consultation away</h2>
          <p style={{color:"rgba(248,244,238,0.5)",fontSize:15,marginBottom:32}}>Visit us in-store or book online. We handle everything from design to delivery.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn btn-gold btn-lg" onClick={()=>nav("consult")}>Book Consultation</button>
            <button className="btn btn-ghost btn-lg" style={{color:"rgba(248,244,238,0.7)",borderColor:"rgba(248,244,238,0.2)"}} onClick={()=>nav("catalog")}>Browse Catalogue</button>
          </div>
        </section>
      </div>
    );
  }

  function CatalogPage() {
    return (
      <div className="page section">
        <div className="section-header" style={{textAlign:"left",marginBottom:32}}>
          <div className="section-tag">Catalogue</div>
          <h2 className="section-title">Our Furniture Collection</h2>
        </div>
        <div className="catalog-filters">
          {categories.map(c=>(
            <button key={c} className={`filter-btn${catalogFilter===c?" active":""}`} onClick={()=>setCatalogFilter(c)}>{c}</button>
          ))}
        </div>
        <div className="catalog-grid">
          {filteredCatalog.map(item=>(
            <div key={item.id} className="card catalog-item card-hover">
              <div className="catalog-item-img">
                <FurnIcon icon={item.icon} color={item.color} size={96} />
              </div>
              <div className="catalog-item-cat">{item.category}</div>
              <div className="catalog-item-name">{item.name}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
                <div className="catalog-item-price">£{item.price.toLocaleString()}</div>
                <button className="btn btn-primary btn-sm" onClick={()=>{nav("consult");showToast(`${item.name} noted for consultation`);}}>Add to Project</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ConsultPage() {
    const [step, setStep] = useState(1);
    return (
      <div className="page section" style={{maxWidth:1000,margin:"0 auto"}}>
        {/* Progress */}
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:40}}>
          {["Your Details","Room & Budget","Choose Designer","Confirm"].map((s,i)=>(
            <div key={s} style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:step>i+1?"var(--forest)":step===i+1?"var(--forest)":"var(--sand)",color:step>=i+1?"#fff":"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0,transition:"all 0.2s"}}>
                {step>i+1?"✓":i+1}
              </div>
              <span style={{fontSize:12,color:step===i+1?"var(--forest)":"var(--muted)",fontWeight:step===i+1?600:400,whiteSpace:"nowrap"}}>{s}</span>
              {i<3&&<div style={{flex:1,height:1,background:step>i+1?"var(--forest)":"var(--border)"}} />}
            </div>
          ))}
        </div>

        {step===1&&(
          <div className="consultation-layout">
            <div className="consultation-info">
              <h2 className="font-serif">Tell us about yourself</h2>
              <p>We'll match you with the ideal designer for your style and arrange a consultation at your convenience.</p>
              <div className="consult-steps">
                {[["1","Share your details","Name and contact so we can reach you"],["2","Describe your room","Help us understand your space and aspirations"],["3","Pick a designer","Choose based on specialty and availability"]].map(([n,t,d])=>(
                  <div key={n} className="consult-step">
                    <div className="consult-step-dot">{n}</div>
                    <div className="consult-step-text"><strong>{t}</strong><span>{d}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{padding:32,display:"flex",flexDirection:"column",gap:18}}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="e.g. Amara Perera" value={consultForm.name} onChange={e=>setConsultForm(f=>({...f,name:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="+94 77 123 4567" value={consultForm.phone} onChange={e=>setConsultForm(f=>({...f,phone:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@email.com" />
              </div>
              <button className="btn btn-primary" style={{marginTop:8,justifyContent:"center"}} onClick={()=>{if(!consultForm.name){showToast("Please enter your name");return;}setStep(2);}}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {step===2&&(
          <div className="card" style={{maxWidth:600,margin:"0 auto",padding:40,display:"flex",flexDirection:"column",gap:20}}>
            <h2 className="font-serif" style={{fontSize:32,fontWeight:300}}>Your Room & Budget</h2>
            <div className="form-group">
              <label className="form-label">Room Type</label>
              <select className="form-input" value={consultForm.room} onChange={e=>setConsultForm(f=>({...f,room:e.target.value}))}>
                <option value="">Select room type…</option>
                {["Living Room","Bedroom","Dining Room","Home Office","Guest Room","Other"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div className="form-group">
                <label className="form-label">Room Width (m)</label>
                <input className="form-input" type="number" placeholder="e.g. 5" min={2} max={15} />
              </div>
              <div className="form-group">
                <label className="form-label">Room Depth (m)</label>
                <input className="form-input" type="number" placeholder="e.g. 4" min={2} max={15} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Budget (£)</label>
              <input className="form-input" type="number" placeholder="e.g. 3000" value={budgetLimit} onChange={e=>setBudgetLimit(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Style Preferences</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
                {["Contemporary","Scandinavian","Minimalist","Industrial","Traditional","Bohemian"].map(s=>(
                  <button key={s} className={`filter-btn${consultForm.notes.includes(s)?" active":""}`} onClick={()=>setConsultForm(f=>({...f,notes:f.notes.includes(s)?f.notes.replace(s,"").trim():((f.notes+" "+s).trim())}))}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn btn-ghost" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>setStep(3)}>Continue →</button>
            </div>
          </div>
        )}

        {step===3&&(
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <h2 className="font-serif" style={{fontSize:32,fontWeight:300,marginBottom:8}}>Choose Your Designer</h2>
            <p style={{color:"var(--muted)",fontSize:13,marginBottom:28}}>All designers are available for your requested date.</p>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {DESIGNERS.map(d=>(
                <div key={d.id} className={`card`} style={{padding:20,display:"flex",alignItems:"center",gap:20,cursor:"pointer",border:consultForm.designer===d.name?"2px solid var(--forest)":"1px solid var(--border)",transition:"all 0.15s"}} onClick={()=>setConsultForm(f=>({...f,designer:d.name}))}>
                  <div className="designer-avatar" style={{width:52,height:52,fontSize:16,flexShrink:0}}>{d.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:15}}>{d.name}</div>
                    <div style={{fontSize:12,color:"var(--muted)"}}>{d.specialty} · {d.projects} projects</div>
                  </div>
                  {consultForm.designer===d.name&&<div style={{color:"var(--forest)",fontSize:20}}>✓</div>}
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,marginTop:24}}>
              <button className="btn btn-ghost" onClick={()=>setStep(2)}>← Back</button>
              <button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>{if(!consultForm.designer){showToast("Please select a designer");return;}setStep(4);}}>Continue →</button>
            </div>
          </div>
        )}

        {step===4&&(
          <div style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}>
            <div style={{fontSize:56,marginBottom:16}}>✅</div>
            <h2 className="font-serif" style={{fontSize:38,fontWeight:300,marginBottom:12}}>You're all set!</h2>
            <p style={{color:"var(--muted)",fontSize:14,lineHeight:1.7,marginBottom:28}}>
              Your consultation with <strong>{consultForm.designer}</strong> has been requested for your <strong>{consultForm.room||"room"}</strong>.<br/>
              We'll confirm within 24 hours and send your <strong>Project ID</strong> by SMS & email.
            </p>
            <div className="card" style={{padding:24,marginBottom:24,background:"var(--sage)",border:"1.5px solid var(--forest)"}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--forest)",marginBottom:6}}>Your Preview Project ID</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,letterSpacing:"0.08em",color:"var(--soil)"}}>FV-{Math.floor(1000+Math.random()*8999)}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:6}}>Use this to track your project on our site</div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="btn btn-primary" onClick={()=>nav("track")}>Track My Project</button>
              <button className="btn btn-ghost" onClick={()=>nav("home")}>Back to Home</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function TrackPage() {
    return (
      <div className="page">
        <div className="track-hero">
          <div className="section-tag" style={{color:"var(--gold)"}}>Customer Portal</div>
          <h1>Track your design project</h1>
          <p>Enter your project ID to view your 3D room design and place your order.</p>
          <div className="track-input-row">
            <input className="track-input" placeholder="e.g. FV-2847" value={trackId} onChange={e=>{setTrackId(e.target.value);setTrackError("");}} onKeyDown={e=>e.key==="Enter"&&handleTrack()} />
            <button className="btn btn-gold" onClick={handleTrack}>View Project</button>
          </div>
          {trackError&&<p style={{color:"#f0a08a",fontSize:13,marginTop:12}}>{trackError}</p>}
          <p style={{fontSize:11,color:"rgba(248,244,238,0.25)",marginTop:16}}>Demo: try FV-2847 or FV-3901</p>
        </div>

        {trackedProject&&<ProjectDetailView project={trackedProject} />}

        {!trackedProject&&(
          <div className="section" style={{textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16,opacity:0.3}}>🔍</div>
            <p style={{color:"var(--muted)"}}>Enter your project ID above to see your personalised room design.</p>
          </div>
        )}
      </div>
    );
  }

  function ProjectDetailView({ project }) {
    const [showOrder, setShowOrder] = useState(false);
    const total = project.furniture.reduce((s,i)=>s+i.price*i.qty,0);

    return (
      <div className="project-view">
        <div className="project-header">
          <div>
            <div className="project-id">Project {project.id}</div>
            <div className="project-title">{project.room} Design</div>
            <div className="project-meta">
              <div className="project-meta-item">Customer: <strong>{project.customer}</strong></div>
              <div className="project-meta-item">Designer: <strong>{project.designer}</strong></div>
              <div className="project-meta-item">Room: <strong>{project.dimensions}</strong></div>
              <div className="project-meta-item">Created: <strong>{project.createdAt}</strong></div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"flex-start",flexWrap:"wrap"}}>
            <span className={`badge ${project.status==="ready"?"badge-green":"badge-amber"}`}>
              {project.status==="ready"?"✓ Ready to Order":"In Progress"}
            </span>
          </div>
        </div>

        <div className="project-grid">
          {/* 3D Preview */}
          <div>
            <div className="project-3d-preview">
              <div className="preview-3d">
                <div className="preview-wall-back" />
                <div className="preview-wall-left" />
                <div className="preview-floor" />
                <div className="preview-rug" />
                <div className="preview-sofa" />
                <div className="preview-table" />
                <div className="preview-label">3D PREVIEW · {project.room.toUpperCase()}</div>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
                  <button className="btn btn-gold" onClick={()=>showToast("3D view launching — connect RoomViewer3D component")}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2L2 5.5v5L8 14l6-3.5v-5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M2 5.5L8 9l6-3.5M8 9v5" stroke="currentColor" strokeWidth="1.5"/></svg>
                    Open 3D Visualiser
                  </button>
                  <p style={{fontSize:11,color:"rgba(248,244,238,0.4)",marginTop:8}}>Drag to orbit · Scroll to zoom</p>
                </div>
              </div>
              <div className="project-3d-badge">
                <span className="badge badge-blue">3D Ready</span>
              </div>
            </div>

            {/* Designer notes */}
            <div className="card" style={{padding:20,marginTop:16}}>
              <div style={{fontSize:12,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--muted)",marginBottom:8}}>Designer Notes</div>
              <p style={{fontSize:13,color:"var(--ink)",lineHeight:1.6}}>{project.notes}</p>
              <div style={{fontSize:11,color:"var(--light)",marginTop:8}}>— {project.designer}</div>
            </div>
          </div>

          {/* Order card */}
          <div className="card order-card">
            <div>
              <div className="order-section-title">Furniture List</div>
              {project.furniture.map(item=>(
                <div key={item.name} className="order-line">
                  <div className="order-line-name">
                    <div className="order-line-dot" style={{background:item.color}} />
                    <span>{item.name}</span>
                    {item.qty>1&&<span style={{fontSize:11,color:"var(--muted)"}}>×{item.qty}</span>}
                  </div>
                  <span style={{color:"var(--muted)",fontSize:13}}>£{(item.price*item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)",marginBottom:6}}>
                <span>Budget</span><span>£{project.budget.toLocaleString()}</span>
              </div>
              <div className="budget-bar">
                <div className="budget-fill" style={{width:`${Math.min(100,(project.spent/project.budget)*100)}%`}} />
              </div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>£{project.spent.toLocaleString()} of £{project.budget.toLocaleString()} used</div>
            </div>

            <div className="order-total">
              <span>Total</span>
              <span className="order-total-price">£{total.toLocaleString()}</span>
            </div>

            {project.status==="ready"?(
              <button className="btn btn-gold" style={{justifyContent:"center"}} onClick={()=>setShowOrder(true)}>
                🛒 Place Order — £{total.toLocaleString()}
              </button>
            ):(
              <div style={{textAlign:"center",fontSize:13,color:"var(--muted)",padding:"12px 0"}}>
                Your designer is still working on this design. Check back soon.
              </div>
            )}
          </div>
        </div>

        {showOrder&&(
          <div className="modal-backdrop" onClick={()=>setShowOrder(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <h3>Confirm Your Order</h3>
              <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.7,marginBottom:16}}>
                You're about to place an order for <strong>{project.furniture.length} items</strong> totalling <strong>£{total.toLocaleString()}</strong> for your {project.room}.
              </p>
              <div style={{background:"var(--sage)",borderRadius:"var(--r)",padding:"14px 16px",fontSize:13,color:"var(--forest)",marginBottom:8}}>
                ✓ Delivery estimate: 4–6 weeks<br/>
                ✓ Free in-store installation included<br/>
                ✓ 30-day satisfaction guarantee
              </div>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={()=>setShowOrder(false)}>Cancel</button>
                <button className="btn btn-gold" onClick={()=>{setShowOrder(false);showToast("Order placed! Confirmation sent to your email. 🎉");}}>Confirm & Pay</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function DesignerLoginPage() {
    const [attempted, setAttempted] = useState(false);
    return (
      <div className="page login-layout">
        <div className="login-panel dark">
          <div className="login-decor fade-up">
            <div style={{fontSize:48}}>🪑</div>
            <h3>Designer Studio</h3>
            <p>Access your project dashboard, build room layouts, and present stunning 3D visualisations to your customers.</p>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:8,width:"100%",maxWidth:280}}>
              {["Manage all customer projects","Build 2D room layouts","Render 3D visualisations","Track budgets in real-time"].map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:"rgba(248,244,238,0.6)"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"var(--gold)",flexShrink:0}}/>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="login-panel">
          <div className="login-form fade-up">
            <h2>Designer Login</h2>
            <p className="sub">Sign in to access your studio dashboard and manage your design projects.</p>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="designer@comforta.com" value={loginForm.email} onChange={e=>setLoginForm(f=>({...f,email:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={loginForm.pass} onChange={e=>setLoginForm(f=>({...f,pass:e.target.value}))} />
              </div>
              {attempted&&(!loginForm.email||!loginForm.pass)&&(
                <div style={{fontSize:12,color:"var(--red)",background:"#fdf0ee",padding:"8px 12px",borderRadius:"var(--r)"}}>Please enter your email and password</div>
              )}
              <button className="btn btn-primary" style={{justifyContent:"center"}} onClick={()=>{setAttempted(true);if(loginForm.email&&loginForm.pass){nav("designer");showToast("Welcome back, "+loginForm.email.split("@")[0]);}}}>
                Sign In
              </button>
              <div className="login-divider">
                <div className="login-divider-line"/><span className="login-divider-text">demo</span><div className="login-divider-line"/>
              </div>
              <button className="btn btn-ghost" style={{justifyContent:"center"}} onClick={()=>{nav("designer");showToast("Signed in as demo designer");}}>
                Continue as Demo Designer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function DesignerDashboard() {
    const navItems = [
      ["dashboard","Dashboard","⊞"],
      ["projects","Projects","📋"],
      ["builder","New Project","✏️"],
      ["catalog","Catalogue","🪑"],
    ];
    return (
      <div className="dash-layout">
        <aside className="dash-sidebar">
          <div className="dash-sidebar-logo">Comforta Studio</div>
          {navItems.map(([id,label,icon])=>(
            <div key={id} className={`dash-nav-item${designerTab===id?" active":""}`} onClick={()=>setDesignerTab(id)}>
              <span>{icon}</span>{label}
            </div>
          ))}
          <div style={{marginTop:"auto",padding:"0 24px 24px"}}>
            <div style={{fontSize:11,color:"rgba(248,244,238,0.3)",marginBottom:8}}>Signed in as</div>
            <div style={{fontSize:13,color:"rgba(248,244,238,0.7)",fontWeight:500}}>Nilufar Hassan</div>
            <button className="btn btn-ghost btn-sm" style={{marginTop:10,color:"rgba(248,244,238,0.4)",borderColor:"rgba(255,255,255,0.1)",width:"100%",justifyContent:"center"}} onClick={()=>nav("home")}>Sign Out</button>
          </div>
        </aside>

        <main className="dash-main">
          {designerTab==="dashboard"&&(
            <>
              <div className="dash-header">
                <div>
                  <div className="dash-title">Good morning, Nilufar</div>
                  <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Monday, 16 March 2026</div>
                </div>
                <button className="btn btn-primary" onClick={()=>setDesignerTab("builder")}>+ New Project</button>
              </div>
              <div className="dash-metrics">
                {[["12","Active Projects","3 need attention"],["4","Ready to Order","Awaiting customer"],["£48,200","This Month Revenue","+12% from last month"],["98%","Satisfaction Rate","Based on 84 reviews"]].map(([v,l,s])=>(
                  <div key={l} className="card metric-card">
                    <div className="metric-label">{l}</div>
                    <div className="metric-val">{v}</div>
                    <div className="metric-sub">{s}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{overflow:"hidden"}}>
                <div style={{padding:"16px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontWeight:600,fontSize:15}}>Recent Projects</div>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setDesignerTab("projects")}>View All</button>
                </div>
                <table className="projects-table">
                  <thead><tr><th>Project ID</th><th>Customer</th><th>Room</th><th>Status</th><th>Budget Used</th><th>Actions</th></tr></thead>
                  <tbody>
                    {Object.values(MOCK_PROJECTS).map(p=>(
                      <tr key={p.id}>
                        <td><span style={{fontFamily:"monospace",fontSize:12,background:"var(--warm)",padding:"2px 8px",borderRadius:4}}>{p.id}</span></td>
                        <td style={{fontWeight:500}}>{p.customer}</td>
                        <td>{p.room}</td>
                        <td><span className={`badge ${p.status==="ready"?"badge-green":"badge-amber"}`}>{p.status==="ready"?"Ready":"Draft"}</span></td>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div className="budget-bar" style={{width:80}}><div className="budget-fill" style={{width:`${Math.round((p.spent/p.budget)*100)}%`}}/></div>
                            <span style={{fontSize:11,color:"var(--muted)"}}>{Math.round((p.spent/p.budget)*100)}%</span>
                          </div>
                        </td>
                        <td>
                          <div style={{display:"flex",gap:6}}>
                            <button className="btn btn-secondary btn-sm" onClick={()=>{setDesignerTab("builder");showToast(`Opening project ${p.id}`);}}>Edit</button>
                            <button className="btn btn-ghost btn-sm" onClick={()=>{nav("track");setTrackId(p.id);setTimeout(()=>handleTrack(),100);}}>Preview</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {designerTab==="projects"&&(
            <>
              <div className="dash-header">
                <div className="dash-title">All Projects</div>
                <button className="btn btn-primary" onClick={()=>setDesignerTab("builder")}>+ New Project</button>
              </div>
              <div className="card" style={{overflow:"hidden"}}>
                <table className="projects-table">
                  <thead><tr><th>Project ID</th><th>Customer</th><th>Room</th><th>Designer</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
                  <tbody>
                    {Object.values(MOCK_PROJECTS).map(p=>(
                      <tr key={p.id}>
                        <td><span style={{fontFamily:"monospace",fontSize:12,background:"var(--warm)",padding:"2px 8px",borderRadius:4}}>{p.id}</span></td>
                        <td style={{fontWeight:500}}>{p.customer}</td>
                        <td>{p.room} · <span style={{color:"var(--muted)",fontSize:12}}>{p.dimensions}</span></td>
                        <td style={{fontSize:12,color:"var(--muted)"}}>{p.designer}</td>
                        <td><span className={`badge ${p.status==="ready"?"badge-green":"badge-amber"}`}>{p.status==="ready"?"Ready to Order":"In Progress"}</span></td>
                        <td style={{fontSize:12,color:"var(--muted)"}}>{p.createdAt}</td>
                        <td>
                          <div style={{display:"flex",gap:6}}>
                            <button className="btn btn-secondary btn-sm" onClick={()=>setDesignerTab("builder")}>2D Edit</button>
                            <button className="btn btn-ghost btn-sm" onClick={()=>showToast("Opening 3D view…")}>3D View</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {designerTab==="builder"&&(
            <>
              <div className="dash-header">
                <div>
                  <div className="dash-title">Project Builder</div>
                  <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Build the room layout and furniture selection</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-ghost" onClick={()=>showToast("Draft saved")}>Save Draft</button>
                  <button className="btn btn-primary" onClick={()=>showToast("Launching 2D editor… Connect RoomEditor component")}>
                    Open 2D Editor ↗
                  </button>
                </div>
              </div>

              <div className="builder-layout" style={{margin:"0 -40px"}}>
                <div className="builder-main" style={{paddingLeft:40,paddingRight:32}}>
                  {/* Customer & Room info */}
                  <div className="card" style={{padding:24,marginBottom:24}}>
                    <div style={{fontWeight:600,fontSize:15,marginBottom:16}}>Project Details</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
                      <div className="form-group"><label className="form-label">Customer Name</label><input className="form-input" defaultValue="New Customer" /></div>
                      <div className="form-group"><label className="form-label">Room Type</label>
                        <select className="form-input"><option>Living Room</option><option>Bedroom</option><option>Dining Room</option></select>
                      </div>
                      <div className="form-group"><label className="form-label">Budget (£)</label><input className="form-input" type="number" value={budgetLimit} onChange={e=>setBudgetLimit(Number(e.target.value))} /></div>
                      <div className="form-group"><label className="form-label">Room Width (m)</label><input className="form-input" type="number" defaultValue="5" /></div>
                      <div className="form-group"><label className="form-label">Room Depth (m)</label><input className="form-input" type="number" defaultValue="4" /></div>
                      <div className="form-group"><label className="form-label">Assigned Designer</label>
                        <select className="form-input">{DESIGNERS.map(d=><option key={d.id}>{d.name}</option>)}</select>
                      </div>
                    </div>
                  </div>

                  {/* 2D/3D preview placeholder */}
                  <div className="card" style={{overflow:"hidden",marginBottom:24}}>
                    <div style={{padding:"14px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontWeight:600,fontSize:15}}>Room Visualisation</div>
                      <div style={{display:"flex",gap:8}}>
                        <button className="btn btn-secondary btn-sm" onClick={()=>showToast("Opening 2D editor…")}>2D Layout</button>
                        <button className="btn btn-primary btn-sm" onClick={()=>showToast("Launching 3D view…")}>3D View</button>
                      </div>
                    </div>
                    <div style={{height:300,background:"var(--soil)",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <div className="preview-3d" style={{width:"100%",height:"100%"}}>
                        <div className="preview-wall-back"/><div className="preview-wall-left"/>
                        <div className="preview-floor"/><div className="preview-rug"/>
                        <div className="preview-sofa"/><div className="preview-table"/>
                        {selectedFurn.map((f,i)=>(
                          <div key={f.id} style={{position:"absolute",width:"8%",height:"4%",background:f.color,borderRadius:4,bottom:`${22+i*6}%`,left:`${40+i*5}%`,opacity:0.8}} />
                        ))}
                        <div className="preview-label">LIVE PREVIEW · {selectedFurn.length} ITEMS</div>
                        <button className="btn btn-gold" style={{position:"absolute"}} onClick={()=>showToast("Connect RoomEditor + RoomViewer3D here")}>
                          Launch Full Editor
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="builder-sidebar">
                  <div>
                    <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>Budget</div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)",marginBottom:6}}>
                      <span>£{totalSpent.toLocaleString()} spent</span>
                      <span>£{budgetLimit.toLocaleString()} limit</span>
                    </div>
                    <div className="budget-bar">
                      <div className={`budget-fill${overBudget?" over":""}`} style={{width:`${Math.min(100,(totalSpent/budgetLimit)*100)}%`}}/>
                    </div>
                    <div style={{fontSize:11,color:overBudget?"var(--red)":"var(--muted)",marginTop:5}}>
                      {overBudget?`£${(totalSpent-budgetLimit).toLocaleString()} over budget`:`£${(budgetLimit-totalSpent).toLocaleString()} remaining`}
                    </div>
                  </div>

                  <div>
                    <div style={{fontWeight:600,fontSize:13,marginBottom:12}}>Add Furniture</div>
                    <div className="furniture-picker">
                      {FURNITURE_CATALOG.slice(0,10).map(item=>(
                        <div key={item.id} className={`furn-pick-item${selectedFurn.find(f=>f.id===item.id)?" selected":""}`} onClick={()=>toggleFurn(item)}>
                          <FurnIcon icon={item.icon} color={item.color} size={36} />
                          <div className="furn-pick-name">{item.name.split(" ").slice(-1)}</div>
                          <div className="furn-pick-price">£{item.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedFurn.length>0&&(
                    <div>
                      <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>Selected ({selectedFurn.length})</div>
                      <div className="selected-list">
                        {selectedFurn.map(item=>(
                          <div key={item.id} className="selected-item">
                            <div className="selected-item-dot" style={{background:item.color}}/>
                            <div className="selected-item-name">{item.name}</div>
                            <div className="selected-item-price">£{item.price}</div>
                            <button className="selected-item-remove" onClick={()=>toggleFurn(item)}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button className="btn btn-primary" style={{justifyContent:"center"}} onClick={()=>showToast("Project saved & customer notified!")}>
                    Save & Notify Customer
                  </button>
                </div>
              </div>
            </>
          )}

          {designerTab==="catalog"&&(
            <>
              <div className="dash-header">
                <div className="dash-title">Furniture Catalogue</div>
              </div>
              <div className="catalog-filters">
                {["All",...new Set(FURNITURE_CATALOG.map(f=>f.category))].map(c=>(
                  <button key={c} className={`filter-btn${catalogFilter===c?" active":""}`} onClick={()=>setCatalogFilter(c)}>{c}</button>
                ))}
              </div>
              <div className="catalog-grid">
                {filteredCatalog.map(item=>(
                  <div key={item.id} className="card catalog-item card-hover">
                    <div className="catalog-item-img"><FurnIcon icon={item.icon} color={item.color} size={80} /></div>
                    <div className="catalog-item-cat">{item.category}</div>
                    <div className="catalog-item-name">{item.name}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
                      <div className="catalog-item-price">£{item.price.toLocaleString()}</div>
                      <button className="btn btn-primary btn-sm" onClick={()=>{toggleFurn(item);showToast(`${item.name} added to project`);}}>
                        {selectedFurn.find(f=>f.id===item.id)?"✓ Added":"+ Add"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    );
  }

  // ── MAIN RENDER ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{S}</style>

      {/* NAV */}
      {page !== "designer" && (
        <nav className="nav">
          <div className="nav-logo" onClick={()=>nav("home")}>Furnish<span>View</span></div>
          <div className="nav-links">
            <button className={`nav-link${page==="home"?" active":""}`} onClick={()=>nav("home")}>Home</button>
            <button className={`nav-link${page==="catalog"?" active":""}`} onClick={()=>nav("catalog")}>Catalogue</button>
            <button className={`nav-link${page==="consult"?" active":""}`} onClick={()=>nav("consult")}>Consultation</button>
            <button className={`nav-link${page==="track"?" active":""}`} onClick={()=>nav("track")}>Track Project</button>
            <button className="nav-link gold" onClick={()=>nav("dlogin")}>Designer Login</button>
          </div>
        </nav>
      )}

      {/* PAGES */}
      {page==="home"    && <HomePage />}
      {page==="catalog" && <CatalogPage />}
      {page==="consult" && <ConsultPage />}
      {page==="track"   && <TrackPage />}
      {page==="dlogin"  && <DesignerLoginPage />}
      {page==="designer"&& <DesignerDashboard />}

      {/* TOAST */}
      <div className={`toast${toast.show?" show":""}`}>{toast.msg}</div>
    </>
  );
}
