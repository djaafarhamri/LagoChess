const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  white: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  black: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["waiting", "active", "finished"],
    default: "waiting",
  },
  result: {
    type: String,
    enum: ["win", "draw", "resign", "timeout", null],
    default: null,
  },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  moves: [
    {
      from: { type: String, required: true },
      to: { type: String, required: true },
      promotion: { type: String },
    },
  ],
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  currTurn: { type: String, default: "w" },
  timers: {
    white: { type: Number, default: 300 }, // in seconds (5 minutes)
    black: { type: Number, default: 300 },
  },
  createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
