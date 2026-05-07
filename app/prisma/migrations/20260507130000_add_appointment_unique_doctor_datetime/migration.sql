-- Add unique constraint to prevent double-booking a doctor at the same datetime
CREATE UNIQUE INDEX "Appointment_doctorId_datetime_key" ON "Appointment"("doctorId", "datetime");
