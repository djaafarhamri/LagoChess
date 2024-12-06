const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    white: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
    },
    black: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
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
    moves: [{
        from: { type: String, required: true },
        to: { type: String, required: true },
        promotion: { type: String },
}],
    timers: {
        white: { type: Number, default: 300000 }, // in milliseconds (5 minutes)
        black: { type: Number, default: 300000 },
    },
    createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
