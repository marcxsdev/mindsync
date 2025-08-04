"use client";
import React, { useState, useRef } from "react";

const Slider = () => {
  const [markerPosition, setMarkerPosition] = useState(50); // Posição inicial do marcador
  const sliderRef = useRef(null); // Ref para o container do slider

  const handleSliderChange = (event) => {
    setMarkerPosition(event.target.value);
  };

  return (
    <div className="w-full max-w-4xl rounded-2xl bg-slate-800 p-8 shadow-2xl border border-blue-900">
      <main>
        <div
          ref={sliderRef}
          className="relative h-40 rounded-xl overflow-hidden"
        >
          <div
            className="absolute inset-0 
            bg-gradient-to-r from-red-500 via-purple-700 to-blue-700 
            transition-opacity duration-500 ease-in-out"
          ></div>

          <div
            className="absolute top-[-10px] bottom-[-10px] w-1 
                       bg-white rounded-sm shadow-lg shadow-white/70 
                       pointer-events-none z-20"
            style={{
              left: `${markerPosition}%`,
              transform: "translateX(-50%)",
            }}
          ></div>

          <input
            type="range"
            min="0"
            max="100"
            value={markerPosition}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full 
                       appearance-none bg-transparent cursor-pointer z-30
                       [&::-webkit-slider-thumb]:appearance-none 
                       [&::-webkit-slider-thumb]:w-2 
                       [&::-webkit-slider-thumb]:h-full 
                       [&::-webkit-slider-thumb]:bg-transparent
                       [&::-moz-range-thumb]:w-2 
                       [&::-moz-range-thumb]:h-full 
                       [&::-moz-range-thumb]:bg-transparent 
                       [&::-moz-range-thumb]:border-none"
            id="guessSlider"
          />
        </div>
      </main>
    </div>
  );
};

export default Slider;
