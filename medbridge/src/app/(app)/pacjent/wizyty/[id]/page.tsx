import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronLeft, Stethoscope } from "lucide-react";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

export default async function PatientVisitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== ROLE.PACJENT) redirect("/login");

  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      slot: true,
      doctor: { include: { doctorProfile: true } },
      visitSummary: true,
    },
  });

  if (!appointment || appointment.patientId !== session.id) notFound();

  const dt = new Date(appointment.slot.dateTime);
  const isDone = appointment.status === APPOINTMENT_STATUS.ZAKONCZONA;

  return (
    <div className="max-w-2xl">
      <Link
        href="/pacjent/wizyty"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Powrót do historii wizyt
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Szczegóły wizyty</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {dt.toLocaleDateString("pl-PL", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {dt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
        <Badge
          className={
            isDone
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-blue-100 text-blue-800 border-blue-200"
          }
        >
          {isDone ? "Zakończona" : "Zaplanowana"}
        </Badge>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-4 pb-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Stethoscope className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              dr {appointment.doctor.doctorProfile?.firstName}{" "}
              {appointment.doctor.doctorProfile?.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {appointment.doctor.doctorProfile?.specialization}
            </p>
          </div>
        </CardContent>
      </Card>

      {!isDone || !appointment.visitSummary ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p>Wizyta jeszcze się nie odbyła lub lekarz nie dodał podsumowania.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-base text-green-800">Podsumowanie wizyty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SummaryRow label="Rozpoznanie" value={appointment.visitSummary.diagnosis} />
            <SummaryRow label="Zalecenia" value={appointment.visitSummary.recommendations} />
            <SummaryRow label="Przepisane leki" value={appointment.visitSummary.prescribedMedications} />
            <SummaryRow label="Skierowania" value={appointment.visitSummary.referrals} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm text-gray-900 whitespace-pre-wrap">{value || "—"}</p>
    </div>
  );
}
