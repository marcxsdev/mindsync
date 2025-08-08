import React from "react";

const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#e94560] text-white border-0 rounded-xl px-8 py-6 text-2xl font-bold uppercase cursor-pointer transition-all duration-300 ease-in-out shadow-lg hover:transform hover:scale-105"
    >
      {children}
    </button>
  );
};

export default Button;
