/**
 * Authenticated API client for Vigia Gateway.
 *
 * Uses the Clerk session token as Bearer auth on every request.
 * Keeps only admin / onboarding endpoints that need service_role.
 * All data reads/writes go directly to Supabase from the app.
 */

import { useAuth } from "@clerk/expo";
import { useCallback } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

/** Low-level fetch wrapper — returns parsed JSON or throws */
async function apiFetch<T>(
  token: string,
  path: string,
  method: HttpMethod = "GET",
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

/** React hook that returns a pre-bound API client using the current session token. */
export function useApiClient() {
  const { getToken } = useAuth();

  const call = useCallback(
    async <T>(path: string, method: HttpMethod = "GET", body?: unknown): Promise<T> => {
      const token = await getToken();
      if (!token) throw new Error("No autenticado");
      return apiFetch<T>(token, path, method, body);
    },
    [getToken]
  );

  return {
    // ── User management (admin only — needs Clerk backend API) ──────────
    listUsers: () => call<any[]>("/users"),

    inviteUser: (email: string, role: "admin" | "viewer") =>
      call<any>("/users/invite", "POST", { email, role }),

    blockUser: (id: string) => call<any>(`/users/${id}/block`, "PATCH"),

    unblockUser: (id: string) => call<any>(`/users/${id}/unblock`, "PATCH"),

    resetPassword: (id: string) => call<any>(`/users/${id}/reset-password`, "POST"),

    changeRole: (id: string, role: "admin" | "viewer") =>
      call<any>(`/users/${id}/role`, "PATCH", { role }),
  };
}
