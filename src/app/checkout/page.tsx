import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { sql } from "@/lib/db";

export const metadata = {
  title: "Checkout | Sainik School Kapurthala Merch",
};

export default async function CheckoutPage() {
  // Prefill delivery details from the logged-in user's registration data
  let prefill = { customerName: "", email: "", phone: "" };

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (token && process.env.JWT_ACCESS_SECRET) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_ACCESS_SECRET),
      );
      const userEmail = payload.email as string | undefined;

      if (sql && userEmail) {
        const rows = await sql`
          SELECT first_name, last_name, phone
          FROM registrations
          WHERE email = ${userEmail}
          LIMIT 1
        `;
        if (rows[0]) {
          prefill = {
            customerName: `${rows[0].first_name} ${rows[0].last_name}`,
            email: userEmail,
            phone: rows[0].phone as string,
          };
        }
      }
    } catch {
      // Token invalid or DB down — just leave prefill empty
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-maroon">
        <CheckoutForm prefill={prefill} />
      </main>
      <Footer />
    </div>
  );
}
