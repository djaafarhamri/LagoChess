import { useState } from "react";

type Props = {
  onDraw: () => void;
  onResign: () => void;
  offeredDraw: boolean;
  onAcceptDraw: () => void;
  onDeclineDraw: () => void;
  gameOver: boolean;
};

function UnderTheBoard({
  onDraw,
  onResign,
  offeredDraw,
  onAcceptDraw,
  onDeclineDraw,
  gameOver
}: Props) {
  const [showConfirm, setShowConfirm] = useState<string | null>(null); // Tracks which button is clicked

  return (
    <div className="bg-[#454545] text-white flex justify-between h-10 w-full">
      <div className="flex p-2 text-white">
        <p className="mx-2">Player1 </p>
        <p> 0 -</p>
        <p>0 </p>
        <p className="mx-2">Player2</p>
      </div>
      {!gameOver && (
        <div className="flex justify-center space-x-4 p-2 relative">
          {/* Resign Button */}
          <div className="relative">
            <button
              className="flex items-center bg-red-600 text-white px-2 font-medium rounded hover:bg-red-700 shadow-lg transition"
              onClick={() => setShowConfirm("resign")}
            >
              Resign
            </button>
            {showConfirm === "resign" && (
              <div className="z-10 absolute -top-16 left-0 bg-gray-800 text-white text-sm p-3 rounded shadow-lg w-28">
                <p>Are you sure?</p>
                <div className="flex justify-evenly mt-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                    onClick={() => {
                      onResign();
                      setShowConfirm(null);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded"
                    onClick={() => setShowConfirm(null)}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Offer Draw Button */}
          <div className="relative">
            <button
              className="flex items-center bg-blue-600 text-white font-medium px-2 rounded hover:bg-blue-700 shadow-lg transition"
              onClick={() => setShowConfirm("draw")}
            >
              Draw
            </button>
            {showConfirm === "draw" && (
              <div className="z-10 absolute -top-16 left-0 bg-gray-800 text-white text-sm p-3 rounded shadow-lg w-28">
                <p>Are you sure?</p>
                <div className="flex justify-evenly mt-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                    onClick={() => {
                      onDraw();
                      setShowConfirm(null);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded"
                    onClick={() => setShowConfirm(null)}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
            {offeredDraw && (
              <div className="z-10 absolute -bottom-16 left-0 bg-gray-800 text-white text-sm p-3 rounded shadow-lg w-40">
                <p>Offered A Draw</p>
                <div className="flex justify-evenly mt-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                    onClick={onAcceptDraw}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded"
                    onClick={onDeclineDraw}
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UnderTheBoard;
