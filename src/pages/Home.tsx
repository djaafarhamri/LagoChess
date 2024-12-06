import { useContext, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { SocketContext } from "../context/socket";
import Login from "./Login";
import Signup from "./Signup";
import OnlineUsers from "./OnlineUsers";
import ChallengePopup from "./ChallengePopup";
import { UserType } from "../types/types";

const Home = () => {
  const { user } = useUser();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [challenger, setChallenger] = useState(null);
  const [timer, setTimer] = useState(10);
  const navigate = useNavigate();
  const socket = useContext(SocketContext)
  const handleChallenge = (opponent: string) => {
    socket.emit("sendChallenge", { challenger: user?.username, opponent });
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleAccept = async () => {
    const response = await fetch("http://localhost:4000/api/game/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({opponant: user?.username, challenger}),
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
          setIsLoggedIn(true)
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
    socket.on("receiveChallenge", ({ challenger }) => {
      setChallenger(challenger);
      setTimer(10); // Reset timer when a new challenge comes in
    });

  }, [socket])


// Handle timer countdown
  useEffect(() => {
    if (challenger && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0) {
      handleDecline();
    }
  }, [challenger, timer]);


  return (
    <div className="container mx-auto px-4 py-8">
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Chess Game</h1>
          {showRegister ? (
            <>
              <Signup />
              <p className="mt-4 text-center">
                Already have an account?{' '}
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Login
                </button>
              </p>
            </>
          ) : (
            <>
              <Login setIsLoggedIn={setIsLoggedIn} />
              <p className="mt-4 text-center">
                Don't have an account?{' '}
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Register
                </button>
              </p>
            </>
          )}
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-6">Online Users</h1>
          <OnlineUsers users={onlineUsers} onChallenge={handleChallenge} />
        </div>
      )}
      {challenger && (
        <ChallengePopup
          challenger={challenger}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </div>
  )
 
  // return (
  //   <div>
  //   <h2>Online Users</h2>
  //   <ul>
  //     {onlineUsers.map((username) => (
  //       <li key={username}>
  //         {username}{" "}
  //         {username !== user.username && (
  //           <button onClick={() => handleChallenge(username)}>
  //             Challenge
  //           </button>
  //         )}
  //       </li>
  //     ))}
  //   </ul>

  //   {challenger && (
  //     <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 flex justify-center items-center">
  //       <div className="bg-white p-5 rounded-lg text-center shadow-md">
  //         <h3>{challenger} has challenged you!</h3>
  //         <p>Time remaining: {timer} seconds</p>
  //         <button onClick={handleAccept} className="mr-2.5 px-2.5 py-5 bg-[#4CAF50] text-white border-o rounded-md cursor-pointer">
  //           Accept
  //         </button>
  //         <button onClick={handleDecline} className="px-2.5 py-5 bg-[#f44336] text-white border-o rounded-md cursor-pointer">
  //           Decline
  //         </button>
  //       </div>
  //     </div>
  //   )}
  // </div>
  // );
};

export default Home;
