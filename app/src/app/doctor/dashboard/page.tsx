import { redirect } from "next/navigation";
import { getSession } from "@/infrastructure/auth/session";
import { logoutAction } from "@/app/logout/actions";

export default async function DoctorDashboard() {
  const session = await getSession();
  if (!session || session.role !== "DOCTOR") redirect("/login");

  return (
    <main className="flex min-h-full flex-col items-center justify-center py-16 px-4">
      <h1 className="text-2xl font-semibold mb-4">Doctor Dashboard</h1>
      <p className="text-zinc-500 mb-8 text-sm">Welcome, doctor.</p>
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Logout
        </button>
      </form>
    </main>
  );
}
