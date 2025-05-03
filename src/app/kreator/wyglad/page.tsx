"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
import BuilderAppearance from "@/components/builder-appearance"; // Adjust import path if needed
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import { Cake, Cookie, Gift } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useBuilder } from "@/context/builder-context";

function WygladContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Get router instance
  const { items: cartItems } = useCart();
  const {
    loadBuilderFromCartItem,
    resetBuilder,
    editingItemId, // Get the editingItemId from context
  } = useBuilder();

  const handleStepClick = (step: number) => {
    const currentStep = 2; // This page is step 2
    if (step <= currentStep) {
      const editId = searchParams?.get("edit"); // Use optional chaining
      let path = "";
      switch (step) {
        case 1:
          path = "/kreator";
          break;
        case 2:
          path = "/kreator/wyglad";
          break;
        // Add case 3 if needed, though it won't be clickable from here yet
        default:
          return;
      }
      const finalPath = editId ? `${path}?edit=${editId}` : path;
      router.push(finalPath);
    }
  };

  useEffect(() => {
    const editId = searchParams?.get("edit"); // Use optional chaining

    if (editId) {
      // Only load if the context doesn't already hold data for this editId
      if (editId !== editingItemId) {
        const itemToEdit = cartItems.find((item) => item.id === editId);
        if (itemToEdit) {
          console.log(
            "Wyglad: Context mismatch or new edit ID. Loading item:",
            editId
          );
          loadBuilderFromCartItem(itemToEdit);
        } else {
          console.warn(
            `Wyglad: Cart item with id ${editId} not found. Resetting.`
          );
          resetBuilder();
        }
      } else {
        console.log(
          "Wyglad: Context matches edit ID:",
          editId,
          "Skipping reload."
        );
      }
    } else {
      // Not editing: Reset only if we were previously editing
      if (editingItemId) {
        console.log("Wyglad: Navigated away from edit. Resetting builder.");
        resetBuilder();
      }
      // Removed reset based on !tastePreview to preserve state on back navigation
      // else if (!tastePreview) {
      //   console.warn("Wyglad: Missing taste preview data. Consider redirecting or handling missing state.");
      //   // Maybe redirect to step 1? router.push('/kreator');
      // }
    }
    // Keep dependencies minimal - rely on editId change and context check
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
        currentStep={2} // Current step is Wygląd
        steps={["Smak", "Wygląd", "Opakowanie"]}
        onStepClick={handleStepClick} // Pass the handler
        icons={[
          <Cake className="h-4 w-4" key="cake" />,
          <Cookie className="h-4 w-4" key="cookie" />,
          <Gift className="h-4 w-4" key="gift" />,
        ]}
      />
      <BuilderAppearance />
      <Footer />
    </div>
  );
}

export default function WygladPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WygladContent />
    </Suspense>
  );
}
