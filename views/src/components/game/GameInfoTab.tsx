import { Chess } from "chess.js";
import { GameType } from "../../types/types";
import Captures from "./Captures";
import MoveHistory from "./Moves";
import Timer from "./Timer";

const pieceValues: { [key: string]: number } = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};

function calculateEvaluation(
  blackCaptures: string[],
  whiteCaptures: string[],
  forPlayer: string
): number {
  // Calculate total value of pieces captured by each side
  const blackScore = blackCaptures.reduce(
    (sum, capture) => sum + pieceValues[capture],
    0
  );

  const whiteScore = whiteCaptures.reduce(
    (sum, capture) => sum + pieceValues[capture],
    0
  );

  if (forPlayer === "white") return whiteScore - blackScore;
  else return blackScore - whiteScore;
}

type Props = {
  game: GameType | undefined;
  chess: Chess;
  orientation: string;
  opTimerTime: number;
  opTimerActive: boolean;
  myTimerTime: number;
  myTimerActive: boolean;
  handleOpTimeUpdate: (time: number) => void;
  handleMyTimeUpdate: (time: number) => void;
  stopTimers: () => void;
  whiteCaptures: string[];
  blackCaptures: string[];
  moves: {
    san: string;
    fen: string;
    index: number;
  }[];
  fen: string;
  setFen: React.Dispatch<React.SetStateAction<string>>;
  moveIndex: number;
  setMoveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const GameInfoTab = ({
  game,
  chess,
  orientation,
  opTimerTime,
  opTimerActive,
  myTimerTime,
  myTimerActive,
  handleOpTimeUpdate,
  whiteCaptures,
  blackCaptures,
  handleMyTimeUpdate,
  stopTimers,
  moves,
  fen,
  setFen,
  moveIndex,
  setMoveIndex,
}: Props) => {
  return (
    <div className="flex flex-col w-full mr-auto">
      <Timer
        currentTime={opTimerTime}
        isActive={opTimerActive}
        onTimeEnd={stopTimers}
        onTimeUpdate={handleOpTimeUpdate}
      />
      {orientation !== "white" ? (
        <>
          <div className="flex w-full h-10 bg-[#454545]">
            <Captures
              whiteCaptures={whiteCaptures}
              blackCaptures={blackCaptures}
              isWhite={false}
            />
            {calculateEvaluation(whiteCaptures, blackCaptures, "white") > 0 && (
              <p className="text-center text-white m-2">
                +{calculateEvaluation(whiteCaptures, blackCaptures, "white")}
              </p>
            )}
            <div className="h-10 w-10 bg-white ml-auto"></div>
          </div>
          <div className="text-xl  font-bold text-yellow-400 py-2 px-8 bg-[#313131]">
            <h2>{typeof game?.white !== "string" && game?.white.username}</h2>
          </div>
        </>
      ) : (
        <>
          <div className="flex w-full bg-[#454545]">
            <Captures
              whiteCaptures={whiteCaptures}
              blackCaptures={blackCaptures}
              isWhite={true}
            />
            {calculateEvaluation(whiteCaptures, blackCaptures, "black") > 0 && (
              <p className="text-center text-white m-2">
                +{calculateEvaluation(whiteCaptures, blackCaptures, "black")}
              </p>
            )}
            <div className="h-10 w-10 bg-black ml-auto"></div>
          </div>
          <div className="text-xl  font-bold text-yellow-400 py-2 px-8 bg-[#313131]">
            <h2>{typeof game?.black !== "string" && game?.black.username}</h2>
          </div>
        </>
      )}
      <div className="w-full  h-full">
        <MoveHistory
          chess={chess}
          moves={moves}
          fen={fen}
          setFen={setFen}
          moveIndex={moveIndex}
          setMoveIndex={setMoveIndex}
          showBar={true}
        />
      </div>
      {orientation === "white" ? (
        <>
          <div className="flex w-full bg-[#454545]">
            <Captures
              whiteCaptures={whiteCaptures}
              blackCaptures={blackCaptures}
              isWhite={false}
            />
            {calculateEvaluation(whiteCaptures, blackCaptures, "white") > 0 && (
              <p className="text-center text-white m-2">
                +{calculateEvaluation(whiteCaptures, blackCaptures, "white")}
              </p>
            )}
            <div className="h-10 w-10 bg-white ml-auto"></div>
          </div>
          <div className="text-xl  font-bold text-yellow-400 py-2 px-8 bg-[#313131]">
            <h2>{typeof game?.white !== "string" && game?.white.username}</h2>
          </div>
        </>
      ) : (
        <>
          <div className="flex w-full bg-[#454545]">
            <Captures
              whiteCaptures={whiteCaptures}
              blackCaptures={blackCaptures}
              isWhite={true}
            />
            {calculateEvaluation(whiteCaptures, blackCaptures, "black") > 0 && (
              <p className="text-center text-white m-2">
                +{calculateEvaluation(whiteCaptures, blackCaptures, "black")}
              </p>
            )}
            <div className="h-10 w-10 bg-black ml-auto"></div>
          </div>
          <div className="text-xl  font-bold text-yellow-400 py-2 px-8 bg-[#313131]">
            <h2>{typeof game?.black !== "string" && game?.black.username}</h2>
          </div>
        </>
      )}
      <Timer
        currentTime={myTimerTime}
        isActive={myTimerActive}
        onTimeEnd={stopTimers}
        onTimeUpdate={handleMyTimeUpdate}
      />
    </div>
  );
};

export default GameInfoTab;
