import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROLE } from "@/lib/constants";
import LandingPage from "./(public)/page";

export default async function Home() {
  const session = await auth();
  if (session?.user?.role === ROLE.LEKARZ) redirect("/lekarz/wizyty");
  if (session?.user?.role === ROLE.PACJENT) redirect("/pacjent/profil");
  return <LandingPage />;
}
