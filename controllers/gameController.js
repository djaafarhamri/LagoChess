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

  // Join an existing game
  joinGame: async (req, res) => {
    try {
      const { gameId } = req.params;
      const { playerId } = req.body; // `playerId` is the black player
      const game = await Game.findById(gameId);
      if (!game) {
        return res
          .status(404)
          .json({ success: false, message: "Game not found" });
      }
      if (game.players.length >= 2) {
        return res
          .status(400)
          .json({ success: false, message: "Game is full" });
      }
      game.players.push(playerId);
      game.status = "active";
      await game.save();
      res.status(200).json({ success: true, game });
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
  syncTimers: async (gameId) => {
    const game = await Game.findById(gameId);
    const white = await User.findById(game.white) 
    const black = await User.findById(game.black) 
    const timers = calculateTimers(game);
    return {timers, lastMoveTimestamp: game.lastMoveTimestamp, white: white.username, black:black.username}
  },

  // Resign from a game
  resignGame: async (req, res) => {
    try {
      const { gameId } = req.params;
      const { playerId } = req.body;
      const game = await Game.findById(gameId);
      if (!game) {
        return res
          .status(404)
          .json({ success: false, message: "Game not found" });
      }
      game.status = "finished";
      game.result = "resign";
      game.winner = game.players.find((id) => id.toString() !== playerId);
      await game.save();
      res.status(200).json({ success: true, game });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Offer a draw
  offerDraw: async (req, res) => {
    try {
      const { gameId } = req.params;
      const { playerId } = req.body;
      const game = await Game.findById(gameId);
      if (!game) {
        return res
          .status(404)
          .json({ success: false, message: "Game not found" });
      }
      // Notify the opponent (usually handled via WebSocket)
      res.status(200).json({ success: true, message: "Draw offer sent" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Accept a draw
  acceptDraw: async (req, res) => {
    try {
      const { gameId } = req.params;
      const game = await Game.findById(gameId);
      if (!game) {
        return res
          .status(404)
          .json({ success: false, message: "Game not found" });
      }
      game.status = "finished";
      game.result = "draw";
      await game.save();
      res.status(200).json({ success: true, game });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
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
