import type {
  AppearancePreview, // Assuming these are defined correctly elsewhere or adjust import
  TastePreview,
  PackagingPreview,
} from "./builder"; // Assuming builder types are here or adjust path

export interface PackagingDetails {
  type: string;
  giftMessage?: string;
  recipientName?: string;
  imageUrl?: string;
}

export interface PackagingPreview extends PackagingDetails {
  imageUrl: string;
}

export interface AppearancePreview {
  images?: string[];
  customText?: string;
  decorationType?: string;
  colors?: string[];
  [key: string]: unknown; // Allow for additional properties
}

export interface TastePreview {
  layers?: string[];
  flavor?: string;
  fillings?: string[];
  [key: string]: unknown; // Allow for additional properties
}

export interface CartItem {
  id: string;
  name: string;
  customText?: string;
  price: number; // Total price for the item (quantity * unit price) - or maybe unit price? Let's assume unit price for now.
  quantity: number;
  packagingDetails?: PackagingDetails; // Keep this for display details if needed

  // Store the actual preview data used for building/editing
  tastePreview?: TastePreview | null; // Use types defined/imported
  appearancePreview?: AppearancePreview | null;
  packagingPreview?: PackagingPreview | null;

  // Store individual price components for editing
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
  itemCount: number;
}
export interface BuilderContextTypeExtended extends BuilderContextData {
  loadBuilderFromCartItem: (item: CartItem) => void; // Add loader function
}
