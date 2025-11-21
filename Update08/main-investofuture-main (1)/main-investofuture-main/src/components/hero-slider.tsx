
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroSlides from "@/lib/data/hero-slides.json";

const positionClasses = {
  left: "items-center text-left",
  right: "items-center text-right justify-end",
  center: "items-center text-center justify-center",
};

export function HeroSlider() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {heroSlides.map((slide, index) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-[65vh] w-full">
              <Image
                src={slide.imageUrl}
                alt={slide.description}
                fill
                className="object-cover"
                priority={index === 0}
                data-ai-hint={slide.imageHint}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div
                className={cn(
                  "absolute inset-0 z-10 flex flex-col p-8 md:p-16 text-white",
                  positionClasses[slide.button.position as keyof typeof positionClasses] || "items-center text-center justify-center"
                )}
              >
                <div className="max-w-3xl">
                  <h2 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-md">
                    {slide.heading}
                  </h2>
                  <p className="mt-4 text-lg md:text-xl drop-shadow-sm">
                    {slide.description}
                  </p>
                  {slide.button.text && slide.button.link && (
                    <Link href={slide.button.link}>
                      <Button size="lg" className="mt-8">
                        {slide.button.text}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden text-white md:flex" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden text-white md:flex" />
    </Carousel>
  );
}
