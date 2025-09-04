"use client";
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/Card";
import { hallOfFame } from "@/data/eventData";

export default function HallOfFamePage() {
  return (
  <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy) 40vh, var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
      <Navbar />
      <div className="container mx-auto px-4 flex-1 mt-16 sm:mt-20 md:mt-20">
        <section className="max-w-5xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center" style={{color: "var(--color-lightgrey)"}}>Hall of Fame</h1>
          <div className="flex flex-wrap justify-center gap-6">
            {hallOfFame.map((person: { name: string; category: string; photo: string }, idx: number) => (
              <Card key={idx} className="flex flex-col items-center bg-[var(--color-lightgrey)] p-4 rounded-xl w-[320px] sm:w-[280px] md:w-[240px]">
                <img src={person.photo} alt={person.name} className="w-55 h-auto rounded-lg object-cover mb-3" />
                <div className="font-bold text-center md:text-lg mb-1" style={{color: "var(--color-lightgrey)"}}>{person.name}</div>
                <div className="text-sm md:text-base" style={{color: "var(--color-gold)"}}>{person.category}</div>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
