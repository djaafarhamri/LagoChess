import { useState } from "react";
import { GameType } from "../../types/types";

type Props = {
  game: GameType | undefined;
  handleResign: () => void;
  handleDraw: () => void;
  handleDeclineDraw: () => void;
  handleAcceptDraw: () => void;
  offeredDraw: boolean;
};

function UnderTheBoard({
  game,
  handleResign,
  handleDraw,
  handleDeclineDraw,
  handleAcceptDraw,
  offeredDraw
}: Props) {
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  if (!game) return null;

  return (
    <div className="flex flex-col space-y-4">
      {/* Game Status */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-[#2a2a2a] rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-[#ffd700] text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
            {game.white?.username}
          </span>
          <span className="text-gray-400">vs</span>
          <span className="text-[#ffd700] text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
            {game.black?.username}
          </span>
        </div>
        <div className="text-gray-400 text-sm sm:text-base">
          {game.status === "finished" ? "Game Over" : game.status}
        </div>
      </div>

      {/* Game Controls */}
      {game.status !== "finished" && (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {/* Resign Button */}
          <div className="relative">
            <button
              className="game-button bg-[#d9534f] hover:bg-[#c9302c] text-white text-sm sm:text-base px-3 sm:px-4 py-2"
              onClick={() => setShowConfirm("resign")}
            >
              Resign
            </button>
            {showConfirm === "resign" && (
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-[#2a2a2a] rounded-lg p-4 shadow-lg border border-[#ffd700] w-48 z-50">
                <p className="text-center text-[#ffd700] mb-3 text-sm">Are you sure?</p>
                <div className="flex justify-center space-x-3">
                  <button
                    className="game-button bg-[#5cb85c] hover:bg-[#4cae4c] px-3 py-1 text-sm"
                    onClick={() => {
                      handleResign();
                      setShowConfirm(null);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="game-button bg-[#6c757d] hover:bg-[#5a6268] px-3 py-1 text-sm"
                    onClick={() => setShowConfirm(null)}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Draw Button */}
          <div className="relative">
            <button
              className="game-button bg-[#5bc0de] hover:bg-[#31b0d5] text-white text-sm sm:text-base px-3 sm:px-4 py-2"
              onClick={() => setShowConfirm("draw")}
            >
              Draw
            </button>
            {showConfirm === "draw" && (
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-[#2a2a2a] rounded-lg p-4 shadow-lg border border-[#ffd700] w-48 z-50">
                <p className="text-center text-[#ffd700] mb-3 text-sm">Offer a draw?</p>
                <div className="flex justify-center space-x-3">
                  <button
                    className="game-button bg-[#5cb85c] hover:bg-[#4cae4c] px-3 py-1 text-sm"
                    onClick={() => {
                      handleDraw();
                      setShowConfirm(null);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="game-button bg-[#6c757d] hover:bg-[#5a6268] px-3 py-1 text-sm"
                    onClick={() => setShowConfirm(null)}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Draw Offer Popup */}
      {offeredDraw && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2a2a2a] rounded-lg p-4 sm:p-6 shadow-lg border border-[#ffd700] w-[280px] sm:w-[320px] z-50">
          <p className="text-center text-[#ffd700] text-base sm:text-lg mb-4">Draw Offered</p>
          <div className="flex justify-center space-x-4">
            <button
              className="game-button bg-[#5cb85c] hover:bg-[#4cae4c] text-sm sm:text-base px-3 sm:px-4 py-2"
              onClick={handleAcceptDraw}
            >
              Accept
            </button>
            <button
              className="game-button bg-[#d9534f] hover:bg-[#c9302c] text-sm sm:text-base px-3 sm:px-4 py-2"
              onClick={handleDeclineDraw}
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnderTheBoard;
