"use client";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter, useSearchParams } from "next/navigation"; // Updated import for App Router
import { useBuilder } from "@/context/builder-context"; // Import the builder context
import { Wine, Wheat } from "lucide-react"; // Import icons

// Define types for cake layers and addons
type CakeLayer = {
  id: string;
  name: string;
  type: "dough" | "sponge" | "jelly" | "fruit" | "cream" | "topping"; // <-- make type match Addon
  color: string;
  height: number;
  price: number;
};

type Addon = {
  id: string;
  name: string;
  type: "dough" | "sponge" | "jelly" | "fruit" | "cream" | "topping";
  color: string;
  height: number;
  price: number; // Add price field
  containsAlcohol?: boolean; // Optional: Indicates alcohol content
  allergens?: string[]; // Optional: List of potential allergens
};

// Sample data for addons
const addons: Addon[] = [
  // Doughs
  {
    id: "d1",
    name: "Vanilla Dough",
    type: "dough",
    color: "#F5DEB3",
    height: 20,
    price: 12.99,
    allergens: ["Gluten", "Eggs", "Milk"],
  },
  {
    id: "d2",
    name: "Chocolate Dough",
    type: "dough",
    color: "#8B4513",
    height: 20,
    price: 14.99,
    allergens: ["Gluten", "Eggs", "Milk", "Soy"],
  },
  {
    id: "d3",
    name: "Red Velvet Dough",
    type: "dough",
    color: "#B22222",
    height: 20,
    price: 16.99,
    allergens: ["Gluten", "Eggs", "Milk"],
  },

  // Sponges
  {
    id: "s1",
    name: "Vanilla Sponge",
    type: "sponge",
    color: "#FFFACD",
    height: 30,
    price: 9.99,
    allergens: ["Gluten", "Eggs", "Milk"],
  },
  {
    id: "s2",
    name: "Chocolate Sponge",
    type: "sponge",
    color: "#5C4033",
    height: 30,
    price: 11.99,
    allergens: ["Gluten", "Eggs", "Milk", "Soy"],
  },
  {
    id: "s3", // Example with alcohol
    name: "Rum Sponge",
    type: "sponge",
    color: "#D2B48C",
    height: 30,
    price: 13.99,
    containsAlcohol: true,
    allergens: ["Gluten", "Eggs", "Milk"],
  },

  // Jellies
  {
    id: "j1",
    name: "Strawberry Jelly",
    type: "jelly",
    color: "#FF69B4",
    height: 10,
    price: 5.99,
  },
  {
    id: "j2",
    name: "Blueberry Jelly",
    type: "jelly",
    color: "#4169E1",
    height: 10,
    price: 6.99,
  },

  // Fruits
  {
    id: "f1",
    name: "Strawberries",
    type: "fruit",
    color: "#FF0000",
    height: 5,
    price: 7.99,
  },
  {
    id: "f2",
    name: "Blueberries",
    type: "fruit",
    color: "#0000FF",
    height: 5,
    price: 8.99,
  },

  // Creams
  {
    id: "c1",
    name: "Whipped Cream",
    type: "cream",
    color: "#FFFFFF",
    height: 15,
    price: 4.99,
    allergens: ["Milk"],
  },
  {
    id: "c2",
    name: "Buttercream",
    type: "cream",
    color: "#FFFDD0",
    height: 15,
    price: 6.99,
    allergens: ["Milk"],
  },
  {
    id: "c3", // Example with alcohol
    name: "Irish Cream",
    type: "cream",
    color: "#E1C699",
    height: 15,
    price: 8.99,
    containsAlcohol: true,
    allergens: ["Milk"],
  },

  // Toppings
  {
    id: "t1",
    name: "Chocolate Ganache",
    type: "topping",
    color: "#3D2314",
    height: 8,
    price: 7.99,
    allergens: ["Milk", "Soy"],
  },
  {
    id: "t2",
    name: "Sugar Glaze",
    type: "topping",
    color: "#F0F8FF",
    height: 8,
    price: 4.99,
  },
  {
    id: "t3",
    name: "Fruit Topping",
    type: "topping",
    color: "#FF4500",
    height: 8,
    price: 8.99,
  },
  {
    id: "t4",
    name: "Nut Topping",
    type: "topping",
    color: "#8B4513",
    height: 8,
    price: 6.99,
    allergens: ["Nuts"], // Example allergen
  },
  {
    id: "t5",
    name: "Sprinkles",
    type: "topping",
    color: "#FFD700",
    height: 8,
    price: 3.99,
  },
  {
    id: "t6",
    name: "Coconut Flakes",
    type: "topping",
    color: "#FFFFFF",
    height: 8,
    price: 5.99,
    allergens: ["Coconut"], // Example allergen
  },
];

// Sortable cake layer component
const SortableCakeLayer = ({
  layer,
  removeLayer,
}: {
  layer: CakeLayer;
  removeLayer: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: layer.color,
    height: `${layer.height}px`,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: "2px",
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full rounded-sm flex items-center justify-between px-2 group cursor-move relative"
    >
      {/* Left side content with drag handlers */}
      <div
        className="flex-grow flex items-center h-full"
        {...attributes}
        {...listeners}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full"></div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{layer.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Remove button - isolated from drag handlers */}
      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => removeLayer(layer.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          ✕
        </Button>
      </div>
    </div>
  );
};

// Add props interface for the CakeBuilder component
interface CakeBuilderProps {
  importedLayerNames?: string[] | null;
}

export default function CakeBuilder({
  importedLayerNames,
}: CakeBuilderProps = {}) {
  const { tastePreview } = useBuilder(); // Get tastePreview from context
  const [cakeLayers, setCakeLayers] = useState<CakeLayer[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [layerLimitReached, setLayerLimitReached] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params
  const editId = searchParams?.get("edit"); // Get the edit ID if present

  // Maximum number of layers
  const MAX_LAYERS = 12;

  // Get the builder context
  const { setTastePreview } = useBuilder();

  // Find the active layer for the drag overlay
  const activeLayer = activeId
    ? cakeLayers.find((layer) => layer.id === activeId)
    : null;

  // Helper function to find an addon by name (case-insensitive partial match)
  const findAddonByName = (name: string): Addon | undefined => {
    name = name.toLowerCase();
    return addons.find(
      (addon) =>
        addon.name.toLowerCase().includes(name) ||
        addon.type.toLowerCase() === name
    );
  };

  // Process imported layer names or initialize from context
  useEffect(() => {
    // Initialize layers from context if available (priority)
    if (tastePreview?.layers && tastePreview.layers.length > 0) {
      console.log(
        "Builder: Initializing layers from context",
        tastePreview.layers
      );
      // Map context layers to the component's state structure if needed
      // Ensure IDs are unique if context doesn't guarantee it for dnd-kit
      setCakeLayers(
        tastePreview.layers.map((layer) => ({
          ...layer,
          id: layer.id || `ctx_${Math.random()}`,
          // Explicitly cast the type to satisfy the component's CakeLayer type
          type: layer.type as CakeLayer["type"],
        }))
      );
    }
    // Fallback to importedLayerNames if context is empty (e.g., initial load before context is populated by edit)
    else if (importedLayerNames && importedLayerNames.length > 0) {
      console.log(
        "Builder: Initializing layers from props",
        importedLayerNames
      );
      // Convert layer names to full layer objects
      const importedLayers: CakeLayer[] = importedLayerNames
        .map((layerName) => {
          const addon = findAddonByName(layerName);
          if (addon) {
            return {
              id: `layer_${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 9)}`,
              name: addon.name,
              type: addon.type,
              color: addon.color,
              height: addon.height,
              price: addon.price,
            };
          }
          return null;
        })
        .filter((layer): layer is CakeLayer => layer !== null); // Filter out nulls

      if (importedLayers.length > 0) {
        setCakeLayers(importedLayers);
      }
    } else {
      // If neither context nor props have data, start empty
      setCakeLayers([]);
    }
  }, [tastePreview, importedLayerNames]);

  // Set up sensors for drag & drop (mouse, touch, keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addLayer = (
    addon: Addon,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Prevent default button behavior which might cause scroll shifts
    event?.preventDefault();

    if (cakeLayers.length >= MAX_LAYERS) {
      setLayerLimitReached(true);
      // Hide the warning after 3 seconds
      setTimeout(() => setLayerLimitReached(false), 3000);
      return;
    }

    // Add new layers to the beginning of the array (top of cake) instead of the end
    setCakeLayers((prevLayers) => [
      {
        id: `layer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Use more unique ID
        name: addon.name,
        type: addon.type,
        color: addon.color,
        height: addon.height,
        price: addon.price,
      },
      ...prevLayers, // Prepend the new layer
    ]);

    // Blur the button after adding the layer to prevent focus-related scroll shifts
    if (event?.currentTarget) {
      event.currentTarget.blur();
    }
  };

  const removeLayer = (layerId: string) => {
    setCakeLayers((prevLayers) =>
      prevLayers.filter((layer) => layer.id !== layerId)
    );
  };

  // Function to calculate total price
  const calculateTotalPrice = () => {
    return cakeLayers.reduce((total, layer) => total + layer.price, 0);
  };

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCakeLayers((layers) => {
        const oldIndex = layers.findIndex((layer) => layer.id === active.id);
        const newIndex = layers.findIndex((layer) => layer.id === over.id);

        return arrayMove(layers, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  // Individual requirement checks
  const hasThreeLayers = cakeLayers.length >= 3;

  const hasBottomDough = () => {
    if (cakeLayers.length === 0) return false;
    // Check the LAST layer in the array, which is visually the bottom one
    return cakeLayers[cakeLayers.length - 1].type === "dough";
  };

  const hasValidLayerStacking = () => {
    if (cakeLayers.length === 0) return true;
    // Iterate from top (index 0) to bottom (last index)
    let consecutiveNonDoughLayers = 0;
    for (let i = 0; i < cakeLayers.length; i++) {
      if (cakeLayers[i].type === "dough") {
        consecutiveNonDoughLayers = 0; // Reset counter when a dough layer is found
      } else {
        consecutiveNonDoughLayers++;
        if (consecutiveNonDoughLayers > 2) {
          // Found more than 2 consecutive non-dough layers
          return false;
        }
      }
    }
    // If the loop completes without returning false, the stacking is valid
    return true;
  };

  // Get all validation issues for the alert dialog
  const getValidationIssues = (): string[] => {
    const issues: string[] = [];

    if (!hasThreeLayers) {
      issues.push(
        "Twój tort potrzebuje co najmniej 3 warstw, aby kontynuować."
      );
    }

    if (!hasBottomDough()) {
      issues.push("Dolna warstwa musi być ciastem dla stabilności.");
    }

    if (!hasValidLayerStacking()) {
      issues.push(
        "Nie można układać więcej niż 2 warstw innych niż ciasto jedna na drugiej."
      );
    }

    return issues;
  };

  // Validate cake structure
  const validateCake = (): { isValid: boolean; message?: string } => {
    const issues = getValidationIssues();

    if (issues.length > 0) {
      return {
        isValid: false,
        message: issues[0],
      };
    }

    return { isValid: true };
  };

  // Handle continue button click
  const handleContinue = () => {
    setValidationAttempted(true);
    const validation = validateCake();

    if (validation.isValid) {
      // Create the taste preview data, including price
      const tastePreviewData = {
        layers: cakeLayers.map((layer) => ({
          id: layer.id,
          name: layer.name,
          type: layer.type,
          color: layer.color,
          height: layer.height,
          price: layer.price, // Ensure price is included here
        })),
      };

      // Update the builder context with the taste preview
      setTastePreview(tastePreviewData, calculateTotalPrice());

      // Also save to localStorage for backward compatibility
      localStorage.setItem(
        "cake-taste-data",
        JSON.stringify({
          layers: cakeLayers, // Storing full layers here already includes price
          basePrice: calculateTotalPrice(),
          tastePreview: tastePreviewData, // Storing the preview object as well
        })
      );

      // Construct the next step URL, including the edit parameter if it exists
      const nextStepUrl = editId
        ? `/kreator/wyglad?edit=${editId}`
        : "/kreator/wyglad";
      router.push(nextStepUrl);
    } else {
      // Show validation error
      setValidationMessage(
        validation.message || "Struktura twojego tortu jest nieprawidłowa."
      );
      setAlertOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-3xl font-bold mb-6">Kreator Tortu</h1> */}

      <div className="grid grid-cols-1 gap-8">
        {/* Cake Preview */}
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Podgląd Tortu</h2>
          {/* Add items-start to prevent columns from stretching vertically */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-start">
            <div className="w-64 mx-auto flex flex-col">
              {/* Fixed height cake preview area */}
              {/* Ensure overflow is hidden on the main fixed-height container */}
              <div className="h-[400px] relative overflow-hidden">
                {layerLimitReached && (
                  <div className="absolute top-0 left-0 right-0 z-10 bg-amber-100 text-amber-800 p-2 rounded-md text-center text-sm">
                    Osiągnięto limit {MAX_LAYERS} warstw!
                  </div>
                )}

                {/* Container for layers, positioned absolutely to stack from bottom */}
                {/* Use bottom-0 and padding-bottom to reserve space for the base */}
                <div className="absolute bottom-0 left-0 right-0 pb-4">
                  {/* REMOVED flex-col-reverse. Layers now render top-down matching array order. */}
                  <div className="flex flex-col w-full">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={cakeLayers.map((layer) => layer.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {cakeLayers.length > 0 ? (
                          cakeLayers.map((layer) => (
                            <SortableCakeLayer
                              key={layer.id}
                              layer={layer}
                              removeLayer={removeLayer}
                            />
                          ))
                        ) : (
                          // Placeholder when no layers
                          <div className="h-[380px] flex items-center justify-center">
                            <p className="text-gray-400 text-center">
                              Zacznij budować swój tort!
                            </p>
                          </div>
                        )}
                      </SortableContext>

                      {/* Drag overlay */}
                      <DragOverlay>
                        {activeId && activeLayer ? (
                          <div
                            className="w-full rounded-sm flex items-center justify-between px-2"
                            style={{
                              backgroundColor: activeLayer.color,
                              height: `${activeLayer.height}px`,
                              opacity: 0.8,
                              width: "100%",
                            }}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="w-full h-full"></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{activeLayer.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ) : null}
                      </DragOverlay>
                    </DndContext>
                  </div>
                </div>

                {/* Base plate for cake - fixed at bottom */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <div className="w-72 h-4 rounded-md bg-gray-300"></div>
                </div>
              </div>
            </div>

            {/* Requirements status and Price */}
            <div className="flex flex-col h-fit">
              {/* Inner container with fixed height and overflow hidden */}
              <div className="flex flex-col ">
                <h3 className="text-lg font-medium mb-2">Wymagania</h3>
                <ul className="space-y-2 bg-white p-4 rounded-md border">
                  {/* At least 3 layers requirement */}
                  <li
                    className={`flex items-center ${
                      hasThreeLayers
                        ? "text-green-500"
                        : validationAttempted && !hasThreeLayers
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {hasThreeLayers ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    ) : validationAttempted && !hasThreeLayers ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    )}
                    <span>Co najmniej 3 warstwy łącznie</span>
                  </li>

                  {/* Bottom dough requirement */}
                  <li
                    className={`flex items-center ${
                      hasBottomDough()
                        ? "text-green-500"
                        : validationAttempted && !hasBottomDough()
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {hasBottomDough() ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    ) : validationAttempted && !hasBottomDough() ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    )}
                    <span>Dolna warstwa musi być ciastem</span>
                  </li>

                  {/* Layer stacking requirement */}
                  <li
                    className={`flex items-center ${
                      hasValidLayerStacking()
                        ? "text-green-500"
                        : validationAttempted && !hasValidLayerStacking()
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {hasValidLayerStacking() ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    ) : validationAttempted && !hasValidLayerStacking() ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    )}
                    <span>Maksymalnie 2 warstwy inne niż ciasto pod rząd</span>
                  </li>
                </ul>

                {/* Price Display container */}
                <div className="mt-4 border-t pt-4 flex flex-col bg-white p-4 rounded-md border">
                  <h3 className="text-lg font-medium mb-2 flex-shrink-0">
                    Rozkład Cen
                  </h3>
                  <ScrollArea className="w-full h-[180px]">
                    <div className="space-y-2 pr-2">
                      {cakeLayers.map((layer) => (
                        <div
                          key={layer.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="mr-2 truncate">{layer.name}</span>
                          <span className="flex-shrink-0">
                            {/* Check if price exists before calling toFixed */}
                            {typeof layer.price === "number"
                              ? `${layer.price.toFixed(2)} zł`
                              : "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex justify-between items-center font-medium mt-4 pt-4 border-t flex-shrink-0">
                    <span>Cena całkowita:</span>
                    <span>{calculateTotalPrice().toFixed(2)} zł</span>
                  </div>
                </div>
                <div className="mt-4 w-full">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleContinue}
                    variant="default"
                  >
                    Przejdź do Następnego Kroku
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Addons Selection */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Dodaj Warstwy</h2>
          <Tabs defaultValue="dough">
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="dough">Ciasta</TabsTrigger>
              <TabsTrigger value="sponge">Biszkopt</TabsTrigger>
              <TabsTrigger value="jelly">Galaretki</TabsTrigger>
              <TabsTrigger value="fruit">Owoce</TabsTrigger>
              <TabsTrigger value="cream">Kremy</TabsTrigger>
              <TabsTrigger value="topping">Polewy</TabsTrigger>
            </TabsList>

            {["dough", "sponge", "jelly", "fruit", "cream", "topping"].map(
              (tabValue) => (
                <TabsContent key={tabValue} value={tabValue}>
                  <ScrollArea className="w-full">
                    <div className="flex flex-row gap-4 w-max p-2">
                      {addons
                        .filter((addon) => addon.type === tabValue)
                        .map((addon) => (
                          <Card
                            key={addon.id}
                            className="min-w-[100px] w-[120px] shrink-0 py-2 flex flex-col justify-between" // Added flex classes
                          >
                            <div>
                              {" "}
                              {/* Wrapper for top content */}
                              <CardHeader className="px-2 pt-2 pb-1">
                                {" "}
                                {/* Adjusted padding */}
                                <CardTitle className="text-xs text-center break-words min-h-[32px]">
                                  {addon.name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="px-2 pb-1">
                                {" "}
                                {/* Adjusted padding */}
                                <div
                                  className="w-full h-6 rounded aspect-square mb-1" // Added margin-bottom
                                  style={{ backgroundColor: addon.color }}
                                ></div>
                                <div className="text-center text-sm font-medium">
                                  {addon.price.toFixed(2)} zł
                                </div>
                                {/* Icons for Alcohol and Allergens */}
                                <div className="flex justify-center items-center space-x-2 mt-1 h-5">
                                  {" "}
                                  {/* Container for icons */}
                                  {addon.containsAlcohol && (
                                    <TooltipProvider delayDuration={100}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Wine className="h-4 w-4 text-purple-600" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Zawiera alkohol</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  {addon.allergens &&
                                    addon.allergens.length > 0 && (
                                      <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Wheat className="h-4 w-4 text-orange-600" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              Może zawierać alergeny:{" "}
                                              {addon.allergens.join(", ")}
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                </div>
                              </CardContent>
                            </div>
                            <CardFooter className="px-2 pt-0">
                              <Button
                                onClick={(e) => addLayer(addon, e)} // Pass the event object
                                size="sm"
                                className="w-full text-xs"
                              >
                                Dodaj
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </TabsContent>
              )
            )}
          </Tabs>
        </div>
      </div>

      {/* Validation Alert Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Problem ze Strukturą Tortu</AlertDialogTitle>
            <AlertDialogDescription>{validationMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
