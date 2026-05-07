"use server";

import { redirect } from "next/navigation";
import { verifyCredentials } from "@/application/auth/verify-credentials";
import { createSession } from "@/infrastructure/auth/session";
import { prisma } from "@/infrastructure/db/prisma";

export type LoginState = { error: string } | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  const session = await verifyCredentials(email, password, prisma);

  if (!session) {
    return { error: "Invalid email or password." };
  }

  await createSession(session);
  redirect(session.role === "PATIENT" ? "/patient/dashboard" : "/doctor/dashboard");
}
