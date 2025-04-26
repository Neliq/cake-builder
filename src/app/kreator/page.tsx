"use client";
import { useEffect, useState } from "react";
import CakeBuilder from "@/components/builder";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import { Cake, Cookie, Gift } from "lucide-react";

export default function Kreator() {
  const [importedLayerNames, setImportedLayerNames] = useState<string[] | null>(
    null
  );

  useEffect(() => {
    // Check if we have imported cake data
    try {
      const importedData = localStorage.getItem("importedCakeConfig");
      if (importedData) {
        const { layers } = JSON.parse(importedData);
        if (Array.isArray(layers)) {
          setImportedLayerNames(layers);
        }
        // Optional: remove from localStorage after reading
        // localStorage.removeItem("importedCakeConfig");
      }
    } catch (error) {
      console.error("Error reading imported cake config:", error);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Stepper
        currentStep={1}
        steps={["Smak", "Wygląd", "Opakowanie"]}
        icons={[
          <Cake className="h-4 w-4" key="cake" />,
          <Cookie className="h-4 w-4" key="cookie" />,
          <Gift className="h-4 w-4" key="gift" />,
        ]}
      />
      <CakeBuilder importedLayerNames={importedLayerNames} />
      <Footer />
    </div>
  );
}
