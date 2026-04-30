import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/auth");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <span>NoteShare</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>

          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/upload">Upload Notes</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
