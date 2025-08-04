"use client";
import React from "react";
import Slider from "./Slider";
import Button from "@/components/ui/Button";

function GameBoard() {
  return (
    <div className="w-full max-w-4xl rounded-2xl bg-slate-800 p-8 shadow-2xl border border-blue-900 flex flex-col">
      <Slider />

      <div className="pt-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold uppercase text-center shrink-0 w-28">
          Melhor quente
        </h1>
        <Button onClick={() => console.log("teste")}>REVELAR!</Button>
        <h1 className="text-2xl font-semibold uppercase text-center shrink-0 w-28">
          Melhor frio
        </h1>
      </div>
    </div>
  );
}

export default GameBoard;
