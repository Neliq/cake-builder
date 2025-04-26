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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/context/cart-context";
import { useEffect } from "react";

// Import the preview components from the newly created file
import {
  AppearancePreview,
  TastePreview,
  PackagingPreview,
} from "@/components/preview-renderers";

export default function OrderSummary() {
  const router = useRouter();
  const { items, customerDetails, deliveryDetails, calculateTotal } = useCart();

  // Redirect if any required data is missing
  useEffect(() => {
    if (items.length === 0 || !customerDetails || !deliveryDetails) {
      router.push("/koszyk");
    }
  }, [items, customerDetails, deliveryDetails, router]);

  // Calculate order summary
  const { subtotal, deliveryFee, total } = calculateTotal();

  // Payment info (mocked for now, would come from payment step)
  const paymentMethod = "Karta płatnicza";
  const cardNumber = "•••• •••• •••• 1234";

  const handleConfirmOrder = () => {
    // In a real app, you'd handle order confirmation here
    // Perhaps sending data to your backend, etc.
    console.log("Order confirmed!");
    router.push("/koszyk/potwierdzenie");
  };

  const formatDate = (date?: Date): string => {
    if (!date) return "";
    return date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // If data is loading/missing, show a simple loading state
  if (!customerDetails || !deliveryDetails) {
    return <div>Ładowanie danych...</div>;
  }

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
        <h1 className="text-2xl font-bold mb-6">Podsumowanie zamówienia</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Details Column */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Zamówione produkty
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <ScrollArea className="max-h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produkt</TableHead>
                        <TableHead className="text-right">Ilość</TableHead>
                        <TableHead className="text-right">Cena</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              {/* Previews of all three aspects */}
                              <div className="flex space-x-1">
                                {/* Appearance preview */}
                                <div className="relative w-8 h-8 rounded-sm overflow-hidden border">
                                  <AppearancePreview
                                    data={item.appearancePreview}
                                  />
                                </div>

                                {/* Taste preview */}
                                <div className="relative w-8 h-8 rounded-sm overflow-hidden border">
                                  <TastePreview data={item.tastePreview} />
                                </div>

                                {/* Packaging preview */}
                                <div className="relative w-8 h-8 rounded-sm overflow-hidden border">
                                  <PackagingPreview
                                    data={
                                      item.packagingPreview ||
                                      item.packagingDetails
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
              <CardContent className="pb-4">
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
                          Uwagi
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
                  Płatność
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{paymentMethod}</p>
                    <p className="text-sm text-muted-foreground">
                      {cardNumber}
                    </p>
                  </div>
                  <Badge variant="outline" className="h-fit">
                    Zapłacono
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Podsumowanie</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Wartość zamówienia
                    </span>
                    <span>{subtotal.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Koszt dostawy</span>
                    <span>{deliveryFee.toFixed(2)} zł</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Razem</span>
                    <span>{total.toFixed(2)} zł</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleConfirmOrder}
                >
                  Potwierdź zamówienie
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Wróć
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Potrzebujesz pomocy?</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Masz pytania dotyczące zamówienia?
                </p>
                <Button variant="link" className="h-auto p-0">
                  Skontaktuj się z nami
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
