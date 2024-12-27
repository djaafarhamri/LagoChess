import { Chess } from "chess.js";
import { PuzzleType } from "../../pages/Puzzles";
import MoveHistory from "../game/Moves";

type Props = {
  puzzle: PuzzleType | null;
  moves: {
    san: string;
    fen: string;
    index: number;
  }[];
  fen: string;
  setFen: React.Dispatch<React.SetStateAction<string>>;
  moveIndex: number;
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
  moveIndex,
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
  return (
    <div className="flex flex-col w-full mr-auto">
      <div className="w-full h-full">
        <MoveHistory
          chess={new Chess()}
          showBar={false}
          moves={moves}
          fen={fen}
          setFen={setFen}
          moveIndex={moveIndex}
          setMoveIndex={setMoveIndex}
        />
      </div>
      <div className="w-full text-white font-bold text-3xl text-center p-2">
        Puzzle Rating : {puzzle?.puzzle.rating}
      </div>
      <div className="w-full flex justify-center items-center">
        {isFinished && (
          <button className="bg-green-500 p-3 w-1/3 rounded-3xl font-bold" onClick={next}>
            NEXT PUZZLE
          </button>
        )}
        {correctSquare && !isFinished && (
          <button className="bg-green-500 p-3 w-1/3 rounded-3xl font-bold">
            CORRECT MOVE
          </button>
        )}
        {wrongSquare && (
          <button className="bg-red-500 p-3 w-1/3 rounded-3xl font-bold" onClick={retry}>
            WRONG MOVE! RETRY
          </button>
        )}
        {!hint && !isFinished && isMyturn && (
          <button
            className="bg-blue-500 p-3 w-1/3 rounded-3xl font-bold"
            onClick={showHint}
          >
            GET A HINT
          </button>
        )}
        {hint && (
          <button
            className="bg-blue-500 p-3 w-1/3  rounded-3xl font-bold"
            onClick={showMove}
          >
            SHOW THE MOVE
          </button>
        )}
      </div>
    </div>
  );
};

export default PuzzleInfoTab;
