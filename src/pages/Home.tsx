import { useContext, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { SocketContext } from "../context/socket";
import OnlineUsers from "../components/OnlineUsers";
import ChallengePopup from "../components/ChallengePopup";
import { UserType } from "../types/types";
import ChallengerPopup from "../components/ChallengerPopup";


const Home = () => {
  const { user } = useUser();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [challenger, setChallenger] = useState(null);
  const [opponant, setOpponant] = useState<string>("");
  const [isChallengePopUpOpen, setIsChallengePopUpOpen] = useState(false);
  const [timer, setTimer] = useState("10 min");
  const navigate = useNavigate();
  const socket = useContext(SocketContext)
  const handleChallenge = (opponent: string, timer: string) => {
    socket.emit("sendChallenge", { challenger: user?.username, opponent, timer });
  };
  const handleAccept = async (timer: string) => {
    const response = await fetch("http://localhost:4000/api/game/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({opponant: user?.username, challenger, timer}),
      credentials: 'include'
    });

    const data = await response.json()
    console.log(data?.game)
    socket.emit("acceptChallenge", { challenger, opponent: user?.username, game: data.game._id });
    setChallenger(null);
  };

  const handleDecline = () => {
    setChallenger(null);
  };

  const { login } = useUser()
  useEffect(() => {
    const getUser = async (login: (userData: UserType) => void) => {
      try {
        const response = await fetch("http://localhost:4000/api/auth/getUser", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json()
          console.log(data?.user)
          login(data.user)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getUser(login)
  }, [login])

  useEffect(() => {
    if (user) {
      socket.emit("userOnline", user.username);
    }
  }, [socket, user]);

  useEffect(() => {
      // Listen for updated online user list
      socket.on("onlineUsers", (users) => {
        console.log("onlineUsers")
        setOnlineUsers(users);
      });
  }, [socket])


  useEffect(() => {
    // Listen for updated online user list
    socket.on("startGame", (game) => {
      console.log("new Game")
      navigate('/game/' + game.id)
    });

  }, [navigate, socket])

  useEffect(() => {
    // Listen for incoming challenges
    socket.on("receiveChallenge", ({ challenger, timer }) => {
      setChallenger(challenger);
      setTimer(timer); // Reset timer when a new challenge comes in
    });

  }, [socket])

  return (
    <div className="container flex-col flex items-center mx-auto px-4 py-8">
      <div className="bg-[#454545] w-full max-w-[640px] h-[640px] p-12 rounded-lg shadow-xl">
        <OnlineUsers
          users={onlineUsers}
          setOpponant={setOpponant}
          setIsChallengePopUpOpen={setIsChallengePopUpOpen}
        />
      </div>

      {/* )} */}
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
  )
 
};

export default Home;
