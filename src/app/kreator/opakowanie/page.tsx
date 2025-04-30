"use client";
import { useEffect, Suspense } from "react"; // Import Suspense
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
import { BuilderPackaging } from "@/components/builder-packaging"; // Use named import
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import { Cake, Cookie, Gift } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useBuilder } from "@/context/builder-context";

function OpakowanieContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Get router instance
  const { items: cartItems } = useCart();
  const {
    loadBuilderFromCartItem,
    resetBuilder,
    appearancePreview, // Keep appearancePreview to potentially check if navigation is valid
    editingItemId, // Get the editingItemId from context
  } = useBuilder();

  const handleStepClick = (step: number) => {
    const currentStep = 3; // This page is step 3
    if (step <= currentStep) {
      const editId = searchParams.get("edit");
      let path = "";
      switch (step) {
        case 1:
          path = "/kreator";
          break;
        case 2:
          path = "/kreator/wyglad";
          break;
        case 3:
          path = "/kreator/opakowanie";
          break;
        default:
          return; // Should not happen
      }
      const finalPath = editId ? `${path}?edit=${editId}` : path;
      router.push(finalPath);
    }
  };

  useEffect(() => {
    const editId = searchParams.get("edit");

    if (editId) {
      // Only load if the context doesn't already hold data for this editId
      if (editId !== editingItemId) {
        const itemToEdit = cartItems.find((item) => item.id === editId);
        if (itemToEdit) {
          console.log(
            "Opakowanie: Context mismatch or new edit ID. Loading item:",
            editId
          );
          loadBuilderFromCartItem(itemToEdit);
        } else {
          console.warn(
            `Opakowanie: Cart item with id ${editId} not found. Resetting.`
          );
          resetBuilder();
        }
      } else {
        console.log(
          "Opakowanie: Context matches edit ID:",
          editId,
          "Skipping reload."
        );
      }
    } else {
      // Not editing: Reset only if we were previously editing
      if (editingItemId) {
        console.log("Opakowanie: Navigated away from edit. Resetting builder.");
        resetBuilder();
      }
      // Removed reset based on !appearancePreview to preserve state on back navigation
      // else if (!appearancePreview) {
      //  console.warn("Opakowanie: Missing appearance preview data. Consider redirecting or handling missing state.");
      //  // Maybe redirect to step 2? router.push('/kreator/wyglad');
      // }
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
        onStepClick={handleStepClick} // Pass the handler
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
