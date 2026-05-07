import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { VisitSummaryForm } from "@/components/visit-summary-form";
import { ChevronLeft } from "lucide-react";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

export default async function VisitSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== ROLE.LEKARZ) redirect("/login");

  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      slot: true,
      patient: { include: { patientProfile: true } },
    },
  });

  if (!appointment || appointment.doctorId !== session.user.id) notFound();
  if (appointment.status === APPOINTMENT_STATUS.ZAKONCZONA) redirect(`/lekarz/wizyty/${id}`);

  const dt = new Date(appointment.slot.dateTime);
  const profile = appointment.patient.patientProfile;

  return (
    <div className="max-w-2xl">
      <Link
        href={`/lekarz/wizyty/${id}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Powrót do danych pacjenta
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Podsumowanie wizyty</h1>
        <p className="text-sm text-gray-500 mt-1">
          {profile?.firstName} {profile?.lastName} —{" "}
          {dt.toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })},{" "}
          {dt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <VisitSummaryForm appointmentId={id} />
    </div>
  );
}
