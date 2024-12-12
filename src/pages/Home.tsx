import { useContext, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { SocketContext } from "../context/socket";
import ChallengePopup from "../components/home/ChallengePopup";
import ChallengerPopup from "../components/home/ChallengerPopup";
import OnlineUsers from "../components/home/OnlineUsers";

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

  interface TimerOption {
    label: string;
    value: string;
  }

  interface TimerCategory {
    name: string;
    options: TimerOption[];
  }
  const timerCategories: TimerCategory[] = [
    {
      name: "Bullet",
      options: [
        { label: "1 min", value: "1+0" },
        { label: "1 | 1", value: "1+1" },
        { label: "2 | 1", value: "2+1" },
        { label: "2 | 2", value: "2+2" },
        { label: "30 sec | 1", value: ".5+1" },
      ],
    },
    {
      name: "Blitz",
      options: [
        { label: "3 min", value: "3+0" },
        { label: "3 | 2", value: "3+2" },
        { label: "5 min", value: "5+0" },
        { label: "5 | 2", value: "5+2" },
        { label: "5 | 5", value: "5+5" },
      ],
    },
    {
      name: "Rapid",
      options: [
        { label: "10 min", value: "10+0" },
        { label: "15 | 10", value: "15+10" },
        { label: "10 | 5", value: "10+5" },
        { label: "20 min", value: "20+0" },
        { label: "60 min", value: "60+0" },
      ],
    },
  ];

  const handleQuickPair = (timer: string) => {
    socket.emit("quickPairing", { username: user?.username, timer });
  };

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
          <div className="quick-game text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">
              Quick Game
            </h2>
            <h3 className="flex text-white font-bold m-2">Bullet</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {timerCategories
                .find((category) => category.name === "Bullet")
                ?.options.map((option) => (
                  <button
                    key={option.value}
                    className="bg-[#454545] text-yellow-500 border border-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black px-6 py-3 transition-all ease-in-out transform hover:scale-105"
                    onClick={() => handleQuickPair(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
            <h3 className="flex text-white font-bold m-2">Blitz</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {timerCategories
                .find((category) => category.name === "Blitz")
                ?.options.map((option) => (
                  <button
                    key={option.value}
                    className="bg-[#454545] text-yellow-500 border border-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black px-6 py-3 transition-all ease-in-out transform hover:scale-105"
                    onClick={() => handleQuickPair(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
            <h3 className="flex text-white font-bold m-2">Rapid</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {timerCategories
                .find((category) => category.name === "Rapid")
                ?.options.map((option) => (
                  <button
                    key={option.value}
                    className="bg-[#454545] text-yellow-500 border border-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black px-6 py-3 transition-all ease-in-out transform hover:scale-105"
                    onClick={() => handleQuickPair(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          </div>
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
