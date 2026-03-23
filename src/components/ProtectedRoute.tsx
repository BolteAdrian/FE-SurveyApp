import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

/**
 * ProtectedRoute component
 *
 * This component acts as a route guard for protected pages.
 * It checks if the user is authenticated before rendering the children.
 *
 * If the user is not authenticated, they are redirected to the login page.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  // Get authentication state from AuthContext
  const { isAuthenticated } = useAuth();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login-admin" />;
  }

  // If authenticated, render the protected content
  return children;
}
