"use client"

import { useContext } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { UserContext } from "../../context/UserContext"
import { Flag, Handshake } from "lucide-react"

type GameInfoProps = {
  playerColor: "white" | "black"
  opponent: string
  opponentRating: number
  onResign: () => void
  onOfferDraw: () => void
  offeredDraw: boolean
  onAcceptDraw: () => void
  onDeclineDraw: () => void
  gameOver: boolean
}

export function GameInfo({ 
  playerColor, 
  opponent, 
  opponentRating, 
  onResign, 
  onOfferDraw, 
  offeredDraw, 
  onAcceptDraw, 
  onDeclineDraw, 
  gameOver 
}: GameInfoProps) {
  const {user} = useContext(UserContext)
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="border-2 border-amber-500/30">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Opponent" />
            <AvatarFallback>OP</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-amber-100">{opponent || "Computer"}</p>
            <p className="text-sm text-amber-100/60">Rating: {opponentRating || 1500}</p>
          </div>
        </div>
        <div className="bg-amber-900/30 px-3 py-1 rounded-full text-amber-300 text-sm border border-amber-500/30">
          {playerColor === "white" ? "Black" : "White"}
        </div>
      </div>

      <div className="border-t border-amber-500/20 my-4"></div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="border-2 border-amber-500/30">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="You" />
            <AvatarFallback>YOU</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-amber-100">{user?.username}</p>
            <p className="text-sm text-amber-100/60">Rating: {1200}</p>
          </div>
        </div>
        <div className="bg-amber-900/30 px-3 py-1 rounded-full text-amber-300 text-sm border border-amber-500/30">
          {playerColor === "white" ? "White" : "Black"}
        </div>
      </div>
      
      <div className="border-t border-amber-500/20 my-4"></div>
      
      {!gameOver && (
        <div className="game-controls">
          <h3 className="text-amber-300 font-medium mb-3">Game Controls</h3>
          
          {offeredDraw ? (
            <div className="mb-3 p-3 bg-amber-700/30 border border-amber-500/30 rounded-md">
              <p className="text-amber-200 mb-2">Your opponent offered a draw</p>
              <div className="flex gap-2">
                <button 
                  onClick={onAcceptDraw}
                  className="flex-1 bg-green-700/70 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors"
                >
                  Accept
                </button>
                <button 
                  onClick={onDeclineDraw}
                  className="flex-1 bg-red-700/70 hover:bg-red-700 text-white px-3 py-2 rounded-md transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={onOfferDraw}
                className="flex items-center gap-2 bg-amber-900/60 hover:bg-amber-800 text-amber-100 px-3 py-2 rounded-md transition-colors flex-1"
              >
                <Handshake className="h-4 w-4" />
                <span>Offer Draw</span>
              </button>
              <button 
                onClick={onResign}
                className="flex items-center gap-2 bg-red-900/60 hover:bg-red-800 text-amber-100 px-3 py-2 rounded-md transition-colors flex-1"
              >
                <Flag className="h-4 w-4" />
                <span>Resign</span>
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="game-status mt-4">
        <h3 className="text-amber-300 font-medium mb-2">Game Status</h3>
        <div className="bg-amber-900/30 p-3 rounded-md border border-amber-500/20">
          {gameOver ? (
            <p className="text-red-400">Game over</p>
          ) : (
            <p className="text-amber-100">Game in progress</p>
          )}
          <p className="text-sm text-amber-100/60 mt-1">Time control: 5+0</p>
        </div>
      </div>
    </div>
  )
}