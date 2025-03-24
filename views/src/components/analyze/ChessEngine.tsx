import React, { useEffect, useRef } from "react";

interface ChessEngineProps {
  fen: string;
  onEval: (evaluation: number, bestMove: string, principalVariation: string, info: string) => void;
}

type StockfishInstance = {
  postMessage: (message: string) => void;
  onmessage: ((event: MessageEvent) => void) | null;
  terminate: () => void;
};

const ChessEngine: React.FC<ChessEngineProps> = ({ fen, onEval }) => {
  const engineRef = useRef<StockfishInstance | null>(null);

  useEffect(() => {
    const loadEngine = async () => {
      try {
        console.log("Initializing Stockfish...");
        
        // Create a Web Worker
        const worker = new Worker('/stockfish.js');
        engineRef.current = worker;

        // Set up message handler
        worker.onmessage = (event: MessageEvent) => {
          const message = event.data;
          console.log("Stockfish message:", message);

          if (message.startsWith("info depth")) {
            const match = message.match(/score cp (-?\d+)/);
            if (match) {
              const evaluation = parseInt(match[1]) / 100;
              onEval(evaluation, "", "", message);
            }
          }

          if (message.startsWith("bestmove")) {
            const bestMove = message.split(" ")[1];
            onEval(0, bestMove, "", message);
          }

          if (message.startsWith("info pv")) {
            const pv = message.split(" ").slice(3).join(" ");
            onEval(0, "", pv, message);
          }
        };

        // Initialize engine
        worker.postMessage("uci");
        worker.postMessage("setoption name MultiPV value 1");
        worker.postMessage("setoption name Threads value 4");
        worker.postMessage("setoption name Hash value 16");
        worker.postMessage("isready");

        console.log("Stockfish initialized successfully");
      } catch (error) {
        console.error("Failed to load Stockfish:", error);
      }
    };

    loadEngine();

    return () => {
      if (engineRef.current) {
        engineRef.current.terminate();
      }
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.postMessage(`position fen ${fen}`);
      engineRef.current.postMessage("go depth 20");
    }
  }, [fen]);

  return null;
};

export default ChessEngine; 