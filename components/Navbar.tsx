"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);
  const prevTotalRef = useRef(totalItems);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (prevTotalRef.current !== totalItems) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 500);
      prevTotalRef.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  const scrollToAbout = () => {
    setMobileOpen(false);
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinkStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: "16px",
    color: "#2D1B13",
    textDecoration: "none",
    padding: "0 20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
    lineHeight: "1",
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: scrolled ? "#F8F5F0" : "transparent",
          boxShadow: scrolled
            ? "0 2px 16px 0 rgba(175,39,45,0.10)"
            : "none",
          transition:
            "background-color 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav
          aria-label="Main navigation"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Logo */}
          <div style={{ flex: "0 0 auto" }}>
            <img
              src="/logo.png"
              alt="Zeppoli Bakers logo"
              style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
              onClick={() => router.push("/")}
            />
          </div>

          {/* Desktop nav links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            className="hidden-mobile"
          >
            <button
              style={navLinkStyle}
              onClick={() => router.push("/shop")}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#AF272D")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#2D1B13")
              }
              aria-label="Shop our cakes"
            >
              Shop
            </button>
            <button
              style={navLinkStyle}
              onClick={scrollToAbout}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#AF272D")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#2D1B13")
              }
              aria-label="Learn about us"
            >
              Our Story
            </button>
            <button
              style={navLinkStyle}
              onClick={scrollToAbout}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#AF272D")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#2D1B13")
              }
              aria-label="Custom and gift orders"
            >
              Gifting
            </button>
            <button
              style={navLinkStyle}
              onClick={scrollToAbout}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#AF272D")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#2D1B13")
              }
              aria-label="Contact us"
            >
              Contact
            </button>
          </div>

          {/* Right: cart + hamburger */}
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Cart button */}
            <button
              onClick={() => router.push("/checkout")}
              aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
                padding: "8px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.08)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)")
              }
              onMouseDown={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(0.95)")
              }
              onMouseUp={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.08)")
              }
            >
              {/* Cart SVG */}
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2D1B13"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {/* Badge */}
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "9999px",
                    backgroundColor: "#AF272D",
                    color: "#FDFBF8",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "1",
                    transform: badgePulse ? "scale(1.3)" : "scale(1)",
                    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: "0 1px 4px rgba(175,39,45,0.35)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="show-mobile"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "none",
                flexDirection: "column",
                gap: "5px",
                borderRadius: "8px",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  backgroundColor: "#2D1B13",
                  borderRadius: "2px",
                  transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                  transform: mobileOpen
                    ? "translateY(7px) rotate(45deg)"
                    : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  backgroundColor: "#2D1B13",
                  borderRadius: "2px",
                  transition: "opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  backgroundColor: "#2D1B13",
                  borderRadius: "2px",
                  transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                  transform: mobileOpen
                    ? "translateY(-7px) rotate(-45deg)"
                    : "none",
                }}
              />
            </button>
          </div>
        </nav>

        {/* Responsive styles injected via Tailwind workaround: we use a global class defined in globals.css */}
        {/* Mobile overlay menu */}
        <div
          aria-hidden={!mobileOpen}
          style={{
            position: "fixed",
            top: "72px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#F8F5F0",
            zIndex: 49,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: "48px",
            gap: "8px",
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? "auto" : "none",
            transition: "opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
          className="mobile-overlay"
        >
          <button
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#2D1B13",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "16px 32px",
              width: "100%",
              textAlign: "center",
              letterSpacing: "0.01em",
            }}
            onClick={() => {
              setMobileOpen(false);
              router.push("/shop");
            }}
          >
            Shop
          </button>
          <button
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#2D1B13",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "16px 32px",
              width: "100%",
              textAlign: "center",
              letterSpacing: "0.01em",
            }}
            onClick={scrollToAbout}
          >
            Our Story
          </button>
          <button
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#2D1B13",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "16px 32px",
              width: "100%",
              textAlign: "center",
              letterSpacing: "0.01em",
            }}
            onClick={scrollToAbout}
          >
            Gifting
          </button>
          <button
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "#2D1B13",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "16px 32px",
              width: "100%",
              textAlign: "center",
              letterSpacing: "0.01em",
            }}
            onClick={scrollToAbout}
          >
            Contact
          </button>
          <div
            style={{
              width: "48px",
              height: "2px",
              backgroundColor: "#C9826B",
              borderRadius: "2px",
              margin: "16px 0",
              opacity: 0.5,
            }}
          />
          <button
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              color: "#FDFBF8",
              backgroundColor: "#AF272D",
              border: "none",
              cursor: "pointer",
              padding: "14px 40px",
              borderRadius: "12px",
              letterSpacing: "0.02em",
            }}
            onClick={() => {
              setMobileOpen(false);
              router.push("/checkout");
            }}
          >
            View Cart
            {totalItems > 0 && (
              <span
                style={{
                  marginLeft: "8px",
                  backgroundColor: "#F8F5F0",
                  color: "#AF272D",
                  borderRadius: "9999px",
                  padding: "1px 7px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Responsive styles using a <style> block is disallowed for client components.
          We encode mobile rules via a helper div with className that maps to globals.css.
          The hamburger visibility and desktop link hiding is handled below using a
          server-safe inline approach: we conditionally render via window width state. */}
      <NavbarResponsiveHelper />
    </>
  );
}

function NavbarResponsiveHelper() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // We use a hidden div to patch the hamburger visibility via DOM.
  // Since we can't use inline <style> in client components, we rely on globals.css
  // for the .hidden-mobile / .show-mobile classes. This component signals the state.
  useEffect(() => {
    const hamburger = document.querySelector(
      ".show-mobile"
    ) as HTMLElement | null;
    const desktopLinks = document.querySelector(
      ".hidden-mobile"
    ) as HTMLElement | null;
    if (hamburger) hamburger.style.display = isMobile ? "flex" : "none";
    if (desktopLinks)
      desktopLinks.style.display = isMobile ? "none" : "flex";
  }, [isMobile]);

  return null;
}