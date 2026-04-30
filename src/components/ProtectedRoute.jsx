import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route so only authenticated users can access it.
 * Shows nothing while the session is still loading (undefined).
 */
export default function ProtectedRoute({ children }) {
  const { session } = useAuth();

  // Still determining auth state — render nothing to avoid flash
  if (session === undefined) return null;

  if (!session) return <Navigate to="/auth" replace />;

  return children;
}
