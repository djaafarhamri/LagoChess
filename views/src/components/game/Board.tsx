import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

type ChessBoardProps = {
  position?: string;
  onDrop?: (sourceSquare: Square, targetSquare: Square) => boolean;
  onPromo: (
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) => boolean;
  orientation?: "white" | "black";
  readOnly?: boolean;
  theme?: string;
  lastMove?: { from: string; to: string } | null;
};

export function ChessBoard({
  position = "start",
  onDrop,
  onPromo,
  orientation = "white",
  theme = "wooden",
  lastMove = null,
}: ChessBoardProps) {
  const [game, setGame] = useState(
    new Chess(position !== "start" ? position : undefined)
  );

  // Use a ref for the container
  const containerRef = useRef<HTMLDivElement>(null);

  // State to control dynamic width
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Maximum width constant
  const MAX_WIDTH = 480;

  // Calculate actual board width based on container width
  const boardWidth = Math.min(containerWidth || MAX_WIDTH, MAX_WIDTH);

  // Update game when position changes
  useEffect(() => {
    try {
      setGame(new Chess(position !== "start" ? position : undefined));
    } catch (e) {
      console.error("Invalid position:", e);
      setGame(new Chess());
    }
  }, [position]);

  // Function to measure the container and update width
  const updateDimensions = () => {
    if (!containerRef.current) return;

    // Get the current width of the container element
    const width = containerRef.current.clientWidth;

    // Update width state if it has changed
    setContainerWidth(width);
  };

  // Set up all resize listeners
  useEffect(() => {
    // Initial measurement
    updateDimensions();

    // Create a dedicated resize observer
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateDimensions);
    });

    // Observe the container
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen for window resize events
    const handleResize = () => {
      requestAnimationFrame(updateDimensions);
    };

    window.addEventListener("resize", handleResize);

    // Force measurements a few times after mounting
    const timeouts = [
      setTimeout(updateDimensions, 0),
      setTimeout(updateDimensions, 100),
      setTimeout(updateDimensions, 500),
    ];

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Get board styling (scaled border based on current width)
  const getBoardStyles = () => {
    switch (theme) {
      case "wooden":
        return {
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
        };
      case "classic":
        return {
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
        };
      case "emerald":
        return {
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
        };
      case "midnight":
        return {
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
        };
      default:
        return {
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
        };
    }
  };

  // Get custom square styling
  const getCustomSquareStyles = () => {
    const customStyles: Record<string, React.CSSProperties> = {};

    if (lastMove) {
      customStyles[lastMove.from] = {
        backgroundColor: "rgba(255, 215, 0, 0.3)",
      };
      customStyles[lastMove.to] = {
        backgroundColor: "rgba(255, 215, 0, 0.3)",
      };
    }

    return customStyles;
  };

  // Get custom square colors based on theme
  const getCustomSquareColors = () => {
    switch (theme) {
      case "wooden":
        return {
          light: "#e8c090",
          dark: "#b58863",
        };
      case "classic":
        return {
          light: "#f0d9b5",
          dark: "#946f51",
        };
      case "emerald":
        return {
          light: "#eeeed2",
          dark: "#769656",
        };
      case "midnight":
        return {
          light: "#6b8caf",
          dark: "#2e4259",
        };
      default:
        return {
          light: "#e8c090",
          dark: "#b58863",
        };
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: `${MAX_WIDTH}px`,
        margin: "0 auto",
        display: "flex", // Use flex to ensure content sizing
        justifyContent: "center", // Center the board
        alignItems: "center", // Center vertically too
      }}
    >
      {/* Only render board when we have a valid container width */}
      {containerWidth > 0 && (
        <div
          style={{
            width: `${boardWidth}px`, // Explicitly set width in pixels
            height: `${boardWidth}px`, // Make sure height matches width for square aspect ratio
          }}
        >
          <Chessboard
            id="chess-board"
            position={game.fen()}
            onPieceDrop={onDrop}
            onPromotionPieceSelect={onPromo}
            boardOrientation={orientation}
            customBoardStyle={getBoardStyles()}
            customDarkSquareStyle={{
              backgroundColor: getCustomSquareColors().dark,
            }}
            customLightSquareStyle={{
              backgroundColor: getCustomSquareColors().light,
            }}
            customSquareStyles={getCustomSquareStyles()}
            boardWidth={boardWidth} // Pass calculated width to chessboard
            areArrowsAllowed={false}
            animationDuration={0}
          />
        </div>
      )}
    </div>
  );
}
