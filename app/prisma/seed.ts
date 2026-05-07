/**
 * Seed script — creates two pre-configured demo users:
 *   patient@medbridge.dev  / patient123
 *   doctor@medbridge.dev   / doctor123
 *
 * Run: npx prisma db seed
 */
import { createPrismaClient, DEV_DB_URL } from "../src/infrastructure/db/prisma.js";
import { hash } from "bcryptjs";

const prisma = createPrismaClient(process.env.DATABASE_URL ?? DEV_DB_URL);

async function main() {
  // ── Patient ─────────────────────────────────────────────────────────────
  const patientUser = await prisma.user.upsert({
    where: { email: "patient@medbridge.dev" },
    update: {},
    create: {
      email: "patient@medbridge.dev",
      hashedPassword: await hash("patient123", 10),
      role: "PATIENT",
      patient: {
        create: {
          firstName: "Anna",
          lastName: "Kowalska",
          dateOfBirth: new Date("1990-04-15"),
          allergies: {
            create: [
              {
                allergen: "Penicillin",
                reactionType: "Anaphylaxis",
                severity: "SEVERE",
                dateIdentified: new Date("2015-06-01"),
              },
              {
                allergen: "Dust mites",
                reactionType: "Rhinitis",
                severity: "MILD",
              },
            ],
          },
          diseases: {
            create: [
              { name: "Hashimoto's thyroiditis" },
              { name: "Irritable bowel syndrome" },
            ],
          },
          medications: {
            create: [
              { name: "Levothyroxine 50 mcg" },
              { name: "Vitamin D 2000 IU" },
            ],
          },
        },
      },
    },
  });

  // ── Doctor ──────────────────────────────────────────────────────────────
  const doctorUser = await prisma.user.upsert({
    where: { email: "doctor@medbridge.dev" },
    update: {},
    create: {
      email: "doctor@medbridge.dev",
      hashedPassword: await hash("doctor123", 10),
      role: "DOCTOR",
      doctor: {
        create: {
          firstName: "Marek",
          lastName: "Nowak",
          specialization: "Internal Medicine",
          schedule: {
            create: {
              // Monday–Friday (ISO 1–5)
              activeDays: JSON.stringify([1, 2, 3, 4, 5]),
              startTime: "08:00",
              endTime: "16:00",
              slotDurationMinutes: 30,
            },
          },
        },
      },
    },
  });

  console.log(`Seeded patient user: ${patientUser.email}`);
  console.log(`Seeded doctor user:  ${doctorUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
