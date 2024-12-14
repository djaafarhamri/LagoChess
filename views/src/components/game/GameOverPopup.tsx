type GameOverPopupPropsType = {
  title: string;
  winner: string;
  onGoHome: () => void;
  onClose: () => void;
};

function GameOverPopup({
  title,
  winner,
  onGoHome,
  onClose,
}: GameOverPopupPropsType) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
      <div className="bg-[#454545] p-6 rounded-lg shadow-lg max-w-sm w-full">
        {title && (
          <>
            <h3 className="text-xl font-bold text-yellow-400 text-center">
              {title}
            </h3>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-300">{winner}</p>
            </div>
          </>
        )}
        <div className="flex mt-6">
          <button
            onClick={onGoHome}
            className="w-full px-4 py-2 mx-4 bg-green-500 text-gray-900 font-semibold rounded-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            home
          </button>
          <button
            className="w-full px-4 py-2 mx-4 bg-red-500 text-gray-900 font-semibold rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
            onClick={onClose}
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameOverPopup;
