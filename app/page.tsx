"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";

const products = [
  { id: 1, img: "/product-1.jpg", name: "product decadent, tall,", description: "A decadent, tall, double-layered chocolate cake exuding richness and indulgence.", price: 1299 },
  { id: 2, img: "/product-2.jpg", name: "image showcases premium,", description: "A premium circular no-bake blueberry cheesecake, refined and luscious.", price: 299 },
  { id: 3, img: "/product-3.jpg", name: "image showcases classic,", description: "A classic multi-layered Red Velvet cake, beautifully crafted.", price: 399 },
  { id: 4, img: "/product-4.jpg", name: "image features tall,", description: "A tall, perfectly round single-tiered caramel cake, premium in every layer.", price: 499 },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=Tangerine:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(24px)";
    });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleCarouselMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.cursor = "grabbing";
  };
  const handleCarouselMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };
  const handleCarouselMouseUp = () => {
    isDragging.current = false;
    if (carouselRef.current) carouselRef.current.style.cursor = "grab";
  };

  const deepCocoa = "#2D1B13";
  const goldAccent = "#B58E5E";
  const offWhite = "#FDFBF8";
  const warmMocha = "#EAE3DB";
  const mutedBrown = "#7A6A61";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#F8F5F0", color: "#1A1A1A", overflowX: "hidden" }}>

      {/* ── STICKY NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "background-color 250ms ease-in-out, box-shadow 250ms ease-in-out",
          backgroundColor: navScrolled ? offWhite : "transparent",
          boxShadow: navScrolled ? "0 1px 0 #D5CECA" : "none",
          padding: "0 40px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
          onClick={() => router.push("/")}
        >
          <div style={{
            padding: "4px 8px",
            borderRadius: "8px",
            background: navScrolled ? "transparent" : "rgba(0,0,0,0.18)",
          }}>
            <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "40px", objectFit: "contain" }} />
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="desktop-nav">
          {[
            { label: "Cakes", action: () => router.push("/shop") },
            { label: "Collections", action: () => router.push("/shop") },
            { label: "Our Story", action: () => document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" }) },
            { label: "Gifting", action: () => router.push("/shop") },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                color: navScrolled ? deepCocoa : offWhite,
                padding: "0 20px",
                height: "72px",
                letterSpacing: "0.01em",
                transition: "color 150ms ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = goldAccent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = navScrolled ? deepCocoa : offWhite)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Cart Icon Desktop */}
        <button
          onClick={() => router.push("/checkout")}
          style={{
            position: "relative",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          className="desktop-nav"
          aria-label="View cart"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={navScrolled ? deepCocoa : offWhite} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none" }}
          className="mobile-nav"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={navScrolled ? deepCocoa : offWhite} strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* ── MOBILE NAV OVERLAY ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          backgroundColor: offWhite,
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms ease-out",
          display: "flex",
          flexDirection: "column",
          padding: "32px 32px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={deepCocoa} strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {[
          { label: "Cakes", action: () => { router.push("/shop"); setMenuOpen(false); } },
          { label: "Collections", action: () => { router.push("/shop"); setMenuOpen(false); } },
          { label: "Our Story", action: () => { setMenuOpen(false); setTimeout(() => document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" }), 300); } },
          { label: "Gifting", action: () => { router.push("/shop"); setMenuOpen(false); } },
          { label: "Cart", action: () => { router.push("/checkout"); setMenuOpen(false); } },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              background: "none",
              border: "none",
              borderBottom: `1px solid #D5CECA`,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: deepCocoa,
              height: "56px",
              display: "flex",
              alignItems: "center",
              padding: "0 8px",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ── HERO SECTION ── */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "80vh",
          minHeight: "520px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/product-1.jpg"
          alt="Decadent double-layered chocolate cake by Zeppoli Bakers"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        {/* Dark overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)",
        }} />
        {/* Content */}
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 24px",
          maxWidth: "700px",
        }}>
          {/* Trust eyebrow */}
          <div style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "24px",
            fontSize: "13px",
            color: warmMocha,
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}>
            <span>⭐ 4.8 / 5 Rating</span>
            <span>8,000+ Happy Orders</span>
            <span>Made in India</span>
            <span>Free Delivery over ₹999</span>
          </div>

          <span style={{
            fontFamily: "'Tangerine', cursive",
            fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
            color: goldAccent,
            letterSpacing: "0.02em",
            marginBottom: "12px",
            display: "block",
          }}>
            Zeppoli Bakers
          </span>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(3.8rem, 7vw, 6rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            color: offWhite,
            margin: "0 0 28px",
          }}>
            Indulgence<br />Crafted
          </h1>

          <button
            onClick={() => router.push("/shop")}
            style={{
              backgroundColor: goldAccent,
              color: offWhite,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              height: "52px",
              padding: "0 40px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s ease, transform 0.15s ease",
              letterSpacing: "0.02em",
              marginBottom: "20px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#9C774D";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = goldAccent;
              e.currentTarget.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          >
            Explore Our Cakes
          </button>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: warmMocha,
            letterSpacing: "0.03em",
          }}>
            Handcrafted with Passion. Delivered Fresh.
          </p>
        </div>
      </section>

      {/* ── OUR SIGNATURE CREATIONS ── */}
      <section className="reveal" style={{
        backgroundColor: offWhite,
        padding: "96px 64px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: mutedBrown,
            textAlign: "center",
            marginBottom: "16px",
          }}>
            Our Signature Creations
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: deepCocoa,
            textAlign: "center",
            marginBottom: "64px",
          }}>
            Made to be Remembered
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
          }}
            className="sig-grid"
          >
            {[products[1], products[2]].map((p) => (
              <div
                key={p.id}
                className="reveal"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "40px 32px 32px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                  transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 24px 48px rgba(45,27,19,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
                }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              >
                <div style={{ width: "100%", overflow: "hidden", borderRadius: "8px", aspectRatio: "1/1" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 400ms ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: "clamp(1.4rem, 2vw, 2rem)",
                  letterSpacing: "-0.02em",
                  color: deepCocoa,
                  textAlign: "center",
                  marginTop: "20px",
                  marginBottom: "0",
                  textTransform: "capitalize",
                }}>
                  {p.name}
                </h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.5,
                  color: mutedBrown,
                  textAlign: "center",
                  marginTop: "10px",
                  marginBottom: "24px",
                  maxWidth: "340px",
                }}>
                  {p.description}
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "18px",
                  color: goldAccent,
                  marginBottom: "20px",
                }}>
                  ₹{p.price.toLocaleString("en-IN")}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`);
                  }}
                  style={{
                    border: `1px solid ${goldAccent}`,
                    color: goldAccent,
                    background: "transparent",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    padding: "12px 32px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = goldAccent;
                    e.currentTarget.style.color = offWhite;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = goldAccent;
                  }}
                >
                  View Cake
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISUAL FINGERPRINT: THE ART OF CHOCOLATE (Editorial Split) ── */}
      <section id="our-story" className="reveal" style={{
        backgroundColor: deepCocoa,
        display: "grid",
        gridTemplateColumns: "35% 65%",
        minHeight: "600px",
      }}
        className="art-split reveal"
      >
        {/* Left: Text Column */}
        <div style={{
          backgroundColor: deepCocoa,
          padding: "96px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: warmMocha,
            marginBottom: "16px",
          }}>
            Our Craft
          </p>

          <span style={{
            fontFamily: "'Tangerine', cursive",
            fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
            color: warmMocha,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
            display: "block",
            marginBottom: "16px",
          }}>
            Our Journey from Bean to Bliss
          </span>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(3.5rem, 6vw, 5.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            color: offWhite,
            margin: "0 0 24px",
          }}>
            The Art of<br />Chocolate
          </h2>

          {/* Gold divider line */}
          <div style={{
            width: "60px",
            height: "2px",
            backgroundColor: goldAccent,
            marginBottom: "24px",
          }} />

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "16px",
            lineHeight: 1.7,
            color: warmMocha,
            marginBottom: "32px",
            maxWidth: "380px",
          }}>
            Every Zeppoli creation begins with carefully sourced single-origin cacao, selected from estates that share our obsession with depth and nuance. We temper by hand, layer by intention, and finish with precision — because the difference between a good cake and an unforgettable one is felt in every bite.
          </p>

          <button
            onClick={() => router.push("/shop")}
            style={{
              alignSelf: "flex-start",
              border: `1px solid ${goldAccent}`,
              color: goldAccent,
              background: "transparent",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              padding: "14px 32px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = goldAccent;
              e.currentTarget.style.color = offWhite;
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = goldAccent;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Explore Flavours
          </button>
        </div>

        {/* Right: Product Image Full-Bleed */}
        <div style={{
          position: "relative",
          overflow: "hidden",
        }}>
          <img
            src="/product-1.jpg"
            alt="Featured Zeppoli signature chocolate cake at 45-degree angle"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              aspectRatio: "4/5",
              display: "block",
              transition: "transform 0.7s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          {/* Inset shadow at left edge for depth */}
          <div style={{
            position: "absolute",
            inset: 0,
            boxShadow: "inset 40px 0 60px rgba(0,0,0,0.22)",
            pointerEvents: "none",
          }} />
        </div>
      </section>

      {/* ── TASTE THE DECADENCE: Horizontal Carousel ── */}
      <section className="reveal" style={{
        backgroundColor: offWhite,
        padding: "96px 0 96px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 64px 40px" }} className="carousel-header">
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: mutedBrown,
            marginBottom: "12px",
          }}>
            Full Collection
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: deepCocoa,
              margin: 0,
            }}>
              Taste the Decadence
            </h2>
            <button
              onClick={() => router.push("/shop")}
              style={{
                border: "none",
                background: "none",
                color: goldAccent,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                letterSpacing: "0.01em",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                padding: "4px 0",
              }}
            >
              View All →
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          style={{
            display: "flex",
            gap: "32px",
            overflowX: "auto",
            padding: "16px 64px 32px",
            cursor: "grab",
            scrollbarWidth: "none",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
          onMouseDown={handleCarouselMouseDown}
          onMouseMove={handleCarouselMouseMove}
          onMouseUp={handleCarouselMouseUp}
          onMouseLeave={handleCarouselMouseUp}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                minWidth: "280px",
                flex: "0 0 280px",
                scrollSnapAlign: "start",
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                padding: "0 0 24px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
                transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1)",
                cursor: "pointer",
                overflow: "hidden",
              }}
              onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 48px rgba(45,27,19,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.07)";
              }}
            >
              <div style={{ overflow: "hidden", borderRadius: "4px 4px 0 0", aspectRatio: "4/5" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 400ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
                <h3 style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "17px",
                  color: deepCocoa,
                  margin: "0 0 6px",
                  textTransform: "capitalize",
                }}>
                  {p.name}
                </h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: mutedBrown,
                  margin: "0 0 10px",
                }}>
                  {p.id === 1 ? "Rich & Velvety" : p.id === 2 ? "Light & Fruity" : p.id === 3 ? "Classic & Decadent" : "Buttery & Caramel"}
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: goldAccent,
                  margin: 0,
                }}>
                  ₹{p.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p style={{
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px",
          color: mutedBrown,
          marginTop: "8px",
          letterSpacing: "0.04em",
        }}>
          ← Drag or swipe to explore →
        </p>
      </section>

      {/* ── CRAFTED WITH CARE ── */}
      <section className="reveal" style={{
        backgroundColor: deepCocoa,
        padding: "96px 64px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: warmMocha,
            textAlign: "center",
            marginBottom: "12px",
          }}>
            Why Zeppoli
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: offWhite,
            textAlign: "center",
            marginBottom: "72px",
          }}>
            Crafted With Care
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "48px",
          }}
            className="values-grid"
          >
            {[
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <ellipse cx="24" cy="34" rx="10" ry="6" stroke={goldAccent} strokeWidth="2" />
                    <path d="M14 34 C14 22 24 12 24 12 C24 12 34 22 34 34" stroke={goldAccent} strokeWidth="2" strokeLinecap="round" />
                    <path d="M19 26 C19 20 24 16 24 16 C24 16 29 20 29 26" stroke={goldAccent} strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="24" cy="13" r="2" fill={goldAccent} />
                  </svg>
                ),
                heading: "Finest Ingredients",
                body: "Single-origin cacao, farm-fresh dairy, and seasonal fruits — every ingredient is chosen for flavour, not convenience.",
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 8 C16 8 10 14 10 22 C10 30 16 38 24 40 C32 38 38 30 38 22 C38 14 32 8 24 8Z" stroke={goldAccent} strokeWidth="2" />
                    <path d="M18 22 L22 26 L30 18" stroke={goldAccent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14 Q8 6 16 4" stroke={goldAccent} strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M36 14 Q40 6 32 4" stroke={goldAccent} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
                heading: "Artisanal Baking",
                body: "Each cake is hand-layered, hand-frosted, and finished in small batches by our dedicated pâtissiers who treat every order as unique.",
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="6" y="20" width="36" height="20" rx="4" stroke={goldAccent} strokeWidth="2" />
                    <path d="M14 20 V16 C14 11.6 18.6 8 24 8 C29.4 8 34 11.6 34 16 V20" stroke={goldAccent} strokeWidth="2" strokeLinecap="round" />
                    <circle cx="24" cy="30" r="3" fill={goldAccent} />
                    <path d="M24 33 V37" stroke={goldAccent} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
                heading: "Freshly Delivered",
                body: "Baked to order and delivered within 24 hours. No freezing, no compromises — your celebration deserves nothing less.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "40px 24px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "background-color 300ms ease, transform 300ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(181,142,94,0.08)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ marginBottom: "24px" }}>{item.icon}</div>
                <h3 style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: offWhite,
                  marginBottom: "12px",
                }}>
                  {item.heading}
                </h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: warmMocha,
                  maxWidth: "280px",
                }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        backgroundColor: warmMocha,
        padding: "80px 64px 0",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "48px",
          paddingBottom: "64px",
        }}
          className="footer-grid"
        >
          {/* Col 1: Brand */}
          <div>
            <div style={{ marginBottom: "16px", padding: "4px 8px", display: "inline-block", borderRadius: "8px" }}>
              <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "32px", objectFit: "contain", opacity: 0.85 }} />
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: mutedBrown,
              marginBottom: "24px",
              lineHeight: 1.6,
            }}>
              Taste the Elegance
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              {[
                { label: "Instagram", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { label: "Facebook", d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { label: "Pinterest", d: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => window.open(`https://${s.label.toLowerCase()}.com`, "_blank")}
                  aria-label={s.label}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    transition: "color 150ms ease",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={mutedBrown}
                    onMouseEnter={(e) => (e.currentTarget.setAttribute("fill", goldAccent))}
                    onMouseLeave={(e) => (e.currentTarget.setAttribute("fill", mutedBrown))}
                  >
                    <path d={s.d} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Col 2: Shop */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: deepCocoa, marginBottom: "20px" }}>Shop</p>
            {["All Cakes", "Chocolate", "Cheesecakes", "Gifting", "Seasonal Specials"].map((l) => (
              <button key={l} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: mutedBrown, lineHeight: 2, cursor: "pointer", padding: 0, textAlign: "left", transition: "color 150ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = deepCocoa)}
                onMouseLeave={(e) => (e.currentTarget.style.color = mutedBrown)}
              >{l}</button>
            ))}
          </div>

          {/* Col 3: Discover */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: deepCocoa, marginBottom: "20px" }}>Discover</p>
            {["Our Story", "Ingredients", "Press", "FAQs", "Contact Us"].map((l) => (
              <button key={l} onClick={() => l === "Our Story" ? document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" }) : undefined} style={{ display: "block", background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: mutedBrown, lineHeight: 2, cursor: "pointer", padding: 0, textAlign: "left", transition: "color 150ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = deepCocoa)}
                onMouseLeave={(e) => (e.currentTarget.style.color = mutedBrown)}
              >{l}</button>
            ))}
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "18px", color: deepCocoa, marginBottom: "20px" }}>Stay in the loop</h3>
            {subscribed ? (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: goldAccent, lineHeight: 1.6 }}>Thank you for subscribing! 🎂</p>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  style={{
                    height: "48px",
                    width: "100%",
                    border: "1px solid #D5CECA",
                    borderRadius: "4px",
                    padding: "0 16px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    color: deepCocoa,
                    backgroundColor: "#FFFFFF",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={() => { if (email.trim()) { setSubscribed(true); setEmail(""); } }}
                  style={{
                    marginTop: "12px",
                    height: "48px",
                    width: "100%",
                    backgroundColor: goldAccent,
                    color: offWhite,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "15px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease, transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#9C774D";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = goldAccent;
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Subscribe
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{
          borderTop: "1px solid #D5CECA",
          padding: "24px 0",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: mutedBrown, margin: 0 }}>
            © 2026 Zeppoli Bakers. All rights reserved. · Privacy Policy · Terms of Service
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {["VISA", "MC", "AMEX", "UPI"].map((pay) => (
              <span key={pay} style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                color: mutedBrown,
                border: "1px solid #D5CECA",
                borderRadius: "4px",
                padding: "4px 8px",
                letterSpacing: "0.06em",
                opacity: 0.7,
              }}>
                {pay}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
          .art-split { grid-template-columns: 1fr !important; }
          .art-split > div:last-child { min-height: 360px; aspect-ratio: 4/5; }
          .sig-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .carousel-header { padding: 0 24px 32px !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          footer { padding: 64px 24px 0 !important; }
        }
        ::-webkit-scrollbar { display: none; }
        .reveal { will-change: opacity, transform; }
        *:focus-visible { outline: 2px solid #B58E5E; outline-offset: 3px; }
      `}</style>
    </div>
  );
}