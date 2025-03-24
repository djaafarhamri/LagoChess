import { Chess } from "chess.js";
import { PuzzleType } from "../../pages/Puzzles";
import MoveHistory from "../game/MoveHistory";
import { Award, Lightbulb, ArrowRight, RotateCcw } from "lucide-react";

type Props = {
  puzzle: PuzzleType | null;
  moves: {
    san: string;
    fen: string;
    index: number;
  }[];
  fen: string;
  setFen: React.Dispatch<React.SetStateAction<string>>;
  moveIndex?: number;
  setMoveIndex: React.Dispatch<React.SetStateAction<number>>;
  goToMove: (index: number) => void;
  retry: () => void;
  next: () => void;
  isFinished: boolean;
  wrongSquare: string;
  correctSquare: string;
  showMove: () => void;
  hint: string;
  showHint: () => void;
  isMyturn: boolean;
};

const PuzzleInfoTab = ({
  puzzle,
  moves,
  fen,
  setFen,
  setMoveIndex,
  retry,
  next,
  isFinished,
  wrongSquare,
  correctSquare,
  showMove,
  hint,
  showHint,
  isMyturn,
}: Props) => {
  // Create a new Chess instance for the MoveHistory component
  const chessInstance = new Chess();
  
  return (
    <div className="space-y-6">
      {/* Puzzle Info */}
      <div className="bg-amber-900/20 rounded-md border border-amber-500/20 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Award className="text-amber-300 h-5 w-5" />
          <h2 className="text-amber-300 font-medium">Puzzle Rating</h2>
        </div>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-amber-200">
            {puzzle?.puzzle.rating || "?"}
          </span>
          <span className="ml-3 text-amber-100/60 text-sm">
            Themes: {puzzle?.puzzle.themes.join(", ")}
          </span>
        </div>
      </div>

      {/* Move History */}
      <div className="bg-amber-900/20 rounded-md border border-amber-500/20 p-4">
        <h2 className="text-amber-300 font-medium mb-3">Move History</h2>
        <MoveHistory
          chess={chessInstance}
          moves={moves}
          fen={fen}
          setFen={setFen}
          setMoveIndex={setMoveIndex}
          removeTempo={() => {}}
          containerHeight="h-[160px]"
        />
      </div>

      {/* Status Messages */}
      {(correctSquare || wrongSquare || isFinished) && (
        <div className={`p-3 rounded-md border ${
          isFinished 
            ? "bg-green-700/20 border-green-500/30 text-green-300" 
            : correctSquare 
              ? "bg-amber-700/30 border-amber-500/30 text-amber-300"
              : "bg-red-700/30 border-red-500/30 text-red-300"
        }`}>
          {isFinished && <p>Puzzle completed successfully!</p>}
          {correctSquare && !isFinished && <p>Correct move! Now wait for opponent's move.</p>}
          {wrongSquare && <p>Incorrect move. Try again.</p>}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {isFinished && (
          <button 
            onClick={next}
            className="w-full flex items-center justify-center gap-2 bg-green-700/60 hover:bg-green-600/70 text-white px-4 py-3 rounded-md transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            <span>Next Puzzle</span>
          </button>
        )}
        
        {wrongSquare && (
          <button 
            onClick={retry}
            className="w-full flex items-center justify-center gap-2 bg-red-700/60 hover:bg-red-600/70 text-white px-4 py-3 rounded-md transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
        
        {!hint && !isFinished && isMyturn && !wrongSquare && !correctSquare && (
          <button
            onClick={showHint}
            className="w-full flex items-center justify-center gap-2 bg-amber-700/60 hover:bg-amber-600/70 text-white px-4 py-3 rounded-md transition-colors"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Get a Hint</span>
          </button>
        )}
        
        {hint && !isFinished && isMyturn && !wrongSquare && !correctSquare && (
          <button
            onClick={showMove}
            className="w-full flex items-center justify-center gap-2 bg-blue-700/60 hover:bg-blue-600/70 text-white px-4 py-3 rounded-md transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            <span>Show the Move</span>
          </button>
        )}
      </div>
      
      {/* Players */}
      {puzzle?.game?.players && (
        <div className="bg-amber-900/20 rounded-md border border-amber-500/20 p-4 mt-4">
          <h2 className="text-amber-300 font-medium mb-3">Players</h2>
          <div className="space-y-3">
            {puzzle.game.players.map((player, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-amber-100">{player.name}</p>
                  <p className="text-sm text-amber-100/60">Rating: {player.rating}</p>
                </div>
                <div className="bg-amber-900/30 px-3 py-1 rounded-full text-amber-300 text-sm border border-amber-500/30">
                  {player.color === "white" ? "White" : "Black"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleInfoTab;
