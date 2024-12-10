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

  const handleMove = useCallback(
    ({
      player,
      move,
      whiteTimerTime,
      blackTimerTime,
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
        { move: result.san, fen: chess.fen(), index: prev.length },
      ]);

      if (moveIndex + 1 === moves.length) {
        setMoveIndex(moves[moves.length - 1].index + 1);
      }

      // Handle timer updates
      if (orientation === "black") {
        setMyTimerTime(blackTimerTime ?? myTimerTime);
        setOpTimerTime(whiteTimerTime ?? opTimerTime);
      } else {
        setMyTimerTime(whiteTimerTime ?? myTimerTime);
        setOpTimerTime(blackTimerTime ?? opTimerTime);
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
          whiteTimerTime,
          blackTimerTime,
        });
      }

      return result;
    },
    [
      chess,
      gameId,
      moveIndex,
      moves,
      myTimerTime,
      opTimerTime,
      orientation,
      promotedPieces,
      socket,
    ]
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
    orientation,
    promotedPieces,
    socket,
    whiteCaptures,
  ]);

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const blackTimerTime = orientation === "black" ? myTimerTime : opTimerTime;
    const whiteTimerTime = orientation === "white" ? myTimerTime : opTimerTime;
    const move = handleMove({
      player: user?.username,
      isLocalMove: true,
      move: { from: sourceSquare, to: targetSquare },
      whiteTimerTime,
      blackTimerTime,
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
      const blackTimerTime =
        orientation === "black" ? myTimerTime : opTimerTime;
      const whiteTimerTime =
        orientation === "white" ? myTimerTime : opTimerTime;
      const move = handleMove({
        player: user?.username,
        isLocalMove: true,
        move: { from: promoteFromSquare, to: promoteToSquare, promotion },
        whiteTimerTime,
        blackTimerTime,
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
      <Chat />
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
