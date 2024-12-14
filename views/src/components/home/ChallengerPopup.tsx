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
  const [progress, setProgress] = useState(100); // Progress of the border (100%)

  // Use a ref to store the start time to persist across renders
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const updateProgress = () => {
      // Calculate the elapsed time in seconds
      const now = Date.now();
      const elapsedTime = (now - startTimeRef.current) / 1000; // In seconds

      // Calculate the new progress as a percentage (10 seconds = 100%)
      const newProgress = Math.max(0, 100 - elapsedTime * 10);

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
      <div className="mt-4 text-center px-6 py-2 ">
        <h3 className="text-lg text-gray-300">
          <span className="text-yellow-400">{challenger}</span> has challenged
          you to a <span className="text-yellow-400">{timer}</span> game of
          chess!
        </h3>
      </div>
      <div className="flex mt-2 px-6 py-2 ">
        <button
          className="px-4 py-2 ml-auto bg-green-500 text-gray-100 font-normal rounded-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
          onClick={() => onAccept(timer)}
        >
          Accept
        </button>
        <button
          className="px-4 py-2 mx-2 bg-red-500 text-gray-100 font-normal rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
          onClick={onDecline}
        >
          Decline
        </button>
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

export default ChallengerPopup;
