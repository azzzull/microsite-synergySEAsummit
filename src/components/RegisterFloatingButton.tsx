"use client";
import React, { useState } from "react";
import Link from "next/link";
import { TicketIcon } from "@heroicons/react/24/outline";

export const RegisterFloatingButton = () => {
  const [hovered, setHovered] = useState(false);

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
          ${hovered ? "w-48 h-16 px-6" : "w-16 h-16"}
        `}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Register Here"
      >
        {!hovered && (
          <TicketIcon className="w-8 h-8" />
        )}
        
        {hovered && (
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
