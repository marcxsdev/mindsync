import Slider from "@/components/game/Slider";
import React from "react";

export default function GamePage() {
  return (
    <div className="flex flex-col text-white items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl text-white font-bold mb-8">MindSync Game</h1>
      {/* Aqui entrará a lógica e os componentes do jogo */}
      <p>Tela do jogo em construção...</p>

      <Slider />
    </div>
  );
}
