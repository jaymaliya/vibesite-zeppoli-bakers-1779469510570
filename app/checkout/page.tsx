"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], clearCart } = useCart() ?? {};

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap";
    document.head.appendChild(link);
    link.onload = () => setFontsLoaded(true);

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(24px)";
      (el as HTMLElement).style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const getPrice = (item: { price: number }) => item.price === 0 ? 799 : item.price;

  const subtotal = items.reduce((sum, item) => sum + getPrice(item) * (item.quantity || 1), 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 99;
  const total = subtotal + shipping;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pin.trim() || !/^\d{6}$/.test(form.pin)) newErrors.pin = "Enter a valid 6-digit PIN code";
    return newErrors;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handlePlaceOrder = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsPlacing(true);
    try {
      let order: { amount: number; id?: string } = { amount: total * 100 };
      try {
        const res = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total * 100 }),
        });
        if (res.ok) order = await res.json();
      } catch (_) {}

      const loadRazorpay = () =>
        new Promise<void>((resolve) => {
          if ((window as any).Razorpay) { resolve(); return; }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          document.body.appendChild(script);
        });

      await loadRazorpay();

      const options = {
        key: "rzp_test_",
        amount: order.amount || total * 100,
        currency: "INR",
        name: "Zeppoli Bakers",
        description: "Handcrafted with Passion. Delivered Fresh.",
        image: "/logo.png",
        handler: () => {
          clearCart?.();
          router.push("/");
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#AF272D" },
        modal: {
          ondismiss: () => setIsPlacing(false),
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      setIsPlacing(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    height: "52px",
    padding: "0 16px",
    border: `1px solid ${errors[field] ? "#AF272D" : "#D5CECA"}`,
    borderRadius: "8px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "15px",
    color: "#1A1A1A",
    background: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    color: "#6B3824",
    marginBottom: "6px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };

  const navLinks = [
    { label: "Cakes", action: () => router.push("/shop") },
    { label: "Collections", action: () => router.push("/shop") },
    { label: "Our Story", action: () => router.push("/") },
    { label: "Gifting", action: () => router.push("/shop") },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--bg, #F8F5F0)", minHeight: "100vh", color: "#1A1A1A" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "#F8F5F0" : "transparent",
        borderBottom: scrolled ? "1px solid #D5CECA" : "none",
        transition: "background 0.25s ease, border-bottom 0.25s ease",
        padding: "0 48px",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>

          {/* Logo */}
          <div style={{ padding: "4px 8px", borderRadius: "8px", background: scrolled ? "transparent" : "rgba(255,255,255,0.1)" }}>
            <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
          </div>

          {/* Desktop Nav */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }} className="desktop-nav">
            {navLinks.map((l) => (
              <button key={l.label} onClick={l.action} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600, color: "#1A1A1A", padding: "8px 20px", borderRadius: "8px", transition: "color 0.15s ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#AF272D")}
                onMouseLeave={e => (e.currentTarget.style.color = "#1A1A1A")}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Cart Icon */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => router.push("/checkout")} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "8px" }}>
              <svg width="24" height="24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {items.length > 0 && (
                <span style={{ position: "absolute", top: "2px", right: "2px", width: "18px", height: "18px", borderRadius: "999px", background: "#AF272D", color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {items.reduce((s, i) => s + (i.quantity || 1), 0)}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button onClick={() => setMobileNavOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none" }} className="hamburger-btn">
              <svg width="24" height="24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#F8F5F0", display: "flex", flexDirection: "column", padding: "32px" }}>
          <button onClick={() => setMobileNavOpen(false)} style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
            <svg width="24" height="24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "32px" }}>
            {navLinks.map((l) => (
              <button key={l.label} onClick={() => { setMobileNavOpen(false); l.action(); }} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif", fontSize: "24px", fontWeight: 600, color: "#1A1A1A", padding: "16px 0", borderBottom: "1px solid #D5CECA" }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 48px 96px" }}>

        {/* Page Heading */}
        <div className="reveal" style={{ marginBottom: "48px" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "#9B8B7D", display: "block", marginBottom: "12px" }}>
            Almost There
          </span>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.02em", lineHeight: 1.0, color: "#1A1A1A", margin: 0 }}>
            Complete Your Order
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#9B8B7D", marginTop: "12px", lineHeight: 1.6 }}>
            Handcrafted with Passion. Delivered Fresh to Your Door.
          </p>
        </div>

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <div className="reveal" style={{ textAlign: "center", padding: "80px 24px", background: "#FFFFFF", borderRadius: "16px", boxShadow: "0 8px 32px rgba(175,39,45,0.08)" }}>
            <svg width="64" height="64" fill="none" stroke="#9B8B7D" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: "24px" }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", letterSpacing: "0.04em", color: "#1A1A1A", margin: "0 0 12px" }}>
              Your Cart is Empty
            </h2>
            <p style={{ fontSize: "16px", color: "#9B8B7D", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 32px" }}>
              Looks like you haven't added any cakes yet. Let's fix that.
            </p>
            <button onClick={() => router.push("/shop")}
              style={{ padding: "16px 40px", background: "#AF272D", color: "#fff", border: "none", borderRadius: "12px", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "transform 0.2s ease, background 0.2s ease", boxShadow: "0 10px 30px -10px #AF272D80" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "#8E1F24"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#AF272D"; }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
              Start Shopping
            </button>
          </div>
        ) : (
          /* ── CHECKOUT SPLIT LAYOUT ── */
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px" }} className="checkout-grid">

            {/* ── LEFT: Delivery Form ── */}
            <div className="reveal" style={{ background: "#FFFFFF", borderRadius: "16px", padding: "40px", boxShadow: "0 8px 40px rgba(175,39,45,0.07)" }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.04em", color: "#1A1A1A", margin: "0 0 32px" }}>
                Delivery Details
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="form-grid">

                {/* Full Name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" value={form.fullName} onChange={e => handleChange("fullName", e.target.value)}
                    placeholder="Priya Sharma" style={inputStyle("fullName")}
                    onFocus={e => (e.currentTarget.style.borderColor = "#AF272D")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors["fullName"] ? "#AF272D" : "#D5CECA")} />
                  {errors.fullName && <p style={{ fontSize: "12px", color: "#AF272D", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)}
                    placeholder="priya@example.com" style={inputStyle("email")}
                    onFocus={e => (e.currentTarget.style.borderColor = "#AF272D")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors["email"] ? "#AF272D" : "#D5CECA")} />
                  {errors.email && <p style={{ fontSize: "12px", color: "#AF272D", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)}
                    placeholder="9876543210" maxLength={10} style={inputStyle("phone")}
                    onFocus={e => (e.currentTarget.style.borderColor = "#AF272D")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors["phone"] ? "#AF272D" : "#D5CECA")} />
                  {errors.phone && <p style={{ fontSize: "12px", color: "#AF272D", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>{errors.phone}</p>}
                </div>

                {/* Address */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Street Address</label>
                  <input type="text" value={form.address} onChange={e => handleChange("address", e.target.value)}
                    placeholder="123, MG Road, Indiranagar" style={inputStyle("address")}
                    onFocus={e => (e.currentTarget.style.borderColor = "#AF272D")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors["address"] ? "#AF272D" : "#D5CECA")} />
                  {errors.address && <p style={{ fontSize: "12px", color: "#AF272D", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>{errors.address}</p>}
                </div>

                {/* City */}
                <div>
                  <label style={labelStyle}>City</label>
                  <input type="text" value={form.city} onChange={e => handleChange("city", e.target.value)}
                    placeholder="Bengaluru" style={inputStyle("city")}
                    onFocus={e => (e.currentTarget.style.borderColor = "#AF272D")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors["city"] ? "#AF272D" : "#D5CECA")} />
                  {errors.city && <p style={{ fontSize: "12px", color: "#AF272D", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>{errors.city}</p>}
                </div>

                {/* State */}
                <div>
                  <label style={labelStyle}>State</label>
                  <input type="text" value={form.state} onChange={e => handleChange("state", e.target.value)}
                    placeholder="Karnataka" style={inputStyle("state")}
                    onFocus={e => (e.currentTarget.style.borderColor = "#AF272D")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors["state"] ? "#AF272D" : "#D5CECA")} />
                  {errors.state && <p style={{ fontSize: "12px", color: "#AF272D", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>{errors.state}</p>}
                </div>

                {/* PIN */}
                <div>
                  <label style={labelStyle}>PIN Code</label>
                  <input type="text" value={form.pin} onChange={e => handleChange("pin", e.target.value)}
                    placeholder="560038" maxLength={6} style={inputStyle("pin")}
                    onFocus={e => (e.currentTarget.style.borderColor = "#AF272D")}
                    onBlur={e => (e.currentTarget.style.borderColor = errors["pin"] ? "#AF272D" : "#D5CECA")} />
                  {errors.pin && <p style={{ fontSize: "12px", color: "#AF272D", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>{errors.pin}</p>}
                </div>

              </div>

              {/* Trust signals */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #F0EDE8" }}>
                {[
                  { icon: <svg width="16" height="16" fill="none" stroke="#AF272D" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "Secure Payment" },
                  { icon: <svg width="16" height="16" fill="none" stroke="#AF272D" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: "Fresh Delivery" },
                  { icon: <svg width="16" height="16" fill="none" stroke="#AF272D" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, text: "Made with Love" },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {t.icon}
                    <span style={{ fontSize: "13px", color: "#9B8B7D", fontFamily: "'DM Sans', sans-serif" }}>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Summary Card */}
              <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "40px", boxShadow: "0 8px 40px rgba(175,39,45,0.07)" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.04em", color: "#1A1A1A", margin: "0 0 28px" }}>
                  Order Summary
                </h2>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "28px" }}>
                  {items.map((item, idx) => {
                    const price = item.price === 0 ? 799 : item.price;
                    return (
                      <div key={item.id || idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                        <div style={{ overflow: "hidden", borderRadius: "8px", flexShrink: 0, width: "72px", height: "72px", background: "#F8F5F0" }}>
                          <img src={item.image || `/product-${(idx % 4) + 1}.jpg`} alt={item.name || "Cake"}
                            style={{ width: "72px", height: "72px", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }}
                            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px", lineHeight: 1.3 }}>{item.name}</p>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#9B8B7D", margin: "0 0 4px" }}>Qty: {item.quantity || 1}</p>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600, color: "#AF272D", margin: 0 }}>
                            ₹{(price * (item.quantity || 1)).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "#F0EDE8", margin: "0 0 20px" }} />

                {/* Promo Hint */}
                {subtotal < 500 && (
                  <div style={{ background: "#FFF5F5", border: "1px solid #FECDD3", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="16" height="16" fill="none" stroke="#AF272D" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#AF272D", margin: 0 }}>
                      Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for <strong>FREE shipping</strong>
                    </p>
                  </div>
                )}

                {/* Totals */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#9B8B7D" }}>Subtotal</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#1A1A1A", fontWeight: 500 }}>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#9B8B7D" }}>Shipping</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: shipping === 0 ? "#22863A" : "#1A1A1A", fontWeight: 500 }}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div style={{ height: "1px", background: "#F0EDE8" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.04em", color: "#1A1A1A" }}>Total</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.04em", color: "#AF272D" }}>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* CTA */}
                <button onClick={handlePlaceOrder} disabled={isPlacing}
                  style={{
                    width: "100%",
                    height: "56px",
                    marginTop: "28px",
                    background: isPlacing ? "#C9826B" : "#AF272D",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    cursor: isPlacing ? "not-allowed" : "pointer",
                    letterSpacing: "0.02em",
                    transition: "transform 0.2s ease, background 0.2s ease",
                    boxShadow: "0 10px 30px -10px #AF272D80",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                  onMouseEnter={e => { if (!isPlacing) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "#8E1F24"; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = isPlacing ? "#C9826B" : "#AF272D"; }}
                  onMouseDown={e => { if (!isPlacing) e.currentTarget.style.transform = "scale(0.98)"; }}
                  onMouseUp={e => { if (!isPlacing) e.currentTarget.style.transform = "scale(1.02)"; }}>
                  {isPlacing ? (
                    <>
                      <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      Place Order / Pay Now
                    </>
                  )}
                </button>

                <p style={{ textAlign: "center", fontSize: "12px", color: "#9B8B7D", marginTop: "16px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
                  Secured by Razorpay · UPI · Cards · Netbanking
                </p>

                {/* Payment icons row */}
                <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "12px" }}>
                  {["VISA", "MC", "UPI", "AMEX"].map((p) => (
                    <div key={p} style={{ padding: "4px 10px", border: "1px solid #D5CECA", borderRadius: "6px", background: "#F8F5F0" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#9B8B7D", letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif" }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Fingerprint: Editorial Split (mini) — featured cake highlight */}
              <div style={{
                borderRadius: "16px",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "35% 65%",
                minHeight: "200px",
                background: "#2D1B13",
                boxShadow: "0 16px 48px rgba(45,27,19,0.3)",
              }}>
                {/* Left text column */}
                <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px", background: "#2D1B13" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "#C9826B", fontWeight: 600 }}>Crafted For You</span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#FDFBF8", margin: 0 }}>
                    Worth Every Bite
                  </h3>
                  <div style={{ width: "40px", height: "2px", background: "#C9826B", margin: "4px 0" }} />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: 1.6, color: "#EAE3DB", margin: 0 }}>
                    Baked fresh, delivered same-day within Bengaluru.
                  </p>
                </div>
                {/* Right image column */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src="/product-1.jpg" alt="Decadent chocolate cake by Zeppoli Bakers"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: "200px", transition: "transform 0.6s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                  <div style={{ position: "absolute", inset: 0, boxShadow: "inset 40px 0 40px rgba(45,27,19,0.35)" }} />
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#EAE3DB", borderTop: "1px solid #D5CECA", padding: "64px 48px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", paddingBottom: "48px" }}>

            {/* Col 1: Brand */}
            <div>
              <img src="/logo.png" alt="Zeppoli Bakers" style={{ height: "32px", objectFit: "contain", opacity: 0.85, marginBottom: "12px" }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#7A6A61", lineHeight: 1.6, margin: "0 0 20px" }}>Taste the Elegance</p>
              <div style={{ display: "flex", gap: "16px" }}>
                {[
                  <svg key="ig" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
                  <svg key="fb" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                  <svg key="pt" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.87 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.16 1.22-5.16s-.31-.62-.31-1.55c0-1.45.84-2.54 1.89-2.54.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.49-.25 1.04.52 1.89 1.55 1.89 1.86 0 3.11-2.4 3.11-5.24 0-2.16-1.46-3.78-4.1-3.78-2.99 0-4.85 2.24-4.85 4.74 0 .86.25 1.46.64 1.93.18.21.2.3.14.54-.05.17-.15.59-.2.75-.06.25-.26.34-.48.25-1.33-.55-1.95-2.01-1.95-3.67 0-2.72 2.3-6.0 6.88-6.0 3.67 0 6.08 2.66 6.08 5.52 0 3.78-2.1 6.6-5.19 6.6-1.04 0-2.02-.56-2.35-1.2l-.65 2.47c-.24.89-.87 2.02-1.3 2.7.98.3 2.01.46 3.09.46 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>,
                ].map((icon, i) => (
                  <button key={i} style={{ background: "none", border: "none", cursor: "pointer", color: "#7A6A61", padding: "4px", transition: "color 0.2s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#AF272D")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#7A6A61")}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 2: Shop */}
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "#1A1A1A", marginBottom: "16px" }}>Shop</p>
              {["All Cakes", "Chocolate", "Cheesecakes", "Gifting", "Seasonal Specials"].map((link) => (
                <p key={link} style={{ margin: "0 0 2px" }}>
                  <button onClick={() => router.push("/shop")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#7A6A61", padding: "6px 0", transition: "color 0.15s ease", lineHeight: 2 }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#AF272D")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#7A6A61")}>
                    {link}
                  </button>
                </p>
              ))}
            </div>

            {/* Col 3: Discover */}
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "#1A1A1A", marginBottom: "16px" }}>Discover</p>
              {["Our Story", "Ingredients", "Press", "FAQs", "Contact Us"].map((link) => (
                <p key={link} style={{ margin: "0 0 2px" }}>
                  <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#7A6A61", padding: "6px 0", transition: "color 0.15s ease", lineHeight: 2 }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#AF272D")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#7A6A61")}>
                    {link}
                  </button>
                </p>
              ))}
            </div>

            {/* Col 4: Newsletter */}
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600, color: "#1A1A1A", marginBottom: "16px" }}>Stay in the loop</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{ borderTop: "1px solid #D5CECA", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#7A6A61", margin: 0 }}>
              © 2026 Zeppoli Bakers. All rights reserved. · Privacy Policy · Terms of Service
            </p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {["VISA", "MC", "AMEX", "UPI"].map((p) => (
                <div key={p} style={{ padding: "3px 8px", border: "1px solid #D5CECA", borderRadius: "4px", background: "#fff" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#9B8B7D", fontFamily: "'DM Sans', sans-serif" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Responsive + animation styles */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .checkout-grid { grid-template-columns: 60% 40% !important; }
          .desktop-nav { display: flex !important; }
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          main { padding: 40px 20px 64px !important; }
          footer { padding: 48px 20px 0 !important; }
        }
        input:focus { outline: none; border-color: #AF272D !important; }
        button:focus-visible { outline: 2px solid #AF272D; outline-offset: 2px; }
      `}</style>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return submitted ? (
    <div style={{ padding: "16px", background: "#FFF5F5", borderRadius: "8px", border: "1px solid #FECDD3" }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#AF272D", fontWeight: 600, margin: 0 }}>
        Thank you for subscribing! 🎂
      </p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
        style={{ height: "48px", width: "100%", border: "1px solid #D5CECA", borderRadius: "8px", padding: "0 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", background: "#fff", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s ease" }}
        onFocus={e => (e.currentTarget.style.borderColor = "#AF272D")}
        onBlur={e => (e.currentTarget.style.borderColor = "#D5CECA")} />
      <button type="submit"
        style={{ height: "48px", background: "#AF272D", color: "#FDFBF8", border: "none", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600, cursor: "pointer", transition: "background 0.2s ease, transform 0.2s ease" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#8E1F24"; e.currentTarget.style.transform = "scale(1.02)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#AF272D"; e.currentTarget.style.transform = "scale(1)"; }}>
        Subscribe
      </button>
    </form>
  );
}