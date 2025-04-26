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
import { useRouter } from "next/navigation"; // Updated import for App Router

// Define types for cake layers and addons
type CakeLayer = {
  id: string;
  name: string;
  type: string;
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
  },
  {
    id: "d2",
    name: "Chocolate Dough",
    type: "dough",
    color: "#8B4513",
    height: 20,
    price: 14.99,
  },
  {
    id: "d3",
    name: "Red Velvet Dough",
    type: "dough",
    color: "#B22222",
    height: 20,
    price: 16.99,
  },

  // Sponges
  {
    id: "s1",
    name: "Vanilla Sponge",
    type: "sponge",
    color: "#FFFACD",
    height: 30,
    price: 9.99,
  },
  {
    id: "s2",
    name: "Chocolate Sponge",
    type: "sponge",
    color: "#5C4033",
    height: 30,
    price: 11.99,
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
  },
  {
    id: "c2",
    name: "Buttercream",
    type: "cream",
    color: "#FFFDD0",
    height: 15,
    price: 6.99,
  },

  // Toppings
  {
    id: "t1",
    name: "Chocolate Ganache",
    type: "topping",
    color: "#3D2314",
    height: 8,
    price: 7.99,
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
  const [cakeLayers, setCakeLayers] = useState<CakeLayer[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [validationAttempted, setValidationAttempted] = useState(false);
  const router = useRouter();

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

  // Process imported layer names when component mounts or importedLayerNames changes
  useEffect(() => {
    if (importedLayerNames && importedLayerNames.length > 0) {
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
        .filter((layer): layer is CakeLayer => layer !== null);

      if (importedLayers.length > 0) {
        setCakeLayers(importedLayers);
      }
    }
  }, [importedLayerNames]);

  // Set up sensors for drag & drop (mouse, touch, keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addLayer = (addon: Addon) => {
    setCakeLayers([
      ...cakeLayers,
      {
        id: `layer_${Date.now()}`,
        name: addon.name,
        type: addon.type,
        color: addon.color,
        height: addon.height,
        price: addon.price,
      },
    ]);
  };

  const removeLayer = (layerId: string) => {
    setCakeLayers(cakeLayers.filter((layer) => layer.id !== layerId));
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
    return cakeLayers[0].type === "dough";
  };

  const hasValidLayerStacking = () => {
    if (cakeLayers.length === 0) return true;
    let consecutiveNonDoughLayers = 0;
    for (let i = 0; i < cakeLayers.length; i++) {
      if (cakeLayers[i].type === "dough") {
        consecutiveNonDoughLayers = 0;
      } else {
        consecutiveNonDoughLayers++;
        if (consecutiveNonDoughLayers > 2) {
          return false;
        }
      }
    }
    return true;
  };

  // Get all validation issues for the alert dialog
  const getValidationIssues = (): string[] => {
    const issues: string[] = [];

    if (!hasThreeLayers) {
      issues.push("Your cake needs at least 3 layers to continue.");
    }

    if (!hasBottomDough()) {
      issues.push("The bottom layer must be a dough type for stability.");
    }

    if (!hasValidLayerStacking()) {
      issues.push(
        "You cannot stack more than 2 non-dough layers on top of each other."
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
      // Save cake data including price and layer data for preview
      localStorage.setItem(
        "cake-taste-data",
        JSON.stringify({
          layers: cakeLayers,
          basePrice: calculateTotalPrice(),
          tastePreview: {
            layers: cakeLayers.map((layer) => ({
              id: layer.id,
              name: layer.name,
              type: layer.type,
              color: layer.color,
              height: layer.height,
            })),
          },
        })
      );

      router.push("/kreator/wyglad");
    } else {
      // Show validation error
      setValidationMessage(
        validation.message || "Your cake structure is invalid."
      );
      setAlertOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Cake Builder</h1>

      <div className="grid grid-cols-1 gap-8">
        {/* Cake Preview */}
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Cake Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
            <div className="flex flex-col items-center w-64 mx-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={[...cakeLayers].reverse().map((layer) => layer.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {cakeLayers.length > 0 ? (
                    [...cakeLayers]
                      .reverse()
                      .map((layer) => (
                        <SortableCakeLayer
                          key={layer.id}
                          layer={layer}
                          removeLayer={removeLayer}
                        />
                      ))
                  ) : (
                    <p className="text-gray-400">Start building your cake!</p>
                  )}
                </SortableContext>

                {/* Drag overlay to show what's being dragged */}
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

              {/* Base plate for cake */}
              <div className="w-72 h-4 rounded-md bg-gray-300 mt-2"></div>

              {/* Continue button */}
              <div className="mt-8 w-full">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleContinue}
                  variant="default"
                >
                  Continue to Next Step
                </Button>
              </div>
            </div>

            {/* Requirements status and Price */}
            <div className="flex flex-col">
              <h3 className="text-lg font-medium mb-2">Requirements</h3>
              <ul className="space-y-2">
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
                  <span>At least 3 layers total</span>
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
                  <span>Bottom layer must be dough</span>
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
                  <span>Max 2 non-dough layers in a row</span>
                </li>
              </ul>

              {/* Price Display */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Price Breakdown</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {cakeLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className="flex justify-between text-sm"
                    >
                      <span>{layer.name}</span>
                      <span>{layer.price.toFixed(2)} zł</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center font-medium mt-4 pt-4 border-t">
                  <span>Base Price:</span>
                  <span>{calculateTotalPrice().toFixed(2)} zł</span>
                </div>
              </div>

              {cakeLayers.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Add layers to start building your cake
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Addons Selection */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Layers</h2>
          <Tabs defaultValue="dough">
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="dough">Doughs</TabsTrigger>
              <TabsTrigger value="sponge">Sponges</TabsTrigger>
              <TabsTrigger value="jelly">Jellies</TabsTrigger>
              <TabsTrigger value="fruit">Fruits</TabsTrigger>
              <TabsTrigger value="cream">Creams</TabsTrigger>
              <TabsTrigger value="topping">Toppings</TabsTrigger>
            </TabsList>

            {["dough", "sponge", "jelly", "fruit", "cream", "topping"].map(
              (tabValue) => (
                <TabsContent key={tabValue} value={tabValue}>
                  <ScrollArea className="w-full">
                    <div className="flex flex-row gap-4 pb-4 w-max p-2">
                      {addons
                        .filter((addon) => addon.type === tabValue)
                        .map((addon) => (
                          <Card
                            key={addon.id}
                            className="min-w-[100px] w-[120px] shrink-0"
                          >
                            <CardHeader className="p-2">
                              <CardTitle className="text-xs text-center break-words min-h-[32px]">
                                {addon.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                              <div
                                className="w-full h-12 rounded aspect-square"
                                style={{ backgroundColor: addon.color }}
                              ></div>
                              <div className="text-center mt-2 text-sm font-medium">
                                {addon.price.toFixed(2)} zł
                              </div>
                            </CardContent>
                            <CardFooter className="p-2 pt-0">
                              <Button
                                onClick={() => addLayer(addon)}
                                size="sm"
                                className="w-full text-xs"
                              >
                                Add
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
            <AlertDialogTitle>Cake Structure Issue</AlertDialogTitle>
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
