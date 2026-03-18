import React, { useState } from "react";
import logoImg from "../assets/LOGO.png";
import img1 from "../assets/Image+Shadow.png";
import img2 from "../assets/Image+Shadow-1.png";
import img3 from "../assets/Image+Shadow-2.png"; 
import about from  "../assets/Overlay+Shadow.png"
import container from "../assets/Container.png";
import image1 from "../assets/Image (1).png";
import image2 from "../assets/Image (2).png";
import container1 from "../assets/Container-1.png";
import imgecolumn from "../assets/Image Column.png";
import tranform from "../assets/Transform.png";

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
      img:   img1,
    },
    {
      tag:  "LIFE & STYLE",
      tagColor: "#F5A623",
      title: "Comfort & Style: Finding the Balance",
      desc:  "Expert tips on blending ergonomics with aesthetic appeal to create a space you love living in.",
      img:   img2,
    },
    {
      tag:  "TRENDS",
      tagColor: "#F5A623",
      title: "Furniture Trends for Modern Living",
      desc:  "Discover the latest styles in contemporary furniture and how to integrate them into your home.",
      img:   img3,
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
    <div style={{ background: "#FBF5E8", fontFamily: "'Inter', sans-serif", color: "#1A1A1A" }}>
      {/* Top bar only, sidebar removed */}
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

      {/* ── Customer's Page Portal Section ───────────────────────────────── */}
      <div style={{ background: "#F5F0E6", borderBottom: "1px solid #E5E7EB" }}>

        {/* Description banner */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 40px 20px" }}>
          <div style={{ borderLeft: "4px solid #F5A623", paddingLeft: 20, color: "#374151", fontSize: 14, lineHeight: 1.75 }}>
            As a customer, you can view your shared projects, track orders, and make payments through your dedicated Client Portal.
          </div>
        </div>

        {/* My Designs grid */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 40px 52px" }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#0D0D0D", marginBottom: 6 }}>My Designs</div>
            <div style={{ fontSize: 14, color: "#6B7280" }}>Manage and evolve your bespoke interior spaces</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
            {[
              { name: "Modern  Living Room", client: "Sarah Johnson",    icon: "👤", time: "1 day ago",   img: container },
              { name: "Oak Office Suite",              client: "TechCorp HQ",      icon: "🏢", time: "1 day ago",   img: image1 },
              { name: "Scandinavian Bedroom",          client: "Mikael Blomkvist", icon: "👤", time: "3 days ago",  img: image2 },
              { name: "Industrial Kitchen",            client: "Urban Lofts",      icon: "🏢", time: "1 week ago",  img: container1 },
            ].map(d => (
              <div key={d.name} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}>
                <div style={{ height: 162, overflow: "hidden" }}>
                  <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={e => { e.target.style.background = "#E5E7EB"; }}
                  />
                </div>
                <div style={{ padding: "14px 16px 16px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0D0D0D", marginBottom: 7, lineHeight: 1.3 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{d.icon} {d.client}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>🕐 Last Edited: {d.time}</div>
                  <button
                    style={{ width: "100%", padding: "9px 0", background: "#fff", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#F9FAFB"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                    onClick={() => onNav && onNav("vizfeedback")}
                  >
                    View Only
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section style={{
        background: "#FBF5E8",
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
              src= {about}
              alt="Comforta living room"
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontSize: "clamp(48px, 6.5vw, 70px)",
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

      <section style={{ padding: "64px 40px 70px", maxWidth: 1100, margin: "0 auto" }}>
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
                  onError={e => { e.target.style.background = "#FBF5E8"; e.target.style.display = "block"; }}
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

      <section style={{ background: "#FBF5E8", padding: "56px 40px" }}>
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            textAlign: "center",
            background: "linear-gradient(135deg, #EC5B131A 0%, #FFF2DD 100%)",
            border: "1px solid #F1DAB8",
            borderRadius: 20,
            boxShadow: "0 8px 24px rgba(28, 28, 30, 0.08)",
            padding: "44px 32px",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".11em", textTransform: "uppercase", color: "#DC9018", marginBottom: 10 }}>
            Newsletter
          </div>
          <h3 style={{ fontSize: 30, fontWeight: 800, color: "#0D0D0D", marginBottom: 12, lineHeight: 1.25 }}>
            Join our design community
          </h3>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 28, maxWidth: 620, marginInline: "auto" }}>
            Get the latest design tips, exclusive offers, and behind-the-scenes stories delivered to your inbox every week.
          </p>

          {subDone ? (
            <div style={{ padding: "14px 28px", background: "#DCFCE7", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#16A34A" }}>
              ✓ You are subscribed! Welcome to the community.
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, maxWidth: 460, margin: "0 auto 14px" }}>
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

      <section style={{ background: "#FBF5E8", padding: "72px 40px 60px" }}>
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
              src= {imgecolumn}
              alt="Comforta showroom"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER — Transform Your Living Space
      ══════════════════════════════════════════ */}
      <section style={{ background:"#fffff", padding:"0 40px 64px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:16, paddingTop:4 }}>
          <span style={{ cursor:"pointer" }}
            onMouseEnter={e=>e.currentTarget.style.color="#F5A623"}
            onMouseLeave={e=>e.currentTarget.style.color="#9CA3AF"}
          >Home</span>
          <span style={{ margin:"0 6px" }}>›</span>
          <span style={{ color:"#6B7280" }}>Explore</span>
        </div>

        {/* Banner card */}
        <div style={{
          background:"#FBF5E8",
          borderRadius:20,
          border:"1px solid #E5E7EB",
          overflow:"hidden",
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          minHeight:220,
          boxShadow:"0 2px 16px rgba(0,0,0,0.06)",
        }}>
          {/* LEFT — text content */}
          <div style={{
            padding:"48px 40px 48px 48px",
            display:"flex", flexDirection:"column",
            justifyContent:"center", gap:16,
          }}>
            <h2 style={{
              fontSize:"clamp(22px,2.5vw,30px)",
              fontWeight:800, color:"#0D1F3C",
              lineHeight:1.25, marginBottom:4,
            }}>
              Transform Your Living<br/>Space Today
            </h2>
            <p style={{
              fontSize:13, color:"#6B7280",
              lineHeight:1.7, maxWidth:280,
            }}>
              Discover furniture crafted to enhance comfort and elevate your home experience, bringing warmth and style into everyday living.
            </p>

            {/* Amber CTA button */}
            <div>
              <button
                onClick={() => onNav && onNav("step3")}
                style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  padding:"11px 24px", background:"#F5A623",
                  color:"#fff", border:"none", borderRadius:50,
                  fontSize:13, fontWeight:700, cursor:"pointer",
                  fontFamily:"inherit", transition:"background .15s",
                  boxShadow:"0 4px 14px rgba(245,166,35,0.3)",
                }}
                onMouseEnter={e=>e.currentTarget.style.background="#DC9018"}
                onMouseLeave={e=>e.currentTarget.style.background="#F5A623"}
              >
                Explore Furniture
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5h11M9 3.5l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Checkmark badge */}
            <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:2 }}>
              <div style={{
                width:20, height:20, borderRadius:"50%",
                background:"#F5A623",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0,
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize:12, color:"#6B7280", fontWeight:500 }}>Crafted with premium materials</span>
            </div>
          </div>

          {/* RIGHT — illustration */}
          <div style={{
            background:"#FBF5E8",
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:24, position:"relative", overflow:"hidden",
          }}>
            <img
              src= {tranform}
              alt="Transform your living space"
              style={{
                width:"100%",
                height:"100%",
                maxHeight:22000,
                objectFit:"contain",
                position:"relative",
                zIndex:2,
              }}
            />
          </div>
        </div>
      </section>
<footer/>
    </div>
  );
}

export default AboutUs;