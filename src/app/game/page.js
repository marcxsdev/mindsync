import GameBoard from "@/components/game/GameBoard";

export default function GamePage() {
  return (
    <div className="flex flex-col text-white items-center justify-center min-h-screen p-4">
      <GameBoard />
    </div>
  );
}
