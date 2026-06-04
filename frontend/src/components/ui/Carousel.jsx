import React, { useState, useEffect } from 'react';

export default function Carousel({ images = [], autoPlay = true, interval = 5000, className = '' }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const goTo = (index) => setCurrent(index);

  if (images.length === 0) {
    return (
      <div className={`relative w-full bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-400">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Images */}
      <div className="relative h-full">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {typeof img === 'string' ? (
              <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
            ) : (
              <img src={img.src} alt={img.alt || `Slide ${idx + 1}`} className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10"
            aria-label="Précédent"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10"
            aria-label="Suivant"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === current ? 'bg-white w-8' : 'bg-white/50'}`}
              aria-label={`Aller à la slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
