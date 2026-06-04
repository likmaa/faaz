import React from 'react';

export default function BackgroundImage() {
  return (
    <div className="fixed inset-0 z-0 w-full h-full">
      <img
        src="/assets/img/caroussel.jpg"
        alt="Background"
        className="object-cover w-full h-full"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      />
    </div>
  );
}
