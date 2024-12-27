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
    <div className="flex justify-center mt-16">
      <div className="overflow-y-auto bg-gray-800 w-full max-w-[640px] h-[640px] p-8 rounded-lg shadow-xl">
        <div className=" sm:rounded-md">
          <h2 className="text-xl text-center font-bold text-yellow-400 p-4">
            My Games
          </h2>
          {games?.length === 0 ? (
            <p className="text-center text-gray-300 py-4">No games found!</p>
          ) : (
            <ul className="divide-y divide-gray-600">
              {games.map((game: GameType) => (
                <li
                  key={game._id}
                  className="flex items-center justify-between px-4 py-4 hover:bg-[#4E4D4D]"
                >
                  <div>
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
                      arePiecesDraggable={false} // Disable drag when it's not the player's turn
                    />
                  </div>
                  <div className="flex">
                    <p className="mx-2 text-sm font-medium text-white">
                      opponant :{" "}
                    </p>
                    <p className="text-sm font-medium text-yellow-400">
                      {typeof game.black !== "string" &&
                      game.black.username === user?.username
                        ? typeof game.white !== "string" && game.white.username
                        : typeof game.black !== "string" && game.black.username}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate(`/analyze/${game._id}`);
                    }}
                    className="ml-5 px-3 py-1 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:bg-[#454545]"
                  >
                    Analyze
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
