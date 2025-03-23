type Props = {
  lines: any;
};

const Lines = ({ lines }: Props) => {
  if (!lines) return null;

  return (
    <div className="flex flex-col gap-3">
      {lines.map((line: string[], index: number) => (
        <div key={index} className="bg-[#1a1a1a] rounded-lg p-3 border border-[#ffd700] border-opacity-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#ffd700] font-mono text-sm">Line {index + 1}</span>
            <div className="h-px flex-grow bg-[#ffd700] bg-opacity-20"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {line.map((move: string, moveIndex: number) => (
              <div
                key={moveIndex}
                className="flex items-center text-sm"
              >
                {moveIndex % 2 === 0 && (
                  <span className="text-gray-500 font-mono mr-1">
                    {Math.floor(moveIndex / 2) + 1}.
                  </span>
                )}
                <span className="font-mono text-gray-200 hover:text-[#ffd700] transition-colors duration-200">
                  {move}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Lines;
  