import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../context/AuthContext";
import NoteCard from "../components/NoteCard";
import {
  Search,
  BookOpen,
  Loader2,
  Upload,
  X,
  Sparkles,
  GraduationCap,
  FileStack,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setNotes(data);
      setLoading(false);
    }
    fetchNotes();
  }, []);

  const filtered = notes.filter((note) => {
    const q = query.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.subject.toLowerCase().includes(q)
    );
  });

  const subjects = [...new Set(notes.map((n) => n.subject))];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "72px 24px 64px",
          borderBottom: "1px solid hsla(258,50%,50%,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative blobs */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsla(258,90%,66%,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsla(221,90%,60%,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Badge */}
          <div
            className="animate-fade-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "5px 14px",
              borderRadius: "999px",
              background: "hsla(258,80%,65%,0.12)",
              border: "1px solid hsla(258,80%,65%,0.25)",
              color: "#a78bfa",
              fontSize: "0.78rem",
              fontWeight: 600,
              marginBottom: "24px",
              letterSpacing: "0.03em",
            }}
          >
            <Sparkles size={13} />
            Student Notes Portal
          </div>

          {/* Heading */}
          <h1
            className="animate-fade-up delay-100"
            style={{
              margin: "0 0 18px",
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "hsl(210 40% 96%)",
              maxWidth: "700px",
            }}
          >
            Study smarter,{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              together.
            </span>
          </h1>

          <p
            className="animate-fade-up delay-200"
            style={{
              margin: "0 0 32px",
              fontSize: "1.1rem",
              color: "hsl(215 20% 55%)",
              lineHeight: 1.7,
              maxWidth: "520px",
            }}
          >
            Browse and download study notes shared by students across all
            subjects. Find what you need, or contribute your own.
          </p>

          {/* CTA */}
          <div
            className="animate-fade-up delay-300"
            style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
          >
            {user ? (
              <Link
                to="/upload"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px hsla(258,90%,60%,0.35)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 28px hsla(258,90%,60%,0.5)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px hsla(258,90%,60%,0.35)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Upload size={17} />
                Upload Your Notes
              </Link>
            ) : (
              <Link
                to="/auth"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px hsla(258,90%,60%,0.35)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 28px hsla(258,90%,60%,0.5)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px hsla(258,90%,60%,0.35)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Get Started Free
              </Link>
            )}
            <a
              href="#notes"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "10px",
                border: "1px solid hsla(258,50%,50%,0.25)",
                background: "hsla(258,50%,50%,0.06)",
                color: "hsl(215 20% 72%)",
                fontWeight: 500,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "hsla(258,50%,50%,0.12)";
                e.currentTarget.style.color = "hsl(210 40% 90%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "hsla(258,50%,50%,0.06)";
                e.currentTarget.style.color = "hsl(215 20% 72%)";
              }}
            >
              Browse Notes
            </a>
          </div>

          {/* Stats row */}
          {!loading && notes.length > 0 && (
            <div
              className="animate-fade-up"
              style={{
                display: "flex",
                gap: "32px",
                marginTop: "48px",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  icon: <FileStack size={18} />,
                  value: notes.length,
                  label: "Notes Shared",
                },
                {
                  icon: <BookOpen size={18} />,
                  value: subjects.length,
                  label: "Subjects Covered",
                },
                {
                  icon: <GraduationCap size={18} />,
                  value: "Free",
                  label: "Always",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 20px",
                    borderRadius: "12px",
                    background: "hsla(222,47%,12%,0.7)",
                    border: "1px solid hsla(258,50%,50%,0.12)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    style={{
                      color: "#a78bfa",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: "hsl(210 40% 96%)",
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: "0.75rem",
                        color: "hsl(215 20% 50%)",
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Notes Section ───────────────────────────────────────────── */}
      <main
        id="notes"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Search bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
            marginBottom: "36px",
          }}
        >
          <div style={{ position: "relative", flex: "1", minWidth: "240px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "hsl(215 20% 45%)",
                pointerEvents: "none",
              }}
            />
            <input
              type="search"
              placeholder="Search by title or subject…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search notes"
              style={{
                width: "100%",
                padding: "11px 40px",
                borderRadius: "10px",
                border: "1px solid hsla(258,50%,50%,0.18)",
                background: "hsla(222,47%,10%,0.8)",
                color: "hsl(210 40% 94%)",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                backdropFilter: "blur(10px)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "hsla(258,70%,60%,0.5)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px hsla(258,70%,60%,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "hsla(258,50%,50%,0.18)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "hsl(215 20% 45%)",
                  display: "flex",
                  padding: "2px",
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div
            style={{
              fontSize: "0.82rem",
              color: "hsl(215 20% 45%)",
              whiteSpace: "nowrap",
              padding: "8px 14px",
              borderRadius: "8px",
              background: "hsla(222,47%,12%,0.6)",
              border: "1px solid hsla(258,50%,50%,0.1)",
            }}
          >
            {loading
              ? "Loading…"
              : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="shimmer"
                style={{ height: "200px", borderRadius: "16px" }}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              maxWidth: "480px",
              margin: "0 auto",
              padding: "20px 24px",
              borderRadius: "12px",
              border: "1px solid hsla(0,80%,60%,0.2)",
              background: "hsla(0,80%,60%,0.08)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                color: "hsl(0 80% 70%)",
                fontSize: "0.9rem",
              }}
            >
              Failed to load notes
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "0.8rem",
                color: "hsl(0 60% 60%)",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 24px",
              textAlign: "center",
            }}
          >
            <div
              className="animate-float"
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "20px",
                background: "hsla(258,80%,65%,0.1)",
                border: "1px solid hsla(258,80%,65%,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <BookOpen size={30} color="#a78bfa" />
            </div>
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "hsl(210 40% 88%)",
              }}
            >
              {query ? "No results found" : "No notes yet"}
            </h3>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: "0.9rem",
                color: "hsl(215 20% 45%)",
                maxWidth: "320px",
                lineHeight: 1.6,
              }}
            >
              {query
                ? `Nothing matched "${query}". Try a different search term.`
                : "Be the first to share your study notes with the community."}
            </p>
            {!query && user && (
              <Link
                to="/upload"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "11px 22px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px hsla(258,90%,60%,0.3)",
                }}
              >
                <Upload size={16} />
                Upload Notes
              </Link>
            )}
          </div>
        )}

        {/* Notes grid */}
        {!loading && !error && filtered.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            }}
          >
            {filtered.map((note, i) => (
              <div
                key={note.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 60, 300)}ms` }}
              >
                <NoteCard note={note} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
