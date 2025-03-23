type PairingLoadingPopupPropsType = {
  timer: string | null;
  onCancel: () => void;
};

function PairingLoadingPopup({
  timer,
  onCancel,
}: PairingLoadingPopupPropsType) {
  return (
    <div className="game-card">
      <div className="game-card-header">
        <h2 className="game-card-title">Finding Game</h2>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="text-center">
          <p className="text-[#f0f0f0] text-lg">
            Looking for a <span className="text-[#ffd700] font-medium">{timer}</span> game of chess...
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex gap-2">
              <span className="w-2 h-2 bg-[#ffd700] rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
              <span className="w-2 h-2 bg-[#ffd700] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
              <span className="w-2 h-2 bg-[#ffd700] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="game-button bg-[#d9534f] hover:bg-[#c9302c]"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default PairingLoadingPopup;
