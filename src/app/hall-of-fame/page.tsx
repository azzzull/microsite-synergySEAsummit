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
      <div className="container mx-auto px-4 flex-1">
        <section className="max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold mb-6 text-center" style={{color: "var(--color-gold)"}}>Hall of Fame</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {hallOfFame.map((person: { name: string; category: string; photo: string }, idx: number) => (
              <Card key={idx} className="flex flex-col items-center">
                <img src={person.photo} alt={person.name} className="w-20 h-20 rounded-full mb-2 border-2 object-cover" style={{borderColor: "var(--color-gold)"}} />
                <div className="font-bold" style={{color: "var(--color-gold)"}}>{person.name}</div>
                <div className="text-sm" style={{color: "var(--color-lightgrey)"}}>{person.category}</div>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
