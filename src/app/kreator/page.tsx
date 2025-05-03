"use client";
import { useEffect, useState, Suspense } from "react"; // Import Suspense
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
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
  const router = useRouter(); // Get router instance
  const searchParams = useSearchParams();
  const { items: cartItems } = useCart();
  const { loadBuilderFromCartItem, resetBuilder, editingItemId } = useBuilder(); // Add editingItemId

  const handleStepClick = (step: number) => {
    const currentStep = 1; // This page is step 1
    if (step <= currentStep) {
      const editId = searchParams?.get("edit"); // Use optional chaining
      let path = "";
      switch (step) {
        case 1:
          path = "/kreator";
          break;
        // Add cases for other steps if needed, though they won't be clickable from here
        default:
          return;
      }
      const finalPath = editId ? `${path}?edit=${editId}` : path;
      // Only navigate if the path changes (or if forcing a refresh is desired)
      if (
        window.location.pathname !== finalPath.split("?")[0] ||
        searchParams?.get("edit") !== editId // Use optional chaining
      ) {
        router.push(finalPath);
      }
    }
  };

  useEffect(() => {
    const editId = searchParams?.get("edit"); // Use optional chaining

    if (editId) {
      // Editing: Load only if the editId is different from the context's editingItemId
      if (editId !== editingItemId) {
        const itemToEdit = cartItems.find((item) => item.id === editId);
        if (itemToEdit) {
          console.log("Kreator: Loading item to edit:", editId);
          loadBuilderFromCartItem(itemToEdit);
          // Update local state if still needed by CakeBuilder directly
          if (itemToEdit.tastePreview?.layers) {
            const layerNames = itemToEdit.tastePreview.layers.map(
              (layer) => layer.name
            );
            setImportedLayerNames(layerNames);
          } else {
            setImportedLayerNames(null); // Clear if no layers
          }
        } else {
          console.warn(
            `Kreator: Cart item with id ${editId} not found. Resetting.`
          );
          resetBuilder();
          setImportedLayerNames(null);
          // Optionally check local storage as fallback?
          // checkLocalStorageImport();
        }
      } else {
        console.log("Kreator: Already editing item:", editId);
        // Ensure local state reflects context if needed
        // This part might be redundant if CakeBuilder reads directly from context
        const currentEditItem = cartItems.find(
          (item) => item.id === editingItemId
        );
        if (currentEditItem?.tastePreview?.layers) {
          const layerNames = currentEditItem.tastePreview.layers.map(
            (l) => l.name
          );
          setImportedLayerNames(layerNames);
        } else if (!editingItemId) {
          // If somehow editingItemId is null/undefined here
          setImportedLayerNames(null);
        }
      }
    } else {
      // Not editing: Reset only if we were previously editing
      if (editingItemId) {
        console.log("Kreator: Navigated away from edit. Resetting builder.");
        resetBuilder();
        setImportedLayerNames(null);
      } else {
        // Persist state if navigating back from step 2/3 in a non-edit flow
        console.log("Kreator: Non-edit mode or fresh start.");
        // checkLocalStorageImport(); // Keep checking local storage for initial import?
      }
    }
    // Ensure dependencies cover changes
  }, [
    searchParams,
    cartItems,
    loadBuilderFromCartItem,
    resetBuilder,
    editingItemId,
  ]);

  return (
    <div>
      <Navbar />
      <Stepper
        currentStep={1}
        steps={["Smak", "Wygląd", "Opakowanie"]}
        onStepClick={handleStepClick} // Pass the handler
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
