import { Download, FileText, Calendar, Tag } from "lucide-react";
import { useState } from "react";

// Deterministic accent from subject string
const ACCENTS = [
  { grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", light: "hsla(258,80%,65%,0.15)", text: "#a78bfa", bar: "#7c3aed" },
  { grad: "linear-gradient(135deg,#2563eb,#1d4ed8)", light: "hsla(221,80%,60%,0.15)", text: "#93c5fd", bar: "#2563eb" },
  { grad: "linear-gradient(135deg,#059669,#047857)", light: "hsla(160,80%,40%,0.15)", text: "#6ee7b7", bar: "#059669" },
  { grad: "linear-gradient(135deg,#d97706,#b45309)", light: "hsla(38,80%,50%,0.15)",  text: "#fcd34d", bar: "#d97706" },
  { grad: "linear-gradient(135deg,#db2777,#be185d)", light: "hsla(328,80%,60%,0.15)", text: "#f9a8d4", bar: "#db2777" },
  { grad: "linear-gradient(135deg,#0891b2,#0e7490)", light: "hsla(194,80%,45%,0.15)", text: "#67e8f9", bar: "#0891b2" },
];

function subjectAccent(subject = "") {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) hash += subject.charCodeAt(i);
  return ACCENTS[hash % ACCENTS.length];
}

export default function NoteCard({ note }) {
  const { title, subject, description, file_url, created_at } = note;
  const accent = subjectAccent(subject);
  const [hovered, setHovered] = useState(false);

  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        overflow: "hidden",
        border: hovered
          ? "1px solid hsla(258,60%,60%,0.35)"
          : "1px solid hsla(258,50%,50%,0.12)",
        background: "hsla(222,47%,9%,0.8)",
        backdropFilter: "blur(12px)",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 40px hsla(222,60%,5%,0.6), 0 0 0 1px hsla(258,60%,60%,0.1)"
          : "0 4px 16px hsla(222,60%,5%,0.3)",
        height: "100%",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: "3px",
          width: "100%",
          background: accent.grad,
        }}
      />

      {/* Header */}
      <div style={{ padding: "18px 20px 12px" }}>
        {/* Subject badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "999px",
            background: accent.light,
            color: accent.text,
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            marginBottom: "12px",
            border: `1px solid ${accent.text}22`,
          }}
        >
          <Tag size={11} />
          {subject}
        </div>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: hovered ? accent.light : "hsla(222,47%,14%,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
              border: "1px solid hsla(258,50%,50%,0.12)",
            }}
          >
            <FileText size={16} color={hovered ? accent.text : "hsl(215 20% 55%)"} />
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "hsl(210 40% 94%)",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: "0 20px", flex: 1 }}>
        {description ? (
          <p
            style={{
              margin: 0,
              fontSize: "0.83rem",
              color: "hsl(215 20% 50%)",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        ) : (
          <p
            style={{
              margin: 0,
              fontSize: "0.83rem",
              color: "hsl(215 20% 40%)",
              fontStyle: "italic",
            }}
          >
            No description provided.
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          marginTop: "14px",
          borderTop: "1px solid hsla(258,50%,50%,0.1)",
          background: "hsla(222,47%,7%,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "0.75rem",
            color: "hsl(215 20% 45%)",
          }}
        >
          <Calendar size={12} />
          {formattedDate}
        </div>
        <a
          href={file_url}
          target="_blank"
          rel="noopener noreferrer"
          download
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "8px",
            background: hovered ? accent.grad : "hsla(258,80%,65%,0.12)",
            color: hovered ? "white" : accent.text,
            fontSize: "0.78rem",
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.2s",
            border: `1px solid ${accent.text}33`,
            boxShadow: hovered ? `0 4px 12px ${accent.bar}44` : "none",
          }}
        >
          <Download size={13} />
          Download
        </a>
      </div>
    </div>
  );
}
