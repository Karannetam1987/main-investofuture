
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import siteConfig from "@/lib/data/site-config.json";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${siteConfig.siteName} Home`}>
      {siteConfig.logoType === 'image' && siteConfig.logoImageUrl ? (
         <Image 
            src={siteConfig.logoImageUrl} 
            alt={`${siteConfig.siteName} logo`} 
            width={siteConfig.logoWidth} 
            height={siteConfig.logoHeight}
            className="object-contain"
          />
      ) : (
        <>
          <TrendingUp className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-primary-foreground font-headline">
            {siteConfig.siteName}
          </span>
        </>
      )}
    </Link>
  );
}

    