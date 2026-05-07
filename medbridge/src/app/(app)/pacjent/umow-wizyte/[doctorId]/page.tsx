import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { BookingForm } from "@/components/booking-form";
import { ChevronLeft, Stethoscope } from "lucide-react";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

export default async function DoctorSlotsPage({
  params,
}: {
  params: Promise<{ doctorId: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== ROLE.PACJENT) redirect("/login");

  const { doctorId } = await params;

  const doctor = await prisma.user.findUnique({
    where: { id: doctorId, role: ROLE.LEKARZ },
    include: {
      doctorProfile: true,
      slots: {
        where: { status: SLOT_STATUS.DOSTEPNY },
        orderBy: { dateTime: "asc" },
      },
    },
  });

  if (!doctor) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/pacjent/umow-wizyte"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Powrót do listy lekarzy
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Stethoscope className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            dr {doctor.doctorProfile?.firstName} {doctor.doctorProfile?.lastName}
          </h1>
          <p className="text-sm text-gray-500">
            {doctor.doctorProfile?.specialization}
          </p>
        </div>
      </div>

      {doctor.slots.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          Brak dostępnych terminów u tego lekarza.
        </p>
      ) : (
        <BookingForm slots={doctor.slots} />
      )}
    </div>
  );
}
