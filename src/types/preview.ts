// Define the expected data types for preview components

export interface TastePreviewData {
  layers?: string[];
  flavor?: string;
  fillings?: string[];
  [key: string]: unknown;
}

export interface AppearancePreviewData {
  images?: string[];
  customText?: string;
  decorationType?: string;
  colors?: string[];
  [key: string]: unknown;
}

export interface PackagingPreviewData {
  type: string;
  size: string;
  giftMessage?: string;
  recipientName?: string;
  imageUrl?: string;
  [key: string]: unknown;
}
