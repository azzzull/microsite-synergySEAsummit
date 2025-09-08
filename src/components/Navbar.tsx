import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from "framer-motion";


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
        <motion.button
          className="sm:hidden flex items-center px-3 py-2 border rounded text-[var(--color-lightgrey)] border-[var(--color-lightgrey)] hover:border-[var(--color-gold)] transition-colors duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div
            animate={{ 
              rotate: menuOpen ? 90 : 0,
              scale: menuOpen ? 1.1 : 1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-[var(--color-lightgrey)]" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-[var(--color-lightgrey)]" />
            )}
          </motion.div>
        </motion.button>
        
        {/* Menu Links */}
        <div className="hidden sm:flex flex-row gap-10 items-center justify-end">
          <Link href="/" className="navbar-link transition-colors duration-200 cursor-pointer text-[var(--color-lightgrey)] hover:text-[var(--color-gold)]">Home</Link>
          <Link href="/hall-of-fame" className="navbar-link transition-colors duration-200 cursor-pointer text-[var(--color-lightgrey)] hover:text-[var(--color-gold)]">Hall of Fame</Link>
          <Link href="/location" className="navbar-link transition-colors duration-200 cursor-pointer text-[var(--color-lightgrey)] hover:text-[var(--color-gold)]">Location</Link>
          <Link href="/check-payment" className="navbar-link transition-colors duration-200 cursor-pointer text-[var(--color-lightgrey)] hover:text-[var(--color-gold)]">Cek Payment</Link>
          <Link href="/register" className="navbar-link transition-colors duration-200 cursor-pointer text-[var(--color-lightgrey)] hover:text-[var(--color-gold)]">Register</Link>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence mode="wait">
          {menuOpen && (
            <motion.div 
              className="flex flex-col gap-2 absolute top-full left-0 w-full bg-[var(--color-navy)] backdrop-blur-md shadow-xl sm:hidden items-center justify-center py-6 rounded-b-lg"
              initial={{ 
                opacity: 0, 
                y: -30, 
                scale: 0.95,
                filter: "blur(10px)"
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                filter: "blur(0px)"
              }}
              exit={{ 
                opacity: 0, 
                y: -30, 
                scale: 0.95,
                filter: "blur(10px)"
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                staggerChildren: 0.1,
                delayChildren: 0.1
              }}
            >
              {[
                { href: "/", label: "Home" },
                { href: "/hall-of-fame", label: "Hall of Fame" },
                { href: "/location", label: "Location" },
                { href: "/check-payment", label: "Cek Payment" },
                { href: "/register", label: "Register" }
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ 
                    opacity: 0, 
                    x: -50,
                    rotateY: -90
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    rotateY: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: 50,
                    rotateY: 90
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    delay: index * 0.1
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    x: 10,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={item.href} 
                    className="navbar-link transition-all duration-300 cursor-pointer text-[var(--color-lightgrey)] hover:text-[var(--color-gold)] py-3 px-6 rounded-lg hover:bg-[var(--color-gold)]/10 border border-transparent hover:border-[var(--color-gold)]/30 w-48 text-center block" 
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
