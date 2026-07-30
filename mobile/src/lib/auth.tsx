import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch, clearToken, getToken, setToken, ApiError } from "./api";
import { registerForPushNotifications } from "./push";

export type StaffRole = "OWNER" | "MANAGER" | "SERVER" | "KITCHEN";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  emailVerifiedAt: string | null;
  organization: { id: string; name: string; slug: string };
};

type AuthState = {
  status: "loading" | "signedOut" | "signedIn";
  user: SessionUser | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthState["status"]>("loading");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadMe() {
    try {
      const { user } = await apiFetch<{ user: SessionUser }>("/api/me");
      setUser(user);
      setStatus("signedIn");
      // Fires on every successful session load (fresh login and app-start
      // with a stored token alike) -- fails soft with no EAS project id
      // configured in this environment, see push.ts's doc comment.
      registerForPushNotifications();
    } catch {
      await clearToken();
      setUser(null);
      setStatus("signedOut");
    }
  }

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        setStatus("signedOut");
        return;
      }
      await loadMe();
    })();
  }, []);

  async function login(email: string, password: string) {
    setError(null);
    try {
      const { token } = await apiFetch<{ token: string }>("/api/auth/login", {
        method: "POST",
        body: { email, password },
        skipAuth: true,
      });
      await setToken(token);
      await loadMe();
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 429
          ? "Trop de tentatives, réessayez dans quelques minutes."
          : "Email ou mot de passe incorrect.",
      );
      throw err;
    }
  }

  async function logout() {
    await clearToken();
    setUser(null);
    setStatus("signedOut");
  }

  return (
    <AuthContext.Provider value={{ status, user, error, login, logout, refresh: loadMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const STAFF_MANAGEMENT_ROLES: StaffRole[] = ["OWNER", "MANAGER"];
export const MENU_MANAGEMENT_ROLES: StaffRole[] = ["OWNER", "MANAGER"];
export const BILLING_MANAGEMENT_ROLES: StaffRole[] = ["OWNER"];

export function canManageStaff(role: StaffRole): boolean {
  return STAFF_MANAGEMENT_ROLES.includes(role);
}
