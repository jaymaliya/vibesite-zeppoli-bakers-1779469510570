"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
  };

  const linkButtonStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: "15px",
    color: "#1A1A1A",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    textAlign: "left",
    display: "block",
    transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
    letterSpacing: "0.01em",
  };

  return (
    <footer
      style={{
        backgroundColor: "#F8F5F0",
        borderTop: "1px solid rgba(107,56,36,0.15)",
        paddingTop: "80px",
        paddingBottom: "48px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px",
            marginBottom: "64px",
          }}
        >
          {/* Column 1: Brand */}
          <div>
            <img
              src="/logo.png"
              alt="Zeppoli Bakers logo"
              style={{
                height: "32px",
                objectFit: "contain",
                opacity: 0.85,
                marginBottom: "20px",
                display: "block",
              }}
            />
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "#9B8B7D",
                lineHeight: "1.7",
                maxWidth: "260px",
                marginBottom: "24px",
              }}
            >
              Layered luxury, unmistakably crafted. Every cake is hand-finished
              in our Bangalore kitchen — made to mark your most meaningful
              moments.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {/* Instagram */}
              <a
                href="/"
                aria-label="Follow Zeppoli Bakers on Instagram"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(107,56,36,0.10)",
                  transition: "background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                  color: "#6B3824",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "rgba(107,56,36,0.20)";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "rgba(107,56,36,0.10)";
                  el.style.transform = "translateY(0)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B3824"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="/"
                aria-label="Follow Zeppoli Bakers on Twitter"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(107,56,36,0.10)",
                  transition: "background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "rgba(107,56,36,0.20)";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "rgba(107,56,36,0.10)";
                  el.style.transform = "translateY(0)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B3824"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 4l16 16M4 20L20 4" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Zeppoli Bakers on WhatsApp"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(107,56,36,0.10)",
                  transition: "background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "rgba(107,56,36,0.20)";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "rgba(107,56,36,0.10)";
                  el.style.transform = "translateY(0)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B3824"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "18px",
                color: "#6B3824",
                letterSpacing: "0.04em",
                marginBottom: "24px",
                fontWeight: 600,
              }}
            >
              Quick Links
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <button
                style={linkButtonStyle}
                onClick={() => router.push("/")}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#AF272D")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A")
                }
              >
                Home
              </button>
              <button
                style={linkButtonStyle}
                onClick={() => router.push("/shop")}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#AF272D")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A")
                }
              >
                Shop
              </button>
              <button
                style={linkButtonStyle}
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#AF272D")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A")
                }
              >
                Our Story
              </button>
              <button
                style={linkButtonStyle}
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#AF272D")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A")
                }
              >
                Gifting
              </button>
              <button
                style={linkButtonStyle}
                onClick={() => router.push("/checkout")}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#AF272D")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A")
                }
              >
                Cart &amp; Checkout
              </button>
            </div>
          </div>

          {/* Column 3: Info */}
          <div>
            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "18px",
                color: "#6B3824",
                letterSpacing: "0.04em",
                marginBottom: "24px",
                fontWeight: 600,
              }}
            >
              Good to Know
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9826B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginTop: "2px", flexShrink: 0 }}
                  aria-hidden="true"
                >
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#9B8B7D",
                    lineHeight: "1.6",
                  }}
                >
                  Made in India — Bangalore kitchen
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9826B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginTop: "2px", flexShrink: 0 }}
                  aria-hidden="true"
                >
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 4v3h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#9B8B7D",
                    lineHeight: "1.6",
                  }}
                >
                  Free delivery on orders over ₹1,499
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9826B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginTop: "2px", flexShrink: 0 }}
                  aria-hidden="true"
                >
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
                  <polyline points="9 11 12 14 17 9" />
                </svg>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#9B8B7D",
                    lineHeight: "1.6",
                  }}
                >
                  Secured checkout via Razorpay
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9826B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginTop: "2px", flexShrink: 0 }}
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#9B8B7D",
                    lineHeight: "1.6",
                  }}
                >
                  100% handcrafted, no preservatives
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "18px",
                color: "#6B3824",
                letterSpacing: "0.04em",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Stay in the loop
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#9B8B7D",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              New flavours, seasonal specials, and early access to limited drops —
              straight to your inbox.
            </p>
            {subscribed ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  backgroundColor: "rgba(107,56,36,0.10)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B3824"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#6B3824",
                  }}
                >
                  You&apos;re on the list. Thank you!
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                noValidate
              >
                <div style={{ display: "flex", gap: "0" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="your@email.com"
                    aria-label="Email address for newsletter"
                    required
                    style={{
                      flex: 1,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      color: "#1A1A1A",
                      backgroundColor: "#FFFFFF",
                      border: "1.5px solid rgba(107,56,36,0.25)",
                      borderRight: "none",
                      borderRadius: "12px 0 0 12px",
                      padding: "12px 16px",
                      outline: "none",
                      transition: "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor =
                        "#AF272D";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor =
                        "rgba(107,56,36,0.25)";
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#F8F5F0",
                      backgroundColor: "#AF272D",
                      border: "1.5px solid #AF272D",
                      borderRadius: "0 12px 12px 0",
                      padding: "12px 20px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.backgroundColor = "#8B1F24";
                      el.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.backgroundColor = "#AF272D";
                      el.style.transform = "scale(1)";
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(0.98)";
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1.02)";
                    }}
                  >
                    Subscribe
                  </button>
                </div>
                {emailError && (
                  <p
                    role="alert"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      color: "#AF272D",
                      margin: "0",
                      paddingLeft: "4px",
                    }}
                  >
                    {emailError}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "rgba(107,56,36,0.15)",
            marginBottom: "32px",
          }}
          aria-hidden="true"
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#9B8B7D",
              margin: "0",
            }}
          >
            &copy; {new Date().getFullYear()} Zeppoli Bakers. All rights reserved.
            &nbsp;&nbsp;Made with care in India.
          </p>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <button
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#9B8B7D",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#6B3824")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#9B8B7D")
              }
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Privacy Policy
            </button>
            <button
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#9B8B7D",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#6B3824")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#9B8B7D")
              }
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Terms of Use
            </button>
            <button
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#9B8B7D",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#6B3824")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#9B8B7D")
              }
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Shipping Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}