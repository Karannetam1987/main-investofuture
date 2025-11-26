
"use client"

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Logo } from "./logo";
import { AdPlaceholder } from "./ad-placeholder";
import * as React from "react";

const socialIcons: { [key: string]: React.ReactNode } = {
  Facebook: <Facebook className="h-6 w-6" />,
  Instagram: <Instagram className="h-6 w-6" />,
  Twitter: <Twitter className="h-6 w-6" />,
  Telegram: (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15.91L20.2 17.05c-.21.51-.78.65-1.28.41l-4.49-3.3-2.15 2.07c-.24.24-.45.46-.8.46l.32-4.42z" />
    </svg>
  ),
  WhatsApp: (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M16.75 13.96c.25.5.12 1.04-.12 1.41-.25.36-.63.62-1.12.72-.42.08-.9.1-1.42-.05-1.17-.33-2.22-1-3.12-1.93s-1.6-2-1.9-3.13c-.2-.73-.05-1.4.35-1.96.2-.28.45-.48.73-.6.3-.12.63-.1.93.04.3.14.5.38.6.7l.34 1.18c.1.34.02.73-.22 1.04l-.4.5c-.25.3-.25.75.05 1.1s.6.55 1.05.5c.45-.04.85-.3 1.1-.5l.5-.4c.3-.24.7-.3 1.05-.2zM12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
};

const settingsStore = {
  adsConfig: {
    aboveFooter: { network: "none" as const, code: "", desktopWidth: "728", desktopHeight: "90", mobileWidth: "320", mobileHeight: "100" }
  },
  siteConfig: {
    siteName: "InvestoFuture",
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
  }
}

export function AppFooter() {
  const [settings, setSettings] = React.useState(settingsStore);
  const [loading, setLoading] = React.useState(true);

  const scrollTo = (id:string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  React.useEffect(() => {
    // Simulate fetching settings
    setTimeout(() => {
        setSettings(settingsStore);
        setLoading(false);
    }, 500);
  }, []);

  const adSlot = settings?.adsConfig?.aboveFooter;
  const siteConfig = settings?.siteConfig;

  if (loading || !siteConfig) {
    return null; // Or a loading skeleton
  }

  return (
    <>
      {adSlot && adSlot.network !== 'none' && (
        <section id="ad-above-footer" className="py-8 bg-background">
            <div className="container flex justify-center">
                <AdPlaceholder adSlot={adSlot} />
            </div>
        </section>
      )}
      <footer className="bg-secondary text-secondary-foreground border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <Logo />
              <p className="mt-4 text-sm text-secondary-foreground/80">© {new Date().getFullYear()} {siteConfig.siteName}. All rights reserved.</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-foreground">About Us</h3>
              <nav className="mt-4 flex flex-col gap-2 text-sm text-secondary-foreground/80">
                <button onClick={() => scrollTo('privacy')} className="hover:text-secondary-foreground transition-colors text-left">Privacy Policy</button>
                <button onClick={() => scrollTo('terms')} className="hover:text-secondary-foreground transition-colors text-left">Terms of Service</button>
                <button onClick={() => scrollTo('disclaimer')} className="hover:text-secondary-foreground transition-colors text-left">Disclaimer</button>
              </nav>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-foreground">Contact Us</h3>
              <div className="mt-4 flex flex-col gap-2 text-sm text-secondary-foreground/80">
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-secondary-foreground transition-colors">{siteConfig.contact.email}</a>
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-secondary-foreground transition-colors">{siteConfig.contact.phone}</a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-secondary-foreground">Follow Us</h3>
              <div className="mt-4 flex gap-4 text-secondary-foreground/80">
                {siteConfig.socialLinks.map((social) => (
                  <a key={social.name} href={social.url} className="hover:text-secondary-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                    {socialIcons[social.name] || null}
                    <span className="sr-only">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
