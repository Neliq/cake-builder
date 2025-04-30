"use client";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context"; // Import useCart
import { Loader2 } from "lucide-react"; // Import Loader icon

export default function Potwierdzenie() {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { clearCart } = useCart(); // Get clearCart function

  useEffect(() => {
    setIsLoading(true); // Ensure loading starts true
    // Generate a mock order number
    const mockOrderNumber = `ZAM-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
    setOrderNumber(mockOrderNumber);

    // Clear the cart
    clearCart();

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds delay

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            {isLoading ? (
              <div className="mx-auto p-3 w-fit">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            )}
            <CardTitle className="mt-4 text-2xl font-bold">
              {isLoading
                ? "Przetwarzanie zamówienia..."
                : "Zamówienie złożone pomyślnie!"}
            </CardTitle>
          </CardHeader>
          {!isLoading && ( // Only show content when not loading
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Dziękujemy za Twoje zamówienie. Otrzymasz potwierdzenie na adres
                email.
              </p>
              {orderNumber && (
                <p className="font-semibold">
                  Numer Twojego zamówienia:{" "}
                  <span className="text-primary">{orderNumber}</span>
                </p>
              )}
              <Button asChild className="w-full mt-6">
                <Link href="/">Wróć na stronę główną</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
