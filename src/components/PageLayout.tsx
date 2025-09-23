"use client";

import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative" style={{
      color: "var(--color-lightgrey)"
    }}>
      {/* Static background image container */}
      <div 
        className="fixed inset-0 w-full h-full z-0" 
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(14, 19, 54, 0.9), rgba(33, 40, 93, 0.8), rgba(14, 19, 54, 0.9)), url('/background.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          pointerEvents: "none"
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}