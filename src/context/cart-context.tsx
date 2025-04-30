"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  CartContextType,
  CartItem,
  CustomerDetails,
  DeliveryDetails,
} from "@/types/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to get initial state from localStorage
const getInitialState = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      // Handle date deserialization for deliveryDetails
      if (key === "delivery-details" && parsed.deliveryDate) {
        parsed.deliveryDate = new Date(parsed.deliveryDate);
      }
      return parsed;
    }
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
  }
  return defaultValue;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    getInitialState<CartItem[]>("cart-items", [])
  );
  const [customerDetails, setCustomerDetailsState] =
    useState<CustomerDetails | null>(() =>
      getInitialState<CustomerDetails | null>("customer-details", null)
    );
  const [deliveryDetails, setDeliveryDetailsState] =
    useState<DeliveryDetails | null>(() =>
      getInitialState<DeliveryDetails | null>("delivery-details", null)
    );

  // Persist items to localStorage
  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(items));
  }, [items]);

  // Persist customerDetails to localStorage
  useEffect(() => {
    if (customerDetails) {
      localStorage.setItem("customer-details", JSON.stringify(customerDetails));
    } else {
      localStorage.removeItem("customer-details");
    }
  }, [customerDetails]);

  // Persist deliveryDetails to localStorage
  useEffect(() => {
    if (deliveryDetails) {
      const storableDetails = {
        ...deliveryDetails,
        deliveryDate:
          deliveryDetails.deliveryDate instanceof Date
            ? deliveryDetails.deliveryDate.toISOString()
            : deliveryDetails.deliveryDate,
      };
      localStorage.setItem("delivery-details", JSON.stringify(storableDetails));
    } else {
      localStorage.removeItem("delivery-details");
    }
  }, [deliveryDetails]);

  const setCustomerDetails = (details: CustomerDetails | null) => {
    setCustomerDetailsState(details);
  };

  const setDeliveryDetails = (details: DeliveryDetails | null) => {
    if (details?.deliveryDate && typeof details.deliveryDate === "string") {
      details.deliveryDate = new Date(details.deliveryDate);
    }
    setDeliveryDetailsState(details);
  };

  const calculateTotal = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee =
      deliveryDetails?.deliveryMethod === "shipping" ? 15.0 : 0;
    const total = subtotal + deliveryFee;

    return { subtotal, deliveryFee, total };
  };

  const addCustomCake = useCallback((cake: CartItem) => {
    setItems((prevItems) => [...prevItems, cake]);
  }, []);

  const addItem = useCallback((id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseItem = useCallback((id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const updateItem = useCallback(
    (id: string, updatedData: Partial<CartItem>) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, ...updatedData } : item
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setCustomerDetailsState(null);
    setDeliveryDetailsState(null);
    // Optionally clear localStorage immediately, though useEffects will handle it
    localStorage.removeItem("cart-items");
    localStorage.removeItem("customer-details");
    localStorage.removeItem("delivery-details");
  }, []);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        customerDetails,
        deliveryDetails,
        setCustomerDetails,
        setDeliveryDetails,
        calculateTotal,
        addCustomCake,
        addItem,
        decreaseItem,
        removeItem,
        updateItem,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
