import React, { useContext, useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { Arrow, BoardOrientation } from "react-chessboard/dist/chessboard/types";
import { GameType } from "../types/types";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import MoveHistory from "../components/game/Moves";
import { SocketContext } from "../context/socket";
import EvalBar from "../components/analyze/EvalBar";
import Lines from "../components/analyze/Lines";

const Analyze: React.FC = () => {
  const params = useParams();
  const gameId = params.id;
  const [chess] = useState<Chess>(new Chess());
  const [game, setGame] = useState<GameType | null>(null);
  const [fen, setFen] = useState(chess.fen());
  const [orientation, setOrientation] = useState<BoardOrientation>("white");
  const [moves, setMoves] = useState<
    { san: string; fen: string; index: number }[]
  >([]);
  const [tempoMoves, setTempoMoves] = useState<
    { san: string; fen: string; index: number }[]
  >([]);
  const { user } = useUser();
  const [moveIndex, setMoveIndex] = useState<number>(0);
  const [tempoMoveIndex, setTempoMoveIndex] = useState<number>(0);
  const [isTempo, setIsTempo] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [bestMove, setBestMove] = useState<string | null>(null);
  const [principalVariation, setPrincipalVariation] = useState(null);

  const socket = useContext(SocketContext);

  useEffect(() => {
    const getGame = async () => {
      const response = await fetch(
        `${
          !import.meta.env.VITE_API_URL ||
          import.meta.env.VITE_API_URL === "undefined"
            ? ""
            : import.meta.env.VITE_API_URL
        }/api/game/game/${gameId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await response.json();
      setGame(data?.game);
      setFen(data?.game.fen);
      chess.load(data?.game.fen)
      if (data?.game.moves.length !== 0) {
        setMoves(data?.game.moves);
        setMoveIndex(data?.game.moves[data?.game.moves.length - 1].index);
      }
      if (data?.game.black?.username === user?.username) {
        setOrientation("black");
      }
    };
    getGame();
  }, [gameId, user?.username]);

  useEffect(() => {
    socket.emit("startGame", { roomId: gameId });
    return () => {
      socket.emit("stopGame", { roomId: gameId });
    };
  }, []);

  useEffect(() => {
    if (game) {
      socket.emit("request-eval", { fen, roomId: gameId });
    }
  }, [fen]);

  useEffect(() => {
    socket.on("evalResult", ({ evaluation, bestMove, principalVariation }) => {
      setEvaluation(evaluation);
      setBestMove(bestMove);
      setPrincipalVariation(principalVariation);
    });
  }, []);

  useEffect(() => {
    console.log(chess.ascii())
  }, [fen])

  const handleMove = ({
    move,
  }: {
    move: { from: string; to: string; promotion?: string };
  }) => {
    if (isTempo) {
      const result = chess.move(move);
      if (!result) return null;

      // Update FEN and moves list
      setFen(chess.fen());
      if (tempoMoveIndex !== tempoMoves[tempoMoves.length-1].index) {
        console.log("tempoMoves : ", tempoMoves)
        console.log("tempoMoveIndex : ", tempoMoveIndex)
        setTempoMoves(tempoMoves.slice(0, tempoMoveIndex + 1))
      }
      setTempoMoves((prev) => [
        ...prev,
        { san: result.san, fen: chess.fen(), index: prev.length },
      ]);
      setTempoMoveIndex(tempoMoves.length);
      return true;
    } else {
      setIsTempo(true);
      const result = chess.move(move);
      if (!result) return null;

      // Update FEN and moves list
      setFen(chess.fen());
      setTempoMoves((prev) => [
        ...prev,
        { san: "", fen, index: 0 },
        { san: result.san, fen: chess.fen(), index: 1 },
      ]);

      setTempoMoveIndex(1);
      return true;
    }
  };

  useEffect(() => {
    if (isTempo && tempoMoveIndex === 0) {
      chess.load(tempoMoves[0].fen);
      setTempoMoves([]);
      setIsTempo(false);
    }
  }, [tempoMoveIndex]);
  const removeTempo = () => {
    chess.load(tempoMoves[0].fen);
    setTempoMoves([]);
    setIsTempo(false);
  };

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = handleMove({
      move: { from: sourceSquare, to: targetSquare },
    });
    // Illegal move
    if (move === null) return false;
    return true;
  }

  const showArrow = () => {
    if (bestMove)
      return [
        [
          bestMove[0] + bestMove[1],
          bestMove[2] + bestMove[3],
        ] as Arrow,
      ];
    return [];
  };
  const customArrow = useMemo(() => showArrow(), [bestMove]);

  if (game) {
    return (
      <div className="container flex justify-around mx-auto px-4 py-8">
        <div className="w-1/4"></div>
        {evaluation && (
          <EvalBar
            evalScore={evaluation}
            turn={chess.turn()}
            orientation={orientation}
          />
        )}
        <div className="flex flex-col justify-center">
          <Chessboard
            id={gameId}
            position={fen}
            boardWidth={640}
            onPieceDrop={onDrop}
            boardOrientation={orientation}
            arePiecesDraggable={true} // Enable drag only at the current move
            animationDuration={0}
            customArrows={customArrow}
          />
        </div>
        <div className="w-full  h-full">
          <Lines lines={principalVariation} />
          <MoveHistory
            chess={chess}
            moves={moves}
            fen={fen}
            setFen={setFen}
            moveIndex={moveIndex}
            setMoveIndex={setMoveIndex}
            removeTempo={removeTempo}
            showBar={isTempo ? false : true}
          />
          <MoveHistory
            chess={chess}
            moves={tempoMoves}
            fen={fen}
            setFen={setFen}
            moveIndex={tempoMoveIndex}
            setMoveIndex={setTempoMoveIndex}
            showBar={isTempo ? true : false}
          />
        </div>
      </div>
    );
  } else {
    return <div>loading...</div>;
  }
};

export default Analyze;
