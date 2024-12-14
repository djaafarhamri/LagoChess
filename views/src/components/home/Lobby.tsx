import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";
import { useUser } from "../../context/UserContext";
type Player = {
  username: string;
};

type QuickPairingQueue = {
  [timer: string]: Player[];
};

const Lobby = () => {
  const [quickPairingQueue, setQuickPairingQueue] = useState<QuickPairingQueue>({});

  const socket = useContext(SocketContext);

  const { user } = useUser()

  useEffect(() => {
    // Request the current queue on mount
    socket.emit("requestQueue", {});
  }, [socket]);

  useEffect(() => {
    // Listen for updates to the quick-pairing queue
    socket.on("updateQueue", (queue: QuickPairingQueue) => {
      // Filter out empty timers
      const filteredQueue = Object.fromEntries(
        Object.entries(queue).filter(([_, players]) => players.length > 0)
      );
      console.log("filteredQueue: ", filteredQueue)
      setQuickPairingQueue(filteredQueue);
    });

    return () => {
      // Clean up the socket connection on unmount
      socket.off("updateQueue");
    };
  }, [socket]);

  const handleQuickPairing = (username: string | undefined, timer: string) => {
    socket.emit("quickPairing", { username, timer });
  };

  return (
    <div className="overflow-hidden sm:rounded-m">
      <h2 className="text-xl text-center font-bold text-yellow-400 p-4">
        Lobby
      </h2>
      {Object.keys(quickPairingQueue).length > 0 ? (
        <ul className="divide-y divide-gray-600">
          <li
            className="flex items-center px-4 py-4 w-full"
          >
            <div className="flex">
              <p className="text-sm font-medium text-gray-100 mr-10">
                Player
              </p>
              <p className="text-sm font-medium text-gray-100 ">Time</p>
            </div>
          </li>
          {Object.entries(quickPairingQueue).map(([timer, players]) =>
            players.map((player, index: number) => (
              player.username !== user?.username && (<li
                key={`${timer}-${index}`}
                className="flex items-center px-4 py-4 hover:bg-[#4E4D4D] w-full"
              >
                <div className="flex">
                  <p className="text-sm font-medium text-yellow-400 mr-10">
                    {player.username}
                  </p>
                  <p className="text-sm font-medium text-yellow-400 ">
                    {timer}
                  </p>
                </div>
                <button
                  onClick={() => handleQuickPairing(user?.username, timer)}
                  className="ml-auto mr-10 px-3 py-1 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                >
                  Play
                </button>
              </li>)
            ))
          )}
        </ul>
      ) : (
        <p className="text-center text-gray-300 py-4">
          No active players in the queue.
        </p>
      )}
    </div>
  );
};

export default Lobby;
