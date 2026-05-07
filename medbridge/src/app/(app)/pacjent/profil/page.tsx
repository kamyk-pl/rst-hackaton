import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ROLE } from "@/lib/constants";
import { Pencil, User, Activity, Pill } from "lucide-react";

export default async function PatientProfilePage() {
  const session = await getSession();
  if (!session || session.role !== ROLE.PACJENT) redirect("/login");

  const profile = await prisma.patientProfile.findUnique({
    where: { userId: session.id },
  });

  const isEmpty = !profile?.firstName && !profile?.lastName;
  const initials = profile?.firstName?.[0] ?? session.email[0].toUpperCase();

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00bfa5" }}>Profil pacjenta</p>
          <h1 className="text-3xl font-bold text-gray-900">
            {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : "Mój profil"}
          </h1>
          
        </div>
        <Link href="/pacjent/profil/edytuj"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
          style={{ backgroundColor: "#0d0d0d", color: "white" }}>
          <Pencil className="h-3.5 w-3.5" /> Edytuj profil
        </Link>
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center bg-white">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "rgba(0,191,165,0.1)" }}>
            <User className="h-7 w-7" style={{ color: "#00bfa5" }} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Uzupełnij swój profil</h3>
          <p className="text-gray-400 mb-6 text-sm">Dodaj dane zdrowotne, żeby lekarz mógł się przygotować do wizyty.</p>
          <Link href="/pacjent/profil/edytuj"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "#00bfa5", color: "#0d0d0d" }}>
            Uzupełnij profil
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Identity card */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}>
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <User className="h-4 w-4" style={{ color: "#00bfa5" }} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Dane osobowe</span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-4">
              <Field label="Imię i nazwisko" value={`${profile!.firstName} ${profile!.lastName}`.trim()} />
              <Field label="Data urodzenia" value={profile!.dateOfBirth || "—"} />
            </div>
          </div>

          {/* Medical info */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}>
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <Activity className="h-4 w-4" style={{ color: "#00bfa5" }} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Informacje medyczne</span>
            </div>
            <div className="p-6 grid gap-4">
              <Field label="Alergie" value={profile!.allergies || "—"} multiline />
              <Field label="Choroby przewlekłe" value={profile!.chronicDiseases || "—"} multiline />
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}>
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <Pill className="h-4 w-4" style={{ color: "#00bfa5" }} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Leki stałe</span>
            </div>
            <div className="p-6">
              <Field label="Przyjmowane leki" value={profile!.medications || "—"} multiline />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-sm font-medium text-gray-800 ${multiline ? "whitespace-pre-wrap" : ""}`}>{value}</p>
    </div>
  );
}
