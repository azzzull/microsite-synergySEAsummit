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
      
      {/* ===== HANDARA GATES (FOR VERSION 1 ONLY) ===== */}
      {/* Fixed Handara Gates with Parallax Effect */}
      <motion.img 
        src="/SVG/HandaraLeft.svg" 
        alt="Handara Gate Left"
        className="hidden md:block fixed -left-16 md:-left-20 bottom-0 w-auto z-0 pointer-events-none"
        style={{
          height: 'calc(100vh - 5rem)',
          transform: `translateX(${-scrollY * 0.3}px)`,
          opacity: Math.max(0, 1 - scrollY / 500)
        }}
      />
      <motion.img 
        src="/SVG/HandaraRight.svg" 
        alt="Handara Gate Right"
        className="hidden md:block fixed -right-16 md:-right-20 bottom-0 w-auto z-0 pointer-events-none"
        style={{
          height: 'calc(100vh - 5rem)',
          transform: `translateX(${scrollY * 0.3}px)`,
          opacity: Math.max(0, 1 - scrollY / 500)
        }}
      />
      
      {/* ===== VERSION 1: HERO SECTION WITH GATES ===== */}
      
      <section className="relative w-full h-[450px] md:h-[calc(100vh-5rem)] flex flex-col items-center justify-start overflow-visible mt-16 sm:mt-20 md:mt-20 pt-4 md:pt-8 z-10">
        <div className="relative w-[90%] md:w-[70%] max-w-2xl aspect-video overflow-hidden mt-2 rounded-lg mb-6 md:mb-8">
          <iframe 
            className="absolute inset-0 w-full h-full opacity-60"
            style={{transform: 'scale(1)', transformOrigin: 'center'}}
            src="https://www.youtube.com/embed/BFS9n4B_2xA?autoplay=1&mute=1&loop=1&playlist=BFS9n4B_2xA&controls=1&modestbranding=1&rel=0&fs=1"
            title="Synergy SEA Summit 2025 Teaser"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="text-center px-4 max-w-4xl -mt-4 relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-3xl md:text-5xl font-bold mb-4" style={{color: "var(--color-gold)"}}>
            Synergy SEA Summit 2025
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-lg md:text-2xl mb-6" style={{color: "var(--color-lightgrey)"}}>
            Where Innovation Meets Culture in Bali
          </motion.p>
          <Button>Register Now</Button>
        </div>
      </section>
      
      {/* ===== VERSION 2: HERO SECTION SIDE-BY-SIDE LAYOUT (COMMENTED) ===== */}
      {/*
      <section className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden mt-16 sm:mt-20 md:mt-20 py-8 md:py-16">

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-center">
            
            <div className="order-2 lg:order-1 lg:col-span-4 text-center lg:text-left">
              <motion.h1 
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1 }} 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" 
                style={{color: "var(--color-gold)"}}
              >
                Synergy SEA Summit 2025
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1, delay: 0.3 }} 
                className="text-xl md:text-2xl mb-8 leading-relaxed" 
                style={{color: "var(--color-lightgrey)"}}
              >
                Where Innovation Meets Culture in Bali
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1, delay: 0.6 }}
              >
                <Button>Register Here</Button>
              </motion.div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6">
              <motion.div 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1, delay: 0.4 }}
                className="relative w-full aspect-video overflow-hidden rounded-xl shadow-2xl"
              >
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/BFS9n4B_2xA?autoplay=1&mute=1&loop=1&playlist=BFS9n4B_2xA&controls=0&modestbranding=1&rel=0"
                  title="Synergy SEA Summit 2025 Teaser"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
      */}

      {/* Mobile Hero Text - Below Video */}
      <div className="hidden">
      </div>

  <div className="container mx-auto px-4 flex-1 relative z-10">
        {/* Event Description */}
        <section className="max-w-2xl mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{color: "var(--color-gold)"}}>Event Overview</h2>
          <p className="mb-4" style={{color: "var(--color-lightgrey)"}}>Synergy SEA Summit 2025 brings together Southeast Asia's brightest minds in tech, innovation, and culture for three days of inspiration, networking, and celebration in Bali.</p>
        </section>
        {/* Agenda Highlight */}
        <section className="max-w-4xl mx-auto py-8 px-4">
          <h2 className="text-xl font-bold mb-6 text-center" style={{color: "var(--color-lightgrey)"}}>Event Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr style={{backgroundColor: "var(--color-gold)"}}>
                  <th className="px-6 py-4 text-left font-bold text-lg" style={{color: "var(--color-navy)"}}>
                    Time (WITA)
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-lg" style={{color: "var(--color-navy)"}}>
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{backgroundColor: "var(--color-navy)"}}>
                  <td className="px-6 py-4 border-b border-gray-600 font-semibold" style={{color: "var(--color-gold)"}}>
                    11:00 - 12:30
                  </td>
                  <td className="px-6 py-4 border-b border-gray-600" style={{color: "var(--color-lightgrey)"}}>
                    Registration & Booth Activity + Coffee Break + Lunch
                  </td>
                </tr>
                <tr style={{backgroundColor: "var(--color-navy-dark)"}}>
                  <td className="px-6 py-4 border-b border-gray-600 font-semibold align-top" style={{color: "var(--color-gold)"}}>
                    12:30 - 17:00
                  </td>
                  <td className="px-6 py-4 border-b border-gray-600" style={{color: "var(--color-lightgrey)"}}>
                    <ul className="space-y-1">
                      <li>• Opening</li>
                      <li>• VIP Speech 1</li>
                      <li>• VIP Speech 2</li>
                      <li>• Worldwide Leaders Speech 1</li>
                      <li>• NSP Update</li>
                      <li>• Recognition</li>
                      <li>• Special Sharing</li>
                      <li>• Worldwide Leaders Speech 2</li>
                      <li>• Closing Performance</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
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
