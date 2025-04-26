import CakeAppearanceBuilder from "@/components/builder-appearance";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import { Cake, Cookie, Gift } from "lucide-react";

export default function KreatorWyglad() {
  return (
    <div>
      <Navbar />
      <Stepper
        currentStep={2}
        steps={["Smak", "Wygląd", "Opakowanie"]}
        icons={[
          <Cake className="h-4 w-4" key="cake" />,
          <Cookie className="h-4 w-4" key="cookie" />,
          <Gift className="h-4 w-4" key="gift" />,
        ]}
      />
      <CakeAppearanceBuilder />
      <Footer />
    </div>
  );
}
