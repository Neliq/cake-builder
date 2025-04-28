"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { CartItem } from "@/types/cart"; // Import CartItem type

// Types for the builder previews
export type CakeLayer = {
  id: string;
  name: string;
  type: string;
  color: string;
  height: number;
  price: number; // Added price field
};

export type CakeShape = {
  id: string;
  name: string;
  type: string;
  path?: string;
  aspectRatio?: number;
};

export type TextElement = {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  x: number;
  y: number;
};

export type ImageElement = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
};

export type PackagingOption = {
  type: string;
  size: string;
  giftMessage?: string;
  recipientName?: string;
  imageUrl: string;
};

// Preview data types
export type TastePreview = {
  layers: CakeLayer[];
};

export type AppearancePreview = {
  shape: CakeShape;
  baseColor: string;
  texts: TextElement[];
  images: ImageElement[];
};

export type PackagingPreview = PackagingOption;

// Types for the builder context
export interface BuilderContextType {
  // Preview states
  tastePreview: TastePreview | null;
  appearancePreview: AppearancePreview | null;
  packagingPreview: PackagingPreview | null;

  // Pricing information
  basePrice: number;
  appearancePrice: number;
  packagingPrice: number;
  totalPrice: number;

  // Custom text for cake name
  customText: string | null;

  // ID of item being edited
  editingItemId: string | null;

  // Methods to update previews
  setTastePreview: (preview: TastePreview, price: number) => void;
  setAppearancePreview: (
    preview: AppearancePreview,
    price: number,
    text: string | null
  ) => void;
  setPackagingPreview: (preview: PackagingPreview, price: number) => void;

  // Method to reset all previews
  resetBuilder: () => void;

  // Method to check if all previews are available
  isBuilderComplete: () => boolean;

  // Method to load state from a cart item
  loadBuilderFromCartItem: (item: CartItem) => void;
}

// Create the context
const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// Create the provider component
export function BuilderProvider({ children }: { children: ReactNode }) {
  // State for the previews
  const [tastePreview, setTastePreviewState] = useState<TastePreview | null>(
    null
  );
  const [appearancePreview, setAppearancePreviewState] =
    useState<AppearancePreview | null>(null);
  const [packagingPreview, setPackagingPreviewState] =
    useState<PackagingPreview | null>(null);

  // State for pricing
  const [basePrice, setBasePriceState] = useState<number>(0);
  const [appearancePrice, setAppearancePriceState] = useState<number>(0);
  const [packagingPrice, setPackagingPriceState] = useState<number>(0);

  // State for custom text
  const [customText, setCustomTextState] = useState<string | null>(null);

  // State for tracking edit ID
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return basePrice + appearancePrice + packagingPrice;
  }, [basePrice, appearancePrice, packagingPrice]);

  // Method to update taste preview
  const setTastePreview = useCallback(
    (preview: TastePreview, price: number) => {
      setTastePreviewState(preview);
      setBasePriceState(price);
      console.log("Context: Taste preview set", preview, "Price:", price);
    },
    []
  );

  // Method to update appearance preview
  const setAppearancePreview = useCallback(
    (preview: AppearancePreview, price: number, text: string | null) => {
      setAppearancePreviewState(preview);
      setAppearancePriceState(price);
      setCustomTextState(text);
      console.log(
        "Context: Appearance preview set",
        preview,
        "Price:",
        price,
        "Text:",
        text
      );
    },
    []
  );

  // Method to update packaging preview
  const setPackagingPreview = useCallback(
    (preview: PackagingPreview, price: number) => {
      setPackagingPreviewState(preview);
      setPackagingPriceState(price);
      console.log("Context: Packaging preview set", preview, "Price:", price);
    },
    []
  );

  // Method to load state from a cart item
  const loadBuilderFromCartItem = useCallback((item: CartItem) => {
    console.log("Context: Loading item into builder", item);
    setEditingItemId(item.id); // Set the ID of the item being loaded

    // Load Taste/Base Price
    if (item.tastePreview && typeof item.basePrice === "number") {
      setTastePreviewState(item.tastePreview);
      setBasePriceState(item.basePrice);
    } else {
      setTastePreviewState(null);
      setBasePriceState(0);
    }

    // Load Appearance/Appearance Price/Custom Text
    if (item.appearancePreview && typeof item.appearancePrice === "number") {
      setAppearancePreviewState(item.appearancePreview);
      setAppearancePriceState(item.appearancePrice);
      setCustomTextState(item.customText || null); // Load custom text if available
    } else {
      setAppearancePreviewState(null);
      setAppearancePriceState(0);
      setCustomTextState(null);
    }

    // Load Packaging/Packaging Price
    if (item.packagingPreview && typeof item.packagingPrice === "number") {
      setPackagingPreviewState(item.packagingPreview);
      setPackagingPriceState(item.packagingPrice);
    } else {
      setPackagingPreviewState(null);
      setPackagingPriceState(0);
    }

    console.log("Context: Item loaded. Current state:", {
      editingItemId: item.id, // Log the ID being edited
      tastePreview: item.tastePreview,
      basePrice: item.basePrice,
      appearancePreview: item.appearancePreview,
      appearancePrice: item.appearancePrice,
      customText: item.customText,
      packagingPreview: item.packagingPreview,
      packagingPrice: item.packagingPrice,
    });
  }, []);

  // Method to reset all previews
  const resetBuilder = useCallback(() => {
    setTastePreviewState(null);
    setAppearancePreviewState(null);
    setPackagingPreviewState(null);
    setBasePriceState(0);
    setAppearancePriceState(0);
    setPackagingPriceState(0);
    setCustomTextState(null);
    setEditingItemId(null); // Clear the editing ID on reset
    console.log("Context: Builder reset");
  }, []);

  // Method to check if all required previews are available
  const isBuilderComplete = useCallback(() => {
    return !!(tastePreview && appearancePreview && packagingPreview);
  }, [tastePreview, appearancePreview, packagingPreview]);

  return (
    <BuilderContext.Provider
      value={{
        tastePreview,
        appearancePreview,
        packagingPreview,
        basePrice,
        appearancePrice,
        packagingPrice,
        totalPrice,
        customText,
        editingItemId, // Provide editingItemId in context
        setTastePreview,
        setAppearancePreview,
        setPackagingPreview,
        resetBuilder,
        isBuilderComplete,
        loadBuilderFromCartItem,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

// Custom hook to use the builder context
export function useBuilder(): BuilderContextType {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
}
