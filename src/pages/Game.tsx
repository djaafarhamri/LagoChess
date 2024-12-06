import React, { useContext, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Move } from "chess.js";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import { SocketContext } from "../context/socket";
import { BoardOrientation, PromotionPieceOption, Square } from "react-chessboard/dist/chessboard/types";

const Game: React.FC = () => {
  const params = useParams();
  const gameId = params.id;

  const { user } = useUser()

  const [chess, setChess] = useState<Chess>(new Chess());
  // const [game, setGame] = useState();
  const [fen, setFen] = useState(chess.fen());
  const [orientation, setOrientation] = useState<BoardOrientation>("white"); // Manage turn logic

  const socket = useContext(SocketContext)

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
      if (data?.game.black?.username === user?.username) {
        setOrientation("black")
      }
    }
    getGame()
  }, [gameId, user?.username])

  useEffect(() => {
  
    // Listen for moves from the server
    socket.on("move-made", ({player, move}: {player: string, move: Move}) => {
      console.log(`Player ${player} made move :`, move);
      setChess((prevChess) => {
        const newChess = new Chess(prevChess.fen());
        const result = newChess.move({ from: move.from, to: move.to, promotion: move.promotion });
        if (result) {
          setFen(newChess.fen());
        }
        return newChess;
      });
    });
  }, [chess, gameId, socket]);

  useEffect(() => {
    console.log(chess.ascii())
    console.log(chess.fen())
  }, [chess, fen]);


  function makeAMove(move: {from: string, to: string, promotion?: string}) {
    let result: Move | null = null;
    setChess((prevChess) => {
      const newChess = new Chess(prevChess.fen());
      result = newChess.move(move);
      if (result) {
        setFen(newChess.fen());
      }
      return newChess;
    });
    if (result) {
      socket.emit("make-move", { gameId, player: user?.username, move }); // Send move to server
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


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chess Game</h1>
      <div className="flex justify-center">
        <Chessboard
          id={gameId}
          position={fen}
          onPieceDrop={onDrop}
          onPromotionPieceSelect={onPromo}
          boardWidth={500}
          boardOrientation={orientation}
          arePiecesDraggable={chess.turn() === orientation[0]} // Disable drag when it's not the player's turn
        />
      </div>
    </div>
  );
};

export default Game;
