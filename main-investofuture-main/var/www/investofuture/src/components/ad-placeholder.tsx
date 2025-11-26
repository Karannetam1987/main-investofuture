
"use client";

import { useEffect, useState } from "react";

type AdSlot = {
  network: "none" | "adsense" | "adsterra";
  code: string;
  desktopWidth: string;
  desktopHeight: string;
  mobileWidth: string;
  mobileHeight: string;
};

interface AdPlaceholderProps {
    adSlot: AdSlot;
}

export function AdPlaceholder({ adSlot }: AdPlaceholderProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (adSlot.network === "none" || !adSlot.code) {
    return null;
  }

  const width = isMobile ? adSlot.mobileWidth : adSlot.desktopWidth;
  const height = isMobile ? adSlot.mobileHeight : adSlot.desktopHeight;

  return (
    <div
      className="ad-container"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed hsl(var(--border))',
        backgroundColor: 'hsl(var(--muted))',
        color: 'hsl(var(--muted-foreground))',
        fontSize: '0.875rem'
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: adSlot.code }} />
      {/* Fallback text in case the ad script fails to load or is blocked */}
      <span className="sr-only">Advertisement placeholder</span>
    </div>
  );
}
