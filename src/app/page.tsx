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
    <>
        <Navbar />
        
        {/* ===== HANDARA GATES (FOR VERSION 1 ONLY) ===== */}
        {/* Fixed Handara Gates with Parallax Effect */}
        <motion.img 
          src="/SVG/HandaraLeft.svg" 
          alt="Handara Gate Left"
          className="handara-gates fixed -left-16 xl:-left-20 bottom-0 w-auto z-0 pointer-events-none"
          style={{
            height: 'calc(100vh - 5rem)',
            transform: `translateX(${-scrollY * 0.3}px)`,
            opacity: Math.max(0, 1 - scrollY / 500)
          }}
        />
        <motion.img 
          src="/SVG/HandaraRight.svg" 
          alt="Handara Gate Right"
          className="handara-gates fixed -right-16 xl:-right-20 bottom-0 w-auto z-0 pointer-events-none"
          style={{
            height: 'calc(100vh - 5rem)',
            transform: `translateX(${scrollY * 0.3}px)`,
            opacity: Math.max(0, 1 - scrollY / 500)
          }}
        />
        
        {/* Hero Section */}
        <section className="relative w-full min-h-[60vh] md:min-h-screen flex flex-col items-center justify-center overflow-visible z-10 pt-20 pb-8 md:pt-24 md:pb-12">
          <div className="relative w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[55%] 2xl:w-[50%] aspect-video overflow-hidden rounded-lg mb-6 md:mb-8 bg-gray-800 flex items-center justify-center">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/teaser_synergy.mp4"
              autoPlay
              loop
              controls
              playsInline
              muted={false}
              style={{transform: 'scale(1)', transformOrigin: 'center'}}
            />
          </div>
          
          <div className="text-center px-4 max-w-4xl relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1 }} 
              className="text-3xl md:text-5xl font-bold mb-4" 
              style={{color: "var(--color-gold)"}}
            >
              Synergy SEA Summit 2025
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1, delay: 0.3 }} 
              className="text-lg md:text-2xl mb-6" 
              style={{color: "var(--color-lightgrey)"}}
            >
              Unleash Your Potential, Live the Synergy Spirit
            </motion.p>
            <a href="/register">
              <Button>Register Now</Button>
            </a>
          </div>
        </section>

        <div className="container mx-auto px-4 flex-1 relative z-10">
          {/* Event Description */}
          <section className="max-w-2xl mx-auto py-8 px-4 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{color: "var(--color-gold)"}}>Event Overview</h2>
            <p className="mb-4 text-lg" style={{color: "var(--color-lightgrey)"}}>
              A full day of empowerment, insights, and Synergy spirit all in Bali. <br />
              Unlock your potential with Southeast Asia's top achievers
            </p>
          </section>

          {/* Agenda Highlight */}
          <section className="max-w-4xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{color: "var(--color-lightgrey)"}}>Event Schedule</h2>
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
            <h2 className="text-2xl font-bold mb-6 text-center" style={{color: "var(--color-lightgrey)"}}>Speakers</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {[...Array(4)].map((_, idx) => (
                <Card key={idx} className="flex flex-col items-center bg-[var(--color-lightgrey)] p-4 rounded-xl w-[320px] sm:w-[280px] md:w-[240px]">
                  <img src="/siluete.png" alt="Special guest" className="w-55 h-auto rounded-lg object-cover mb-3" />
                  <div className="font-bold text-base md:text-lg mb-1 text-center" style={{color: "var(--color-lightgrey)"}}>Special guest</div>
                  <div className="text-sm md:text-base" style={{color: "var(--color-gold)"}}>???</div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <RegisterFloatingButton />
        <Footer />
    </>
  );
}