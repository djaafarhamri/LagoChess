import React from 'react';

type EvalBarProps = {
  evalScore: number;
  turn: 'w' | 'b';
  orientation: 'white' | 'black';
};

const EvalBar: React.FC<EvalBarProps> = ({ evalScore, turn, orientation }) => {
  // Convert evaluation to percentage (assuming eval is between -10 and 10)
  const percentage = Math.min(Math.max((evalScore + 10) * 5, 0), 100);
  
  // Determine the color based on the evaluation
  const getEvalColor = (score: number) => {
    if (score > 2) return 'bg-green-500';
    if (score > 1) return 'bg-green-400';
    if (score > 0.5) return 'bg-green-300';
    if (score > 0) return 'bg-green-200';
    if (score > -0.5) return 'bg-red-200';
    if (score > -1) return 'bg-red-300';
    if (score > -2) return 'bg-red-400';
    return 'bg-red-500';
  };

  // Format the evaluation score
  const formatEval = (score: number) => {
    if (score > 0) return `+${score.toFixed(1)}`;
    return score.toFixed(1);
  };

  return (
    <div className="w-8 h-full flex flex-col items-center justify-center">
      <div className="w-full h-full relative">
        {/* Background bar */}
        <div className="absolute inset-0 bg-[#2a2a2a] rounded-lg"></div>
        
        {/* Evaluation bar */}
        <div 
          className={`absolute bottom-0 w-full transition-all duration-300 rounded-b-lg ${getEvalColor(evalScore)}`}
          style={{ height: `${percentage}%` }}
        ></div>

        {/* Evaluation text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {formatEval(evalScore)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EvalBar;
