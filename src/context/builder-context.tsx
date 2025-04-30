"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
  useEffect, // Import useEffect
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

// Define the shape of the state object
type BuilderState = {
  tastePreview: TastePreview | null;
  appearancePreview: AppearancePreview | null;
  packagingPreview: PackagingPreview | null;
  basePrice: number;
  appearancePrice: number;
  packagingPrice: number;
  customText: string | null;
  editingItemId: string | null;
};

// Types for the builder context (methods remain the same)
export interface BuilderContextType extends BuilderState {
  totalPrice: number;
  setTastePreview: (preview: TastePreview, price: number) => void;
  setAppearancePreview: (
    preview: AppearancePreview,
    price: number,
    text: string | null
  ) => void;
  setPackagingPreview: (preview: PackagingPreview, price: number) => void;
  resetBuilder: () => void;
  isBuilderComplete: () => boolean;
  loadBuilderFromCartItem: (item: CartItem) => void;
}

// Create the context
const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// localStorage key
const LOCAL_STORAGE_KEY = "cakeBuilderState";

// Default initial state
const defaultInitialState: BuilderState = {
  tastePreview: null,
  appearancePreview: null,
  packagingPreview: null,
  basePrice: 0,
  appearancePrice: 0,
  packagingPrice: 0,
  customText: null,
  editingItemId: null,
};

// Create the provider component
export function BuilderProvider({ children }: { children: ReactNode }) {
  // Use a single state object, initialized from localStorage
  const [state, setState] = useState<BuilderState>(() => {
    if (typeof window === "undefined") {
      return defaultInitialState; // Return default if on server
    }
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        console.log("BuilderContext: Loading state from localStorage");
        // Add validation here if needed
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error(
        "BuilderContext: Error loading state from localStorage",
        error
      );
    }
    return defaultInitialState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        console.log("BuilderContext: Saving state to localStorage", state);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error(
          "BuilderContext: Error saving state to localStorage",
          error
        );
      }
    }
  }, [state]); // Dependency array ensures this runs when state changes

  // Calculate total price using useMemo based on the state object
  const totalPrice = useMemo(() => {
    return state.basePrice + state.appearancePrice + state.packagingPrice;
  }, [state.basePrice, state.appearancePrice, state.packagingPrice]);

  // --- Modified Context Functions to use setState ---

  const setTastePreview = useCallback(
    (preview: TastePreview, price: number) => {
      setState((s) => ({ ...s, tastePreview: preview, basePrice: price }));
      console.log("Context: Taste preview set", preview, "Price:", price);
    },
    []
  );

  const setAppearancePreview = useCallback(
    (preview: AppearancePreview, price: number, text: string | null) => {
      setState((s) => ({
        ...s,
        appearancePreview: preview,
        appearancePrice: price,
        customText: text,
      }));
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

  const setPackagingPreview = useCallback(
    (preview: PackagingPreview, price: number) => {
      setState((s) => ({
        ...s,
        packagingPreview: preview,
        packagingPrice: price,
      }));
      console.log("Context: Packaging preview set", preview, "Price:", price);
    },
    []
  );

  const loadBuilderFromCartItem = useCallback((item: CartItem) => {
    console.log("Context: Loading item into builder", item);
    const newState: BuilderState = {
      tastePreview: item.tastePreview || null,
      basePrice: typeof item.basePrice === "number" ? item.basePrice : 0,
      appearancePreview: item.appearancePreview || null,
      appearancePrice:
        typeof item.appearancePrice === "number" ? item.appearancePrice : 0,
      customText: item.customText || null,
      packagingPreview: item.packagingPreview || null,
      packagingPrice:
        typeof item.packagingPrice === "number" ? item.packagingPrice : 0,
      editingItemId: item.id, // Set the ID of the item being loaded
    };
    setState(newState); // Update the single state object
    console.log("Context: Item loaded. Current state:", newState);
  }, []);

  const resetBuilder = useCallback(() => {
    console.log("Context: Builder reset");
    setState(defaultInitialState); // Reset to default state
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear localStorage
        console.log("Context: Cleared localStorage");
      } catch (error) {
        console.error("Context: Error clearing localStorage", error);
      }
    }
  }, []);

  const isBuilderComplete = useCallback(() => {
    // Check based on the state object
    return !!(
      state.tastePreview &&
      state.appearancePreview &&
      state.packagingPreview
    );
  }, [state.tastePreview, state.appearancePreview, state.packagingPreview]);

  // --- End Modified Context Functions ---

  return (
    <BuilderContext.Provider
      value={{
        ...state, // Spread the state object
        totalPrice, // Add calculated total price
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
