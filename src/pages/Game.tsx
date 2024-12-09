import React, { useContext, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Move } from "chess.js";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import { SocketContext } from "../context/socket";
import { BoardOrientation, PromotionPieceOption, Square } from "react-chessboard/dist/chessboard/types";
import { GameType } from "../types/types";
import Timer from "./Timer";

const Game: React.FC = () => {
  const params = useParams();
  const gameId = params.id;

  const { user } = useUser()

  const [chess] = useState<Chess>(new Chess());
  const [game, setGame] = useState<GameType>();
  const [fen, setFen] = useState(chess.fen());
  const [orientation, setOrientation] = useState<BoardOrientation>("white"); // Manage turn logic
  
 const socket = useContext(SocketContext)
 const [myTimerActive, setMyTimerActive] = useState(false);
 const [opTimerActive, setOpTimerActive] = useState(false);

 const [myTimerTime, setMyTimerTime] = useState(300); // Example: 5 minutes in seconds
 const [opTimerTime, setOpTimerTime] = useState(300); // Example: 5 minutes in seconds

 const handleSwitchTimers = () => {
   setMyTimerActive((prev) => !prev);
   setOpTimerActive((prev) => !prev);
 };

  useEffect(() => {
    // Join the game room
    socket.emit("join-game", { gameId });
  }, [gameId, socket])

  useEffect(() => {
    const getGame = async () => {
      const response = await fetch(`http://localhost:4000/api/game/${gameId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
      });
  
      const data = await response.json()
      setGame(data?.game)
      setMyTimerTime(data?.game?.timers.white)
      setOpTimerTime(data?.game?.timers.white)
      if (data?.game.black?.username === user?.username) {
        setOrientation("black")
        setOpTimerActive((prev) => !prev);
      } else {
        setMyTimerActive((prev) => !prev);
      }
    }
    getGame()
  }, [gameId, user?.username])

  useEffect(() => {
  
    // Listen for moves from the server
    socket.on("move-made", ({player, move, whiteTimerTime, blackTimerTime}: {player: string, move: Move, whiteTimerTime: number, blackTimerTime: number}) => {
      console.log(`Player ${player} made move :`, move);
      if (chess.turn() !== orientation[0]) {
        const result = chess.move({ from: move.from, to: move.to, promotion: move.promotion });
        if (result) {
          setFen(chess.fen());
          if (orientation === 'black') {
            setMyTimerTime(blackTimerTime)
            setOpTimerTime(whiteTimerTime)
          } else {
            setMyTimerTime(whiteTimerTime)
            setOpTimerTime(blackTimerTime)
          }
          handleSwitchTimers()
        }
      }
    });
  }, [chess, gameId, orientation, socket]);

  useEffect(() => {
    console.log(chess.ascii())
    console.log(chess.fen())
  }, [chess, fen]);

  function makeAMove(move: {from: string, to: string, promotion?: string}) {
    let result: Move | null = null;
    result = chess.move(move);
    if (result) {
      setFen(chess.fen());
      handleSwitchTimers()
    }
    if (result) {
      const blackTimerTime = orientation === 'black' ? myTimerTime:opTimerTime
      const whiteTimerTime = orientation === 'white' ? myTimerTime:opTimerTime
      socket.emit("make-move", { gameId, player: user?.username, move, whiteTimerTime, blackTimerTime }); // Send move to server
    }
    return result;
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
    });

    // Illegal move
    if (move === null) return false;
    return true;
  }


  function onPromo(piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) {
    if (piece && promoteFromSquare && promoteToSquare) {
      const promotion = piece[1].toLowerCase()
      const move = makeAMove({
        from: promoteFromSquare,
        to: promoteToSquare,
        promotion, // Promote to queen for simplicity
      });
      if (move === null) return false;
      return true
    }
    return false
  }
  const handleMyTimeUpdate = (time: number) => {
    setMyTimerTime(time); // Update my timer's state
  };

  const handleOpTimeUpdate = (time: number) => {
    setOpTimerTime(time); // Update opponent's timer's state
  };

  return (
    <div className="container flex justify-around mx-auto px-4 py-8">
      <h2 className="text-xl w-full text-center font-bold text-yellow-400 p-4">
        Chat Room
      </h2>
      {game && (
        <div className="flex justify-center">
          <Chessboard
            id={gameId}
            position={fen}
            onPieceDrop={onDrop}
            onPromotionPieceSelect={onPromo}
            boardWidth={640}
            boardOrientation={orientation}
            arePiecesDraggable={chess.turn() === orientation[0]} // Disable drag when it's not the player's turn
            />
          
        </div>
      )}
      <div className="flex flex-col w-full mr-auto">
        <Timer  
          currentTime={myTimerTime}
          isActive={myTimerActive}
          onTimeEnd={() => console.log("My Timer Ended!")}
          onTimeUpdate={handleMyTimeUpdate}
        />
        <div className="w-full  h-full">
          
         </div>
        <Timer
          currentTime={opTimerTime}
          isActive={opTimerActive}
          onTimeEnd={() => console.log("My Timer Ended!")}
          onTimeUpdate={handleOpTimeUpdate}
        />
      </div>
    </div>
  );
};

export default Game;
