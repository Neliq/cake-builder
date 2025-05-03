"use client";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import {
  CreditCard,
  CreditCardIcon,
  ShoppingBag,
  Truck,
  Banknote,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/context/cart-context";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  PackagingPreview,
  type PackagingPreviewProps,
} from "@/components/preview-renderers";

const paymentOptions = [
  {
    id: "card",
    name: "Karta płatnicza",
    icon: <CreditCard className="h-5 w-5 mr-2" />,
  },
  {
    id: "blik",
    name: "BLIK",
    icon: <span className="font-bold text-lg mr-2">B</span>,
  },
  {
    id: "transfer",
    name: "Przelew bankowy",
    icon: <Banknote className="h-5 w-5 mr-2" />,
  },
];

export default function OrderSummary() {
  const router = useRouter();
  const { items, customerDetails, deliveryDetails, calculateTotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeStatus, setPromoCodeStatus] = useState<
    "valid" | "invalid" | "empty"
  >("empty");
  const [isPromoCodeTouched, setIsPromoCodeTouched] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentOptions[0].id
  );
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [blikCode, setBlikCode] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (
      items.length === 0 ||
      !customerDetails ||
      !deliveryDetails ||
      !calculateTotal
    ) {
      console.log("Redirecting from summary:", {
        items: items.length,
        customerDetails: !!customerDetails,
        deliveryDetails: !!deliveryDetails,
      });
      router.push("/koszyk");
    }
  }, [items, customerDetails, deliveryDetails, calculateTotal, router]);

  if (!customerDetails || !deliveryDetails || !calculateTotal) {
    return <div>Ładowanie danych...</div>;
  }

  const { subtotal, deliveryFee, total } = calculateTotal();

  const handleConfirmOrder = () => {
    setPaymentError(null);

    if (selectedPaymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        setPaymentError("Proszę wypełnić wszystkie pola danych karty.");
        return;
      }
      console.log("Processing card payment...");
    } else if (selectedPaymentMethod === "blik") {
      if (!blikCode || blikCode.length !== 6) {
        setPaymentError("Proszę wprowadzić poprawny 6-cyfrowy kod BLIK.");
        return;
      }
      console.log("Processing BLIK payment...");
    } else if (selectedPaymentMethod === "transfer") {
      console.log("Processing bank transfer order...");
    }

    console.log("Order confirmed with payment method:", selectedPaymentMethod);
    router.push("/koszyk/potwierdzenie");
  };

  const handleStepClick = (step: number) => {
    if (step === 1) {
      router.push("/koszyk");
    } else if (step === 2) {
      router.push("/koszyk/dostawa");
    }
  };

  const formatDate = (date?: Date | string): string => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid Date";
    return dateObj.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isValidPreviewData = <T extends object>(
    data: T | null | undefined
  ): data is T => {
    return Boolean(
      data && typeof data === "object" && Object.keys(data).length > 0
    );
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setPromoCode(code);
    if (code.length === 0) {
      setPromoCodeStatus("empty");
      setIsPromoCodeTouched(false);
    } else if (code.length === 10) {
      setPromoCodeStatus("valid");
    } else {
      setPromoCodeStatus("invalid");
    }
  };

  const handlePromoCodeBlur = () => {
    if (promoCode.length > 0) {
      setIsPromoCodeTouched(true);
    }
  };

  return (
    <div>
      <Navbar />
      <Stepper
        currentStep={3}
        steps={["Koszyk", "Dostawa", "Podsumowanie"]}
        icons={[
          <ShoppingBag className="h-4 w-4" key="cart" />,
          <Truck className="h-4 w-4" key="truck" />,
          <CreditCardIcon className="h-4 w-4" key="checkout" />,
        ]}
        onStepClick={handleStepClick}
      />

      <div className="max-w-4xl mx-auto my-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pb-4">
                <ScrollArea className="max-h-[300px]">
                  <Table>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="flex space-x-1">
                                <div className="relative w-8 h-8 rounded-sm overflow-hidden border">
                                  <PackagingPreview
                                    data={
                                      isValidPreviewData(item.packagingPreview)
                                        ? (item.packagingPreview as PackagingPreviewProps["data"])
                                        : isValidPreviewData(
                                            item.packagingDetails
                                          )
                                        ? ({
                                            type: item.packagingDetails.type,
                                            giftMessage:
                                              item.packagingDetails.giftMessage,
                                            recipientName:
                                              item.packagingDetails
                                                .recipientName,
                                            imageUrl:
                                              item.packagingDetails.imageUrl,
                                          } as PackagingPreviewProps["data"])
                                        : undefined
                                    }
                                  />
                                </div>
                              </div>
                              {item.customText || item.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {(item.price * item.quantity).toFixed(2)} zł
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Dane dostawy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {deliveryDetails.deliveryMethod === "shipping"
                        ? "Adres dostawy"
                        : "Adres odbiorcy"}
                    </h3>
                    <p className="font-medium">
                      {customerDetails.firstName} {customerDetails.lastName}
                    </p>
                    {deliveryDetails.deliveryMethod === "shipping" &&
                    deliveryDetails.address ? (
                      <>
                        <p>
                          ul. {deliveryDetails.address.street}{" "}
                          {deliveryDetails.address.buildingNumber}
                          {deliveryDetails.address.apartmentNumber &&
                            ` / ${deliveryDetails.address.apartmentNumber}`}
                        </p>
                        <p>
                          {deliveryDetails.address.zipCode}{" "}
                          {deliveryDetails.address.city}
                        </p>
                      </>
                    ) : (
                      <p>{deliveryDetails.pickupLocation}</p>
                    )}
                    <p className="mt-2 text-sm">Tel: {customerDetails.phone}</p>
                    <p className="text-sm">{customerDetails.email}</p>
                    {customerDetails.companyName && (
                      <div className="mt-2">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Dane firmy
                        </h3>
                        <p className="font-medium">
                          {customerDetails.companyName}
                        </p>
                        <p className="text-sm">NIP: {customerDetails.nip}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {deliveryDetails.deliveryMethod === "shipping"
                        ? "Termin dostawy"
                        : "Termin odbioru"}
                    </h3>
                    <p className="font-medium">
                      {formatDate(deliveryDetails.deliveryDate)}
                    </p>
                    <p>Godzina: {deliveryDetails.deliveryTime}</p>
                    {deliveryDetails.notes && (
                      <div className="mt-2">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Uwagi do zamówienia
                        </h3>
                        <p className="text-sm">{deliveryDetails.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Metoda płatności
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={(value) => {
                    setSelectedPaymentMethod(value);
                    setPaymentError(null);
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4"
                >
                  {paymentOptions.map((option) => (
                    <Label
                      key={option.id}
                      htmlFor={option.id}
                      className={cn(
                        "flex flex-col items-center justify-center space-y-2 rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-1 [&:has([data-state=checked])]:ring-primary"
                      )}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="sr-only"
                      />
                      {option.icon}
                      <span className="text-sm font-medium text-center">
                        {option.name}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>

                {selectedPaymentMethod === "card" && (
                  <div className="space-y-3 mt-4 border-t pt-4">
                    <Label htmlFor="card-number">Numer karty</Label>
                    <Input
                      id="card-number"
                      placeholder="•••• •••• •••• ••••"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="card-expiry">
                          Data ważności (MM/RR)
                        </Label>
                        <Input
                          id="card-expiry"
                          placeholder="MM/RR"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-cvv">CVV</Label>
                        <Input
                          id="card-cvv"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === "blik" && (
                  <div className="space-y-3 mt-4 border-t pt-4">
                    <Label htmlFor="blik-code">Kod BLIK</Label>
                    <Input
                      id="blik-code"
                      placeholder="••••••"
                      maxLength={6}
                      value={blikCode}
                      onChange={(e) => setBlikCode(e.target.value)}
                      required
                    />
                  </div>
                )}

                {selectedPaymentMethod === "transfer" && (
                  <div className="mt-4 border-t pt-4 text-sm text-muted-foreground">
                    Zaczniemy przygotowywać Twoje zamówienie, gdy otrzymamy
                    przelew bankowy. Dane do przelewu otrzymasz w potwierdzeniu
                    zamówienia.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Podsumowanie zamówienia
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Wartość produktów
                    </span>
                    <span>{subtotal.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Koszt dostawy</span>
                    <span>{deliveryFee.toFixed(2)} zł</span>
                  </div>
                  {promoCodeStatus === "valid" && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-muted-foreground">Rabat</span>
                      <span>-XX.XX zł</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Razem</span>
                    <span>{total.toFixed(2)} zł</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {paymentError && (
                  <Alert variant="destructive" className="mb-2 w-full">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Błąd płatności</AlertTitle>
                    <AlertDescription>{paymentError}</AlertDescription>
                  </Alert>
                )}
                <Button onClick={handleConfirmOrder} className="w-full">
                  Potwierdź zamówienie
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/koszyk/dostawa")}
                  className="w-full"
                >
                  Wróć do dostawy
                </Button>
              </CardFooter>
            </Card>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <Card>
                  <AccordionTrigger className="px-6 py-3 hover:no-underline">
                    <span className="text-sm font-medium">
                      Masz kod promocyjny?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-0">
                    <div className="space-y-2">
                      <Label htmlFor="promo-code">Kod promocyjny</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="promo-code"
                          placeholder="Wpisz kod"
                          value={promoCode}
                          onChange={handlePromoCodeChange}
                          onBlur={handlePromoCodeBlur}
                          className={
                            promoCodeStatus === "invalid" && isPromoCodeTouched
                              ? "border-red-500"
                              : promoCodeStatus === "valid"
                              ? "border-green-500"
                              : ""
                          }
                        />
                      </div>
                      {promoCodeStatus === "valid" && (
                        <p className="text-sm text-green-600">
                          Kod promocyjny jest ważny.
                        </p>
                      )}
                      {promoCodeStatus === "invalid" && isPromoCodeTouched && (
                        <p className="text-sm text-red-600">
                          Kod promocyjny jest nieprawidłowy (wymaga 10 znaków).
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
