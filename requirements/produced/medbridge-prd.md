# MedBridge — Product Requirements Document

## Problem Statement

Specialist doctor visits are inefficient because patients must recount their full medical history at every visit, and their medical documentation is scattered across institutions and formats. Doctors lack access to relevant patient history before the visit begins, leading to wasted time and suboptimal care.

MedBridge addresses this by giving patients a centralized place to manage their medical documentation and share it selectively with doctors at the time of booking a visit.

## Solution

A web application with two distinct roles — Patient and Doctor — where:

- Patients maintain a health profile, upload medical documents, schedule visits with doctors, and grant doctors access to their documents as part of the booking flow.
- Doctors configure their availability schedule, view their upcoming appointments, preview patient-shared data before visits, and document visit outcomes.

The application is a local prototype targeting a single end-to-end demo with two pre-seeded users.

## User Stories

### Authentication & Access

1. As a patient, I want to log in with my email and password, so that I can access my personal health data.
2. As a doctor, I want to log in with my email and password, so that I can access my appointment schedule and patient data.
3. As a patient, I want to be redirected to my patient dashboard after login, so that I land in the right context immediately.
4. As a doctor, I want to be redirected to my doctor dashboard after login, so that I land in the right context immediately.
5. As any user, I want to be unable to access the other role's pages, so that patient and doctor data remains appropriately separated.
6. As any user, I want to log out of the application, so that my session is closed.

### Patient Profile

7. As a patient, I want to view my profile, so that I can see what information is stored about me.
8. As a patient, I want to edit my first name and last name, so that my identity is correctly recorded.
9. As a patient, I want to edit my date of birth, so that my age context is available to doctors.
10. As a patient, I want to edit my list of allergies including the allergen, reaction type, and severity, so that doctors have clinically actionable allergy information.
11. As a patient, I want to edit my list of chronic diseases, so that doctors have an overview of my long-term conditions.
12. As a patient, I want to edit my list of medications taken permanently, so that doctors can check for interactions.

### Medical Documentation

13. As a patient, I want to upload a medical document (PDF or image), so that I can store it in the system.
14. As a patient, I want to see a list of my uploaded documents, so that I can manage my documentation.
15. As a patient, I want to delete a document I uploaded that has not been shared in any appointment, so that I can keep my documentation clean without breaking existing appointment references.
16. As a patient, I want to select which of my documents to share with a doctor when booking a visit, so that I control what the doctor can access.
17. As a doctor, I want to view documents shared with me for a specific appointment, so that I can review patient history before the visit.
18. As a doctor, I want to download a document shared by the patient, so that I can read it in full.

### Doctor Profile

19. As a doctor, I want to view my profile, so that I can see what information is stored about me.
20. As a doctor, I want to edit my first name and last name, so that my identity is correctly recorded.
21. As a doctor, I want to edit my specialization, so that patients know what kind of care I provide.

### Doctor Schedule

22. As a doctor, I want to configure the days of the week I am available, so that patients can only book me on those days.
23. As a doctor, I want to set my working start and end time, so that slots are only offered within my working hours.
24. As a doctor, I want to set my appointment slot duration (in minutes), so that the system generates correctly sized slots.
25. As a doctor, I want to update my schedule, so that changes take effect for future bookings.

### Appointment Booking

26. As a patient, I want to see a list of available doctors, so that I can choose who to book with.
27. As a patient, I want to see available time slots for a selected doctor, so that I can pick a convenient time.
28. As a patient, I want to see only future, unbooked slots within the doctor's schedule, so that I don't accidentally book taken or past times.
29. As a patient, I want to select which of my documents to share during the booking flow, so that the doctor has access to relevant history.
30. As a patient, I want to confirm my booking, so that the appointment is created.
31. As a patient, I want to see my upcoming appointments, so that I know when my visits are scheduled.
32. As a patient, I want to see past appointments in my visit history, so that I can review completed visits.

### Doctor Appointment Panel

33. As a doctor, I want to see my upcoming appointments, so that I can plan my day.
34. As a doctor, I want to see the patient's name and appointment time for each visit, so that I have an overview of my schedule.
35. As a doctor, I want to view the patient's profile data (allergies, chronic diseases, medications) for a booked appointment, so that I can prepare before the visit.
36. As a doctor, I want to view documents shared by the patient for a specific appointment, so that I can review their documentation.

### Visit Summary

37. As a doctor, I want to add a visit summary after a visit, so that the patient has a record of the outcome.
38. As a doctor, I want to record a diagnosis in the visit summary, so that the patient knows what was identified.
39. As a doctor, I want to record recommendations in the visit summary, so that the patient knows what actions to take.
40. As a doctor, I want to record prescribed medications in the visit summary, so that the patient has a clear medication record.
41. As a doctor, I want to record referrals for tests in the visit summary, so that the patient knows what follow-up examinations are needed.
42. As a patient, I want to view the visit summary for a completed appointment immediately after the doctor submits it, so that I have access to my post-visit information.
43. As a patient, I want to see all visit summaries in my visit history, so that I have a longitudinal record of my care.

## Implementation Decisions

### Architecture

- **Hexagonal architecture** (ports and adapters) throughout. The domain and application layers have no framework dependencies. Next.js server actions form the thin presentation layer that calls into use cases via ports.
- Directory structure: `src/domain/`, `src/application/`, `src/infrastructure/`, `src/presentation/`

### Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: SQLite via Prisma ORM
- **Auth**: NextAuth (credentials provider)
- **UI**: shadcn/ui + Tailwind CSS
- **File storage**: Local filesystem (`/uploads` at project root), file path stored in DB

### Data Model (conceptual)

- `User` — technical auth entity: email, hashed password, role (`PATIENT | DOCTOR`)
- `Patient` — domain entity linked to User: firstName, lastName, dateOfBirth, allergies, chronicDiseases, medications
- `Allergy` — structured sub-entity on Patient: allergen (string), reactionType (string), severity (`MILD | MODERATE | SEVERE`), dateIdentified (optional date)
- `Doctor` — domain entity linked to User: firstName, lastName, specialization
- `DoctorSchedule` — one per Doctor: activeDays (array), startTime, endTime, slotDurationMinutes
- `Document` — owned by Patient: fileName, filePath, uploadedAt
- `Appointment` — links Patient + Doctor + datetime; contains list of shared Document references
- `VisitSummary` — one per Appointment: diagnosis, recommendations, medications, referrals

### Auth & Role Context

- `User` is a purely technical entity for authentication
- On login, NextAuth resolves the role from the User record and loads the corresponding domain entity (Patient or Doctor) into session context
- Next.js middleware enforces route access per role: `/patient/*` requires PATIENT role, `/doctor/*` requires DOCTOR role

### Slot Computation

- The `DoctorSchedule` rule is stored in the DB; no individual slot rows are persisted
- A **SlotComputationEngine** (pure function, domain layer) computes available slots: `(scheduleRule, bookedAppointments, dateRange) → Slot[]`
- A slot is "available" if it falls on an active day, within working hours, and is not already booked
- Only `Appointment` records are persisted

### Document Sharing

- Document access is scoped per appointment — not per doctor globally
- During booking, the patient selects zero or more of their uploaded documents to share
- Shared document references are stored on the Appointment record
- After booking, sharing cannot be modified (prototype scope)

### Document Deletion Policy

- A document can only be deleted if it is not referenced by any appointment
- If a document is shared in one or more appointments, the delete action is blocked and the patient is shown a message indicating which appointments reference the document
- This prevents dangling file references during active visits

### Visit Summary

- Doctor submits the summary in a single action; no draft state
- Patient can read the summary immediately after submission
- Summary is visible in the patient's visit history

### Seeding

- A `prisma/seed.ts` script creates two pre-configured users: one patient, one doctor
- Seed includes complete profile data and a doctor schedule so the demo can run end-to-end without manual setup

## Testing Decisions

**What makes a good test**: Tests should verify external behavior observable through the module's public interface, not implementation details. Avoid testing which internal functions were called; test what comes out given what goes in.

### Modules and test approach

| Module | Test approach |
|---|---|
| **SlotComputationEngine** | Pure unit tests — input schedule rule + booked appointments → assert correct available slots. Cover edge cases: fully booked day, no active days, slot at boundary of working hours. |
| **Auth** | Integration tests — verify credentials provider accepts correct credentials, rejects wrong ones, and session contains correct role. |
| **PatientProfile** | Integration tests — use case layer: create/update patient profile, assert DB state via repository port. |
| **DoctorProfile** | Integration tests — same pattern as PatientProfile. |
| **Schedule** | Unit tests for SlotComputationEngine (above) + integration tests for schedule persistence via repository port. |
| **Document** | Integration tests — upload file via port, assert filesystem write and DB record; retrieve by appointment, assert correct documents returned. Use a temp directory for test isolation. |
| **Appointment** | Integration tests — full booking flow: slot selection, document sharing, appointment creation. Assert slot is no longer available after booking. |
| **VisitSummary** | Integration tests — doctor submits summary, patient retrieves it. Assert fields persisted correctly. |

Tests targeting infrastructure adapters (Prisma, filesystem) should use a real SQLite test database and a temp directory — no mocks for storage.

## Out of Scope

- User registration (users are pre-seeded only)
- Payment processing
- Email notifications
- GDPR / HIPAA compliance
- Production deployment or cloud infrastructure
- Multiple timezones or language switching
- Appointment cancellation or rescheduling
- Doctor-side modification of shared document access after booking
- Recurring schedule variations per day (all active days share the same start/end time and slot duration)

### Deferred — clinical completeness (post-prototype)

- **Patient biological sex** — required for accurate drug dosing and lab reference ranges; deferred as the prototype does not perform any clinical calculations
- **Patient blood type** — critical for surgical/emergency contexts; out of scope for a scheduling and documentation prototype
- **Medication dose and frequency** — the medication list captures drug names only; structured dosage (dose, frequency, route) is deferred to a production iteration
- **Visit state machine** — no explicit "visit occurred" state; the prototype treats appointment date passing as implicit. A production system would model visit lifecycle (scheduled → in-progress → completed)
- **Document access timing policy** — when exactly a doctor can access shared documents (immediately, day-of, until summary filed) is undefined; for the prototype, access is granted from booking time onward
- **Multiple appointment slot durations per doctor** — the prototype supports one slot duration per doctor; differentiation between initial consultations and follow-ups is deferred
- **Structured referral fields** — referrals in the visit summary are free text; structured fields (test name, urgency, target institution) are deferred
- **PESEL number** — the Polish national identifier encodes DOB and sex and is the primary patient ID in Polish healthcare; integration is out of scope for this prototype
- **ICD-10 diagnosis codes** — the diagnosis field is free text; structured ICD-10 coding (required by NFZ in production) is deferred
- **Audit trail** — logging of who accessed which patient data and when is not implemented; required in any production or regulated deployment

## Further Notes

- The application is intended for local demo only. Two pre-seeded users (one patient, one doctor) must be able to complete the full end-to-end workflow.
- The hexagonal architecture is intentional: the file storage adapter and database adapter should be replaceable without touching domain or use case code — this is the primary architectural goal for post-prototype productionization.
- The slot computation engine is the most testable and logic-dense component — prioritize getting its interface right early, as appointment booking depends on it.
