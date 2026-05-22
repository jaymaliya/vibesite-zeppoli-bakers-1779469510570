"use client";
export const dynamic = 'force-dynamic';

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartContext";

const PRODUCTS = [
  { id: 1, img: "/product-1.jpg", name: "Decadent Double Chocolate Cake", description: "A decadent, tall, round, double-layered chocolate cake, clearly a premium bakery item, exuding richness and indulgence. Meticulously crafted with the finest cocoa.", price: 1299 },
  { id: 2, img: "/product-2.jpg", name: "Blueberry Cheesecake", description: "A premium circular no-bake blueberry cheesecake, a refined bakery dessert with a velvety smooth texture and burst of fresh blueberries.", price: 299 },
  { id: 3, img: "/product-3.jpg", name: "Classic Red Velvet Cake", description: "A classic multi-layered Red Velvet cake with cream cheese frosting, delivering that signature crimson crumb and tangy sweetness.", price: 399 },
  { id: 4, img: "/product-4.jpg", name: "Caramel Dream Cake", description: "A tall, perfectly round caramel cake with layers of salted caramel cream, drizzled with glossy caramel and topped with caramel shards.", price: 499 },
];

const THUMBNAILS = ["/product-1.jpg", "/product-2.jpg", "/product-3.jpg", "/product-4.jpg"];

const REVIEWS = [
  { name: "Priya Mehta", date: "March 2025", stars: 5, text: "Absolutely divine! The chocolate cake was the highlight of our anniversary celebration. Every layer was moist and the frosting was perfectly sweet. Will order again!" },
  { name: "Rahul Sharma", date: "February 2025", stars: 5, text: "Ordered for my daughter's birthday and it was a showstopper. The chocolate shavings on top are so elegant. Delivered fresh and perfectly packed." },
  { name: "Ananya Iyer", date: "January 2025", stars: 5, text: "Zeppoli Bakers never disappoints. The double layer is incredibly indulgent. My guests kept asking where I got it from. Premium quality at its finest." },
  { name: "Karan Bose", date: "December 2024", stars: 4, text: "Beautiful presentation and delicious taste. The frosting texture is exactly as described. Slight delay in delivery but worth every bite." },
];

function NavBar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCart() ?? { items: [] };
  const cartCount = items?.reduce((s: number, i: any) => s + (i.quantity || 1), 0) ?? 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: scrolled ? "#F8F5F0" : "transparent",
        borderBottom: scrolled ? "1px solid #D5CECA" : "none",
        transition: "background-color 250ms ease-in-out, border-bottom 250ms ease-in-out",
        padding: "0 48px",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ padding: "4px 8px", borderRadius: "8px", background: scrolled ? "transparent" : "rgba(255,255,255,0.12)" }}>
            <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
          </div>
          <div style={{ display: "flex", gap: "0", alignItems: "center" }} className="desktop-nav">
            {[["Cakes", "/shop"], ["Collections", "/shop"], ["Our Story", "/"], ["Gifting", "/shop"]].map(([label, path]) => (
              <button key={label} onClick={() => router.push(path)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 24px", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: scrolled ? "#1A1A1A" : "#F8F5F0", transition: "color 150ms ease", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => router.push("/checkout")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", alignItems: "center" }}
              aria-label="Cart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "#1A1A1A" : "#F8F5F0"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: "2px", right: "2px", width: "18px", height: "18px", borderRadius: "50%", background: "#AF272D", color: "#F8F5F0", fontSize: "10px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              )}
            </button>
            <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none" }} aria-label="Open menu" className="hamburger-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "#1A1A1A" : "#F8F5F0"} strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, backgroundColor: "#F8F5F0", display: "flex", flexDirection: "column", padding: "32px 24px", animation: "slideInLeft 300ms ease-out" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
            <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }} aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {[["Cakes", "/shop"], ["Collections", "/shop"], ["Our Story", "/"], ["Gifting", "/shop"]].map(([label, path]) => (
            <button key={label} onClick={() => { router.push(path); setMobileOpen(false); }} style={{ background: "none", border: "none", borderBottom: "1px solid #D5CECA", cursor: "pointer", padding: "0", height: "56px", textAlign: "left", fontSize: "20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#1A1A1A" }}>
              {label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=Tangerine:wght@400;700&display=swap');
        :root { --bg:#F8F5F0; --surface:#C9826B; --primary:#AF272D; --accent:#6B3824; --text:#1A1A1A; --muted:#9B8B7D; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }
        @keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 600ms ease-out, transform 600ms ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .product-layout { flex-direction: column !important; }
          .gallery-col { position: static !important; width: 100% !important; }
          .info-col { width: 100% !important; padding-left: 0 !important; margin-top: 32px; }
          .thumbnails-row { justify-content: flex-start !important; }
          .sticky-mobile-bar { display: flex !important; }
          nav { padding: 0 16px !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null;
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;

  const displayImg = paramImg ?? "/product-1.jpg";
  const displayName = paramName ?? "Decadent Double Chocolate Cake";
  const basePrice = (paramPrice && paramPrice > 0) ? paramPrice : 1299;

  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const [activeThumb, setActiveThumb] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<"regular" | "large">("regular");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients">("description");
  const [addedToCart, setAddedToCart] = useState(false);
  const [personalMessage, setPersonalMessage] = useState("");
  const [priceVisible, setPriceVisible] = useState(true);

  const reviewsRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const sizeMultiplier = selectedSize === "large" ? 1.4 : 1;
  const currentPrice = Math.round(basePrice * sizeMultiplier);
  const originalPrice = Math.round(currentPrice * 1.2);

  const thumbnails = [displayImg, ...THUMBNAILS.filter(t => t !== displayImg).slice(0, 3)];

  const handleSizeChange = (size: "regular" | "large") => {
    setPriceVisible(false);
    setTimeout(() => { setSelectedSize(size); setPriceVisible(true); }, 150);
  };

  const handleAddToCart = () => {
    addItem({ id: `product-${Date.now()}`, name: displayName, price: currentPrice * quantity, quantity, image: displayImg });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({ id: `product-${Date.now()}`, name: displayName, price: currentPrice * quantity, quantity, image: displayImg });
    router.push("/checkout");
  };

  useEffect(() => {
    const els = [reviewsRef.current, relatedRef.current, storyRef.current];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); } });
    }, { threshold: 0.1 });
    els.forEach(el => { if (el) { el.classList.add("reveal"); observer.observe(el); } });
    return () => observer.disconnect();
  }, []);

  const relatedProducts = PRODUCTS.filter(p => p.img !== displayImg).slice(0, 3);

  return (
    <>
      <NavBar />

      <main style={{ paddingTop: "72px", background: "var(--bg)", minHeight: "100vh" }}>

        {/* Trust Bar */}
        <div style={{ background: "#2D1B13", padding: "10px 24px", display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
          {["★ 4.9 / 5 · 2,400+ Reviews", "🎂 Handcrafted in India", "Free delivery over ₹999", "Same-day delivery available"].map((t, i) => (
            <span key={i} style={{ fontSize: "13px", fontFamily: "'DM Sans', sans-serif", color: "#EAE3DB", letterSpacing: "0.02em" }}>{t}</span>
          ))}
        </div>

        {/* Product Layout */}
        <div className="product-layout" style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 48px 96px", display: "flex", gap: "64px", alignItems: "flex-start" }}>

          {/* Image Gallery — Sticky */}
          <div className="gallery-col" style={{ width: "55%", position: "sticky", top: "88px" }}>
            {/* Main Image */}
            <div style={{ position: "relative", overflow: "hidden", borderRadius: "12px", background: "#FFFFFF", cursor: "zoom-in", boxShadow: "0 24px 64px rgba(111,56,36,0.15)" }}
              onClick={() => { setLightboxOpen(true); setLightboxIdx(activeThumb); }}>
              <img
                src={thumbnails[activeThumb]}
                alt={`${displayName} — main product view`}
                style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 600ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div style={{ position: "absolute", inset: 0, background: "inset 0 0 40px rgba(0,0,0,0.15)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(0,0,0,0.5)", borderRadius: "8px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F8F5F0" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                <span style={{ color: "#F8F5F0", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>Click to zoom</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="thumbnails-row" style={{ display: "flex", gap: "12px", marginTop: "16px", justifyContent: "center" }}>
              {thumbnails.map((thumb, i) => (
                <button key={i} onClick={() => setActiveThumb(i)} style={{ padding: 0, border: activeThumb === i ? "2px solid #B58E5E" : "2px solid transparent", borderRadius: "8px", cursor: "pointer", overflow: "hidden", background: "none", transition: "border-color 200ms ease" }}
                  aria-label={`View image ${i + 1}`}>
                  <img src={thumb} alt={`${displayName} thumbnail ${i + 1}`} style={{ width: "80px", height: "100px", objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </div>

            {/* Delivery info */}
            <div style={{ marginTop: "24px", padding: "20px 24px", background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E8E0D8" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B58E5E" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: "Free delivery on orders above ₹999" },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B58E5E" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "100% fresh, handcrafted guarantee" },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B58E5E" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, text: "Made in India with finest ingredients" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {item.icon}
                    <span style={{ fontSize: "14px", fontFamily: "'DM Sans', sans-serif", color: "#2D1B13" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="info-col" style={{ width: "45%", paddingLeft: "16px" }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", color: "var(--muted)" }}>
              <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Home</button>
              <span>/</span>
              <button onClick={() => router.push("/shop")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Cakes</button>
              <span>/</span>
              <span style={{ color: "var(--text)" }}>Chocolate Cakes</span>
            </div>

            {/* Category eyebrow */}
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: "#9B8B7D" }}>Premium Chocolate</span>

            {/* Title */}
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: 1.05, color: "#2D1B13", marginTop: "12px", marginBottom: "8px" }}>
              {displayName}
            </h1>

            {/* Script tagline */}
            <p style={{ fontFamily: "'Tangerine', cursive", fontSize: "clamp(1.2rem, 2vw, 1.8rem)", color: "#B58E5E", marginBottom: "16px" }}>
              Handcrafted with Pure Cocoa Passion
            </p>

            {/* Divider */}
            <div style={{ width: "60px", height: "2px", backgroundColor: "#B58E5E", marginBottom: "20px" }} />

            {/* Reviews summary */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#B58E5E", fontSize: "18px" }}>★</span>)}
              </div>
              <span style={{ fontSize: "14px", fontFamily: "'DM Sans', sans-serif", color: "var(--muted)" }}>4.9 · 2,400+ Reviews</span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "28px", opacity: priceVisible ? 1 : 0, transition: "opacity 150ms ease" }}>
              <span style={{ fontSize: "28px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#B58E5E" }}>₹{currentPrice.toLocaleString("en-IN")}</span>
              <span style={{ fontSize: "20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, color: "#7A6A61", textDecoration: "line-through" }}>₹{originalPrice.toLocaleString("en-IN")}</span>
              <span style={{ fontSize: "13px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#AF272D", background: "#FEF2F2", padding: "2px 8px", borderRadius: "4px" }}>17% OFF</span>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#2D1B13", marginBottom: "12px" }}>
                Size: <span style={{ fontWeight: 400, color: "var(--muted)" }}>{selectedSize === "regular" ? "Regular (Serves 6–8)" : "Large (Serves 10–12)"}</span>
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                {(["regular", "large"] as const).map(size => (
                  <button key={size} onClick={() => handleSizeChange(size)} style={{ padding: "0 20px", height: "40px", borderRadius: "999px", border: selectedSize === size ? "none" : "1px solid #D5CECA", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: selectedSize === size ? 600 : 400, background: selectedSize === size ? "#B58E5E" : "#F0EDE8", color: selectedSize === size ? "#FDFBF8" : "#2D1B13", transition: "background-color 150ms ease, color 150ms ease" }}
                    aria-pressed={selectedSize === size}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#2D1B13", marginBottom: "12px" }}>Quantity</p>
              <div style={{ display: "flex", alignItems: "center", height: "44px", border: "1px solid #D5CECA", borderRadius: "8px", width: "fit-content", overflow: "hidden" }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: "44px", height: "100%", background: "#F0EDE8", border: "none", cursor: "pointer", fontSize: "18px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#2D1B13", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Decrease quantity">−</button>
                <span style={{ width: "48px", textAlign: "center", fontSize: "16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#2D1B13" }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: "44px", height: "100%", background: "#F0EDE8", border: "none", cursor: "pointer", fontSize: "18px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#2D1B13", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Increase quantity">+</button>
              </div>
            </div>

            {/* Personal Message */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#2D1B13", marginBottom: "8px" }}>
                Add a Personal Message <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional, max 80 characters)</span>
              </label>
              <input
                type="text"
                maxLength={80}
                value={personalMessage}
                onChange={e => setPersonalMessage(e.target.value)}
                placeholder="Happy Birthday, Pooja! With love ❤️"
                style={{ width: "100%", height: "48px", border: "1px solid #D5CECA", borderRadius: "8px", padding: "0 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#2D1B13", background: "#FFFFFF", outline: "none" }}
              />
              <div style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "'DM Sans', sans-serif", marginTop: "4px", textAlign: "right" }}>{personalMessage.length}/80</div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              <button onClick={handleAddToCart}
                style={{ width: "100%", height: "56px", background: addedToCart ? "#2D7D2D" : "#B58E5E", color: "#FDFBF8", border: "none", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "background-color 0.2s ease, transform 150ms ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                onMouseEnter={e => !addedToCart && (e.currentTarget.style.background = "#9C774D")}
                onMouseLeave={e => !addedToCart && (e.currentTarget.style.background = "#B58E5E")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                aria-live="polite">
                {addedToCart ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Added to Cart
                  </>
                ) : "Add to Cart"}
              </button>
              <button onClick={handleBuyNow}
                style={{ width: "100%", height: "56px", background: "#2D1B13", color: "#FDFBF8", border: "none", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "background-color 0.2s ease, transform 150ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1a0f0b")}
                onMouseLeave={e => (e.currentTarget.style.background = "#2D1B13")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
                Buy Now
              </button>
            </div>

            {/* Tabs */}
            <div style={{ borderTop: "1px solid #E8E0D8", paddingTop: "32px" }}>
              <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #E8E0D8", marginBottom: "24px" }}>
                {(["description", "ingredients"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "0 0 16px", marginRight: "32px", background: "none", border: "none", borderBottom: activeTab === tab ? "2px solid #B58E5E" : "2px solid transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 600, color: activeTab === tab ? "#2D1B13" : "#7A6A61", transition: "color 150ms ease" }}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === "description" ? (
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", lineHeight: 1.7, color: "#2D1B13", marginBottom: "16px" }}>
                    A towering masterpiece of indulgence — our Decadent Double Chocolate Cake is crafted layer by layer with the finest Belgian cocoa, slow-churned chocolate ganache, and hand-piped frosting ridges. Each cake is baked fresh to order in our artisan kitchen.
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", lineHeight: 1.7, color: "#2D1B13", marginBottom: "16px" }}>
                    The signature double layer features our house-made dark chocolate mousse filling, while the exterior is adorned with gracefully piped swirls and a generous crown of hand-shaved espresso chocolate curls. Every slice is a celebration.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {["Made fresh to order — 24hr advance booking", "Serves 6–8 (Regular) or 10–12 (Large)", "Shelf life: Best consumed within 48 hours", "Keep refrigerated. Bring to room temperature 30 mins before serving"].map((item, i) => (
                      <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#2D1B13" }}>
                        <span style={{ color: "#B58E5E", flexShrink: 0, marginTop: "2px" }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", lineHeight: 1.7, color: "#2D1B13", marginBottom: "16px" }}>
                    We use only the finest, responsibly sourced ingredients — no artificial colours, no preservatives.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {["Premium Belgian Dark Chocolate (70% cacao)", "Unbleached All-Purpose Flour", "Farm-Fresh Eggs", "Pure Vanilla Extract", "Unsalted Cultured Butter", "Single-Origin Cocoa Powder", "Cane Sugar (unrefined)", "Heavy Cream (locally sourced)"].map((ing, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#2D1B13", padding: "8px 0", borderBottom: "1px solid #F0EDE8" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#B58E5E", flexShrink: 0 }} />
                        {ing}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#7A6A61", marginTop: "16px", lineHeight: 1.6 }}>
                    Contains: Wheat, Eggs, Dairy, Soy. May contain traces of Nuts. Produced in a kitchen that handles common allergens.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section ref={reviewsRef} style={{ background: "#2D1B13", padding: "96px 48px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: "#B58E5E" }}>What Our Customers Say</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#FDFBF8", marginTop: "12px" }}>
                Loved by Thousands
              </h2>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "16px" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#B58E5E", fontSize: "20px" }}>★</span>)}
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#EAE3DB" }}>4.9 out of 5 · 2,400+ reviews</span>
              </div>
            </div>

            <div className="reviews-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {REVIEWS.map((review, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "16px", padding: "32px", border: "1px solid rgba(181,142,94,0.2)", transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1)" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
                    {Array.from({ length: review.stars }).map((_, s) => <span key={s} style={{ color: "#B58E5E", fontSize: "16px" }}>★</span>)}
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#EAE3DB", marginBottom: "20px" }}>"{review.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#B58E5E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "#FDFBF8" }}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#FDFBF8" }}>{review.name}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#7A6A61" }}>{review.date} · Verified Buyer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Editorial Visual Fingerprint — The Art of Chocolate */}
        <section ref={storyRef} style={{ background: "#EAE3DB" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", minHeight: "500px", alignItems: "stretch" }}>
            {/* Left text 35% */}
            <div style={{ width: "40%", background: "#2D1B13", padding: "80px 56px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "16px", flexShrink: 0 }}>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: "#9B8B7D" }}>Our Craft</span>
              <p style={{ fontFamily: "'Tangerine', cursive", fontSize: "clamp(1.2rem, 2.5vw, 2rem)", color: "#EAE3DB" }}>Bean to Bliss</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.5rem, 4vw, 4rem)", letterSpacing: "-0.04em", lineHeight: 1.0, color: "#FDFBF8" }}>
                The Art of<br />Chocolate
              </h2>
              <div style={{ width: "60px", height: "2px", backgroundColor: "#B58E5E" }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", lineHeight: 1.7, color: "#EAE3DB", maxWidth: "380px" }}>
                Every cake begins with single-origin cocoa, sourced from small farms across Kerala and Tamil Nadu. We temper our chocolate by hand, a ritual passed down through three generations of bakers.
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", lineHeight: 1.7, color: "#EAE3DB", maxWidth: "380px" }}>
                The result is a depth of flavour that no machine can replicate — earthy, complex, unmistakably alive. This is not a cake. This is craft.
              </p>
            </div>
            {/* Right image 60% */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <img src="/product-1.jpg" alt="The Art of Chocolate — premium cake detail showing intricate frosting and chocolate shavings"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 600ms ease", minHeight: "500px" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div style={{ position: "absolute", inset: 0, boxShadow: "inset 40px 0 80px rgba(45,27,19,0.4)", pointerEvents: "none" }} />
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section ref={relatedRef} style={{ background: "var(--bg)", padding: "96px 48px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ marginBottom: "48px" }}>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: "#9B8B7D" }}>You May Also Love</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "#2D1B13", marginTop: "12px" }}>
                More Creations
              </h2>
            </div>

            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px" }}>
              {relatedProducts.map((p, i) => (
                <article key={p.id} style={{ cursor: "pointer", transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)", borderRadius: "16px", overflow: "hidden", background: "#FFFFFF", boxShadow: "0 8px 24px rgba(111,56,36,0.08)" }}
                  onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(111,56,36,0.18)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(111,56,36,0.08)"; }}>
                  <div style={{ overflow: "hidden", aspectRatio: "4/5" }}>
                    <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 600ms ease" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "18px", letterSpacing: "-0.01em", color: "#2D1B13", marginBottom: "6px" }}>{p.name}</h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#7A6A61", lineHeight: 1.5, marginBottom: "12px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>{p.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "18px", color: "#B58E5E" }}>₹{p.price.toLocaleString("en-IN")}</span>
                      <button onClick={e => { e.stopPropagation(); router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`); }}
                        style={{ border: "1px solid #B58E5E", background: "none", color: "#B58E5E", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, padding: "8px 16px", borderRadius: "999px", cursor: "pointer", transition: "all 0.2s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#B58E5E"; e.currentTarget.style.color = "#FDFBF8"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#B58E5E"; }}>
                        View Cake
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <button onClick={() => router.push("/shop")}
                style={{ background: "none", border: "2px solid #2D1B13", color: "#2D1B13", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 600, padding: "14px 48px", borderRadius: "8px", cursor: "pointer", transition: "background-color 0.2s ease, color 0.2s ease, transform 150ms ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#2D1B13"; e.currentTarget.style.color = "#FDFBF8"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#2D1B13"; }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
                Explore All Cakes
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: "#EAE3DB", borderTop: "1px solid #D5CECA", padding: "80px 48px 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "40px", paddingBottom: "64px" }}>
              {/* Col 1 */}
              <div>
                <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "32px", objectFit: "contain", opacity: 0.85, marginBottom: "12px" }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#7A6A61", lineHeight: 1.6, marginBottom: "24px" }}>Taste the Elegance. Every cake, a celebration of craft.</p>
                <div style={{ display: "flex", gap: "16px" }}>
                  {[
                    { label: "Instagram", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                    { label: "Facebook", d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                    { label: "Pinterest", d: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" }
                  ].map(icon => (
                    <button key={icon.label} onClick={() => {}} aria-label={icon.label}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#7A6A61", transition: "color 200ms ease" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#B58E5E")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#7A6A61")}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d={icon.d} /></svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Col 2 */}
              <div>
                <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#2D1B13", marginBottom: "20px" }}>Shop</h4>
                {["All Cakes", "Chocolate", "Cheesecakes", "Gifting", "Seasonal Specials"].map(link => (
                  <button key={link} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#7A6A61", lineHeight: 2, padding: 0, textAlign: "left", transition: "color 150ms ease" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#2D1B13")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#7A6A61")}>
                    {link}
                  </button>
                ))}
              </div>

              {/* Col 3 */}
              <div>
                <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#2D1B13", marginBottom: "20px" }}>Discover</h4>
                {["Our Story", "Ingredients", "Press", "FAQs", "Contact Us"].map(link => (
                  <button key={link} onClick={() => router.push("/")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#7A6A61", lineHeight: 2, padding: 0, textAlign: "left", transition: "color 150ms ease" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#2D1B13")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#7A6A61")}>
                    {link}
                  </button>
                ))}
              </div>

              {/* Col 4 Newsletter */}
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "18px", color: "#2D1B13", marginBottom: "16px" }}>Stay in the loop</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#7A6A61", lineHeight: 1.6, marginBottom: "16px" }}>New flavours, seasonal specials, and early access — delivered to your inbox.</p>
                <NewsletterForm />
              </div>
            </div>

            <div style={{ borderTop: "1px solid #D5CECA", padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {["© 2026 Zeppoli Bakers. All rights reserved.", "Privacy Policy", "Terms of Service"].map((t, i) => (
                  <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#7A6A61" }}>{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {["VISA", "MC", "AMEX", "UPI"].map(p => (
                  <div key={p} style={{ background: "#D5CECA", borderRadius: "4px", padding: "4px 8px", fontSize: "10px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "#7A6A61", letterSpacing: "0.05em" }}>{p}</div>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Lightbox */}
      {lightboxOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} style={{ position: "absolute", top: "24px", right: "24px", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Close lightbox">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FDFBF8" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + thumbnails.length) % thumbnails.length); }} style={{ position: "absolute", left: "24px", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Previous image">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FDFBF8" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "12px", overflow: "hidden" }}>
            <img src={thumbnails[lightboxIdx]} alt={`${displayName} — full view ${lightboxIdx + 1}`} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", display: "block" }} />
          </div>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % thumbnails.length); }} style={{ position: "absolute", right: "24px", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Next image">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FDFBF8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}

      {/* Sticky Mobile Bottom Bar */}
      <div className="sticky-mobile-bar" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "#FFFFFF", borderTop: "1px solid #E8E0D8", padding: "12px 16px", gap: "12px", alignItems: "center", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }}>
        <div>
          <div style={{ fontSize: "11px", fontFamily: "'DM Sans', sans-serif", color: "#7A6A61" }}>{selectedSize === "regular" ? "Regular" : "Large"}</div>
          <div style={{ fontSize: "20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "#B58E5E" }}>₹{currentPrice.toLocaleString("en-IN")}</div>
        </div>
        <button onClick={handleAddToCart}
          style={{ flex: 1, height: "52px", background: addedToCart ? "#2D7D2D" : "#B58E5E", color: "#FDFBF8", border: "none", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "background-color 0.2s ease" }}>
          {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
        </button>
        <button onClick={handleBuyNow}
          style={{ flex: 1, height: "52px", background: "#2D1B13", color: "#FDFBF8", border: "none", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}>
          Buy Now
        </button>
      </div>
    </>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) { setSubscribed(true); setEmail(""); setTimeout(() => setSubscribed(false), 4000); }
  };

  return (
    <div>
      {subscribed ? (
        <div style={{ padding: "12px 16px", background: "#2D7D2D", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#FFFFFF" }}>
          Thank you for subscribing! 🎂
        </div>
      ) : (
        <>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
            style={{ width: "100%", height: "48px", border: "1px solid #D5CECA", borderRadius: "4px", padding: "0 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#2D1B13", background: "#FFFFFF", outline: "none" }} />
          <button onClick={handleSubscribe}
            style={{ width: "100%", height: "48px", marginTop: "12px", background: "#B58E5E", color: "#FDFBF8", border: "none", borderRadius: "4px", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600, cursor: "pointer", transition: "background-color 0.2s ease" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#9C774D")}
            onMouseLeave={e => (e.currentTarget.style.background = "#B58E5E")}>
            Subscribe
          </button>
        </>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}