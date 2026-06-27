import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { sql } from "@/lib/db";

export type Registration = {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  schoolNumber: string;
  batch: string;
  registeredAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "registrations.json");

export async function saveRegistrationToDb(registration: Registration): Promise<void> {
  if (!sql) {
    await saveRegistration(registration);
    return;
  }
  try {
    await sql`
      INSERT INTO registrations (title, first_name, last_name, email, phone, school_number, batch)
      VALUES (
        ${registration.title},
        ${registration.firstName},
        ${registration.lastName},
        ${registration.email},
        ${registration.phone},
        ${registration.schoolNumber},
        ${registration.batch}
      )
    `;
  } catch (err) {
    console.error("[saveRegistrationToDb] DB insert failed:", err);
    // Fall back to file-based storage so the registration is not lost
    await saveRegistration(registration);
  }
}

export async function saveRegistration(registration: Registration): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });

  let registrations: Registration[] = [];
  try {
    const existing = await readFile(DATA_FILE, "utf-8");
    registrations = JSON.parse(existing) as Registration[];
  } catch {
    registrations = [];
  }

  registrations.push(registration);
  await writeFile(DATA_FILE, JSON.stringify(registrations, null, 2));
}
