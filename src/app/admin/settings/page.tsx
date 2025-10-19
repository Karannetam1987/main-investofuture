
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { LoaderCircle, ShieldCheck, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import initialHeroSlides from "@/lib/data/hero-slides.json";
import initialAdsData from "@/lib/data/ads.json";
import initialSiteConfig from "@/lib/data/site-config.json";
import initialSmtpConfig from "@/lib/data/smtp-config.json";
import initialStatsData from "@/lib/data/stats.json";
import initialSiteFeatures from "@/lib/data/site-features.json";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


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

type SocialLink = {
    name: string;
    url: string;
}

type SiteConfig = {
    siteName: string;
    logoType: "text" | "image";
    logoImageUrl: string;
    logoWidth: number;
    logoHeight: number;
    aboutUs: {
        title: string;
        description: string;
    };
    contact: {
        email: string;
        phone: string;
    };
    socialLinks: SocialLink[];
};

type SmtpConfig = {
    host: string;
    port: number;
    user: string;
    pass: string;
    sender: string;
}

type StatsData = {
    totalInvestment: string;
    activeUsers: string;
    guaranteedReturns: string;
}

type Feature = {
    icon: string;
    title: string;
    description: string;
}

type AboutLink = {
    id: string;
    icon: string;
    title: string;
    description: string;
}

type SiteFeatures = {
    features: Feature[];
    aboutLinks: AboutLink[];
}

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});


export default function SettingsPage() {
  const [heroSlides, setHeroSlides] = useState<Slide[]>(initialHeroSlides);
  const [adsConfig, setAdsConfig] = useState<AdsConfig>(initialAdsData);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialSiteConfig);
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(initialSmtpConfig);
  const [statsData, setStatsData] = useState<StatsData>(initialStatsData);
  const [siteFeatures, setSiteFeatures] = useState<SiteFeatures>(initialSiteFeatures);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

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

  const handleSiteConfigChange = (section: keyof SiteConfig | 'aboutUs' | 'contact', field: string, value: string | number) => {
      if (section === 'aboutUs' || section === 'contact') {
          setSiteConfig(prev => ({
              ...prev,
              [section]: {
                  ...(prev[section as 'aboutUs' | 'contact']),
                  [field]: value
              }
          }));
      } else {
           setSiteConfig(prev => ({
              ...prev,
              [field as keyof SiteConfig]: value
          }));
      }
  }

  const handleSocialLinkChange = (index: number, url: string) => {
      setSiteConfig(prev => {
          const newSocialLinks = [...prev.socialLinks];
          newSocialLinks[index].url = url;
          return { ...prev, socialLinks: newSocialLinks };
      });
  }

  const handleSmtpChange = (field: keyof SmtpConfig, value: string | number) => {
    setSmtpConfig(prev => ({ ...prev, [field]: value }));
  }

  const handleStatsChange = (field: keyof StatsData, value: string) => {
    setStatsData(prev => ({ ...prev, [field]: value }));
  }

  const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
      setSiteFeatures(prev => {
          const newFeatures = [...prev.features];
          newFeatures[index] = { ...newFeatures[index], [field]: value };
          return { ...prev, features: newFeatures };
      });
  };

  const handleAboutLinkChange = (index: number, field: keyof AboutLink, value: string) => {
      setSiteFeatures(prev => {
          const newAboutLinks = [...prev.aboutLinks];
          newAboutLinks[index] = { ...newAboutLinks[index], [field]: value };
          return { ...prev, aboutLinks: newAboutLinks };
      });
  };

  const handlePasswordChange = async (values: z.infer<typeof passwordFormSchema>) => {
    // NOTE: This functionality is simulated. In a real-world application,
    // you would have a secure API endpoint to handle password changes.
    // For this project, we'll just show a success message.
    toast({
        title: "Password Change Simulated",
        description: "In a real app, this would securely change the admin password."
    });
    passwordForm.reset();
  }

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
        const settingsToSave = [
            { file: 'site-config.json', data: siteConfig },
            { file: 'stats.json', data: statsData },
            { file: 'site-features.json', data: siteFeatures },
            { file: 'hero-slides.json', data: heroSlides },
            { file: 'ads.json', data: adsConfig },
            { file: 'smtp-config.json', data: smtpConfig }
        ];

        // Use Promise.all to send all requests in parallel
        const responses = await Promise.all(
            settingsToSave.map(setting => 
                fetch('/api/update-json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(setting),
                })
            )
        );

        // Check if any request failed
        const failedResponse = responses.find(res => !res.ok);
        if (failedResponse) {
            const errorData = await failedResponse.json();
            throw new Error(errorData.message || `Failed to save one or more settings.`);
        }
        
        toast({
            title: "Settings Saved Successfully",
            description: "All your changes have been saved permanently.",
        });

    } catch (error: any) {
        toast({
            title: "Error Saving Settings",
            description: error.message || "An unknown error occurred.",
            variant: "destructive",
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Website Settings</h2>
         <Button onClick={handleSaveChanges} size="lg" disabled={isSaving}>
            {isSaving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save All Settings"}
         </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="ads">Advertisements</TabsTrigger>
          <TabsTrigger value="smtp">Email (SMTP)</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage general website information like site name, logo, about us content, and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Logo Type</Label>
                        <RadioGroup 
                            value={siteConfig.logoType} 
                            onValueChange={(value) => handleSiteConfigChange('siteName', 'logoType', value)}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="text" id="logo-text" />
                                <Label htmlFor="logo-text">Text</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="image" id="logo-image" />
                                <Label htmlFor="logo-image">Image</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {siteConfig.logoType === 'text' ? (
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Site Name / Logo Text</Label>
                            <Input id="siteName" value={siteConfig.siteName} onChange={(e) => handleSiteConfigChange('siteName', 'siteName', e.target.value)} />
                        </div>
                    ) : (
                        <div className="p-4 border rounded-md space-y-4">
                             <h4 className="font-medium text-sm">Custom Logo Image</h4>
                             <div className="space-y-2">
                                <Label htmlFor="logoImageUrl">Logo Image URL</Label>
                                <Input id="logoImageUrl" placeholder="https://example.com/logo.png" value={siteConfig.logoImageUrl} onChange={(e) => handleSiteConfigChange('logoImageUrl', 'logoImageUrl', e.target.value)} />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="logoWidth">Logo Width (px)</Label>
                                    <Input id="logoWidth" type="number" value={siteConfig.logoWidth} onChange={(e) => handleSiteConfigChange('logoWidth', 'logoWidth', Number(e.target.value))} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="logoHeight">Logo Height (px)</Label>
                                    <Input id="logoHeight" type="number" value={siteConfig.logoHeight} onChange={(e) => handleSiteConfigChange('logoHeight', 'logoHeight', Number(e.target.value))} />
                                </div>
                             </div>
                        </div>
                    )}


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

                     <div className="space-y-4 p-4 border rounded-md">
                        <h4 className="font-medium text-sm">Social Media Links</h4>
                        <div className="space-y-4">
                            {siteConfig.socialLinks.map((link, index) => (
                                <div key={link.name} className="flex items-center gap-4">
                                    <Label htmlFor={`social-${link.name}`} className="w-24">{link.name}</Label>
                                    <Input 
                                        id={`social-${link.name}`}
                                        value={link.url}
                                        onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                                        placeholder={`Enter ${link.name} URL`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="homepage">
            <Card>
                <CardHeader>
                    <CardTitle>Homepage Sections</CardTitle>
                    <CardDescription>Customize the content of various sections on your homepage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <div className="space-y-4 p-4 border rounded-md">
                        <h3 className="font-semibold text-lg">"Success in Numbers" Section</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor="totalInvestment">Total Investment Text</Label>
                                <Input id="totalInvestment" value={statsData.totalInvestment} onChange={(e) => handleStatsChange('totalInvestment', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="activeUsers">Active Users Text</Label>
                                <Input id="activeUsers" value={statsData.activeUsers} onChange={(e) => handleStatsChange('activeUsers', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="guaranteedReturns">Guaranteed Returns Text</Label>
                                <Input id="guaranteedReturns" value={statsData.guaranteedReturns} onChange={(e) => handleStatsChange('guaranteedReturns', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border rounded-md">
                        <h3 className="font-semibold text-lg">"Features" Section</h3>
                        <div className="space-y-6">
                            {siteFeatures.features.map((feature, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`feature-title-${index}`}>Feature Title</Label>
                                        <Input id={`feature-title-${index}`} value={feature.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`feature-desc-${index}`}>Feature Description</Label>
                                        <Textarea id={`feature-desc-${index}`} value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`feature-icon-${index}`}>Icon Name (from Lucide-React)</Label>
                                        <Input id={`feature-icon-${index}`} value={feature.icon} onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-4 p-4 border rounded-md">
                        <h3 className="font-semibold text-lg">"About" Section Links</h3>
                        <div className="space-y-6">
                            {siteFeatures.aboutLinks.map((link, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`about-title-${index}`}>Link Title</Label>
                                        <Input id={`about-title-${index}`} value={link.title} onChange={(e) => handleAboutLinkChange(index, 'title', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`about-desc-${index}`}>Link Description</Label>
                                        <Textarea id={`about-desc-${index}`} value={link.description} onChange={(e) => handleAboutLinkChange(index, 'description', e.target.value)} />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor={`about-icon-${index}`}>Icon Name (from Lucide-React)</Label>
                                        <Input id={`about-icon-${index}`} value={link.icon} onChange={(e) => handleAboutLinkChange(index, 'icon', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
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

        <TabsContent value="smtp">
            <Card>
                <CardHeader>
                    <CardTitle>Email (SMTP) Settings</CardTitle>
                    <CardDescription>Configure your SMTP server to send emails from your website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="smtpHost">SMTP Host</Label>
                            <Input id="smtpHost" value={smtpConfig.host} onChange={(e) => handleSmtpChange('host', e.target.value)} placeholder="smtp.example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtpPort">SMTP Port</Label>
                            <Input id="smtpPort" type="number" value={smtpConfig.port} onChange={(e) => handleSmtpChange('port', Number(e.target.value))} placeholder="587" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtpUser">Username</Label>
                            <Input id="smtpUser" value={smtpConfig.user} onChange={(e) => handleSmtpChange('user', e.target.value)} placeholder="your-email@example.com" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="smtpPass">Password</Label>
                            <Input id="smtpPass" type="password" value={smtpConfig.pass} onChange={(e) => handleSmtpChange('pass', e.target.value)} placeholder="••••••••" />
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="smtpSender">Sender Email (Optional)</Label>
                            <Input id="smtpSender" value={smtpConfig.sender} onChange={(e) => handleSmtpChange('sender', e.target.value)} placeholder="noreply@yourdomain.com (optional)" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="security">
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Change your administrator password. This is for demonstration purposes only.</CardDescription>
                </CardHeader>
                <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
                        <CardContent className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={passwordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={passwordForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                {passwordForm.formState.isSubmitting ? (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                                ) : (
                                    <ShieldCheck className="mr-2 h-4 w-4"/>
                                )}
                                {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
