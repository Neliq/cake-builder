"use client";

import { CakeLayer, CakeShape } from "@/context/builder-context";

// Define types for the preview components
export interface TastePreviewProps {
  data?: {
    layers?: CakeLayer[];
  };
}

export interface AppearancePreviewProps {
  data?: {
    shape?: CakeShape;
    baseColor?: string;
    texts?: any[];
    images?: any[];
  };
}

export interface PackagingPreviewProps {
  data?: {
    type?: string;
    size?: string;
    imageUrl?: string;
    giftMessage?: string;
    recipientName?: string;
  };
}

// Taste preview component
export function TastePreview({ data }: TastePreviewProps) {
  // If no data, return placeholder
  if (!data || !data.layers || data.layers.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <span className="text-xs text-gray-400">No layers</span>
      </div>
    );
  }

  console.log("TastePreview rendering with data:", data);

  return (
    <div className="w-full h-full flex flex-col justify-end bg-gray-50">
      {/* Render layers from bottom to top */}
      {[...data.layers].reverse().map((layer, index) => (
        <div
          key={layer.id || index}
          style={{
            backgroundColor: layer.color || "#ddd",
            height: `${Math.max(5, Math.min(30, layer.height || 10))}%`,
          }}
          className="w-full"
        />
      ))}
    </div>
  );
}

// Appearance preview component
export function AppearancePreview({ data }: AppearancePreviewProps) {
  // If no data, return placeholder
  if (!data || !data.shape) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <span className="text-xs text-gray-400">No design</span>
      </div>
    );
  }

  console.log("AppearancePreview rendering with data:", {
    shape: data.shape,
    baseColor: data.baseColor,
    textsCount: data.texts?.length,
    imagesCount: data.images?.length,
  });

  // Render cake shape with base color
  const renderShape = () => {
    const shape = data.shape;
    const baseColor = data.baseColor || "#FFFFFF";

    if (!shape) return null;

    switch (shape.type) {
      case "circle":
        return (
          <div
            className="rounded-full"
            style={{
              width: "90%",
              height: "90%",
              backgroundColor: baseColor,
              margin: "5%",
            }}
          />
        );
      case "square":
        return (
          <div
            className="rounded-md"
            style={{
              width: "90%",
              height: "90%",
              backgroundColor: baseColor,
              margin: "5%",
            }}
          />
        );
      case "heart":
      case "triangle":
        if (shape.path) {
          return (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="90%" height="90%" viewBox="0 0 24 24">
                <path d={shape.path} fill={baseColor} />
              </svg>
            </div>
          );
        }
      default:
        return (
          <div
            className="rounded-full"
            style={{
              width: "90%",
              height: "90%",
              backgroundColor: baseColor,
              margin: "5%",
            }}
          />
        );
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
      {renderShape()}
      {/* We're not rendering texts and images in this simplified preview */}
    </div>
  );
}

// Packaging preview component
export function PackagingPreview({ data }: PackagingPreviewProps) {
  // If no data, return placeholder
  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <span className="text-xs text-gray-400">No packaging</span>
      </div>
    );
  }

  console.log("PackagingPreview rendering with data:", data);

  // Show packaging image if available
  if (data.imageUrl) {
    return (
      <div className="w-full h-full relative">
        <img
          src={data.imageUrl}
          alt={data.type || "Packaging"}
          className="object-cover w-full h-full"
        />
        {data.giftMessage && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
            Gift 🎁
          </div>
        )}
      </div>
    );
  }

  // Otherwise show packaging type and size
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gray-100">
      <div className="text-xs font-medium text-center">
        {data.type || "Box"}
      </div>
      <div className="text-[10px] text-gray-500 text-center">
        {data.size || "Standard"}
      </div>
      {data.giftMessage && (
        <div className="mt-1 text-[10px] bg-pink-100 text-pink-800 px-1 rounded">
          Gift 🎁
        </div>
      )}
    </div>
  );
}
