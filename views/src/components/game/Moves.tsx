import { Chess } from "chess.js";
import { useEffect, useRef } from "react";

type Props = {
  moves: { san: string; fen: string; index: number }[];
  fen: string;
  setFen: React.Dispatch<React.SetStateAction<string>>;
  moveIndex: number;
  setMoveIndex: React.Dispatch<React.SetStateAction<number>>;
  removeTempo?: () => void;
  showBar: boolean;
  chess: Chess;
};

const MoveHistory = ({
  moves,
  fen,
  setFen,
  moveIndex,
  setMoveIndex,
  removeTempo,
  showBar,
  chess,
}: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [moves]);

  const handleMoveClick = (move: { fen: string; index: number }) => {
    setFen(move.fen);
    chess.load(move.fen);
    setMoveIndex(move.index);
    if (removeTempo) removeTempo();
  };

  return (
    <div className="flex flex-col h-full">
      {showBar && (
        <div className="flex justify-between p-2 bg-[#2a2a2a] border-b border-[#ffd700] border-opacity-30">
          <div className="grid grid-cols-4 gap-1 w-full">
            <button
              className="game-button p-1.5 md:p-2 hover:bg-[#3a3a3a] flex items-center justify-center"
              onClick={() => handleMoveClick(moves[0])}
              title="First move"
            >
              <svg width="16" height="16" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 6L13.2571 12.1714L22 18.3429V6Z" />
                <path d="M4 12.1714V18.3429H2V6.34286H4V12.1714ZM4 12.1714L12.7429 6V18.3429L4 12.1714Z" />
              </svg>
            </button>
            <button
              className="game-button p-1.5 md:p-2 hover:bg-[#3a3a3a] flex items-center justify-center"
              onClick={() => moveIndex !== 0 && handleMoveClick(moves[moveIndex - 1])}
              disabled={moveIndex === 0}
              title="Previous move"
            >
              <svg width="16" height="16" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4L8.66667 12L20 20V4Z" />
                <path d="M4 20H6.66667V4H4V20Z" />
              </svg>
            </button>
            <button
              className="game-button p-1.5 md:p-2 hover:bg-[#3a3a3a] flex items-center justify-center"
              onClick={() => moveIndex !== moves.length - 1 && handleMoveClick(moves[moveIndex + 1])}
              disabled={moveIndex === moves.length - 1}
              title="Next move"
            >
              <svg width="16" height="16" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 20L15.3333 12L4 4V20Z" />
                <path d="M20 4H17.3333V20H20V4Z" />
              </svg>
            </button>
            <button
              className="game-button p-1.5 md:p-2 hover:bg-[#3a3a3a] flex items-center justify-center"
              onClick={() => handleMoveClick(moves[moves.length - 1])}
              title="Last move"
            >
              <svg width="16" height="16" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 18.3429L10.7429 12.1714L2 6V18.3429Z" />
                <path d="M20 12.1714L11.2571 18.3429V6L20 12.1714ZM20 12.1714V6H22V18H20V12.1714Z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-[#ffd700] scrollbar-track-[#2a2a2a]"
      >
        <div className="grid grid-cols-12 min-h-full bg-[#1a1a1a]">
          {/* Move numbers */}
          <div className="col-span-2 bg-[#2a2a2a] border-r border-[#ffd700] border-opacity-30">
            {Array.from({ length: Math.ceil((moves.length - 1) / 2) }).map((_, i) => (
              <div key={i} className="p-1 sm:p-2 text-center text-gray-400 font-mono text-sm sm:text-base">
                {i + 1}.
              </div>
            ))}
          </div>

          {/* Moves */}
          <div className="col-span-10 grid grid-cols-2">
            {/* White moves */}
            <div className="border-r border-[#ffd700] border-opacity-30">
              {moves.slice(1).map((move, i) => 
                i % 2 === 0 && (
                  <div
                    key={i}
                    onClick={() => handleMoveClick(move)}
                    className={`p-1 sm:p-2 cursor-pointer transition-colors hover:bg-[#3a3a3a] text-sm sm:text-base ${
                      move.fen === fen ? 'bg-[#ffd700] bg-opacity-20 text-[#ffd700]' : 'text-white'
                    }`}
                  >
                    {move.san}
                  </div>
                )
              )}
            </div>

            {/* Black moves */}
            <div>
              {moves.slice(1).map((move, i) => 
                i % 2 === 1 && (
                  <div
                    key={i}
                    onClick={() => handleMoveClick(move)}
                    className={`p-1 sm:p-2 cursor-pointer transition-colors hover:bg-[#3a3a3a] text-sm sm:text-base ${
                      move.fen === fen ? 'bg-[#ffd700] bg-opacity-20 text-[#ffd700]' : 'text-white'
                    }`}
                  >
                    {move.san}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveHistory;
