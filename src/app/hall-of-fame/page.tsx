"use client";
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/Card";
import { hallOfFame } from "@/data/eventData";
import { HallOfFameMember, PinLevel, pinLevelOrder } from "@/types/HallOfFame";

export default function HallOfFamePage() {
  // Group members by pin level
  const membersByLevel = pinLevelOrder.reduce((acc, level) => {
    acc[level] = hallOfFame.filter(member => member.pinLevel === level);
    return acc;
  }, {} as Record<PinLevel, HallOfFameMember[]>);

  return (
    <>
      <style jsx global>{`
        .presidential-executive-card {
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.25),
            0 0 20px rgba(255, 193, 7, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.2);
        }
        
        .presidential-executive-card:hover {
          box-shadow: 
            0 8px 30px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(255, 193, 7, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
      `}</style>
      <Navbar />
      <div className="container mx-auto px-4 flex-1 mt-16 sm:mt-20 md:mt-20">
        <section className="max-w-7xl mx-auto py-8 px-4">
          <h1
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: "var(--color-lightgrey)" }}
          >
            Hall of Fame
          </h1>

          {/* Pin Level Categories */}
          {pinLevelOrder.map((level) => (
            membersByLevel[level].length > 0 && (
              <div key={level} className="mb-12">
                <h2
                  className="text-2xl font-bold mb-6 text-center"
                  style={{ color: "var(--color-gold)" }}
                >
                  {level}
                </h2>
                <div className="flex flex-wrap justify-center gap-6">
                  {membersByLevel[level].map((member) => {
                    // Special styling for Presidential Executive level
                    const isPresidentialExecutive = member.pinLevel === "Presidential Executive";
                    const cardWidth = isPresidentialExecutive ? "w-[400px] sm:w-[380px] md:w-[380px]" : "w-[320px] sm:w-[280px] md:w-[280px]";
                    const photoSize = isPresidentialExecutive ? "w-[280px] h-[280px]" : "w-[200px] h-[200px]";
                    const pinBadgeSize = isPresidentialExecutive ? "w-24 h-24" : "w-20 h-20";
                    const pinBadgePosition = isPresidentialExecutive ? "-bottom-8 -right-5" : "-bottom-8 -right-5";
                    
                    // Check if photo is a pin image (for members without personal photos)
                    const isUsingPinAsPhoto = member.photo.startsWith('/pins/') || member.photo.includes('/pins/');
                    
                    return (
                      <Card
                        key={member.id}
                        className={`flex flex-col items-center bg-[var(--color-lightgrey)] p-6 rounded-xl ${cardWidth} ${isPresidentialExecutive ? 'presidential-executive-card' : ''}`}
                      >
                        {/* Photo Container with Pin Level Badge */}
                        <div className={`relative ${photoSize} mb-4`}>
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full rounded-lg object-cover"
                          />
                          {/* Pin Level Badge - Only show if not using pin as main photo */}
                          {!isUsingPinAsPhoto && (
                            <div
                              className={`absolute ${pinBadgePosition} ${pinBadgeSize} flex items-center justify-center`}
                            >
                              <img
                                src={member.pinImage}
                                alt={`${member.pinLevel} Pin`}
                                className="w-full h-full object-contain drop-shadow-lg"
                              />
                            </div>
                          )}
                          {/* Recognition Badge */}
                          {member.recognition && (
                            <div
                              className={`absolute bottom-1 -left-2 px-3 py-1 rounded-lg text-sm font-medium inline-block ${isPresidentialExecutive ? 'text-base px-4 py-2' : ''}`}
                              style={{
                                background: "var(--color-gold)",
                                color: "var(--color-navy)",
                              }}
                            >
                              {member.recognition}
                            </div>
                          )}
                        </div>
                        
                        {/* Member Info */}
                        <div className="text-center">
                          <h3
                            className={`font-bold mb-1 ${isPresidentialExecutive ? 'text-lg md:text-xl' : 'text-base md:text-lg'} whitespace-pre-line`}
                            style={{ color: "var(--color-lightgrey)" }}
                          >
                            {member.name}
                          </h3>
                          <p className={`mb-2 ${isPresidentialExecutive ? 'text-lg md:text-xl font-semibold' : 'text-sm md:text-base'}`} style={{ color: "var(--color-gold)" }}>
                            {member.country}
                          </p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </section>
      </div>
      <Footer />
    </>
  );
}
