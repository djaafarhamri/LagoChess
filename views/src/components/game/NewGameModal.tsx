"use client"


interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: (timeControl: number) => void;
}

export function NewGameModal({ isOpen, onClose, onNewGame }: NewGameModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">New Game</h2>
        <div className="space-y-4">
          <button
            onClick={() => onNewGame(10)}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            10 Minutes
          </button>
          <button
            onClick={() => onNewGame(5)}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            5 Minutes
          </button>
          <button
            onClick={() => onNewGame(3)}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            3 Minutes
          </button>
          <button
            onClick={() => onNewGame(1)}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            1 Minute
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

