import Ruler from "@/components/game/Ruler";
import Cards from "./Cards";

const GameBoard = () => {
  return (
    <div className="w-[1126px] h-[715px] bg-[#0F3460] rounded-[40px] px-10">
      <div className="pt-24">
        <Ruler />
      </div>

      <div className="pt-6">
        <Cards />
      </div>
    </div>
  );
};

export default GameBoard;
