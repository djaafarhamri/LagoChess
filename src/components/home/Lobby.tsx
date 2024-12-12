import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";

const Lobby = () => {
  const [quickPairingQueue, setQuickPairingQueue] = useState({});

  const socket = useContext(SocketContext)
  useEffect(() => {
    // Listen for updates to the quick-pairing queue
    socket.emit("requestQueue", {});
  }, []);

  useEffect(() => {
    // Listen for updates to the quick-pairing queue
    socket.on("updateQueue", (queue) => {
        console.log("queue : ", queue)
      setQuickPairingQueue(queue);
    });

    return () => {
      // Clean up the socket connection on unmount
      socket.off("updateQueue");
    };
  }, []);

  return (
    <div>
      <h1>Lobby</h1>
      {Object.entries(quickPairingQueue).map(([timer, players]) => (
        <div key={timer}>
          <h2>Timer: {timer}</h2>
          <ul>
            {players.map((player, index: number) => (
              <li key={index}>{player.username}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Lobby;
