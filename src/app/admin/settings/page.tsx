
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import initialHeroSlides from "@/lib/data/hero-slides.json";

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

export default function SettingsPage() {
  const [heroSlides, setHeroSlides] = useState<Slide[]>(initialHeroSlides);
  const { toast } = useToast();

  const handleSlideChange = (id: number, field: string, value: any) => {
    setHeroSlides((prevSlides) =>
      prevSlides.map((slide) =>
        slide.id === id ? { ...slide, [field]: value } : slide
      )
    );
  };

  const handleButtonChange = (id: number, field: string, value: string) => {
    setHeroSlides((prevSlides) =>
      prevSlides.map((slide) =>
        slide.id === id
          ? { ...slide, button: { ...slide.button, [field]: value } }
          : slide
      )
    );
  };

  const handleAddSlide = () => {
    if (heroSlides.length >= 10) {
      toast({
        title: "Limit Reached",
        description: "You can have a maximum of 10 slides.",
        variant: "destructive",
      });
      return;
    }
    const newSlide: Slide = {
      id: Date.now(),
      imageUrl: "https://picsum.photos/seed/newslide/1920/1080",
      imageHint: "new image",
      heading: "New Slide Title",
      description: "A brief description for the new slide.",
      button: {
        text: "Click Here",
        link: "/",
        position: "center",
      },
    };
    setHeroSlides((prev) => [...prev, newSlide]);
  };

  const handleRemoveSlide = (id: number) => {
    setHeroSlides((prev) => prev.filter((slide) => slide.id !== id));
    toast({
      title: "Slide Removed",
      description: "The slide has been successfully removed.",
      variant: "destructive",
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your website settings have been updated.",
    });
    console.log("Saving Hero Slides:", heroSlides);
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Website Settings</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>
            Customize the slides in your homepage hero section. You can add up to
            10 slides.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {heroSlides.map((slide) => (
              <div key={slide.id} className="rounded-lg border p-4 space-y-4 relative">
                 <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4 h-8 w-8"
                  onClick={() => handleRemoveSlide(slide.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`heading-${slide.id}`}>Heading</Label>
                    <Input
                      id={`heading-${slide.id}`}
                      value={slide.heading}
                      onChange={(e) => handleSlideChange(slide.id, "heading", e.target.value)}
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor={`imageUrl-${slide.id}`}>Image URL</Label>
                    <Input
                      id={`imageUrl-${slide.id}`}
                      value={slide.imageUrl}
                      onChange={(e) => handleSlideChange(slide.id, "imageUrl", e.target.value)}
                    />
                  </div>
                   <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`description-${slide.id}`}>Description</Label>
                    <Textarea
                      id={`description-${slide.id}`}
                      value={slide.description}
                      onChange={(e) => handleSlideChange(slide.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`button-text-${slide.id}`}>Button Text</Label>
                    <Input
                      id={`button-text-${slide.id}`}
                      value={slide.button.text}
                      onChange={(e) => handleButtonChange(slide.id, "text", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`button-link-${slide.id}`}>Button Link</Label>
                    <Input
                      id={`button-link-${slide.id}`}
                      value={slide.button.link}
                      onChange={(e) => handleButtonChange(slide.id, "link", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`button-position-${slide.id}`}>Button Position</Label>
                    <Select
                      value={slide.button.position}
                      onValueChange={(value) => handleButtonChange(slide.id, "position", value)}
                    >
                      <SelectTrigger id={`button-position-${slide.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
             <Button variant="outline" onClick={handleAddSlide}>
              Add Slide
            </Button>
          </div>
          <div className="mt-8 border-t pt-6">
             <Button onClick={handleSaveChanges}>Save All Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
