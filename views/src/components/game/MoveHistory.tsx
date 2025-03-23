import { Chess } from "chess.js";
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react";

type Props = {
  moves: { san: string; fen: string; index: number }[];
  fen: string;
  setFen: (fen: string) => void;
  chess: Chess;
  setMoveIndex: (index: number) => void;
  removeTempo: () => void;
  containerHeight?: string;
};

export default function MoveHistory({
  fen,
  moves,
  setFen,
  chess,
  setMoveIndex,
  removeTempo,
  containerHeight,
}: Props) {
  const handleMoveClick = (move: { fen: string; index: number }) => {
    setFen(move.fen);
    chess.load(move.fen);
    setMoveIndex(move.index);
    if (removeTempo) removeTempo();
  };

  const goToStart = () => {
    if (moves.length > 0) {
      const startPosition = moves[0];
      setFen(startPosition.fen);
      chess.load(startPosition.fen);
      setMoveIndex(startPosition.index);
      if (removeTempo) removeTempo();
    }
  };

  const goToEnd = () => {
    if (moves.length > 0) {
      const lastMove = moves[moves.length - 1];
      setFen(lastMove.fen);
      chess.load(lastMove.fen);
      setMoveIndex(lastMove.index);
      if (removeTempo) removeTempo();
    }
  };

  const goToPrevMove = () => {
    const currentMoveIndex = moves.findIndex((move) => move.fen === fen);
    if (currentMoveIndex > 0) {
      const prevMove = moves[currentMoveIndex - 1];
      setFen(prevMove.fen);
      chess.load(prevMove.fen);
      setMoveIndex(prevMove.index);
      if (removeTempo) removeTempo();
    }
  };

  const goToNextMove = () => {
    const currentMoveIndex = moves.findIndex((move) => move.fen === fen);
    if (currentMoveIndex < moves.length - 1 && currentMoveIndex !== -1) {
      const nextMove = moves[currentMoveIndex + 1];
      setFen(nextMove.fen);
      chess.load(nextMove.fen);
      setMoveIndex(nextMove.index);
      if (removeTempo) removeTempo();
    }
  };

  const currentMoveIndex = moves.findIndex((move) => move.fen === fen);
  const isAtStart = currentMoveIndex <= 0;
  const isAtEnd = currentMoveIndex === moves.length - 1;

  // Create paired moves (white and black)
  const pairedMoves = moves.slice(1).reduce((rows, move, index) => {
    const rowIndex = Math.floor(index / 2);
    if (!rows[rowIndex]) rows[rowIndex] = [rowIndex + 1, "", ""];
    rows[rowIndex][(index % 2) + 1] = move as unknown as string;
    return rows;
  }, [] as [number, string, string][]);

  return (
    <div className="space-y-4">
      <div className={`bg-amber-900/20 rounded-md border border-amber-500/20 overflow-y-auto ${containerHeight || "max-h-[calc(100vh-22rem)]"}`}>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-amber-900/70 text-amber-300">
            <tr>
              <th className="p-2 text-left w-12">#</th>
              <th className="p-2 text-left">White</th>
              <th className="p-2 text-left">Black</th>
            </tr>
          </thead>
          <tbody>
            {pairedMoves.map(([num, white, black], i) => (
              <tr key={`row-${i}`} className="border-b border-amber-500/10 last:border-0">
                <td className="p-2 text-amber-100/60">{num}</td>
                <td 
                  onClick={() => handleMoveClick(white as unknown as { fen: string; index: number })}
                  className={`p-2 cursor-pointer transition-colors hover:bg-amber-800/40 ${
                    (white as unknown as { fen: string }).fen === fen 
                      ? "bg-amber-800 text-amber-200" 
                      : "text-amber-100"
                  }`}
                >
                  {(white as unknown as { san: string }).san}
                </td>
                <td 
                  onClick={() => black ? handleMoveClick(black as unknown as { fen: string; index: number }) : null}
                  className={`p-2 cursor-pointer transition-colors hover:bg-amber-800/40 ${
                    black && (black as unknown as { fen: string }).fen === fen 
                      ? "bg-amber-800 text-amber-200" 
                      : black ? "text-amber-100" : ""
                  }`}
                >
                  {black ? (black as unknown as { san: string }).san : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between bg-amber-900/30 p-2 rounded-md border border-amber-500/20">
        <button 
          onClick={goToStart}
          disabled={isAtStart}
          className={`p-1 rounded hover:bg-amber-800 ${isAtStart ? 'text-amber-700' : 'text-amber-300'}`}
        >
          <SkipBack className="h-5 w-5" />
        </button>
        <button 
          onClick={goToPrevMove}
          disabled={isAtStart}
          className={`p-1 rounded hover:bg-amber-800 ${isAtStart ? 'text-amber-700' : 'text-amber-300'}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-amber-100">
          {currentMoveIndex >= 0 ? currentMoveIndex : 0}/{moves.length - 1}
        </div>
        <button 
          onClick={goToNextMove}
          disabled={isAtEnd}
          className={`p-1 rounded hover:bg-amber-800 ${isAtEnd ? 'text-amber-700' : 'text-amber-300'}`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button 
          onClick={goToEnd}
          disabled={isAtEnd}
          className={`p-1 rounded hover:bg-amber-800 ${isAtEnd ? 'text-amber-700' : 'text-amber-300'}`}
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
