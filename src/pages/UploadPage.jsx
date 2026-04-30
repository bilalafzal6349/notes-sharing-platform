import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";

export default function UploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (selected && selected.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      setFile(null);
      e.target.value = "";
      return;
    }
    setError(null);
    setFile(selected);
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
      // 1. Upload the PDF to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("note_files")
        .upload(fileName, file, { contentType: "application/pdf" });

      if (uploadError) throw uploadError;

      // 2. Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from("note_files")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // 3. Insert a record into the notes table
      const { error: insertError } = await supabase.from("notes").insert({
        title: title.trim(),
        subject: subject.trim(),
        description: description.trim() || null,
        file_url: publicUrl,
        user_id: user.id,
      });

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Notes uploaded!</h2>
          <p className="text-muted-foreground mb-6">
            Your notes are now live and available for other students to
            download.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/")}>View All Notes</Button>
            <Button
              variant="outline"
              onClick={() => {
                setTitle("");
                setSubject("");
                setDescription("");
                setFile(null);
                setSuccess(false);
              }}
            >
              Upload Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Upload Notes</h1>
        <p className="text-muted-foreground mt-1">
          Share your study materials with fellow students.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Note details</CardTitle>
          <CardDescription>
            Fill in the information below and attach your PDF.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Calculus 101 Midterm Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={120}
              />
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="e.g. Mathematics, Computer Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                maxLength={80}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <textarea
                id="description"
                placeholder="Brief summary of what these notes cover…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={500}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* File upload */}
            <div className="space-y-1.5">
              <Label htmlFor="file">
                PDF File <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer file:cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
              {file && (
                <p className="text-xs text-muted-foreground">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                  MB)
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Notes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
