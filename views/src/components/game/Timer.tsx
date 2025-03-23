import { useState, useEffect, useRef } from "react";

type TimerProps = {
  currentTime: number; // Current time in seconds
  isActive: boolean; // Indicates if the timer is currently active
  onTimeEnd?: () => void; // Callback when the timer ends
  onTimeUpdate?: (time: number) => void; // Callback to report the current time to the parent
};

const Timer = ({
  currentTime,
  isActive,
  onTimeEnd,
  onTimeUpdate,
}: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: Math.floor(currentTime / 60),
    seconds: currentTime % 60,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeLeftRef = useRef(currentTime); // Tracks time without causing re-renders

  useEffect(() => {
    // Sync state with currentTime whenever it changes
    timeLeftRef.current = currentTime;
    setTimeLeft({
      minutes: Math.floor(currentTime / 60),
      seconds: currentTime % 60,
    });
  }, [currentTime]);

  useEffect(() => {
    if (isActive) {
      const startCountdown = () => {
        intervalRef.current = setInterval(() => {
          if (timeLeftRef.current > 0) {
            timeLeftRef.current -= 1;

            // Notify parent of updated time
            if (onTimeUpdate) onTimeUpdate(timeLeftRef.current);

            setTimeLeft({
              minutes: Math.floor(timeLeftRef.current / 60),
              seconds: timeLeftRef.current % 60,
            });
          } else {
            // Stop timer when it reaches 0
            clearInterval(intervalRef.current!);
            intervalRef.current = null;

            if (onTimeEnd) onTimeEnd();
          }
        }, 1000);
      };

      startCountdown();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, onTimeEnd, onTimeUpdate]);

  const getTimerColor = () => {
    if (timeLeft.minutes === 0) {
      if (timeLeft.seconds <= 10) return 'text-red-500';
      if (timeLeft.seconds <= 30) return 'text-yellow-500';
    }
    return isActive ? 'text-[#ffd700]' : 'text-gray-400';
  };

  return (
    <div className={`font-mono text-2xl font-bold ${getTimerColor()} transition-colors duration-300`}>
      <span className="tabular-nums">
        {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}:
        {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
      </span>
    </div>
  );
};

export default Timer;
