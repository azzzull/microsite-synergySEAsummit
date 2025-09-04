"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RegisterFloatingButton } from "@/components/RegisterFloatingButton";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { speakers, agenda } from "@/data/eventData";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
  <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy), var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
      <Navbar />
      
      {/* Hero Section - Full Width */}
      <section className="relative w-full h-[450px] md:h-[calc(100vh-5rem)] flex flex-col items-center justify-start overflow-hidden mt-16 sm:mt-20 md:mt-20 pt-4 md:pt-8">
        {/* Video Container */}
        <div className="relative w-[90%] md:w-[70%] max-w-3xl aspect-video overflow-hidden -mt-4 rounded-lg mb-6 md:mb-8">
          <iframe 
            className="absolute inset-0 w-full h-full opacity-60"
            style={{transform: 'scale(1)', transformOrigin: 'center'}}
            src="https://www.youtube.com/embed/BFS9n4B_2xA?autoplay=1&mute=1&loop=1&playlist=BFS9n4B_2xA&controls=0&modestbranding=1&rel=0"
            title="Synergy SEA Summit 2025 Teaser"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Handara Gates with Parallax Effect - Desktop Only */}
        <motion.img 
          src="/SVG/HandaraLeft.svg" 
          alt="Handara Gate Left"
          className="hidden md:block absolute -left-16 md:-left-19 top-0 h-full w-auto z-5 pointer-events-none"
          style={{
            transform: `translateX(${-scrollY * 0.5}px)`,
            opacity: Math.max(0, 1 - scrollY / 300)
          }}
        />
        <motion.img 
          src="/SVG/HandaraRight.svg" 
          alt="Handara Gate Right"
          className="hidden md:block absolute -right-16 md:-right-19 top-0 h-full w-auto z-5 pointer-events-none"
          style={{
            transform: `translateX(${scrollY * 0.5}px)`,
            opacity: Math.max(0, 1 - scrollY / 300)
          }}
        />
        
        {/* Hero Text - Below Video for Both Mobile and Desktop */}
        <div className="text-center px-4 max-w-4xl -mt-4">
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-3xl md:text-5xl font-bold mb-4" style={{color: "var(--color-gold)"}}>
            Synergy SEA Summit 2025
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-lg md:text-2xl mb-6" style={{color: "var(--color-lightgrey)"}}>
            Where Innovation Meets Culture in Bali
          </motion.p>
          <Button>Register Now</Button>
        </div>
      </section>

      {/* Mobile Hero Text - Below Video */}
      <div className="hidden">
      </div>

  <div className="container mx-auto px-4 flex-1">
        {/* Event Description */}
        <section className="max-w-2xl mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{color: "var(--color-gold)"}}>Event Overview</h2>
          <p className="mb-4" style={{color: "var(--color-lightgrey)"}}>Synergy SEA Summit 2025 brings together Southeast Asia's brightest minds in tech, innovation, and culture for three days of inspiration, networking, and celebration in Bali.</p>
        </section>
        {/* Agenda Highlight */}
        <section className="max-w-3xl mx-auto py-8 px-4">
          <h2 className="text-xl font-bold mb-4" style={{color: "var(--color-lightgrey)"}}>Agenda Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agenda.map((item: { date: string; topic: string }, idx: number) => (
              <Card key={idx} className="text-center">
                <div className="text-lg font-semibold" style={{color: "var(--color-gold)"}}>{item.date}</div>
                <div style={{color: "var(--color-lightgrey)"}}>{item.topic}</div>
              </Card>
            ))}
          </div>
        </section>
        {/* Speakers Section */}
        <section className="max-w-5xl mx-auto py-8 px-4">
          <h2 className="text-xl font-bold mb-4" style={{color: "var(--color-lightgrey)"}}>Speakers</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[...Array(4)].map((_, idx) => (
               <Card key={idx} className="flex flex-col items-center bg-[var(--color-lightgrey)] p-4 rounded-xl">
                 <img src="/siluete.png" alt="Special guest" className="w-55 h-auto rounded-lg object-cover mb-3" />
                 <div className="font-bold text-base md:text-lg mb-1" style={{color: "var(--color-lightgrey)"}}>Special guest</div>
                 <div className="text-sm md:text-base" style={{color: "var(--color-gold)"}}>???</div>
               </Card>
             ))}
           </div>
        </section>
      </div>
  <RegisterFloatingButton />
  <Footer />
    </div>
  );
}
