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

const Captures: React.FC<CapturesProps> = ({
    whiteCaptures,
    blackCaptures,
    isWhite,
  }) => {
    const pieceIcons = isWhite ? whitePieceIcons : blackPieceIcons;
    const captures = isWhite ? whiteCaptures : blackCaptures;

    const pieceCounts = countPieces(sortPieces(captures));

    return (
      <div className="flex">
        {Object.entries(pieceCounts).map(([piece, count]) => (
          <div key={piece} className="flex items-center">
            {pieceIcons[piece]}
            {count > 1 && (
              <span className={`text-${isWhite ? "white" : "black"} ml-[-6px]`}>
                x{count}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  export default Captures;