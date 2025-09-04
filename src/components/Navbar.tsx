import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';


export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-[var(--color-navy)] shadow-lg"
          : "bg-transparent shadow-lg"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center py-4 sm:py-4 min-h-[56px] sm:min-h-[72px]">
        <Link href="/" aria-label="Home" className="navbar-link font-bold text-lg sm:text-xl tracking-wide text-[var(--color-lightgrey)] hover:text-[var(--color-gold)] flex items-center gap-3 transition-colors duration-200">
          <img 
            src="/synergyseasummitlogo.png" 
            alt="Synergy SEA Summit Logo" 
            className="h-10 sm:h-12 w-auto"
          />
          Synergy SEA Summit 2025
        </Link>
        {/* Hamburger Icon */}
        <button
          className="sm:hidden flex items-center px-3 py-2 border rounded text-[var(--color-lightgrey)] border-[var(--color-lightgrey)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6 text-[var(--color-lightgrey)]" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-[var(--color-lightgrey)]" />
          )}
        </button>
        {/* Menu Links */}
        <div className={`flex-col sm:flex-row gap-4 sm:gap-10 absolute sm:static top-full left-0 w-full sm:w-auto bg-[var(--color-navy)] sm:bg-transparent shadow-lg sm:shadow-none sm:flex flex ${menuOpen ? "flex" : "hidden"} sm:flex items-center sm:items-center justify-center sm:justify-end mt-2 sm:mt-0`}>
          <Link href="/" className="navbar-link transition-colors duration-200 cursor-pointer text-[var(--color-lightgrey)] hover:text-[var(--color-gold)] py-2 sm:py-0 px-4 sm:px-0">Home</Link>
          <Link href="/hall-of-fame" className="navbar-link transition-colors duration-200 cursor-pointer text-[var(--color-lightgrey)] hover:text-[var(--color-gold)] py-2 sm:py-0 px-4 sm:px-0">Hall of Fame</Link>
          <Link href="/location" className="navbar-link transition-colors duration-200 cursor-pointer text-[var(--color-lightgrey)] hover:text-[var(--color-gold)] py-2 sm:py-0 px-4 sm:px-0">Location</Link>
          <Link href="/register" className="navbar-link transition-colors duration-200 cursor-pointer text-[var(--color-lightgrey)] hover:text-[var(--color-gold)] py-2 sm:py-0 px-4 sm:px-0">Register</Link>
        </div>
      </div>
    </nav>
  );
};
