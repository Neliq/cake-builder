"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { CheckCircle2, Gift, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useBuilder } from "@/context/builder-context";
import { CartItem } from "@/types/cart";
import { v4 as uuidv4 } from "uuid";

interface PackagingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
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
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const { addCustomCake, updateItem } = useCart();

  const builderContext = useBuilder();

  const {
    tastePreview,
    appearancePreview,
    setPackagingPreview,
    basePrice = 0,
    appearancePrice = 0,
    packagingPrice: contextPackagingPrice,
    customText,
    resetBuilder,
  } = builderContext;

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

  const [selectedPackaging, setSelectedPackaging] =
    useState<string>("standard");
  const [giftMessage, setGiftMessage] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");

  const getSelectedPackagingOption = () => {
    return (
      packagingOptions.find((option) => option.id === selectedPackaging) ||
      packagingOptions[0]
    );
  };

  const calculateCurrentTotalPrice = () => {
    const packagingPrice = getSelectedPackagingOption().price;
    return basePrice + appearancePrice + packagingPrice;
  };

  const getPackagingPreview = (): string => {
    const selectedOption = getSelectedPackagingOption();
    return selectedOption.imageUrl || "/packagings/default-box.jpg";
  };

  useEffect(() => {
    const { packagingPreview } = builderContext;
    if (packagingPreview) {
      const matchingOption = packagingOptions.find(
        (opt) => opt.name === packagingPreview.type
      );
      if (matchingOption) {
        setSelectedPackaging(matchingOption.id);
      }
      setGiftMessage(packagingPreview.giftMessage || "");
      setRecipientName(packagingPreview.recipientName || "");
    }
  }, [builderContext.packagingPreview]);

  const handleAddToCartAndContinue = () => {
    handleAddToCart();
    toast("Tort dodany do koszyka", {
      description: "Możesz kontynuować tworzenie kolejnego tortu",
    });
    const previousStepUrl = editId
      ? `/kreator/wyglad?edit=${editId}`
      : "/kreator/wyglad";
    router.push(previousStepUrl);
  };

  const handleAddToCartAndCheckout = () => {
    handleAddToCart();
    router.push("/koszyk");
  };

  const handleAddToCart = () => {
    const selectedOption = getSelectedPackagingOption();
    const currentPackagingPrice = selectedOption.price;
    const currentTotalPrice =
      basePrice + appearancePrice + currentPackagingPrice;

    const packagingPreviewData = {
      type: selectedOption.name,
      giftMessage: giftMessage,
      recipientName: recipientName,
      imageUrl: selectedOption.imageUrl,
    };
    setPackagingPreview(packagingPreviewData, currentPackagingPrice);

    if (!tastePreview || !appearancePreview) {
      console.error(
        "Cannot add to cart: Missing taste or appearance preview data in context."
      );
      return;
    }

    const finalCakeData: Partial<CartItem> = {
      name: customText || "Tort niestandardowy",
      price: currentTotalPrice,
      tastePreview: tastePreview,
      appearancePreview: appearancePreview,
      packagingPreview: packagingPreviewData,
      customText: customText,
      packagingDetails: {
        type: selectedOption.name,
        giftMessage: giftMessage || undefined,
        recipientName: recipientName || undefined,
      },
      basePrice: basePrice,
      appearancePrice: appearancePrice,
      packagingPrice: currentPackagingPrice,
    };

    if (editId) {
      updateItem(editId, finalCakeData);
    } else {
      const newItem: CartItem = {
        id: uuidv4(),
        quantity: 1,
        name: finalCakeData.name!,
        price: finalCakeData.price!,
        tastePreview: finalCakeData.tastePreview,
        appearancePreview: finalCakeData.appearancePreview,
        packagingPreview: finalCakeData.packagingPreview,
        customText: finalCakeData.customText,
        packagingDetails: finalCakeData.packagingDetails,
        basePrice: finalCakeData.basePrice,
        appearancePrice: finalCakeData.appearancePrice,
        packagingPrice: finalCakeData.packagingPrice,
      };
      addCustomCake(newItem);
    }

    localStorage.removeItem("cake-appearance-data");
    localStorage.removeItem("cake-taste-data");
    resetBuilder();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    src={appearancePreview || "/cakes/default-appearance.jpg"}
                    alt="Appearance preview"
                    className="object-cover w-full h-full"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                    Wygląd
                  </span>
                </div>
                <div className="aspect-square relative rounded border overflow-hidden">
                  <img
                    src={tastePreview || "/cakes/default-taste.jpg"}
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
                  {giftMessage && (
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />Z dedykacją
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-4 w-full space-y-2">
                <div className="text-sm font-medium">Price breakdown:</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Cake base (layers):</span>
                    <span>{basePrice.toFixed(2)} zł</span>
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
                </div>

                <div className="flex justify-between items-center font-medium pt-2 border-t">
                  <span>Cena końcowa:</span>
                  <span className="text-lg">
                    {calculateCurrentTotalPrice().toFixed(2)} zł
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                  </div>
                </TabsContent>

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
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleAddToCartAndContinue}
              >
                <Plus className="mr-2 h-4 w-4" />
                {editId
                  ? "Zaktualizuj i stwórz kolejny tort"
                  : "Zapisz i stwórz kolejny tort"}
              </Button>

              <Button
                variant="default"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleAddToCartAndCheckout}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {editId
                  ? "Zaktualizuj i przejdź do podsumowania"
                  : "Zapisz i przejdź do podsumowania"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
