"use client";
import { useState, useEffect } from "react";
import Slider from "./Slider";
import Button from "@/components/ui/Button";
import { cardPairs } from "@/lib/cardsData";

function GameBoard() {
  const [currentCards, setCurrentCards] = useState(null);
  const [showTarget, setShowTarget] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(50);
  const [targetPosition, setTargetPosition] = useState(null);
  const [isHintGiverTurn, setIsHintGiverTurn] = useState(true);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const randomIndex = Math.floor(Math.random() * cardPairs.length);
    setCurrentCards(cardPairs[randomIndex]);
    setTargetPosition(Math.floor(Math.random() * 101)); // Alvo aleatório entre 0 e 100
    setMarkerPosition(50); // Reseta o marcador para o meio
    setIsHintGiverTurn(true); // O jogador que dá a dica começa
    setShowTarget(false); // Esconde o alvo no início
  };

  const handleHintGiverAction = () => {
    setShowTarget(true);
    setIsHintGiverTurn(false);
  };

  const toggleTarget = () => {
    setShowTarget((prev) => !prev);
  };

  return (
    <div className="w-full max-w-4xl rounded-2xl bg-slate-800 p-8 shadow-2xl border border-blue-900 flex flex-col">
      <Slider showTarget={showTarget} />

      <div className="pt-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold uppercase text-center shrink-0 w-48">
          {currentCards ? currentCards.left : "Carregando..."}
        </h1>
        <Button onClick={toggleTarget}>REVELAR!</Button>
        <h1 className="text-2xl font-semibold uppercase text-center shrink-0 w-48">
          {currentCards ? currentCards.right : "Carregando..."}
        </h1>
      </div>
    </div>
  );
}

export default GameBoard;
