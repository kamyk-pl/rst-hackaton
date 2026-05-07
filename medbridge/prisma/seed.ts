#!/usr/bin/env bun
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("haslo123", 10);

  const pacjent = await prisma.user.upsert({
    where: { email: "pacjent@test.pl" },
    update: {},
    create: {
      email: "pacjent@test.pl",
      hashedPassword,
      role: "PACJENT",
      patientProfile: {
        create: {
          firstName: "Anna",
          lastName: "Kowalska",
          dateOfBirth: "1985-03-15",
          allergies: "Penicylina, pyłki traw",
          chronicDiseases: "Nadciśnienie tętnicze",
          medications: "Amlodypina 5mg",
        },
      },
    },
  });

  const lekarz = await prisma.user.upsert({
    where: { email: "lekarz@test.pl" },
    update: {},
    create: {
      email: "lekarz@test.pl",
      hashedPassword,
      role: "LEKARZ",
      doctorProfile: {
        create: {
          firstName: "Jan",
          lastName: "Nowak",
          specialization: "Kardiolog",
        },
      },
    },
  });

  console.log("Seed zakończony:");
  console.log("  Pacjent:", pacjent.email);
  console.log("  Lekarz:", lekarz.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
