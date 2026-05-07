"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

export async function addVisitSummary(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const session = await getSession();
  if (!session || session.role !== ROLE.LEKARZ) {
    return { error: "Brak dostępu" };
  }

  const appointmentId = formData.get("appointmentId") as string;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment || appointment.doctorId !== session.id) {
    return { error: "Nie znaleziono wizyty" };
  }

  if (appointment.status === APPOINTMENT_STATUS.ZAKONCZONA) {
    return { error: "Ta wizyta została już zakończona" };
  }

  await prisma.$transaction([
    prisma.visitSummary.create({
      data: {
        appointmentId,
        diagnosis: (formData.get("diagnosis") as string) ?? "",
        recommendations: (formData.get("recommendations") as string) ?? "",
        prescribedMedications: (formData.get("prescribedMedications") as string) ?? "",
        referrals: (formData.get("referrals") as string) ?? "",
      },
    }),
    prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: APPOINTMENT_STATUS.ZAKONCZONA },
    }),
  ]);

  revalidatePath(`/lekarz/wizyty/${appointmentId}`);
  revalidatePath("/lekarz/wizyty");
  revalidatePath("/pacjent/wizyty");
  redirect("/lekarz/wizyty");
}
