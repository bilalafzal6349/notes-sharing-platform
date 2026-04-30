import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
  BookOpen,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Users,
  Download,
} from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const isLogin = mode === "login";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage(
          "Account created! Check your email to confirm your address, then sign in."
        );
        setMode("login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const features = [
    { icon: <CheckCircle size={15} />, text: "Upload & share PDF notes instantly" },
    { icon: <Users size={15} />, text: "Browse notes from all subjects" },
    { icon: <Download size={15} />, text: "Download materials for free" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div
        className="auth-left-panel"
        style={{
          width: "48%",
          flexShrink: 0,
          background:
            "linear-gradient(160deg, hsla(258,70%,18%,0.95) 0%, hsla(222,70%,10%,0.98) 100%)",
          borderRight: "1px solid hsla(258,50%,50%,0.12)",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* BG decoration */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsla(258,90%,66%,0.15) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsla(221,90%,60%,0.1) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "white",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "hsla(258,80%,65%,0.25)",
              border: "1px solid hsla(258,80%,65%,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={18} color="#c4b5fd" />
          </div>
          Note<span style={{ color: "#a78bfa" }}>Share</span>
        </div>

        {/* Main copy */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "999px",
              background: "hsla(258,80%,65%,0.15)",
              border: "1px solid hsla(258,80%,65%,0.25)",
              color: "#c4b5fd",
              fontSize: "0.75rem",
              fontWeight: 600,
              marginBottom: "20px",
              letterSpacing: "0.04em",
            }}
          >
            <Sparkles size={12} />
            JOIN THE COMMUNITY
          </div>

          <h2
            style={{
              margin: "0 0 16px",
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "hsl(210 40% 96%)",
            }}
          >
            Your knowledge,{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa, #818cf8, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              shared with the world.
            </span>
          </h2>
          <p
            style={{
              margin: "0 0 32px",
              color: "hsl(215 20% 58%)",
              fontSize: "1rem",
              lineHeight: 1.7,
            }}
          >
            Join thousands of students uploading and discovering study notes
            across every subject.
          </p>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
            {features.map((f) => (
              <li
                key={f.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "0.9rem",
                  color: "hsl(215 20% 65%)",
                }}
              >
                <span
                  style={{
                    color: "#a78bfa",
                    display: "flex",
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <p
          style={{
            fontSize: "0.75rem",
            color: "hsl(215 20% 40%)",
            position: "relative",
          }}
        >
          © {new Date().getFullYear()} NoteShare · Built for students.
        </p>
      </div>

      {/* ── Right panel (form) ──────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 32px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          {/* Mobile logo */}
          <div
            className="auth-mobile-logo"
            style={{
              display: "none",
              alignItems: "center",
              gap: "10px",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "white",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px hsla(258,90%,60%,0.4)",
              }}
            >
              <BookOpen size={17} color="white" />
            </div>
            Note<span style={{ color: "#a78bfa" }}>Share</span>
          </div>

          {/* Card */}
          <div
            className="animate-fade-up"
            style={{
              borderRadius: "20px",
              border: "1px solid hsla(258,50%,50%,0.18)",
              background: "hsla(222,47%,9%,0.85)",
              backdropFilter: "blur(20px)",
              padding: "36px",
              boxShadow: "0 24px 64px hsla(222,60%,5%,0.5)",
            }}
          >
            {/* Heading */}
            <div style={{ marginBottom: "28px" }}>
              <h1
                style={{
                  margin: "0 0 6px",
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: "hsl(210 40% 96%)",
                  letterSpacing: "-0.01em",
                }}
              >
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "hsl(215 20% 50%)" }}>
                {isLogin
                  ? "Sign in to your account to continue."
                  : "Join the community and start sharing notes."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    color: "hsl(215 20% 65%)",
                    marginBottom: "7px",
                  }}
                >
                  Email address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={15}
                    style={{
                      position: "absolute",
                      left: "13px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "hsl(215 20% 45%)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    style={{
                      width: "100%",
                      padding: "11px 13px 11px 38px",
                      borderRadius: "10px",
                      border: "1px solid hsla(258,50%,50%,0.2)",
                      background: "hsla(222,47%,12%,0.8)",
                      color: "hsl(210 40% 94%)",
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "hsla(258,70%,60%,0.5)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px hsla(258,70%,60%,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "hsla(258,50%,50%,0.2)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    color: "hsl(215 20% 65%)",
                    marginBottom: "7px",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={15}
                    style={{
                      position: "absolute",
                      left: "13px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "hsl(215 20% 45%)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    id="password"
                    type="password"
                    placeholder={isLogin ? "Your password" : "Min. 6 characters"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    style={{
                      width: "100%",
                      padding: "11px 13px 11px 38px",
                      borderRadius: "10px",
                      border: "1px solid hsla(258,50%,50%,0.2)",
                      background: "hsla(222,47%,12%,0.8)",
                      color: "hsl(210 40% 94%)",
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "hsla(258,70%,60%,0.5)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px hsla(258,70%,60%,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "hsla(258,50%,50%,0.2)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid hsla(0,80%,60%,0.25)",
                    background: "hsla(0,80%,60%,0.08)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "hsl(0 80% 70%)" }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Success */}
              {message && (
                <div
                  style={{
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid hsla(142,70%,45%,0.25)",
                    background: "hsla(142,70%,45%,0.08)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "hsl(142 70% 60%)" }}>
                    {message}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  background: loading
                    ? "hsla(258,50%,40%,0.5)"
                    : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  color: "white",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 16px hsla(258,90%,60%,0.35)",
                  transition: "all 0.2s",
                  marginTop: "4px",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow =
                      "0 6px 24px hsla(258,90%,60%,0.5)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px hsla(258,90%,60%,0.35)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? (
                  <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "22px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "hsla(258,50%,50%,0.15)",
                }}
              />
              <span style={{ fontSize: "0.75rem", color: "hsl(215 20% 42%)" }}>
                {isLogin ? "New to NoteShare?" : "Already have an account?"}
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "hsla(258,50%,50%,0.15)",
                }}
              />
            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={() => {
                setMode(isLogin ? "signup" : "login");
                setError(null);
                setMessage(null);
              }}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: "10px",
                border: "1px solid hsla(258,50%,50%,0.2)",
                background: "transparent",
                color: "hsl(215 20% 65%)",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "hsla(258,50%,50%,0.08)";
                e.currentTarget.style.color = "hsl(210 40% 85%)";
                e.currentTarget.style.borderColor = "hsla(258,50%,50%,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "hsl(215 20% 65%)";
                e.currentTarget.style.borderColor = "hsla(258,50%,50%,0.2)";
              }}
            >
              {isLogin ? "Create a free account" : "Sign in instead"}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive style */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          .auth-mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
