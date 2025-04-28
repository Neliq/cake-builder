"use client";
import { useEffect, Suspense } from "react"; // Import Suspense
import { useSearchParams } from "next/navigation";
import { BuilderPackaging } from "@/components/builder-packaging"; // Use named import
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import { Cake, Cookie, Gift } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useBuilder } from "@/context/builder-context";

function OpakowanieContent() {
  const searchParams = useSearchParams();
  const { items: cartItems } = useCart();
  const {
    loadBuilderFromCartItem,
    resetBuilder,
    appearancePreview,
    editingItemId, // Get the editingItemId from context
  } = useBuilder();

  useEffect(() => {
    const editId = searchParams.get("edit");

    if (editId) {
      // Only load if the context doesn't already hold data for this editId
      if (editId !== editingItemId) {
        const itemToEdit = cartItems.find((item) => item.id === editId);
        if (itemToEdit) {
          console.log(
            "Opakowanie: Context mismatch or new edit. Loading item:",
            editId
          );
          loadBuilderFromCartItem(itemToEdit);
        } else {
          console.warn(`Opakowanie: Cart item with id ${editId} not found.`);
          resetBuilder();
        }
      } else {
        console.log(
          "Opakowanie: Context already loaded for item:",
          editId,
          "Skipping reload."
        );
      }
    } else {
      // If not editing, reset if necessary
      if (editingItemId) {
        console.log("Opakowanie: Navigated away from edit. Resetting builder.");
        resetBuilder();
      } else if (!appearancePreview) {
        console.warn("Opakowanie: Missing appearance preview data. Resetting.");
        resetBuilder();
      }
    }
    // Keep dependencies minimal
  }, [
    searchParams,
    cartItems,
    loadBuilderFromCartItem,
    resetBuilder,
    editingItemId,
  ]); // Add editingItemId dependency

  return (
    <div>
      <Navbar />
      <Stepper
        currentStep={3} // Current step is Opakowanie
        steps={["Smak", "Wygląd", "Opakowanie"]}
        icons={[
          <Cake className="h-4 w-4" key="cake" />,
          <Cookie className="h-4 w-4" key="cookie" />,
          <Gift className="h-4 w-4" key="gift" />,
        ]}
      />
      <BuilderPackaging />
      <Footer />
    </div>
  );
}

export default function OpakowaniePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OpakowanieContent />
    </Suspense>
  );
}
