'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface CarouselProps {
  items: Array<{ image: string; name: string }>;
  autoPlayInterval?: number; // in milliseconds
  showDots?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({ 
  items, 
  autoPlayInterval = 3000,
  showDots = true 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  }, [items.length]);

  useEffect(() => {
    if (autoPlayInterval > 0) {
      const interval = setInterval(goToNext, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlayInterval, goToNext]);

  if (items.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Carousel Container - No background */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {/* Slides */}
        <div 
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div 
              key={index} 
              className="min-w-full h-full flex items-center justify-center p-2 md:p-8"
            >
              <img
                src={item.image}
                alt={item.name}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: '100%' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Item Name - Text only, above dots (below image) */}
      <div className="mt-4 text-center">
        <p className="text-lg md:text-xl font-medium" style={{ color: 'var(--color-lightgrey)' }}>
          {items[currentIndex].name}
        </p>
      </div>

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2'
                  : 'w-2 h-2 hover:opacity-75'
              }`}
              style={{
                backgroundColor: index === currentIndex ? 'var(--color-gold)' : 'var(--color-lightgrey)'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
