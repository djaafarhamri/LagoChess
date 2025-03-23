"use client"

type GameTimerProps = {
  whiteTime: number
  blackTime: number
  activeTimer: "white" | "black" | null
}

export function GameTimer({ whiteTime, blackTime, activeTimer }: GameTimerProps) {
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Check if timer is low (less than 30 seconds)
  const isTimeLow = (seconds: number) => seconds < 30

  return (
    <div className="timer-container">
      <div
        className={`player-timer ${activeTimer === "white" ? "active" : ""} ${isTimeLow(whiteTime) && activeTimer === "white" ? "low" : ""}`}
      >
        <div className="timer-name">White</div>
        <div className="timer-value">{formatTime(whiteTime)}</div>
      </div>

      <div
        className={`player-timer ${activeTimer === "black" ? "active" : ""} ${isTimeLow(blackTime) && activeTimer === "black" ? "low" : ""}`}
      >
        <div className="timer-name">Black</div>
        <div className="timer-value">{formatTime(blackTime)}</div>
      </div>
    </div>
  )
}

