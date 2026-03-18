import { useEffect, useRef, useState, useCallback } from "react";
import logoImg from "../assets/LOGO.png";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const SCALE = 80;
const SNAP_M = 0.25;
const HANDLE_SIZE = 7;

const WALL_COLORS = ["#F5F0E8","#DDE8E0","#E8E0DD","#E0E4EC","#EDE0E8","#E8EAD8","#D0CFC9","#2C2C2C"];
const FLOOR_COLORS = ["#C8A97A","#A8886A","#D4C4A0","#9EB5A0","#B8C4D0","#E0D8C8","#707070","#3A3028"];
const PROP_COLORS = ["#C8936A","#8B7B6B","#4A7C6A","#6B8B9A","#9A7B6B","#D4C4A0","#6B6B8B","#B8825A","#5A9A60","#C0392B","#2C3E50","#F5F0E8"];

const FURNITURE = [
  { id:"sofa-2",      name:"2-Seat Sofa",    w:1.6, h:0.8,  color:"#8B7B6B", icon:"sofa2"    },
  { id:"sofa-3",      name:"3-Seat Sofa",    w:2.2, h:0.9,  color:"#8B7B6B", icon:"sofa3"    },
  { id:"armchair",    name:"Armchair",        w:0.9, h:0.9,  color:"#9A7B6B", icon:"chair"    },
  { id:"dining-table",name:"Dining Table",   w:1.6, h:0.9,  color:"#C8936A", icon:"dtable"   },
  { id:"dining-chair",name:"Dining Chair",   w:0.5, h:0.5,  color:"#A88060", icon:"dchair"   },
  { id:"coffee-table",name:"Coffee Table",   w:1.1, h:0.6,  color:"#B89870", icon:"ctable"   },
  { id:"side-table",  name:"Side Table",     w:0.5, h:0.5,  color:"#C8A87A", icon:"stable"   },
  { id:"bed-double",  name:"Double Bed",     w:1.6, h:2.0,  color:"#9A8EAA", icon:"bed2"     },
  { id:"bed-single",  name:"Single Bed",     w:1.0, h:2.0,  color:"#9A8EAA", icon:"bed1"     },
  { id:"wardrobe",    name:"Wardrobe",        w:1.8, h:0.65, color:"#7A6858", icon:"wardrobe" },
  { id:"desk",        name:"Desk",            w:1.4, h:0.7,  color:"#B0966A", icon:"desk"     },
  { id:"bookshelf",   name:"Bookshelf",       w:1.0, h:0.35, color:"#8A7060", icon:"book"     },
  { id:"tv-unit",     name:"TV Unit",         w:1.6, h:0.45, color:"#505050", icon:"tv"       },
  { id:"plant",       name:"Plant",           w:0.4, h:0.4,  color:"#5A9A60", icon:"plant"    },
  { id:"rug",         name:"Area Rug",        w:2.0, h:1.5,  color:"#D4B890", icon:"rug"      },
  { id:"lamp",        name:"Floor Lamp",      w:0.35,h:0.35, color:"#C8B870", icon:"lamp"     },
];

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS DRAWING HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function lighten(hex, amt) {
  const n = parseInt(hex.replace("#",""), 16);
  const r = Math.min(255, ((n>>16)&0xff)+amt);
  const g = Math.min(255, ((n>>8)&0xff)+amt);
  const b = Math.min(255, (n&0xff)+amt);
  return `rgb(${r},${g},${b})`;
}
function darken(hex, amt) {
  const n = parseInt(hex.replace("#",""), 16);
  const r = Math.max(0, ((n>>16)&0xff)-amt);
  const g = Math.max(0, ((n>>8)&0xff)-amt);
  const b = Math.max(0, (n&0xff)-amt);
  return `rgb(${r},${g},${b})`;
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

function drawFurnitureIcon(ctx, type, x, y, w, h, color, rotation, flipped, selected) {
  ctx.save();
  ctx.translate(x + w/2, y + h/2);
  ctx.rotate(rotation * Math.PI / 180);
  if (flipped) ctx.scale(-1, 1);
  const ox = -w/2, oy = -h/2;
  const r = 3;

  ctx.fillStyle = color;
  ctx.strokeStyle = selected ? "#3D5A47" : "rgba(0,0,0,0.25)";
  ctx.lineWidth = selected ? 2 : 1;

  switch (type) {
    case "sofa2": case "sofa3":
      rrect(ctx,ox,oy,w,h,r); ctx.fill(); ctx.stroke();
      ctx.fillStyle = lighten(color,20);
      rrect(ctx,ox+2,oy+2,w-4,h*0.5,r); ctx.fill();
      ctx.fillStyle = lighten(color,10);
      ctx.fillRect(ox+2,oy+h*0.5,w-4,h*0.4);
      ctx.fillStyle = lighten(color,15);
      rrect(ctx,ox,oy+h*0.1,w*0.1,h*0.75,2); ctx.fill();
      rrect(ctx,ox+w-w*0.1,oy+h*0.1,w*0.1,h*0.75,2); ctx.fill();
      break;
    case "chair":
      rrect(ctx,ox,oy,w,h,r); ctx.fill(); ctx.stroke();
      ctx.fillStyle = lighten(color,15);
      rrect(ctx,ox+3,oy+3,w*0.8,h*0.55,r-1); ctx.fill();
      ctx.fillStyle = lighten(color,8);
      ctx.fillRect(ox+3,oy+h*0.55,w*0.8,h*0.35);
      break;
    case "dtable":
      rrect(ctx,ox,oy,w,h,r); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = lighten(color,25); ctx.lineWidth=1;
      ctx.strokeRect(ox+4,oy+4,w-8,h-8);
      break;
    case "dchair":
      rrect(ctx,ox,oy,w,h,r); ctx.fill(); ctx.stroke();
      ctx.fillStyle = lighten(color,20);
      rrect(ctx,ox+3,oy+3,w-6,h*0.45,2); ctx.fill();
      break;
    case "ctable":
      rrect(ctx,ox,oy,w,h,r); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = lighten(color,30); ctx.lineWidth=1;
      ctx.strokeRect(ox+3,oy+3,w-6,h-6);
      break;
    case "stable":
      ctx.beginPath(); ctx.ellipse(ox+w/2,oy+h/2,w/2-2,h/2-2,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = lighten(color,20);
      ctx.beginPath(); ctx.ellipse(ox+w/2,oy+h/2,w/3,h/3,0,0,Math.PI*2); ctx.fill();
      break;
    case "bed2": case "bed1":
      rrect(ctx,ox,oy,w,h,r); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#F5F0E8";
      rrect(ctx,ox+4,oy+h*0.3,w-8,h*0.6,2); ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth=0.5;
      ctx.beginPath(); ctx.moveTo(ox+w/2,oy+h*0.3); ctx.lineTo(ox+w/2,oy+h*0.9); ctx.stroke();
      ctx.fillStyle = lighten(color,20);
      rrect(ctx,ox+4,oy+4,w-8,h*0.22,r-1); ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      const pw = type==="bed2" ? (w-20)/2 : w-20;
      if (type==="bed2") {
        rrect(ctx,ox+8,oy+h*0.33,pw,h*0.18,2); ctx.fill();
        rrect(ctx,ox+12+pw,oy+h*0.33,pw,h*0.18,2); ctx.fill();
      } else {
        rrect(ctx,ox+8,oy+h*0.33,pw,h*0.18,2); ctx.fill();
      }
      break;
    case "wardrobe":
      rrect(ctx,ox,oy,w,h,r); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(ox+w/2,oy+2); ctx.lineTo(ox+w/2,oy+h-2); ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.beginPath(); ctx.arc(ox+w/2-w*0.18,oy+h/2,2,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(ox+w/2+w*0.18,oy+h/2,2,0,Math.PI*2); ctx.fill();
      break;
    case "desk":
      rrect(ctx,ox,oy,w,h,r); ctx.fill(); ctx.stroke();
      ctx.fillStyle = lighten(color,25);
      rrect(ctx,ox+3,oy+3,w*0.55,h-6,2); ctx.fill();
      ctx.fillStyle = darken(color,10);
      rrect(ctx,ox+w*0.62,oy+3,w*0.3,h*0.45,2); ctx.fill();
      ctx.fillStyle = darken(color,5);
      rrect(ctx,ox+w*0.62,oy+h*0.55,w*0.3,h*0.42,2); ctx.fill();
      break;
    case "book":
      rrect(ctx,ox,oy,w,h,r); ctx.fill(); ctx.stroke();
      ["#8B4E4E","#4E6B8B","#4E8B5A","#8B7A4E","#6B4E8B","#8B4E78"].forEach((c,i) => {
        const bw = (w-8)/6;
        ctx.fillStyle = c;
        ctx.fillRect(ox+4+i*(bw+1.5),oy+2,bw,h-4);
      });
      break;
    case "tv":
      rrect(ctx,ox,oy,w,h,r); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#1A1A1A";
      rrect(ctx,ox+4,oy+3,w-8,h-10,2); ctx.fill();
      ctx.fillStyle = "#2A3040";
      rrect(ctx,ox+5,oy+4,w-10,h-13,1); ctx.fill();
      ctx.fillStyle = darken(color,10);
      ctx.fillRect(ox+w/2-8,oy+h-7,16,4);
      break;
    case "plant":
      ctx.fillStyle = darken(color,20);
      rrect(ctx,ox+w*0.2,oy+h*0.65,w*0.6,h*0.35,2); ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(ox+w/2,oy+h*0.45,w*0.35,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = lighten(color,20);
      ctx.beginPath(); ctx.arc(ox+w*0.35,oy+h*0.35,w*0.22,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(ox+w*0.65,oy+h*0.38,w*0.2,0,Math.PI*2); ctx.fill();
      break;
    case "rug":
      rrect(ctx,ox+2,oy+2,w-4,h-4,r); ctx.fill();
      ctx.strokeStyle = darken(color,15); ctx.lineWidth=2;
      rrect(ctx,ox+6,oy+6,w-12,h-12,r-2); ctx.stroke();
      ctx.strokeStyle = darken(color,8); ctx.lineWidth=1;
      rrect(ctx,ox+10,oy+10,w-20,h-20,r-3); ctx.stroke();
      break;
    case "lamp":
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ox+w*0.2,oy+h*0.15); ctx.lineTo(ox+w*0.8,oy+h*0.15);
      ctx.lineTo(ox+w*0.65,oy+h*0.55); ctx.lineTo(ox+w*0.35,oy+h*0.55);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = lighten(color,30);
      ctx.beginPath();
      ctx.moveTo(ox+w*0.25,oy+h*0.18); ctx.lineTo(ox+w*0.75,oy+h*0.18);
      ctx.lineTo(ox+w*0.63,oy+h*0.52); ctx.lineTo(ox+w*0.37,oy+h*0.52);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = darken(color,20); ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(ox+w/2,oy+h*0.55); ctx.lineTo(ox+w/2,oy+h*0.9); ctx.stroke();
      ctx.fillStyle = darken(color,15);
      rrect(ctx,ox+w*0.3,oy+h*0.88,w*0.4,h*0.1,2); ctx.fill();
      break;
    default:
      rrect(ctx,ox,oy,w,h,r); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

function renderRoom(canvas, room, items, selectedId, zoom, showGrid, panOffset) {
  const ctx = canvas.getContext("2d");
  const s = SCALE * zoom;
  const { w, d, wallColor, floorColor, shape } = room;
  const roomW = w * s, roomD = d * s;
  const offX = (canvas.width - roomW) / 2 + panOffset.x;
  const offY = (canvas.height - roomD) / 2 + panOffset.y;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#D8D4CC";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Floor
  ctx.save();
  if (shape === "L") {
    ctx.beginPath();
    ctx.moveTo(offX, offY);
    ctx.lineTo(offX+roomW, offY);
    ctx.lineTo(offX+roomW, offY+roomD*0.55);
    ctx.lineTo(offX+roomW*0.55, offY+roomD*0.55);
    ctx.lineTo(offX+roomW*0.55, offY+roomD);
    ctx.lineTo(offX, offY+roomD);
    ctx.closePath();
    ctx.fillStyle = floorColor; ctx.fill(); ctx.clip();
  } else {
    ctx.fillStyle = floorColor;
    ctx.fillRect(offX, offY, roomW, roomD);
  }

  // Plank texture
  ctx.strokeStyle = "rgba(0,0,0,0.07)"; ctx.lineWidth = 1;
  const plankH = s * 0.18;
  for (let y = offY; y < offY+roomD; y += plankH) {
    ctx.beginPath(); ctx.moveTo(offX,y); ctx.lineTo(offX+roomW,y); ctx.stroke();
  }
  const plankW = s * 0.8;
  for (let row = 0; row*plankH < roomD; row++) {
    const ox2 = (row%2)*plankW*0.5;
    for (let x = offX-ox2; x < offX+roomW; x += plankW) {
      ctx.beginPath(); ctx.moveTo(x,offY+row*plankH); ctx.lineTo(x,offY+(row+1)*plankH); ctx.stroke();
    }
  }
  ctx.restore();

  // Grid
  if (showGrid) {
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0.09)"; ctx.lineWidth = 0.5;
    ctx.setLineDash([2,4]);
    for (let gx = 0; gx <= w; gx += SNAP_M) {
      const sx = offX + gx*s;
      ctx.beginPath(); ctx.moveTo(sx,offY); ctx.lineTo(sx,offY+roomD); ctx.stroke();
    }
    for (let gy = 0; gy <= d; gy += SNAP_M) {
      const sy = offY + gy*s;
      ctx.beginPath(); ctx.moveTo(offX,sy); ctx.lineTo(offX+roomW,sy); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }

  // Rulers
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.font = `${Math.max(9,11*zoom)}px DM Sans, sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "top";
  for (let gx = 0; gx <= w; gx++) {
    ctx.fillText(gx+"m", offX+gx*s, offY+roomD+6);
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(offX+gx*s,offY+roomD); ctx.lineTo(offX+gx*s,offY+roomD+4); ctx.stroke();
  }
  ctx.textAlign = "right"; ctx.textBaseline = "middle";
  for (let gy = 0; gy <= d; gy++) {
    ctx.fillText(gy+"m", offX-8, offY+gy*s);
  }
  ctx.restore();

  // Walls
  ctx.save();
  const wallT = Math.max(4, 8*zoom);
  ctx.fillStyle = wallColor;
  if (shape === "L") {
    ctx.fillRect(offX-wallT, offY-wallT, roomW+wallT*2, wallT);
    ctx.fillRect(offX-wallT, offY-wallT, wallT, roomD+wallT*2);
    ctx.fillRect(offX+roomW, offY-wallT, wallT, roomD*0.55+wallT*2);
    ctx.fillRect(offX+roomW*0.55, offY+roomD*0.55-wallT, roomW*0.45+wallT, wallT);
    ctx.fillRect(offX+roomW*0.55-wallT, offY+roomD*0.55-wallT, wallT, roomD*0.45+wallT*2);
    ctx.fillRect(offX-wallT, offY+roomD, roomW*0.55+wallT*2, wallT);
  } else {
    ctx.fillRect(offX-wallT, offY-wallT, roomW+wallT*2, wallT);
    ctx.fillRect(offX-wallT, offY+roomD, roomW+wallT*2, wallT);
    ctx.fillRect(offX-wallT, offY-wallT, wallT, roomD+wallT*2);
    ctx.fillRect(offX+roomW, offY-wallT, wallT, roomD+wallT*2);
  }
  ctx.restore();

  // Scale bar
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.font = `${Math.max(9,10*zoom)}px DM Sans, sans-serif`;
  ctx.textAlign = "right"; ctx.textBaseline = "bottom";
  const bx = offX+roomW, by = offY-16;
  ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(bx-s,by); ctx.lineTo(bx,by); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx-s,by-4); ctx.lineTo(bx-s,by+4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx,by-4); ctx.lineTo(bx,by+4); ctx.stroke();
  ctx.fillText("1m", bx, by-2);
  ctx.restore();

  // Items (rugs first)
  const sorted = [...items].sort((a,b) => {
    if (a.icon==="rug" && b.icon!=="rug") return -1;
    if (b.icon==="rug" && a.icon!=="rug") return 1;
    return 0;
  });

  for (const item of sorted) {
    const sx = offX + item.x*s, sy = offY + item.y*s;
    const sw = item.w*s, sh = item.h*s;
    const sel = selectedId === item.id;
    drawFurnitureIcon(ctx, item.icon, sx, sy, sw, sh, item.color, item.rot||0, item.flipped||false, sel);

    if (item.label) {
      ctx.save();
      ctx.translate(sx+sw/2, sy+sh/2);
      ctx.rotate((item.rot||0)*Math.PI/180);
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.font = `${Math.max(8,9*zoom)}px DM Sans, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(item.label, 0, 0);
      ctx.restore();
    }

    if (sel) {
      ctx.save();
      ctx.translate(sx+sw/2, sy+sh/2);
      ctx.rotate((item.rot||0)*Math.PI/180);
      ctx.strokeStyle = "#3D5A47"; ctx.lineWidth=2;
      ctx.setLineDash([4,3]);
      ctx.strokeRect(-sw/2-3,-sh/2-3,sw+6,sh+6);
      ctx.setLineDash([]);
      [[-sw/2,0],[sw/2,0],[0,-sh/2],[0,sh/2],[-sw/2,-sh/2],[sw/2,-sh/2],[-sw/2,sh/2],[sw/2,sh/2]].forEach(([hx,hy]) => {
        ctx.fillStyle = "#fff"; ctx.strokeStyle = "#3D5A47"; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.arc(hx,hy,HANDLE_SIZE/2,0,Math.PI*2); ctx.fill(); ctx.stroke();
      });
      ctx.restore();
      ctx.save();
      const sx2=offX+item.x*s, sy2=offY+item.y*s, sw2=item.w*s, sh2=item.h*s;
      ctx.fillStyle = "rgba(61,90,71,0.85)";
      ctx.font = `${Math.max(9,10*zoom)}px DM Sans, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.fillText(`${item.w.toFixed(1)}m`, sx2+sw2/2, sy2-6);
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(`${item.h.toFixed(1)}m`, sx2+sw2+4, sy2+sh2/2);
      ctx.restore();
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function RoomEditor({ onSwitch3D }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const idCounter = useRef(1);
  const dragRef = useRef(null);
  const toastTimer = useRef(null);

  // Room state
  const [room, setRoom] = useState({ w:5, d:4, shape:"rect", wallColor:"#F5F0E8", floorColor:"#C8A97A" });
  const [roomForm, setRoomForm] = useState({ w:5, d:4, shape:"rect", wallColor:"#F5F0E8", floorColor:"#C8A97A" });

  // Items
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // UI
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [snap, setSnap] = useState(true);
  const [panOffset] = useState({ x:0, y:0 });
  const [toast, setToast] = useState({ msg:"", show:false });
  const [modal, setModal] = useState({ open:false, title:"", body:"", cb:null });
  const [cursorPos, setCursorPos] = useState("");

  // ── Helpers
  const snapV = useCallback((v) => snap ? Math.round(v/SNAP_M)*SNAP_M : v, [snap]);

  function worldToScreen(canvas, room_, zoom_, pan, wx, wy) {
    const s = SCALE*zoom_;
    const offX = (canvas.width - room_.w*s)/2 + pan.x;
    const offY = (canvas.height - room_.d*s)/2 + pan.y;
    return { x: offX+wx*s, y: offY+wy*s };
  }
  function screenToWorld(canvas, room_, zoom_, pan, sx, sy) {
    const s = SCALE*zoom_;
    const offX = (canvas.width - room_.w*s)/2 + pan.x;
    const offY = (canvas.height - room_.d*s)/2 + pan.y;
    return { x:(sx-offX)/s, y:(sy-offY)/s };
  }

  function showToast(msg) {
    setToast({ msg, show:true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({...t, show:false})), 2200);
  }

  function showModal(title, body, cb) {
    setModal({ open:true, title, body, cb });
  }

  // ── Render canvas whenever state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderRoom(canvas, room, items, selectedId, zoom, showGrid, panOffset);
  }, [room, items, selectedId, zoom, showGrid, panOffset]);

  // ── Resize canvas on mount / window resize
  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;
      const rect = wrap.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      renderRoom(canvas, room, items, selectedId, zoom, showGrid, panOffset);
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Demo items on mount
  useEffect(() => {
    const rug   = FURNITURE.find(f=>f.id==="rug");
    const sofa  = FURNITURE.find(f=>f.id==="sofa-3");
    const ctbl  = FURNITURE.find(f=>f.id==="coffee-table");
    setItems([
      { id:idCounter.current++, type:rug.id,  icon:rug.icon,  name:rug.name,  x:1.5, y:1.0, w:rug.w,  h:rug.h,  color:rug.color,  rot:0, flipped:false, label:"" },
      { id:idCounter.current++, type:sofa.id, icon:sofa.icon, name:sofa.name, x:1.6, y:0.3, w:sofa.w, h:sofa.h, color:sofa.color, rot:0, flipped:false, label:"" },
      { id:idCounter.current++, type:ctbl.id, icon:ctbl.icon, name:ctbl.name, x:1.95,y:1.3, w:ctbl.w, h:ctbl.h, color:ctbl.color, rot:0, flipped:false, label:"" },
    ]);
  }, []);

  // ── Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (!selectedId) return;
      const step = e.shiftKey ? 0.5 : SNAP_M;
      setItems(prev => prev.map(item => {
        if (item.id !== selectedId) return item;
        if (e.key==="ArrowLeft")  return {...item, x: Math.max(0, item.x-step)};
        if (e.key==="ArrowRight") return {...item, x: Math.min(room.w-item.w, item.x+step)};
        if (e.key==="ArrowUp")    return {...item, y: Math.max(0, item.y-step)};
        if (e.key==="ArrowDown")  return {...item, y: Math.min(room.d-item.h, item.y+step)};
        if (e.key==="r"||e.key==="R") return {...item, rot: ((item.rot||0)+90)%360};
        return item;
      }));
      if (e.key==="Delete"||e.key==="Backspace") {
        setItems(prev => prev.filter(i=>i.id!==selectedId));
        setSelectedId(null);
      }
      if (e.key==="Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, room, snap]);

  // ── Hit test
  function getItemAt(wx, wy) {
    const rev = [...items].reverse();
    for (const item of rev) {
      const cx = item.x+item.w/2, cy = item.y+item.h/2;
      const cos = Math.cos(-(item.rot||0)*Math.PI/180);
      const sin = Math.sin(-(item.rot||0)*Math.PI/180);
      const dx = wx-cx, dy = wy-cy;
      const lx = dx*cos - dy*sin, ly = dx*sin + dy*cos;
      if (Math.abs(lx) <= item.w/2+0.05 && Math.abs(ly) <= item.h/2+0.05) return item;
    }
    return null;
  }

  // ── Mouse events
  function handleMouseDown(e) {
    if (e.button !== 0) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const world = screenToWorld(canvas, room, zoom, panOffset, e.clientX-rect.left, e.clientY-rect.top);
    const hit = getItemAt(world.x, world.y);
    if (hit) {
      setSelectedId(hit.id);
      dragRef.current = { itemId:hit.id, startWx:world.x, startWy:world.y, origX:hit.x, origY:hit.y };
    } else {
      setSelectedId(null);
    }
  }

  function handleMouseMove(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const world = screenToWorld(canvas, room, zoom, panOffset, e.clientX-rect.left, e.clientY-rect.top);
    const wx = +world.x.toFixed(2), wy = +world.y.toFixed(2);
    if (wx>=0 && wx<=room.w && wy>=0 && wy<=room.d) {
      setCursorPos(`Cursor: ${wx.toFixed(2)}m, ${wy.toFixed(2)}m`);
    } else {
      setCursorPos("");
    }

    if (dragRef.current) {
      const { itemId, startWx, startWy, origX, origY } = dragRef.current;
      const dx = world.x - startWx, dy = world.y - startWy;
      setItems(prev => prev.map(item => {
        if (item.id !== itemId) return item;
        const nx = Math.max(0, Math.min(room.w-item.w, snapV(origX+dx)));
        const ny = Math.max(0, Math.min(room.d-item.h, snapV(origY+dy)));
        return {...item, x:nx, y:ny};
      }));
    }
  }

  function handleMouseUp() {
    dragRef.current = null;
  }

  function handleDblClick(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const world = screenToWorld(canvas, room, zoom, panOffset, e.clientX-rect.left, e.clientY-rect.top);
    const hit = getItemAt(world.x, world.y);
    if (hit) {
      const label = prompt("Label for this item:", hit.label||"");
      if (label !== null) {
        setItems(prev => prev.map(i => i.id===hit.id ? {...i, label} : i));
      }
    }
  }

  function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.3, Math.min(3, z*delta)));
  }

  // ── Drop from palette
  function handleDrop(e) {
    e.preventDefault();
    const fid = e.dataTransfer.getData("furnitureId");
    const def = FURNITURE.find(f=>f.id===fid);
    if (!def) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const world = screenToWorld(canvas, room, zoom, panOffset, e.clientX-rect.left, e.clientY-rect.top);
    addFurniture(def, snapV(world.x - def.w/2), snapV(world.y - def.h/2));
  }

  function addFurniture(def, x, y) {
    const item = {
      id: idCounter.current++,
      type: def.id, icon: def.icon, name: def.name,
      x: Math.max(0, Math.min(room.w-def.w, x)),
      y: Math.max(0, Math.min(room.d-def.h, y)),
      w: def.w, h: def.h,
      color: def.color, rot:0, flipped:false, label:"",
    };
    setItems(prev => [...prev, item]);
    setSelectedId(item.id);
    showToast(`${def.name} added`);
  }

  // ── Selected item helpers
  const selectedItem = items.find(i=>i.id===selectedId) || null;

  function updateSelected(patch) {
    setItems(prev => prev.map(i => i.id===selectedId ? {...i, ...patch} : i));
  }

  // ── Mini canvas preview for palette items
  function PaletteItem({ def }) {
    const ref = useRef(null);
    useEffect(() => {
      const canvas = ref.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0,0,36,36);
      const scale = Math.min(32/def.w, 32/def.h) * 0.9;
      const mw = def.w*scale, mh = def.h*scale;
      drawFurnitureIcon(ctx, def.icon, (36-mw)/2, (36-mh)/2, mw, mh, def.color, 0, false, false);
    }, [def]);

    return (
      <div
        className="furniture-item"
        draggable
        onDragStart={e => e.dataTransfer.setData("furnitureId", def.id)}
        onClick={() => addFurniture(def, room.w/2-def.w/2, room.d/2-def.h/2)}
      >
        <canvas ref={ref} width={36} height={36} />
        <span>{def.name}</span>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        .re-root *, .re-root *::before, .re-root *::after { box-sizing: border-box; margin:0; padding:0; }
        .re-root {
          --bg:#F7F5F0; --surface:#FFFFFF; --surface2:#F2EFE9;
          --border:#E0DCD4; --border2:#C8C3B8;
          --text:#1A1916; --text2:#6B6760; --text3:#9A9791;
          --accent:#3D5A47; --accent-light:#EDF2EF;
          --accent2:#B8824A; --danger:#C0392B;
          --canvas-bg:#E8E4DC;
          --shadow:0 2px 8px rgba(0,0,0,0.08);
          --shadow-lg:0 8px 32px rgba(0,0,0,0.12);
          --r:8px; --r2:12px;
          font-family:'DM Sans',sans-serif;
          background:var(--bg); color:var(--text);
          height:100vh; display:flex; flex-direction:column; overflow:hidden;
        }
        .re-header {
          background:var(--surface); border-bottom:1px solid var(--border);
          padding:0 20px; height:56px; display:flex; align-items:center;
          justify-content:space-between; flex-shrink:0; z-index:100;
        }
        .re-logo { display:flex; align-items:center; gap:8px; font-family:'DM Serif Display',serif; font-size:18px; color:var(--accent); letter-spacing:-0.3px; }
        .re-logo-img { width:24px; height:24px; object-fit:contain; border-radius:6px; background:#fff; }
        .re-logo span { color:var(--accent2); }
        .re-header-actions { display:flex; gap:8px; align-items:center; }
        .re-btn {
          display:inline-flex; align-items:center; gap:6px;
          font-family:inherit; font-size:13px; font-weight:500;
          padding:7px 14px; border-radius:var(--r);
          border:1px solid var(--border2); background:var(--surface);
          color:var(--text); cursor:pointer; transition:all 0.15s; white-space:nowrap;
        }
        .re-btn:hover { background:var(--surface2); }
        .re-btn.primary { background:#F0A500; color:#fff; border-color:#F0A500; }
        .re-btn.primary:hover { background:#D89200; border-color:#D89200; }
        .re-btn.danger { background:var(--danger); color:#fff; border-color:var(--danger); }
        .re-main { display:flex; flex:1; overflow:hidden; }
        .re-sidebar {
          width:240px; flex-shrink:0; background:var(--surface);
          border-right:1px solid var(--border); display:flex; flex-direction:column; overflow:hidden;
        }
        .re-panel-section { padding:14px 16px 12px; border-bottom:1px solid var(--border); }
        .re-panel-title {
          font-size:10px; font-weight:600; letter-spacing:0.08em;
          text-transform:uppercase; color:var(--text3); margin-bottom:10px;
        }
        .re-room-form { display:flex; flex-direction:column; gap:8px; }
        .re-form-row { display:flex; gap:8px; }
        .re-form-group { display:flex; flex-direction:column; gap:3px; flex:1; }
        .re-form-group label { font-size:11px; color:var(--text2); font-weight:500; }
        .re-form-group input, .re-form-group select {
          font-family:inherit; font-size:12px; padding:6px 8px;
          border:1px solid var(--border); border-radius:var(--r);
          background:var(--bg); color:var(--text); outline:none; transition:border-color 0.15s;
        }
        .re-form-group input:focus, .re-form-group select:focus { border-color:var(--accent); }
        .re-color-row { display:flex; gap:6px; flex-wrap:wrap; margin-top:2px; }
        .re-swatch {
          width:22px; height:22px; border-radius:50%;
          border:2px solid transparent; cursor:pointer; transition:transform 0.12s, border-color 0.12s;
        }
        .re-swatch:hover { transform:scale(1.15); }
        .re-swatch.active { border-color:var(--text) !important; }
        .re-furn-grid {
          display:grid; grid-template-columns:1fr 1fr; gap:6px;
          padding:14px 16px; overflow-y:auto; flex:1;
        }
        .re-furn-grid-title { padding:12px 16px 2px; font-size:10px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--text3); }
        .furniture-item {
          background:var(--bg); border:1px solid var(--border); border-radius:var(--r);
          padding:8px 6px; cursor:grab; text-align:center; transition:all 0.15s; user-select:none;
          display:flex; flex-direction:column; align-items:center; gap:4px;
        }
        .furniture-item:hover { background:var(--accent-light); border-color:var(--accent); transform:translateY(-1px); box-shadow:var(--shadow); }
        .furniture-item:active { cursor:grabbing; transform:scale(0.96); }
        .furniture-item span { font-size:10px; color:var(--text2); font-weight:500; line-height:1.2; text-align:center; }
        .re-canvas-area {
          flex:1; display:flex; flex-direction:column;
          background:var(--canvas-bg); overflow:hidden; position:relative;
        }
        .re-canvas-toolbar {
          background:var(--surface); border-bottom:1px solid var(--border);
          padding:8px 16px; display:flex; align-items:center; gap:8px; flex-shrink:0; flex-wrap:wrap;
        }
        .re-tool-group { display:flex; gap:4px; }
        .re-tool-btn {
          display:flex; align-items:center; gap:5px; font-family:inherit; font-size:12px; font-weight:500;
          padding:5px 10px; border-radius:var(--r); border:1px solid var(--border);
          background:var(--surface); color:var(--text2); cursor:pointer; transition:all 0.12s;
        }
        .re-tool-btn:hover { background:var(--surface2); color:var(--text); }
        .re-tool-btn.active { background:var(--accent-light); color:var(--accent); border-color:var(--accent); }
        .re-divider { width:1px; background:var(--border); margin:0 4px; align-self:stretch; }
        .re-zoom-info { margin-left:auto; font-size:11px; color:var(--text3); font-weight:500; }
        .re-canvas-wrap { flex:1; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; }
        .re-props-panel {
          width:220px; flex-shrink:0; background:var(--surface);
          border-left:1px solid var(--border); display:flex; flex-direction:column; overflow-y:auto;
        }
        .re-props-empty {
          flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:24px; text-align:center; gap:8px;
        }
        .re-props-empty p { font-size:12px; color:var(--text3); line-height:1.5; }
        .re-props-content { padding:14px 16px; display:flex; flex-direction:column; gap:14px; }
        .re-prop-group { display:flex; flex-direction:column; gap:6px; }
        .re-prop-group label { font-size:10px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--text3); }
        .re-prop-row { display:flex; gap:8px; }
        .re-prop-input {
          font-family:inherit; font-size:12px; font-weight:500; padding:6px 8px;
          border:1px solid var(--border); border-radius:var(--r); background:var(--bg);
          color:var(--text); outline:none; width:100%; transition:border-color 0.15s;
        }
        .re-prop-input:focus { border-color:var(--accent); }
        .re-status-bar {
          height:28px; background:var(--surface); border-top:1px solid var(--border);
          display:flex; align-items:center; padding:0 16px; gap:20px;
          font-size:11px; color:var(--text3); flex-shrink:0;
        }
        .re-status-bar b { color:var(--text2); font-weight:500; }
        .re-toast {
          position:fixed; bottom:40px; left:50%; transform:translateX(-50%) translateY(16px);
          background:var(--text); color:#fff; padding:9px 18px;
          border-radius:20px; font-size:13px; font-weight:500;
          opacity:0; pointer-events:none; transition:all 0.25s; z-index:999;
        }
        .re-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
        .re-modal-backdrop {
          position:fixed; inset:0; background:rgba(0,0,0,0.4);
          display:flex; align-items:center; justify-content:center;
          z-index:500; opacity:0; pointer-events:none; transition:opacity 0.2s;
        }
        .re-modal-backdrop.open { opacity:1; pointer-events:all; }
        .re-modal {
          background:var(--surface); border-radius:var(--r2); padding:24px; width:360px;
          box-shadow:var(--shadow-lg); transform:translateY(16px); transition:transform 0.2s;
        }
        .re-modal-backdrop.open .re-modal { transform:translateY(0); }
        .re-modal h3 { font-size:16px; font-weight:600; margin-bottom:12px; }
        .re-modal p { font-size:13px; color:var(--text2); line-height:1.6; }
        .re-modal-actions { display:flex; gap:8px; justify-content:flex-end; margin-top:20px; }
        .re-furn-grid::-webkit-scrollbar { width:4px; }
        .re-furn-grid::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }
      `}</style>

      <div className="re-root">

        {/* ── HEADER ── */}
        <header className="re-header">
           <div style={{ background: "#FBF5E8", fontFamily: "'Inter', sans-serif", color: "#ffffff" }}>
                                    <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 40px", height: 60, display: "flex", alignItems: "center", gap: 12 }}>
                                      <div
                                        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                     >
                                        <div style={{ width: 36, height: 36, background: "#fff", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                          <img src={logoImg} alt="Comforta logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                        </div>
                                        <div>
                                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", lineHeight: 1 }}>Comforta</div>
                                          <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "#9CA3AF" }}>Studio Library</div>
                                        </div>
                                      </div>
                                      </div>
                                      </div>
          <div className="re-header-actions">
            <button className="re-btn" onClick={() => {
              if (items.length === 0) return;
              showModal("Clear room?", "Remove all furniture items from the layout? This cannot be undone.", () => {
                setItems([]); setSelectedId(null); showToast("Room cleared");
              });
            }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Clear Room
            </button>
            <button className="re-btn" onClick={() => {
              const canvas = canvasRef.current;
              if (!canvas) return;
              const link = document.createElement("a");
              link.download = "room-layout.png";
              link.href = canvas.toDataURL("image/png");
              link.click();
              showToast("PNG exported!");
            }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3M3 11v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Export PNG
            </button>
            <button className="re-btn primary" onClick={() => onSwitch3D ? onSwitch3D(items, room) : showToast("Connect onSwitch3D prop for 3D view")}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2L2 5.5v5L8 14l6-3.5v-5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M2 5.5L8 9l6-3.5M8 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              Switch to 3D
            </button>
          </div>
        </header>

        <div className="re-main">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="re-sidebar">
            <div className="re-panel-section">
              <div className="re-panel-title">Room Settings</div>
              <div className="re-room-form">
                <div className="re-form-row">
                  <div className="re-form-group">
                    <label>Width (m)</label>
                    <input type="number" value={roomForm.w} min={2} max={15} step={0.5}
                      onChange={e => setRoomForm(f=>({...f, w:parseFloat(e.target.value)||5}))} />
                  </div>
                  <div className="re-form-group">
                    <label>Depth (m)</label>
                    <input type="number" value={roomForm.d} min={2} max={15} step={0.5}
                      onChange={e => setRoomForm(f=>({...f, d:parseFloat(e.target.value)||4}))} />
                  </div>
                </div>
                <div className="re-form-group">
                  <label>Room Shape</label>
                  <select value={roomForm.shape} onChange={e => setRoomForm(f=>({...f, shape:e.target.value}))}>
                    <option value="rect">Rectangle</option>
                    <option value="L">L-Shape</option>
                  </select>
                </div>
                <div className="re-form-group">
                  <label>Wall Colour</label>
                  <div className="re-color-row">
                    {WALL_COLORS.map(c => (
                      <div key={c} className={`re-swatch${roomForm.wallColor===c?" active":""}`}
                        style={{background:c}} onClick={() => setRoomForm(f=>({...f,wallColor:c}))} />
                    ))}
                  </div>
                </div>
                <div className="re-form-group">
                  <label>Floor Colour</label>
                  <div className="re-color-row">
                    {FLOOR_COLORS.map(c => (
                      <div key={c} className={`re-swatch${roomForm.floorColor===c?" active":""}`}
                        style={{background:c}} onClick={() => setRoomForm(f=>({...f,floorColor:c}))} />
                    ))}
                  </div>
                </div>
                <button className="re-btn" style={{width:"100%",justifyContent:"center",marginTop:"4px"}}
                  onClick={() => { setRoom({...roomForm}); showToast("Room updated"); }}>
                  Apply Room
                </button>
              </div>
            </div>
            <div className="re-furn-grid-title">Furniture</div>
            <div className="re-furn-grid">
              {FURNITURE.map(def => <PaletteItem key={def.id} def={def} />)}
            </div>
          </aside>

          {/* ── CANVAS ── */}
          <div className="re-canvas-area">
            <div className="re-canvas-toolbar">
              <div className="re-tool-group">
                <button className="re-tool-btn active">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 2l10 5.5-5.5 1L5 14 3 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  Select
                </button>
              </div>
              <div className="re-divider" />
              <div className="re-tool-group">
                <button className="re-tool-btn" onClick={() => {
                  if (!selectedItem) { showToast("Select an item first"); return; }
                  updateSelected({ rot: ((selectedItem.rot||0)+90)%360 });
                }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M13 3.5A6 6 0 103 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13 7V3.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Rotate 90°
                </button>
                <button className="re-tool-btn" onClick={() => {
                  if (!selectedItem) { showToast("Select an item first"); return; }
                  updateSelected({ flipped: !selectedItem.flipped });
                }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h4.5M13.5 8H11M4 5.5L1.5 8 4 10.5M12 5.5l2.5 2.5-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Flip
                </button>
                <button className="re-tool-btn" onClick={() => {
                  if (!selectedItem) { showToast("Select an item first"); return; }
                  const clone = {...selectedItem, id:idCounter.current++, x:selectedItem.x+0.25, y:selectedItem.y+0.25};
                  setItems(prev => [...prev, clone]);
                  setSelectedId(clone.id);
                  showToast("Duplicated");
                }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="4" y="4" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 10V3h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Duplicate
                </button>
              </div>
              <div className="re-divider" />
              <button className={`re-tool-btn${showGrid?" active":""}`} onClick={() => setShowGrid(g=>!g)}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M1 5.5h14M1 10.5h14M5.5 1v14M10.5 1v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Grid
              </button>
              <button className={`re-tool-btn${snap?" active":""}`} onClick={() => { setSnap(s=>!s); showToast(snap?"Snap OFF":"Snap ON"); }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Snap
              </button>
              <div className="re-divider" />
              <button className="re-tool-btn" onClick={() => setZoom(z => Math.max(0.3, z/1.2))}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 14l-3-3M5 7h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              <button className="re-tool-btn" onClick={() => setZoom(z => Math.min(3, z*1.2))}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 14l-3-3M7 5v4M5 7h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              <span className="re-zoom-info">{Math.round(zoom*100)}%</span>
            </div>

            <div className="re-canvas-wrap" ref={wrapRef}>
              <canvas
                ref={canvasRef}
                style={{cursor: dragRef.current ? "grabbing" : "default", display:"block", imageRendering:"pixelated"}}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDblClick}
                onWheel={handleWheel}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
              />
            </div>

            <div className="re-status-bar">
              <span>Items: <b>{items.length}</b></span>
              <span>Room: <b>{room.w}m × {room.d}m</b></span>
              <span style={{marginLeft:"auto"}}>{cursorPos}</span>
            </div>
          </div>

          {/* ── RIGHT PROPERTIES ── */}
          <aside className="re-props-panel">
            {!selectedItem ? (
              <div className="re-props-empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{opacity:0.3}}>
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <p>Select a furniture item to edit its properties</p>
              </div>
            ) : (
              <div className="re-props-content">
                <div style={{fontSize:"10px",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--text3)"}}>Properties</div>
                <div className="re-prop-group">
                  <label>Name</label>
                  <input className="re-prop-input" value={selectedItem.name} readOnly />
                </div>
                <div className="re-prop-group">
                  <label>Position (m)</label>
                  <div className="re-prop-row">
                    <input className="re-prop-input" type="number" step={0.1}
                      value={selectedItem.x.toFixed(2)}
                      onChange={e => updateSelected({ x: Math.max(0, Math.min(room.w-selectedItem.w, parseFloat(e.target.value)||0)) })} />
                    <input className="re-prop-input" type="number" step={0.1}
                      value={selectedItem.y.toFixed(2)}
                      onChange={e => updateSelected({ y: Math.max(0, Math.min(room.d-selectedItem.h, parseFloat(e.target.value)||0)) })} />
                  </div>
                </div>
                <div className="re-prop-group">
                  <label>Size (m)</label>
                  <div className="re-prop-row">
                    <input className="re-prop-input" type="number" step={0.1} min={0.3}
                      value={selectedItem.w.toFixed(2)}
                      onChange={e => updateSelected({ w: Math.max(0.2, parseFloat(e.target.value)||0.5) })} />
                    <input className="re-prop-input" type="number" step={0.1} min={0.3}
                      value={selectedItem.h.toFixed(2)}
                      onChange={e => updateSelected({ h: Math.max(0.2, parseFloat(e.target.value)||0.5) })} />
                  </div>
                </div>
                <div className="re-prop-group">
                  <label>Rotation (°)</label>
                  <input className="re-prop-input" type="number" min={0} max={359} step={1}
                    value={selectedItem.rot||0}
                    onChange={e => updateSelected({ rot: ((parseFloat(e.target.value)%360)+360)%360 })} />
                </div>
                <div className="re-prop-group">
                  <label>Colour</label>
                  <div className="re-color-row">
                    {PROP_COLORS.map(c => (
                      <div key={c} className={`re-swatch${selectedItem.color===c?" active":""}`}
                        style={{background:c}} onClick={() => updateSelected({color:c})} />
                    ))}
                  </div>
                </div>
                <div className="re-prop-group">
                  <label>Label</label>
                  <input className="re-prop-input" type="text" placeholder="Optional label…"
                    value={selectedItem.label||""}
                    onChange={e => updateSelected({label:e.target.value})} />
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:4}}>
                  <button className="re-btn" style={{width:"100%",justifyContent:"center",fontSize:"12px"}}
                    onClick={() => updateSelected({rot:((selectedItem.rot||0)+90)%360})}>
                    Rotate 90°
                  </button>
                  <button className="re-btn danger" style={{width:"100%",justifyContent:"center",fontSize:"12px"}}
                    onClick={() => showModal("Delete item?","Remove this furniture item from the layout?", () => {
                      setItems(prev => prev.filter(i=>i.id!==selectedId));
                      setSelectedId(null);
                      showToast("Item removed");
                    })}>
                    Delete Item
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* ── TOAST ── */}
        <div className={`re-toast${toast.show?" show":""}`}>{toast.msg}</div>

        {/* ── MODAL ── */}
        <div className={`re-modal-backdrop${modal.open?" open":""}`}>
          <div className="re-modal">
            <h3>{modal.title}</h3>
            <p>{modal.body}</p>
            <div className="re-modal-actions">
              <button className="re-btn" onClick={() => setModal(m=>({...m,open:false}))}>Cancel</button>
              <button className="re-btn danger" onClick={() => {
                setModal(m=>({...m,open:false}));
                if (modal.cb) modal.cb();
              }}>Confirm</button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
