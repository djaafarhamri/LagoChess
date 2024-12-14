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
    <>
      <div className="text-center px-6 py-2">
        <h3 className="mt-2 text-xl text-gray-300">
          waiting for <span className="text-yellow-400">{username}</span> response...
        </h3>
      </div>

      <div
        className="border-b-2 mt-2 w-full"
        style={{
          width: `${progress}%`,
          borderColor: "#facc15", // Yellow border color
          transition: "width 0.1s linear", // Smooth animation over 100ms interval
        }}
      />
    </>
  );
}

export default SentChallengePopup;
