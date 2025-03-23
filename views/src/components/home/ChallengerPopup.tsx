import { useEffect, useRef, useState } from "react";

type ChallengePopupPropsType = {
  challenger: string;
  timer: string;
  onAccept: (timer: string) => void;
  onDecline: () => void;
  onTimeout: () => void;
};

function ChallengerPopup({
  challenger,
  timer,
  onAccept,
  onDecline,
  onTimeout,
}: ChallengePopupPropsType) {
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const updateProgress = () => {
      const now = Date.now();
      const elapsedTime = (now - startTimeRef.current) / 1000;
      const newProgress = Math.max(0, 100 - elapsedTime * 10);

      setProgress(newProgress);

      if (newProgress <= 0) {
        onTimeout();
      } else {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);

    return () => {
      // Cleanup is not needed for requestAnimationFrame
    };
  }, [onTimeout]);

  return (
    <div className="game-card">
      <div className="game-card-header">
        <h2 className="game-card-title">Challenge Received</h2>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="text-center">
          <p className="text-[#f0f0f0] text-lg">
            <span className="text-[#ffd700] font-medium">{challenger}</span> has challenged
            you to a <span className="text-[#ffd700] font-medium">{timer}</span> game of
            chess!
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            className="game-button bg-[#5cb85c] hover:bg-[#4cae4c]"
            onClick={() => onAccept(timer)}
          >
            Accept
          </button>
          <button
            className="game-button bg-[#d9534f] hover:bg-[#c9302c]"
            onClick={onDecline}
          >
            Decline
          </button>
        </div>

        <div className="relative h-1 bg-[rgba(255,215,0,0.1)] rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#ffd700] transition-all duration-100"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ChallengerPopup;
