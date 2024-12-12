const Game = require("../models/games");
const User = require("../models/users");
const calculateTimers = require("../utils/calculateTimers");

module.exports = {
  // Create a new game
  createGame: async (req, res) => {
    try {
      const { opponant, challenger, timer } = req.body; // `playerId` is the white player
      const white = await User.findOne({ username: opponant });
      const black = await User.findOne({ username: challenger });
      const newGame = new Game({
        white,
        black,
        timers: {
          white: parseInt(timer?.split("+")[0]) * 60,
          black: parseInt(timer?.split("+")[0]) * 60,
        },
      });
      await newGame.save();
      res.status(201).json({ success: true, game: newGame });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Make a move
  makeMove: async (gameId, san, index, fen) => {
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        return { success: false, message: "Game not found" };
      }
      // Update moves and turn
      game.moves.push({ san, fen, index });
      game.fen = fen;
      const timers = calculateTimers(game);
      if (game.currTurn === "w") {
        game.timers.white = timers.white;
      } else {
        game.timers.black = timers.black;
      }

      game.currTurn = game.currTurn === "w" ? "b" : "w";
      game.lastMoveTimestamp = Date.now();
      await game.save();
      return { success: true, game };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Make a move
  gameOver: async (gameId, result, winner, reason) => {
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        return { success: false, message: "Game not found" };
      }
      // Update moves and turn
      game.status = "finished";
      game.result = result;
      game.winner = winner;
      game.reason = reason;
      await game.save();
      return { success: true, game };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  syncTimers: async (gameId) => {
    const game = await Game.findById(gameId);
    const white = await User.findById(game.white);
    const black = await User.findById(game.black);
    if (game.status !== "finished") {
      const timers = calculateTimers(game);
      return {
        timers,
        lastMoveTimestamp: game.lastMoveTimestamp,
        white: white.username,
        black: black.username,
      };
    }
    return {
      timers: game.timers,
      lastMoveTimestamp: game.lastMoveTimestamp,
      white: white.username,
      black: black.username,
    };
  },

  // Get game details
  getGame: async (req, res) => {
    try {
      const { gameId } = req.params;
      const game = await Game.findById(gameId)
        .populate("white")
        .populate("black");
      if (!game) {
        return res
          .status(404)
          .json({ success: false, message: "Game not found" });
      }
      res.status(200).json({ success: true, game });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
