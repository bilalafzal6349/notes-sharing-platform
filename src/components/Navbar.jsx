import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Upload, Home, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/auth");
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid hsla(258, 50%, 50%, 0.15)",
        background: "hsla(222, 47%, 5%, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          height: "64px",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "white",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px hsla(258,90%,60%,0.4)",
            }}
          >
            <BookOpen size={17} color="white" />
          </div>
          <span>
            Note<span style={{ color: "#a78bfa" }}>Share</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
          className="hidden-mobile"
        >
          <NavLink to="/" active={isActive("/")}>
            <Home size={15} />
            Home
          </NavLink>
          {user && (
            <NavLink to="/upload" active={isActive("/upload")}>
              <Upload size={15} />
              Upload Notes
            </NavLink>
          )}
        </nav>

        {/* Desktop auth */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
          className="hidden-mobile"
        >
          {user ? (
            <>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "hsl(215 20% 55%)",
                  maxWidth: "160px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  border: "1px solid hsla(0,80%,60%,0.25)",
                  background: "hsla(0,80%,60%,0.08)",
                  color: "hsl(0 80% 70%)",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "hsla(0,80%,60%,0.18)";
                  e.currentTarget.style.borderColor = "hsla(0,80%,60%,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "hsla(0,80%,60%,0.08)";
                  e.currentTarget.style.borderColor = "hsla(0,80%,60%,0.25)";
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "white",
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 4px 14px hsla(258,90%,60%,0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 20px hsla(258,90%,60%,0.5)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 14px hsla(258,90%,60%,0.35)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          style={{
            display: "none",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid hsla(258,50%,50%,0.2)",
            background: "transparent",
            color: "hsl(215 20% 70%)",
            cursor: "pointer",
          }}
          className="show-mobile"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid hsla(258,50%,50%,0.12)",
            background: "hsla(222,47%,6%,0.98)",
            padding: "12px 24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <MobileNavLink
            to="/"
            active={isActive("/")}
            onClick={() => setMobileOpen(false)}
          >
            <Home size={16} /> Home
          </MobileNavLink>
          {user && (
            <MobileNavLink
              to="/upload"
              active={isActive("/upload")}
              onClick={() => setMobileOpen(false)}
            >
              <Upload size={16} /> Upload Notes
            </MobileNavLink>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                color: "hsl(0 80% 70%)",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "white",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
                marginTop: "4px",
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      )}

      {/* Inline responsive CSS */}
      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

function NavLink({ to, active, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 14px",
        borderRadius: "8px",
        fontSize: "0.85rem",
        fontWeight: 500,
        textDecoration: "none",
        transition: "all 0.2s",
        color: active
          ? "#a78bfa"
          : hovered
          ? "hsl(210 40% 90%)"
          : "hsl(215 20% 60%)",
        background: active
          ? "hsla(258,80%,65%,0.12)"
          : hovered
          ? "hsla(258,50%,50%,0.08)"
          : "transparent",
        border: active
          ? "1px solid hsla(258,80%,65%,0.2)"
          : "1px solid transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, active, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 12px",
        borderRadius: "8px",
        fontSize: "0.9rem",
        fontWeight: 500,
        textDecoration: "none",
        color: active ? "#a78bfa" : "hsl(215 20% 70%)",
        background: active ? "hsla(258,80%,65%,0.1)" : "transparent",
      }}
    >
      {children}
    </Link>
  );
}
