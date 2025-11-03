"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RegisterFloatingButton } from "@/components/RegisterFloatingButton";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Carousel } from "@/components/Carousel";
import { speakers, agenda } from "@/data/eventData";
import { getAllMerchandiseImages } from "@/data/merchandiseData";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

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
                    <td className="px-6 py-4 border-b border-gray-600 font-semibold align-top" style={{color: "var(--color-gold)"}}>
                      10:00 - 12:30
                    </td>
                    <td className="px-6 py-4 border-b border-gray-600" style={{color: "var(--color-lightgrey)"}}>
                      <ul className="space-y-1">
                        <li>• Registration & Booth Activity</li>
                        <li>• Coffee Break & Lunch</li>
                      </ul>
                    </td>
                  </tr>
                  <tr style={{backgroundColor: "var(--color-navy-dark)"}}>
                    <td className="px-6 py-4 border-b border-gray-600 font-semibold align-top" style={{color: "var(--color-gold)"}}>
                      12:30 - 17:00
                    </td>
                    <td className="px-6 py-4 border-b border-gray-600" style={{color: "var(--color-lightgrey)"}}>
                      <ul className="space-y-1">
                        <li>• Opening Parade</li>
                        <li>• VIP Speech</li>
                        <li>• Leaders Speech</li>
                        <li>• Recognition</li>
                        <li>• Special Sharing</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Dress Code Section */}
          <section className="max-w-6xl mx-auto py-8 px-4">
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center" style={{color: "var(--color-gold)"}}>Dress Code Participant : Business Formal Navy-Gold</h3>
              <div className="flex justify-center">
                <img
                  src="/dresscode.png"
                  alt="Dress Code"
                  className="rounded-lg backdrop-brightness-80 p-4 object-contain w-[350px] sm:w-[380px] md:w-[450px]"
                />
              </div>
            </div>
          </section>

          {/* Special Guest Section */}
          <section className="max-w-7xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{color: "var(--color-lightgrey)"}}>Special Guest</h2>
            {/* Ben Magalei & Takashi Oda as Special Guests */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {["Ben Magalei", "Takashi Oda"].map((name, idx) => {
                const speaker = speakers.find(s => s.name === name);
                if (!speaker) return null;
                return (
                  <Card key={idx} className="flex flex-col items-center bg-[var(--color-lightgrey)] p-6 rounded-xl w-[400px] sm:w-[380px] md:w-[380px] presidential-executive-card">
                    {/* Photo Container */}
                    <div className="relative w-[280px] h-[280px] mb-4">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={speaker.photo}
                          alt={speaker.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                        {/* Only show pin for Takashi Oda */}
                        {speaker.name === "Takashi Oda" && (
                          <img
                            src="/pins/legacy-presidential.png"
                            alt="Legacy Presidential Pin"
                            className="absolute -bottom-8 -right-4 w-30 h-30 drop-shadow-lg"
                          />
                        )}
                      </div>
                    </div>
                    {/* Speaker Info */}
                    <div className="text-center">
                      <h3
                        className="font-bold text-xl md:text-2xl mb-1"
                        style={{ color: "var(--color-lightgrey)" }}
                      >
                        {speaker.name}
                      </h3>
                      <p className="text-base md:text-lg mb-2" style={{ color: "var(--color-gold)" }}>
                        {speaker.title}
                      </p>
                      {speaker.country && (
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "var(--color-gold)" }}>
                          {speaker.country}
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* GM Section: always show 4 GMs below Special Guests */}
            <div className="flex flex-wrap justify-center gap-6">
              {speakers
                .filter(speaker => speaker.cat === "gm" && speaker.name !== "Ben Magalei")
                .slice(0, 4)
                .map((speaker, idx) => (
                  <Card key={idx} className="flex flex-col items-center bg-[var(--color-lightgrey)] p-6 rounded-xl w-[400px] sm:w-[380px] md:w-[380px] presidential-executive-card">
                    {/* Photo Container */}
                    <div className="relative w-[280px] h-[280px] mb-4">
                      <img
                        src={speaker.photo}
                        alt={speaker.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    </div>
                    {/* Speaker Info */}
                    <div className="text-center">
                      <h3
                        className="font-bold text-xl md:text-2xl mb-1"
                        style={{ color: "var(--color-lightgrey)" }}
                      >
                        {speaker.name}
                      </h3>
                      <p className="text-base md:text-lg mb-2" style={{ color: "var(--color-gold)" }}>
                        {speaker.title}
                      </p>
                      {speaker.country && (
                        <p className="text-lg md:text-xl font-semibold" style={{ color: "var(--color-gold)" }}>
                          {speaker.country}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          </section>

          {/* Merchandise Section */}
          <section className="py-8 md:py-24 relative z-10">
            <div className="container mx-auto px-4">
              <motion.div 
                className="text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--color-lightgrey)" }}>
                  Official Merchandise
                </h2>
                <p className="text-lg md:text-xl" style={{ color: "var(--color-gold)" }}>
                  Get your exclusive Synergy SEA Summit merch!
                </p>
              </motion.div>

              {/* Merchandise Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full md:max-w-4xl md:mx-auto mb-8"
              >
                <Carousel 
                  items={getAllMerchandiseImages()}
                  autoPlayInterval={3000}
                  showDots={true}
                />
              </motion.div>

              {/* View All Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <Link href="/merchandise">
                  <button className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105" style={{ backgroundColor: "var(--color-gold)", color: "var(--color-navy)" }}>
                    View All Merchandise
                  </button>
                </Link>
              </motion.div>
            </div>
          </section>
        </div>

        <RegisterFloatingButton />
        <Footer />
    </>
  );
}