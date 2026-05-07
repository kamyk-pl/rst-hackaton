import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ROLE, APPOINTMENT_STATUS } from "@/lib/constants";
import { Calendar, Clock, ChevronRight } from "lucide-react";

export default async function DoctorVisitsPage() {
  const session = await getSession();
  if (!session || session.role !== ROLE.LEKARZ) redirect("/login");

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: session.id },
    include: { slot: true, patient: { include: { patientProfile: true } }, visitSummary: true },
    orderBy: { slot: { dateTime: "asc" } },
  });

  const planned = appointments.filter(a => a.status === APPOINTMENT_STATUS.ZAPLANOWANA);
  const done = appointments.filter(a => a.status === APPOINTMENT_STATUS.ZAKONCZONA);

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00bfa5" }}>Lekarz</p>
        <h1 className="text-2xl font-bold text-gray-900">Harmonogram wizyt</h1>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400">Brak umówionych wizyt.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {planned.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Zaplanowane ({planned.length})</p>
              <div className="space-y-2">{planned.map(apt => <AppointmentRow key={apt.id} apt={apt} />)}</div>
            </div>
          )}
          {done.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Zakończone ({done.length})</p>
              <div className="space-y-2">{done.map(apt => <AppointmentRow key={apt.id} apt={apt} />)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentRow({ apt }: { apt: any }) {
  const dt = new Date(apt.slot.dateTime);
  const isDone = apt.status === APPOINTMENT_STATUS.ZAKONCZONA;
  return (
    <Link href={`/lekarz/wizyty/${apt.id}`}
      className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm hover:border-gray-300 transition-all group">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: isDone ? "#f1f5f9" : "rgba(0,191,165,0.1)" }}>
        <Calendar className="h-4 w-4" style={{ color: isDone ? "#94a3b8" : "#00bfa5" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          {apt.patient.patientProfile?.firstName} {apt.patient.patientProfile?.lastName || apt.patient.email}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {dt.toLocaleDateString("pl-PL", { day: "2-digit", month: "short", year: "numeric" })},&nbsp;
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
      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
    </Link>
  );
}
