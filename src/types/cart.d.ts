// ... existing code ...

export interface CartContextType {
  items: CartItem[];
  customerDetails: CustomerDetails | null;
  deliveryDetails: DeliveryDetails | null;
  setCustomerDetails: (details: CustomerDetails | null) => void;
  setDeliveryDetails: (details: DeliveryDetails | null) => void;
  calculateTotal: () => {
    subtotal: number;
    deliveryFee: number;
    total: number;
  };
  addCustomCake: (cake: CartItem) => void;
  addItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updatedData: Partial<CartItem>) => void;
  clearCart: () => void; // Add clearCart definition
  itemCount: number;
}

// ... existing code ...
