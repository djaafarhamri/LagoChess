import { ReactElement, useContext, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { SocketContext } from "../context/socket";
import ChallengePopup from "../components/home/ChallengePopup";
import ChallengerPopup from "../components/home/ChallengerPopup";
import OnlineUsers from "../components/home/OnlineUsers";
import QuickGame from "../components/home/QuickGame";
import Lobby from "../components/home/Lobby";
import PairingLoadingPopup from "../components/home/PairingLoadingPopup";
import SentChallengePopup from "../components/home/SentChallengPopup";
import NotificationManager from "../components/home/NotificationManager";

const Home = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("quickGame"); // Track active tab
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [challenger, setChallenger] = useState<string | null>(null);
  const [opponant, setOpponant] = useState<string>("");
  const [isChallengePopUpOpen, setIsChallengePopUpOpen] = useState(false);
  const [isSentChallengePopUpOpen, setIsSentChallengePopUpOpen] =
    useState(false);
  const [sentChallengeUsername, setSentChallengeUsername] = useState("");
  const [timerPairing, setTimerPairing] = useState<string | null>(null);
  const [isPairingLoadingPopUpOpen, setIsPairingLoadingPopUpOpen] =
    useState(false);
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
    setSentChallengeUsername(opponant);
    setIsSentChallengePopUpOpen(true);
    // Close the popup after 10 seconds

  };
  const handleSendChallengeTimeout = () => {
    setSentChallengeUsername("");
    setIsSentChallengePopUpOpen(false); // Close the popup on timeout
  };
  const handleReceivedChallengeTimeout = () => {
    setChallenger(null);
  }

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

  const handlePairingLoadingPopupClose = () => {
    socket.emit("cancelPairing", { username: user?.username });
    setIsPairingLoadingPopUpOpen(false);
  };

  const handleQuickPair = (timer: string) => {
    socket.emit("quickPairing", { username: user?.username, timer });
    setTimerPairing(timer);
    setIsPairingLoadingPopUpOpen(true);
  };

  const [popups, setPopups] = useState<{id: string, component: ReactElement, height: number}[]>([]);

  const addPopup = (id: string, popup: ReactElement, height: number) => {
    setPopups((prev) => [...prev, { id, component: popup, height }]);
  };

  const removePopup = (id: string) => {
    setPopups((prev) => prev.filter((popup) => popup.id !== id));
  };

  useEffect(() => {
    if (isSentChallengePopUpOpen) {
      addPopup("SentChallengePopup",
        <SentChallengePopup username={sentChallengeUsername} onTimeout={handleSendChallengeTimeout} />, 78
      )
    } else {
      removePopup("SentChallengePopup")
    }

  }, [isSentChallengePopUpOpen])

  useEffect(() => {
    if (isPairingLoadingPopUpOpen) {
      addPopup("PairingLoadingPopup",
        <PairingLoadingPopup timer={timerPairing} onCancel={handlePairingLoadingPopupClose} />, 92
      )
    } else {
      removePopup("PairingLoadingPopup")
    }

  }, [isPairingLoadingPopUpOpen])

  useEffect(() => {
    if (challenger) {
      addPopup("challenger",
        <ChallengerPopup
          challenger={challenger}
          timer={timer}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onTimeout={handleReceivedChallengeTimeout}
        />, 150
      )
    } else {
      removePopup("challenger")
    }

  }, [challenger])

  return (
    <div className="container flex flex-col items-center mx-auto px-4 py-8">
      <div className="tabs flex space-x-4 mb-6">
        <button
          className={`w-32 tab py-2 px-4 rounded-lg text-white ${
            activeTab === "quickGame"
              ? "bg-blue-600"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => setActiveTab("quickGame")}
        >
          Quick Game
        </button>
        <button
          className={`w-32 tab py-2 px-4 rounded-lg text-white ${
            activeTab === "onlineUsers"
              ? "bg-blue-600"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => setActiveTab("onlineUsers")}
        >
          Online Users
        </button>
        <button
          className={`w-32 tab py-2 px-4 rounded-lg text-white ${
            activeTab === "lobby"
              ? "bg-blue-600"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => setActiveTab("lobby")}
        >
          Lobby
        </button>
      </div>

      <div className="bg-gray-800 w-full max-w-[640px] h-[640px] p-8 rounded-lg shadow-xl">
        {activeTab === "quickGame" && (
          <QuickGame onQuickPair={handleQuickPair} />
        )}
        {activeTab === "onlineUsers" && (
          <OnlineUsers
            users={onlineUsers}
            setOpponant={setOpponant}
            setIsChallengePopUpOpen={setIsChallengePopUpOpen}
            sentChallengeUsername={sentChallengeUsername}
          />
        )}

        {activeTab === "lobby" && <Lobby />}
      </div>

      <div className="relative">
        {isChallengePopUpOpen && (
          <ChallengePopup
            onChallenge={handleChallenge}
            username={opponant}
            setIsOpen={setIsChallengePopUpOpen}
          />
        )}
      </div>

      <div className="relative">
          <NotificationManager popups={popups} />
      </div>

    </div>
  );
};

export default Home;