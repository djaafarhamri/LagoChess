"use client"

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultType: "win" | "lose" | "draw" | null;
  message: string;
  onNewGame: () => void;
}

export function GameResultModal({
  isOpen,
  onClose,
  resultType,
  message,
  onNewGame,
}: GameResultModalProps) {
  if (!isOpen) return null;

  const getResultColor = () => {
    switch (resultType) {
      case "win":
        return "text-green-500";
      case "lose":
        return "text-red-500";
      case "draw":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-lg w-96">
        <h2 className={`text-2xl font-bold mb-4 ${getResultColor()}`}>
          {resultType === "win"
            ? "Victory!"
            : resultType === "lose"
            ? "Defeat"
            : "Draw"}
        </h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onNewGame}
            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            New Game
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

