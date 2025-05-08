import Features from "@/components/features/features";
import Footer from "@/components/footer/footer";
import Hero from "@/components/hero/hero";
import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <div className="w-full flex flex-col gap-8 justify-center items-center mb-10">
        <span className="text-2xl font-semibold tracking-tight">
          Sprawdź sam już teraz!
        </span>
        <Link href="/kreator">
          <Button size="lg">Kreator tortu</Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
