import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

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

export async function saveRegistration(registration: Registration) {
  await mkdir(DATA_DIR, { recursive: true });

  let registrations: Registration[] = [];
  try {
    const existing = await readFile(DATA_FILE, "utf-8");
    registrations = JSON.parse(existing);
  } catch {
    registrations = [];
  }

  registrations.push(registration);
  await writeFile(DATA_FILE, JSON.stringify(registrations, null, 2));
}
