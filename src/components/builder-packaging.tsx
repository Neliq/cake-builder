"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Gift, ShoppingCart } from "lucide-react";
import { useCart, CartItem } from "@/context/cart-context";
import { v4 as uuidv4 } from "uuid";

interface PackagingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface BoxSizeOption {
  id: string;
  name: string;
  description: string;
  additionalPrice: number;
}

interface BuilderPackagingProps {
  cakeData?: {
    tastePreview?: string;
    appearancePreview?: string;
    customText?: string;
    basePrice: number;
  };
}

export function BuilderPackaging({
  cakeData = { basePrice: 89.99 },
}: BuilderPackagingProps) {
  const router = useRouter();

  // Extract all values from useCart at the top level
  const { addCustomCake } = useCart();

  // Packaging states
  const [selectedPackaging, setSelectedPackaging] =
    useState<string>("standard");
  const [selectedSize, setSelectedSize] = useState<string>("medium");
  const [giftMessage, setGiftMessage] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");

  // State to hold the accumulated cake price from previous steps
  const [accumulatedCakePrice, setAccumulatedCakePrice] = useState<number>(
    cakeData.basePrice
  );
  const [tastePrice, setTastePrice] = useState<number>(0);
  const [appearancePrice, setAppearancePrice] = useState<number>(0);

  // Load cake data from previous steps
  useEffect(() => {
    // Load taste data
    const tasteData = localStorage.getItem("cake-taste-data");
    if (tasteData) {
      try {
        const parsedData = JSON.parse(tasteData);
        if (parsedData.basePrice) {
          setTastePrice(parsedData.basePrice);
        }
      } catch (e) {
        console.error("Failed to parse taste data", e);
      }
    }

    // Load appearance data
    const appearanceData = localStorage.getItem("cake-appearance-data");
    if (appearanceData) {
      try {
        const parsedData = JSON.parse(appearanceData);
        if (parsedData.appearancePrice) {
          setAppearancePrice(parsedData.appearancePrice);
        }
        if (parsedData.totalPrice) {
          setAccumulatedCakePrice(parsedData.totalPrice);
        }
      } catch (e) {
        console.error("Failed to parse appearance data", e);
      }
    }
  }, []);

  // Sample packaging options
  const packagingOptions: PackagingOption[] = [
    {
      id: "standard",
      name: "Standardowe pudełko",
      description: "Eleganckie kartonowe pudełko z logo cukierni",
      price: 0,
      imageUrl: "/packagings/standard-box.jpg",
    },
    {
      id: "premium",
      name: "Premium",
      description: "Luksusowe pudełko ze wstążką i złotymi akcentami",
      price: 15.99,
      imageUrl: "/packagings/premium-box.jpg",
    },
    {
      id: "eco",
      name: "Ekologiczne",
      description: "Biodegradowalne opakowanie przyjazne dla środowiska",
      price: 9.99,
      imageUrl: "/packagings/eco-box.jpg",
    },
    {
      id: "gift",
      name: "Upominkowe",
      description: "Specjalne opakowanie prezentowe z ozdobami",
      price: 19.99,
      imageUrl: "/packagings/gift-box.jpg",
    },
  ];

  const boxSizeOptions: BoxSizeOption[] = [
    {
      id: "small",
      name: "Małe (do 1kg)",
      description: "Idealne dla małych tortów do 1kg",
      additionalPrice: -5,
    },
    {
      id: "medium",
      name: "Średnie (1-2kg)",
      description: "Standardowy rozmiar dla większości tortów",
      additionalPrice: 0,
    },
    {
      id: "large",
      name: "Duże (2-3kg)",
      description: "Dla dużych tortów okolicznościowych",
      additionalPrice: 10,
    },
    {
      id: "xl",
      name: "Bardzo duże (powyżej 3kg)",
      description: "Dla wyjątkowo dużych tortów na specjalne okazje",
      additionalPrice: 20,
    },
  ];

  // Get the selected packaging option
  const getSelectedPackagingOption = () => {
    return (
      packagingOptions.find((option) => option.id === selectedPackaging) ||
      packagingOptions[0]
    );
  };

  // Get the selected size option
  const getSelectedSizeOption = () => {
    return (
      boxSizeOptions.find((option) => option.id === selectedSize) ||
      boxSizeOptions[1]
    );
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const packagingPrice = getSelectedPackagingOption().price;
    const sizeAdditionalPrice = getSelectedSizeOption().additionalPrice;
    return accumulatedCakePrice + packagingPrice + sizeAdditionalPrice;
  };

  // Function to create a preview image from the packaging selection (simplified version)
  const getPackagingPreview = (): string => {
    const selectedOption = getSelectedPackagingOption();
    return selectedOption.imageUrl || "/packagings/default-box.jpg";
  };

  // Add cake to cart and continue shopping
  const handleAddToCartAndContinue = () => {
    addToCart();
    toast("Tort dodany do koszyka", {
      description: "Możesz kontynuować tworzenie kolejnego tortu",
    });
    // Navigate back to the first step
    router.push("/kreator/wyglad");
  };

  // Add cake to cart and proceed to checkout
  const handleAddToCartAndCheckout = () => {
    addToCart();
    router.push("/koszyk");
  };

  // Add custom cake to cart
  const addToCart = () => {
    // Load taste data
    let tastePreviewData;
    const tasteData = localStorage.getItem("cake-taste-data");
    if (tasteData) {
      try {
        const parsedData = JSON.parse(tasteData);
        tastePreviewData = parsedData.tastePreview;
      } catch (e) {
        console.error("Failed to parse taste data", e);
      }
    }

    // Load appearance data
    let appearancePreviewData;
    let customText;
    const appearanceData = localStorage.getItem("cake-appearance-data");
    if (appearanceData) {
      try {
        const parsedData = JSON.parse(appearanceData);
        appearancePreviewData = parsedData.appearancePreview;
        customText = parsedData.customText;
      } catch (e) {
        console.error("Failed to parse appearance data", e);
      }
    }

    // Create packaging preview
    const packagingPreviewData = {
      type: getSelectedPackagingOption().name,
      size: getSelectedSizeOption().name,
      giftMessage: giftMessage,
      recipientName: recipientName,
      imageUrl: getPackagingPreview(),
    };

    // Create cake item with ALL preview data
    const customCake: CartItem = {
      id: uuidv4(),
      name: customText || "Tort niestandardowy",
      price: calculateTotalPrice(),
      quantity: 1,
      // Full previews with complete data
      tastePreview: tastePreviewData,
      appearancePreview: appearancePreviewData,
      packagingPreview: packagingPreviewData,
      customText: customText,
      packagingDetails: {
        type: getSelectedPackagingOption().name,
        size: getSelectedSizeOption().name,
        giftMessage: giftMessage,
        recipientName: recipientName,
      },
    };

    // Save complete cake to cart
    addCustomCake(customCake);

    // For debugging - log the data being sent to cart
    console.log("Adding cake to cart with previews:", {
      taste: tastePreviewData,
      appearance: appearancePreviewData,
      packaging: packagingPreviewData,
    });

    // Clean up builder data from localStorage once cake is added to cart
    localStorage.removeItem("cake-appearance-data");
    localStorage.removeItem("cake-taste-data");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Podgląd opakowania</CardTitle>
              <CardDescription>
                Wybrane opakowanie dla Twojego tortu
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full aspect-square relative rounded-lg overflow-hidden border mb-4">
                <img
                  src={
                    getSelectedPackagingOption().imageUrl ||
                    "/packagings/default-box.jpg"
                  }
                  alt="Packaging preview"
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 w-full">
                <div className="aspect-square relative rounded border overflow-hidden">
                  <img
                    src={
                      cakeData.appearancePreview ||
                      "/cakes/default-appearance.jpg"
                    }
                    alt="Appearance preview"
                    className="object-cover w-full h-full"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                    Wygląd
                  </span>
                </div>
                <div className="aspect-square relative rounded border overflow-hidden">
                  <img
                    src={cakeData.tastePreview || "/cakes/default-taste.jpg"}
                    alt="Taste preview"
                    className="object-cover w-full h-full"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                    Smak
                  </span>
                </div>
                <div className="aspect-square relative rounded border overflow-hidden bg-muted">
                  <img
                    src={getPackagingPreview()}
                    alt="Packaging preview"
                    className="object-cover w-full h-full"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                    Opakowanie
                  </span>
                </div>
              </div>

              <div className="w-full mt-4">
                <p className="text-sm">Wybrane opcje:</p>
                <ul className="text-sm text-muted-foreground">
                  <li className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Opakowanie: {getSelectedPackagingOption().name}
                  </li>
                  <li className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Rozmiar: {getSelectedSizeOption().name}
                  </li>
                  {giftMessage && (
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />Z dedykacją
                    </li>
                  )}
                </ul>
              </div>

              {/* Price Breakdown */}
              <div className="mt-4 w-full space-y-2">
                <div className="text-sm font-medium">Price breakdown:</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Cake base (layers):</span>
                    <span>{tastePrice.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Decorations:</span>
                    <span>{appearancePrice.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>
                      Packaging ({getSelectedPackagingOption().name}):
                    </span>
                    <span>
                      {getSelectedPackagingOption().price.toFixed(2)} zł
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Size ({getSelectedSizeOption().name}):</span>
                    <span>
                      {getSelectedSizeOption().additionalPrice === 0
                        ? "No charge"
                        : `${
                            getSelectedSizeOption().additionalPrice > 0
                              ? "+"
                              : ""
                          }${getSelectedSizeOption().additionalPrice.toFixed(
                            2
                          )} zł`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center font-medium pt-2 border-t">
                  <span>Cena końcowa:</span>
                  <span className="text-lg">
                    {calculateTotalPrice().toFixed(2)} zł
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Options */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Wybierz opakowanie</CardTitle>
              <CardDescription>
                Dostosuj opakowanie do swoich potrzeb
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="packaging" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="packaging">Rodzaj opakowania</TabsTrigger>
                  <TabsTrigger value="message">Wiadomość</TabsTrigger>
                </TabsList>

                {/* Packaging Tab */}
                <TabsContent value="packaging">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Wybierz rodzaj opakowania
                      </h3>
                      <RadioGroup
                        value={selectedPackaging}
                        onValueChange={setSelectedPackaging}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {packagingOptions.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-start space-x-2"
                          >
                            <RadioGroupItem
                              value={option.id}
                              id={`packaging-${option.id}`}
                              className="mt-1"
                            />
                            <Label
                              htmlFor={`packaging-${option.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              <Card
                                className={`overflow-hidden transition-all ${
                                  selectedPackaging === option.id
                                    ? "ring-2 ring-primary"
                                    : ""
                                }`}
                              >
                                <div className="aspect-video w-full relative">
                                  <img
                                    src={
                                      option.imageUrl ||
                                      "/packagings/default-box.jpg"
                                    }
                                    alt={option.name}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <CardContent className="p-3">
                                  <div className="font-medium">
                                    {option.name}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {option.description}
                                  </p>
                                  <div className="text-sm mt-1">
                                    {option.price === 0 ? (
                                      <span className="text-green-600">
                                        Bez dopłaty
                                      </span>
                                    ) : (
                                      <span>+{option.price.toFixed(2)} zł</span>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Wybierz rozmiar pudełka
                      </h3>
                      <RadioGroup
                        value={selectedSize}
                        onValueChange={setSelectedSize}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      >
                        {boxSizeOptions.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-start space-x-2"
                          >
                            <RadioGroupItem
                              value={option.id}
                              id={`size-${option.id}`}
                              className="mt-1"
                            />
                            <Label
                              htmlFor={`size-${option.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              <Card
                                className={
                                  selectedSize === option.id
                                    ? "ring-2 ring-primary"
                                    : ""
                                }
                              >
                                <CardContent className="p-3">
                                  <div className="font-medium">
                                    {option.name}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {option.description}
                                  </p>
                                  <div className="text-sm mt-1">
                                    {option.additionalPrice === 0 ? (
                                      <span className="text-green-600">
                                        Bez dopłaty
                                      </span>
                                    ) : option.additionalPrice < 0 ? (
                                      <span className="text-green-600">
                                        {option.additionalPrice.toFixed(2)} zł
                                      </span>
                                    ) : (
                                      <span>
                                        +{option.additionalPrice.toFixed(2)} zł
                                      </span>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </TabsContent>

                {/* Message Tab */}
                <TabsContent value="message">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Dodaj wiadomość do prezentu
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Jeśli tort jest prezentem, możesz dodać dedykację, która
                        zostanie dołączona do opakowania.
                      </p>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="recipient-name">
                            Dla kogo (opcjonalnie)
                          </Label>
                          <Input
                            id="recipient-name"
                            placeholder="Imię odbiorcy"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gift-message">
                            Wiadomość (opcjonalnie)
                          </Label>
                          <Textarea
                            id="gift-message"
                            placeholder="Wpisz swoją wiadomość..."
                            value={giftMessage}
                            onChange={(e) => setGiftMessage(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>

                        <div className="flex items-center p-3 bg-muted/50 rounded-lg text-sm">
                          <Gift className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Wiadomość zostanie wydrukowana na eleganckim
                            papierze i dołączona do tortu
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                variant="default"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleAddToCartAndContinue}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Dodaj do koszyka i stwórz nowy tort
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleAddToCartAndCheckout}
              >
                Dodaj do koszyka i przejdź do podsumowania
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
