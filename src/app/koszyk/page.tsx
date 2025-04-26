import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import Cart from "@/components/cart/cart";
import { CreditCardIcon, ShoppingBag, Truck } from "lucide-react";

export default function Koszyk() {
  return (
    <div>
      <Navbar />
      <Stepper
        currentStep={1}
        steps={["Koszyk", "Dostawa", "Podsumowanie"]}
        icons={[
          <ShoppingBag className="h-4 w-4" key="cart" />,
          <Truck className="h-4 w-4" key="truck" />,
          <CreditCardIcon className="h-4 w-4" key="checkout" />,
        ]}
      />

      <Cart />

      <Footer />
    </div>
  );
}
