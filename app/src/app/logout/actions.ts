"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/infrastructure/auth/session";

export async function logoutAction(): Promise<never> {
  await deleteSession();
  redirect("/login");
}
