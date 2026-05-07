import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ROLE } from "@/lib/constants";
import { Pencil, Stethoscope, Mail } from "lucide-react";

export default async function DoctorProfilePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== ROLE.LEKARZ) redirect("/login");

  const profile = await prisma.doctorProfile.findUnique({ where: { userId: session.user.id } });
  const isEmpty = !profile?.firstName && !profile?.lastName;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00bfa5" }}>Profil lekarza</p>
          <h1 className="text-3xl font-bold text-gray-900">
            {profile?.firstName ? `dr ${profile.firstName} ${profile.lastName}` : "Mój profil"}
          </h1>
          {profile?.specialization && <p className="text-gray-400 mt-1">{profile.specialization}</p>}
        </div>
        <Link href="/lekarz/profil/edytuj"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-80 transition-all"
          style={{ backgroundColor: "#0d0d0d", color: "white" }}>
          <Pencil className="h-3.5 w-3.5" /> Edytuj profil
        </Link>
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center bg-white">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "rgba(0,191,165,0.1)" }}>
            <Stethoscope className="h-7 w-7" style={{ color: "#00bfa5" }} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Uzupełnij swój profil</h3>
          <p className="text-gray-400 mb-6 text-sm">Pacjenci zobaczą Twoje dane przy umawianiu wizyty.</p>
          <Link href="/lekarz/profil/edytuj"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90"
            style={{ backgroundColor: "#00bfa5", color: "#0d0d0d" }}>
            Uzupełnij profil
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Stethoscope className="h-4 w-4" style={{ color: "#00bfa5" }} />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Dane lekarza</span>
          </div>
          <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-4">
            <Field label="Imię i nazwisko" value={`${profile!.firstName} ${profile!.lastName}`.trim()} />
            <Field label="Specjalizacja" value={profile!.specialization || "—"} />
            <Field label="Email" value={session.user.email} icon={<Mail className="h-3.5 w-3.5" />} />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">{icon}{value}</p>
    </div>
  );
}
