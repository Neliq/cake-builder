"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/cart-context";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
