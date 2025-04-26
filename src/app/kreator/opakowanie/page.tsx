"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import { Cake, Cookie, Gift } from "lucide-react";
import { BuilderPackaging } from "@/components/builder-packaging";

// Define type for cake data throughout the builder process
interface CakeBuilderData {
  basePrice: number;
  tastePreview?: any; // Not just a string, could be complex object
  appearancePreview?: any; // Not just a string, could be complex object
  customText?: string;
}

export default function Opakowanie() {
  // State to hold data from previous builder steps
  const [cakeData, setCakeData] = useState<CakeBuilderData>({
    basePrice: 89.99,
  });

  // Load cake data from localStorage on component mount
  useEffect(() => {
    try {
      // Try to load data from localStorage
      const savedAppearanceData = localStorage.getItem("cake-appearance-data");
      const savedTasteData = localStorage.getItem("cake-taste-data");

      // Initialize with default data
      let newCakeData: CakeBuilderData = {
        basePrice: 89.99,
      };

      // Parse and merge appearance data if available
      if (savedAppearanceData) {
        const appearanceData = JSON.parse(savedAppearanceData);
        newCakeData = {
          ...newCakeData,
          // Store the entire appearance object, not just a URL
          appearancePreview:
            appearanceData.appearance || appearanceData.preview,
          customText: appearanceData.customText || "Custom Cake",
        };
      }

      // Parse and merge taste data if available
      if (savedTasteData) {
        const tasteData = JSON.parse(savedTasteData);
        newCakeData = {
          ...newCakeData,
          // Store the entire layers data, not just a URL
          tastePreview: tasteData.layers || tasteData.preview,
          basePrice: tasteData.basePrice || newCakeData.basePrice,
        };
      }

      setCakeData(newCakeData);
      console.log("Loaded cake data:", newCakeData);
    } catch (error) {
      console.error("Error loading cake data:", error);
      // Fallback to default values
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Stepper
        currentStep={3}
        steps={["Smak", "Wygląd", "Opakowanie"]}
        icons={[
          <Cake className="h-4 w-4" key="cake" />,
          <Cookie className="h-4 w-4" key="cookie" />,
          <Gift className="h-4 w-4" key="gift" />,
        ]}
      />

      <BuilderPackaging cakeData={cakeData} />

      <Footer />
    </div>
  );
}
