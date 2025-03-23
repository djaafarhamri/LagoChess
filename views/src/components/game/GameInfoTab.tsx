import { Chess } from "chess.js";
import { GameType } from "../../types/types";
import Captures from "./Captures";
import MoveHistory from "./Moves";
import Timer from "./Timer";

const pieceValues: { [key: string]: number } = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};

function calculateEvaluation(
  blackCaptures: string[],
  whiteCaptures: string[],
  forPlayer: string
): number {
  // Calculate total value of pieces captured by each side
  const blackScore = blackCaptures.reduce(
    (sum, capture) => sum + pieceValues[capture],
    0
  );

  const whiteScore = whiteCaptures.reduce(
    (sum, capture) => sum + pieceValues[capture],
    0
  );

  if (forPlayer === "white") return whiteScore - blackScore;
  else return blackScore - whiteScore;
}

type Props = {
  game: GameType | undefined;
  chess: Chess;
  orientation: string;
  opTimerTime: number;
  opTimerActive: boolean;
  myTimerTime: number;
  myTimerActive: boolean;
  handleOpTimeUpdate: (time: number) => void;
  handleMyTimeUpdate: (time: number) => void;
  stopTimers: () => void;
  whiteCaptures: string[];
  blackCaptures: string[];
  moves: {
    san: string;
    fen: string;
    index: number;
  }[];
  fen: string;
  setFen: React.Dispatch<React.SetStateAction<string>>;
  moveIndex: number;
  setMoveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const GameInfoTab = ({
  game,
  chess,
  orientation,
  opTimerTime,
  opTimerActive,
  myTimerTime,
  myTimerActive,
  handleOpTimeUpdate,
  whiteCaptures,
  blackCaptures,
  handleMyTimeUpdate,
  stopTimers,
  moves,
  fen,
  setFen,
  moveIndex,
  setMoveIndex,
}: Props) => {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Opponent Section */}
      <div className="game-card-header">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${opTimerActive ? 'bg-[#ffd700]' : 'bg-gray-600'}`} />
            <h3 className="text-lg font-semibold text-[#ffd700] truncate max-w-[120px] sm:max-w-none">
              {orientation === "white" 
                ? (typeof game?.black !== "string" && game?.black.username)
                : (typeof game?.white !== "string" && game?.white.username)}
            </h3>
          </div>
          <Timer
            currentTime={opTimerTime}
            isActive={opTimerActive}
            onTimeEnd={stopTimers}
            onTimeUpdate={handleOpTimeUpdate}
          />
        </div>
        <div className="flex items-center bg-[#2a2a2a] rounded-lg p-2">
          <Captures
            whiteCaptures={whiteCaptures}
            blackCaptures={blackCaptures}
            isWhite={orientation !== "white"}
          />
          {calculateEvaluation(whiteCaptures, blackCaptures, orientation === "white" ? "black" : "white") > 0 && (
            <span className="text-[#ffd700] font-mono ml-2">
              +{calculateEvaluation(whiteCaptures, blackCaptures, orientation === "white" ? "black" : "white")}
            </span>
          )}
        </div>
      </div>

      {/* Move History */}
      <div className="flex-grow overflow-hidden">
        <div className="game-card-content h-[200px] sm:h-[300px] md:h-[400px]">
          <MoveHistory
            chess={chess}
            moves={moves}
            fen={fen}
            setFen={setFen}
            moveIndex={moveIndex}
            setMoveIndex={setMoveIndex}
            showBar={true}
          />
        </div>
      </div>

      {/* Player Section */}
      <div className="game-card-header mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${myTimerActive ? 'bg-[#ffd700]' : 'bg-gray-600'}`} />
            <h3 className="text-lg font-semibold text-[#ffd700] truncate max-w-[120px] sm:max-w-none">
              {orientation === "white"
                ? (typeof game?.white !== "string" && game?.white.username)
                : (typeof game?.black !== "string" && game?.black.username)}
            </h3>
          </div>
          <Timer
            currentTime={myTimerTime}
            isActive={myTimerActive}
            onTimeEnd={stopTimers}
            onTimeUpdate={handleMyTimeUpdate}
          />
        </div>
        <div className="flex items-center bg-[#2a2a2a] rounded-lg p-2">
          <Captures
            whiteCaptures={whiteCaptures}
            blackCaptures={blackCaptures}
            isWhite={orientation === "white"}
          />
          {calculateEvaluation(whiteCaptures, blackCaptures, orientation) > 0 && (
            <span className="text-[#ffd700] font-mono ml-2">
              +{calculateEvaluation(whiteCaptures, blackCaptures, orientation)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameInfoTab;
