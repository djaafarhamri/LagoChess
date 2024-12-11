import React, { useCallback, useContext, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import { SocketContext } from "../context/socket";
import {
  BoardOrientation,
  PromotionPieceOption,
  Square,
} from "react-chessboard/dist/chessboard/types";
import { GameType } from "../types/types";
import Chat from "../components/game/Chat";
import GameInfoTab from "../components/game/GameInfoTab";

const Game: React.FC = () => {
  const params = useParams();
  const gameId = params.id;

  const { user } = useUser();

  const [chess] = useState<Chess>(new Chess());
  const [game, setGame] = useState<GameType>();
  const [fen, setFen] = useState(chess.fen());
  const [orientation, setOrientation] = useState<BoardOrientation>("white"); // Manage turn logic
  const [moves, setMoves] = useState<
    { san: string; fen: string; index: number }[]
  >([
    {
      san: "",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      index: 0,
    },
  ]);
  const [blackCaptures, setBlackCaptures] = useState<string[]>([]);
  const [whiteCaptures, setWhiteCaptures] = useState<string[]>([]);

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

  const bufferTime = 200

  useEffect(() => {
    // Join the game room
    socket.emit("join-game", { gameId, player: user?.username });
    const handleBeforeUnload = () => {
      socket.emit("leave-game", { gameId, player: user?.username });
    };

    // Add listener for tab close or page unload
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Cleanup for React component unmount
      socket.emit("leave-game", { gameId, player: user?.username });
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [gameId, socket, user?.username]);
 
  useEffect(() => {
    socket.on("timerSync", ({ timers, white, black }) => {
  
      // Directly use the timers from the database without subtracting elapsed time
      const adjustedWhiteTime = timers.white + bufferTime / 1000;
      const adjustedBlackTime = timers.black + bufferTime / 1000;
  
      // Update the timers based on the current orientation
      if (user?.username === white) {
        setMyTimerTime(Math.round(adjustedWhiteTime));
        setOpTimerTime(Math.round(adjustedBlackTime));
      } else if (user?.username === black) {
        setOpTimerTime(Math.round(adjustedWhiteTime));
        setMyTimerTime(Math.round(adjustedBlackTime));
      }
    });
  }, [socket, user?.username]);
  


  function getTurnFromFEN(fen: string) {
    // Split the FEN string into its components
    const parts = fen.split(" ");
    // The second part indicates the active color
    return parts[1]; // 'w' for White, 'b' for Black
  }

  useEffect(() => {
    const getGame = async () => {
      const response = await fetch(`http://localhost:4000/api/game/${gameId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
      setGame(data?.game);

      setFen(data?.game.fen);
      if (data?.game.moves.length !== 0) {
        setMoves(data?.game.moves);
        setMoveIndex(data?.game.moves[data?.game.moves.length - 1].index);
      }
      const turn = getTurnFromFEN(data?.game.fen);
      if (data?.game.black?.username === user?.username) {
        setOrientation("black");
        if (turn === "w") {
          setOpTimerActive((prev) => !prev);
        } else {
          setMyTimerActive((prev) => !prev);
        }
      } else {
        if (turn === "w") {
          setMyTimerActive((prev) => !prev);
        } else {
          setOpTimerActive((prev) => !prev);
        }
      }
    };
    getGame();
  }, [gameId, user?.username]);

  useEffect(() => {
    if (game) {
      chess.load(game.fen);
    }
  }, [chess, game]);

  const [promotedPieces, setPromotedPieces] = useState<
    { color: string; piece: string | undefined }[]
  >([]); // Store promoted pieces


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became active, sync the timer
        socket.emit("requestTimerSync", { gameId });
      }
    };

    // Listen for tab focus change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket, gameId]);


  const handleMove = useCallback(
    ({
      player,
      move,
      isLocalMove = false,
    }: {
      player: string | undefined;
      move: { from: string; to: string; promotion?: string };
      whiteTimerTime?: number;
      blackTimerTime?: number;
      isLocalMove?: boolean; // Indicates if the move is made locally or externally
    }) => {
      const result = chess.move(move);
      if (!result) return null;

      // Update FEN and moves list
      setFen(chess.fen());
      setMoves((prev) => [
        ...prev,
        { san: result.san, fen: chess.fen(), index: prev.length },
      ]);

      if (moveIndex + 1 === moves.length) {
        setMoveIndex(moves[moves.length - 1].index + 1);
      }

      handleSwitchTimers();

      // Handle promotions
      if (result.promotion) {
        setPromotedPieces((prev) => [
          ...prev,
          { color: result.color, piece: result.promotion },
        ]);
      }

      // Handle captures
      if (result.captured) {
        const wasPromotedPiece = promotedPieces.some(
          (promotedPiece) =>
            promotedPiece.color !== result.color &&
            promotedPiece.piece === result.captured
        );
        const capturedPiece = wasPromotedPiece ? "p" : result.captured;

        if (wasPromotedPiece) {
          setPromotedPieces((prev) => {
            const indexToRemove = prev.findIndex(
              (promoted) =>
                promoted.color !== result.color &&
                promoted.piece === result.captured
            );
            if (indexToRemove !== -1) {
              return [
                ...prev.slice(0, indexToRemove),
                ...prev.slice(indexToRemove + 1),
              ];
            }
            return prev;
          });
        }

        if (result.color === "w") {
          setBlackCaptures((prev) => [...prev, capturedPiece]);
        } else {
          setWhiteCaptures((prev) => [...prev, capturedPiece]);
        }
      }

      // Emit move to the server if it's a local move
      if (isLocalMove) {
        socket.emit("make-move", {
          gameId,
          player,
          move,
          fen: chess.fen(),
          san: result.san,
          index: moves.length - 1,
        });
      }

      return result;
    },
    [chess, gameId, moveIndex, moves, promotedPieces, socket]
  );

  useEffect(() => {
    // Add the event listener
    socket.on("move-made", handleMove);

    // Clean up the event listener on dependency change
    return () => {
      socket.off("move-made", handleMove);
    };
  }, [
    blackCaptures,
    chess,
    handleMove,
    moveIndex,
    moves,
    promotedPieces,
    socket,
    whiteCaptures,
  ]);

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = handleMove({
      player: user?.username,
      isLocalMove: true,
      move: { from: sourceSquare, to: targetSquare },
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
      const move = handleMove({
        player: user?.username,
        isLocalMove: true,
        move: { from: promoteFromSquare, to: promoteToSquare, promotion },

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
      <Chat gameId={gameId} />
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
      <GameInfoTab
        game={game}
        orientation={orientation}
        opTimerTime={opTimerTime}
        opTimerActive={opTimerActive}
        myTimerTime={myTimerTime}
        myTimerActive={myTimerActive}
        handleOpTimeUpdate={handleOpTimeUpdate}
        whiteCaptures={whiteCaptures}
        blackCaptures={blackCaptures}
        handleMyTimeUpdate={handleMyTimeUpdate}
        moves={moves}
        fen={fen}
        setFen={setFen}
        moveIndex={moveIndex}
        setMoveIndex={setMoveIndex}
      />
    </div>
  );
};

export default Game;
