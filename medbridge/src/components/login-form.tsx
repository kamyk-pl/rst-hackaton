"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export function LoginForm({ dark = false }: { dark?: boolean }) {
  const [state, action, pending] = useActionState(login, null);

  const inputStyle = dark
    ? {
        backgroundColor: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "white",
        borderRadius: "6px",
        padding: "10px 14px",
        width: "100%",
        fontSize: "0.875rem",
        outline: "none",
      }
    : {};

  const labelStyle = dark ? { color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: 500 } : {};

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="email" style={labelStyle} className="block text-sm font-medium text-gray-700">
          Email
        </label>
        {dark ? (
          <input
            id="email" name="email" type="email"
            placeholder="adres@email.pl" required autoComplete="email"
            style={inputStyle}
            className="focus:border-teal-400 transition-colors"
          />
        ) : (
          <input
            id="email" name="email" type="email"
            placeholder="adres@email.pl" required autoComplete="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" style={labelStyle} className="block text-sm font-medium text-gray-700">
          Hasło
        </label>
        {dark ? (
          <input
            id="password" name="password" type="password"
            placeholder="••••••••" required autoComplete="current-password"
            style={inputStyle}
            className="focus:border-teal-400 transition-colors"
          />
        ) : (
          <input
            id="password" name="password" type="password"
            placeholder="••••••••" required autoComplete="current-password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {state?.error && (
        <p className="text-sm" style={{ color: "#f87171" }}>{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 rounded-md font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
        style={dark
          ? { backgroundColor: "#00bfa5", color: "#0d0d0d" }
          : { backgroundColor: "#1a56db", color: "white" }}
      >
        {pending ? "Logowanie..." : "Zaloguj się"}
      </button>
    </form>
  );
}
