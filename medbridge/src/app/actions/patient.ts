"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

export async function updatePatientProfile(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const session = await getSession();
  if (!session || session.role !== ROLE.PACJENT) {
    return { error: "Brak dostępu" };
  }

  const firstName = ((formData.get("firstName") ?? "") as string).trim();
  const lastName = ((formData.get("lastName") ?? "") as string).trim();

  if (!firstName || !lastName) {
    return { error: "Imię i nazwisko są wymagane" };
  }

  await prisma.patientProfile.upsert({
    where: { userId: session.id },
    update: {
      firstName,
      lastName,
      dateOfBirth: (formData.get("dateOfBirth") as string) ?? "",
      allergies: (formData.get("allergies") as string) ?? "",
      chronicDiseases: (formData.get("chronicDiseases") as string) ?? "",
      medications: (formData.get("medications") as string) ?? "",
    },
    create: {
      userId: session.id,
      firstName,
      lastName,
      dateOfBirth: (formData.get("dateOfBirth") as string) ?? "",
      allergies: (formData.get("allergies") as string) ?? "",
      chronicDiseases: (formData.get("chronicDiseases") as string) ?? "",
      medications: (formData.get("medications") as string) ?? "",
    },
  });

  revalidatePath("/pacjent/profil");
  redirect("/pacjent/profil");
}
