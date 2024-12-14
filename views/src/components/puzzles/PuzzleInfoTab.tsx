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
  goToMove: (index: number) => void
};

const PuzzleInfoTab = ({
  moves,
  fen,
  setFen,
  moveIndex,
  setMoveIndex,
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
    </div>
  );
};

export default PuzzleInfoTab;
