"use client";
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/Card";
import { hotels, restaurants, places } from "@/data/eventData";
import { MapPinIcon } from "@heroicons/react/24/outline";

export default function LocationPage() {
  return (
  <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(to bottom, var(--color-navy-dark) 0%, var(--color-navy) 40vh, var(--color-navy) 100%)", color: "var(--color-lightgrey)"}}>
      <Navbar />
      <div className="container mx-auto px-4 flex-1 mt-16 sm:mt-20 md:mt-20">
        <section className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center" style={{color: "var(--color-lightgrey)"}}>Location & Directions</h1>
          {/* Map Embed */}
          <div className="mb-8 flex justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.791309749572!2d115.16520537472309!3d-8.71135769133782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd246c1b2997c97%3A0x7e36cd3ef6793772!2sThe%20Stones%20Hotel%20Legian!5e0!3m2!1sid!2sid!4v1757000867033!5m2!1sid!2sid"
              width="100%"
              height="500"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Stones Hotel Legian - Event Location"
            ></iframe>
          </div>

          {/* Venue Details */}
          <div className="mb-8">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-center" style={{color: "var(--color-lightgrey)"}}>Event Venue Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-3">
                    <MapPinIcon className="w-6 h-6 mr-2" style={{color: "var(--color-gold)"}} />
                    <h4 className="font-bold" style={{color: "var(--color-gold)"}}>Venue Information</h4>
                  </div>
                  <p className="mb-1" style={{color: "var(--color-lightgrey)"}}><strong>Name:</strong> The Stones Hotel Legian</p>
                  <p className="mb-1" style={{color: "var(--color-lightgrey)"}}><strong>Address:</strong> Jl. Raya Pantai Batu Belig, Legian, Bali 80361</p>
                  <p className="mb-1" style={{color: "var(--color-lightgrey)"}}><strong>Phone:</strong> +62 361 8478888</p>
                  <p className="mb-1" style={{color: "var(--color-lightgrey)"}}><strong>Type:</strong> Luxury Beachfront Resort</p>
                </div>
                <div>
                  <div className="flex items-center mb-3">
                    <MapPinIcon className="w-6 h-6 mr-2" style={{color: "var(--color-gold)"}} />
                    <h4 className="font-bold" style={{color: "var(--color-gold)"}}>Transportation</h4>
                  </div>
                  <p className="mb-1" style={{color: "var(--color-lightgrey)"}}><strong>From Airport:</strong> 15-20 minutes drive</p>
                  <p className="mb-1" style={{color: "var(--color-lightgrey)"}}><strong>From Seminyak:</strong> 5-10 minutes drive</p>
                  <p className="mb-1" style={{color: "var(--color-lightgrey)"}}><strong>From Canggu:</strong> 10-15 minutes drive</p>
                  <p className="mb-1" style={{color: "var(--color-lightgrey)"}}><strong>Parking:</strong> Available on-site</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-center text-sm" style={{color: "var(--color-lightgrey)"}}>
                  <strong>Event Date:</strong> November 8, 2025 | <strong>Time:</strong> 12:30 - 17:00 WITA
                </p>
              </div>
            </Card>
          </div>
          {/* Hotels */}
          <h2 className="text-2xl font-bold mb-6" style={{color: "var(--color-gold)"}}>Nearby Hotels</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {hotels.map((hotel: { name: string; description: string; photo: string; distance: string }, idx: number) => (
              <Card key={`hotel-${idx}-${hotel.name}`} className="p-0 hover:bg-white/10 transition-colors duration-200 overflow-hidden">
                <img 
                  src={hotel.photo} 
                  alt={hotel.name} 
                  className="w-full h-60 object-cover" 
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-xl" style={{color: "var(--color-gold)"}}>{hotel.name}</h3>
                    <div className="flex items-center bg-[var(--color-gold)]/20 px-3 py-1 rounded-full ml-4">
                      <MapPinIcon className="w-4 h-4 mr-1" style={{color: "var(--color-gold)"}} />
                      <span className="text-sm font-medium whitespace-nowrap" style={{color: "var(--color-gold)"}}>{hotel.distance}</span>
                    </div>
                  </div>
                  <p className="text-base leading-relaxed" style={{color: "var(--color-lightgrey)", lineHeight: "1.6"}}>
                    {hotel.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          {/* Restaurants */}
          <h2 className="text-2xl font-bold mb-6" style={{color: "var(--color-gold)"}}>Recommended Restaurants</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {restaurants.map((resto: { name: string; rating: number; description: string; link: string }, idx: number) => (
              <Card key={`resto-${idx}-${resto.name}`} className="p-6 hover:bg-white/10 transition-colors duration-200 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-xl" style={{color: "var(--color-gold)"}}>{resto.name}</h3>
                  <div className="flex flex-col items-end ml-4">
                    <div className="flex items-center bg-[var(--color-gold)]/20 px-3 py-1 rounded-full mb-1">
                      <span className="text-lg mr-1">⭐</span>
                      <span className="text-sm font-medium whitespace-nowrap" style={{color: "var(--color-gold)"}}>{resto.rating}</span>
                    </div>
                    <span className="text-xs opacity-70" style={{color: "var(--color-lightgrey)"}}>(by tripadvisor.co.id)</span>
                  </div>
                </div>
                <p className="text-base leading-relaxed mb-5 flex-grow" style={{color: "var(--color-lightgrey)", lineHeight: "1.6"}}>
                  {resto.description}
                </p>
                <a 
                  href={resto.link} 
                  target="_blank" 
                  rel="noopener" 
                  className="inline-flex items-center px-4 py-2 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity duration-200 cursor-pointer mt-auto w-fit"
                >
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  Visit Restaurant
                </a>
              </Card>
            ))}
          </div>
          {/* Places in Bali */}
          <h2 className="text-2xl font-bold mb-6" style={{color: "var(--color-gold)"}}>Recommended Places in Bali</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {places.map((place: { name: string; photo: string; link: string }, idx: number) => (
              <Card key={idx} className="p-4 hover:bg-white/10 transition-colors duration-200 text-center">
                <img 
                  src={place.photo} 
                  alt={place.name} 
                  className="w-full h-80 rounded-lg mb-3 mx-auto object-cover border-2 border-[var(--color-gold)]/30" 
                />
                <a 
                  href={place.link} 
                  target="_blank" 
                  rel="noopener" 
                  className="font-medium text-sm hover:underline cursor-pointer transition-colors duration-200" 
                  style={{color: "var(--color-gold)"}}
                >
                  {place.name}
                </a>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
