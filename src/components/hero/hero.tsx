"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import Lottie component with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Hero = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/cake.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Failed to load animation:", error));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12 lg:py-0">
        <div className="my-auto">
          <Badge className="bg-primary rounded-full py-1 border-none">
            Darmowa dostawa do zamówień powyżej 100zł
          </Badge>
          <h1 className="mt-6 max-w-[17ch] text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
            Zaprojektuj tort <br />a my go zrobimy!
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg">
            Wybierz idealny tort na każdą okazję. Skonfiguruj go według własnych
            upodobań, dobierając smaki, dekoracje i dodatki. My zadbamy o każdy
            detal, by był nie tylko piękny, ale i pyszny!
          </p>
          <div className="mt-12 flex items-center gap-4">
            <Link href="/kreator">
              <Button size="lg">
                Stwórz tort <ArrowUpRight className="!h-5 !w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <CirclePlay className="!h-5 !w-5" /> Poznaj naszą cukiernię
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full aspect-video lg:aspect-auto lg:w-[1000px] lg:h-[calc(100vh-4rem)] rounded-xl overflow-hidden">
            {animationData && (
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
