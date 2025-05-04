"use client";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
import { useBuilder } from "@/context/builder-context";

// Define types for decorative elements
type CakeShape = {
  id: string;
  name: string;
  type: "circle" | "square" | "rectangle" | "heart" | "triangle";
  path?: string;
  aspectRatio?: number;
};

type TextElement = {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  x: number;
  y: number;
  price: number;
};

type ImageElement = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  price: number;
};

type CakeAppearance = {
  shape: CakeShape;
  baseColor: string;
  texts: TextElement[];
  images: ImageElement[];
};

const cakeShapes: CakeShape[] = [
  {
    id: "circle",
    name: "Okrągły",
    type: "circle",
  },
  {
    id: "square",
    name: "Kwadratowy",
    type: "square",
  },
  {
    id: "heart",
    name: "Serce",
    type: "heart",
    path: "M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z",
  },
  {
    id: "triangle",
    name: "Trójkątny",
    type: "triangle",
    path: "M12 2 L22 22 L2 22 Z",
  },
];

const baseColors = [
  { id: "cream", name: "Kremowy", value: "#FFF8DC" },
  { id: "pink", name: "Różowy", value: "#FFB6C1" },
  { id: "blue", name: "Niebieski", value: "#87CEFA" },
  { id: "chocolate", name: "Czekoladowy", value: "#D2691E" },
  { id: "mint", name: "Miętowy", value: "#98FB98" },
];

const PRICING = {
  TEXT_BASE: 4.99,
  TEXT_SIZE_FACTOR: 0.1,
  IMAGE_BASE: 7.99,
  IMAGE_SIZE_FACTOR: 0.05,
  SHAPE_PREMIUM: {
    heart: 5.99,
    triangle: 3.99,
  },
};

const DraggableText = ({
  element,
  updateElement,
  deleteElement,
  isSelected,
  setSelectedElement,
}: {
  element: TextElement;
  updateElement: (id: string, updates: Partial<TextElement>) => void;
  deleteElement: (id: string) => void;
  isSelected: boolean;
  setSelectedElement: (id: string | null) => void;
}) => {
  const startPos = useRef({ x: 0, y: 0 });
  const elementPos = useRef({ x: element.x, y: element.y });
  const startFontSize = useRef(element.fontSize);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startPos.current = { x: e.clientX, y: e.clientY };
    elementPos.current = { x: element.x, y: element.y };

    setSelectedElement(element.id);

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;

      updateElement(element.id, {
        x: elementPos.current.x + dx,
        y: elementPos.current.y + dy,
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startPos.current = { x: e.clientX, y: e.clientY };
    startFontSize.current = element.fontSize;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const dx = e.clientX - startPos.current.x;
      const newSize = Math.max(12, startFontSize.current + dx * 0.1);

      updateElement(element.id, {
        fontSize: newSize,
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className={`absolute cursor-move ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        color: element.color,
        fontSize: `${element.fontSize}px`,
        fontFamily: element.fontFamily || "Arial, sans-serif",
        padding: "4px",
        userSelect: "none",
        background: isSelected ? "rgba(255,255,255,0.2)" : "transparent",
        backdropFilter: isSelected ? "blur(2px)" : "none",
        position: "absolute",
      }}
      onMouseDown={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element.id);
      }}
    >
      {element.text}

      {isSelected && (
        <button
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-10"
          onClick={(e) => {
            e.stopPropagation();
            deleteElement(element.id);
          }}
        >
          ✕
        </button>
      )}

      {isSelected && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"
          style={{ transform: "translate(40%, 40%)" }}
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

const DraggableImage = ({
  element,
  updateElement,
  deleteElement,
  isSelected,
  setSelectedElement,
}: {
  element: ImageElement;
  updateElement: (id: string, updates: Partial<ImageElement>) => void;
  deleteElement: (id: string) => void;
  isSelected: boolean;
  setSelectedElement: (id: string | null) => void;
}) => {
  const startPos = useRef({ x: 0, y: 0 });
  const elementPos = useRef({ x: element.x, y: element.y });
  const startWidth = useRef(element.width);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startPos.current = { x: e.clientX, y: e.clientY };
    elementPos.current = { x: element.x, y: element.y };

    setSelectedElement(element.id);

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;

      updateElement(element.id, {
        x: elementPos.current.x + dx,
        y: elementPos.current.y + dy,
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startPos.current = { x: e.clientX, y: e.clientY };
    startWidth.current = element.width;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const dx = e.clientX - startPos.current.x;
      const newWidth = Math.max(30, startWidth.current + dx);

      updateElement(element.id, {
        width: newWidth,
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className={`absolute cursor-move ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        transform: `rotate(${element.rotation}deg)`,
      }}
      onMouseDown={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element.id);
      }}
    >
      <img
        src={element.src}
        alt="Cake decoration"
        style={{ width: `${element.width}px` }}
      />

      {isSelected && (
        <button
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-10"
          onClick={(e) => {
            e.stopPropagation();
            deleteElement(element.id);
          }}
        >
          ✕
        </button>
      )}

      {isSelected && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"
          style={{ transform: "translate(40%, 40%)" }}
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default function CakeAppearanceBuilder() {
  const [baseCakePrice, setBaseCakePrice] = useState<number>(0);

  const {
    setAppearancePreview,
    basePrice,
    appearancePreview: contextAppearancePreview,
  } = useBuilder();

  const [appearance, setAppearance] = useState<CakeAppearance>({
    shape: cakeShapes[0],
    baseColor: baseColors[0].value,
    texts: [],
    images: [],
  });

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedTextElement, setSelectedTextElement] =
    useState<TextElement | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [newText, setNewText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cakePreviewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");

  useEffect(() => {
    if (contextAppearancePreview) {
      setAppearance({
        shape: contextAppearancePreview.shape || cakeShapes[0],
        baseColor: contextAppearancePreview.baseColor || baseColors[0].value,
        texts: (contextAppearancePreview.texts || []).map((text) => ({
          ...text,
          price: calculateTextPrice(text.fontSize),
        })),
        images: (contextAppearancePreview.images || []).map((image) => ({
          ...image,
          price: calculateImagePrice(image.width),
        })),
      });
    } else {
      setAppearance({
        shape: cakeShapes[0],
        baseColor: baseColors[0].value,
        texts: [],
        images: [],
      });
      setNewText("");
      setSelectedColor("#000000");
    }
  }, [contextAppearancePreview]);

  useEffect(() => {
    if (basePrice > 0) {
      setBaseCakePrice(basePrice);
    } else {
      const savedData = localStorage.getItem("cake-taste-data");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (parsedData.basePrice) {
            setBaseCakePrice(parsedData.basePrice);
          }
        } catch (e) {
          console.error("Failed to parse saved cake data", e);
        }
      }
    }
  }, [basePrice]);

  const calculateTextPrice = (fontSize: number): number => {
    const sizeExtra = Math.max(0, fontSize - 20) * PRICING.TEXT_SIZE_FACTOR;
    return PRICING.TEXT_BASE + sizeExtra;
  };

  const calculateImagePrice = (width: number): number => {
    const sizeExtra = Math.max(0, width - 50) * PRICING.IMAGE_SIZE_FACTOR;
    return PRICING.IMAGE_BASE + sizeExtra;
  };

  const getShapePremiumCost = (): number => {
    return (
      PRICING.SHAPE_PREMIUM[
        appearance.shape.type as keyof typeof PRICING.SHAPE_PREMIUM
      ] || 0
    );
  };

  const calculateAppearancePrice = (): number => {
    const textsCost = appearance.texts.reduce(
      (total, text) => total + text.price,
      0
    );
    const imagesCost = appearance.images.reduce(
      (total, image) => total + image.price,
      0
    );
    const shapeCost = getShapePremiumCost();

    return textsCost + imagesCost + shapeCost;
  };

  const calculateTotalPrice = (): number => {
    return baseCakePrice + calculateAppearancePrice();
  };

  const addOrUpdateText = () => {
    if (!newText.trim()) return;

    if (selectedTextElement && selectedElement?.startsWith("text_")) {
      updateElement(selectedTextElement.id, {
        text: newText,
        color: selectedColor,
      });
      setSelectedTextElement(null);
      setNewText("");
    } else {
      const centerX = cakePreviewRef.current
        ? cakePreviewRef.current.clientWidth / 2 - 50
        : 100;
      const centerY = cakePreviewRef.current
        ? cakePreviewRef.current.clientHeight / 2 - 15
        : 100;

      const fontSize = 24;
      const textPrice = calculateTextPrice(fontSize);

      setAppearance((prev) => ({
        ...prev,
        texts: [
          ...prev.texts,
          {
            id: `text_${Date.now()}`,
            text: newText,
            color: selectedColor,
            fontSize: fontSize,
            fontFamily: "Arial, sans-serif",
            x: centerX,
            y: centerY,
            price: textPrice,
          },
        ],
      }));
      setNewText("");
    }
  };

  const updateElement = <T extends TextElement | ImageElement>(
    id: string,
    updates: Partial<T>
  ) => {
    setAppearance((prev) => {
      if (id.startsWith("text_")) {
        const updatedTexts = prev.texts.map((text) => {
          if (text.id === id) {
            let newPrice = text.price;
            if ("fontSize" in updates) {
              newPrice = calculateTextPrice(updates.fontSize as number);
            }
            return { ...text, ...updates, price: newPrice };
          }
          return text;
        });
        return { ...prev, texts: updatedTexts };
      } else {
        const updatedImages = prev.images.map((img) => {
          if (img.id === id) {
            let newPrice = img.price;
            if ("width" in updates) {
              newPrice = calculateImagePrice(updates.width as number);
            }
            return { ...img, ...updates, price: newPrice };
          }
          return img;
        });
        return { ...prev, images: updatedImages };
      }
    });
  };

  const deleteElement = (id: string) => {
    setAppearance((prev) => ({
      ...prev,
      texts: prev.texts.filter((text) => text.id !== id),
      images: prev.images.filter((img) => img.id !== id),
    }));

    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setValidationMessage(
        "Rozmiar obrazu przekracza limit 2MB. Wybierz mniejszy obraz."
      );
      setAlertOpen(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const centerX = cakePreviewRef.current
          ? cakePreviewRef.current.clientWidth / 2 - 50
          : 100;
        const centerY = cakePreviewRef.current
          ? cakePreviewRef.current.clientHeight / 2 - 50
          : 100;

        const width = 100;
        const imagePrice = calculateImagePrice(width);

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 150;
          const MAX_HEIGHT = 150;
          let targetWidth = img.width;
          let targetHeight = img.height;

          if (targetWidth > MAX_WIDTH) {
            targetHeight = Math.round(targetHeight * (MAX_WIDTH / targetWidth));
            targetWidth = MAX_WIDTH;
          }
          if (targetHeight > MAX_HEIGHT) {
            targetWidth = Math.round(targetWidth * (MAX_HEIGHT / targetHeight));
            targetHeight = MAX_HEIGHT;
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

          const resizedImageData = canvas.toDataURL("image/jpeg", 0.7);

          setAppearance((prev) => ({
            ...prev,
            images: [
              ...prev.images,
              {
                id: `image_${Date.now()}`,
                src: resizedImageData,
                x: centerX,
                y: centerY,
                width: width,
                rotation: 0,
                price: imagePrice,
              },
            ],
          }));
        };
        img.src = event.target?.result as string;
      }
    };

    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateCake = (): { isValid: boolean; message?: string } => {
    if (appearance.texts.length === 0 && appearance.images.length === 0) {
      return {
        isValid: false,
        message:
          "Dodaj przynajmniej jedną dekorację (tekst lub obraz) do swojego tortu.",
      };
    }
    return { isValid: true };
  };

  const handleContinue = () => {
    const validation = validateCake();

    if (validation.isValid) {
      try {
        const currentAppearancePrice = calculateAppearancePrice();
        const appearancePreviewData = {
          shape: appearance.shape,
          baseColor: appearance.baseColor,
          texts: appearance.texts.map((text) => ({
            id: text.id,
            text: text.text,
            color: text.color,
            fontSize: text.fontSize,
            fontFamily: text.fontFamily,
            x: text.x,
            y: text.y,
          })),
          images: appearance.images.map((image) => ({
            id: image.id,
            src: image.src,
            x: image.x,
            y: image.y,
            width: image.width,
            rotation: image.rotation,
          })),
        };

        const customText =
          appearance.texts.length > 0 ? appearance.texts[0].text : null;

        setAppearancePreview(
          appearancePreviewData,
          currentAppearancePrice,
          customText
        );

        localStorage.setItem(
          "cake-appearance-data",
          JSON.stringify({
            appearance: {
              shape: appearance.shape,
              baseColor: appearance.baseColor,
              texts: appearance.texts,
              imageCount: appearance.images.length,
            },
            appearancePrice: currentAppearancePrice,
            basePrice: baseCakePrice,
            totalPrice: calculateTotalPrice(),
            appearancePreview: appearancePreviewData,
            customText: customText,
          })
        );

        const nextStepUrl = editId
          ? `/kreator/opakowanie?edit=${editId}`
          : "/kreator/opakowanie";
        router.push(nextStepUrl);
      } catch (error) {
        console.error("Error saving cake data:", error);
        setValidationMessage(
          "Wystąpił problem z zapisaniem projektu tortu. Spróbuj użyć mniej lub mniejszych obrazów."
        );
        setAlertOpen(true);
      }
    } else {
      setValidationMessage(
        validation.message || "Twój projekt tortu jest niekompletny."
      );
      setAlertOpen(true);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const isTargetCakePreview =
      e.target === cakePreviewRef.current ||
      e.currentTarget === cakePreviewRef.current ||
      e.target === (renderCakeShape() as unknown as EventTarget) ||
      e.currentTarget.contains(e.target as Node);

    if (isTargetCakePreview) {
      setSelectedElement(null);
      setSelectedTextElement(null);
      setNewText("");
      setSelectedColor("#000000");
    }
  };

  useEffect(() => {
    if (selectedElement?.startsWith("text_")) {
      const textElement = appearance.texts.find(
        (text) => text.id === selectedElement
      );
      if (textElement) {
        setSelectedTextElement(textElement);
        setNewText(textElement.text);
        setSelectedColor(textElement.color);
      }
    } else {
      setSelectedTextElement(null);
      if (!selectedElement) {
        setNewText("");
      }
    }
  }, [selectedElement, appearance.texts]);

  const renderCakeShape = () => {
    const shape = appearance.shape;
    const size = 300;

    switch (shape.type) {
      case "circle":
        return (
          <div
            className="rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: appearance.baseColor,
            }}
          />
        );
      case "square":
        return (
          <div
            className="rounded-md"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: appearance.baseColor,
            }}
          />
        );
      case "rectangle":
        const aspectRatio = shape.aspectRatio || 1.5;
        return (
          <div
            className="rounded-md"
            style={{
              width: `${size}px`,
              height: `${size / aspectRatio}px`,
              backgroundColor: appearance.baseColor,
            }}
          />
        );
      case "heart":
      case "triangle":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24">
            <path d={shape.path} fill={appearance.baseColor} />
          </svg>
        );
      default:
        return (
          <div
            className="rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: appearance.baseColor,
            }}
          />
        );
    }
  };

  const handlePreviousStep = () => {
    const previousStepUrl = editId ? `/kreator?edit=${editId}` : "/kreator";
    router.push(previousStepUrl);
  };

  const setShape = (shape: CakeShape) => {
    setAppearance((prev) => ({
      ...prev,
      shape,
    }));
  };

  const handleSetBaseColor = (color: string) => {
    setAppearance((prev) => ({
      ...prev,
      baseColor: color,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Wygląd Tortu</h1>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Podgląd Tortu</h2>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
            <div className="flex flex-col items-center">
              <div
                ref={cakePreviewRef}
                className="relative bg-card rounded-lg p-4 w-[350px] h-[350px] flex items-center justify-center overflow-hidden border-2 border-dashed border-border"
                onClick={handleCanvasClick}
              >
                <div className="relative">
                  {renderCakeShape()}

                  {appearance.texts.map((text) => (
                    <DraggableText
                      key={text.id}
                      element={text}
                      updateElement={updateElement}
                      deleteElement={deleteElement}
                      isSelected={selectedElement === text.id}
                      setSelectedElement={setSelectedElement}
                    />
                  ))}

                  {appearance.images.map((image) => (
                    <DraggableImage
                      key={image.id}
                      element={image}
                      updateElement={updateElement}
                      deleteElement={deleteElement}
                      isSelected={selectedElement === image.id}
                      setSelectedElement={setSelectedElement}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="bg-card p-4 rounded-md border">
                <h3 className="font-medium text-lg mb-2">Instrukcje</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Wybierz kształt i kolor tortu poniżej</li>
                  <li>Dodaj tekst lub obrazy, aby udekorować swój tort</li>
                  <li>Przeciągnij elementy, aby umieścić je na torcie</li>
                  <li>Kliknij na element, aby go edytować lub usunąć</li>
                </ul>
              </div>

              <div className="bg-card p-4 rounded-md border">
                <h3 className="font-medium text-lg mb-2">Rozkład Cen</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Podstawa tortu:</span>
                    <span>{baseCakePrice.toFixed(2)} zł</span>
                  </div>

                  {appearance.shape.type in PRICING.SHAPE_PREMIUM && (
                    <div className="flex justify-between">
                      <span>Kształt premium ({appearance.shape.name}):</span>
                      <span>{getShapePremiumCost().toFixed(2)} zł</span>
                    </div>
                  )}

                  {appearance.texts.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium">
                        Elementy tekstowe:
                      </div>
                      <div className="max-h-20 overflow-y-auto">
                        {appearance.texts.map((text) => (
                          <div
                            key={text.id}
                            className="flex justify-between text-sm pl-2"
                          >
                            <span className="truncate max-w-[150px]">
                              {text.text}
                            </span>
                            <span>{text.price.toFixed(2)} zł</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {appearance.images.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium">
                        Elementy graficzne:
                      </div>
                      <div className="max-h-20 overflow-y-auto">
                        {appearance.images.map((image, index) => (
                          <div
                            key={image.id}
                            className="flex justify-between text-sm pl-2"
                          >
                            <span>Obraz {index + 1}</span>
                            <span>{image.price.toFixed(2)} zł</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t flex justify-between items-center font-medium">
                  <span>Łącznie:</span>
                  <span className="text-lg">
                    {calculateTotalPrice().toFixed(2)} zł
                  </span>
                </div>
              </div>
              <div className="mt-8 w-full max-w-md">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleContinue}
                  variant="default"
                >
                  Przejdź do Następnego Kroku
                </Button>
              </div>

              {selectedElement && (
                <div className="bg-white p-4 rounded-md border">
                  <h3 className="font-medium text-lg mb-2">Wybrany Element</h3>
                  {selectedElement.startsWith("text_") ? (
                    <div className="space-y-2">
                      <p className="text-sm">Edytuj właściwości tekstu:</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => deleteElement(selectedElement)}
                      >
                        Usuń Tekst
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm">Edytuj właściwości obrazu:</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => deleteElement(selectedElement)}
                      >
                        Usuń Obraz
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Zaprojektuj Swój Tort</h2>
          <Tabs defaultValue="shape">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="shape">Kształt i Kolor</TabsTrigger>
              <TabsTrigger value="text">Dodaj Tekst</TabsTrigger>
              <TabsTrigger value="image">Dodaj Obraz</TabsTrigger>
            </TabsList>

            <TabsContent value="shape" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Kształt Tortu</h3>
                <ScrollArea className="w-full">
                  <div className="flex flex-row gap-4 pb-4">
                    {cakeShapes.map((shape) => (
                      <Card
                        key={shape.id}
                        className={`min-w-[100px] cursor-pointer border-2 ${
                          appearance.shape.id === shape.id
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        onClick={() => setShape(shape)}
                      >
                        <CardContent className="p-4 flex items-center justify-center h-[100px]">
                          {shape.type === "circle" && (
                            <div className="rounded-full bg-gray-200 w-16 h-16"></div>
                          )}
                          {shape.type === "square" && (
                            <div className="rounded-md bg-gray-200 w-16 h-16"></div>
                          )}
                          {shape.type === "rectangle" && (
                            <div className="rounded-md bg-gray-200 w-20 h-14"></div>
                          )}
                          {(shape.type === "heart" ||
                            shape.type === "triangle") && (
                            <svg width="64" height="64" viewBox="0 0 24 24">
                              <path d={shape.path} fill="rgb(229, 231, 235)" />
                            </svg>
                          )}
                        </CardContent>
                        <CardFooter className="p-2 pt-0 text-center justify-center flex-col">
                          <span className="text-sm">{shape.name}</span>
                          {shape.type in PRICING.SHAPE_PREMIUM && (
                            <span className="text-xs text-muted-foreground">
                              +
                              {PRICING.SHAPE_PREMIUM[
                                shape.type as keyof typeof PRICING.SHAPE_PREMIUM
                              ].toFixed(2)}{" "}
                              zł
                            </span>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Kolor Tortu</h3>
                <div className="flex gap-4">
                  {baseColors.map((color) => (
                    <TooltipProvider key={color.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={`w-12 h-12 rounded-full border-2 ${
                              appearance.baseColor === color.value
                                ? "border-primary ring-2 ring-primary/50"
                                : "border-gray-200"
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => handleSetBaseColor(color.value)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="text-input">Treść Tekstu</Label>
                  <Input
                    id="text-input"
                    placeholder="Wpisz tekst na tort"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Kolor Tekstu</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 flex space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-10 h-10 p-0 border-2"
                            style={{ backgroundColor: selectedColor }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="grid gap-2">
                            <div className="grid grid-cols-6 gap-1">
                              {[
                                "#000000",
                                "#FFFFFF",
                                "#FF0000",
                                "#00FF00",
                                "#0000FF",
                                "#FFFF00",
                                "#FFA500",
                                "#800080",
                                "#FFC0CB",
                                "#A52A2A",
                                "#008080",
                                "#FFD700",
                              ].map((color) => (
                                <button
                                  key={color}
                                  className="w-8 h-8 rounded-full border border-gray-200"
                                  style={{ backgroundColor: color }}
                                  onClick={() => setSelectedColor(color)}
                                />
                              ))}
                            </div>
                            <Input
                              type="color"
                              value={selectedColor}
                              onChange={(e) => setSelectedColor(e.target.value)}
                              className="w-full h-8"
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="text"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                  <p>
                    Dekoracje tekstowe zaczynają się od{" "}
                    {PRICING.TEXT_BASE.toFixed(2)} zł. Większy tekst kosztuje
                    więcej.
                  </p>
                </div>

                <Button onClick={addOrUpdateText}>
                  {selectedTextElement
                    ? "Aktualizuj Tekst"
                    : "Dodaj Tekst do Tortu"}
                </Button>

                {selectedTextElement && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTextElement(null);
                      setNewText("");
                      setSelectedElement(null);
                    }}
                  >
                    Anuluj Edycję
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="image-upload">Wgraj Obraz</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="image-upload"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <p className="text-xs text-muted-foreground">
                      Akceptowane formaty: JPG, PNG, GIF (maks. 5MB)
                    </p>
                  </div>
                </div>
                <p className="text-sm">
                  Obrazy zaczynają się od {PRICING.IMAGE_BASE.toFixed(2)} zł.
                  Większe obrazy kosztują więcej.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handlePreviousStep}>
          Wróć do Smaku
        </Button>
        <Button onClick={handleContinue}>Przejdź do Opakowania</Button>
      </div>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Niekompletny Projekt Tortu</AlertDialogTitle>
            <AlertDialogDescription>{validationMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
