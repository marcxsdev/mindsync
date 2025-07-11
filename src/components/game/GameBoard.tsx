import Ruler from "@/components/game/Ruler";
import Cards from "./Cards";

const GameBoard = () => {
  return (
    <div className="w-[1126px] h-[715px] bg-[#0F3460] rounded-[40px] px-10">
      <Ruler />
      <Cards />
    </div>
  );
};

export default GameBoard;
