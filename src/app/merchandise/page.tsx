'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Carousel } from '@/components/Carousel';
import { merchandiseItems } from '@/data/merchandiseData';

export default function MerchandisePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--color-navy)] pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: 'var(--color-lightgrey)' }}
            >
              Official Merchandise
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get your exclusive Synergy SEA Summit 2025 merchandise
            </p>
          </div>

          {/* Merchandise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {merchandiseItems.map((item) => (
              <div 
                key={item.id}
                className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
                style={{ backgroundColor: 'rgba(18, 32, 47, 0.3)' }}
              >
                {/* Image Carousel for this item */}
                <div className="relative">
                  <Carousel
                    items={item.images.map(img => ({ image: img, name: item.name }))}
                    autoPlayInterval={item.images.length > 1 ? 3000 : 0}
                    showDots={item.images.length > 1}
                  />
                </div>

                {/* Item Details */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-lightgrey)' }}>
                    {item.name}
                  </h3>
                  
                  {item.description && (
                    <p className="text-gray-300 mb-4">
                      {item.description}
                    </p>
                  )}

                  {item.price && (
                    <p className="text-[var(--color-gold)] text-xl font-bold mb-4">
                      {item.price}
                    </p>
                  )}

                  {/* Coming Soon Badge */}
                  <div className="inline-block bg-blue-900/50 text-blue-200 px-4 py-2 rounded-lg text-sm font-medium">
                    Available at Event
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center max-w-2xl mx-auto">
            <div className="bg-[var(--color-lightgrey)] rounded-xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Interested in Our Merchandise?
              </h3>
              <p className="text-gray-600 mb-6">
                For inquiries about merchandise availability and orders, please contact us:
              </p>
              <a 
                href="mailto:synergyindonesiasales@gmail.com"
                className="inline-block bg-[var(--color-gold)] hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
