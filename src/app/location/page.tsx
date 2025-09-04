"use client";
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/Card";
import { hotels, restaurants, places } from "@/data/eventData";

export default function LocationPage() {
  return (
  <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy) 40vh, var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
      <Navbar />
      <div className="container mx-auto px-4 flex-1">
        <section className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center" style={{color: "var(--color-gold)"}}>Location & Directions</h1>
          {/* Map Embed */}
          <div className="mb-8 flex justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.123456789!2d115.188919!3d-8.409518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd240ecb0b0b0b0%3A0x0!2sBali!5e0!3m2!1sen!2sid!4v1690000000000!5m2!1sen!2sid"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Event Location"
            ></iframe>
          </div>
          {/* Hotels */}
    <h2 className="text-xl font-bold mb-4" style={{color: "var(--color-gold)"}}>Nearby Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {hotels.map((hotel: { name: string; link: string }, idx: number) => (
              <Card key={idx} className="flex justify-between items-center">
      <span className="font-semibold" style={{color: "var(--color-gold)"}}>{hotel.name}</span>
                <a href={hotel.link} target="_blank" rel="noopener" className="underline cursor-pointer" style={{color: "var(--color-lightgrey)"}}>Book</a>
              </Card>
            ))}
          </div>
          {/* Restaurants */}
    <h2 className="text-xl font-bold mb-4" style={{color: "var(--color-gold)"}}>Recommended Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {restaurants.map((resto: { name: string; rating: number; link: string }, idx: number) => (
              <Card key={idx} className="flex justify-between items-center">
      <span className="font-semibold" style={{color: "var(--color-gold)"}}>{resto.name}</span>
                <span style={{color: "var(--color-lightgrey)"}}>⭐ {resto.rating}</span>
                <a href={resto.link} target="_blank" rel="noopener" className="underline cursor-pointer" style={{color: "var(--color-lightgrey)"}}>Visit</a>
              </Card>
            ))}
          </div>
          {/* Places in Bali */}
    <h2 className="text-xl font-bold mb-4" style={{color: "var(--color-gold)"}}>Recommended Places in Bali</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {places.map((place: { name: string; photo: string; link: string }, idx: number) => (
              <Card key={idx} className="flex flex-col items-center">
                <img src={place.photo} alt={place.name} className="w-16 h-16 rounded-lg mb-2 object-cover border" style={{borderColor: "var(--color-gold)"}} />
                <a href={place.link} target="_blank" rel="noopener" className="font-semibold underline text-center cursor-pointer" style={{color: "var(--color-gold)"}}>{place.name}</a>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
