import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import { GameType } from "../types/types";
import { Chessboard } from "react-chessboard";

export default function GamesList() {
  const [games, setGames] = useState<GameType[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const getGamesByUser = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/game/games/user/${user?._id}`
      );
      const data = await res.json();
      if (res.ok) {
        setGames(data?.games);
      }
    };
    getGamesByUser();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
      <div className="chess-game wooden">
        <div className="chess-container">
          <div className="max-w-7xl mx-auto p-4">
            <div className="bg-[#2a2a2a] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6 border-b border-amber-500/20">
                <h2 className="text-2xl font-bold text-amber-300">My Games</h2>
              </div>
              
              {games?.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-amber-100/60">No games found!</p>
                </div>
              ) : (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {games.map((game: GameType) => (
                    <div
                      key={game._id}
                      className="bg-[#333333] rounded-lg p-4 hover:bg-[#3a3a3a] transition-colors duration-200 flex flex-col items-center space-y-4"
                    >
                      <div className="w-full aspect-square max-w-[200px] rounded-lg overflow-hidden">
                        <Chessboard
                          id={game._id}
                          position={game.fen}
                          boardWidth={200}
                          boardOrientation={
                            typeof game.black !== "string" &&
                            game.black.username === user?.username
                              ? "black"
                              : "white"
                          }
                          arePiecesDraggable={false}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-amber-100/60 text-sm mb-1">Opponent:</p>
                        <p className="text-amber-300 font-medium">
                          {typeof game.black !== "string" &&
                          game.black.username === user?.username
                            ? typeof game.white !== "string" && game.white.username
                            : typeof game.black !== "string" && game.black.username}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/analyze/${game._id}`)}
                        className="w-full px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-50"
                      >
                        Analyze
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
