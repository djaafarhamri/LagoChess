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
    <div className="w-12 h-[640px] flex flex-col border border-gray-300 bg-gray-100 relative">
      {orientation === "black" ? (
        <>
          <div
            className="bg-white transition-height duration-500 ease-in-out"
            style={{ height: `${MyPercentage}%` }}
            title={`White Advantage: ${evalScore*-1}`}
          ></div>
          <div
            className="bg-black transition-height duration-500 ease-in-out"
            style={{ height: `${opPercentage}%` }}
            title={`Black Advantage: ${evalScore}`}
          ></div>
        </>
      ) : (
        <>
          <div
            className="bg-black transition-height duration-500 ease-in-out"
            style={{ height: `${opPercentage}%` }}
            title={`Black Advantage: ${evalScore*-1}`}
          ></div>
          <div
            className="bg-white transition-height duration-500 ease-in-out"
            style={{ height: `${MyPercentage}%` }}
            title={`White Advantage: ${evalScore}`}
          ></div>
        </>
      )}
    </div>
  );
};

export default EvalBar;
