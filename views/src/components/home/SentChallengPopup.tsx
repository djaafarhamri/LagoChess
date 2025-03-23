import { useEffect, useRef, useState } from "react";

type SentChallengePopupPropsType = {
  username: string | null;
  onTimeout: () => void; // Callback to notify when the timeout is reached
};

function SentChallengePopup({ username, onTimeout }: SentChallengePopupPropsType) {
  const [progress, setProgress] = useState(100); // Progress of the border (100%)
  
  // Use a ref to store the start time to persist across renders
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const updateProgress = () => {
      // Calculate the elapsed time in seconds
      const now = Date.now();
      const elapsedTime = (now - startTimeRef.current) / 1000; // In seconds

      // Calculate the new progress as a percentage (10 seconds = 100%)
      const newProgress = Math.max(0, 100 - (elapsedTime * 10));

      setProgress(newProgress);

      // If the progress reaches 0%, notify the parent component
      if (newProgress <= 0) {
        onTimeout();
      } else {
        // Continue updating the progress using requestAnimationFrame
        requestAnimationFrame(updateProgress);
      }
    };

    // Start the progress update loop
    requestAnimationFrame(updateProgress);

    return () => {
      // Cleanup is not needed for requestAnimationFrame, but included for clarity
    };
  }, [onTimeout]);

  return (
    <div className="game-card">
      <div className="game-card-header">
        <h2 className="game-card-title">Challenge Sent</h2>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="text-center">
          <p className="text-[#f0f0f0] text-lg">
            Waiting for <span className="text-[#ffd700] font-medium">{username}</span>'s response...
          </p>
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

export default SentChallengePopup;
