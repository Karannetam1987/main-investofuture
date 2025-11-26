
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const positionClasses = {
  left: "items-center text-left",
  right: "items-center text-right justify-end",
  center: "items-center text-center justify-center",
};

type SlideButton = {
  text: string;
  link: string;
  position: string;
};

type Slide = {
  id: number;
  imageUrl: string;
  imageHint: string;
  heading: string;
  description: string;
  button: SlideButton;
};

interface HeroSliderProps {
  slides: Slide[];
}


export function HeroSlider({ slides }: HeroSliderProps) {
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
        {slides.map((slide, index) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-[65vh] w-full">
              <Image
                src={slide.imageUrl}
                alt={slide.description}
                fill
                className="object-cover"
                priority={index === 0}
                data-ai-hint={slide.imageHint}
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
      <CarouselPrevious className="z-10 hidden text-white md:flex" />
      <CarouselNext className="z-10 hidden text-white md:flex" />
    </Carousel>
  );
}
