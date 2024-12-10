import React, { useCallback, useContext, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Move } from "chess.js";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import { SocketContext } from "../context/socket";
import {
  BoardOrientation,
  PromotionPieceOption,
  Square,
} from "react-chessboard/dist/chessboard/types";
import { GameType } from "../types/types";
import Timer from "../components/game/Timer";
import MoveHistory from "../components/game/Moves";
import WhitePawn from "../assets/WhitePawn";
import BlackPawn from "../assets/BlackPawn";
import BlackKnight from "../assets/BlackKnight";
import BlackBishop from "../assets/BlackBishop";
import WhiteQueen from "../assets/WhiteQueen";
import WhiteRook from "../assets/WhiteRook";
import WhiteBishop from "../assets/WhiteBishop";
import WhiteKnight from "../assets/WhiteKnight";
import BlackRook from "../assets/BlackRook";
import BlackQueen from "../assets/BlackQueen";

const Game: React.FC = () => {
  const params = useParams();
  const gameId = params.id;

  const { user } = useUser();

  const [chess] = useState<Chess>(new Chess());
  const [game, setGame] = useState<GameType>();
  const [fen, setFen] = useState(chess.fen());
  const [orientation, setOrientation] = useState<BoardOrientation>("white"); // Manage turn logic
  const [moves, setMoves] = useState<
    { move: string; fen: string; index: number }[]
  >([
    {
      move: "",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      index: 0,
    },
  ]);
  const [blackCaptures, setBlackCaptures] = useState<string[]>([]);
  const [whiteCaptures, setWhiteCaptures] = useState<string[]>([]);

  const whitePieceIcons: { [key: string]: React.ReactElement } = {
    p: <WhitePawn />,
    n: <WhiteKnight />,
    b: <WhiteBishop />,
    r: <WhiteRook />,
    q: <WhiteQueen />,
  };

  const blackPieceIcons: { [key: string]: React.ReactElement } = {
    p: <BlackPawn />,
    n: <BlackKnight />,
    b: <BlackBishop />,
    r: <BlackRook />,
    q: <BlackQueen />,
  };

  interface CapturesProps {
    whiteCaptures: string[]; // Array of captured pieces for white
    blackCaptures: string[]; // Array of captured pieces for black
    isWhite: boolean; // Indicates whether the current player is white
  }
  // Helper function to count the occurrences of each piece
  const countPieces = (captures: string[]) => {
    const counts: { [key: string]: number } = {};
    for (const piece of captures) {
      counts[piece] = (counts[piece] || 0) + 1;
    }
    return counts;
  };

  const Captures: React.FC<CapturesProps> = ({
    whiteCaptures,
    blackCaptures,
    isWhite,
  }) => {
    const pieceIcons = isWhite ? whitePieceIcons : blackPieceIcons;
    const captures = isWhite ? whiteCaptures : blackCaptures;

    const pieceCounts = countPieces(sortPieces(captures));

    return (
      <div className="flex">
        {Object.entries(pieceCounts).map(([piece, count]) => (
          <div key={piece} className="flex items-center">
            {pieceIcons[piece]}
            {count > 1 && (
              <span className={`text-${isWhite ? "white" : "black"} ml-[-6px]`}>
                x{count}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const sortPieces = useCallback((pieces: string[]) => {
    const pieceOrder = ["q", "r", "b", "n", "p"];
    console.log(pieces);
    console.log(
      pieces.sort((a, b) => pieceOrder.indexOf(a) - pieceOrder.indexOf(b))
    );
    return pieces.sort((a, b) => pieceOrder.indexOf(a) - pieceOrder.indexOf(b));
  }, []);

  const socket = useContext(SocketContext);
  const [myTimerActive, setMyTimerActive] = useState(false);
  const [opTimerActive, setOpTimerActive] = useState(false);

  const [myTimerTime, setMyTimerTime] = useState(300); // Example: 5 minutes in seconds
  const [opTimerTime, setOpTimerTime] = useState(300); // Example: 5 minutes in seconds
  const [moveIndex, setMoveIndex] = useState<number>(0);

  const handleSwitchTimers = () => {
    setMyTimerActive((prev) => !prev);
    setOpTimerActive((prev) => !prev);
  };

  useEffect(() => {
    // Join the game room
    socket.emit("join-game", { gameId });
  }, [gameId, socket]);

  useEffect(() => {
    const getGame = async () => {
      const response = await fetch(`http://localhost:4000/api/game/${gameId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
      setGame(data?.game);
      setMyTimerTime(data?.game?.timers.white);
      setOpTimerTime(data?.game?.timers.white);
      if (data?.game.black?.username === user?.username) {
        setOrientation("black");
        setOpTimerActive((prev) => !prev);
      } else {
        setMyTimerActive((prev) => !prev);
      }
    };
    getGame();
  }, [gameId, user?.username]);

  const [promotedPieces, setPromotedPieces] = useState<
    { color: string; piece: string | undefined }[]
  >([]); // Store promoted pieces

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

  useEffect(() => {
    const handleMoveMade = ({
      player,
      move,
      whiteTimerTime,
      blackTimerTime,
    }: {
      player: string;
      move: Move;
      whiteTimerTime: number;
      blackTimerTime: number;
    }) => {
      console.log(`Player ${player} made move :`, move);
      if (chess.turn() !== orientation[0]) {
        const result = chess.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });
        if (result) {
          setFen(chess.fen());
          setMoves((prev) => [
            ...prev,
            { move: result.san, fen: chess.fen(), index: prev.length },
          ]);
          if (moveIndex + 1 === moves.length) {
            setMoveIndex(moves[moves.length - 1].index + 1);
          }
          if (orientation === "black") {
            setMyTimerTime(blackTimerTime);
            setOpTimerTime(whiteTimerTime);
          } else {
            setMyTimerTime(whiteTimerTime);
            setOpTimerTime(blackTimerTime);
          }
          handleSwitchTimers();
          // Check for promotion
          if (result.promotion) {
            setPromotedPieces((prev) => [
              ...prev,
              { color: result.color, piece: result.promotion },
            ]); // Track promoted square
          }
          if (result.captured) {
            const wasPromotedPiece = promotedPieces.some(
              (promotedPiece) =>
                promotedPiece.color !== result.color &&
                promotedPiece.piece === result.captured
            );

            console.log(
              wasPromotedPiece
                ? `Captured a promoted piece (${wasPromotedPiece})`
                : "Captured a regular piece"
            );
            const capturedPiece = wasPromotedPiece ? "p" : result.captured; // Show as pawn if promoted
            if (wasPromotedPiece) {
              setPromotedPieces(
                (prev: { color: string; piece: string | undefined }[]) => {
                  const indexToRemove = prev.findIndex(
                    (promoted: { color: string; piece: string | undefined }) =>
                      promoted.color !== result.color &&
                      promoted.piece === result.captured
                  );

                  if (indexToRemove !== -1) {
                    return [
                      ...prev.slice(0, indexToRemove),
                      ...prev.slice(indexToRemove + 1),
                    ];
                  }

                  return prev; // No match found, return the original array
                }
              );
            }

            if (result.color === "w") {
              console.log(result.captured);
              setBlackCaptures((prev) => [...prev, capturedPiece]);
            } else {
              console.log(result.captured);
              setWhiteCaptures((prev) => [...prev, capturedPiece]);
            }
          }
        }
      }
    };

    // Add the event listener
    socket.on("move-made", handleMoveMade);

    // Clean up the event listener on dependency change
    return () => {
      socket.off("move-made", handleMoveMade);
    };
  }, [
    blackCaptures,
    chess,
    moveIndex,
    moves,
    orientation,
    promotedPieces,
    socket,
    whiteCaptures,
  ]);

  useEffect(() => {
    console.log("promoted pieces", promotedPieces);
  }, [promotedPieces]);

  function makeAMove(move: { from: string; to: string; promotion?: string }) {
    let result: Move | null = null;
    result = chess.move(move);
    if (result) {
      setFen(chess.fen());
      setMoves((prev) => [
        ...prev,
        { move: result.san, fen: chess.fen(), index: prev.length },
      ]);
      if (moveIndex + 1 === moves.length) {
        setMoveIndex(moves[moves.length - 1].index + 1);
      }
      handleSwitchTimers();
      // Check for promotion
      if (result.promotion) {
        setPromotedPieces((prev) => [
          ...prev,
          { color: result.color, piece: result.promotion },
        ]); // Track promoted square
      }
      if (result.captured) {
        const wasPromotedPiece = promotedPieces.some(
          (promotedPiece) =>
            promotedPiece.color !== result.color &&
            promotedPiece.piece === result.captured
        );
        console.log("nigga : ", result.color, result.captured);
        const capturedPiece = wasPromotedPiece ? "p" : result.captured; // Show as pawn if promoted
        if (wasPromotedPiece) {
          console.log("was promoted");
          console.log("was promoted promoted pieces: ", promotedPieces);
          console.log("was promoted result: ", result);
          setPromotedPieces(
            (prev: { color: string; piece: string | undefined }[]) => {
              const indexToRemove = prev.findIndex(
                (promoted: { color: string; piece: string | undefined }) =>
                  promoted.color !== result.color &&
                  promoted.piece === result.captured
              );

              if (indexToRemove !== -1) {
                console.log("gla3nah: ", [
                  ...prev.slice(0, indexToRemove),
                  ...prev.slice(indexToRemove + 1),
                ]);
                return [
                  ...prev.slice(0, indexToRemove),
                  ...prev.slice(indexToRemove + 1),
                ];
              }
              console.log("magla3nahch: ", prev);
              return prev; // No match found, return the original array
            }
          );
        }

        if (result.color === "w") {
          console.log(result.captured);
          setBlackCaptures((prev) => [...prev, capturedPiece]);
        } else {
          console.log(result.captured);
          setWhiteCaptures((prev) => [...prev, capturedPiece]);
        }
      }
    }
    if (result) {
      const blackTimerTime =
        orientation === "black" ? myTimerTime : opTimerTime;
      const whiteTimerTime =
        orientation === "white" ? myTimerTime : opTimerTime;
      socket.emit("make-move", {
        gameId,
        player: user?.username,
        move,
        whiteTimerTime,
        blackTimerTime,
      }); // Send move to server
    }
    return result;
  }
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
    });

    // Illegal move
    if (move === null) return false;
    return true;
  }

  function onPromo(
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) {
    if (piece && promoteFromSquare && promoteToSquare) {
      const promotion = piece[1].toLowerCase();
      const move = makeAMove({
        from: promoteFromSquare,
        to: promoteToSquare,
        promotion, // Promote to queen for simplicity
      });
      if (move === null) return false;
      return true;
    }
    return false;
  }
  const handleMyTimeUpdate = (time: number) => {
    setMyTimerTime(time); // Update my timer's state
  };

  const handleOpTimeUpdate = (time: number) => {
    setOpTimerTime(time); // Update opponent's timer's state
  };

  return (
    <div className="container flex justify-around mx-auto px-4 py-8">
      <h2 className="text-xl w-full text-center font-bold text-yellow-400 p-4">
        Chat Room
      </h2>
      {game && (
        <div className="flex justify-center">
          <Chessboard
            id={gameId}
            position={fen}
            onPieceDrop={onDrop}
            onPromotionPieceSelect={onPromo}
            boardWidth={640}
            boardOrientation={orientation}
            arePiecesDraggable={
              chess.turn() === orientation[0] &&
              moveIndex === moves[moves.length - 1].index
            } // Disable drag when it's not the player's turn
            animationDuration={0}
          />
        </div>
      )}
      <div className="flex flex-col w-full mr-auto">
        <Timer
          currentTime={opTimerTime}
          isActive={opTimerActive}
          onTimeEnd={() => console.log("My Timer Ended!")}
          onTimeUpdate={handleOpTimeUpdate}
        />
        {orientation !== "white" ? (
          <>
            <div className="flex w-full h-10 bg-[#454545]">
              <Captures
                whiteCaptures={whiteCaptures}
                blackCaptures={blackCaptures}
                isWhite={false}
              />
              {(calculateEvaluation(whiteCaptures, blackCaptures, "white") > 0) && (
              <p className="text-center text-white m-2">+{calculateEvaluation(whiteCaptures, blackCaptures, "white")}</p>
              )}
              <div className="h-10 w-10 bg-white ml-auto"></div>
            </div>
            <div className="text-xl  font-bold text-yellow-400 py-2 px-8 bg-[#313131]">
              <h2>{typeof game?.white !== "string" && game?.white.username}</h2>
            </div>
          </>
        ) : (
          <>
            <div className="flex w-full bg-[#454545]">
              <Captures
                whiteCaptures={whiteCaptures}
                blackCaptures={blackCaptures}
                isWhite={true}
              />
              {(calculateEvaluation(whiteCaptures, blackCaptures, "black") > 0) && (
              <p className="text-center text-white m-2">+{calculateEvaluation(whiteCaptures, blackCaptures, "black")}</p>
              )}
              <div className="h-10 w-10 bg-black ml-auto"></div>
            </div>
            <div className="text-xl  font-bold text-yellow-400 py-2 px-8 bg-[#313131]">
              <h2>{typeof game?.black !== "string" && game?.black.username}</h2>
            </div>
          </>
        )}
        <div className="w-full  h-full">
          <MoveHistory
            moves={moves}
            fen={fen}
            setFen={setFen}
            moveIndex={moveIndex}
            setMoveIndex={setMoveIndex}
          />
        </div>
        {orientation === "white" ? (
          <>
            <div className="flex w-full bg-[#454545]">
              <Captures
                whiteCaptures={whiteCaptures}
                blackCaptures={blackCaptures}
                isWhite={false}
              />
              {(calculateEvaluation(whiteCaptures, blackCaptures, "white") > 0) && (
                <p className="text-center text-white m-2">+{calculateEvaluation(whiteCaptures, blackCaptures, "white")}</p>
              )}
                <div className="h-10 w-10 bg-white ml-auto"></div>
            </div>
            <div className="text-xl  font-bold text-yellow-400 py-2 px-8 bg-[#313131]">
              <h2>{typeof game?.white !== "string" && game?.white.username}</h2>
            </div>
          </>
        ) : (
          <>
            <div className="flex w-full bg-[#454545]">
              <Captures
                whiteCaptures={whiteCaptures}
                blackCaptures={blackCaptures}
                isWhite={true}
              />
              {(calculateEvaluation(whiteCaptures, blackCaptures, "black") > 0) && (
              <p className="text-center text-white m-2">+{calculateEvaluation(whiteCaptures, blackCaptures, "black")}</p>
              )}
              <div className="h-10 w-10 bg-black ml-auto"></div>
            </div>
            <div className="text-xl  font-bold text-yellow-400 py-2 px-8 bg-[#313131]">
              <h2>{typeof game?.black !== "string" && game?.black.username}</h2>
            </div>
          </>
        )}
        <Timer
          currentTime={myTimerTime}
          isActive={myTimerActive}
          onTimeEnd={() => console.log("My Timer Ended!")}
          onTimeUpdate={handleMyTimeUpdate}
        />
      </div>
    </div>
  );
};

export default Game;
