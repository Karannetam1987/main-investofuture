
"use client";

import {
  ArrowRight,
  BrainCircuit,
  FileLock,
  FileText,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Send,
  LoaderCircle,
  Users,
  Banknote,
  Percent
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import { HeroSlider } from "@/components/hero-slider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdPlaceholder } from "@/components/ad-placeholder";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";

// This would typically come from a context or a data fetching hook.
// For now, it's a mock that we can "update".
const settingsStore = {
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


const iconMap: { [key: string]: React.ReactNode } = {
  BrainCircuit: <BrainCircuit size={48} className="text-secondary" />,
  ShieldCheck: <ShieldCheck size={48} className="text-secondary" />,
  UserCheck: <UserCheck size={48} className="text-secondary" />,
  TrendingUp: <TrendingUp size={48} className="text-secondary" />,
  FileLock: <FileLock size={40} className="text-secondary" />,
  FileText: <FileText size={40} className="text-secondary" />,
  AlertTriangle: <AlertTriangle size={40} className="text-secondary" />,
};

const contactFormSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Please enter a valid email address."),
    subject: z.string().min(1, "Subject is required."),
    message: z.string().min(10, "Message must be at least 10 characters long."),
});


export default function Home() {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState(settingsStore);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate fetching settings
    setTimeout(() => {
        setSettings(settingsStore);
        setIsLoading(false);
    }, 500);
  }, []);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;
  
  const handleContactSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    if (!settings?.smtpConfig?.host) {
       toast({
            title: "Contact Form Disabled",
            description: "The mail server has not been configured by the administrator.",
            variant: "destructive",
      });
      return;
    }
     // In a real app you'd use a serverless function to send email
     // This is a placeholder as client-side email sending is not secure.
     console.log("Contact form submitted:", values);
      toast({
            title: "Message Sent (Simulated)",
            description: "In a real application, this would send an email.",
      });
      form.reset();
  };


  if (isLoading || !settings) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  const { heroSlides, adsConfig, siteConfig, statsData, siteFeatures } = settings;

  const scrollTo = (id:string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <section id="home">
          <HeroSlider slides={heroSlides} />
        </section>
        
        {adsConfig.belowHero.network !== 'none' && (
            <section id="ad-below-hero" className="py-8">
                <div className="container flex justify-center">
                    <AdPlaceholder adSlot={adsConfig.belowHero} />
                </div>
            </section>
        )}


        <section id="cta" className="py-16 md:py-24">
          <div className="container text-center">
            <h1 className="font-headline text-5xl font-bold tracking-tight text-secondary md:text-6xl lg:text-7xl">
              Secure Your Financial Future with {siteConfig.siteName}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground">
              Innovative investment solutions designed for your growth. We provide the tools and expertise to help you navigate the financial markets with confidence.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary" onClick={() => scrollTo('about')}>
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="bg-white dark:bg-card py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-4xl font-bold text-secondary md:text-5xl">
                Features for Your Financial Success
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Discover the powerful tools and features that make {siteConfig.siteName} the right choice for your financial journey.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {siteFeatures.features.map((feature) => (
                <Card key={feature.title} className="transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader className="items-center text-center">
                    {iconMap[feature.icon as keyof typeof iconMap] || <BrainCircuit size={48} className="text-secondary" />}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="stats" className="py-16 md:py-24 bg-secondary text-secondary-foreground">
            <div className="container">
                 <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-headline text-4xl font-bold md:text-5xl">
                        Our Success in Numbers
                    </h2>
                    <p className="mt-4 text-xl text-secondary-foreground/80">
                        We are proud of our achievements and the trust our clients place in us.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 text-center md:grid-cols-3">
                    <div className="flex flex-col items-center">
                        <Banknote className="h-16 w-16 text-primary"/>
                        <p className="mt-4 text-5xl font-bold">{statsData.totalInvestment}</p>
                        <p className="mt-2 text-lg text-secondary-foreground/80">Total Investment</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Users className="h-16 w-16 text-primary"/>
                        <p className="mt-4 text-5xl font-bold">{statsData.activeUsers}</p>
                        <p className="mt-2 text-lg text-secondary-foreground/80">Active Users</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <Percent className="h-16 w-16 text-primary"/>
                        <p className="mt-4 text-5xl font-bold">{statsData.guaranteedReturns}</p>
                        <p className="mt-2 text-lg text-secondary-foreground/80">Guaranteed Returns</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="about" className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-4xl font-bold text-secondary md:text-5xl">
                {siteConfig.aboutUs.title}
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                {siteConfig.aboutUs.description}
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {siteFeatures.aboutLinks.map((link) => (
                <Card id={link.id} key={link.title} className="transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader className="items-center text-center">
                    {iconMap[link.icon as keyof typeof iconMap] || <FileText size={40} className="text-secondary" />}
                    <CardTitle className="mt-4">{link.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

         <section id="contact" className="bg-white dark:bg-card py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-4xl font-bold text-secondary md:text-5xl">
                Contact Us
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Have questions? We'd love to hear from you.
              </p>
            </div>
            <Card className="max-w-2xl mx-auto mt-12">
             <Form {...form}>
              <form onSubmit={form.handleSubmit(handleContactSubmit)}>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>We will get back to you as soon as possible.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your.email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                     </div>
                     <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                    <Input placeholder="Question about my account" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Type your message here..." rows={5} {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </CardFooter>
              </form>
             </Form>
            </Card>
          </div>
        </section>
        
      </main>
      <AppFooter />
    </div>
  );
}
