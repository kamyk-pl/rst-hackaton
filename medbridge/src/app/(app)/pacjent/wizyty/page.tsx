import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ROLE, APPOINTMENT_STATUS } from "@/lib/constants";
import { Calendar, Clock, ChevronRight, Plus } from "lucide-react";

export default async function PatientVisitsPage() {
  const session = await getSession();
  if (!session || session.role !== ROLE.PACJENT) redirect("/login");

  const appointments = await prisma.appointment.findMany({
    where: { patientId: session.id },
    include: { slot: true, doctor: { include: { doctorProfile: true } }, visitSummary: true },
    orderBy: { slot: { dateTime: "desc" } },
  });

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00bfa5" }}>Pacjent</p>
          <h1 className="text-2xl font-bold text-gray-900">Historia wizyt</h1>
        </div>
        <Link href="/pacjent/umow-wizyte"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: "#00bfa5", color: "#0d0d0d" }}>
          <Plus className="h-4 w-4" /> Umów wizytę
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400 mb-4">Brak wizyt.</p>
          <Link href="/pacjent/umow-wizyte"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "#00bfa5", color: "#0d0d0d" }}>
            Umów pierwszą wizytę
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {appointments.map((apt) => {
            const dt = new Date(apt.slot.dateTime);
            const isDone = apt.status === APPOINTMENT_STATUS.ZAKONCZONA;
            return (
              <div key={apt.id} className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: isDone ? "#f1f5f9" : "rgba(0,191,165,0.1)" }}>
                  <Calendar className="h-4 w-4" style={{ color: isDone ? "#94a3b8" : "#00bfa5" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    dr {apt.doctor.doctorProfile?.firstName} {apt.doctor.doctorProfile?.lastName}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-400">{apt.doctor.doctorProfile?.specialization}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {dt.toLocaleDateString("pl-PL", { day: "2-digit", month: "short" })},&nbsp;
                      {dt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                  style={isDone
                    ? { backgroundColor: "#f0fdf4", color: "#16a34a" }
                    : { backgroundColor: "rgba(0,191,165,0.1)", color: "#00bfa5" }}>
                  {isDone ? "Zakończona" : "Zaplanowana"}
                </span>
                {isDone && (
                  <Link href={`/pacjent/wizyty/${apt.id}`}
                    className="text-gray-300 hover:text-gray-600 transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
