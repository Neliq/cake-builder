"use client";
import { useEffect, useState, Suspense } from "react"; // Import Suspense
import { useSearchParams } from "next/navigation";
import CakeBuilder from "@/components/builder";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import { Cake, Cookie, Gift } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useBuilder } from "@/context/builder-context"; // Import useBuilder

// Wrap the component logic that uses useSearchParams in a separate component
function KreatorContent() {
  const [importedLayerNames, setImportedLayerNames] = useState<string[] | null>(
    null
  );
  const searchParams = useSearchParams();
  const { items: cartItems } = useCart();
  const { loadBuilderFromCartItem, resetBuilder } = useBuilder(); // Get load function

  useEffect(() => {
    const editId = searchParams.get("edit");

    if (editId) {
      const itemToEdit = cartItems.find((item) => item.id === editId);
      if (itemToEdit) {
        console.log("Found item to edit, loading into builder:", itemToEdit);
        loadBuilderFromCartItem(itemToEdit); // Load item data into context

        // Optionally set importedLayerNames if CakeBuilder still needs it directly
        // This might become redundant if CakeBuilder reads directly from context
        if (itemToEdit.tastePreview?.layers) {
          const layerNames = itemToEdit.tastePreview.layers.map(
            (layer) => layer.name
          );
          setImportedLayerNames(layerNames);
        }
      } else {
        console.warn(`Cart item with id ${editId} not found.`);
        // Decide fallback behavior: reset or load from localStorage?
        resetBuilder(); // Reset if item not found
        checkLocalStorageImport();
      }
    } else {
      // Not editing, reset builder and check localStorage
      resetBuilder(); // Reset builder when starting fresh
      checkLocalStorageImport();
    }
    // Ensure dependencies cover changes
  }, [searchParams, cartItems, loadBuilderFromCartItem, resetBuilder]);

  // Function to check localStorage (extracted from original useEffect)
  const checkLocalStorageImport = () => {
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
  };

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
      {/* Pass potentially loaded names, but CakeBuilder should prioritize context */}
      <CakeBuilder importedLayerNames={importedLayerNames} />
      <Footer />
    </div>
  );
}

// Main export uses Suspense for searchParams
export default function Kreator() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KreatorContent />
    </Suspense>
  );
}
