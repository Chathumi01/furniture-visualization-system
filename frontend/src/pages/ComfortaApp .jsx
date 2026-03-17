import { useState } from "react";
import { jsPDF } from "jspdf";
import RoomEditor from "./RoomEditor";
import RoomViewer3D from "./RoomViewer3D";
import logoImg from "../assets/LOGO.png";
import imageColumnImg from "../assets/Image Column.png";
import overlayShadowImg from "../assets/Overlay+Shadow.png";
import imageShadow1Img from "../assets/Image+Shadow-1.png";
import imageShadow2Img from "../assets/Image+Shadow-2.png";
import imageShadowImg from "../assets/Image+Shadow.png";
import facebookIconImg from "../assets/Facebook.png";
import instagramIconImg from "../assets/Instagram.png";
import twitterIconImg from "../assets/Twitter.png";
import visaCardImg from "../assets/visa.png";
import card2Img from "../assets/card2 .png";
import card3Img from "../assets/card3.png";
import container1Img from "../assets/Container-1.png";
import containerImg from "../assets/Container.png";
import image1Img from "../assets/Image-1.png";
import imageImg from "../assets/Image.png";
import rectangle4280Img from "../assets/Rectangle 4280 (2).png";
import image1ParenImg from "../assets/Image (1).png";
import image2ParenImg from "../assets/Image (2).png";
import decorativeElementImg from "../assets/Decorative Element.png";

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:#1C1C1E;}
:root{
  --or:#F5A623; --or-d:#DC9018; --or-l:#FEF3E2;
  --cr:#FAF7F0; --wh:#FFFFFF; --sb:#1C1C1E; --sb2:#252527;
  --tx:#1C1C1E; --t2:#6B7280; --t3:#9CA3AF;
  --bd:#E5E7EB; --b2:#D1D5DB;
  --gn:#22C55E; --gn-l:#DCFCE7;
  --bl:#3B82F6; --bl-l:#EFF6FF;
  --rd:#EF4444; --rd-l:#FEF2F2;
  --sh:0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04);
  --sh2:0 4px 12px rgba(0,0,0,0.08);
  --sh3:0 10px 40px rgba(0,0,0,0.12);
  --r:8px; --r2:12px; --r3:16px;
}

/* layout */
.app{display:flex;height:100vh;overflow:hidden;}
.sb{width:240px;flex-shrink:0;background:var(--sb);display:flex;flex-direction:column;overflow:hidden;}
.main{flex:1;background:var(--cr);overflow-y:auto;display:flex;flex-direction:column;}

/* sidebar */
.sb-logo{padding:18px 16px 14px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:6px;}
.sb-icon{width:42px;height:42px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;}
.sb-icon img{width:100%;height:100%;object-fit:contain;}
.sb-name{font-size:13px;font-weight:700;color:#fff;line-height:1.3;font-family:'Kailasa',sans-serif;}
.sb-sub{font-size:9px;font-weight:500;color:rgba(255,255,255,0.3);letter-spacing:.12em;text-transform:uppercase;}
.sb-nav{flex:1;padding:4px 10px;display:flex;flex-direction:column;gap:2px;overflow-y:auto;}
.sn{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--r);font-size:13px;font-weight:500;color:rgba(255,255,255,0.5);cursor:pointer;transition:all .15s;border:none;background:none;width:100%;text-align:left;}
.sn:hover{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.85);}
.sn.on{background:var(--or);color:#fff;font-weight:600;}
.sb-bot{padding:10px;border-top:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;gap:2px;}
.sb-bi{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:var(--r);font-size:13px;font-weight:500;color:rgba(255,255,255,0.4);cursor:pointer;transition:all .15s;border:none;background:none;width:100%;text-align:left;}
.sb-bi:hover{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.75);}
.sb-user{display:flex;align-items:center;gap:10px;padding:10px 12px;margin-top:2px;}
.sb-av{width:32px;height:32px;border-radius:50%;background:#555;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;overflow:hidden;}
.sb-un{font-size:13px;font-weight:600;color:#fff;}
.sb-ur{font-size:11px;color:rgba(255,255,255,0.38);}

/* topbar (customer pages) */
.topbar{background:var(--wh);border-bottom:1px solid var(--bd);height:60px;display:flex;align-items:center;padding:0 28px;gap:16px;flex-shrink:0;}
.tb-logo{display:flex;align-items:center;gap:8px;cursor:pointer;}
.tb-li{width:34px;height:34px;background:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.tb-li img{width:100%;height:100%;object-fit:contain;}
.tb-ln{font-size:16px;font-weight:700;color:var(--tx);font-family:'Kailasa',sans-serif;}
.tb-search{flex:1;max-width:380px;margin-left:auto;position:relative;}
.tb-search input{width:100%;padding:8px 12px 8px 34px;border:1px solid var(--bd);border-radius:var(--r);font-family:inherit;font-size:13px;background:#F9FAFB;color:var(--tx);outline:none;transition:border-color .15s;}
.tb-search input:focus{border-color:var(--or);background:var(--wh);}
.tb-si{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--t3);pointer-events:none;}
.tb-bell{width:36px;height:36px;border-radius:50%;border:1px solid var(--bd);background:var(--wh);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t2);}
.tb-av{width:36px;height:36px;border-radius:50%;background:var(--or-l);border:2px solid var(--or);display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;}

/* page */
.pc{padding:28px 32px;flex:1;}
.ph{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;}
.pt{font-size:26px;font-weight:700;color:var(--tx);}
.ps{font-size:13px;color:var(--t2);margin-top:4px;}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:7px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;padding:9px 18px;border-radius:var(--r);border:1.5px solid transparent;cursor:pointer;transition:all .15s;white-space:nowrap;line-height:1;}
.btn-or{background:var(--or);color:#fff;border-color:var(--or);}
.btn-or:hover{background:var(--or-d);}
.btn-out{background:var(--wh);color:var(--tx);border-color:var(--b2);}
.btn-out:hover{background:var(--cr);}
.btn-dk{background:var(--tx);color:#fff;border-color:var(--tx);}
.btn-dk:hover{background:#2d2d2d;}
.btn-gh{background:transparent;color:var(--t2);border-color:transparent;}
.btn-gh:hover{background:var(--cr);}
.btn-sm{padding:6px 13px;font-size:12px;}
.btn-lg{padding:12px 24px;font-size:14px;}
.btn-full{width:100%;justify-content:center;}

/* cards */
.card{background:var(--wh);border-radius:var(--r2);border:1px solid var(--bd);box-shadow:var(--sh);}
.cp{padding:22px;}
.cp-sm{padding:14px 18px;}

/* form */
.fg{display:flex;flex-direction:column;gap:5px;}
.fl{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--t2);}
.fi{font-family:'Inter',sans-serif;font-size:13px;padding:9px 12px;border:1px solid var(--b2);border-radius:var(--r);background:var(--wh);color:var(--tx);outline:none;transition:all .15s;width:100%;}
.fi:focus{border-color:var(--or);box-shadow:0 0 0 3px rgba(245,166,35,.1);}
.fi::placeholder{color:var(--t3);}
.fi.err{border-color:var(--rd);}
.fe{font-size:11px;color:var(--rd);margin-top:2px;}

/* badge */
.bdg{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:20px;}
.bdg-or{background:var(--or-l);color:var(--or);}
.bdg-gn{background:var(--gn-l);color:#16A34A;}
.bdg-bl{background:var(--bl-l);color:var(--bl);}
.bdg-gy{background:#F3F4F6;color:var(--t2);}
.bdg-rd{background:var(--rd-l);color:var(--rd);}

/* toggle */
.tog{width:44px;height:24px;border-radius:12px;background:var(--b2);border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;}
.tog.on{background:var(--or);}
.tog::after{content:'';position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);}
.tog.on::after{left:22px;}

/* checkbox */
.chk{width:18px;height:18px;border-radius:4px;border:2px solid var(--b2);flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;background:var(--wh);}
.chk.on{border-color:var(--or);background:var(--or);}
.chk.on::after{content:'✓';color:#fff;font-size:11px;font-weight:700;}

/* radio */
.ro{display:flex;align-items:center;gap:12px;padding:13px 16px;border:1.5px solid var(--bd);border-radius:var(--r2);cursor:pointer;transition:all .15s;}
.ro.on{border-color:var(--or);background:var(--or-l);}
.rd-dot{width:18px;height:18px;border-radius:50%;border:2px solid var(--b2);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.rd-dot.on{border-color:var(--or);background:var(--or);}
.rd-dot.on::after{content:'';width:6px;height:6px;border-radius:50%;background:#fff;}

/* metric */
.mc{background:var(--wh);border:1px solid var(--bd);border-radius:var(--r2);padding:20px 22px;box-shadow:var(--sh);}
.ml{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--t2);display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.mv{font-size:34px;font-weight:700;color:var(--tx);}
.mch{font-size:12px;font-weight:700;padding:2px 7px;border-radius:20px;}
.pos{color:#16A34A;background:var(--gn-l);}
.neg{color:var(--rd);background:var(--rd-l);}

/* list row */
.lr{display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--wh);border:1px solid var(--bd);border-radius:var(--r2);cursor:pointer;transition:all .15s;margin-bottom:10px;}
.lr:hover{border-color:var(--b2);box-shadow:var(--sh2);}
.lr-thumb{width:52px;height:52px;border-radius:var(--r);background:var(--cr);flex-shrink:0;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.lr-thumb img{width:100%;height:100%;object-fit:cover;}
.lr-info{flex:1;}
.lr-name{font-size:14px;font-weight:600;color:var(--tx);}
.lr-meta{font-size:12px;color:var(--t2);margin-top:2px;}
.lr-right{display:flex;flex-direction:column;align-items:flex-end;gap:3px;}
.des-tag{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--t3);}
.des-av{width:28px;height:28px;border-radius:50%;background:var(--or-l);border:1.5px solid var(--or);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--or);}

/* design card */
.dc{background:var(--wh);border:1px solid var(--bd);border-radius:var(--r2);overflow:hidden;box-shadow:var(--sh);transition:all .2s;}
.dc:hover{box-shadow:var(--sh3);transform:translateY(-2px);}
.dc-img-wrap{position:relative;}
.dc-img{width:100%;height:160px;object-fit:cover;display:block;background:#E5E7EB;}
.dc-status{position:absolute;top:10px;left:10px;}
.dc-body{padding:14px;}
.dc-name{font-size:15px;font-weight:700;color:var(--tx);margin-bottom:6px;line-height:1.3;}
.dc-client{font-size:12px;color:var(--t2);display:flex;align-items:center;gap:4px;margin-bottom:3px;}
.dc-date{font-size:12px;color:var(--t3);display:flex;align-items:center;gap:4px;}
.dc-acts{display:flex;gap:8px;margin-top:12px;align-items:center;}

/* export format */
.ef{display:flex;align-items:center;gap:14px;padding:16px;border:1.5px solid var(--bd);border-radius:var(--r2);cursor:pointer;transition:all .15s;}
.ef:hover{border-color:var(--b2);}
.ef.on{border-color:var(--or);background:var(--or-l);}
.ef-icon{width:42px;height:42px;border-radius:var(--r);background:var(--cr);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.ef.on .ef-icon{background:var(--or);}
.ef-name{font-size:14px;font-weight:600;color:var(--tx);}
.ef-sub{font-size:12px;color:var(--t2);}

/* feedback */
.fbc{background:var(--wh);border:1px solid var(--bd);border-radius:var(--r2);padding:20px;box-shadow:var(--sh);margin-bottom:12px;}
.fb-hd{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.fb-av{width:40px;height:40px;border-radius:50%;background:#E5E7EB;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:18px;overflow:hidden;}
.fb-av img{width:100%;height:100%;object-fit:cover;}
.fb-nm{font-size:14px;font-weight:600;color:var(--tx);}
.fb-time{font-size:12px;color:var(--t3);margin-left:auto;}
.fb-q{padding:12px 14px;background:#F9FAFB;border-radius:var(--r);border-left:3px solid var(--or);font-size:13px;color:var(--t2);line-height:1.65;margin-bottom:14px;}
.fb-q.arch{border-left-color:var(--b2);color:var(--t3);text-decoration:line-through;}
.fb-tag{font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;margin-bottom:1px;}

/* settings */
.ss{background:var(--wh);border:1px solid var(--bd);border-radius:var(--r2);padding:22px;margin-bottom:18px;box-shadow:var(--sh);}
.ss-title{font-size:16px;font-weight:700;color:var(--tx);margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;}
.notif-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--bd);}
.notif-row:last-child{border-bottom:none;padding-bottom:0;}
.notif-title{font-size:14px;font-weight:600;color:var(--tx);}
.notif-sub{font-size:12px;color:var(--t2);margin-top:2px;}
.notif-chks{display:flex;align-items:center;gap:16px;}
.nc-item{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--t2);}

/* units toggle */
.units{display:flex;border:1.5px solid var(--b2);border-radius:var(--r);overflow:hidden;}
.ub{flex:1;padding:8px 14px;font-size:13px;font-weight:500;border:none;cursor:pointer;font-family:inherit;transition:all .15s;}
.ub.on{background:var(--tx);color:#fff;}
.ub:not(.on){background:var(--wh);color:var(--t2);}

/* theme btn */
.thb{display:flex;align-items:center;gap:8px;padding:10px 20px;border:2px solid var(--bd);border-radius:var(--r);cursor:pointer;font-size:14px;font-weight:500;background:var(--wh);transition:all .15s;font-family:inherit;}
.thb.on{border-color:var(--or);color:var(--or);background:var(--or-l);}

/* order */
.oi{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--bd);}
.oi:last-of-type{border-bottom:none;}
.oi-img{width:58px;height:58px;border-radius:var(--r);background:var(--cr);flex-shrink:0;overflow:hidden;}
.oi-img img{width:100%;height:100%;object-fit:cover;}
.oi-name{font-size:14px;font-weight:600;color:var(--tx);}
.oi-var{font-size:12px;color:var(--t2);margin-top:3px;}
.oi-pr{font-size:14px;font-weight:700;color:var(--tx);margin-top:5px;}
.ot-row{display:flex;justify-content:space-between;font-size:13px;color:var(--t2);padding:5px 0;}
.ot-total{display:flex;justify-content:space-between;font-size:16px;font-weight:700;color:var(--tx);padding:12px 0;border-top:2px solid var(--bd);margin-top:4px;}

/* 3d viz panel */
.viz-panel{border:1.5px dashed var(--bl);border-radius:var(--r2);padding:20px;background:rgba(59,130,246,.02);}
.vp-title{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:700;color:var(--tx);margin-bottom:16px;}
.vp-ta{width:100%;padding:12px;border:1px solid var(--b2);border-radius:var(--r);font-family:inherit;font-size:13px;color:var(--tx);background:var(--wh);resize:vertical;min-height:130px;outline:none;line-height:1.6;}
.vp-ta:focus{border-color:var(--or);}
.vp-ta::placeholder{color:var(--t3);font-style:italic;}
.vp-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;border-top:1px solid var(--bd);padding-top:16px;margin-top:4px;}
.vp-dl{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--t3);margin-bottom:4px;}
.vp-dv{font-size:14px;font-weight:700;color:var(--tx);}

/* pro tip */
.pro-tip{display:flex;gap:12px;padding:14px 16px;background:var(--or-l);border-radius:var(--r2);border:1px solid rgba(245,166,35,.2);}
.pro-tip p{font-size:13px;color:var(--tx);line-height:1.6;}
.pro-tip strong{color:var(--or);}

/* success */
.sw{display:flex;flex-direction:column;align-items:center;padding:60px 32px;text-align:center;flex:1;}
.s-icon{width:72px;height:72px;border-radius:50%;background:var(--gn-l);display:flex;align-items:center;justify-content:center;margin-bottom:22px;}
.s-title{font-size:28px;font-weight:700;color:var(--tx);margin-bottom:8px;}
.s-sub{font-size:14px;color:var(--t2);line-height:1.7;margin-bottom:32px;}

/* footer */
.footer{background:#1C1C1E;padding:48px 40px 24px;margin-top:auto;}
.footer-g{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:32px;margin-bottom:40px;}
.footer-bn{font-size:22px;font-weight:800;letter-spacing:.1em;color:#fff;margin-bottom:12px;font-family:'Kailasa',sans-serif;}
.footer-bd{font-size:13px;color:rgba(255,255,255,.45);line-height:1.7;margin-bottom:18px;}
.footer-nl{font-size:13px;font-weight:600;color:#fff;margin-bottom:10px;}
.footer-row{display:flex;gap:0;}
.footer-inp{flex:1;padding:9px 12px;border:1px solid rgba(255,255,255,.12);border-radius:var(--r) 0 0 var(--r);background:rgba(255,255,255,.07);color:#fff;font-family:inherit;font-size:13px;outline:none;}
.footer-inp::placeholder{color:rgba(255,255,255,.3);}
.footer-btn{padding:9px 16px;background:var(--or);border:none;border-radius:0 var(--r) var(--r) 0;color:#fff;font-size:13px;font-weight:600;cursor:pointer;}
.footer-ck{display:flex;align-items:center;gap:8px;margin-top:8px;font-size:11px;color:rgba(255,255,255,.35);cursor:pointer;}
.footer-ct{font-size:13px;font-weight:600;color:#fff;margin-bottom:14px;}
.footer-cl{font-size:13px;color:rgba(255,255,255,.45);margin-bottom:8px;cursor:pointer;display:block;transition:color .15s;}
.footer-cl:hover{color:rgba(255,255,255,.8);}
.footer-bot{border-top:1px solid rgba(255,255,255,.08);padding-top:20px;display:flex;align-items:center;justify-content:space-between;}
.footer-soc{display:flex;gap:10px;}
.footer-sb{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;}
.footer-pay{display:flex;gap:8px;}
.footer-pb{padding:4px 10px;background:#fff;border-radius:4px;font-size:11px;font-weight:700;color:#1C1C1E;}
.footer-copy{font-size:11px;color:rgba(255,255,255,.28);text-align:center;margin-top:16px;}

/* auth */
.auth-bg{min-height:calc(100vh - 60px);background:var(--cr);display:flex;align-items:center;justify-content:center;padding:40px 20px;}
.auth-card{background:var(--wh);border:1px solid var(--bd);border-radius:var(--r2);padding:40px;width:100%;max-width:460px;box-shadow:var(--sh2);}
.auth-t{font-size:24px;font-weight:700;color:var(--tx);text-align:center;margin-bottom:6px;}
.auth-s{font-size:14px;color:var(--t2);text-align:center;margin-bottom:28px;line-height:1.55;}

/* grids */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}

/* helpers */
.flex{display:flex;}.fdc{flex-direction:column;}.ic{align-items:center;}.jb{justify-content:space-between;}
.gap2{gap:8px;}.gap3{gap:12px;}.gap4{gap:16px;}.gap5{gap:20px;}
.mt2{margin-top:8px;}.mt3{margin-top:12px;}.mt4{margin-top:16px;}.mt5{margin-top:20px;}.mt6{margin-top:24px;}
.mb2{margin-bottom:8px;}.mb3{margin-bottom:12px;}.mb4{margin-bottom:16px;}.mb5{margin-bottom:20px;}.mb6{margin-bottom:24px;}
.fw{width:100%;}
.sec-title{font-size:17px;font-weight:700;color:var(--tx);margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;}
.sec-link{font-size:13px;font-weight:600;color:var(--or);cursor:pointer;}
.sec-link:hover{color:var(--or-d);}
.form-pw-wrap{position:relative;}
.form-pw-wrap .fi{padding-right:36px;}
.pw-eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;color:var(--t3);}
@keyframes fin{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.fin{animation:fin .3s ease both;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-thumb{background:var(--b2);border-radius:4px;}
`;

/* ─── SIDEBAR ─────────────────────────────────────────────────────────────── */
function Sidebar({ active, onNav }) {
  const items = [
    { id:"dashboard", label:"Dashboard",          icon:"⊞" },
    { id:"mydesigns", label:"My Designs",          icon:"≡" },
    { id:"library",   label:"Furniture Library",   icon:"▦" },
    { id:"newproject",label:"Create New Project",  icon:"＋" },
  ];
  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="sb-icon"><img src={logoImg} alt="Comforta logo" /></div>
        <div>
          <div className="sb-name">Comforta</div>
          <div className="sb-sub">Studio Library</div>
        </div>
      </div>
      <nav className="sb-nav">
        {items.map(it => (
          <button key={it.id} className={`sn${active===it.id?" on":""}`} onClick={()=>onNav(it.id)}>
            <span style={{fontSize:14,opacity:.9}}>{it.icon}</span>{it.label}
          </button>
        ))}
      </nav>
      <div className="sb-bot">
        <button className={`sb-bi${active==="settings"?" on":""}`} onClick={()=>onNav("settings")}>
          <span style={{fontSize:13}}>⚙</span>&nbsp;Settings
        </button>
        <button className="sb-bi" onClick={()=>onNav("landing")}>
          <span style={{fontSize:13}}>⎋</span>&nbsp;Logout
        </button>
        <div className="sb-user">
          <div className="sb-av">AJ</div>
          <div>
            <div className="sb-un">Alex Jensen</div>
            <div className="sb-ur">Interior Designer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PaymentSidebar({ active, onNav }) {
  const items = [
    { id:"roomviewer3d", label:"3D View",          icon:"🧊" },
    { id:"vizfeedback",  label:"Send Requirement", icon:"✉" },
    { id:"about",        label:"About Us",         icon:"ℹ" },
  ];
  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="sb-icon"><img src={logoImg} alt="Comforta logo" /></div>
        <div>
          <div className="sb-name">Comforta</div>
          <div className="sb-sub">Customer Actions</div>
        </div>
      </div>
      <nav className="sb-nav">
        {items.map(it => (
          <button key={it.id} className={`sn${active===it.id?" on":""}`} onClick={()=>onNav(it.id)}>
            <span style={{fontSize:14,opacity:.9}}>{it.icon}</span>{it.label}
          </button>
        ))}
      </nav>
      <div className="sb-bot">
        <button className="sb-bi" onClick={()=>onNav("checkout")}>
          <span style={{fontSize:13}}>💳</span>&nbsp;Payment
        </button>
      </div>
    </aside>
  );
}

/* ─── TOPBAR ──────────────────────────────────────────────────────────────── */
function TopBar({ onNav }) {
  return (
    <div className="topbar">
      <div className="tb-logo" onClick={()=>onNav("landing")}>
        <div className="tb-li"><img src={logoImg} alt="Comforta logo" /></div>
        <div className="tb-ln">Comforta</div>
      </div>
      <div className="tb-search">
        <span className="tb-si">🔍</span>
        <input placeholder="Search projects..." />
      </div>
      <div className="flex ic gap3" style={{marginLeft:16}}>
        <div className="tb-bell">🔔</div>
        <div className="tb-av">👤</div>
      </div>
    </div>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-g">
        <div>
          <div className="footer-bn">COMFORTA</div>
          <div className="footer-bd">Furniture created to enhance everyday living with comfort, warmth, and refined design.</div>
          <div className="footer-nl">Join our newsletter and receive exclusive offers</div>
          <div className="footer-row">
            <input className="footer-inp" placeholder="Enter Your Email" />
            <button className="footer-btn">→</button>
          </div>
          <label className="footer-ck">
            <div className="chk on" />
            Yes, I accept the <u>Privacy Policy</u>
          </label>
        </div>
        {[["Company",["About us","Our Story","Wholesale Inquiries"]],
          ["Store",["Best Sellers","Latest Products","Sale"]],
          ["Account",["My Account","My Orders"]]
        ].map(([t,ls])=>(
          <div key={t}>
            <div className="footer-ct">{t}</div>
            {ls.map(l=><span key={l} className="footer-cl">{l}</span>)}
          </div>
        ))}
      </div>
      <div className="footer-bot">
        <div className="footer-soc">
          {[[facebookIconImg,"#1877F2"],[instagramIconImg,"#E1306C"],[twitterIconImg,"#1DA1F2"]].map(([icon,bg],i)=>(
            <div key={i} className="footer-sb" style={{background:bg}}><img src={icon} alt="social-icon" style={{width:"24px",height:"24px"}}/></div>
          ))}
        </div>
        <div className="footer-pay">
          {[[visaCardImg,"VISA"],[card2Img,"MC"],[card3Img,"PayPal"]].map(([img,name],i)=><div key={name} className="footer-pb"><img src={img} alt={name} style={{width:"48px",height:"auto"}}/></div>)}
        </div>
      </div>
      <div className="footer-copy">All prices include VAT. Shipping and delivery charges may apply unless stated otherwise.</div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 1 — DESIGNER DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */
function DesignerDashboard({ onNav }) {
  const recent = [
    { name:"Nordic Minimalist Sofa",  cat:"Sofa",      time:"Edited 2h ago",  img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=80" },
    { name:"Executive Oak Desk",       cat:"Workspace", time:"Edited 5h ago",  img:"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=120&q=80" },
    { name:"Industrial Dining Set",    cat:"Dining",    time:"Edited 1d ago",  img:"https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=120&q=80" },
    { name:"Velvet Accent Chair",      cat:"Seating",   time:"Edited 2d ago",  img:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&q=80" },
  ];
  return (
    <div className="pc fin">
      {/* Header */}
      <div className="ph">
        <div>
          <div className="pt">Welcome back, Designer</div>
          <div className="ps">Here is what's happening with your projects today</div>
        </div>
        <button className="btn btn-or" onClick={()=>onNav("newproject")}>+ Create New Design</button>
      </div>

      {/* Metrics */}
      <div className="g3 mb6">
        {[{l:"TOTAL DESIGNS",v:"128",ch:"+12%",pos:true},{l:"SAVED PROJECTS",v:"84",ch:"+5%",pos:true},{l:"ACTIVE SPECS",v:"12",ch:"-2%",pos:false}].map(m=>(
          <div key={m.l} className="mc">
            <div className="ml">{m.l}<span className={`mch ${m.pos?"pos":"neg"}`}>{m.ch}</span></div>
            <div className="mv">{m.v}</div>
          </div>
        ))}
      </div>

      {/* Recently Edited */}
      <div className="sec-title">
        Recently Edited
        <span className="sec-link" onClick={()=>onNav("mydesigns")}>View all projects</span>
      </div>
      <div className="mb5">
        {recent.map(r=>(
          <div key={r.name} className="lr">
            <div className="lr-thumb"><img src={r.img} alt={r.name} onError={e=>{e.target.style.display='none';}}/></div>
            <div className="lr-info">
              <div className="lr-name">{r.name}</div>
              <div className="lr-meta">Category: {r.cat} • {r.time}</div>
            </div>
            <div className="lr-right">
              <div className="des-tag">Designer</div>
              <div className="des-av">JV</div>
            </div>
            <span style={{color:"var(--t3)",fontSize:18}}>›</span>
          </div>
        ))}
      </div>

      {/* User Requirements */}
      <div className="sec-title">User Requirements</div>
      <div className="lr" onClick={()=>onNav("feedback")}>
        <div className="lr-thumb" style={{background:"#FEE2E2",fontSize:24}}>👩</div>
        <div className="lr-info">
          <div className="lr-name">Riverside Residence</div>
          <div className="lr-meta">Category: Seating • Sent 2d ago</div>
        </div>
        <div className="lr-right">
          <div className="des-tag">Customer</div>
          <div className="des-av">JV</div>
        </div>
        <span style={{color:"var(--t3)",fontSize:18}}>›</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 2 — MY DESIGNS
   ═══════════════════════════════════════════════════════════════════════════ */
function MyDesigns({ onNav }) {
  const designs = [
    { name:"Modern Minimalist Living Room", client:"Sarah Johnson",   time:"2 hours ago", status:"IN PROGRESS",
      img:container1Img },
    { name:"Oak Office Suite",              client:"TechCorp HQ",     time:"1 day ago",   status:null,
      img:containerImg },
    { name:"Scandinavian Bedroom",          client:"Mikael Blomkvist", time:"3 days ago",  status:null,
      img:image1Img },
    { name:"Industrial Kitchen",            client:"Urban Lofts",     time:"1 week ago",  status:null,
      img:imageImg },
  ];
  return (
    <div className="flex fdc" style={{minHeight:"100vh",background:"#FBF5E6"}}>
      <TopBar onNav={onNav} />
      <div className="pc fin" style={{flex:1,background:"#FBF5E6"}}>
        <div className="ph">
          <div>
            <div className="pt">My Designs</div>
            <div className="ps">Manage and evolve your bespoke interior spaces</div>
          </div>
          <button className="btn btn-or" onClick={()=>onNav("newproject")}>+ Create New Design</button>
        </div>
        <div className="g4">
          {designs.map(d=>(
            <div key={d.name} className="dc">
              <div className="dc-img-wrap">
                <img className="dc-img" src={d.img} alt={d.name} onError={e=>{e.target.style.background='#ddd';e.target.style.display='flex';}}/>
                {d.status&&<div className="dc-status"><span className="bdg bdg-or">{d.status}</span></div>}
              </div>
              <div className="dc-body">
                <div className="dc-name">{d.name}</div>
                <div className="dc-client">👤 {d.client}</div>
                <div className="dc-date">🕐 Last Edited: {d.time}</div>
                <div className="dc-acts">
                  <button className="btn btn-out btn-sm" style={{flex:1}} onClick={()=>onNav("roomeditor")}>✏️ Edit</button>
                  <button className="btn btn-gh btn-sm" style={{padding:"6px 10px",color:"var(--rd)"}}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 3 — CREATE ACCOUNT
   ═══════════════════════════════════════════════════════════════════════════ */
function CreateAccount({ onNav }) {
  const [f,setF]=useState({name:"",email:"",pass:"",confirm:""});
  const [showP,setShowP]=useState(false);
  const [errs,setErrs]=useState({});
  function submit(){
    const e={};
    if(!f.name) e.name="Name is required";
    if(!f.email||!f.email.includes("@")) e.email="Enter a valid email";
    if(!f.pass||f.pass.length<6) e.pass="Minimum 6 characters";
    if(f.pass!==f.confirm) e.confirm="Passwords don't match";
    if(Object.keys(e).length){setErrs(e);return;}
    onNav("dashboard");
  }
  return (
    <div className="flex fdc" style={{minHeight:"100vh"}}>
      <div className="auth-bg" style={{flex:1}}>
        <div className="auth-card fin">
          <div className="auth-t">Create Account</div>
          <div className="auth-s">Join our community for the best Scandinavian designs.</div>
          <div className="flex fdc gap4">
            <div className="fg">
              <label className="fl">Full Name</label>
              <input className={`fi${errs.name?" err":""}`} placeholder="Enter your full name" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/>
              {errs.name&&<div className="fe">{errs.name}</div>}
            </div>
            <div className="fg">
              <label className="fl">Email Address</label>
              <input className={`fi${errs.email?" err":""}`} placeholder="name@example.com" type="email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))}/>
              {errs.email&&<div className="fe">{errs.email}</div>}
            </div>
            <div className="fg">
              <label className="fl">Password</label>
              <div className="form-pw-wrap">
                <input className={`fi${errs.pass?" err":""}`} placeholder="Create a password" type={showP?"text":"password"} value={f.pass} onChange={e=>setF(p=>({...p,pass:e.target.value}))}/>
                <span className="pw-eye" onClick={()=>setShowP(s=>!s)} style={{color:showP?"var(--or)":"var(--t3)"}}>👁</span>
              </div>
              {errs.pass&&<div className="fe">{errs.pass}</div>}
            </div>
            <div className="fg">
              <label className="fl">Confirm Password</label>
              <input className={`fi${errs.confirm?" err":""}`} placeholder="Repeat your password" type="password" value={f.confirm} onChange={e=>setF(p=>({...p,confirm:e.target.value}))}/>
              {errs.confirm&&<div className="fe">{errs.confirm}</div>}
            </div>
            <button className="btn btn-or btn-lg btn-full mt2" onClick={submit}>Create Account</button>
            <div style={{fontSize:13,color:"var(--t2)",textAlign:"center"}}>
              Already have an account? <span style={{color:"var(--or)",fontWeight:600,cursor:"pointer"}} onClick={()=>onNav("dashboard")}>Sign In</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 4 — 3D FEEDBACK (customer view with visualization)
   ═══════════════════════════════════════════════════════════════════════════ */
function VizFeedback({ onNav, trackedOrder, onOpen3D, onSubmitRequirements }) {
  const [notes,setNotes]=useState("");
  const [reqSent,setReqSent]=useState(false);
  const order = trackedOrder || DEFAULT_TRACKED_ORDER;
  return (
    <div className="flex fdc" style={{minHeight:"100vh",background:"#FBF5E6"}}>
      <div className="pc fin" style={{flex:1,background:"#FBF5E6"}}>
        <div className="g2" style={{gridTemplateColumns:"1fr 340px",gap:28,alignItems:"start"}}>
          {/* Left */}
          <div>
            <div style={{position:"relative",borderRadius:"var(--r2)",overflow:"hidden",marginBottom:20,boxShadow:"var(--sh2)",cursor:"pointer"}} onClick={onOpen3D}>
              <img
                src={order.previewImage}
                alt="3D preview"
                style={{width:"100%",height:340,objectFit:"cover",display:"block"}}
                onError={e=>{e.target.style.background='#ccc';e.target.style.minHeight='340px';}}
              />
              <div style={{position:"absolute",top:12,left:12,padding:"4px 12px",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)",borderRadius:20,fontSize:10,fontWeight:700,letterSpacing:".1em",color:"#fff",textTransform:"uppercase"}}>
                Realistic 3D Preview
              </div>
              <div style={{position:"absolute",right:12,bottom:12,padding:"7px 12px",background:"rgba(240,165,0,0.92)",borderRadius:999,fontSize:11,fontWeight:700,color:"#fff",letterSpacing:".04em"}}>
                Open 3D View
              </div>
            </div>
            <div style={{fontSize:22,fontWeight:700,color:"var(--tx)",marginBottom:8}}>{order.projectName}</div>
            <div style={{fontSize:13,color:"var(--t2)",lineHeight:1.7,marginBottom:8}}>View your space in high-fidelity. Use the panel on the right to submit any adjustments to materials, lighting, or furniture placement.</div>
            <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--t3)"}}>Tracking Number: {order.orderNumber}</div>
          </div>
          {/* Right */}
          <div>
            <div className="viz-panel">
              <div className="vp-title">✏️ Design Feedback</div>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--t3)",marginBottom:8}}>Refinement Notes</div>
              <textarea
                className="vp-ta mb4"
                placeholder="Example: I'd like the wood tone to be slightly lighter, closer to natural white oak. Also, can we try a different texture for the sofa fabric?"
                value={notes}
                onChange={e=>{setNotes(e.target.value); if (reqSent) setReqSent(false);}}
              />
              <button className="btn btn-dk btn-full" onClick={()=>{
                if(!notes.trim()) return;
                onSubmitRequirements(notes.trim(), order);
                setReqSent(true);
                setNotes("");
              }}>Submit Requirements ▷</button>
              {reqSent ? (
                <div style={{marginTop:10,padding:"9px 12px",border:"1px solid #B7E4C7",background:"#EDF9F1",borderRadius:10,fontSize:12,fontWeight:600,color:"#1D7A46",textAlign:"center"}}>
                  Requirement sent successfully.
                </div>
              ) : null}
              <div style={{fontSize:11,color:"var(--t3)",textAlign:"center",marginTop:8}}>Your designer will be notified immediately of these changes.</div>
              <div className="vp-detail-grid mt4">
                <div><div className="vp-dl">Status</div><div className="vp-dv" style={{color:"var(--or)"}}>{order.status}</div></div>
                <div><div className="vp-dl">Phase</div><div className="vp-dv">{order.phase}</div></div>
              </div>
            </div>
            <button className="btn btn-or btn-full mt3" style={{justifyContent:"center"}} onClick={()=>onNav("checkout")}>🛒 Proceed to Order</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const TRACKED_ORDERS = {
  "CF-123456": {
    orderNumber: "CF-123456",
    customerName: "Alex Rivers",
    projectName: "Riverside Residence — Living Area",
    status: "In Review",
    phase: "Material Selection",
    previewImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80",
    room: { w: 5, d: 4, shape: "rect", wallColor: "#F5F0E8", floorColor: "#C8A97A" },
    items: [
      { id: 1, type: "rug", icon: "rug", name: "Area Rug", x: 1.5, y: 1.0, w: 2.0, h: 1.5, color: "#D4B890", rot: 0, flipped: false, label: "" },
      { id: 2, type: "sofa-3", icon: "sofa3", name: "3-Seat Sofa", x: 1.6, y: 0.3, w: 2.2, h: 0.9, color: "#8B7B6B", rot: 0, flipped: false, label: "" },
      { id: 3, type: "coffee-table", icon: "ctable", name: "Coffee Table", x: 1.95, y: 1.3, w: 1.1, h: 0.6, color: "#B89870", rot: 0, flipped: false, label: "" },
      { id: 4, type: "plant", icon: "plant", name: "Plant", x: 4.2, y: 0.6, w: 0.4, h: 0.4, color: "#5A9A60", rot: 0, flipped: false, label: "" },
    ],
  },
  "CF-654321": {
    orderNumber: "CF-654321",
    customerName: "Mikael Blomkvist",
    projectName: "Nordic Loft — Bedroom",
    status: "Ready for Review",
    phase: "Final Styling",
    previewImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
    room: { w: 4.5, d: 3.8, shape: "rect", wallColor: "#E8E0DD", floorColor: "#A8886A" },
    items: [
      { id: 1, type: "bed-double", icon: "bed2", name: "Double Bed", x: 1.1, y: 0.5, w: 1.6, h: 2.0, color: "#9A8EAA", rot: 0, flipped: false, label: "" },
      { id: 2, type: "side-table", icon: "stable", name: "Side Table", x: 0.4, y: 0.8, w: 0.5, h: 0.5, color: "#C8A87A", rot: 0, flipped: false, label: "" },
      { id: 3, type: "side-table", icon: "stable", name: "Side Table", x: 2.9, y: 0.8, w: 0.5, h: 0.5, color: "#C8A87A", rot: 0, flipped: false, label: "" },
      { id: 4, type: "wardrobe", icon: "wardrobe", name: "Wardrobe", x: 3.4, y: 0.6, w: 0.65, h: 1.8, color: "#7A6858", rot: 90, flipped: false, label: "" },
    ],
  },
};

const DEFAULT_TRACKED_ORDER = TRACKED_ORDERS["CF-123456"];

const INITIAL_FEEDBACK_ITEMS = [
  { id:1, name:"Alex Rivers",   av:"👨", tag:"NEW REQUIREMENT",   tagColor:"var(--or)", quote:`"I need the logo to be more minimalist with a focus on geometric shapes. Please use a monochromatic color scheme for the final brand identity package."`, time:"2 mins ago",  arch:false },
  { id:2, name:"Sarah Jenkins", av:"👩", tag:"REVISION REQUESTED", tagColor:"var(--bl)", quote:`"Could we try a bolder typeface for the hero section? The current one feels a bit too thin for our industrial target audience. Also, let's look at more navy options."`, time:"1 hour ago",  arch:false },
  { id:3, name:"Marcus Thorne", av:"🧔", tag:"ARCHIVED",           tagColor:"var(--t3)", quote:`"Please ensure the mobile navigation uses a slide-out drawer rather than a top dropdown. It's better for UX."`, time:"Yesterday",   arch:true  },
];

function getTrackedOrder(orderNumber) {
  const normalizedOrderNumber = orderNumber.trim().toUpperCase();
  return TRACKED_ORDERS[normalizedOrderNumber] || {
    ...DEFAULT_TRACKED_ORDER,
    orderNumber: normalizedOrderNumber || DEFAULT_TRACKED_ORDER.orderNumber,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 5 — CUSTOMER FEEDBACK (designer view)
   ═══════════════════════════════════════════════════════════════════════════ */
function CustomerFeedback({ feedbackItems }) {
  const [search,setSearch]=useState("");
  const filtered=feedbackItems.filter(i=>i.name.toLowerCase().includes(search.toLowerCase())||i.quote.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="pc fin">
      {/* search + bell row */}
      <div className="flex ic jb mb5">
        <div /> {/* spacer */}
        <div className="flex ic gap3">
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--t3)",fontSize:13}}>🔍</span>
            <input style={{paddingLeft:32,paddingRight:12,paddingTop:8,paddingBottom:8,border:"1px solid var(--b2)",borderRadius:"var(--r)",fontFamily:"inherit",fontSize:13,outline:"none",background:"var(--wh)",width:260,color:"var(--tx)"}} placeholder="Search requirements..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div style={{position:"relative"}}>
            <div className="tb-bell">🔔</div>
            <div style={{position:"absolute",top:-2,right:-2,width:8,height:8,borderRadius:"50%",background:"var(--or)"}}/>
          </div>
        </div>
      </div>
      <div className="pt mb2">Customer Feedback</div>
      <div className="ps mb5">Review and process new design requirements submitted by your clients.</div>
      {filtered.map(item=>(
        <div key={item.id} className="fbc">
          <div className="fb-hd">
            <div className="fb-av">{item.av}</div>
            <div style={{flex:1}}>
              <div className="fb-nm">{item.name}</div>
              <div className="fb-tag" style={{color:item.tagColor}}>{item.tag}</div>
            </div>
            <div className="fb-time">{item.time}</div>
          </div>
          <div className={`fb-q${item.arch?" arch":""}`}>{item.quote}</div>
          {!item.arch&&(
            <div className="flex gap2">
              <button className="btn btn-dk btn-sm">Process</button>
              <button className="btn btn-out btn-sm">Reply</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 6 — CHECKOUT & PAYMENT
   ═══════════════════════════════════════════════════════════════════════════ */
function Checkout({ onNav }) {
  const [pay,setPay]=useState("card");
  const [card,setCard]=useState({name:"Johnathan Doe",num:"",exp:"",cvv:""});
  const [addr,setAddr]=useState({street:"123 Nordic Way",city:"Stockholm",postal:"112 21"});
  const [cardErr,setCardErr]=useState(false);

  const methods=[
    {id:"card",  label:"Credit Card",   sub:"Visa, Mastercard, AMEX",        icon:"💳"},
    {id:"paypal",label:"PayPal",        sub:"Pay with your PayPal account",   icon:"🅿"},
    {id:"wire",  label:"Wire Transfer", sub:"Direct bank transfer",           icon:"🏦"},
  ];
  const items=[
    {name:"Nordic Lounge Sofa",    variant:"Color: Forest Green", price:"$1,250.00", img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80"},
    {name:"Solid Oak Coffee Table",variant:"Size: Medium",        price:"$450.00",   img:"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&q=80"},
  ];

  return (
    <div className="pc fin">
      <div className="ph">
        <div>
          <div className="pt">Complete your order</div>
          <div className="ps">Finish your purchase by providing your payment details and billing address.</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:28}}>
        {/* Left */}
        <div className="flex fdc gap5">
          {/* Payment method */}
          <div>
            <div className="flex ic gap2 mb4"><span style={{fontSize:20}}>💳</span><span style={{fontSize:17,fontWeight:700}}>Payment Method</span></div>
            <div className="flex fdc gap3">
              {methods.map(m=>(
                <div key={m.id} className={`ro${pay===m.id?" on":""}`} onClick={()=>setPay(m.id)}>
                  <div className={`rd-dot${pay===m.id?" on":""}`}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600}}>{m.label}</div>
                    <div style={{fontSize:12,color:"var(--t2)"}}>{m.sub}</div>
                  </div>
                  <span style={{fontSize:20,color:"var(--t3)"}}>{m.icon}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Card details */}
          {pay==="card"&&(
            <div className="card cp">
              <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Card Details</div>
              <div className="flex fdc gap4">
                <div className="fg">
                  <label className="fl" style={{fontSize:11}}>CARDHOLDER NAME *</label>
                  <input className="fi" value={card.name} onChange={e=>setCard(c=>({...c,name:e.target.value}))} placeholder="Johnathan Doe"/>
                </div>
                <div className="fg">
                  <label className="fl" style={{fontSize:11}}>CARD NUMBER</label>
                  <div style={{position:"relative"}}>
                    <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:16}}>💳</span>
                    <input className={`fi${cardErr?" err":""}`} style={{paddingLeft:34}} value={card.num} onChange={e=>{setCard(c=>({...c,num:e.target.value}));setCardErr(false);}} placeholder="0000 0000 0000 0000"/>
                  </div>
                  {cardErr&&<div className="fe">Please enter a valid card number</div>}
                </div>
                <div className="g2">
                  <div className="fg">
                    <label className="fl" style={{fontSize:11}}>EXPIRY DATE *</label>
                    <input className="fi" value={card.exp} onChange={e=>setCard(c=>({...c,exp:e.target.value}))} placeholder="MM / YY"/>
                  </div>
                  <div className="fg">
                    <label className="fl" style={{fontSize:11}}>CVV *</label>
                    <input className="fi" value={card.cvv} onChange={e=>setCard(c=>({...c,cvv:e.target.value}))} placeholder="123"/>
                  </div>
                </div>
                <div style={{fontSize:11,color:"var(--t3)"}}>* Required Fields</div>
              </div>
            </div>
          )}
          {/* Billing address */}
          <div className="card cp">
            <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Billing Address</div>
            <div className="flex fdc gap4">
              <div className="fg">
                <label className="fl" style={{fontSize:11}}>STREET ADDRESS *</label>
                <input className="fi" value={addr.street} onChange={e=>setAddr(a=>({...a,street:e.target.value}))}/>
              </div>
              <div className="g2">
                <div className="fg">
                  <label className="fl" style={{fontSize:11}}>CITY</label>
                  <input className="fi" value={addr.city} onChange={e=>setAddr(a=>({...a,city:e.target.value}))}/>
                </div>
                <div className="fg">
                  <label className="fl" style={{fontSize:11}}>POSTAL CODE *</label>
                  <input className="fi" value={addr.postal} onChange={e=>setAddr(a=>({...a,postal:e.target.value}))}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right – Order Summary */}
        <div className="card cp" style={{alignSelf:"start",position:"sticky",top:20}}>
          <div style={{fontSize:17,fontWeight:700,marginBottom:16}}>Order Summary</div>
          {items.map(i=>(
            <div key={i.name} className="oi">
              <div className="oi-img"><img src={i.img} alt={i.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display='none';}}/></div>
              <div>
                <div className="oi-name">{i.name}</div>
                <div className="oi-var">{i.variant}</div>
                <div className="oi-pr">{i.price}</div>
              </div>
            </div>
          ))}
          <div className="mt3">
            <div className="ot-row"><span>Subtotal</span><span>$1,700.00</span></div>
            <div className="ot-row"><span>Shipping (Standard)</span><span>$45.00</span></div>
            <div className="ot-row"><span>Estimated Tax</span><span>$136.00</span></div>
            <div className="ot-total"><span>Total</span><span>$1,881.00</span></div>
          </div>
          <button className="btn btn-or btn-full btn-lg mt4" onClick={()=>{if(!card.num&&pay==="card"){setCardErr(true);return;}onNav("success");}}>
            🔒 Complete Purchase
          </button>
          <div style={{textAlign:"center",fontSize:11,color:"var(--t3)",marginTop:8}}>🛡 SSL Secured &amp; Encrypted Checkout</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 7 — PAYMENT SUCCESS
   ═══════════════════════════════════════════════════════════════════════════ */
function PaymentSuccess({ onNav }) {
  return (
    <div className="flex fdc" style={{minHeight:"100vh",background:"var(--cr)"}}>
      <div className="sw fin" style={{flex:1}}>
        <div className="s-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16l6 6 14-14" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="s-title">Payment Successful!</div>
        <div className="s-sub">
          Thank you for your order. We've sent a confirmation<br/>
          email to <strong>jane.desilva@comforta.com</strong>.
        </div>
        {/* Order card */}
        <div className="card" style={{width:"100%",maxWidth:540,overflow:"hidden",marginBottom:28}}>
          <div style={{display:"grid",gridTemplateColumns:"160px 1fr"}}>
            <div style={{background:"var(--cr)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
              <img
                src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200&q=80"
                alt="chair"
                style={{width:"100%",height:120,objectFit:"cover",borderRadius:"var(--r)"}}
                onError={e=>{e.target.style.display='none';}}
              />
            </div>
            <div style={{padding:22}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Order Summary</div>
              <div className="g2" style={{gap:12}}>
                {[["ORDER NUMBER","#ORD-8821",false,false],
                  ["ORDER DATE","October 24, 2023",false,false],
                  ["TOTAL AMOUNT","$1,240.00",true,false],
                  ["STATUS","Confirmed",false,true],
                ].map(([l,v,isOr,isGn])=>(
                  <div key={l}>
                    <div style={{fontSize:10,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:"var(--t3)",marginBottom:4}}>{l}</div>
                    {isGn
                      ? <span className="bdg bdg-gn">{v}</span>
                      : <div style={{fontSize:14,fontWeight:700,color:isOr?"var(--or)":"var(--tx)"}}>{v}</div>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex ic gap3">
          <button className="btn btn-or btn-lg" onClick={()=>onNav("mydesigns")}>📦 Track Order</button>
          <button className="btn btn-out btn-lg" onClick={()=>onNav("dashboard")}>🏠 Return to Dashboard</button>
        </div>
        <div style={{fontSize:12,color:"var(--t3)",marginTop:10}}>A confirmation email has been sent to your registered email address.</div>
        <div style={{fontSize:13,color:"var(--t2)",marginTop:14}}>
          Need help with your order? <span style={{color:"var(--or)",fontWeight:600,cursor:"pointer"}}>Contact Customer Support</span>
        </div>
      </div>
      <div style={{background:"var(--wh)",borderTop:"1px solid var(--bd)",padding:"16px 40px",textAlign:"center",fontSize:12,color:"var(--t3)"}}>
        © 2023 Comforta Furniture Studio. All rights reserved. Scandinavian Design, Global Comfort.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 8 — PROJECT EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */
function ProjectExport({ onBackTo3D }) {
  const [fmt,setFmt]=useState("pdf");
  const [chk,setChk]=useState({dims:true,pricing:false,mats:true,notes:true});
  const [exportMsg,setExportMsg]=useState("");

  const project = {
    name: "Scandinavian Minimalist Loft",
    client: "Robert Chen",
    previewImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=80",
    dimensions: "Living room footprint: 6.8m x 4.2m\nCeiling height: 2.9m\nPrimary seating zone: 3.2m x 2.4m",
    pricing: [
      ["Nordic Lounge Sofa", "$1,250.00"],
      ["Solid Oak Coffee Table", "$450.00"],
      ["Accent Chair Pair", "$780.00"],
      ["Styling + Delivery", "$320.00"],
    ],
    materials: [
      "White oak flooring with matte finish",
      "Warm limestone paint finish on main walls",
      "Wool-blend upholstery in sand beige",
      "Brushed brass lighting accents",
    ],
    notes: [
      "Prioritise natural light and clean circulation through the centre of the room.",
      "Client requested a calm Scandinavian palette with warmer wood tones.",
      "Render set includes perspective, elevation, and styling close-up views.",
    ],
  };

  function selectedSections() {
    const sections = [];
    if (chk.dims) sections.push({ title: "Dimensions", content: project.dimensions });
    if (chk.pricing) sections.push({ title: "Pricing Information", content: project.pricing.map(([item, price]) => `${item}: ${price}`).join("\n") });
    if (chk.mats) sections.push({ title: "Materials & Textures", content: project.materials.join("\n") });
    if (chk.notes) sections.push({ title: "Designer Notes", content: project.notes.join("\n") });
    return sections;
  }

  function downloadBlob(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleGenerateDownload() {
    const sections = selectedSections();
    const baseName = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (fmt === "pdf") {
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      let y = 56;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text(project.name, 40, y);
      y += 24;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text(`Client: ${project.client}`, 40, y);
      y += 28;
      sections.forEach((section) => {
        if (y > 740) {
          pdf.addPage();
          y = 56;
        }
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.text(section.title, 40, y);
        y += 18;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        const lines = pdf.splitTextToSize(section.content, 515);
        pdf.text(lines, 40, y);
        y += lines.length * 14 + 18;
      });
      pdf.save(`${baseName}.pdf`);
      setExportMsg("PDF presentation downloaded.");
      return;
    }

    if (fmt === "hires") {
      const link = document.createElement("a");
      link.href = project.previewImage;
      link.download = `${baseName}-render.jpg`;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.click();
      setExportMsg("Hi-res render download started.");
      return;
    }

    if (fmt === "csv") {
      const csvRows = [
        ["Section", "Value"],
        ...sections.flatMap((section) =>
          section.content.split("\n").map((line) => [section.title, line])
        ),
      ];
      const csvContent = csvRows
        .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
        .join("\n");
      downloadBlob(csvContent, `${baseName}-inventory.csv`, "text/csv;charset=utf-8");
      setExportMsg("CSV inventory downloaded.");
      return;
    }

    const objContent = [
      `# ${project.name}`,
      `# Client: ${project.client}`,
      ...sections.map((section) => `# ${section.title}: ${section.content.replaceAll("\n", " | ")}`),
      "o comforta_room",
      "v 0.0 0.0 0.0",
      "v 6.8 0.0 0.0",
      "v 6.8 0.0 4.2",
      "v 0.0 0.0 4.2",
      "f 1 2 3 4",
    ].join("\n");
    downloadBlob(objContent, `${baseName}-model.obj`, "model/obj");
    setExportMsg("3D model data downloaded.");
  }

  const formats=[
    {id:"pdf",   label:"Presentation (PDF)", sub:"Ready for review",  icon:"📄"},
    {id:"hires", label:"Hi-Res Render",       sub:"4K PNG/JPG",        icon:"🖼"},
    {id:"csv",   label:"Inventory List",      sub:"Detailed CSV",      icon:"📋"},
    {id:"model", label:"3D Model Data",        sub:"OBJ / SKP",         icon:"🧊"},
  ];

  return (
    <div className="pc fin">
      <div className="ph">
        <div>
          <div className="pt">Project Export</div>
          <div className="ps">Finalize and download your project assets</div>
        </div>
        <div className="flex fdc" style={{alignItems:"flex-end",gap:8}}>
          <button className="btn btn-out btn-lg" onClick={() => onBackTo3D ? onBackTo3D() : null}>← Back to 3D View</button>
          <button className="btn btn-or btn-lg" onClick={handleGenerateDownload}>⬇ Generate &amp; Download</button>
          {exportMsg ? <div style={{fontSize:12,color:"var(--t2)"}}>{exportMsg}</div> : null}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 350px",gap:24}}>
        {/* Left */}
        <div className="flex fdc gap5">
          {/* Summary */}
          <div className="card cp">
            <div className="flex ic jb mb3">
              <div style={{fontSize:15,fontWeight:700}}>Project Summary</div>
              <span style={{color:"var(--t3)",cursor:"pointer",fontSize:16}}>ⓘ</span>
            </div>
            <div style={{fontSize:22,fontWeight:800,color:"var(--tx)",marginBottom:4}}>Scandinavian Minimalist Loft</div>
            <div style={{fontSize:14,color:"var(--or)"}}>Client: Robert Chen</div>
          </div>
          {/* Export Format */}
          <div className="card cp">
            <div style={{fontSize:15,fontWeight:700,marginBottom:16}}>Export Format</div>
            <div className="g2">
              {formats.map(f=>(
                <div key={f.id} className={`ef${fmt===f.id?" on":""}`} onClick={()=>setFmt(f.id)}>
                  <div className="ef-icon" style={{background:fmt===f.id?"var(--or)":"var(--cr)"}}>{f.icon}</div>
                  <div>
                    <div className="ef-name">{f.label}</div>
                    <div className="ef-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Checklist */}
          <div className="card cp">
            <div style={{fontSize:15,fontWeight:700,marginBottom:16}}>Content Checklist</div>
            <div className="g2" style={{gap:14}}>
              {[["dims","Dimensions"],["pricing","Pricing Information"],["mats","Materials & Textures"],["notes","Designer Notes"]].map(([k,l])=>(
                <div key={k} className="flex ic gap3" style={{cursor:"pointer"}} onClick={()=>setChk(c=>({...c,[k]:!c[k]}))}>
                  <div className={`chk${chk[k]?" on":""}`}/>
                  <span style={{fontSize:14}}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Pro tip */}
          <div className="pro-tip">
            <span style={{fontSize:18,flexShrink:0,marginTop:1}}>💡</span>
            <p><strong>Pro Tip:</strong> Exporting as PDF will automatically include high-resolution renders for all key perspective points defined in your scene.</p>
          </div>
        </div>
        {/* Right: preview */}
        <div className="card cp" style={{alignSelf:"start"}}>
          <div className="flex ic jb mb4">
            <div style={{fontSize:15,fontWeight:700}}>Design Preview</div>
            <div className="flex ic gap3" style={{color:"var(--t2)"}}>
              <span style={{cursor:"pointer",fontSize:16}}>🔍</span>
              <span style={{cursor:"pointer",fontSize:16}}>🔄</span>
            </div>
          </div>
          <div style={{borderRadius:"var(--r2)",overflow:"hidden",marginBottom:16,position:"relative"}}>
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=80"
              alt="preview"
              style={{width:"100%",height:220,objectFit:"cover",display:"block"}}
              onError={e=>{e.target.style.display='none';}}
            />
            <div style={{position:"absolute",bottom:8,left:8,display:"flex",gap:6}}>
              <span style={{padding:"3px 10px",background:"rgba(0,0,0,0.55)",borderRadius:20,fontSize:9,fontWeight:700,letterSpacing:".1em",color:"#fff",textTransform:"uppercase"}}>PERSPECTIVE VIEW</span>
              <span className="bdg bdg-or">SELECTED</span>
            </div>
          </div>
          {[["Resolution","3840 × 2160 (4K)"],["File Size Approx.","24.5 MB"],["Last Modified","Today, 10:45 AM"]].map(([l,v])=>(
            <div key={l} className="flex jb mt3" style={{fontSize:13}}>
              <span style={{color:"var(--t2)"}}>{l}</span>
              <span style={{fontWeight:600,color:"var(--tx)"}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 9 — SETTINGS
   ═══════════════════════════════════════════════════════════════════════════ */
function Settings() {
  const [unit,setUnit]=useState("metric");
  const [theme,setTheme]=useState("light");
  const [twoFA,setTwoFA]=useState(true);
  const [nf,setNf]=useState({pe:true,pp:true,se:true,sp:false});
  return (
    <div className="pc fin">
      <div className="ph">
        <div>
          <div className="pt">Settings</div>
          <div className="ps">Manage your profile, security, and application preferences</div>
        </div>
      </div>
      {/* Profile */}
      <div className="ss">
        <div className="ss-title">
          Profile Settings
          <span style={{fontSize:13,fontWeight:600,color:"var(--or)",cursor:"pointer"}}>Edit Profile</span>
        </div>
        <div className="flex ic gap5">
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#d4906a,#a06840)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,overflow:"hidden"}}>👩</div>
            <div style={{position:"absolute",bottom:0,right:0,width:22,height:22,borderRadius:"50%",background:"var(--or)",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>✏</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:28,flex:1}}>
            {[["FULL NAME","Jane De Silva"],["ROLE","Senior Designer"],["EMAIL ADDRESS","jane.desilva@comforta.com"]].map(([l,v])=>(
              <div key={l}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:".08em",color:"var(--t3)",marginBottom:5}}>{l}</div>
                <div style={{fontSize:14,fontWeight:500,color:"var(--tx)"}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Security */}
      <div className="ss">
        <div className="ss-title">Account Security</div>
        <div className="g2 mb5">
          <div className="fg"><label className="fl">New Password</label><input className="fi" type="password" defaultValue="••••••••"/></div>
          <div className="fg"><label className="fl">Confirm Password</label><input className="fi" type="password" defaultValue="••••••••"/></div>
        </div>
        <div className="flex ic gap3" style={{padding:"14px 0",borderTop:"1px solid var(--bd)"}}>
          <div style={{width:36,height:36,borderRadius:"var(--r)",background:"var(--or-l)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>🛡</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600}}>Two-factor authentication</div>
            <div style={{fontSize:12,color:"var(--t2)"}}>Add an extra layer of security to your account</div>
          </div>
          <button className={`tog${twoFA?" on":""}`} onClick={()=>setTwoFA(t=>!t)}/>
        </div>
      </div>
      {/* Preferences */}
      <div className="ss">
        <div className="ss-title">Application Preferences</div>
        <div className="g2 mb5">
          <div className="fg">
            <label className="fl">Language</label>
            <div style={{position:"relative"}}>
              <select className="fi" style={{appearance:"none",paddingRight:32}}>
                <option>English (US)</option>
                <option>English (UK)</option>
              </select>
              <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--t3)"}}>▾</span>
            </div>
          </div>
          <div className="fg">
            <label className="fl">Units of Measurement</label>
            <div className="units">
              <button className={`ub${unit==="metric"?" on":""}`} onClick={()=>setUnit("metric")}>Metric (cm, m)</button>
              <button className={`ub${unit==="imperial"?" on":""}`} onClick={()=>setUnit("imperial")}>Imperial (in, ft)</button>
            </div>
          </div>
        </div>
        <div className="fg">
          <label className="fl mb2">Theme Mode</label>
          <div className="flex ic gap3 mt2">
            <button className={`thb${theme==="light"?" on":""}`} onClick={()=>setTheme("light")}>☀️ Light</button>
            <button className={`thb${theme==="dark"?" on":""}`} onClick={()=>setTheme("dark")}>🌙 Dark</button>
          </div>
        </div>
      </div>
      {/* Notifications */}
      <div className="ss">
        <div className="ss-title">Notifications</div>
        {[{t:"Project Updates",s:"Get notified when there's activity on your shared designs",ek:"pe",pk:"pp"},
          {t:"System Alerts",s:"Security warnings and system maintenance notifications",ek:"se",pk:"sp"}
        ].map(n=>(
          <div key={n.t} className="notif-row">
            <div>
              <div className="notif-title">{n.t}</div>
              <div className="notif-sub">{n.s}</div>
            </div>
            <div className="notif-chks">
              <div className="nc-item"><div className={`chk${nf[n.ek]?" on":""}`} onClick={()=>setNf(s=>({...s,[n.ek]:!s[n.ek]}))}/> Email</div>
              <div className="nc-item"><div className={`chk${nf[n.pk]?" on":""}`} onClick={()=>setNf(s=>({...s,[n.pk]:!s[n.pk]}))}/> Push</div>
            </div>
          </div>
        ))}
      </div>
      {/* Actions */}
      <div className="flex ic jb" style={{paddingTop:8}}>
        <div/>
        <div className="flex ic gap3">
          <button className="btn btn-out btn-lg">Cancel</button>
          <button className="btn btn-or btn-lg">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT US PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT US PAGE  — Blog + Newsletter + Contact Us
   ═══════════════════════════════════════════════════════════════════════════ */
function AboutUs({ onNav }) {
  const [email, setEmail]     = useState("");
  const [subDone, setSubDone] = useState(false);
  const [form, setForm]       = useState({ name:"", email:"", message:"" });
  const [sent, setSent]       = useState(false);

  const blogs = [
    {
      tag:  "INTERIOR DESIGN",
      tagColor: "#F5A623",
      title: "Choosing the Right Chair for Your Home",
      desc:  "Learn how to pick the perfect seating for any room with our comprehensive ergonomic guide.",
      img:   imageShadow1Img,
    },
    {
      tag:  "LIFE & STYLE",
      tagColor: "#F5A623",
      title: "Comfort & Style: Finding the Balance",
      desc:  "Expert tips on blending ergonomics with aesthetic appeal to create a space you love living in.",
      img:   imageShadow2Img,
    },
    {
      tag:  "TRENDS",
      tagColor: "#F5A623",
      title: "Furniture Trends for Modern Living",
      desc:  "Discover the latest styles in contemporary furniture and how to integrate them into your home.",
      img:   imageShadowImg,
    },
  ];

  function handleSub() {
    if (!email) return;
    setSubDone(true);
  }

  function handleSend() {
    if (!form.name || !form.email) return;
    setSent(true);
  }

  return (
    <div style={{ background: "#FFFFFF", fontFamily: "'Inter', sans-serif", color: "#1A1A1A" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 40px", height: 60, display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => onNav && onNav("login")}
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

      <section style={{
        background: "#F5F0E2",
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
        padding: "0 6vw",
        gap: "6vw",
        overflow: "hidden",
      }}>
        <div style={{ flex: "0 0 48%", maxWidth: 680 }}>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>
            <img
              src={overlayShadowImg}
              alt="Comforta living room"
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
              onError={e => {
                e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85";
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontSize: "clamp(48px, 6.5vw, 88px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            marginBottom: 28,
          }}>
            <span style={{ color: "#000000", display: "block" }}>Thoughtfully</span>
            <span style={{ color: "#000000", display: "block" }}>designed.</span>
            <span style={{ color: "#F5A623", display: "block", marginTop: 8 }}>Crafted for</span>
            <span style={{ color: "#F5A623", display: "block" }}>comfort.</span>
          </h1>

          <p style={{
            fontSize: "clamp(14px, 1.1vw, 17px)",
            color: "#374151",
            lineHeight: 1.75,
            maxWidth: 520,
          }}>
            At Comforta, we believe that your home should be a reflection of your
            unique personality and a sanctuary of comfort. Our journey began
            with a simple idea: that high-end design should feel as good as it looks.
          </p>
        </div>
      </section>

      <section style={{ padding: "64px 40px 72px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 38, fontWeight: 800, color: "#0D0D0D", marginBottom: 6, lineHeight: 1.1 }}>OUR BLOG</h2>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 40, lineHeight: 1.6 }}>
          Ideas &amp; inspiration for creating warm, comfortable living spaces.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
          {blogs.map((b, i) => (
            <div key={i} style={{ cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.querySelector("img").style.transform = "scale(1.04)"}
              onMouseLeave={e => e.currentTarget.querySelector("img").style.transform = "scale(1)"}
            >
              <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 18, height: 195 }}>
                <img
                  src={b.img} alt={b.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .35s ease" }}
                  onError={e => { e.target.style.background = "#E5E7EB"; e.target.style.display = "block"; }}
                />
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: b.tagColor, marginBottom: 8 }}>{b.tag}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#0D0D0D", marginBottom: 10, lineHeight: 1.35 }}>{b.title}</div>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65, marginBottom: 14 }}>{b.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "#F5A623", cursor: "pointer" }}>
                Read More
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="#F5A623" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#FEF3E2", padding: "56px 40px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h3 style={{ fontSize: 26, fontWeight: 800, color: "#0D0D0D", marginBottom: 12, lineHeight: 1.25 }}>
            Join our design community
          </h3>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 28 }}>
            Get the latest design tips, exclusive offers, and behind-the-scenes stories delivered to your inbox every week.
          </p>

          {subDone ? (
            <div style={{ padding: "14px 28px", background: "#DCFCE7", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#16A34A" }}>
              ✓ You are subscribed! Welcome to the community.
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, maxWidth: 420, margin: "0 auto 14px" }}>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{ flex: 1, padding: "12px 16px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff", color: "#1A1A1A" }}
                  onFocus={e => e.target.style.borderColor = "#F5A623"}
                  onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                  onKeyDown={e => e.key === "Enter" && handleSub()}
                />
                <button
                  onClick={handleSub}
                  style={{ padding: "12px 22px", background: "#F5A623", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#DC9018"}
                  onMouseLeave={e => e.currentTarget.style.background = "#F5A623"}
                >
                  Subscribe
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#9CA3AF" }}>We respect your privacy. Unsubscribe at any time.</p>
            </>
          )}
        </div>
      </section>

      <section style={{ background: "#FAF7F0", padding: "72px 40px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#0D0D0D", letterSpacing: ".04em", marginBottom: 12 }}>CONTACT US</h2>
          <div style={{ width: 48, height: 3, background: "#F5A623", borderRadius: 2, margin: "0 auto 18px" }} />
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            Experience the harmony of Scandinavian design. Reach out to us for bespoke furniture solutions or any inquiries.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, maxWidth: 1100, margin: "0 auto", alignItems: "start" }}>
          <div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 7 }}>Name</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Enter your full name"
                style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff", color: "#1A1A1A", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#F5A623"}
                onBlur={e => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 7 }}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="name@example.com"
                style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff", color: "#1A1A1A", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#F5A623"}
                onBlur={e => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 7 }}>Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Questions, ideas, or support needed? Our team is here for you."
                rows={5}
                style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E5E7EB", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff", color: "#1A1A1A", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#F5A623"}
                onBlur={e => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>

            {sent ? (
              <div style={{ padding: "13px", background: "#DCFCE7", borderRadius: 7, fontSize: 14, fontWeight: 600, color: "#16A34A", textAlign: "center" }}>
                ✓ Message sent! We will get back to you soon.
              </div>
            ) : (
              <button
                onClick={handleSend}
                style={{ width: "100%", padding: "13px", background: "#F5A623", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#DC9018"}
                onMouseLeave={e => e.currentTarget.style.background = "#F5A623"}
              >
                Send Message
              </button>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 36, paddingTop: 28, borderTop: "1px solid #E5E7EB" }}>
              {[
                ["EMAIL US",   "hello@comforta.com"],
                ["CALL US",    "011-1001090"],
                ["VISIT US",   "5A, Colombo,\nSri Lanka"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: "#9CA3AF", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.5, whiteSpace: "pre-line" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 14, overflow: "hidden", height: 480 }}>
            <img
              src={imageColumnImg}
              alt="Comforta showroom"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={e => { e.target.style.background = "#E5E7EB"; }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
function LoginPage({ onNav, onTrackOrder }) {
  const [tab,setTab]=useState("customer");
  const [orderNum,setOrderNum]=useState("");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");

  return (
    <div style={{minHeight:"100vh",background:"var(--cr)",display:"flex",flexDirection:"column"}}>
      {/* header */}
      <div style={{padding:"20px 40px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:38,height:38,background:"#fff",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
          <img src={logoImg} alt="Comforta logo" style={{width:"100%",height:"100%",objectFit:"contain"}} />
        </div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"var(--tx)"}}>Comforta</div>
          <div style={{fontSize:9,fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:"var(--t3)"}}>Studio Library</div>
        </div>
      </div>
      <div style={{textAlign:"center",padding:"8px 20px 0"}}>
        <h1 style={{fontSize:28,fontWeight:800,color:"var(--tx)"}}>Login to your account</h1>
      </div>
      {/* tab */}
      <div style={{display:"flex",justifyContent:"center",margin:"22px 0 0"}}>
        <div style={{display:"flex",background:"#EDE8DE",borderRadius:10,padding:4,gap:4}}>
          {[["customer","Customer"],["staff","Staff(Designer)"]].map(([id,label])=>(
            <button key={id} onClick={()=>{setTab(id);setErr("");}}
              style={{padding:"10px 32px",borderRadius:8,border:"none",background:tab===id?"#fff":"transparent",color:tab===id?"var(--tx)":"var(--t2)",fontWeight:tab===id?700:400,fontSize:14,fontFamily:"inherit",cursor:"pointer",boxShadow:tab===id?"0 1px 4px rgba(0,0,0,0.10)":"none",transition:"all .18s"}}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* card */}
      <div style={{display:"flex",justifyContent:"center",padding:"22px 20px 0"}}>
        <div style={{background:"#fff",borderRadius:16,boxShadow:"0 4px 24px rgba(0,0,0,0.08)",width:"100%",maxWidth:800,display:"grid",gridTemplateColumns:"1fr 1fr",overflow:"hidden"}}>
          {/* customer left */}
          <div style={{padding:36,borderRight:"1px solid var(--bd)"}}>
            <div style={{width:46,height:46,borderRadius:"50%",background:"#EAF2FB",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18,fontSize:22}}>🚚</div>
            <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>Track &amp; Review Your Order</div>
            <div style={{fontSize:13,color:"var(--t2)",lineHeight:1.6,marginBottom:24}}>Enter your order number to see shipping status and order history.</div>
            <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Order Number</div>
            <div style={{position:"relative",marginBottom:18}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--t3)"}}>🔑</span>
              <input value={orderNum} onChange={e=>{setOrderNum(e.target.value);setErr("");}} placeholder="e.g. CF-123456"
                className="fi" style={{paddingLeft:36}}
                onFocus={e=>e.target.style.borderColor="var(--or)"}
                onBlur={e=>e.target.style.borderColor="var(--b2)"}/>
            </div>
            <button className="btn btn-or btn-full btn-lg" onClick={()=>{if(!orderNum){setErr("Enter order number");return;}onTrackOrder(orderNum);onNav("vizfeedback");}}>
              View Order →
            </button>
            <div style={{textAlign:"center",marginTop:14,fontSize:13,color:"var(--t2)"}}>
              Can't find your order number? <span style={{color:"var(--or)",fontWeight:600,cursor:"pointer"}}>Check your email</span>
            </div>
          </div>
          {/* staff right */}
          <div style={{padding:36}}>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:7}}>Staff Email/ Username <span style={{color:"#E53935"}}>*</span></label>
              <input className="fi" type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}
                onFocus={e=>e.target.style.borderColor="var(--or)"}
                onBlur={e=>e.target.style.borderColor="var(--b2)"}/>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:7}}>Password <span style={{color:"#E53935"}}>*</span></label>
              <input className="fi" type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}}
                onFocus={e=>e.target.style.borderColor="var(--or)"}
                onBlur={e=>e.target.style.borderColor="var(--b2)"}/>
              <div style={{fontSize:11,color:"var(--t3)",marginTop:5}}>Staff access only. Please sign in with authorized credentials.</div>
            </div>
            {err&&<div style={{fontSize:12,color:"#E53935",marginBottom:12}}>{err}</div>}
            <button className="btn btn-or btn-full btn-lg" style={{marginBottom:10}} onClick={()=>{if(!email||!pass){setErr("Fill in all fields");return;}onNav("login-success");}}>Sign In</button>
            <div style={{fontSize:11,color:"var(--t3)",textAlign:"center",marginBottom:14}}>* Required Fields</div>
            <div style={{fontSize:13,color:"var(--t2)",textAlign:"center"}}>
              Don't you have an account? <span style={{color:"var(--or)",fontWeight:600,cursor:"pointer"}} onClick={()=>onNav("createaccount")}>Create an Account</span>
            </div>
          </div>
        </div>
      </div>
      {/* hero image */}
      <div style={{marginTop:28,height:280,overflow:"hidden",position:"relative",flexShrink:0}}>
        <img src={rectangle4280Img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 40%"}}/>
        <div style={{position:"absolute",inset:0}}/>
      </div>
      <Footer/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGIN SUCCESS PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
function LoginSuccess({ onNav }) {
  return (
    <div style={{minHeight:"100vh",background:"var(--cr)",display:"flex",flexDirection:"column"}}>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
        <div style={{background:"#fff",border:"1.5px dashed #A0C4D8",borderRadius:16,padding:"40px 48px",maxWidth:460,width:"100%",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10,marginBottom:22}}>
            <div style={{width:38,height:38,background:"#fff",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
              <img src={logoImg} alt="Comforta logo" style={{width:"100%",height:"100%",objectFit:"contain"}} />
            </div>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:14,fontWeight:700}}>Comforta</div>
              <div style={{fontSize:9,fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:"var(--t3)"}}>Studio Library</div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:18}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"#DCFCE7",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="#22C55E" strokeWidth="2"/><path d="M9 16l4.5 4.5L23 11" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <div style={{fontSize:24,fontWeight:800,marginBottom:8}}>Welcome back!</div>
          <div style={{fontSize:15,color:"var(--t2)",marginBottom:28}}>You have successfully logged in.</div>
          <button className="btn btn-or btn-full btn-lg" style={{borderRadius:10,marginBottom:14,justifyContent:"center"}} onClick={()=>onNav("newproject")}>Create Project</button>
          <div style={{fontSize:13,color:"var(--t3)",cursor:"pointer"}} onClick={()=>onNav("settings")}>View profile settings</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:26}}>
            <img src={image1ParenImg} alt="" style={{width:"100%",height:120,objectFit:"cover",borderRadius:8}}/>
            <img src={image2ParenImg} alt="" style={{width:"100%",height:120,objectFit:"cover",borderRadius:8}}/>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NEW PROJECT — STEP 1
   ═══════════════════════════════════════════════════════════════════════════ */
function NewProjectStep1({ onNav }) {
  const [data,setData]=useState({projectName:"",clientName:"",roomType:"",vision:""});
  return (
    <div style={{display:"flex",height:"100vh"}}>
      <Sidebar active="newproject" onNav={onNav}/>
      <div className="main">
        <div className="pc fin">
          <div className="pt mb2">Start New Project</div>
          <div className="ps mb5">Transform your vision into a beautiful living space.</div>
          {/* progress */}
          <div className="card cp mb5">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--or)"}}>Step 1 of 3</div>
              <div style={{fontSize:12,color:"var(--t2)"}}>Project Details</div>
            </div>
            <div style={{height:6,background:"#EDE8DE",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:"33%",background:"var(--or)",borderRadius:3}}/>
            </div>
          </div>
          {/* form */}
          <div className="card cp mb5">
            <div className="g2 mb4">
              <div className="fg">
                <label className="fl">Project Name</label>
                <input className="fi" style={{borderRadius:50}} placeholder="e.g. Scandinavian Minimalist Loft" value={data.projectName} onChange={e=>setData(d=>({...d,projectName:e.target.value}))}/>
              </div>
              <div className="fg">
                <label className="fl">Client Name</label>
                <input className="fi" style={{borderRadius:50}} placeholder="e.g. Robert Chen" value={data.clientName} onChange={e=>setData(d=>({...d,clientName:e.target.value}))}/>
              </div>
            </div>
            <div className="fg mb4">
              <label className="fl">Room Type</label>
              <div style={{position:"relative"}}>
                <select className="fi" style={{borderRadius:50,appearance:"none",paddingRight:32}} value={data.roomType} onChange={e=>setData(d=>({...d,roomType:e.target.value}))}>
                  <option value="">Select a room type...</option>
                  {["Living Room","Bedroom","Dining Room","Home Office","Guest Room","Kitchen"].map(r=><option key={r}>{r}</option>)}
                </select>
                <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--t3)"}}>▾</span>
              </div>
            </div>
            <div className="fg mb5">
              <label className="fl">Initial Project Vision (Optional)</label>
              <textarea className="fi" style={{borderRadius:12,resize:"vertical",minHeight:120,lineHeight:1.6}} placeholder="Describe the overall aesthetic or specific requirements..." value={data.vision} onChange={e=>setData(d=>({...d,vision:e.target.value}))}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <button className="btn btn-out btn-lg" onClick={()=>onNav("login-success")}>← Back</button>
              <button className="btn btn-or btn-lg" onClick={()=>onNav("step2")}>Next Step →</button>
            </div>
          </div>
          {/* inspo photos */}
          <div className="g3" style={{gap:12}}>
            {[decorativeElementImg,decorativeElementImg,decorativeElementImg].map((src,i)=>(
              <img key={i} src={src} alt="" style={{width:"100%",height:110,objectFit:"cover",borderRadius:10,display:"block"}} onError={e=>{e.target.style.display="none";}}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NEW PROJECT — STEP 2
   ═══════════════════════════════════════════════════════════════════════════ */
const SHAPES=[
  {id:"L",     label:"L-Shape",     desc:"Ideal for corner living rooms and kitchens"},
  {id:"open",  label:"Open Plan",   desc:"Spacious layout combining multiple living areas"},
  {id:"rect",  label:"Rectangular", desc:"Classic shape for bedrooms and dining rooms"},
  {id:"square",label:"Square",      desc:"Perfect symmetry for offices and small rooms"},
];
function ShapeIcon({id}){
  const s={width:60,height:60,viewBox:"0 0 60 60",fill:"none"};
  if(id==="L") return <svg {...s}><rect x="8" y="8" width="22" height="44" rx="2" fill="#EDE8DE" stroke="#B0A898" strokeWidth="1.5"/><rect x="8" y="31" width="44" height="21" rx="2" fill="#EDE8DE" stroke="#B0A898" strokeWidth="1.5"/></svg>;
  if(id==="open") return <svg {...s}><rect x="8" y="8" width="44" height="44" rx="2" fill="#EDE8DE" stroke="#B0A898" strokeWidth="1.5"/><line x1="30" y1="8" x2="30" y2="52" stroke="#B0A898" strokeWidth="1.5" strokeDasharray="3,2"/></svg>;
  if(id==="rect") return <svg {...s}><rect x="8" y="16" width="44" height="28" rx="2" fill="#EDE8DE" stroke="#B0A898" strokeWidth="1.5"/></svg>;
  return <svg {...s}><rect x="10" y="10" width="40" height="40" rx="2" fill="#EDE8DE" stroke="#B0A898" strokeWidth="1.5"/></svg>;
}
function NewProjectStep2({ onNav }) {
  const [sel,setSel]=useState("");
  return (
    <div style={{display:"flex",height:"100vh"}}>
      <Sidebar active="library" onNav={onNav}/>
      <div className="main">
        <div className="pc fin">
          <div className="pt mb2">Start New Project</div>
          <div className="ps mb5">Transform your vision into a beautiful living space.</div>
          {/* progress */}
          <div className="card cp mb5">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--or)"}}>Step 2 of 3 · Choose Layout</div>
              <div style={{fontSize:12,color:"var(--t2)"}}>66% Complete</div>
            </div>
            <div style={{height:6,background:"#EDE8DE",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:"66%",background:"var(--or)",borderRadius:3,transition:"width .4s"}}/>
            </div>
          </div>
          <div style={{fontSize:18,fontWeight:700,marginBottom:18}}>Select Room Shape</div>
          <div className="g4 mb5">
            {SHAPES.map(sh=>{
              const on=sel===sh.id;
              return (
                <div key={sh.id} onClick={()=>setSel(sh.id)} style={{background:"#fff",borderRadius:12,padding:22,border:on?"2px solid var(--or)":"1.5px solid var(--bd)",cursor:"pointer",transition:"all .18s",boxShadow:on?"0 4px 20px rgba(245,166,35,.15)":"0 1px 4px rgba(0,0,0,.05)",position:"relative"}}>
                  {on&&<div style={{position:"absolute",top:10,right:10,width:22,height:22,borderRadius:"50%",background:"var(--or)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5L10 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>}
                  <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><ShapeIcon id={sh.id}/></div>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:5}}>{sh.label}</div>
                  <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.5,marginBottom:14}}>{sh.desc}</div>
                  <button style={{width:"100%",padding:"9px",borderRadius:50,border:on?"1.5px solid var(--or)":"1.5px solid var(--bd)",background:on?"var(--or)":"#fff",color:on?"#fff":"var(--tx)",fontSize:13,fontWeight:600,fontFamily:"inherit",cursor:"pointer"}}>
                    {on?"Selected":"Select"}
                  </button>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <button className="btn btn-out btn-lg" onClick={()=>onNav("newproject")}>← Back</button>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              {sel&&<span style={{fontSize:13,color:"var(--t2)"}}>You've selected "{SHAPES.find(s=>s.id===sel)?.label}"</span>}
              <button className="btn btn-or btn-lg" onClick={()=>onNav("step3")} disabled={!sel} style={{opacity:sel?1:.5}}>Next Step →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NEW PROJECT — STEP 3 (Furniture Selection)
   ═══════════════════════════════════════════════════════════════════════════ */
const FURN_ITEMS=[
  {id:1,name:"Nordic Minimalist Sofa",series:"Scandinavian Series",price:1200,cat:"Seating", img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",added:true},
  {id:2,name:"Executive Oak Desk",    series:"Office Essentials",  price:850, cat:"Tables",  img:"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80",added:false},
  {id:3,name:"Modern Floor Lamp",     series:"Lumiere Collection", price:240, cat:"Lighting",img:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",added:true},
  {id:4,name:"Marble Coffee Table",   series:"Elegance Series",    price:560, cat:"Tables",  img:"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80",added:false},
  {id:5,name:"Ergonomic Task Chair",  series:"Office Essentials",  price:320, cat:"Seating", img:"https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80",added:false},
  {id:6,name:"Walnut Sideboard",      series:"Scandinavian Series",price:980, cat:"Storage", img:"https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80",added:false},
];
function NewProjectStep3({ onNav }) {
  const [items,setItems]=useState(FURN_ITEMS);
  const [search,setSearch]=useState("");
  const [cat,setCat]=useState("All");
  const cats=["All","Seating","Tables","Storage","Lighting"];
  const added=items.filter(i=>i.added);
  const total=added.reduce((s,i)=>s+i.price,0);
  const filtered=items.filter(i=>(cat==="All"||i.cat===cat)&&(i.name.toLowerCase().includes(search.toLowerCase())));
  function toggle(id){setItems(p=>p.map(i=>i.id===id?{...i,added:!i.added}:i));}
  return (
    <div style={{display:"flex",height:"100vh"}}>
      <Sidebar active="newproject" onNav={onNav}/>
      <div className="main" style={{paddingBottom:90}}>
        <div className="pc fin" style={{paddingBottom:0}}>
          <div className="pt mb2">Start New Project</div>
          <div className="ps mb4">Transform your vision into a beautiful living space.</div>
          <div className="card cp mb4">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--or)"}}>Step 3 of 3: Furniture Selection</div>
              <div style={{fontSize:12,color:"var(--t2)"}}>100% complete</div>
            </div>
            <div style={{height:6,background:"#EDE8DE",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:"100%",background:"var(--or)",borderRadius:3}}/>
            </div>
          </div>
          {/* search + filters */}
          <div style={{display:"flex",gap:12,marginBottom:22,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{position:"relative",flex:1,maxWidth:300}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"var(--t3)"}}>🔍</span>
              <input className="fi" style={{paddingLeft:38,borderRadius:50}} placeholder="Search furniture library..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              {cats.map(c=>(
                <button key={c} onClick={()=>setCat(c)} style={{padding:"9px 20px",borderRadius:50,border:c===cat?"1.5px solid var(--or)":"1.5px solid var(--bd)",background:c===cat?"var(--or)":"#fff",color:c===cat?"#fff":"var(--tx)",fontSize:13,fontWeight:600,fontFamily:"inherit",cursor:"pointer",transition:"all .15s"}}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {/* grid */}
          <div className="g3" style={{paddingBottom:20}}>
            {filtered.map(item=>(
              <div key={item.id} style={{background:"#fff",borderRadius:14,overflow:"hidden",border:item.added?"2px solid var(--or)":"1.5px solid var(--bd)",transition:"all .18s",position:"relative",boxShadow:item.added?"0 4px 20px rgba(245,166,35,.12)":"0 1px 6px rgba(0,0,0,.05)"}}>
                {item.added&&<div style={{position:"absolute",top:10,right:10,width:26,height:26,borderRadius:"50%",background:"var(--or)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3L11 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>}
                <div style={{height:175,overflow:"hidden",background:"var(--cr)"}}>
                  <img src={item.img} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .3s"}} onMouseEnter={e=>e.target.style.transform="scale(1.04)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} onError={e=>{e.target.style.display="none";}}/>
                </div>
                <div style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                    <div style={{fontSize:14,fontWeight:700}}>{item.name}</div>
                    <div style={{fontSize:15,fontWeight:700,color:item.added?"var(--or)":"var(--tx)",whiteSpace:"nowrap",marginLeft:8}}>${item.price.toLocaleString()}</div>
                  </div>
                  <div style={{fontSize:12,color:"var(--t2)",marginBottom:12}}>{item.series}</div>
                  {item.added
                    ? <button onClick={()=>toggle(item.id)} style={{width:"100%",padding:"10px",borderRadius:8,border:"1.5px solid var(--or)",background:"var(--or-l)",color:"var(--or)",fontSize:13,fontWeight:600,fontFamily:"inherit",cursor:"pointer"}}>Remove from Project</button>
                    : <button onClick={()=>toggle(item.id)} className="btn btn-or btn-full" style={{borderRadius:8,justifyContent:"center"}}>Add to Project</button>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* sticky footer bar */}
        <div style={{position:"sticky",bottom:0,background:"#fff",borderTop:"1px solid var(--bd)",padding:"14px 32px",display:"flex",alignItems:"center",gap:14,zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".08em",marginRight:4}}>Selected Items ({added.length})</span>
            {added.slice(0,3).map(i=><img key={i.id} src={i.img} alt="" style={{width:34,height:34,borderRadius:6,objectFit:"cover",border:"1.5px solid var(--bd)"}} onError={e=>{e.target.style.display="none";}}/>)}
            {added.length>3&&<div style={{width:34,height:34,borderRadius:6,background:"var(--or-l)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"var(--or)"}}>+{added.length-3}</div>}
          </div>
          <div style={{flex:1}}/>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".08em"}}>Total Estimate</div>
            <div style={{fontSize:20,fontWeight:800}}>${total.toFixed(2)}</div>
          </div>
          <button className="btn btn-out btn-lg" onClick={()=>onNav("step2")}>Back</button>
          <button className="btn btn-or btn-lg" onClick={()=>onNav("roomeditor")} disabled={added.length===0} style={{opacity:added.length>0?1:.5}}>Finish &amp; Create Design →</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function ComfortaApp() {
  const [page,setPage]=useState("login");
  const [feedbackItems, setFeedbackItems] = useState(INITIAL_FEEDBACK_ITEMS);
  const [viewerPayload, setViewerPayload] = useState({
    items: [],
    room: { w:5, d:4, shape:"rect", wallColor:"#F5F0E8", floorColor:"#C8A97A" },
  });
  const [viewerReturnPage, setViewerReturnPage] = useState("roomeditor");
  const [trackedOrder, setTrackedOrder] = useState(DEFAULT_TRACKED_ORDER);
  function nav(p){setPage(p);window.scrollTo(0,0);}

  // pages that use the sidebar shell
  const sidebarPages=["dashboard","feedback","export","settings","step2","step3","newproject"];
  // pages that are fully standalone (no sidebar, no topbar)
  const standalonePages=["login","login-success","createaccount","vizfeedback","success","mydesigns","newproject","step1","step2","step3","roomeditor","roomviewer3d"];

  function renderPage(){
    switch(page){
      case "login":        return <LoginPage onNav={nav} onTrackOrder={(orderNumber) => setTrackedOrder(getTrackedOrder(orderNumber))}/>;
      case "login-success":return <LoginSuccess onNav={nav}/>;
      case "newproject":   return <NewProjectStep1 onNav={nav}/>;
      case "step2":        return <NewProjectStep2 onNav={nav}/>;
      case "step3":        return <NewProjectStep3 onNav={nav}/>;
      case "dashboard":    return <DesignerDashboard onNav={nav}/>;
      case "mydesigns":    return <MyDesigns onNav={nav}/>;
      case "createaccount":return <CreateAccount onNav={nav}/>;
      case "vizfeedback":  return <VizFeedback onNav={nav} trackedOrder={trackedOrder} onOpen3D={() => {
        setViewerPayload({ items: trackedOrder.items, room: trackedOrder.room });
        setViewerReturnPage("vizfeedback");
        nav("roomviewer3d");
      }} onSubmitRequirements={(message, order) => {
        setFeedbackItems((prev) => [
          {
            id: Date.now(),
            name: order.customerName || order.projectName,
            av: "👤",
            tag: "NEW REQUIREMENT",
            tagColor: "var(--or)",
            quote: `"${message}"`,
            time: "Just now",
            arch: false,
          },
          ...prev,
        ]);
      }} />;
      case "feedback":     return <CustomerFeedback feedbackItems={feedbackItems}/>;
      case "checkout":     return <Checkout onNav={nav}/>;
      case "success":      return <PaymentSuccess onNav={nav}/>;
      case "export":       return <ProjectExport onBackTo3D={() => nav("roomviewer3d")} />;
      case "about":        return <AboutUs onNav={nav} />;
      case "settings":     return <Settings/>;
      case "roomeditor":   return <RoomEditor onSwitch3D={(items, room) => {
        setViewerPayload({ items, room });
        setViewerReturnPage("roomeditor");
        nav("roomviewer3d");
      }} />;
      case "roomviewer3d": return <RoomViewer3D items={viewerPayload.items} room={viewerPayload.room} onBackTo2D={() => nav(viewerReturnPage)} canExport={viewerReturnPage === "roomeditor"} onOpenExport={() => nav("export")} />;
      default:             return <LoginPage onNav={nav}/>;
    }
  }

  // Pages that manage their own full layout (sidebar inside component)
  const selfContained=["login","login-success","createaccount","mydesigns","vizfeedback","success","newproject","step1","step2","step3","about","roomeditor","roomviewer3d"];

  // Customer payment shell with simplified navigation
  const paymentPages = ["checkout", "success", "about"];
  if(paymentPages.includes(page)){
    return(
      <>
        <style>{G}</style>
        <div className="app">
          <PaymentSidebar active={page} onNav={nav}/>
          <div className="main">{renderPage()}</div>
        </div>
      </>
    );
  }

  if(selfContained.includes(page)){
    return(
      <>
        <style>{G}</style>
        {renderPage()}
      </>
    );
  }

  // Sidebar shell for designer pages
  return(
    <>
      <style>{G}</style>
      <div className="app">
        <Sidebar active={page} onNav={nav}/>
        <div className="main">{renderPage()}</div>
      </div>
    </>
  );
}

