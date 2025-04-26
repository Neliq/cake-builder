"use client";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Sample cake data
const cakes = [
  {
    id: 1,
    name: "Chocolate Dream",
    image: "/images/cake1.jpg",
    layersImage: "/images/layers1.jpg",
    productionDate: "2023-05-15",
    price: 299,
    layers: ["Chocolate Dough", "Vanilla Sponge", "Strawberry Jelly"],
  },
  {
    id: 2,
    name: "Fruit Paradise",
    image: "/images/cake2.jpg",
    layersImage: "/images/layers2.jpg",
    productionDate: "2023-06-22",
    price: 349,
    layers: ["Vanilla Dough", "Blueberry Jelly", "Whipped Cream"],
  },
  {
    id: 3,
    name: "Wedding Special",
    image: "/images/cake3.jpg",
    layersImage: "/images/layers3.jpg",
    productionDate: "2023-07-10",
    price: 499,
    layers: [
      "Vanilla Dough",
      "Buttercream",
      "Vanilla Sponge",
      "Chocolate Ganache",
    ],
  },
  {
    id: 4,
    name: "Birthday Delight",
    image: "/images/cake4.jpg",
    layersImage: "/images/layers4.jpg",
    productionDate: "2023-08-05",
    price: 279,
    layers: ["Chocolate Dough", "Buttercream", "Sprinkles"],
  },
];

// CakeCard component
function CakeCard({ cake, onImport }) {
  const [isHovering, setIsHovering] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
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
          <div className="h-full w-full flex flex-col items-center justify-center bg-amber-50 p-4">
            <h3 className="text-lg font-semibold mb-2">Taste Layers</h3>
            <div className="w-full">
              {cake.layers.map((layer, index) => {
                const baseLayer = layer.toLowerCase();
                const colorMap = {
                  chocolate: "#7B3F00",
                  vanilla: "#F3E5AB",
                  strawberry: "#FF9999",
                  blueberry: "#4169E1",
                  buttercream: "#FFFDD0",
                  whipped: "#FFFFFF",
                  sprinkles: "#FFD700",
                  ganache: "#3D2314",
                  red: "#B22222",
                };

                let bgColor = "#F5F5F5";
                let textColor = "#000";

                Object.entries(colorMap).forEach(([key, value]) => {
                  if (baseLayer.includes(key.toLowerCase())) {
                    bgColor = value;
                    if (
                      ["chocolate", "blueberry", "ganache", "red"].some(
                        (dark) => baseLayer.includes(dark.toLowerCase())
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
        <h2 className="text-xl font-semibold mb-2 text-primary">{cake.name}</h2>
        <div className="flex justify-between mb-4 text-primary">
          <span>Production: {formatDate(cake.productionDate)}</span>
          <span className="font-bold">{cake.price} zł</span>
        </div>
        <Button onClick={() => onImport(cake)} className="w-full">
          Import to Builder
        </Button>
      </div>
    </div>
  );
}

export default function Torty() {
  const router = useRouter();

  const handleImport = (cake) => {
    localStorage.setItem(
      "importedCakeConfig",
      JSON.stringify({
        layers: cake.layers,
        cakeId: cake.id,
        cakeName: cake.name,
      })
    );

    router.push("/kreator");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Our Customer Cakes Gallery
        </h1>
        <p className="text-center mb-8 text-secondary-foreground">
          Browse through cakes made for our customers. Hover over images to see
          the layers!
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
