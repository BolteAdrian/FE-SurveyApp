import { createContext, useContext, useState, type ReactNode } from "react";
import type { IUser } from "../types/user";

/**
 * Defines the shape of the authentication context.
 * Includes authentication state, user data, and auth actions.
 */
interface AuthContextType {
  isAuthenticated: boolean;
  user: IUser | null;
  login: (token: string, user: IUser) => void;
  logout: () => void;
}

/**
 * Create AuthContext with an initial undefined value.
 * This allows us to enforce usage within AuthProvider.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component
 *
 * Wraps the application and provides authentication state and actions.
 * It also persists authentication data in localStorage.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  /**
   * Initialize user state from localStorage (if available).
   * Includes error handling for invalid JSON.
   */
  const [user, setUser] = useState<IUser | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser) as IUser;
    } catch (e) {
      console.warn("Could not parse user from localStorage:", e);
      return null;
    }
  });

  /**
   * Initialize authentication state based on token presence in localStorage.
   */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem("token"),
  );

  /**
   * Logs in the user:
   * - saves token and user in localStorage
   * - updates React state
   */
  const login = (token: string, user: IUser) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  };

  /**
   * Logs out the user:
   * - removes token and user from localStorage
   * - resets React state
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Provide authentication state and actions to the app.
   */
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 * Throws an error if used outside of AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
