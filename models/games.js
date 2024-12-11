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
  moves: {
    type: [{
      san: { type: String },
      fen: { type: String, required: true, default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" },
      index: { type: Number, required: true, default: 0 },
    }],
    default: [
        {
          san: "",
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          index: 0,
        },
      ],
    },
  fen: {
    type: String,
    default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  lastMoveTimestamp: { type: Date, default: Date.now }, // New field
  currTurn: { type: String, default: "w" },
  timers: {
    white: { type: Number, default: 300000 }, // in miliseconds (5 minutes)
    black: { type: Number, default: 300000 },
  },
  createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
