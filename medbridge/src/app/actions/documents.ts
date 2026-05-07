"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { ROLE, SLOT_STATUS, APPOINTMENT_STATUS } from "@/lib/constants";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadDocument(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const session = await getSession();
  if (!session || session.role !== ROLE.PACJENT) {
    return { error: "Brak dostępu" };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Wybierz plik" };

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Dozwolone formaty: PDF, JPG" };
  }

  if (file.size > MAX_SIZE) {
    return { error: "Plik nie może być większy niż 10 MB" };
  }

  const userDir = path.join(process.cwd(), "public", "uploads", session.id);
  await mkdir(userDir, { recursive: true });

  const ext = file.type === "application/pdf" ? ".pdf" : ".jpg";
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  const storagePath = path.join(userDir, safeName);

  const bytes = await file.arrayBuffer();
  await writeFile(storagePath, Buffer.from(bytes));

  await prisma.medicalDocument.create({
    data: {
      patientId: session.id,
      filename: file.name,
      storagePath: `/uploads/${session.id}/${safeName}`,
      mimeType: file.type,
    },
  });

  revalidatePath("/pacjent/dokumenty");
  return null;
}

export async function deleteDocument(documentId: string) {
  const session = await getSession();
  if (!session || session.role !== ROLE.PACJENT) return;

  const doc = await prisma.medicalDocument.findUnique({
    where: { id: documentId },
  });

  if (!doc || doc.patientId !== session.id) return;

  const fullPath = path.join(process.cwd(), "public", doc.storagePath);
  try {
    const { unlink } = await import("fs/promises");
    await unlink(fullPath);
  } catch {}

  await prisma.medicalDocument.delete({ where: { id: documentId } });
  revalidatePath("/pacjent/dokumenty");
}
