import BlackBishop from "../../assets/BlackBishop";
import BlackKnight from "../../assets/BlackKnight";
import BlackPawn from "../../assets/BlackPawn";
import BlackQueen from "../../assets/BlackQueen";
import BlackRook from "../../assets/BlackRook";
import WhiteBishop from "../../assets/WhiteBishop";
import WhiteKnight from "../../assets/WhiteKnight";
import WhitePawn from "../../assets/WhitePawn";
import WhiteQueen from "../../assets/WhiteQueen";
import WhiteRook from "../../assets/WhiteRook";


const whitePieceIcons: { [key: string]: React.ReactElement } = {
    p: <WhitePawn />,
    n: <WhiteKnight />,
    b: <WhiteBishop />,
    r: <WhiteRook />,
    q: <WhiteQueen />,
  };

  const blackPieceIcons: { [key: string]: React.ReactElement } = {
    p: <BlackPawn />,
    n: <BlackKnight />,
    b: <BlackBishop />,
    r: <BlackRook />,
    q: <BlackQueen />,
  };

  interface CapturesProps {
    whiteCaptures: string[]; // Array of captured pieces for white
    blackCaptures: string[]; // Array of captured pieces for black
    isWhite: boolean; // Indicates whether the current player is white
  }
  

// Helper function to count the occurrences of each piece
const countPieces = (captures: string[]) => {
    const counts: { [key: string]: number } = {};
    for (const piece of captures) {
      counts[piece] = (counts[piece] || 0) + 1;
    }
    return counts;
  };


  const sortPieces = (pieces: string[]) => {
    const pieceOrder = ["q", "r", "b", "n", "p"];
    return pieces.sort((a, b) => pieceOrder.indexOf(a) - pieceOrder.indexOf(b));
  };

const pieceValues: { [key: string]: number } = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};

const calculateMaterialScore = (captures: string[]): number => {
  return captures.reduce((sum, piece) => sum + (pieceValues[piece] || 0), 0);
};

const Captures: React.FC<CapturesProps> = ({
    whiteCaptures,
    blackCaptures,
    isWhite,
  }) => {
    const pieceIcons = isWhite ? whitePieceIcons : blackPieceIcons;
    const captures = isWhite ? whiteCaptures : blackCaptures;

    const pieceCounts = countPieces(sortPieces(captures));
    const materialScore = calculateMaterialScore(captures);

    return (
      <div className="flex items-center space-x-1">
        <div className="flex items-center space-x-1">
          {Object.entries(pieceCounts).map(([piece, count]) => (
            <div key={piece} className="flex items-center group relative">
              <div className="w-6 h-6 flex items-center justify-center">
                {pieceIcons[piece]}
              </div>
              {count > 1 && (
                <span className={`text-xs font-mono ${isWhite ? 'text-[#ffd700]' : 'text-gray-400'}`}>
                  {count}
                </span>
              )}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {piece.toUpperCase()} × {count} = {pieceValues[piece] * count}
              </div>
            </div>
          ))}
        </div>
        {materialScore > 0 && (
          <span className={`text-sm font-mono ${isWhite ? 'text-[#ffd700]' : 'text-gray-400'}`}>
            (+{materialScore})
          </span>
        )}
      </div>
    );
  };

  export default Captures;