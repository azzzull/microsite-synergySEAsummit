'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getAllMerchandiseImages } from '@/data/merchandiseData';

export default function MerchandisePage() {
  const allImages = getAllMerchandiseImages();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--color-navy)] pt-30 pb-16">
        {/* Header */}
        <div className="text-center mb-8 px-4">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-gold)' }}
          >
            Official Merchandise
          </h1>
          <p className="text-white text-lg max-w-2xl mx-auto">
            Get your exclusive Synergy SEA Summit 2025 merchandise
          </p>
        </div>

        {/* Masonry/Collage Grid - Full Width */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-3 px-2 md:px-4 space-y-2 md:space-y-3">
          {allImages.map((item, index) => (
            <div
              key={index}
              className="relative group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] break-inside-avoid mb-2 md:mb-3"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-auto object-cover rounded-lg"
              />

              {/* Overlay with Product Name - On Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end rounded-lg">
                <div className="p-4 w-full">
                  <h3 className="text-white font-bold text-sm md:text-base lg:text-lg">
                    {item.name}
                  </h3>
                </div>
              </div>

              {/* Always visible subtle overlay - Mobile only */}
              <div className="md:hidden absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-[2px] p-3 rounded-b-lg">
                <p className="text-white text-xs font-medium line-clamp-1">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Available Badge */}
        <div className="text-center mt-12 px-4">
          <div className="inline-block bg-blue-900/30 backdrop-blur-sm border border-blue-500/30 text-blue-200 px-6 py-3 rounded-lg text-sm md:text-base font-medium">
            ✨ Available at Event
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center px-4">
          <p className="text-gray-400 mb-4">
            For inquiries about merchandise availability and orders
          </p>
          <a 
            href="mailto:synergyindonesiasales@gmail.com"
            className="inline-block bg-[var(--color-gold)] hover:bg-yellow-600 text-[var(--color-navy)] font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
