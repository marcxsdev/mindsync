import { useRef, useEffect } from "react";

const Slider = ({
  value,
  onChange,
  showTarget,
  targetPosition,
  disabled,
  onWidthChange,
}) => {
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current && onWidthChange) {
      onWidthChange(sliderRef.current.offsetWidth);
    }
  }, [onWidthChange]);

  return (
    <main>
      <div ref={sliderRef} className="relative h-40 rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 
            bg-gradient-to-r from-red-500 via-purple-700 to-blue-700 
            transition-opacity duration-500 ease-in-out"
        ></div>

        {showTarget && targetPosition !== null && (
          <div
            className="absolute h-full bg-[#ffff00d9] border-l-4 border-r-4 border-white flex items-center"
            style={{
              left: `${targetPosition}%`,
              transform: "translateX(-50%)",
              width: "154px",
            }}
          >
            <div className="text-black font-bold text-2xl px-4.5 flex-1 text-center">
              2
            </div>
            <div className="text-black font-bold text-3xl px-4.5 border-l-1 border-r-1 border-white h-full flex items-center flex-1 text-center">
              3
            </div>
            <div className="text-black font-bold text-2xl px-4.5 flex-1 text-center">
              2
            </div>
          </div>
        )}

        <div
          className="absolute top-[-10px] bottom-[-10px] w-1 
                       bg-white rounded-sm shadow-lg shadow-white/70 
                       pointer-events-none z-20"
          style={{
            left: `${value}%`,
            transform: "translateX(-50%)",
          }}
        ></div>

        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={onChange}
          disabled={disabled}
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
  );
};

export default Slider;
