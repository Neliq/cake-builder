import { BuilderProvider } from "@/context/builder-context";
import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CartProvider>
        <BuilderProvider>
          <Component {...pageProps} />
          <Toaster position="bottom-right" />
        </BuilderProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default MyApp;
