import React, { useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import {
  Arrow,
  BoardOrientation,
  CustomSquareStyles,
  PromotionPieceOption,
  Square,
} from "react-chessboard/dist/chessboard/types";
import PuzzleInfoTab from "../components/puzzles/PuzzleInfoTab";

export type PuzzleType = {
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
  const [mySide, setMySide] = useState<BoardOrientation>("white");
  const [moves, setMoves] = useState<
    { san: string; fen: string; index: number }[]
  >([]);
  const [moveIndex, setMoveIndex] = useState<number>(0);
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);

  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [hint, setHint] = useState<string>("");
  const [showMoveArrow, setShowMoveArrow] = useState<string>("");
  const [rating, setRating] = useState(1500);

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
    setMySide(chess.turn() === "w" ? "white" : "black");
  };

  const [wrongSquare, setWrongSquare] = useState<string>("");
  const [correctSquare, setCorrectSquare] = useState<string>("");

  const getPuzzle = async () => {
    chess.reset();
    setMoveIndex(0);
    setPuzzleIndex(0);
    setMoves([]);
    setIsFinished(false);
    setCorrectSquare("");
    setWrongSquare("");
    const resPuzzleId = await fetch(
      `https://chess-puzzles.p.rapidapi.com/?rating=${rating}&count=1`,
      {
        headers: {
          "x-rapidapi-key":
            "56425d03c3msh2b1bb660a2f8e81p16d464jsnd51f52947166",
          "x-rapidapi-host": "chess-puzzles.p.rapidapi.com",
        },
      }
    );
    if (!resPuzzleId.ok) {
      console.error("Error fetching puzzle");
      return;
    }
    const resPuzzleIdData = await resPuzzleId.json();
    const res = await fetch(
      `https://lichess.org/api/puzzle/${resPuzzleIdData.puzzles[0].puzzleid}`
    );
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
    if (correctSquare) {
      if (puzzle && puzzleIndex <= puzzle?.puzzle.solution.length - 1) {
        if (chess.turn() !== mySide[0] && puzzle) {
          const timeout = setTimeout(() => {
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
              setCorrectSquare("");
            }
          }, 500); // 2000ms = 2 seconds
          return () => clearTimeout(timeout);
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
    if (puzzle?.puzzle.solution[puzzleIndex] === sourceSquare + targetSquare) {
      // Add the new move to the moves array
      const newMove = { san: move.san, fen: chess.fen(), index: moves.length };
      setMoves((prev) => [...prev, newMove]);
      setMoveIndex(moveIndex + 1);
      setPuzzleIndex(puzzleIndex + 1);
      setFen(chess.fen());
      setCorrectSquare(targetSquare);
      if (puzzle && puzzle?.puzzle.solution.length === puzzleIndex + 1) {
        setIsFinished(true);
      }
    } else {
      setFen(chess.fen());
      setWrongSquare(targetSquare);
      const newMove = { san: move.san, fen: chess.fen(), index: moves.length };
      setMoves((prev) => [...prev, newMove]);
    }
    setHint("");
    setShowMoveArrow("");
    return true;
  }

  function onPromo(
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) {
    if (!promoteFromSquare || !promoteToSquare || !piece) return false;
    if (moveIndex !== moves.length - 1) return false; // Only allow moves at the current position

    const move = chess.move({
      from: promoteFromSquare,
      to: promoteToSquare,
      promotion: piece[1].toLowerCase(),
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
      setCorrectSquare(promoteFromSquare);
      if (puzzle && puzzle?.puzzle.solution.length === puzzleIndex + 1) {
        setIsFinished(true);
      }
    } else {
      setFen(chess.fen());
      setWrongSquare(promoteToSquare);
      const newMove = { san: move.san, fen: chess.fen(), index: moves.length };
      setMoves((prev) => [...prev, newMove]);
    }
    setHint("");
    setShowMoveArrow("");
    return true;
  }
  // Navigate back to a previous move
  const goToMove = (index: number) => {
    if (index < 0 || index >= moves.length) return;
    setMoveIndex(index);
    setFen(moves[index].fen);
    chess.load(moves[index].fen); // Ensure Chess.js is synced
  };

  const retry = () => {
    if (wrongSquare) {
      setMoves((prevMoves) => prevMoves.slice(0, -1)); // Remove the last move
      setMoveIndex(moves.length - 2);
      chess.undo();
      setFen(chess.fen());
      setWrongSquare("");
    }
  };

  const colorSquare = (): CustomSquareStyles => {
    if (correctSquare !== "")
      return { [correctSquare as Square]: { backgroundColor: "#74C365" } };
    if (wrongSquare !== "")
      return { [wrongSquare as Square]: { backgroundColor: "#FA8072" } };
    if (hint !== "")
      return { [hint as Square]: { backgroundColor: "#4169E1" } };
    return {}; // Return an empty object if none of the conditions match
  };
  const customStyles = useMemo(
    () => colorSquare(),
    [correctSquare, wrongSquare, hint]
  );

  const showArrow = () => {
    if (showMoveArrow)
      return [
        [
          showMoveArrow[0] + showMoveArrow[1],
          showMoveArrow[2] + showMoveArrow[3],
        ] as Arrow,
      ];
    return [];
  };
  const customArrow = useMemo(() => showArrow(), [showMoveArrow]);

  const showMove = () => {
    if (puzzle) {
      setShowMoveArrow(puzzle?.puzzle.solution[puzzleIndex]);
    }
  };
  const showHint = () => {
    if (puzzle) {
      setHint(
        puzzle?.puzzle.solution[puzzleIndex][0] +
          puzzle?.puzzle.solution[puzzleIndex][1]
      );
    }
  };

  if (puzzle) {
    return (
      <div className="container flex justify-around mx-auto px-4 py-8">
        <div className="flex flex-col justify-center">
          <Chessboard
            id={puzzle.puzzle.id}
            position={fen}
            onPieceDrop={onDrop}
            onPromotionPieceSelect={onPromo}
            boardWidth={640}
            boardOrientation={orientation}
            arePiecesDraggable={moveIndex === moves.length - 1} // Enable drag only at the current move
            animationDuration={0}
            customArrows={customArrow}
            customSquareStyles={customStyles}
          />
        </div>
        <PuzzleInfoTab
          puzzle={puzzle}
          moves={moves}
          fen={fen}
          setFen={setFen}
          moveIndex={moveIndex}
          setMoveIndex={setMoveIndex}
          goToMove={goToMove}
          retry={retry}
          next={() => {
            setRating(prev => prev + 100);
            getPuzzle();
          }}
          isFinished={isFinished}
          wrongSquare={wrongSquare}
          correctSquare={correctSquare}
          showMove={showMove}
          hint={hint}
          showHint={showHint}
          isMyturn={chess.turn() === mySide[0]}
        />
      </div>
    );
  } else {
    return <div>loading...</div>;
  }
};

export default Puzzles;
