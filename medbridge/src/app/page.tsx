import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ROLE } from "@/lib/constants";
import LandingPage from "./(public)/page";

export default async function Home() {
  const session = await getSession();
  if (session?.role === ROLE.LEKARZ) redirect("/lekarz/wizyty");
  if (session?.role === ROLE.PACJENT) redirect("/pacjent/profil");
  return <LandingPage />;
}
