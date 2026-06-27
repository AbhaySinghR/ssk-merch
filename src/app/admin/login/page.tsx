import { redirect } from "next/navigation";

/**
 * Admin login no longer exists as a separate page.
 * Admins log in through the same /auth/login page — their role
 * is embedded in the JWT and middleware enforces /admin access.
 */
export default function AdminLoginPage() {
  redirect("/auth/login");
}
