import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ROLE, SLOT_STATUS } from "@/lib/constants";
import { ChevronRight, Stethoscope } from "lucide-react";

export default async function UmowWizytePage() {
  const session = await getSession();
  if (!session || session.role !== ROLE.PACJENT) redirect("/login");

  const doctors = await prisma.user.findMany({
    where: { role: ROLE.LEKARZ, slots: { some: { status: SLOT_STATUS.DOSTEPNY } } },
    include: {
      doctorProfile: true,
      slots: { where: { status: SLOT_STATUS.DOSTEPNY }, orderBy: { dateTime: "asc" } },
    },
  });

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00bfa5" }}>Pacjent</p>
        <h1 className="text-2xl font-bold text-gray-900">Umów wizytę</h1>
        <p className="text-sm text-gray-400 mt-1">Wybierz lekarza, aby zobaczyć dostępne terminy.</p>
      </div>

      {doctors.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400">Brak lekarzy z dostępnymi terminami.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {doctors.map((doctor) => (
            <Link key={doctor.id} href={`/pacjent/umow-wizyte/${doctor.id}`}
              className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm hover:border-gray-300 transition-all group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(0,191,165,0.1)" }}>
                <Stethoscope className="h-4 w-4" style={{ color: "#00bfa5" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  dr {doctor.doctorProfile?.firstName} {doctor.doctorProfile?.lastName}
                </p>
                <p className="text-xs text-gray-400">{doctor.doctorProfile?.specialization || "Specjalizacja nieznana"}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                style={{ backgroundColor: "rgba(0,191,165,0.1)", color: "#00bfa5" }}>
                {doctor.slots.length} {doctor.slots.length === 1 ? "termin" : doctor.slots.length < 5 ? "terminy" : "terminów"}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
