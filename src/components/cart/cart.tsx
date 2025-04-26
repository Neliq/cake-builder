"use client";

import { Minus, Plus, Trash2, ShoppingBag, Gift } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";

// Import the preview components from the dedicated file
import {
  AppearancePreview,
  TastePreview,
  PackagingPreview,
} from "@/components/preview-renderers";

export default function Cart() {
  const { items, addItem, decreaseItem, removeItem } = useCart();

  // For debugging - log the items to ensure previews are present
  useEffect(() => {
    // Log basic structure info without the full image data
    console.log(
      "Cart items:",
      items.map((item) => ({
        ...item,
        appearancePreview: item.appearancePreview
          ? {
              ...item.appearancePreview,
              images: item.appearancePreview.images
                ? `${item.appearancePreview.images.length} images`
                : "no images",
            }
          : "no preview",
      }))
    );
  }, [items]);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Utility function to check if preview data is valid
  const isValidPreviewData = (data: any) => {
    return data && typeof data === "object" && Object.keys(data).length > 0;
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
                                    {item.appearancePreview && (
                                      <AppearancePreview
                                        data={item.appearancePreview}
                                      />
                                    )}
                                    {!item.appearancePreview && (
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
                                    <TastePreview
                                      data={
                                        isValidPreviewData(item.tastePreview)
                                          ? item.tastePreview
                                          : undefined
                                      }
                                    />
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
                                    <PackagingPreview
                                      data={
                                        isValidPreviewData(
                                          item.packagingPreview
                                        )
                                          ? item.packagingPreview
                                          : item.packagingDetails
                                      }
                                    />
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
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => decreaseItem(item.id)}
                              className="h-8 w-8 p-0"
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
