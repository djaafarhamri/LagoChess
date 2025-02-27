import { Chess } from "chess.js";
import { useEffect, useRef } from "react";

type Props = {
  moves: { san: string; fen: string; index: number }[];
  fen: string;
  setFen: React.Dispatch<React.SetStateAction<string>>;
  moveIndex: number;
  setMoveIndex: React.Dispatch<React.SetStateAction<number>>;
  removeTempo?: () => void;
  showBar: boolean;
  chess: Chess;
};

const MoveHistory = ({
  moves,
  fen,
  setFen,
  moveIndex,
  setMoveIndex,
  removeTempo,
  showBar,
  chess,
}: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      // Scroll to the bottom when the moves are updated
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [moves]); // This effect runs whenever `moves` changes

  return (
    <div className="text-white w-full">
      {showBar && (
        <div className="grid grid-cols-12">
          {/* Numbering of moves */}
          <div
            className="flex col-span-3 justify-center p-2 cursor-pointer hover:bg-yellow-600 bg-[#454545]"
            onClick={() => {
              setFen(moves[0].fen);
              chess.load(moves[0].fen);
              setMoveIndex(0);
            }}
          >
            <svg
              width={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M22 6L13.2571 12.1714L22 18.3429V6Z"
                  fill="#fff"
                ></path>{" "}
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4 12.1714V18.3429H2V6.34286H4V12.1714ZM4 12.1714L12.7429 6V18.3429L4 12.1714Z"
                  fill="#fff"
                ></path>{" "}
              </g>
            </svg>
          </div>
          <div
            className="flex col-span-3 justify-center p-2 cursor-pointer hover:bg-yellow-600 bg-[#454545]"
            onClick={() => {
              if (moveIndex !== 0) {
                setFen(moves[moveIndex - 1].fen);
                chess.load(moves[moveIndex - 1].fen);
                setMoveIndex(moveIndex - 1);
              }
            }}
          >
            <svg
              width={20}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path d="M20 4L8.66667 12L20 20V4Z" fill="#fff"></path>{" "}
                <path d="M4 20H6.66667V4H4V20Z" fill="#fff"></path>{" "}
              </g>
            </svg>
          </div>
          <div
            className="flex col-span-3 justify-center p-2 cursor-pointer hover:bg-yellow-600 bg-[#454545]"
            onClick={() => {
              if (moveIndex !== moves.length - 1) {
                setFen(moves[moveIndex + 1].fen);
                chess.load(moves[moveIndex + 1].fen);
                setMoveIndex(moveIndex + 1);
              }
            }}
          >
            <svg
              width={20}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path d="M4 20L15.3333 12L4 4V20Z" fill="#fff"></path>{" "}
                <path d="M20 4H17.3333V20H20V4Z" fill="#fff"></path>{" "}
              </g>
            </svg>
          </div>
          <div
            className="flex col-span-3 justify-center p-2 cursor-pointer hover:bg-yellow-600 bg-[#454545]"
            onClick={() => {
              setFen(moves[moves.length - 1].fen);
                chess.load(moves[moves.length - 1].fen);
                setMoveIndex(moves.length - 1);
            }}
          >
            <svg
              width={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M2 18.3429L10.7429 12.1714L2 6V18.3429Z"
                  fill="#fff"
                ></path>{" "}
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20 12.1714L11.2571 18.3429V6L20 12.1714ZM20 12.1714V6H22V18H20V12.1714Z"
                  fill="#fff"
                ></path>{" "}
              </g>
            </svg>
          </div>
          
        </div>
      )}
      <div
        ref={scrollContainerRef}
        className="grid grid-cols-12 max-h-[500px] overflow-y-auto"
      >
        <ul className="bg-[#454545] col-span-4">
          {Array.from({ length: Math.ceil((moves.length - 1) / 2) }).map(
            (_, index) => (
              <li key={index} className="p-2">
                {index + 1}
              </li>
            )
          )}
        </ul>

        {/* White moves */}
        <ul className="col-span-4">
          {moves.slice(1).map(
            (move, index) =>
              index % 2 == 0 && (
                <li
                  key={index}
                  className={`p-2 hover:bg-yellow-700 cursor-pointer ${
                    move.fen === fen && "bg-yellow-800"
                  }`}
                  onClick={() => {
                    setFen(move.fen);
                    chess.load(move.fen);
                    setMoveIndex(move.index);
                    if (removeTempo) removeTempo();
                  }}
                >
                  {move.san}
                </li>
              )
          )}
        </ul>

        {/* Black moves */}
        <ul className="col-span-4">
          {moves.slice(1).map(
            (move, index) =>
              index % 2 !== 0 && (
                <li
                  key={index}
                  className={`p-2 hover:bg-yellow-700 cursor-pointer ${
                    move.fen === fen && "bg-yellow-800"
                  }`}
                  onClick={() => {
                    setFen(move.fen);
                    chess.load(move.fen)
                    setMoveIndex(move.index);
                    if (removeTempo) removeTempo();
                  }}
                >
                  {move.san}
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  );
};

export default MoveHistory;
