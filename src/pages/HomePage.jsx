import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import NoteCard from "../components/NoteCard";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Loader2 } from "lucide-react";

export default function HomePage() {
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

      if (error) {
        setError(error.message);
      } else {
        setNotes(data);
      }
      setLoading(false);
    }

    fetchNotes();
  }, []);

  // Client-side filter by title or subject
  const filtered = notes.filter((note) => {
    const q = query.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.subject.toLowerCase().includes(q)
    );
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 text-indigo-600 mb-2">
          <BookOpen className="h-6 w-6" />
          <span className="text-sm font-semibold uppercase tracking-wide">
            Student Notes Portal
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Browse Study Notes
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Discover notes shared by fellow students. Search by title or subject
          to find exactly what you need.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-8 max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by title or subject…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label="Search notes"
        />
      </div>

      {/* States */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      )}

      {error && (
        <p className="text-center text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3 max-w-md mx-auto">
          Failed to load notes: {error}
        </p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No notes found</p>
          <p className="text-sm mt-1">
            {query
              ? `No results for "${query}". Try a different search.`
              : "Be the first to upload some notes!"}
          </p>
        </div>
      )}

      {/* Notes grid */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filtered.length} note{filtered.length !== 1 ? "s" : ""}
            {query && ` for "${query}"`}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
