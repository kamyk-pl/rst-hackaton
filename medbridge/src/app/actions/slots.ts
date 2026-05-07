"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

export async function createSlot(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const session = await getSession();
  if (!session || session.role !== ROLE.LEKARZ) {
    return { error: "Brak dostępu" };
  }

  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;

  if (!dateStr || !timeStr) {
    return { error: "Data i godzina są wymagane" };
  }

  const dateTime = new Date(`${dateStr}T${timeStr}`);

  if (isNaN(dateTime.getTime())) {
    return { error: "Nieprawidłowy format daty lub godziny" };
  }

  if (dateTime <= new Date()) {
    return { error: "Termin musi być w przyszłości" };
  }

  await prisma.slot.create({
    data: {
      doctorId: session.id,
      dateTime,
      status: SLOT_STATUS.DOSTEPNY,
    },
  });

  revalidatePath("/lekarz/terminy");
  return null;
}
