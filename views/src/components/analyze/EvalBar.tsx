const EvalBar = ({
  evalScore,
  turn,
  orientation,
}: {
  evalScore: number;
  turn: "w" | "b";
  orientation: string;
}) => {
  console.log(evalScore);
  if (orientation[0] !== turn) {
    evalScore = evalScore * -1;
  }

  // Normalize the evalScore for display.
  let MyPercentage = 50;

  if (!evalScore && turn === "w") {
    // Mate is a decisive advantage for white
    MyPercentage = 100;
  } else if (!evalScore && turn === "b") {
    // Mate is a decisive advantage for black
    MyPercentage = 0;
  } else if (evalScore) {
    // Clamp evalScore to the range [-4, 4]
    const clampedScore = Math.min(4, Math.max(-4, evalScore));

    if (evalScore >= 4) {
      MyPercentage = 90; // Cap at 90% for evalScore >= 4
    } else if (evalScore <= -4) {
      MyPercentage = 10; // Cap at 10% for evalScore <= -4
    } else {
      // Scale [-4, 4] to [10%, 90%]
      MyPercentage = ((clampedScore + 4) / 8) * 80 + 10;
    }
  }

  const opPercentage = 100 - MyPercentage;

  return (
    <div className="w-8 h-full flex flex-col border border-[#ffd700] border-opacity-20 rounded-lg overflow-hidden mr-4">
      {orientation === "black" ? (
        <>
          <div
            className="bg-white bg-opacity-90 transition-all duration-200 ease-in-out relative group"
            style={{ height: `${MyPercentage}%` }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-70">
              <span className="text-xs font-mono text-[#ffd700] transform -rotate-90">
                {(evalScore * -1).toFixed(1)}
              </span>
            </div>
          </div>
          <div
            className="bg-[#1a1a1a] transition-all duration-200 ease-in-out relative group"
            style={{ height: `${opPercentage}%` }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-70">
              <span className="text-xs font-mono text-[#ffd700] transform -rotate-90">
                {evalScore.toFixed(1)}
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="bg-[#1a1a1a] transition-all duration-200 ease-in-out relative group"
            style={{ height: `${opPercentage}%` }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-70">
              <span className="text-xs font-mono text-[#ffd700] transform -rotate-90">
                {(evalScore * -1).toFixed(1)}
              </span>
            </div>
          </div>
          <div
            className="bg-white bg-opacity-90 transition-all duration-200 ease-in-out relative group"
            style={{ height: `${MyPercentage}%` }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-70">
              <span className="text-xs font-mono text-[#ffd700] transform -rotate-90">
                {evalScore.toFixed(1)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EvalBar;
