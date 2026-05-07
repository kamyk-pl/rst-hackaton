"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

export async function updateDoctorProfile(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const session = await getSession();
  console.log("[doctor action] session:", JSON.stringify(session));
  if (!session || session.role !== ROLE.LEKARZ) {
    console.log("[doctor action] NO SESSION or wrong role, returning error");
    return { error: "Brak dostępu" };
  }

  const firstName = ((formData.get("firstName") ?? "") as string).trim();
  const lastName = ((formData.get("lastName") ?? "") as string).trim();
  const specialization = ((formData.get("specialization") ?? "") as string).trim();

  if (!firstName || !lastName || !specialization) {
    return { error: "Wszystkie pola są wymagane" };
  }

  await prisma.doctorProfile.upsert({
    where: { userId: session.id },
    update: { firstName, lastName, specialization },
    create: { userId: session.id, firstName, lastName, specialization },
  });

  revalidatePath("/lekarz/profil");
  redirect("/lekarz/profil");
}
