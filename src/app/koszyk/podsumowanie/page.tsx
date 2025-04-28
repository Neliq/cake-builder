"use client";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import { CreditCard, CreditCardIcon, ShoppingBag, Truck } from "lucide-react";
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

// Import the preview components from the preview-renderers file
import {
  PackagingPreview,
  type PackagingPreviewProps,
} from "@/components/preview-renderers";

// Import our type definitions
import { OrderSummary as OrderSummaryType } from "@/types/cart";

export default function OrderSummary() {
  const router = useRouter();
  const { items, customerDetails, deliveryDetails, calculateTotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeStatus, setPromoCodeStatus] = useState<
    "valid" | "invalid" | "empty"
  >("empty");
  const [isPromoCodeTouched, setIsPromoCodeTouched] = useState(false);

  // Redirect if any required data is missing
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

  // If data is loading/missing, show a simple loading state
  if (!customerDetails || !deliveryDetails || !calculateTotal) {
    return <div>Ładowanie danych...</div>;
  }

  // Calculate order summary
  const { subtotal, deliveryFee, total } = calculateTotal();

  // Payment info (mocked for now, would come from payment step)
  const paymentMethod = "Karta płatnicza";
  const cardNumber = "•••• •••• •••• 1234";

  const handleConfirmOrder = () => {
    // In a real app, you'd handle order confirmation here
    console.log("Order confirmed!");
    router.push("/koszyk/potwierdzenie");
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

  // Utility function to check if preview data is valid with proper type
  const isValidPreviewData = <T extends object>(
    data: T | undefined
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
              <CardFooter>
                <Button onClick={handleConfirmOrder} className="w-full">
                  Potwierdź zamówienie
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

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Metoda płatności
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{paymentMethod}</p>
                <p className="text-sm text-muted-foreground">{cardNumber}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
