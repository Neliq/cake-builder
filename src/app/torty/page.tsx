"use client";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// LocalStorage key for builder context - must match the one in builder-context.tsx
const LOCAL_STORAGE_KEY = "cakeBuilderState";

// Define the type for a single cake
interface Cake {
  id: number;
  name: string;
  image: string;
  layersImage: string;
  productionDate: string;
  price: number;
  layers: string[];
}

// Sample cake data (using the Cake type)
const cakes: Cake[] = [
  {
    id: 1,
    name: "Chocolate Dream",
    image: "/images/cake1.jpg",
    layersImage: "/images/layers1.jpg",
    productionDate: "2023-05-15",
    price: 299,
    layers: [
      "Ciasto Czekoladowe",
      "Biszkopt Waniliowy",
      "Galaretka Truskawkowa",
    ],
  },
  {
    id: 2,
    name: "Fruit Paradise",
    image: "/images/cake2.jpg",
    layersImage: "/images/layers2.jpg",
    productionDate: "2023-06-22",
    price: 349,
    layers: ["Ciasto Waniliowe", "Galaretka Jagodowa", "Bita Śmietana"],
  },
  {
    id: 3,
    name: "Wedding Special",
    image: "/images/cake3.jpg",
    layersImage: "/images/layers3.jpg",
    productionDate: "2023-07-10",
    price: 499,
    layers: [
      "Ciasto Waniliowe",
      "Krem Maślany",
      "Biszkopt Waniliowy",
      "Ganache Czekoladowy",
    ],
  },
  {
    id: 4,
    name: "Birthday Delight",
    image: "/images/cake4.jpg",
    layersImage: "/images/layers4.jpg",
    productionDate: "2023-08-05",
    price: 279,
    layers: ["Ciasto Czekoladowe", "Krem Maślany", "Posypka"],
  },
];

// Define props type for CakeCard
interface CakeCardProps {
  cake: Cake;
  onImport: (cake: Cake) => void;
}

// CakeCard component with typed props
function CakeCard({ cake, onImport }: CakeCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-secondary rounded-lg shadow-md overflow-hidden">
      <div
        className="relative h-64 w-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {!isHovering ? (
          <Image
            src={cake.image}
            alt={cake.name}
            fill
            style={{ objectFit: "cover" }}
            className="transition-opacity duration-300"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-card p-4">
            <h3 className="text-lg font-semibold mb-2">Warstwy Smakowe</h3>
            <div className="w-full">
              {cake.layers.map((layer, index) => {
                const baseLayer = layer.toLowerCase();
                const colorMap = {
                  czekoladow: "#7B3F00",
                  waniliow: "#F3E5AB",
                  truskawkow: "#FF9999",
                  jagodow: "#4169E1",
                  maślan: "#FFFDD0",
                  bita: "#FFFFFF",
                  posypka: "#FFD700",
                  ganache: "#3D2314",
                  red: "#B22222",
                };

                let bgColor = "#F5F5F5";
                let textColor = "#000";

                Object.entries(colorMap).forEach(([key, value]) => {
                  if (baseLayer.includes(key.toLowerCase())) {
                    bgColor = value;
                    if (
                      ["czekoladow", "jagodow", "ganache", "red"].some((dark) =>
                        baseLayer.includes(dark.toLowerCase())
                      )
                    ) {
                      textColor = "#fff";
                    }
                  }
                });

                return (
                  <div
                    key={index}
                    className="w-full py-2 text-center mb-1 rounded"
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                    }}
                  >
                    {layer}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{cake.name}</h2>
        <div className="flex justify-between mb-4">
          <span>Produkcja: {formatDate(cake.productionDate)}</span>
          <span className="font-bold">{cake.price} zł</span>
        </div>
        <Button onClick={() => onImport(cake)} className="w-full">
          Importuj do Kreatora
        </Button>
      </div>
    </div>
  );
}

export default function Torty() {
  const router = useRouter();

  const handleImport = (cake: Cake) => {
    try {
      // --- 1. Use the builder's real addon list for price/type/color mapping ---
      // Import the addons array from the builder if possible, or define it here for mapping
      // For this example, we define a minimal mapping for demo cakes:
      const addonMap: Record<
        string,
        { type: string; color: string; height: number; price: number }
      > = {
        "ciasto waniliowe": {
          type: "dough",
          color: "#F5DEB3",
          height: 20,
          price: 12.99,
        },
        "ciasto czekoladowe": {
          type: "dough",
          color: "#8B4513",
          height: 20,
          price: 14.99,
        },
        "ciasto red velvet": {
          type: "dough",
          color: "#B22222",
          height: 20,
          price: 16.99,
        },
        "biszkopt waniliowy": {
          type: "sponge",
          color: "#FFFACD",
          height: 30,
          price: 9.99,
        },
        "biszkopt czekoladowy": {
          type: "sponge",
          color: "#5C4033",
          height: 30,
          price: 11.99,
        },
        "galaretka truskawkowa": {
          type: "jelly",
          color: "#FF69B4",
          height: 10,
          price: 5.99,
        },
        "galaretka jagodowa": {
          type: "jelly",
          color: "#4169E1",
          height: 10,
          price: 6.99,
        },
        "bita śmietana": {
          type: "cream",
          color: "#FFFFFF",
          height: 15,
          price: 4.99,
        },
        "krem maślany": {
          type: "cream",
          color: "#FFFDD0",
          height: 15,
          price: 6.99,
        },
        "ganache czekoladowy": {
          type: "topping",
          color: "#3D2314",
          height: 8,
          price: 7.99,
        },
        posypka: { type: "topping", color: "#FFD700", height: 8, price: 3.99 },
        // Add more mappings as needed
      };

      // --- 2. Map layers using the above mapping for correct price/type/color ---
      const mappedLayers = cake.layers.map((layerName, index) => {
        const key = layerName.trim().toLowerCase();
        const addon = addonMap[key];
        return {
          id: `imported_${cake.id}_${index}_${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          name: layerName,
          type: (addon?.type || "cream") as
            | "dough"
            | "sponge"
            | "jelly"
            | "fruit"
            | "cream"
            | "topping",
          color: addon?.color || "#F5F5F5",
          height: addon?.height ?? 15,
          price: addon?.price ?? 0,
        };
      });

      // --- 3. Save to localStorage and force context update by using a custom event ---
      const builderState = {
        tastePreview: { layers: mappedLayers },
        appearancePreview: null,
        packagingPreview: null,
        basePrice: mappedLayers.reduce((sum, l) => sum + l.price, 0),
        appearancePrice: 0,
        packagingPrice: 0,
        customText: null,
        editingItemId: null,
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(builderState));
      localStorage.setItem(
        "cake-taste-data",
        JSON.stringify({
          layers: mappedLayers,
          basePrice: builderState.basePrice,
          tastePreview: { layers: mappedLayers },
        })
      );

      // --- Force a React state update in the builder by reloading the page after navigation ---
      router.push("/kreator");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Failed to save cake configuration:", error);
      alert("Wystąpił błąd podczas importowania tortu");
      router.push("/kreator");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Galeria Tortów Naszych Klientów
        </h1>
        <p className="text-center mb-8 text-secondary-foreground">
          Przeglądaj torty wykonane dla naszych klientów. Najedź na obrazek, aby
          zobaczyć warstwy!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cakes.map((cake) => (
            <CakeCard key={cake.id} cake={cake} onImport={handleImport} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
