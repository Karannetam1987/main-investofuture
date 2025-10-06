
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import initialHeroSlides from "@/lib/data/hero-slides.json";
import initialAdsData from "@/lib/data/ads.json";
import initialSiteConfig from "@/lib/data/site-config.json";

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

type AdSlot = {
  network: "none" | "adsense" | "adsterra";
  code: string;
  desktopWidth: string;
  desktopHeight: string;
  mobileWidth: string;
  mobileHeight: string;
};

type AdsConfig = {
  belowHero: AdSlot;
  aboveFooter: AdSlot;
};

type SiteConfig = {
    siteName: string;
    aboutUs: {
        title: string;
        description: string;
    };
    contact: {
        email: string;
        phone: string;
    };
};


export default function SettingsPage() {
  const [heroSlides, setHeroSlides] = useState<Slide[]>(initialHeroSlides);
  const [adsConfig, setAdsConfig] = useState<AdsConfig>(initialAdsData);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialSiteConfig);
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

  const handleAdChange = (slot: keyof AdsConfig, field: keyof AdSlot, value: string) => {
    setAdsConfig(prev => ({
        ...prev,
        [slot]: {
            ...prev[slot],
            [field]: value
        }
    }));
  };

  const handleSiteConfigChange = (section: keyof SiteConfig, field: string, value: string) => {
      if (section === 'aboutUs' || section === 'contact') {
          setSiteConfig(prev => ({
              ...prev,
              [section]: {
                  ...(prev[section]),
                  [field]: value
              }
          }));
      } else {
           setSiteConfig(prev => ({
              ...prev,
              [field]: value
          }));
      }
  }

  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your website settings have been updated.",
    });
    console.log("Saving Hero Slides:", heroSlides);
    console.log("Saving Ads Config:", adsConfig);
    console.log("Saving Site Config:", siteConfig);
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Website Settings</h2>
         <Button onClick={handleSaveChanges} size="lg">Save All Settings</Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="ads">Advertisements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage general website information like site name, about us content, and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name / Logo Text</Label>
                        <Input id="siteName" value={siteConfig.siteName} onChange={(e) => handleSiteConfigChange('siteName', 'siteName', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="aboutTitle">About Us Title</Label>
                        <Input id="aboutTitle" value={siteConfig.aboutUs.title} onChange={(e) => handleSiteConfigChange('aboutUs', 'title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aboutDescription">About Us Description</Label>
                        <Textarea id="aboutDescription" value={siteConfig.aboutUs.description} onChange={(e) => handleSiteConfigChange('aboutUs', 'description', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input id="contactEmail" type="email" value={siteConfig.contact.email} onChange={(e) => handleSiteConfigChange('contact', 'email', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input id="contactPhone" value={siteConfig.contact.phone} onChange={(e) => handleSiteConfigChange('contact', 'phone', e.target.value)} />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Customize the slides in your homepage hero section. You can add up to 10 slides.
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads">
          <Card>
            <CardHeader>
                <CardTitle>Advertisement Settings</CardTitle>
                <CardDescription>Manage ad placeholders on your website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Ad Slot 1: Below Hero */}
                <div className="rounded-lg border p-4 space-y-4">
                    <h3 className="text-lg font-semibold">Ad Slot: Below Hero Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Ad Network</Label>
                            <Select value={adsConfig.belowHero.network} onValueChange={(value) => handleAdChange("belowHero", "network", value as any)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="adsense">Google AdSense</SelectItem>
                                    <SelectItem value="adsterra">Adsterra</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="ad-code-below-hero">Ad Code</Label>
                            <Textarea id="ad-code-below-hero" placeholder="Paste your ad code snippet here" rows={6} value={adsConfig.belowHero.code} onChange={(e) => handleAdChange("belowHero", "code", e.target.value)} disabled={adsConfig.belowHero.network === 'none'}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ad-desktop-width-below-hero">Desktop Width</Label>
                                <Input id="ad-desktop-width-below-hero" placeholder="e.g., 728" value={adsConfig.belowHero.desktopWidth} onChange={(e) => handleAdChange("belowHero", "desktopWidth", e.target.value)} disabled={adsConfig.belowHero.network === 'none'}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ad-desktop-height-below-hero">Desktop Height</Label>
                                <Input id="ad-desktop-height-below-hero" placeholder="e.g., 90" value={adsConfig.belowHero.desktopHeight} onChange={(e) => handleAdChange("belowHero", "desktopHeight", e.target.value)} disabled={adsConfig.belowHero.network === 'none'}/>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ad-mobile-width-below-hero">Mobile Width</Label>
                                <Input id="ad-mobile-width-below-hero" placeholder="e.g., 320" value={adsConfig.belowHero.mobileWidth} onChange={(e) => handleAdChange("belowHero", "mobileWidth", e.target.value)} disabled={adsConfig.belowHero.network === 'none'}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ad-mobile-height-below-hero">Mobile Height</Label>
                                <Input id="ad-mobile-height-below-hero" placeholder="e.g., 100" value={adsConfig.belowHero.mobileHeight} onChange={(e) => handleAdChange("belowHero", "mobileHeight", e.target.value)} disabled={adsConfig.belowHero.network === 'none'}/>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Ad Slot 2: Above Footer */}
                <div className="rounded-lg border p-4 space-y-4">
                    <h3 className="text-lg font-semibold">Ad Slot: Above Footer</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Ad Network</Label>
                            <Select value={adsConfig.aboveFooter.network} onValueChange={(value) => handleAdChange("aboveFooter", "network", value as any)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="adsense">Google AdSense</SelectItem>
                                    <SelectItem value="adsterra">Adsterra</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="ad-code-above-footer">Ad Code</Label>
                            <Textarea id="ad-code-above-footer" placeholder="Paste your ad code snippet here" rows={6} value={adsConfig.aboveFooter.code} onChange={(e) => handleAdChange("aboveFooter", "code", e.target.value)} disabled={adsConfig.aboveFooter.network === 'none'}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ad-desktop-width-above-footer">Desktop Width</Label>
                                <Input id="ad-desktop-width-above-footer" placeholder="e.g., 728" value={adsConfig.aboveFooter.desktopWidth} onChange={(e) => handleAdChange("aboveFooter", "desktopWidth", e.target.value)} disabled={adsConfig.aboveFooter.network === 'none'}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ad-desktop-height-above-footer">Desktop Height</Label>
                                <Input id="ad-desktop-height-above-footer" placeholder="e.g., 90" value={adsConfig.aboveFooter.desktopHeight} onChange={(e) => handleAdChange("aboveFooter", "desktopHeight", e.target.value)} disabled={adsConfig.aboveFooter.network === 'none'}/>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ad-mobile-width-above-footer">Mobile Width</Label>
                                <Input id="ad-mobile-width-above-footer" placeholder="e.g., 320" value={adsConfig.aboveFooter.mobileWidth} onChange={(e) => handleAdChange("aboveFooter", "mobileWidth", e.target.value)} disabled={adsConfig.aboveFooter.network === 'none'}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ad-mobile-height-above-footer">Mobile Height</Label>
                                <Input id="ad-mobile-height-above-footer" placeholder="e.g., 100" value={adsConfig.aboveFooter.mobileHeight} onChange={(e) => handleAdChange("aboveFooter", "mobileHeight", e.target.value)} disabled={adsConfig.aboveFooter.network === 'none'}/>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    