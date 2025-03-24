import React, { useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { Arrow, BoardOrientation } from "react-chessboard/dist/chessboard/types";
import { GameType } from "../types/types";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import ChessEngine from "../components/analyze/ChessEngine";
import MoveHistory from "../components/game/MoveHistory";

const Analyze: React.FC = () => {
  const params = useParams();
  const gameId = params.id;
  const [chess] = useState<Chess>(new Chess());
  const [game, setGame] = useState<GameType | null>(null);
  const [fen, setFen] = useState(chess.fen());
  const [orientation, setOrientation] = useState<BoardOrientation>("white");
  const [moves, setMoves] = useState<{ san: string; fen: string; index: number }[]>([]);
  const [tempoMoves, setTempoMoves] = useState<{ san: string; fen: string; index: number }[]>([]);
  const { user } = useUser();
  const [moveIndex, setMoveIndex] = useState<number>(0);
  const [tempoMoveIndex, setTempoMoveIndex] = useState<number>(0);
  const [isTempo, setIsTempo] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [bestMove, setBestMove] = useState<string | null>(null);
  const [principalVariation, setPrincipalVariation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "moves" | "variations">("info");
  const [error, setError] = useState<string | null>(null);
  const [engineInfo, setEngineInfo] = useState<{
    depth: number;
    nodes: number;
    nps: number;
    hashFull: number;
  } | null>(null);

  useEffect(() => {
    const getGame = async () => {
      try {
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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Game data:", data); // Debug log

        if (!data.success || !data.game) {
          throw new Error("No game data received");
        }

        console.log("Setting game state:", data.game); // Debug log
        setGame(data.game);
        console.log("Setting FEN:", data.game.fen); // Debug log
        setFen(data.game.fen);
        console.log("Loading FEN into chess instance"); // Debug log
        chess.load(data.game.fen);

        if (data.game.moves && data.game.moves.length > 0) {
          console.log("Setting moves:", data.game.moves); // Debug log
          setMoves(data.game.moves);
          setMoveIndex(data.game.moves[data.game.moves.length - 1].index);
        }

        if (data.game.black && typeof data.game.black === 'object' && data.game.black.username === user?.username) {
          console.log("Setting orientation to black"); // Debug log
          setOrientation("black");
        }
      } catch (err) {
        console.error("Error fetching game:", err);
        setError(err instanceof Error ? err.message : "Failed to load game");
      }
    };

    if (gameId) {
      console.log("Fetching game with ID:", gameId); // Debug log
      getGame();
    }
  }, [gameId, user?.username]);

  const handleEval = (evaluation: number, bestMove: string, principalVariation: string, info: string) => {
    setEvaluation(evaluation);
    setBestMove(bestMove);
    setPrincipalVariation(principalVariation);
    
    // Parse engine info from the message
    const depthMatch = info.match(/depth (\d+)/);
    const nodesMatch = info.match(/nodes (\d+)/);
    const npsMatch = info.match(/nps (\d+)/);
    const hashFullMatch = info.match(/hashfull (\d+)/);

    if (depthMatch && nodesMatch && npsMatch && hashFullMatch) {
      setEngineInfo({
        depth: parseInt(depthMatch[1]),
        nodes: parseInt(nodesMatch[1]),
        nps: parseInt(npsMatch[1]),
        hashFull: parseInt(hashFullMatch[1])
      });
    }
  };

  const handleMove = ({
    move,
  }: {
    move: { from: string; to: string; promotion?: string };
  }) => {
    if (isTempo) {
      const result = chess.move(move);
      if (!result) return null;

      setFen(chess.fen());
      if (tempoMoveIndex !== tempoMoves[tempoMoves.length-1].index) {
        setTempoMoves(tempoMoves.slice(0, tempoMoveIndex + 1));
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
    if (move === null) return false;
    return true;
  }

  const arrows: Arrow[] = useMemo(() => {
    if (bestMove) {
      return [[bestMove.slice(0, 2) as Square, bestMove.slice(2, 4) as Square, "blue"]];
    }
    return [];
  }, [bestMove]);

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
        <div className="bg-[#2a2a2a] rounded-lg p-8 text-center">
          <h2 className="text-amber-300 text-xl mb-4">Error Loading Game</h2>
          <p className="text-amber-100/60">{error}</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
        <div className="chess-game wooden">
          <div className="chess-container">
            <div className="game-card p-8">
              <div className="animate-pulse">
                <div className="h-8 w-32 bg-[#2a2a2a] rounded mb-4"></div>
                <div className="h-64 w-64 bg-[#2a2a2a] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
      <div className="chess-game">
        <div className="chess-container">
          <div className="game-layout">
            {/* Chess Board Section */}
            <div className="game-board-section">
              <div className="game-board-container">
                <div className="flex items-start">
                  
                  <div className="chess-board-wrapper">
                    <Chessboard
                      id={gameId}
                      position={fen}
                      onPieceDrop={onDrop}
                      boardOrientation={orientation}
                      customArrows={arrows}
                      animationDuration={200}
                      boardWidth={480}
                      customDarkSquareStyle={{ backgroundColor: "#779952" }}
                      customLightSquareStyle={{ backgroundColor: "#edeed1" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="game-info h-[80%] bg-[#2a2a2a] rounded-lg p-4">
              {/* Tab Menu */}
              <div className="flex border-b border-amber-500/20 mb-4">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === "info"
                      ? "text-amber-300 border-b-2 border-amber-500"
                      : "text-amber-100/60 hover:text-amber-300"
                  }`}
                >
                  Analysis
                </button>
                <button
                  onClick={() => setActiveTab("moves")}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === "moves"
                      ? "text-amber-300 border-b-2 border-amber-500"
                      : "text-amber-100/60 hover:text-amber-300"
                  }`}
                >
                  Moves
                </button>
                <button
                  onClick={() => setActiveTab("variations")}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === "variations"
                      ? "text-amber-300 border-b-2 border-amber-500"
                      : "text-amber-100/60 hover:text-amber-300"
                  }`}
                >
                  Variations
                </button>
              </div>

              {/* Tab Content */}
              <div className="h-[calc(100vh-12rem)] overflow-y-auto">
                {activeTab === "info" && (
                  <div className="space-y-4">
                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                      <h2 className="text-amber-300 font-medium mb-4">Position Evaluation</h2>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-2xl font-bold text-amber-300">
                          {evaluation !== null ? (evaluation > 0 ? '+' + evaluation.toFixed(1) : evaluation.toFixed(1)) : '...'}
                        </div>
                        <div className="text-amber-100/60">
                          {evaluation !== null ? (evaluation > 0 ? 'White is better' : evaluation < 0 ? 'Black is better' : 'Equal position') : 'Analyzing...'}
                        </div>
                      </div>
                      {bestMove && (
                        <div className="mb-4">
                          <h3 className="text-amber-300 font-medium mb-2">Best Move</h3>
                          <div className="text-amber-100/80">
                            {bestMove.slice(0, 2)} → {bestMove.slice(2, 4)}
                            {bestMove.length === 5 && ` (${bestMove[4].toUpperCase()})`}
                          </div>
                        </div>
                      )}
                      {principalVariation && (
                        <div>
                          <h3 className="text-amber-300 font-medium mb-2">Principal Variation</h3>
                          <div className="text-amber-100/80">
                            {principalVariation.split(' ').map((move, index) => (
                              <span key={index} className="mr-2">
                                {index % 2 === 0 ? `${Math.floor(index/2) + 1}. ` : ''}
                                {move.slice(0, 2)} → {move.slice(2, 4)}
                                {move.length === 5 && ` (${move[4].toUpperCase()})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                      <h2 className="text-amber-300 font-medium mb-4">Analysis Details</h2>
                      <div className="space-y-2 text-amber-100/80">
                        <div>Depth: {engineInfo ? engineInfo.depth : '...'}</div>
                        <div>Nodes: {engineInfo ? (engineInfo.nodes / 1000000).toFixed(1) + 'M' : '...'}</div>
                        <div>NPS: {engineInfo ? (engineInfo.nps / 1000).toFixed(0) + 'k' : '...'}</div>
                        <div>Hash Full: {engineInfo ? Math.round(engineInfo.hashFull / 10) + '%' : '...'}</div>
                      </div>
                    </div>
                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                      <h2 className="text-amber-300 font-medium mb-4">Game Information</h2>
                      <div className="space-y-2 text-amber-100/80">
                        <div>White: {typeof game?.white === 'string' ? game.white : game?.white?.username || 'Anonymous'}</div>
                        <div>Black: {typeof game?.black === 'string' ? game.black : game?.black?.username || 'Anonymous'}</div>
                        <div>Time Control: {game?.timers ? `${Math.floor(game.timers.white / 60)} min` : 'N/A'}</div>
                        <div>Date: {game?.createdAt ? new Date(game.createdAt).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "moves" && (
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <h2 className="text-amber-300 font-medium mb-4">Game Moves</h2>
                    <div className="h-[300px]">
                      <MoveHistory
                        chess={chess}
                        moves={moves}
                        fen={fen}
                        setFen={setFen}
                        setMoveIndex={setMoveIndex}
                        removeTempo={removeTempo}
                        containerHeight="h-[300px]"
                      />
                    </div>
                  </div>
                )}
                {activeTab === "variations" && (
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <h2 className="text-amber-300 font-medium mb-4">Variations</h2>
                    {isTempo ? (
                      <div className="h-[200px]">
                        <MoveHistory
                          chess={chess}
                          moves={tempoMoves}
                          fen={fen}
                          setFen={setFen}
                          setMoveIndex={setTempoMoveIndex}
                          removeTempo={removeTempo}
                          containerHeight="h-[200px]"
                        />
                      </div>
                    ) : (
                      <div className="text-amber-100/60 text-center py-8">
                        Click on the board to start analyzing variations
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChessEngine fen={fen} onEval={handleEval} />
    </div>
  );
};

export default Analyze;
