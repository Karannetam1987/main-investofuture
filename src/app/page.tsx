
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdPlaceholder } from "@/components/ad-placeholder";
import adsData from "@/lib/data/ads.json";
import siteConfig from "@/lib/data/site-config.json";
import statsData from "@/lib/data/stats.json";
import { sendEmail } from "@/ai/flows/send-email-flow";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


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

const contactFormSchema = z.object({
    name: z.string().min(1, "Name is required."),
    from: z.string().email("Please enter a valid email address."),
    subject: z.string().min(1, "Subject is required."),
    message: z.string().min(10, "Message must be at least 10 characters long."),
});


export default function Home() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      from: "",
      subject: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleContactSubmit = async (values: z.infer<typeof contactFormSchema>) => {
      try {
        const result = await sendEmail(values);
        if (result.success) {
            toast({
                title: "Message Sent!",
                description: "Thank you for contacting us. We will get back to you shortly.",
            });
            form.reset();
        } else {
            throw new Error(result.message);
        }
      } catch (error: any) {
        toast({
            title: "Error Sending Message",
            description: error.message || "An unexpected error occurred. Please try again later.",
            variant: "destructive",
        });
      }
  };


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
                            name="from"
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
