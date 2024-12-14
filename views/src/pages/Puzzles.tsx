import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import {
  BoardOrientation,
  PromotionPieceOption,
  Square,
} from "react-chessboard/dist/chessboard/types";
import PuzzleInfoTab from "../components/puzzles/PuzzleInfoTab";

type PuzzleType = {
  game: {
    clock: string;
    id: string;
    perf: {
      key: string;
      name: string;
    };
    pgn: string;
    players: {
      color: "white" | "black";
      flair: string;
      id: string;
      name: string;
      patron: boolean;
      rating: number;
      title: string;
    }[];
    rated: boolean;
  };
  puzzle: {
    id: string;
    initialPly: number;
    plays: number;
    rating: number;
    solution: string[];
    themes: string[];
  };
};

const Puzzles: React.FC = () => {
  const [chess] = useState<Chess>(new Chess());
  const [puzzle, setPuzzle] = useState<PuzzleType | null>(null);
  const [fen, setFen] = useState(chess.fen());
  const [orientation, setOrientation] = useState<BoardOrientation>("white");
  const [moves, setMoves] = useState<
    { san: string; fen: string; index: number }[]
  >([]);
  const [moveIndex, setMoveIndex] = useState<number>(0);
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);

  // Parse PGN and initialize moves and FENs
  const playGameFromPGN = (pgn: string) => {
    chess.reset();
    const parsedMoves = [];
    const pgnMoves = pgn.split(" ");
    for (let move of pgnMoves) {
      const result = chess.move(move);
      if (!result) break;
      parsedMoves.push({
        san: result.san,
        fen: chess.fen(),
        index: parsedMoves.length,
      });
    }
    setMoves(parsedMoves);
    setMoveIndex(parsedMoves.length - 1); // Start at the last move
    setFen(parsedMoves[parsedMoves.length - 1]?.fen || chess.fen());
    setOrientation(chess.turn() === "w" ? "white" : "black");
  };

  const getPuzzle = async () => {
    chess.reset();
    setMoveIndex(0);
    setPuzzleIndex(0);
    setMoves([]);
    const res = await fetch("https://lichess.org/api/puzzle/next");
    if (!res.ok) {
      console.error("Error fetching puzzle");
      return;
    }
    const data = await res.json();
    setPuzzle(data);
    playGameFromPGN(data?.game.pgn);
  };
  useEffect(() => {
    getPuzzle();
  }, []);

  useEffect(() => {
    if (puzzle && puzzle?.puzzle.solution.length === puzzleIndex) {
      getPuzzle();
    }
  }, [fen]);

  useEffect(() => {
    if (puzzle) {
      if (puzzleIndex <= puzzle?.puzzle.solution.length - 1) {
        if (chess.turn() !== orientation[0] && puzzle) {
          const move = chess.move({
            from:
              puzzle?.puzzle.solution[puzzleIndex][0] +
              puzzle?.puzzle.solution[puzzleIndex][1],
            to:
              puzzle?.puzzle.solution[puzzleIndex][2] +
              puzzle?.puzzle.solution[puzzleIndex][3],
            promotion: "q",
          });
          {
            // Add the new move to the moves array
            const newMove = {
              san: move.san,
              fen: chess.fen(),
              index: moves.length,
            };
            setMoves((prev) => [...prev, newMove]);
            setMoveIndex(moveIndex + 1);
            setPuzzleIndex(puzzleIndex + 1);
            setFen(chess.fen());
          }
        }
      }
    }
  }, [chess.turn()]);
  // Handle piece drops for player moves
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (moveIndex !== moves.length - 1) return false; // Only allow moves at the current position

    const move = chess.move({
      from: sourceSquare,
      to: targetSquare,
    });
    if (!move) return false;
    if (
      puzzle?.puzzle.solution[puzzleIndex] ===
      sourceSquare + targetSquare
    ) {
      // Add the new move to the moves array
      const newMove = { san: move.san, fen: chess.fen(), index: moves.length };
      setMoves((prev) => [...prev, newMove]);
      setMoveIndex(moveIndex + 1);
      setPuzzleIndex(puzzleIndex + 1);
      setFen(chess.fen());
    } else {
      chess.undo();
      alert("wrong");
    }
    return true;
  }

  function onPromo(
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) {
    if (!promoteFromSquare || ! promoteToSquare || !piece) return false;
    if (moveIndex !== moves.length - 1) return false; // Only allow moves at the current position

    const move = chess.move({
      from: promoteFromSquare,
      to: promoteToSquare,
      promotion: piece[1].toLowerCase()
    });
    if (!move) return false;
    if (
      puzzle?.puzzle.solution[puzzleIndex] ===
      promoteFromSquare + promoteToSquare + piece[1].toLowerCase()
    ) {
      // Add the new move to the moves array
      const newMove = { san: move.san, fen: chess.fen(), index: moves.length };
      setMoves((prev) => [...prev, newMove]);
      setMoveIndex(moveIndex + 1);
      setPuzzleIndex(puzzleIndex + 1);
      setFen(chess.fen());
    } else {
      chess.undo();
      alert("wrong");
    }
    return true;
  }
  // Navigate back to a previous move
  const goToMove = (index: number) => {
    if (index < 0 || index >= moves.length) return;
    setMoveIndex(index);
    setFen(moves[index].fen);
    chess.load(moves[index].fen); // Ensure Chess.js is synced
  };

  return (
    <div className="container flex justify-around mx-auto px-4 py-8">
      {puzzle && (
        <div className="flex flex-col justify-center">
          <Chessboard
            id={puzzle.puzzle.id}
            position={fen}
            onPieceDrop={onDrop}
            onPromotionPieceSelect={onPromo}
            boardWidth={640}
            boardOrientation={orientation}
            arePiecesDraggable={moveIndex === moves.length - 1} // Enable drag only at the current move
            animationDuration={300}
          />
        </div>
      )}
      <PuzzleInfoTab
        moves={moves}
        fen={fen}
        setFen={setFen}
        moveIndex={moveIndex}
        setMoveIndex={setMoveIndex}
        goToMove={goToMove}
      />
    </div>
  );
};

export default Puzzles;
