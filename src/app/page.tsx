

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
} from "lucide-react";
import Link from "next/link";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdPlaceholder } from "@/components/ad-placeholder";
import adsData from "@/lib/data/ads.json";
import siteConfig from "@/lib/data/site-config.json";

const features = [
  {
    icon: <BrainCircuit size={48} className="text-secondary" />,
    title: "Smart Investing",
    description: "Utilize our AI-powered tools for intelligent investment decisions and portfolio management.",
  },
  {
    icon: <ShieldCheck size={48} className="text-secondary" />,
    title: "Secure Platform",
    description: "Your data and investments are protected with top-tier, multi-layered security protocols.",
  },
  {
    icon: <UserCheck size={48} className="text-secondary" />,
    title: "Personalized Advice",
    description: "Receive financial advice and strategies tailored specifically to your goals and risk tolerance.",
  },
  {
    icon: <TrendingUp size={48} className="text-secondary" />,
    title: "Guaranteed Returns",
    description: "Explore investment options with assured returns, providing stability and peace of mind.",
  },
];

const aboutLinks = [
  {
    id: "privacy",
    icon: <FileLock size={40} className="text-secondary" />,
    title: "Privacy Policy",
    description: "Understand how we collect, use, and protect your personal and financial information.",
  },
  {
    id: "terms",
    icon: <FileText size={40} className="text-secondary" />,
    title: "Terms of Service",
    description: "Read the terms and conditions that govern your use of the InvestoFuture platform.",
  },
  {
    id: "disclaimer",
    icon: <AlertTriangle size={40} className="text-secondary" />,
    title: "Disclaimers",
    description: "Important information about the risks involved in investing and our limitations of liability.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <section id="home">
          <HeroSlider />
        </section>
        
        {adsData.belowHero.network !== 'none' && (
            <section id="ad-below-hero" className="py-8">
                <div className="container flex justify-center">
                    <AdPlaceholder adSlot={adsData.belowHero} />
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
              <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary">
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
              {features.map((feature) => (
                <Card key={feature.title} className="transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader className="items-center text-center">
                    {feature.icon}
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
              {aboutLinks.map((link) => (
                <Card id={link.id} key={link.title} className="transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader className="items-center text-center">
                    {link.icon}
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
                Have questions? We&apos;d love to hear from you.
              </p>
            </div>
            <Card className="max-w-2xl mx-auto mt-12">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>We will get back to you as soon as possible.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contact-name">Name</Label>
                        <Input id="contact-name" placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input id="contact-email" type="email" placeholder="your.email@example.com" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Input id="contact-subject" placeholder="Question about my account" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea id="contact-message" placeholder="Type your message here..." rows={5}/>
                 </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                    Send Message <Send className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        
      </main>
      <AppFooter />
    </div>
  );
}
