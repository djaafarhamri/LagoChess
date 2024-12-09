import { useEffect, useRef } from "react";

const MoveHistory = ({
  moves,
  fen,
  setFen,
}: {
  moves: { move: string; fen: string }[];
  fen: string;
  setFen: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      // Scroll to the bottom when the moves are updated
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [moves]); // This effect runs whenever `moves` changes

  return (
    <div
      ref={scrollContainerRef}
      className="text-white max-h-80 overflow-y-auto"
      style={{ paddingRight: "10px" }} // Avoids scrollbar overlap with content
    >
      <div className="grid grid-cols-5">
        {/* Numbering of moves */}
        <ul className="bg-[#454545]">
          {Array.from({ length: Math.ceil(moves.length / 2) }).map(
            (_, index) => (
              <li key={index} className="p-2">
                {index + 1}
              </li>
            )
          )}
        </ul>

        {/* White moves */}
        <ul className="col-span-2">
          {moves.map(
            (move, index) =>
              index % 2 == 0 && (
                <li
                  key={index}
                  className={`p-2 hover:bg-yellow-700 cursor-pointer ${move.fen === fen && "bg-yellow-800"}`}
                  onClick={() => setFen(move.fen)}
                >
                  {move.move}
                </li>
              )
          )}
        </ul>

        {/* Black moves */}
        <ul className="col-span-2">
          {moves.map(
            (move, index) =>
              index % 2 !== 0 && (
                <li
                  key={index}
                  className={`p-2 hover:bg-yellow-700 cursor-pointer ${move.fen === fen && "bg-yellow-800"}`}
                  onClick={() => setFen(move.fen)}
                >
                  {move.move}
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  );
};

export default MoveHistory;
