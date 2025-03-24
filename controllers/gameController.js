const Game = require("../models/games");
const User = require("../models/users");
const calculateTimers = require("../utils/calculateTimers");
const { spawn } = require("child_process");

let stockfishProcesses = {}; // Store Stockfish instances by roomId or gameId

// Create a new game
module.exports.createGame = async (opponant, challenger, timer) => {
  try {
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
    return { success: true, game: newGame };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Make a move
module.exports.makeMove = async (gameId, san, index, fen) => {
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
};

// Make a move
module.exports.gameOver = async (gameId, result, winner, reason) => {
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
    game.reason === "Time's Up" ? game.winner === "black" ? game.timers.white = 0 : game.timers.black = 0 : null;
    await game.save();
    return { success: true, game };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports.syncTimers = async (gameId) => {
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
};

// Get game details
module.exports.getGame = async (req, res) => {
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
};


// Get game details
module.exports.getGameByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const games = await Game.find({$or: [{black: id}, {white: id}]})
      .populate("white")
      .populate("black");
    if (!games) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }
    res.status(200).json({ success: true, games });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports.startStockfishForGame = (roomId) => {
  if (!stockfishProcesses[roomId]) {
    const stockfishPath = process.env.STOCKFISH_PATH || "stockfish";
    const stockfishProcess = spawn(stockfishPath);
    stockfishProcess.stdin.write("uci\n"); // Initialize Stockfish
    stockfishProcesses[roomId] = stockfishProcess;
  }
};
module.exports.getEval = (fen, roomId, io) => {
  if (!stockfishProcesses[roomId]) {
    console.log("Stockfish is not running for this game");
    return io.in(roomId).emit("evalError", {
      message: "Stockfish is not running for this game",
    });
  }
  console.log(fen);
  const stockfishProcess = stockfishProcesses[roomId];
  let output = "";
  let evaluation = null;
  let bestMove = "";
  let principalVariation = "";

  // Send the fen and moves to Stockfish
  console.log(`position fen${fen}\n`)
  stockfishProcess.stdin.write(`position fen ${fen}\n`);
  stockfishProcess.stdin.write("go depth 15\n");

  // Capture Stockfish's output
  stockfishProcess.stdout.on("data", (data) => {
    const dataString = data.toString();
    output += dataString;

    // Extract evaluation score (centipawn)
    const evalMatch = dataString.match(/info .* score cp (-?\d+)/);
    if (evalMatch) {
      evaluation = parseInt(evalMatch[1], 10) / 100; // Convert to pawns
    }

    // Extract best move
    const bestMoveMatch = dataString.match(/bestmove\s(\S+)/);
    if (bestMoveMatch) {
      bestMove = bestMoveMatch[1];
    }

    // Extract principal variation (PV)
    const pvMatch = dataString.match(/info .* pv (.+)/);
    if (pvMatch) {
      principalVariation = pvMatch[1];
    }

    // Emit evaluation and best move to the room
    console.log("evalResult", {
      evaluation,
      bestMove,
      principalVariation,
    });
    io.in(roomId).emit("evalResult", {
      evaluation,
      bestMove,
      principalVariation,
    });
  });

  // Log all process events to debug
  stockfishProcess.on("exit", (code, signal) => {
    console.log(
      `Stockfish process exited for game ${roomId} with code ${code}, signal ${signal}`
    );
  });
};

// Function to stop Stockfish for a specific roomId
module.exports.stopStockfishForGame = (roomId) => {
  const stockfishProcess = stockfishProcesses[roomId];
  if (stockfishProcess) {
    console.log(`Stopping Stockfish for roomId: ${roomId}`);
    stockfishProcess.stdin.write("quit\n"); // Quit Stockfish gracefully
    stockfishProcess.kill(); // Force kill the process if necessary
    delete stockfishProcesses[roomId];
  }
};
// Function to stop all Stockfish processes (for cleanup)
module.exports.stopAllStockfishProcesses = () => {
  console.log("Stopping all Stockfish processes...");
  for (let roomId in stockfishProcesses) {
    this.stopStockfishForGame(roomId);
  }
};

module.exports.getUserStats = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all games where the user is either white or black
    const games = await Game.find({
      $or: [
        { white: user._id },
        { black: user._id }
      ]
    });

    let gamesPlayed = games.length;
    let gamesWon = 0;
    let gamesLost = 0;
    let gamesDrawn = 0;

    games.forEach(game => {
      if (game.result === "draw") {
        gamesDrawn++;
      } else if (
        (game.result === "white" && game.white.toString() === user._id.toString()) ||
        (game.result === "black" && game.black.toString() === user._id.toString())
      ) {
        gamesWon++;
      } else {
        gamesLost++;
      }
    });

    const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

    res.status(200).json({
      gamesPlayed,
      gamesWon,
      gamesLost,
      gamesDrawn,
      winRate
    });
  } catch (err) {
    console.error("Error getting user stats:", err);
    res.status(500).json({ message: "Error getting user statistics" });
  }
};
