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
                  {membersByLevel[level].map((member) => (
                    <Card
                      key={member.id}
                      className="flex flex-col items-center bg-[var(--color-lightgrey)] p-4 rounded-xl w-[320px] sm:w-[280px] md:w-[280px]"
                    >
                      {/* Photo Container with Pin Level Badge */}
                      <div className="relative w-[200px] h-[200px] mb-3">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                        {/* Pin Level Badge */}
                        <div
                          className="absolute -bottom-8 -right-5 w-20 h-20 flex items-center justify-center"
                        >
                          <img
                            src={member.pinImage}
                            alt={`${member.pinLevel} Pin`}
                            className="w-full h-full object-contain drop-shadow-lg"
                          />
                        </div>
                        {/* Recognition Badge */}
                        {member.recognition && (
                          <div
                            className="absolute bottom-1 -left-2 px-3 py-1 rounded-lg text-sm font-medium inline-block"
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
                        <p className="text-sm text-gray-400 mb-1">ID: {member.id}</p>
                        <h3
                          className="font-bold text-base md:text-lg mb-1"
                          style={{ color: "var(--color-lightgrey)" }}
                        >
                          {member.name}
                        </h3>
                        <p className="text-sm md:text-base mb-2" style={{ color: "var(--color-gold)" }}>
                          {member.country}
                        </p>
                      </div>
                    </Card>
                  ))}
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
