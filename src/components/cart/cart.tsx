"use client";

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Gift,
  Pencil, // Import Pencil icon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/context/cart-context";
import { useBuilder } from "@/context/builder-context"; // Import useBuilder hook
import { CartItem } from "@/types/cart"; // Import CartItem type from types
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";

// Import the preview components and their prop types from the dedicated file
import {
  AppearancePreview,
  TastePreview,
  PackagingPreview,
} from "@/components/preview-renderers";

export default function Cart() {
  const { items, addItem, decreaseItem, removeItem } = useCart();
  // Get the builder context for previews
  const { tastePreview, appearancePreview, packagingPreview } = useBuilder();

  // For debugging - log the items to ensure previews are present
  useEffect(() => {
    // More detailed debugging of preview data
    console.log("Builder context previews:", {
      tastePreview,
      appearancePreview,
      packagingPreview,
    });

    // Log cart items with more details
    console.log(
      "Cart items:",
      items.map((item) => ({
        id: item.id,
        name: item.name,
        tastePreview: item.tastePreview ? "present" : "missing",
        appearancePreview: item.appearancePreview ? "present" : "missing",
        packagingPreview: item.packagingPreview ? "present" : "missing",
        packagingDetails: item.packagingDetails ? "present" : "missing",
      }))
    );
  }, [items, tastePreview, appearancePreview, packagingPreview]);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Utility function to check if preview data is valid
  const isValidPreviewData = <T extends object>(
    data: T | null | undefined // Allow null in the parameter type
  ): data is T => {
    return Boolean(
      data && typeof data === "object" && Object.keys(data).length > 0
    );
  };

  // Function to get taste preview data with fallback to builder context
  const getTastePreview = (item: CartItem) => {
    // Debug which source we're using
    let source = "none";
    let result = undefined;

    if (isValidPreviewData(item.tastePreview)) {
      source = "cart item";
      result = item.tastePreview;
    } else if (tastePreview) {
      source = "builder context";
      result = tastePreview;
    }

    console.log(`Taste preview for ${item.id}: using ${source} source`);
    return result;
  };

  // Function to get appearance preview data with fallback to builder context
  const getAppearancePreview = (item: CartItem) => {
    // Debug which source we're using
    let source = "none";
    let result = undefined;

    if (isValidPreviewData(item.appearancePreview)) {
      source = "cart item";
      result = item.appearancePreview;
    } else if (appearancePreview) {
      source = "builder context";
      result = appearancePreview;
    }

    console.log(`Appearance preview for ${item.id}: using ${source} source`);
    return result;
  };

  // Function to get packaging preview data with fallback to builder context
  const getPackagingPreview = (item: CartItem) => {
    // Debug which source we're using
    let source = "none";
    let result = undefined;

    if (isValidPreviewData(item.packagingPreview)) {
      source = "cart item";
      result = item.packagingPreview;
    } else if (isValidPreviewData(item.packagingDetails)) {
      source = "packaging details";
      result = item.packagingDetails;
    } else if (packagingPreview) {
      source = "builder context";
      result = packagingPreview;
    }

    console.log(`Packaging preview for ${item.id}: using ${source} source`);
    return result;
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Twój koszyk
          </CardTitle>
        </CardHeader>

        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">Twój koszyk jest pusty</p>
              <Link href="/kreator" className="mt-4 inline-block">
                <Button>Stwórz tort</Button>
              </Link>
            </div>
          ) : (
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Display cake previews side by side with increased size */}
                          <TooltipProvider>
                            <div className="flex space-x-2">
                              {/* Appearance preview */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                                    {getAppearancePreview(item) ? (
                                      <AppearancePreview
                                        data={getAppearancePreview(item)!}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <span className="text-xs">
                                          No preview
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Wygląd tortu</p>
                                </TooltipContent>
                              </Tooltip>

                              {/* Taste preview */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                                    {getTastePreview(item) ? (
                                      <TastePreview
                                        data={getTastePreview(item)!}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <span className="text-xs">
                                          No preview
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Smak tortu</p>
                                </TooltipContent>
                              </Tooltip>

                              {/* Packaging preview */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                                    {getPackagingPreview(item) ? (
                                      <PackagingPreview
                                        data={getPackagingPreview(item)!}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <span className="text-xs">
                                          No preview
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Opakowanie tortu</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TooltipProvider>

                          <div>
                            {/* Use custom text from builder if available */}
                            <h3 className="font-medium">
                              {item.customText || item.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.price.toFixed(2)} zł
                            </p>
                            {item.packagingDetails && (
                              <p className="text-xs text-muted-foreground">
                                {item.packagingDetails.type},{" "}
                                {item.packagingDetails.size}
                                {item.packagingDetails.giftMessage && (
                                  <span className="ml-1 inline-flex items-center">
                                    <Gift className="h-3 w-3 mr-1" /> z
                                    dedykacją
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Edit Button */}
                          <Link href={`/kreator?edit=${item.id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => decreaseItem(item.id)}
                              className="h-8 w-8 p-0"
                              disabled={item.quantity <= 1} // Add disabled attribute
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => addItem(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>

        {items.length > 0 && (
          <>
            <Separator />
            <CardFooter className="flex flex-col gap-4 pt-4">
              <div className="flex justify-between items-center w-full">
                <span className="text-lg font-medium">Suma</span>
                <Badge
                  variant="outline"
                  className="text-lg px-3 py-1 font-bold"
                >
                  {totalPrice.toFixed(2)} zł
                </Badge>
              </div>
              <div className="flex justify-end w-full">
                <Link href="/koszyk/dostawa">
                  <Button size="lg">Kontynuuj</Button>
                </Link>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
