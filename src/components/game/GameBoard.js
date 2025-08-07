"use client";
import { useState, useEffect } from "react";
import Slider from "./Slider";
import Button from "../ui/Button";
import { cardPairs } from "@/lib/cardsData";

function GameBoard() {
  const [currentCards, setCurrentCards] = useState(null);
  const [showTarget, setShowTarget] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(50);
  const [targetPosition, setTargetPosition] = useState(null);
  const [gamePhase, setGamePhase] = useState("hintGiverView");
  const [score, setScore] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(1000); // Valor inicial, será atualizado pelo Slider

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const randomIndex = Math.floor(Math.random() * cardPairs.length);
    setCurrentCards(cardPairs[randomIndex]);
    setTargetPosition(Math.floor(Math.random() * 101));
    setMarkerPosition(50);
    setShowTarget(false);
    setGamePhase("hintGiverView");
  };

  const calculateScore = () => {
    const targetWidthPx = 154; // Largura fixa do alvo em pixels
    const zoneWidthPx = targetWidthPx / 3; // Cada zona tem ~51.33px

    // Converter a largura do alvo e das zonas para porcentagem
    const targetWidthPercent = (targetWidthPx / sliderWidth) * 100; // Largura do alvo em % do slider
    const zoneWidthPercent = targetWidthPercent / 3; // Cada zona em %

    // Calcular os limites das zonas em porcentagem
    const leftZoneStart = targetPosition - targetWidthPercent / 2;
    const leftZoneEnd = leftZoneStart + zoneWidthPercent;
    const centerZoneEnd = leftZoneEnd + zoneWidthPercent;
    const rightZoneEnd = centerZoneEnd + zoneWidthPercent;

    // Verificar em qual zona o marcador está
    if (markerPosition >= leftZoneStart && markerPosition < leftZoneEnd) {
      return 2; // Zona esquerda
    } else if (
      markerPosition >= leftZoneEnd &&
      markerPosition < centerZoneEnd
    ) {
      return 3; // Zona central
    } else if (
      markerPosition >= centerZoneEnd &&
      markerPosition <= rightZoneEnd
    ) {
      return 2; // Zona direita
    } else {
      return 0; // Fora do alvo
    }
  };

  const handleButtonClick = () => {
    if (gamePhase === "hintGiverView") {
      setShowTarget(true);
      setGamePhase("hintGiverHide");
    } else if (gamePhase === "hintGiverHide") {
      setShowTarget(false);
      setGamePhase("guesserTurn");
    } else if (gamePhase === "guesserTurn") {
      setShowTarget(true);
      const points = calculateScore();
      setScore((prev) => prev + points);
      setGamePhase("revealResult");
    } else if (gamePhase === "revealResult") {
      startNewRound();
    }
  };

  const getButtonText = () => {
    switch (gamePhase) {
      case "hintGiverView":
        return "Revelar!";
      case "hintGiverHide":
        return "Esconder";
      case "guesserTurn":
        return "Confirmar";
      case "revealResult":
        return "Finalizar!";
      default:
        return "Revelar!";
    }
  };

  return (
    <div className="w-full max-w-4xl rounded-2xl bg-slate-800 p-8 shadow-2xl border border-blue-900 flex flex-col">
      <div className="bg-[#0f3460] w-40 rounded-xl py-4 px-5 text-center border border-blue-900 mb-5 mx-auto">
        <p className="m-0 text-4xl font-bold">{score}</p>
      </div>
      <Slider
        value={markerPosition}
        onChange={(e) => setMarkerPosition(parseInt(e.target.value))}
        showTarget={showTarget}
        targetPosition={targetPosition}
        disabled={gamePhase !== "guesserTurn"}
        onWidthChange={setSliderWidth} // Passa a largura do slider
      />
      <div className="pt-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold uppercase text-center shrink-0 w-48">
          {currentCards ? currentCards.left : "Carregando..."}
        </h1>
        <Button onClick={handleButtonClick}>{getButtonText()}</Button>
        <h1 className="text-2xl font-semibold uppercase text-center shrink-0 w-48">
          {currentCards ? currentCards.right : "Carregando..."}
        </h1>
      </div>
    </div>
  );
}

export default GameBoard;
