
"use client"

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import * as React from "react";
import Image from "next/image";
import { useDoc } from "@/firebase";
import type { SiteConfig } from "@/app/admin/settings/page";

export function Logo() {
  const { data: settings } = useDoc<{siteConfig: SiteConfig}>('settings/site');
  const config = settings?.siteConfig;

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
