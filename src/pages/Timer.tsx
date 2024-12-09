import { useState, useEffect, useRef } from "react";

type TimerProps = {
  currentTime: number; // Current time in seconds
  isActive: boolean; // Indicates if the timer is currently active
  onTimeEnd?: () => void; // Callback when the timer ends
  onTimeUpdate?: (time: number) => void; // Callback to report the current time to the parent
};

const Timer = ({ currentTime, isActive, onTimeEnd, onTimeUpdate }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: Math.floor(currentTime / 60),
    seconds: currentTime % 60,
  });

  const intervalRef = useRef<number | null>(null);
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
          timeLeftRef.current -= 1;

          // Notify parent of updated time
          if (onTimeUpdate) onTimeUpdate(timeLeftRef.current);

          if (timeLeftRef.current <= 0) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            if (onTimeEnd) onTimeEnd();
            return;
          }

          setTimeLeft({
            minutes: Math.floor(timeLeftRef.current / 60),
            seconds: timeLeftRef.current % 60,
          });
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

  return (
    <div className="">
      <h1 className="max-w-fit p-3 text-5xl font-medium text-gray-200">
        {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}:
        {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
      </h1>
    </div>
  );
};

export default Timer;
