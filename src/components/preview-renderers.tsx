"use client";

import React from "react";

// Types for the preview data
interface TastePreviewData {
  layers?: Array<{
    id: string;
    name: string;
    type: string;
    color: string;
    height: number;
  }>;
  imageUrl?: string;
}

interface TextElement {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  x: number;
  y: number;
}

interface ImageElement {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
}

interface AppearancePreviewData {
  shape?: {
    id: string;
    name: string;
    type: string;
    path?: string;
  };
  baseColor?: string;
  texts?: TextElement[];
  images?: ImageElement[];
  imageUrl?: string;
}

interface PackagingPreviewData {
  type?: string;
  size?: string;
  giftMessage?: string;
  recipientName?: string;
  imageUrl?: string;
}

// Taste preview component that renders cake layers from the builder
export function TastePreview({ data }: { data: TastePreviewData | undefined }) {
  // First check if valid layers data exists
  if (data?.layers && data.layers.length > 0) {
    return (
      <div className="w-full h-full flex flex-col-reverse justify-end overflow-hidden">
        {data.layers.map((layer, index) => (
          <div
            key={layer.id || index}
            style={{
              backgroundColor: layer.color || "#ccc",
              height: `${Math.max(5, Math.min(layer.height || 10, 30))}%`,
              width: "100%",
              marginBottom: "1px",
            }}
            title={layer.name}
            className="relative"
          >
            <span className="absolute left-1 text-[6px] truncate max-w-full opacity-70">
              {layer.name}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // If we have an image URL, show it
  if (data?.imageUrl) {
    return (
      <img
        src={data.imageUrl}
        alt="Taste preview"
        className="object-cover w-full h-full"
      />
    );
  }

  // Fallback
  return (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <span className="text-xs text-gray-500">Taste</span>
    </div>
  );
}

// Appearance preview component that renders cake appearance from the builder
export function AppearancePreview({
  data,
}: {
  data: AppearancePreviewData | undefined;
}) {
  // First check if we have an image URL
  if (data?.imageUrl) {
    return (
      <img
        src={data.imageUrl}
        alt="Appearance preview"
        className="object-cover w-full h-full"
      />
    );
  }

  // If we have shape and color data, render it
  if (data?.shape && data.baseColor) {
    const textElements = data.texts || [];
    const imageElements = data.images || [];

    return (
      <div className="w-full h-full flex items-center justify-center">
        {/* Render the shape based on type */}
        {data.shape.type === "circle" && (
          <div
            className="rounded-full relative"
            style={{
              width: "85%",
              height: "85%",
              backgroundColor: data.baseColor,
            }}
          >
            {/* Render text elements */}
            {textElements.map((text, index) => (
              <div
                key={text.id || `text-${index}`}
                style={{
                  position: "absolute",
                  color: text.color || "#000000",
                  fontSize: `${Math.min(Math.max(6, text.fontSize / 4), 10)}px`,
                  fontFamily: text.fontFamily || "sans-serif",
                  left: `${text.x}%`,
                  top: `${text.y}%`,
                  transform: "translate(-50%, -50%)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "90%",
                }}
              >
                {text.text}
              </div>
            ))}

            {/* Render image elements */}
            {imageElements.map((image, index) => {
              // Log image data for debugging
              console.log(
                `Rendering image ${index}:`,
                image.src ? image.src.substring(0, 30) + "..." : "undefined"
              );

              return (
                <img
                  key={image.id || `img-${index}`}
                  src={image.src}
                  alt="Decoration"
                  style={{
                    position: "absolute",
                    width: `${Math.min(image.width / 3, 40)}%`,
                    left: `${image.x}%`,
                    top: `${image.y}%`,
                    transform: `translate(-50%, -50%) rotate(${
                      image.rotation || 0
                    }deg)`,
                  }}
                  onError={(e) => {
                    console.error("Failed to load image:", e);
                    e.currentTarget.style.display = "none";
                  }}
                />
              );
            })}
          </div>
        )}

        {data.shape.type === "square" && (
          <div
            className="rounded-md relative"
            style={{
              width: "85%",
              height: "85%",
              backgroundColor: data.baseColor,
            }}
          >
            {/* Text elements similar to above */}
            {textElements.map((text, index) => (
              <div
                key={text.id || `text-${index}`}
                style={{
                  position: "absolute",
                  color: text.color || "#000000",
                  fontSize: `${Math.min(Math.max(6, text.fontSize / 4), 10)}px`,
                  fontFamily: text.fontFamily || "sans-serif",
                  left: `${text.x}%`,
                  top: `${text.y}%`,
                  transform: "translate(-50%, -50%)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "90%",
                }}
              >
                {text.text}
              </div>
            ))}

            {/* Render image elements */}
            {imageElements.map((image, index) => {
              console.log(
                `Rendering image ${index}:`,
                image.src ? image.src.substring(0, 30) + "..." : "undefined"
              );

              return (
                <img
                  key={image.id || `img-${index}`}
                  src={image.src}
                  alt="Decoration"
                  style={{
                    position: "absolute",
                    width: `${Math.min(image.width / 3, 40)}%`,
                    left: `${image.x}%`,
                    top: `${image.y}%`,
                    transform: `translate(-50%, -50%) rotate(${
                      image.rotation || 0
                    }deg)`,
                  }}
                  onError={(e) => {
                    console.error("Failed to load image:", e);
                    e.currentTarget.style.display = "none";
                  }}
                />
              );
            })}
          </div>
        )}

        {(data.shape.type === "heart" || data.shape.type === "triangle") &&
          data.shape.path && (
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              className="relative"
            >
              <path d={data.shape.path} fill={data.baseColor} />
              {/* We can't easily add text directly in SVG for this simple preview */}
              {/* Instead show a truncated version of the first text if any */}
              {textElements.length > 0 && (
                <text
                  x="12"
                  y="12"
                  textAnchor="middle"
                  fontSize="8"
                  fill={textElements[0].color}
                >
                  {textElements[0].text.substring(0, 12)}
                </text>
              )}

              {/* Render image elements */}
              {imageElements.map((image, index) => {
                console.log(
                  `Rendering image ${index}:`,
                  image.src ? image.src.substring(0, 30) + "..." : "undefined"
                );

                return (
                  <image
                    key={image.id || `img-${index}`}
                    href={image.src}
                    x={image.x}
                    y={image.y}
                    width={Math.min(image.width / 3, 40)}
                    transform={`rotate(${image.rotation || 0})`}
                    onError={(e) => {
                      console.error("Failed to load image:", e);
                    }}
                  />
                );
              })}
            </svg>
          )}
      </div>
    );
  }

  // If we only have images without shape data
  if (data?.images && data.images.length > 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <img
          src={data.images[0].src}
          alt="Cake decoration"
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            console.error("Failed to load standalone image");
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.innerHTML =
              '<div class="text-xs">Image</div>';
          }}
        />
      </div>
    );
  }

  // Simpler fallback for when we only know there were decorations
  if (
    (data?.texts && data.texts.length > 0) ||
    (data?.images && data.images.length > 0)
  ) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center p-1">
        {data?.texts && data.texts.length > 0 ? (
          <span
            className="text-xs text-center truncate max-w-full"
            style={{ color: data.texts[0].color }}
          >
            {data.texts[0].text}
          </span>
        ) : (
          <span className="text-xs text-gray-600">Decorated cake</span>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <span className="text-xs text-gray-500">Appearance</span>
    </div>
  );
}

// Packaging preview component that renders cake packaging from the builder
export function PackagingPreview({
  data,
}: {
  data: PackagingPreviewData | undefined;
}) {
  // If we have an image URL, show it
  if (data?.imageUrl) {
    return (
      <img
        src={data.imageUrl}
        alt="Packaging preview"
        className="object-cover w-full h-full"
      />
    );
  }

  // If we have packaging type, show it
  if (data?.type) {
    return (
      <div className="w-full h-full bg-amber-50 flex flex-col items-center justify-center p-1">
        <div className="text-[8px] font-medium text-center">{data.type}</div>
        {data.size && (
          <div className="text-[6px] text-muted-foreground text-center">
            {data.size}
          </div>
        )}
        {data.giftMessage && (
          <div className="mt-1 flex items-center">
            <span className="bg-pink-100 rounded-full w-3 h-3 flex items-center justify-center">
              🎁
            </span>
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <span className="text-xs text-gray-500">Package</span>
    </div>
  );
}
