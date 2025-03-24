import React from 'react';

interface LinesProps {
  lines: string | null;
}

const Lines: React.FC<LinesProps> = ({ lines }) => {
  if (!lines) return null;

  // Split the principal variation into individual moves
  const moves = lines.split(' ');

  return (
    <div className="space-y-2">
      {moves.map((move, index) => (
        <div key={index} className="text-amber-100/80">
          {index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : ''}
          {move}
        </div>
      ))}
    </div>
  );
};

export default Lines;
  