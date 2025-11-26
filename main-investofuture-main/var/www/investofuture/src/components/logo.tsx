
"use client"

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import * as React from "react";
import Image from "next/image";

const settingsStore = {
  siteConfig: {
    siteName: "InvestoFuture",
    logoType: "text" as "text" | "image",
    logoImageUrl: "",
    logoWidth: 120,
    logoHeight: 40,
  }
};

export function Logo() {
  const [config, setConfig] = React.useState(settingsStore.siteConfig);
  
  React.useEffect(() => {
    // Simulate fetching settings
    setConfig(settingsStore.siteConfig);
  }, []);

  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${config?.siteName || 'InvestoFuture'} Home`}>
      {config?.logoType === 'image' && config?.logoImageUrl ? (
         <Image 
            src={config.logoImageUrl} 
            alt={`${config.siteName || 'InvestoFuture'} logo`} 
            width={config.logoWidth || 120} 
            height={config.logoHeight || 40}
            className="object-contain"
          />
      ) : (
        <>
          <TrendingUp className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-primary-foreground font-headline">
            {config?.siteName || "InvestoFuture"}
          </span>
        </>
      )}
    </Link>
  );
}
