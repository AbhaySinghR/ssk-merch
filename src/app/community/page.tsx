import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommunityHero from "@/components/CommunityHero";
import ChaptersSection from "@/components/ChaptersSection";
import CommunityGallery from "@/components/CommunityGallery";

export const metadata: Metadata = {
  title: "Community | Sainik School Kapurthala Merch",
  description:
    "Connecting Saikapians across India, the US, Canada, and beyond.",
};

export default function CommunityPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <CommunityHero />
        <ChaptersSection />
        <CommunityGallery />
      </main>
      <Footer />
    </div>
  );
}
