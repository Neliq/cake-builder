import type {
  AppearancePreview,
  TastePreview,
  PackagingPreview,
} from "@/context/builder-context";

export interface PackagingDetails {
  type: string;
  size?: string;
  giftMessage?: string;
  recipientName?: string;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  name: string;
  customText?: string;
  price: number;
  quantity: number;
  packagingDetails?: PackagingDetails;

  tastePreview?: TastePreview | null;
  appearancePreview?: AppearancePreview | null;
  packagingPreview?: PackagingPreview | null;

  basePrice?: number;
  appearancePrice?: number;
  packagingPrice?: number;
}

export interface Address {
  street: string;
  buildingNumber: string;
  apartmentNumber?: string;
  zipCode: string;
  city: string;
}

export interface CustomerDetails {
  customerType: "person" | "company";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  nip?: string;
}

export interface DeliveryDetails {
  deliveryMethod: "shipping" | "pickup";
  deliveryDate?: Date | string;
  deliveryTime?: string;
  address?: Address;
  pickupLocation?: string;
  notes?: string;
}

export interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface CartContextType {
  items: CartItem[];
  customerDetails: CustomerDetails | null;
  deliveryDetails: DeliveryDetails | null;
  setCustomerDetails: (details: CustomerDetails | null) => void;
  setDeliveryDetails: (details: DeliveryDetails | null) => void;
  calculateTotal: () => OrderSummary;
  addCustomCake: (cake: CartItem) => void;
  addItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updatedData: Partial<CartItem>) => void;
  clearCart: () => void;
  itemCount: number;
}
