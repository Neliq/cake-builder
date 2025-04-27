"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customText?: string;
  // Full preview data for each component
  tastePreview?: any;
  appearancePreview?: any;
  packagingPreview?: any;
  packagingDetails?: {
    type: string;
    size: string;
    giftMessage?: string;
    recipientName?: string;
  };
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

export interface DeliveryDetails {
  address: string;
  city: string;
  postalCode: string;
}

export type CartContextType = {
  items: CartItem[];
  customerDetails: CustomerDetails | null;
  deliveryDetails: DeliveryDetails | null;
  setCustomerDetails: (details: CustomerDetails) => void;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  itemCount: number;
  addItem: (id: string, quantity?: number) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  addCustomCake: (cake: CartItem) => void;
};

export const CartContext = createContext<CartContextType>({
  items: [],
  customerDetails: null,
  deliveryDetails: null,
  setCustomerDetails: () => {},
  setDeliveryDetails: () => {},
  itemCount: 0,
  addItem: () => {},
  decreaseItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  addCustomCake: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerDetails, setCustomerDetails] =
    useState<CustomerDetails | null>(null);
  const [deliveryDetails, setDeliveryDetails] =
    useState<DeliveryDetails | null>(null);

  // Calculate total quantity of items
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Load cart from localStorage on first render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("shopping-cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addItem = (id: string, quantity = 1) => {
    setItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.id === id);

      if (itemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity + quantity,
        };
        return updatedItems;
      }

      // Item doesn't exist, log error - should use addCustomCake for new items
      console.error(
        "Attempted to add non-existent item. Use addCustomCake instead."
      );
      return prevItems;
    });
  };

  // Add a complete custom cake to cart
  const addCustomCake = (cake: CartItem) => {
    setItems((prevItems) => [...prevItems, cake]);
  };

  // Decrease item quantity
  const decreaseItem = (id: string) => {
    setItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.id === id);

      if (itemIndex >= 0) {
        const item = prevItems[itemIndex];

        if (item.quantity > 1) {
          // Decrease quantity
          const updatedItems = [...prevItems];
          updatedItems[itemIndex] = {
            ...item,
            quantity: item.quantity - 1,
          };
          return updatedItems;
        } else {
          // Remove item if quantity will be zero
          return prevItems.filter((item) => item.id !== id);
        }
      }

      return prevItems;
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Clear all items from cart
  const clearCart = () => {
    setItems([]);
  };

  const contextValue = {
    items,
    customerDetails,
    deliveryDetails,
    setCustomerDetails,
    setDeliveryDetails,
    itemCount,
    addItem,
    decreaseItem,
    removeItem,
    clearCart,
    addCustomCake,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
