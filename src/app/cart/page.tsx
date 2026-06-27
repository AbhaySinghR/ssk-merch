import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartView from "@/components/cart/CartView";

export const metadata = {
  title: "Cart | Sainik School Kapurthala Merch",
};

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-maroon">
        <CartView />
      </main>
      <Footer />
    </div>
  );
}
