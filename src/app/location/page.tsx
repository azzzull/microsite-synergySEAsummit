"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/Card";
import { hotels, restaurants, places } from "@/data/eventData";
import { MapPinIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

// Component terpisah untuk setiap hotel card
function HotelCard({ hotel, index }: { hotel: { name: string; description: string; photo: string; distance: string }, index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  };

  return (
    <Card className="overflow-hidden w-full md:flex-1 md:min-w-[300px] md:max-w-[calc(50%-0.5rem)] transition-all duration-300 ease-in-out">
      <div 
        className="p-4 cursor-pointer select-none transition-colors duration-200"
        onClick={handleClick}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className="flex justify-between items-center pointer-events-none">
          <span className="font-semibold" style={{color: "var(--color-gold)"}}>{hotel.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{color: "var(--color-lightgrey)"}}>{hotel.distance}</span>
            <div className="transition-transform duration-300 ease-in-out" style={{transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}}>
              <ChevronDownIcon className="w-5 h-5" style={{color: "var(--color-lightgrey)"}} />
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 border-t border-gray-600">
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <img 
              src={hotel.photo} 
              alt={hotel.name} 
              className="w-full md:w-32 h-24 object-cover rounded-lg transition-all duration-300"
            />
            <div className="flex-1">
              <p className="text-sm leading-relaxed transition-all duration-300" style={{color: "var(--color-lightgrey)"}}>
                {hotel.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

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
    <h2 className="text-xl font-bold mb-4" style={{color: "var(--color-gold)"}}>Nearby Hotels</h2>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mb-8 md:items-start">
            {hotels.map((hotel: { name: string; description: string; photo: string; distance: string }, idx: number) => (
              <HotelCard key={`hotel-${idx}-${hotel.name}`} hotel={hotel} index={idx} />
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
