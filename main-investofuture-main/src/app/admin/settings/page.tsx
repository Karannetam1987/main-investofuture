
"use client";

import { useState, useEffect } from "react";
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
import { LoaderCircle, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";


export type SlideButton = {
  text: string;
  link: string;
  position: string;
};

export type Slide = {
  id: number;
  imageUrl: string;
  imageHint: string;
  heading: string;
  description: string;
  button: SlideButton;
};

export type AdSlot = {
  network: "none" | "adsense" | "adsterra";
  code: string;
  desktopWidth: string;
  desktopHeight: string;
  mobileWidth: string;
  mobileHeight: string;
};

export type AdsConfig = {
  belowHero: AdSlot;
  aboveFooter: AdSlot;
};

export type SocialLink = {
    name: string;
    url: string;
}

export type SiteConfig = {
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

export type SmtpConfig = {
    host: string;
    port: number;
    user: string;
    pass: string;
    sender: string;
}

export type StatsData = {
    totalInvestment: string;
    activeUsers: string;
    guaranteedReturns: string;
}

export type Feature = {
    icon: string;
    title: string;
    description: string;
}

export type AboutLink = {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export type SiteFeatures = {
    features: Feature[];
    aboutLinks: AboutLink[];
}

export type AllSettings = {
  heroSlides: Slide[];
  adsConfig: AdsConfig;
  siteConfig: SiteConfig;
  smtpConfig: SmtpConfig;
  statsData: StatsData;
  siteFeatures: SiteFeatures;
}

const defaultSettings: AllSettings = {
  heroSlides: [
    {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1745847768367-893e989d3a98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxvZmZpY2UlMjBjaGFydHN8ZW58MHx8fHwxNzU5MTQxNTE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      imageHint: "office charts",
      heading: "Invest in Your Future",
      description: "Secure your financial future with our expert investment strategies.",
      button: { text: "Learn More", link: "/#about", position: "center" }
    }
  ],
  adsConfig: {
    belowHero: { network: "none", code: "", desktopWidth: "728", desktopHeight: "90", mobileWidth: "320", mobileHeight: "100" },
    aboveFooter: { network: "none", code: "", desktopWidth: "728", desktopHeight: "90", mobileWidth: "320", mobileHeight: "100" },
  },
  siteConfig: {
    siteName: "InvestoFuture",
    logoType: "text",
    logoImageUrl: "",
    logoWidth: 120,
    logoHeight: 40,
    aboutUs: {
        title: "About Us",
        description: "Your financial partner for a better future."
    },
    contact: {
        email: "contact@investofuture.com",
        phone: "+1 234 567 890"
    },
    socialLinks: [
      { name: "Facebook", url: "https://facebook.com" },
      { name: "Twitter", url: "https://twitter.com" },
      { name: "Instagram", url: "https://instagram.com" },
      { name: "Telegram", url: "https://telegram.org" },
      { name: "WhatsApp", url: "https://whatsapp.com" }
    ]
  },
  smtpConfig: {
      host: "",
      port: 587,
      user: "",
      pass: "",
      sender: ""
  },
  statsData: {
    totalInvestment: "10M+",
    activeUsers: "5000+",
    guaranteedReturns: "12%"
  },
  siteFeatures: {
    features: [
        { icon: "BrainCircuit", title: "Expert Analysis", description: "Leverage our AI-powered market insights." },
        { icon: "ShieldCheck", title: "Secure Investments", description: "Your funds are protected with top-tier security." },
        { icon: "UserCheck", title: "Personalized Plans", description: "Tailored investment strategies just for you." },
        { icon: "TrendingUp", title: "Guaranteed Returns", description: "Enjoy stable and guaranteed returns on your capital." }
    ],
    aboutLinks: [
        { id: "privacy", icon: "FileLock", title: "Privacy Policy", description: "Read our commitment to your data privacy." },
        { id: "terms", icon: "FileText", title: "Terms of Service", description: "Understand the rules of our platform." },
        { id: "disclaimer", icon: "AlertTriangle", title: "Disclaimer", description: "Important information about financial risks." }
    ]
  }
};


export default function SettingsPage() {
  const firestore = useFirestore();
  const { data: initialSettings, loading: isLoading } = useDoc<AllSettings>("settings/site");
  const [settings, setSettings] = useState<AllSettings | null>(null);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    } else if (!isLoading) {
      setSettings(defaultSettings);
    }
  }, [initialSettings, isLoading]);


  const handleSlideChange = (id: number, field: keyof Slide, value: any) => {
    if (!settings) return;
    setSettings((prev) => ({...prev!, heroSlides: prev!.heroSlides.map((slide) =>
        slide.id === id ? { ...slide, [field]: value } : slide
      )}));
  };

  const handleButtonChange = (id: number, field: keyof SlideButton, value: string) => {
     if (!settings) return;
    setSettings((prev) => ({...prev!, heroSlides: prev!.heroSlides.map((slide) =>
        slide.id === id
          ? { ...slide, button: { ...slide.button, [field]: value } }
          : slide
      )}));
  };

  const handleAddSlide = () => {
     if (!settings) return;
    if (settings.heroSlides.length >= 10) {
      toast({
        title: "Limit Reached",
        description: "You can have a maximum of 10 slides.",
        variant: "destructive",
      });
      return;
    }
    const newSlide: Slide = {
      id: Date.now(),
      imageUrl: "https://images.unsplash.com/photo-1745847768367-893e989d3a98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxvZmZpY2UlMjBjaGFydHN8ZW58MHx8fHwxNzU5MTQxNTE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      imageHint: "new image",
      heading: "New Slide Title",
      description: "A brief description for the new slide.",
      button: {
        text: "Click Here",
        link: "/",
        position: "center",
      },
    };
    setSettings(prev => ({...prev!, heroSlides: [...prev!.heroSlides, newSlide]}));
  };

  const handleRemoveSlide = (id: number) => {
    if (!settings) return;
    setSettings((prev) => ({...prev!, heroSlides: prev!.heroSlides.filter((slide) => slide.id !== id)}));
  };

  const handleAdChange = (slot: keyof AdsConfig, field: keyof AdSlot, value: string) => {
    if (!settings) return;
    setSettings(prev => ({
        ...prev!,
        adsConfig: {
            ...prev!.adsConfig,
            [slot]: {
                ...prev!.adsConfig[slot],
                [field]: value
            }
        }
    }));
  };

  const handleSiteConfigChange = (field: string, value: any, section?: keyof SiteConfig ) => {
       if (!settings) return;
      if (section) {
          setSettings(prev => ({
              ...prev!,
              siteConfig: {
                  ...prev!.siteConfig,
                  [section]: {
                      ...(prev!.siteConfig[section] as any),
                      [field]: value
                  }
              }
          }));
      } else {
           setSettings(prev => ({
              ...prev!,
              siteConfig: {
                  ...prev!.siteConfig,
                  [field]: value
              }
          }));
      }
  }

  const handleSocialLinkChange = (index: number, url: string) => {
       if (!settings) return;
      setSettings(prev => {
          const newSocialLinks = [...prev!.siteConfig.socialLinks];
          newSocialLinks[index].url = url;
          return { ...prev!, siteConfig: {...prev!.siteConfig, socialLinks: newSocialLinks} };
      });
  }

  const handleSmtpChange = (field: keyof SmtpConfig, value: string | number) => {
     if (!settings) return;
    setSettings(prev => ({ ...prev!, smtpConfig: { ...prev!.smtpConfig, [field]: value } }));
  }

  const handleStatsChange = (field: keyof StatsData, value: string) => {
    if (!settings) return;
    setSettings(prev => ({ ...prev!, statsData: { ...prev!.statsData, [field]: value } }));
  }

  const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
      if (!settings) return;
      setSettings(prev => {
          const newFeatures = [...prev!.siteFeatures.features];
          newFeatures[index] = { ...newFeatures[index], [field]: value };
          return { ...prev!, siteFeatures: {...prev!.siteFeatures, features: newFeatures} };
      });
  };

  const handleAboutLinkChange = (index: number, field: keyof AboutLink, value: string) => {
      if (!settings) return;
      setSettings(prev => {
          const newAboutLinks = [...prev!.siteFeatures.aboutLinks];
          newAboutLinks[index] = { ...newAboutLinks[index], [field]: value };
          return { ...prev!, siteFeatures: {...prev!.siteFeatures, aboutLinks: newAboutLinks} };
      });
  };

  const handleSaveChanges = async () => {
    if (!settings) {
      toast({ title: "No settings to save.", variant: "destructive"});
      return;
    }
    setIsSaving(true);
    try {
      await setDoc(doc(firestore, "settings", "site"), settings);
      toast({
          title: "Settings Saved",
          description: "All your changes have been saved to the database.",
      });
    } catch (error: any) {
      toast({
        title: "Error Saving Settings",
        description: error.message,
        variant: "destructive"
      });
    } finally {
       setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
      return (
          <div className="flex-1 flex items-center justify-center">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
          </div>
      )
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Website Settings</h2>
         <Button onClick={handleSaveChanges} size="lg" disabled={isSaving}>
            {isSaving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save All Settings"}
         </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="ads">Advertisements</TabsTrigger>
          <TabsTrigger value="smtp">Email (SMTP)</TabsTrigger>
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
                            value={settings.siteConfig.logoType} 
                            onValueChange={(value) => handleSiteConfigChange('logoType', value)}
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

                    {settings.siteConfig.logoType === 'text' ? (
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Site Name / Logo Text</Label>
                            <Input id="siteName" value={settings.siteConfig.siteName} onChange={(e) => handleSiteConfigChange('siteName', e.target.value)} />
                        </div>
                    ) : (
                        <div className="p-4 border rounded-md space-y-4">
                             <h4 className="font-medium text-sm">Custom Logo Image</h4>
                             <div className="space-y-2">
                                <Label htmlFor="logoImageUrl">Logo Image URL</Label>
                                <Input id="logoImageUrl" placeholder="https://example.com/logo.png" value={settings.siteConfig.logoImageUrl} onChange={(e) => handleSiteConfigChange('logoImageUrl', e.target.value)} />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="logoWidth">Logo Width (px)</Label>
                                    <Input id="logoWidth" type="number" value={settings.siteConfig.logoWidth} onChange={(e) => handleSiteConfigChange('logoWidth', Number(e.target.value))} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="logoHeight">Logo Height (px)</Label>
                                    <Input id="logoHeight" type="number" value={settings.siteConfig.logoHeight} onChange={(e) => handleSiteConfigChange('logoHeight', Number(e.target.value))} />
                                </div>
                             </div>
                        </div>
                    )}


                     <div className="space-y-2">
                        <Label htmlFor="aboutTitle">About Us Title</Label>
                        <Input id="aboutTitle" value={settings.siteConfig.aboutUs.title} onChange={(e) => handleSiteConfigChange('title', e.target.value, 'aboutUs')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aboutDescription">About Us Description</Label>
                        <Textarea id="aboutDescription" value={settings.siteConfig.aboutUs.description} onChange={(e) => handleSiteConfigChange('description', e.target.value, 'aboutUs')} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input id="contactEmail" type="email" value={settings.siteConfig.contact.email} onChange={(e) => handleSiteConfigChange('email', e.target.value, 'contact')} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input id="contactPhone" value={settings.siteConfig.contact.phone} onChange={(e) => handleSiteConfigChange('phone', e.target.value, 'contact')} />
                    </div>

                     <div className="space-y-4 p-4 border rounded-md">
                        <h4 className="font-medium text-sm">Social Media Links</h4>
                        <div className="space-y-4">
                            {settings.siteConfig.socialLinks.map((link, index) => (
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
                                <Input id="totalInvestment" value={settings.statsData.totalInvestment} onChange={(e) => handleStatsChange('totalInvestment', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="activeUsers">Active Users Text</Label>
                                <Input id="activeUsers" value={settings.statsData.activeUsers} onChange={(e) => handleStatsChange('activeUsers', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="guaranteedReturns">Guaranteed Returns Text</Label>
                                <Input id="guaranteedReturns" value={settings.statsData.guaranteedReturns} onChange={(e) => handleStatsChange('guaranteedReturns', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border rounded-md">
                        <h3 className="font-semibold text-lg">"Features" Section</h3>
                        <div className="space-y-6">
                            {settings.siteFeatures.features.map((feature, index) => (
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
                            {settings.siteFeatures.aboutLinks.map((link, index) => (
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
                {settings.heroSlides.map((slide) => (
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
                            <Select value={settings.adsConfig.belowHero.network} onValueChange={(value) => handleAdChange("belowHero", "network", value as any)}>
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
                            <Textarea id="ad-code-below-hero" placeholder="Paste your ad code snippet here" rows={6} value={settings.adsConfig.belowHero.code} onChange={(e) => handleAdChange("belowHero", "code", e.target.value)} disabled={settings.adsConfig.belowHero.network === 'none'}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ad-desktop-width-below-hero">Desktop Width</Label>
                                <Input id="ad-desktop-width-below-hero" placeholder="e.g., 728" value={settings.adsConfig.belowHero.desktopWidth} onChange={(e) => handleAdChange("belowHero", "desktopWidth", e.target.value)} disabled={settings.adsConfig.belowHero.network === 'none'}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ad-desktop-height-below-hero">Desktop Height</Label>
                                <Input id="ad-desktop-height-below-hero" placeholder="e.g., 90" value={settings.adsConfig.belowHero.desktopHeight} onChange={(e) => handleAdChange("belowHero", "desktopHeight", e.target.value)} disabled={settings.adsConfig.belowHero.network === 'none'}/>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ad-mobile-width-below-hero">Mobile Width</Label>
                                <Input id="ad-mobile-width-below-hero" placeholder="e.g., 320" value={settings.adsConfig.belowHero.mobileWidth} onChange={(e) => handleAdChange("belowHero", "mobileWidth", e.target.value)} disabled={settings.adsConfig.belowHero.network === 'none'}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ad-mobile-height-below-hero">Mobile Height</Label>
                                <Input id="ad-mobile-height-below-hero" placeholder="e.g., 100" value={settings.adsConfig.belowHero.mobileHeight} onChange={(e) => handleAdChange("belowHero", "mobileHeight", e.target.value)} disabled={settings.adsConfig.belowHero.network === 'none'}/>
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
                            <Select value={settings.adsConfig.aboveFooter.network} onValueChange={(value) => handleAdChange("aboveFooter", "network", value as any)}>
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
                            <Textarea id="ad-code-above-footer" placeholder="Paste your ad code snippet here" rows={6} value={settings.adsConfig.aboveFooter.code} onChange={(e) => handleAdChange("aboveFooter", "code", e.target.value)} disabled={settings.adsConfig.aboveFooter.network === 'none'}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ad-desktop-width-above-footer">Desktop Width</Label>
                                <Input id="ad-desktop-width-above-footer" placeholder="e.g., 728" value={settings.adsConfig.aboveFooter.desktopWidth} onChange={(e) => handleAdChange("aboveFooter", "desktopWidth", e.target.value)} disabled={settings.adsConfig.aboveFooter.network === 'none'}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ad-desktop-height-above-footer">Desktop Height</Label>
                                <Input id="ad-desktop-height-above-footer" placeholder="e.g., 90" value={settings.adsConfig.aboveFooter.desktopHeight} onChange={(e) => handleAdChange("aboveFooter", "desktopHeight", e.target.value)} disabled={settings.adsConfig.aboveFooter.network === 'none'}/>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ad-mobile-width-above-footer">Mobile Width</Label>
                                <Input id="ad-mobile-width-above-footer" placeholder="e.g., 320" value={settings.adsConfig.aboveFooter.mobileWidth} onChange={(e) => handleAdChange("aboveFooter", "mobileWidth", e.target.value)} disabled={settings.adsConfig.aboveFooter.network === 'none'}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ad-mobile-height-above-footer">Mobile Height</Label>
                                <Input id="ad-mobile-height-above-footer" placeholder="e.g., 100" value={settings.adsConfig.aboveFooter.mobileHeight} onChange={(e) => handleAdChange("aboveFooter", "mobileHeight", e.target.value)} disabled={settings.adsConfig.aboveFooter.network === 'none'}/>
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
                    <CardDescription>
                        Configure your SMTP server to send emails. This is required for features like password reset.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="smtpHost">SMTP Host</Label>
                            <Input id="smtpHost" value={settings.smtpConfig.host} onChange={(e) => handleSmtpChange('host', e.target.value)} placeholder="smtp.example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtpPort">SMTP Port</Label>
                            <Input id="smtpPort" type="number" value={settings.smtpConfig.port} onChange={(e) => handleSmtpChange('port', Number(e.target.value))} placeholder="587" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtpUser">Username</Label>
                            <Input id="smtpUser" value={settings.smtpConfig.user} onChange={(e) => handleSmtpChange('user', e.target.value)} placeholder="your-email@example.com" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="smtpPass">Password</Label>                            <Input id="smtpPass" type="password" value={settings.smtpConfig.pass} onChange={(e) => handleSmtpChange('pass', e.target.value)} placeholder="••••••••" />
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="smtpSender">Sender Email (Optional)</Label>
                            <Input id="smtpSender" value={settings.smtpConfig.sender} onChange={(e) => handleSmtpChange('sender', e.target.value)} placeholder="noreply@yourdomain.com (optional)" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
