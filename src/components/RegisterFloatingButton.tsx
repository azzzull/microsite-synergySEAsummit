"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TicketIcon } from "@heroicons/react/24/outline";

export const RegisterFloatingButton = () => {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1100); // Custom 1100px breakpoint like hamburger menu
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHovered(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <Link
        href="/register"
        className={`
          navbar-link
          flex items-center justify-center
          bg-[var(--color-gold)] text-[var(--color-navy)]
          shadow-lg rounded-full transition-all duration-300
          active:scale-90 hover:scale-105
          ${hovered && !isMobile ? "w-48 h-16 px-6" : "w-16 h-16"}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Register Here"
      >
        {/* Mobile Layout - Always show icon with small text below */}
        {isMobile && (
          <div className="flex flex-col items-center justify-center">
            <TicketIcon className="w-6 h-6" />
            <span className="text-xs font-medium mt-1 leading-none">
              Register
            </span>
          </div>
        )}
        
        {/* Desktop Layout - Expand on hover */}
        {!isMobile && !hovered && (
          <TicketIcon className="w-8 h-8" />
        )}
        
        {!isMobile && hovered && (
          <>
            <TicketIcon className="w-6 h-6 mr-2" />
            <span className="font-bold text-base whitespace-nowrap">
              Register Here
            </span>
          </>
        )}
      </Link>
    </div>
  );
};
