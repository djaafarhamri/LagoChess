import MoveHistory from "../game/Moves";

type Props = {
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
      <div className="w-full  h-full">
        <MoveHistory
          moves={moves}
          fen={fen}
          setFen={setFen}
          moveIndex={moveIndex}
          setMoveIndex={setMoveIndex}
        />
      </div>
      <div className="w-full flex justify-center items-center">
        {isFinished && (
          <button className="bg-green-500 p-3 w-1/3 rounded-3xl" onClick={next}>
            next
          </button>
        )}
        {correctSquare && !isFinished && (
          <button className="bg-green-500 p-3 w-1/3  rounded-3xl">
            Correct
          </button>
        )}
        {wrongSquare && (
          <button className="bg-red-500 p-3 w-1/3  rounded-3xl" onClick={retry}>
            retry
          </button>
        )}
        {!hint && !isFinished && isMyturn && (
          <button
            className="bg-blue-500 p-3 w-1/3  rounded-3xl"
            onClick={showHint}
          >
            hint
          </button>
        )}
        {hint && (
          <button
            className="bg-blue-500 p-3 w-1/3  rounded-3xl"
            onClick={showMove}
          >
            move
          </button>
        )}
      </div>
    </div>
  );
};

export default PuzzleInfoTab;
