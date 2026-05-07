"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Nieprawidłowy email lub hasło" };
    }
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const dest = user?.role === ROLE.LEKARZ ? "/lekarz/wizyty" : "/pacjent/profil";
  redirect(dest);
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
