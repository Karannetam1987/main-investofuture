import {
  ArrowRight,
  BrainCircuit,
  FileLock,
  FileText,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  AlertTriangle,
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
} from "@/components/ui/card";

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

        <section id="cta" className="py-16 md:py-24">
          <div className="container text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
              Secure Your Financial Future with InvestoFuture
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
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
              <h2 className="font-headline text-3xl font-bold text-secondary md:text-4xl">
                Features for Your Financial Success
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover the powerful tools and features that make InvestoFuture the right choice for your financial journey.
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
              <h2 className="font-headline text-3xl font-bold text-secondary md:text-4xl">
                About InvestoFuture
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We are dedicated to empowering individuals to achieve financial independence through smart and secure investing.
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
      </main>
      <AppFooter />
    </div>
  );
}
