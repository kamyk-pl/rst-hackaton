"use client";

import { useActionState } from "react";
import type { LoginState } from "@/app/login/actions";

interface LoginFormProps {
  action: (prev: LoginState, formData: FormData) => Promise<LoginState>;
}

export function LoginForm({ action }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
