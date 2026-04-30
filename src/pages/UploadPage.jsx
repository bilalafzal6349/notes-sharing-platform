import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../context/AuthContext";
import {
  Upload,
  Loader2,
  CheckCircle2,
  FileText,
  X,
  CloudUpload,
  ArrowLeft,
} from "lucide-react";

export default function UploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function validateAndSetFile(selected) {
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (selected.size > 20 * 1024 * 1024) {
      setError("File size must be under 20 MB.");
      return;
    }
    setError(null);
    setFile(selected);
  }

  function handleFileChange(e) {
    validateAndSetFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setProgress("Uploading file…");
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("note_files")
        .upload(fileName, file, { contentType: "application/pdf" });

      if (uploadError) throw uploadError;

      setProgress("Saving note…");
      const { data: urlData } = supabase.storage
        .from("note_files")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("notes").insert({
        title: title.trim(),
        subject: subject.trim(),
        description: description.trim() || null,
        file_url: urlData.publicUrl,
        user_id: user.id,
      });

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress("");
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
        }}
      >
        <div
          className="animate-fade-up"
          style={{ textAlign: "center", maxWidth: "380px" }}
        >
          <div
            className="animate-float"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "hsla(142,70%,45%,0.12)",
              border: "1px solid hsla(142,70%,45%,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <CheckCircle2 size={36} color="hsl(142 70% 55%)" />
          </div>
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "hsl(210 40% 96%)",
              letterSpacing: "-0.01em",
            }}
          >
            Notes published! 🎉
          </h2>
          <p
            style={{
              margin: "0 0 32px",
              fontSize: "0.95rem",
              color: "hsl(215 20% 50%)",
              lineHeight: 1.7,
            }}
          >
            Your notes are now live and available for other students to browse
            and download.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "11px 22px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                boxShadow: "0 4px 16px hsla(258,90%,60%,0.35)",
                transition: "all 0.2s",
              }}
            >
              View All Notes
            </button>
            <button
              onClick={() => {
                setTitle("");
                setSubject("");
                setDescription("");
                setFile(null);
                setSuccess(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "11px 22px",
                borderRadius: "10px",
                border: "1px solid hsla(258,50%,50%,0.25)",
                background: "hsla(258,50%,50%,0.08)",
                color: "hsl(215 20% 70%)",
                fontWeight: 500,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Upload form ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", padding: "0 0 80px" }}>
      <main
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {/* Back link */}
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.85rem",
            color: "hsl(215 20% 50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            marginBottom: "28px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "hsl(210 40% 85%)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "hsl(215 20% 50%)")
          }
        >
          <ArrowLeft size={15} />
          Back to notes
        </button>

        {/* Page heading */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            className="animate-fade-up"
            style={{
              margin: "0 0 8px",
              fontSize: "2rem",
              fontWeight: 800,
              color: "hsl(210 40% 96%)",
              letterSpacing: "-0.02em",
            }}
          >
            Upload Notes
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "hsl(215 20% 50%)",
            }}
          >
            Share your study materials with the community.
          </p>
        </div>

        {/* Card */}
        <div
          className="animate-fade-up"
          style={{
            borderRadius: "20px",
            border: "1px solid hsla(258,50%,50%,0.15)",
            background: "hsla(222,47%,9%,0.85)",
            backdropFilter: "blur(20px)",
            overflow: "hidden",
            boxShadow: "0 20px 60px hsla(222,60%,5%,0.5)",
          }}
        >
          {/* Card header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "20px 28px",
              borderBottom: "1px solid hsla(258,50%,50%,0.1)",
              background: "hsla(222,47%,7%,0.6)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px hsla(258,90%,60%,0.35)",
                flexShrink: 0,
              }}
            >
              <CloudUpload size={18} color="white" />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "hsl(210 40% 92%)",
                }}
              >
                Note details
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "0.78rem",
                  color: "hsl(215 20% 50%)",
                }}
              >
                Fill in the fields below and attach your PDF file.
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "22px",
            }}
          >
            {/* Title + Subject */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
              className="upload-grid"
            >
              <div>
                <label style={labelStyle}>
                  Title <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  id="title"
                  placeholder="e.g. Calculus 101 Midterm Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={120}
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Subject <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  id="subject"
                  placeholder="e.g. Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  maxLength={80}
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>
                Description{" "}
                <span
                  style={{
                    color: "hsl(215 20% 40%)",
                    fontWeight: 400,
                    fontSize: "0.75rem",
                  }}
                >
                  (optional)
                </span>
              </label>
              <textarea
                id="description"
                placeholder="Brief summary of what these notes cover…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={500}
                style={{
                  ...inputStyle,
                  resize: "none",
                  lineHeight: 1.6,
                  height: "auto",
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: "0.74rem",
                  color: "hsl(215 20% 38%)",
                  textAlign: "right",
                }}
              >
                {description.length}/500
              </p>
            </div>

            {/* File drop zone */}
            <div>
              <label style={labelStyle}>
                PDF File <span style={{ color: "#f87171" }}>*</span>
              </label>

              {file ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: "1px solid hsla(258,70%,60%,0.3)",
                    background: "hsla(258,80%,65%,0.07)",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "hsla(258,80%,65%,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={18} color="#a78bfa" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "hsl(210 40% 90%)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {file.name}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: "0.76rem",
                        color: "hsl(215 20% 48%)",
                      }}
                    >
                      {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    aria-label="Remove file"
                    style={{
                      display: "flex",
                      padding: "4px",
                      borderRadius: "6px",
                      border: "none",
                      background: "transparent",
                      color: "hsl(215 20% 45%)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "hsl(0 80% 70%)";
                      e.currentTarget.style.background = "hsla(0,80%,60%,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "hsl(215 20% 45%)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "40px 24px",
                    borderRadius: "14px",
                    border: dragOver
                      ? "2px dashed #a78bfa"
                      : "2px dashed hsla(258,50%,50%,0.25)",
                    background: dragOver
                      ? "hsla(258,80%,65%,0.07)"
                      : "hsla(222,47%,11%,0.6)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!dragOver) {
                      e.currentTarget.style.borderColor =
                        "hsla(258,50%,50%,0.45)";
                      e.currentTarget.style.background =
                        "hsla(258,80%,65%,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!dragOver) {
                      e.currentTarget.style.borderColor =
                        "hsla(258,50%,50%,0.25)";
                      e.currentTarget.style.background =
                        "hsla(222,47%,11%,0.6)";
                    }
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      border: "1px solid hsla(258,50%,50%,0.2)",
                      background: "hsla(222,47%,14%,0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Upload size={22} color="hsl(215 20% 45%)" />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: "hsl(215 20% 65%)",
                      }}
                    >
                      Drop your PDF here, or{" "}
                      <span style={{ color: "#a78bfa", fontWeight: 600 }}>
                        browse
                      </span>
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "0.78rem",
                        color: "hsl(215 20% 42%)",
                      }}
                    >
                      PDF only · Max 20 MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    aria-label="Upload PDF file"
                  />
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "13px 16px",
                  borderRadius: "10px",
                  border: "1px solid hsla(0,80%,60%,0.2)",
                  background: "hsla(0,80%,60%,0.07)",
                }}
              >
                <X size={15} color="hsl(0 80% 65%)" style={{ flexShrink: 0, marginTop: "1px" }} />
                <p style={{ margin: 0, fontSize: "0.85rem", color: "hsl(0 80% 70%)" }}>
                  {error}
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
                padding: "13px",
                borderRadius: "12px",
                border: "none",
                background: loading
                  ? "hsla(258,50%,40%,0.4)"
                  : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 20px hsla(258,90%,60%,0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow =
                    "0 6px 28px hsla(258,90%,60%,0.5)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 20px hsla(258,90%,60%,0.35)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  {progress || "Uploading…"}
                </>
              ) : (
                <>
                  <CloudUpload size={17} />
                  Publish Notes
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 540px) {
          .upload-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Shared styles ───────────────────────────────────────────────────────────
const labelStyle = {
  display: "block",
  fontSize: "0.82rem",
  fontWeight: 500,
  color: "hsl(215 20% 62%)",
  marginBottom: "7px",
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid hsla(258,50%,50%,0.2)",
  background: "hsla(222,47%,12%,0.8)",
  color: "hsl(210 40% 94%)",
  fontSize: "0.9rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
};

function handleFocus(e) {
  e.currentTarget.style.borderColor = "hsla(258,70%,60%,0.5)";
  e.currentTarget.style.boxShadow = "0 0 0 3px hsla(258,70%,60%,0.12)";
}
function handleBlur(e) {
  e.currentTarget.style.borderColor = "hsla(258,50%,50%,0.2)";
  e.currentTarget.style.boxShadow = "none";
}
