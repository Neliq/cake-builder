"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/navbar/logo";
import { NavMenu } from "@/components/navbar/nav-menu";
import { NavigationSheet } from "@/components/navbar/navigation-sheet";
import { ModeToggle } from "../mode-toggle";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { itemCount } = useCart();

  return (
    <div className="bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />

            {/* Desktop Menu */}
            <NavMenu className="hidden md:block" />
          </div>

          <div className="flex items-center gap-3">
            <Link href="/koszyk">
              <Button
                variant="outline"
                size="icon"
                className="hidden sm:inline-flex relative"
              >
                <ShoppingCart />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs rounded-full"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/kreator">
              <Button>Kreator tortu</Button>
            </Link>
            <ModeToggle />

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
