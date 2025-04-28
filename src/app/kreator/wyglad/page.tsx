"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BuilderAppearance from "@/components/builder-appearance"; // Adjust import path if needed
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import { Cake, Cookie, Gift } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useBuilder } from "@/context/builder-context";

function WygladContent() {
  const searchParams = useSearchParams();
  const { items: cartItems } = useCart();
  const {
    loadBuilderFromCartItem,
    resetBuilder,
    tastePreview,
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
            "Wyglad: Context mismatch or new edit. Loading item:",
            editId
          );
          loadBuilderFromCartItem(itemToEdit);
        } else {
          console.warn(`Wyglad: Cart item with id ${editId} not found.`);
          resetBuilder();
        }
      } else {
        console.log(
          "Wyglad: Context already loaded for item:",
          editId,
          "Skipping reload."
        );
      }
    } else {
      // If not editing, reset if necessary (e.g., navigating back from packaging without saving)
      if (editingItemId) {
        console.log("Wyglad: Navigated away from edit. Resetting builder.");
        resetBuilder();
      } else if (!tastePreview) {
        console.warn("Wyglad: Missing taste preview data. Resetting.");
        resetBuilder();
      }
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
