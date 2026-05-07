import { redirect } from "next/navigation";
import { getSession } from "@/infrastructure/auth/session";

export default async function RootPage() {
  const session = await getSession();

  if (session?.role === "PATIENT") redirect("/patient/dashboard");
  if (session?.role === "DOCTOR") redirect("/doctor/dashboard");

  redirect("/login");
}
