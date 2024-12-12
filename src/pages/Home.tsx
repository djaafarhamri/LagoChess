import { useContext, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { SocketContext } from "../context/socket";
import ChallengePopup from "../components/home/ChallengePopup";
import ChallengerPopup from "../components/home/ChallengerPopup";
import OnlineUsers from "../components/home/OnlineUsers";
import QuickGame from "../components/home/QuickGame";

const Home = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("onlineUsers"); // Track active tab
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [challenger, setChallenger] = useState<string | null>(null);
  const [opponant, setOpponant] = useState<string>("");
  const [isChallengePopUpOpen, setIsChallengePopUpOpen] = useState(false);
  const [timer, setTimer] = useState("10 min");
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const handleAccept = async (timer: string) => {
    socket.emit("acceptChallenge", {
      challenger,
      opponent: user?.username,
      timer,
    });
    setChallenger(null);
  };

  const handleDecline = () => {
    setChallenger(null);
  };

  const handleChallenge = (opponent: string, timer: string) => {
    socket.emit("sendChallenge", {
      challenger: user?.username,
      opponent,
      timer,
    });
  };

  useEffect(() => {
    if (user) {
      socket.emit("userOnline", user.username);
    }
  }, [socket, user]);

  useEffect(() => {
    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };
    socket.on("onlineUsers", handleOnlineUsers);
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [socket]);

  useEffect(() => {
    const handleStartGame = ({ gameId }: { gameId: string }) => {
      navigate("/game/" + gameId);
    };
    socket.on("startGame", handleStartGame);
    return () => {
      socket.off("startGame", handleStartGame);
    };
  }, [navigate, socket]);

  useEffect(() => {
    const handleReceiveChallenge = ({
      challenger,
      timer,
    }: {
      challenger: string;
      timer: string;
    }) => {
      setChallenger(challenger);
      setTimer(timer);
    };
    socket.on("receiveChallenge", handleReceiveChallenge);
    return () => {
      socket.off("receiveChallenge", handleReceiveChallenge);
    };
  }, [socket]);

  return (
    <div className="container flex flex-col items-center mx-auto px-4 py-8">
      <div className="tabs flex space-x-4 mb-6">
        <button
          className={`tab py-2 px-4 rounded-lg text-white ${
            activeTab === "onlineUsers"
              ? "bg-blue-600"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => setActiveTab("onlineUsers")}
        >
          Online Users
        </button>
        <button
          className={`tab py-2 px-4 rounded-lg text-white ${
            activeTab === "quickGame"
              ? "bg-blue-600"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => setActiveTab("quickGame")}
        >
          Quick Game
        </button>
        <button
          className={`tab py-2 px-4 rounded-lg text-white ${
            activeTab === "leaderboard"
              ? "bg-blue-600"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => setActiveTab("leaderboard")}
        >
          Leaderboard
        </button>
      </div>

      <div className="bg-gray-800 w-full max-w-[640px] h-[640px] p-8 rounded-lg shadow-xl">
        {activeTab === "onlineUsers" && (
          <OnlineUsers
            users={onlineUsers}
            setOpponant={setOpponant}
            setIsChallengePopUpOpen={setIsChallengePopUpOpen}
          />
        )}

        {activeTab === "quickGame" && (
          <QuickGame />
        )}
          
        {activeTab === "leaderboard" && (
          <div className="leaderboard text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">
              Leaderboard
            </h2>
            <p className="text-gray-300">Coming Soon!</p>
          </div>
        )}
      </div>

      {challenger && (
        <ChallengerPopup
          challenger={challenger}
          timer={timer}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}

      <div className="relative">
        {isChallengePopUpOpen && (
          <ChallengePopup
            onChallenge={handleChallenge}
            username={opponant}
            setIsOpen={setIsChallengePopUpOpen}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
