"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/Card";
import { hotels, baliMustTry } from "@/data/eventData";
import { MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function LocationPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Photos for The Stones Hotel gallery
  const hotelPhotos = [
    { src: "/hotel/thestones1.jpg", alt: "The Stones Hotel - Exterior View" },
    { src: "/hotel/thestones2.jpg", alt: "The Stones Hotel - Pool Area" },
    { src: "/hotel/thestones3.jpg", alt: "The Stones Hotel - Interior" },
  ];

  const openPhotoModal = (photoSrc: string) => {
    setSelectedPhoto(photoSrc);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 flex-1 mt-16 sm:mt-20 md:mt-20">
        <section className="max-w-5xl mx-auto py-8 px-4">
          <h1
            className="text-3xl font-bold mb-4 text-center"
            style={{ color: "var(--color-lightgrey)" }}
          >
            Location & Directions
          </h1>

          {/* Map and Photos Section */}
          <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Map */}
            <div className="lg:col-span-2 h-[30px] sm:h-[420px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.791309749572!2d115.16520537472309!3d-8.71135769133782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd246c1b2997c97%3A0x7e36cd3ef6793772!2sThe%20Stones%20Hotel%20Legian!5e0!3m2!1sid!2sid!4v1757000867033!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Stones Hotel Legian - Event Location"
              ></iframe>
            </div>

            {/* Photos + Caption */}
            <div className="flex flex-col h-full p-6 rounded-xl" style={{backgroundColor: "rgba(7, 13, 45, 0.5)"}}>
              {/* Desktop photo grid */}
              <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-2 flex-grow">
                <div
                  className="row-span-2 relative overflow-hidden rounded-lg cursor-pointer group bg-gray-800"
                  onClick={() => openPhotoModal(hotelPhotos[0].src)}
                >
                  <img
                    src={hotelPhotos[0].src}
                    alt={hotelPhotos[0].alt}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    onError={(e) => (e.currentTarget.src = "/siluete.png")}
                  />
                </div>
                <div
                  className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-800"
                  onClick={() => openPhotoModal(hotelPhotos[1].src)}
                >
                  <img
                    src={hotelPhotos[1].src}
                    alt={hotelPhotos[1].alt}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    onError={(e) => (e.currentTarget.src = "/siluete.png")}
                  />
                </div>
                <div
                  className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-800"
                  onClick={() => openPhotoModal(hotelPhotos[2].src)}
                >
                  <img
                    src={hotelPhotos[2].src}
                    alt={hotelPhotos[2].alt}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    onError={(e) => (e.currentTarget.src = "/siluete.png")}
                  />
                </div>
              </div>

              {/* Mobile photo grid (3 kotak sejajar) */}
              <div className="grid grid-cols-3 gap-2 mt-4 lg:hidden">
                {hotelPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="aspect-square relative overflow-hidden rounded-lg cursor-pointer group bg-gray-800"
                    onClick={() => openPhotoModal(photo.src)}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.src = "/siluete.png")}
                    />
                  </div>
                ))}
              </div>

              {/* Caption + Button */}
              <div className="mt-4 text-start mb-8 lg:mb-0">
                <p
                  className="text-sm mb-3"
                  style={{ color: "var(--color-lightgrey)", lineHeight: "1.5" }}
                >
                  The Stones Hotel, a 5-star Autograph Collection hotel in Legian,
                  Bali, offers elegant rooms and suites with pool and garden
                  views, a large multi-level swimming pool, a 24-hour fitness
                  center, and an on-site spa.
                </p>
                <a
                  href="https://www.thestoneshotellegian.com/"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center w-full px-5 py-2 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity duration-200 cursor-pointer no-underline"
                >
                  Book Now!
                </a>
              </div>
            </div>
          </div>

          {/* Photo Modal */}
          {selectedPhoto && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={closePhotoModal}
            >
              <div className="relative max-w-5xl max-h-full">
                <button
                  onClick={closePhotoModal}
                  className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                >
                  <XMarkIcon className="w-6 h-6 cursor-pointer" />
                </button>
                <img
                  src={selectedPhoto}
                  alt="Hotel Photo"
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Venue Details */}
          <div className="mb-12">
            <Card className="p-6 px-12">
              <h3
                className="text-2xl font-bold mb-4 text-center"
                style={{ color: "var(--color-lightgrey)" }}
              >
                Event Venue Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                {/* Venue Information */}
                <div>
                  <div className="flex items-center mb-3">
                    <MapPinIcon
                      className="w-6 h-6 mr-2"
                      style={{ color: "var(--color-gold)" }}
                    />
                    <h4 className="font-bold" style={{ color: "var(--color-gold)" }}>
                      Venue Information
                    </h4>
                  </div>
                  <p className="mb-1" style={{ color: "var(--color-lightgrey)" }}><strong>Name:</strong> The Stones Hotel Legian</p>
                  <p className="mb-1" style={{ color: "var(--color-lightgrey)" }}><strong>Address:</strong> Jl. Raya Pantai Batu Belig, Legian, Bali 80361</p>
                  <p className="mb-1" style={{ color: "var(--color-lightgrey)" }}><strong>Phone:</strong> +62 361 8478888</p>
                  <p className="mb-1" style={{ color: "var(--color-lightgrey)" }}><strong>Type:</strong> Luxury Beachfront Resort</p>
                </div>

                {/* Transportation */}
                <div>
                  <div className="flex items-center mb-3">
                    <MapPinIcon
                      className="w-6 h-6 mr-2"
                      style={{ color: "var(--color-gold)" }}
                    />
                    <h4 className="font-bold" style={{ color: "var(--color-gold)" }}>
                      Transportation
                    </h4>
                  </div>
                  <p className="mb-1" style={{ color: "var(--color-lightgrey)" }}><strong>From Airport:</strong> 15-20 minutes drive</p>
                  <p className="mb-1" style={{ color: "var(--color-lightgrey)" }}><strong>From Seminyak:</strong> 5-10 minutes drive</p>
                  <p className="mb-1" style={{ color: "var(--color-lightgrey)" }}><strong>From Canggu:</strong> 10-15 minutes drive</p>
                  <p className="mb-1" style={{ color: "var(--color-lightgrey)" }}><strong>Parking:</strong> Available on-site</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-center text-sm" style={{ color: "var(--color-lightgrey)" }}>
                  <strong style={{ color: "var(--color-lightgrey)" }}>Event Date:</strong> November 8, 2025
                </p>
              </div>
            </Card>
          </div>

          {/* Hotels */}
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-gold)" }}>
            Nearby Hotels
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {hotels.map((hotel, idx) => (
              <Card
                key={`hotel-${idx}-${hotel.name}`}
                className="p-0 hover:bg-white/10 transition-colors duration-200 overflow-hidden"
              >
                <img src={hotel.photo} alt={hotel.name} className="w-full h-60 object-cover" />
                <div className="p-6">
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-4">
                    <h3 className="font-semibold text-xl" style={{ color: "var(--color-gold)" }}>
                      {hotel.name}
                    </h3>
                    <div className="flex items-center bg-[var(--color-gold)]/20 px-3 py-1 rounded-full sm:ml-4 w-fit">
                      <MapPinIcon className="w-4 h-4 mr-1" style={{ color: "var(--color-gold)" }} />
                      <span className="text-sm font-medium whitespace-nowrap" style={{ color: "var(--color-gold)" }}>
                        {hotel.distance}
                      </span>
                    </div>
                  </div>
                  <p className="text-base leading-relaxed mb-4" style={{ color: "var(--color-lightgrey)" }}>{hotel.description}</p>
                  <a
                    href={hotel.bookingLink}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center justify-center w-full px-5 py-2 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity duration-200 cursor-pointer no-underline"
                  >
                    Book Now
                  </a>
                </div>
              </Card>
            ))}
          </div>

          {/* Bali Must Try */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--color-gold)" }}>
              Bali Must Try
            </h2>
            <p className="text-center text-sm mb-6" style={{ color: "var(--color-lightgrey)" }}>Bali is filled with unforgettable experiences you simply can’t miss. From iconic landmarks and hidden gems, to flavorful local dishes and breathtaking natural wonders, the island offers something special for every traveler. Here are some of the must-try destinations, flavors, and activities that will make your Bali journey truly memorable.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {baliMustTry.map((category, idx) => (
                <Card
                  key={idx}
                  className="p-6 hover:bg-white/10 transition-colors duration-200"
                >
                  {/* Single Image - Outside of dropdown */}
                  {category.images && (
                    <div className="mb-4">
                      <img
                        src={category.images[0].src}
                        alt={category.images[0].alt}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Category Title */}
                  <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--color-gold)" }}>
                    {category.category}
                  </h3>
                  
                  {/* Category Description - Outside of dropdown */}
                  {category.description && (
                    <p className="mb-4 text-sm" style={{ color: "var(--color-lightgrey)" }}>
                      {category.description}
                    </p>
                  )}

                  <details className="group cursor-pointer">
                    <summary className="flex items-center justify-between font-semibold text-lg mb-2 cursor-pointer" style={{ color: "var(--color-gold)" }}>
                      <span>Show List</span>
                      <svg className="w-5 h-5 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </summary>
                    <div className="mt-4">
                      {/* Items List */}
                      <div className="space-y-4">
                        {category.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="p-3 rounded bg-white/5">
                            <h4 className="font-medium mb-1" style={{ color: "var(--color-gold)" }}>
                              {item.name}
                            </h4>
                            {'description' in item && item.description && (
                              <p className="text-sm mb-2" style={{ color: "var(--color-lightgrey)" }}>
                                {item.description}
                              </p>
                            )}
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener"
                              className="flex items-center justify-center w-full px-4 py-2 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-lg text-sm font-semibold transition-opacity duration-200 no-underline hover:opacity-90"
                            >
                              Visit Website
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
