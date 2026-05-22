"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const products = [
  { id: 1, img: "/product-1.jpg", name: "product decadent, tall,", description: "This product is a decadent, tall, round, double-layered chocolate cake, clearly a premium", price: 0, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "image showcases premium,", description: "This image showcases a premium, circular no-bake blueberry cheesecake, a refined bakery", price: 299, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "image showcases classic,", description: "This image showcases a classic, multi-layered Red Velvet cake, specifically a dessert", price: 399, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "image features tall,", description: "This image features a tall, perfectly round, single-tiered caramel cake, embodying a", price: 499, badge: "" }
];

  const filters = ["All Cakes", "Chocolate", "Cheesecakes", "Red Velvet", "Caramel"];
  const [activeFilter, setActiveFilter] = useState("All Cakes");
  const [addedStates, setAddedStates] = useState<Record<number, boolean>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedStates((prev) => ({ ...prev, [p.id]: true }));
    setToastMsg(`${p.name.slice(0, 22)}… added to cart`);
    setShowToast(true);
    setTimeout(() => {
      setAddedStates((prev) => ({ ...prev, [p.id]: false }));
    }, 1500);
    setTimeout(() => setShowToast(false), 2500);
  };

  const displayedProducts =
    activeFilter === "All Cakes"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=Tangerine:wght@400;700&family=Bebas+Neue&display=swap');
        :root {
          --bg: #F8F5F0;
          --surface: #C9826B;
          --primary: #AF272D;
          --accent: #6B3824;
          --text: #1A1A1A;
          --muted: #9B8B7D;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background-color: var(--bg); }
        a { text-decoration: none; color: inherit; }
        button { cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; }
        input { font-family: 'DM Sans', sans-serif; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(175,39,45,0.18) !important; }
        .product-card { transition: transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1); }
        .product-img { transition: transform 0.6s ease; }
        .product-img:hover { transform: scale(1.05); }
        @media (max-width: 768px) {
          .grid-3col { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .grid-3col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: navSolid ? "#F8F5F0" : "transparent",
          borderBottom: navSolid ? "1px solid #D5CECA" : "none",
          transition: "background-color 250ms ease-in-out, border-bottom 250ms ease-in-out",
          padding: "0 48px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          style={{ cursor: "pointer", padding: "4px 8px", borderRadius: "8px", background: navSolid ? "transparent" : "rgba(255,255,255,0.12)" }}
        >
          <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "40px", objectFit: "contain" }} />
        </div>

        {/* Desktop Nav Links */}
        <div
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
          className="desktop-nav"
        >
          {[
            { label: "Cakes", action: () => router.push("/shop") },
            { label: "Collections", action: () => router.push("/shop") },
            { label: "Our Story", action: () => router.push("/") },
            { label: "Gifting", action: () => router.push("/shop") },
          ].map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                color: navSolid ? "var(--text)" : "#FDFBF8",
                padding: "0 20px",
                height: "72px",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 150ms ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.textDecoration = "none";
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Cart Icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => router.push("/checkout")}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: navSolid ? "var(--text)" : "#FDFBF8",
            }}
            aria-label="View cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </button>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: navSolid ? "var(--text)" : "#FDFBF8",
              display: "none",
            }}
            className="hamburger-btn"
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            backgroundColor: "#FDFBF8",
            display: "flex",
            flexDirection: "column",
            padding: "32px 24px",
            animation: "slideIn 300ms ease-out",
          }}
        >
          <style>{`
            @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          `}</style>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              alignSelf: "flex-end",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              padding: "8px",
            }}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: "0", marginTop: "24px" }}>
            {[
              { label: "Cakes", action: () => { router.push("/shop"); setMenuOpen(false); } },
              { label: "Collections", action: () => { router.push("/shop"); setMenuOpen(false); } },
              { label: "Our Story", action: () => { router.push("/"); setMenuOpen(false); } },
              { label: "Gifting", action: () => { router.push("/shop"); setMenuOpen(false); } },
            ].map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "var(--text)",
                  textAlign: "left",
                  padding: "0",
                  height: "56px",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid #D5CECA",
                  cursor: "pointer",
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── SHOP BANNER / HERO ── */}
      <section
        style={{
          width: "100%",
          height: "320px",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          background: "#2D1B13",
        }}
      >
        <img
          src="/product-1.jpg"
          alt="Decadent chocolate cake from Zeppoli Bakers"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: "60%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(45,27,19,0.92) 35%, rgba(45,27,19,0.3) 70%, rgba(45,27,19,0) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "0 64px",
            maxWidth: "640px",
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#C9826B",
              marginBottom: "12px",
            }}
          >
            The Full Collection
          </span>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 5vw, 4.5rem)",
              fontWeight: 500,
              letterSpacing: "0.04em",
              lineHeight: 1.0,
              color: "#FDFBF8",
              marginBottom: "16px",
            }}
          >
            Every Slice,<br />A Celebration
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              lineHeight: 1.6,
              color: "#EAE3DB",
            }}
          >
            Handcrafted with the finest ingredients. Baked fresh for every occasion.
          </p>
        </div>
      </section>

      {/* ── MAIN SHOP CONTENT ── */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 48px 96px" }}>

        {/* Section header */}
        <div
          ref={addReveal}
          style={{ marginBottom: "40px" }}
        >
          <span
            style={{
              display: "block",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "12px",
            }}
          >
            Artisanal Bakery
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "var(--text)",
              }}
            >
              Our Signature Cakes
            </h2>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "var(--muted)",
              }}
            >
              {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div
          ref={addReveal}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "48px",
          }}
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: activeFilter === f ? 600 : 400,
                height: "32px",
                padding: "0 16px",
                borderRadius: "9999px",
                border: activeFilter === f ? "none" : "1px solid #D5CECA",
                backgroundColor: activeFilter === f ? "#6B3824" : "#F0EDE8",
                color: activeFilter === f ? "#FDFBF8" : "var(--text)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== f) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e0d8d0";
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== f) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F0EDE8";
                }
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div
          className="grid-3col"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
          }}
        >
          {displayedProducts.map((p, i) => (
            <article
              key={p.id}
              ref={addReveal}
              className="product-card"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(175,39,45,0.08)",
                display: "flex",
                flexDirection: "column",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* Card Image — 1:1 */}
              <div
                style={{ overflow: "hidden", aspectRatio: "1/1", cursor: "pointer", flexShrink: 0 }}
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                  )
                }
              >
                <img
                  src={p.img}
                  alt={`${p.name} — premium cake by Zeppoli Bakers`}
                  className="product-img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: "20px 20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                {/* Name */}
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    fontSize: "18px",
                    letterSpacing: "-0.02em",
                    color: "var(--text)",
                    marginBottom: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    router.push(
                      `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                    )
                  }
                >
                  {p.name}
                </h3>

                {/* Descriptor + Price row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    flex: 1,
                    marginTop: "4px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: "var(--muted)",
                      lineHeight: 1.4,
                    }}
                  >
                    {p.descriptor}
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "17px",
                      color: "var(--primary)",
                      whiteSpace: "nowrap",
                      marginLeft: "8px",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(p)}
                  style={{
                    width: "100%",
                    height: "48px",
                    backgroundColor: addedStates[p.id] ? "#6B3824" : "#2D1B13",
                    color: "#FDFBF8",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "13px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease, transform 0.15s ease",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => {
                    if (!addedStates[p.id]) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#6B3824";
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!addedStates[p.id]) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2D1B13";
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }
                  }}
                  onMouseDown={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                  }}
                >
                  {addedStates[p.id] ? "✓ Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* End of results */}
        <div
          ref={addReveal}
          style={{
            textAlign: "center",
            marginTop: "64px",
            paddingTop: "32px",
            borderTop: "1px solid #D5CECA",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "var(--muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            — End of Collection —
          </span>
        </div>
      </main>

      {/* ── VISUAL FINGERPRINT: Editorial Split Section ── */}
      <section
        ref={addReveal}
        style={{
          backgroundColor: "#2D1B13",
          display: "grid",
          gridTemplateColumns: "35% 65%",
          minHeight: "600px",
          overflow: "hidden",
        }}
      >
        {/* Left Text Column */}
        <div
          style={{
            backgroundColor: "#2D1B13",
            padding: "80px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#C9826B",
            }}
          >
            Featured Creation
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(3rem, 5vw, 4.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              color: "#FDFBF8",
            }}
          >
            The Grand Chocolate
          </h2>
          <p
            style={{
              fontFamily: "'Tangerine', cursive",
              fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
              color: "#EAE3DB",
              lineHeight: 1.4,
            }}
          >
            Our most beloved masterpiece
          </p>
          <div
            style={{
              width: "60px",
              height: "2px",
              backgroundColor: "#B58E5E",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#EAE3DB",
              maxWidth: "320px",
            }}
          >
            A double-layered masterwork of rich chocolate sponge and silken ganache frosting. Crowned with hand-shaved curls, every slice is an occasion in itself.
          </p>
          <div style={{ marginTop: "8px" }}>
            <button
              onClick={() =>
                router.push(
                  `/product?name=${encodeURIComponent(products[0].name)}&price=${products[0].price}&img=${encodeURIComponent(products[0].img)}`
                )
              }
              style={{
                height: "52px",
                padding: "0 32px",
                backgroundColor: "#B58E5E",
                color: "#FDFBF8",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s ease, transform 0.15s ease",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#9C774D";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B58E5E";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              View Cake
            </button>
          </div>
        </div>

        {/* Right Image Column — full bleed 4:5 with inset shadow */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            aspectRatio: "4/5",
          }}
        >
          <img
            src="/product-1.jpg"
            alt="Grand Chocolate Cake — double-layered masterpiece by Zeppoli Bakers"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              transition: "transform 0.8s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
            }}
          />
          {/* Inset box shadow for depth — left edge */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 40px 0 80px rgba(45,27,19,0.5)",
              pointerEvents: "none",
            }}
          />
        </div>
      </section>

      {/* ── CRAFTED WITH CARE ── */}
      <section
        ref={addReveal}
        style={{
          backgroundColor: "#2D1B13",
          padding: "96px 48px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span
              style={{
                display: "block",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#C9826B",
                marginBottom: "12px",
              }}
            >
              Our Promise
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "#FDFBF8",
              }}
            >
              Crafted With Care
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "48px",
            }}
          >
            {[
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="24" cy="28" rx="10" ry="13" stroke="#B58E5E" strokeWidth="2" fill="none" />
                    <path d="M24 15 C24 15 18 8 24 4 C30 8 24 15 24 15Z" fill="#B58E5E" />
                    <circle cx="20" cy="24" r="2" fill="#B58E5E" />
                    <circle cx="28" cy="26" r="1.5" fill="#B58E5E" />
                    <circle cx="23" cy="30" r="1.5" fill="#B58E5E" />
                  </svg>
                ),
                title: "Finest Ingredients",
                body: "We source the richest Belgian couverture chocolate, single-origin cocoa, and farm-fresh dairy to ensure every bite is extraordinary.",
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="14" r="4" stroke="#B58E5E" strokeWidth="2" fill="none" />
                    <path d="M16 44 L16 32 Q16 26 24 26 Q32 26 32 32 L32 44" stroke="#B58E5E" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M10 22 Q12 16 16 14" stroke="#B58E5E" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M38 22 Q36 16 32 14" stroke="#B58E5E" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M6 38 Q10 32 16 32" stroke="#B58E5E" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M42 38 Q38 32 32 32" stroke="#B58E5E" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
                title: "Artisanal Baking",
                body: "Every cake is hand-crafted by our pastry chefs with time-honoured techniques — piped, layered, and decorated with precision and love.",
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="20" width="36" height="22" rx="3" stroke="#B58E5E" strokeWidth="2" fill="none" />
                    <path d="M6 28 L42 28" stroke="#B58E5E" strokeWidth="1.5" />
                    <circle cx="16" cy="34" r="3" stroke="#B58E5E" strokeWidth="1.5" fill="none" />
                    <circle cx="32" cy="34" r="3" stroke="#B58E5E" strokeWidth="1.5" fill="none" />
                    <path d="M14 20 Q14 10 24 8 Q34 10 34 20" stroke="#B58E5E" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M19 20 Q19 14 24 13 Q29 14 29 20" stroke="#B58E5E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                ),
                title: "Freshly Delivered",
                body: "Baked the day of dispatch and delivered to your doorstep in temperature-controlled packaging. Freshness guaranteed every time.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                ref={addReveal}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div style={{ marginBottom: "24px" }}>{item.icon}</div>
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "19px",
                    color: "#FDFBF8",
                    marginBottom: "12px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.65,
                    color: "#EAE3DB",
                    maxWidth: "280px",
                  }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          backgroundColor: "#EAE3DB",
          padding: "80px 48px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "48px",
            paddingBottom: "64px",
          }}
        >
          {/* Col 1 — Brand */}
          <div>
            <div style={{ marginBottom: "12px" }}>
              <img src="/logo.png" alt="Zeppoli Bakers" style={{ height: "32px", objectFit: "contain", opacity: 0.85 }} />
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#7A6A61",
                marginBottom: "20px",
                lineHeight: 1.5,
              }}
            >
              Taste the Elegance
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              {[
                {
                  label: "Instagram",
                  path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                },
                {
                  label: "Facebook",
                  path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                },
                {
                  label: "Pinterest",
                  path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641 0 12.017 0z",
                },
              ].map((social) => (
                <button
                  key={social.label}
                  aria-label={social.label}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "#7A6A61",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#B58E5E"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#7A6A61"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Col 2 — Shop */}
          <div>
            <h4
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#2D1B13",
                marginBottom: "16px",
              }}
            >
              Shop
            </h4>
            {["All Cakes", "Chocolate", "Cheesecakes", "Gifting", "Seasonal Specials"].map((link) => (
              <button
                key={link}
                onClick={() => router.push("/shop")}
                style={{
                  display: "block",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  lineHeight: 2.1,
                  color: "#7A6A61",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Col 3 — Discover */}
          <div>
            <h4
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#2D1B13",
                marginBottom: "16px",
              }}
            >
              Discover
            </h4>
            {["Our Story", "Ingredients", "Press", "FAQs", "Contact Us"].map((link) => (
              <button
                key={link}
                onClick={() => router.push("/")}
                style={{
                  display: "block",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  lineHeight: 2.1,
                  color: "#7A6A61",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                fontSize: "18px",
                color: "#2D1B13",
                marginBottom: "16px",
              }}
            >
              Stay in the loop
            </h4>
            {subscribed ? (
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "#6B3824",
                  lineHeight: 1.6,
                }}
              >
                Thank you for subscribing! 🎂
              </p>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  style={{
                    width: "100%",
                    height: "48px",
                    border: "1px solid #D5CECA",
                    borderRadius: "4px",
                    padding: "0 16px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    backgroundColor: "#FDFBF8",
                    color: "#2D1B13",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => {
                    if (email) {
                      setSubscribed(true);
                      setEmail("");
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "48px",
                    marginTop: "12px",
                    backgroundColor: "#B58E5E",
                    color: "#FDFBF8",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#9C774D"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B58E5E"; }}
                >
                  Subscribe
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            borderTop: "1px solid #D5CECA",
            padding: "24px 0",
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#7A6A61",
            }}
          >
            © 2026 Zeppoli Bakers. All rights reserved.{" "}
            <button
              onClick={() => router.push("/")}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#7A6A61",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              Privacy Policy
            </button>
            {" · "}
            <button
              onClick={() => router.push("/")}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#7A6A61",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              Terms of Service
            </button>
          </p>
          {/* Payment icons row */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {["VISA", "MC", "AMEX", "UPI"].map((brand) => (
              <div
                key={brand}
                style={{
                  width: "44px",
                  height: "28px",
                  border: "1px solid #D5CECA",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F8F5F0",
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#9B8B7D",
                    letterSpacing: "0.04em",
                  }}
                >
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* ── TOAST NOTIFICATION ── */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: `translateX(-50%) translateY(${showToast ? "0" : "80px"})`,
          backgroundColor: "#2D1B13",
          color: "#FDFBF8",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          padding: "14px 24px",
          borderRadius: "8px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          zIndex: 300,
          opacity: showToast ? 1 : 0,
          transition: "opacity 0.3s ease, transform 0.3s ease",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          pointerEvents: "none",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B58E5E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {toastMsg}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (max-width: 768px) {
          section[style*="gridTemplateColumns: 35%"] {
            grid-template-columns: 1fr !important;
          }
          footer > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}