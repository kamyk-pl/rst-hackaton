"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

export async function bookAppointment(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const session = await getSession();
  if (!session || session.role !== ROLE.PACJENT) {
    return { error: "Brak dostępu" };
  }

  const slotId = formData.get("slotId") as string;
  const consent = formData.get("consent") === "on";

  if (!consent) {
    return { error: "Zgoda na udostępnienie danych jest wymagana" };
  }

  const slot = await prisma.slot.findUnique({ where: { id: slotId } });

  if (!slot || slot.status !== SLOT_STATUS.DOSTEPNY) {
    return { error: "Wybrany termin nie jest już dostępny" };
  }

  await prisma.$transaction([
    prisma.slot.update({
      where: { id: slotId },
      data: { status: SLOT_STATUS.ZAREZERWOWANY },
    }),
    prisma.appointment.create({
      data: {
        patientId: session.id,
        doctorId: slot.doctorId,
        slotId,
        consentGranted: true,
        status: APPOINTMENT_STATUS.ZAPLANOWANA,
      },
    }),
  ]);

  revalidatePath("/pacjent/wizyty");
  revalidatePath("/pacjent/umow-wizyte");
  redirect("/pacjent/wizyty");
}
