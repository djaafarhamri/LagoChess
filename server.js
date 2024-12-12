const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const server = http.createServer(app);
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const chatRoutes = require("./routes/chatRoutes");
const mongoose = require("mongoose");
const {
  makeMove,
  syncTimers,
  gameOver,
  createGame,
} = require("./controllers/gameController");
const { sendMessage } = require("./controllers/chatController");
const PORT = process.env.PORT || 4000;
// connect database

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("data base connecte"))
  .catch((err) => {
    throw new Error(err);
  });

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

const io = new Server(4001, {
  cors: { origin: "*" }, // Allow cross-origin requests
});

// Track active games
let onlineUsers = {}; // Store online users with socket IDs

const quickPairingQueues = {};

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins with username
  socket.on("userOnline", (username) => {
    onlineUsers[socket.id] = username;
    io.emit("onlineUsers", Object.values(onlineUsers)); // Broadcast updated user list
  });

  // Handle challenge request
  socket.on("sendChallenge", ({ challenger, opponent, timer }) => {
    console.log("send challenge", challenger, opponent, timer)
    const opponentSocketId = Object.keys(onlineUsers).find(
      (id) => onlineUsers[id] === opponent
    );
    console.log("send opponentSocketId : ", opponentSocketId)

    if (opponentSocketId) {
      io.to(opponentSocketId).emit("receiveChallenge", { challenger, timer });
    }
  });
  // Handle challenge request
  socket.on("acceptChallenge", async ({ challenger, opponent, timer }) => {
    const data = await createGame(challenger, opponent, timer)
    if (data.success) {
      const opponentSocketId = Object.keys(onlineUsers).find(
        (id) => onlineUsers[id] === opponent
      );
      
      const challengerSocketId = Object.keys(onlineUsers).find(
        (id) => onlineUsers[id] === challenger
      );
      io.to(opponentSocketId).emit("startGame", { gameId: data.game._id.toString() });
      io.to(challengerSocketId).emit("startGame", { gameId: data.game._id.toString() });
    }
  });

  // Join a game room
  socket.on("join-game", async (data) => {
    socket.join(data.gameId);
    // Notify others that the player joined
    socket.to(data.gameId).emit("player-joined", { player: data.player });

    const timers = await syncTimers(data.gameId);
    io.in(data.gameId).emit("timerSync", timers);

    console.log(`Player ${data.player} joined game ${data.gameId}`);
  });

  // Join a game room
  socket.on("requestTimerSync", async ({ gameId }) => {
    const timers = await syncTimers(gameId);
    io.in(gameId).emit("timerSync", timers);
  });

  // Join a game room
  socket.on("leave-game", ({ gameId, player }) => {
    socket.leave(gameId);
    // Notify others that the player joined
    socket.to(gameId).emit("player-left", { player });
    console.log(`Player ${player} left game ${gameId}`);
  });

  // Handle moves
  socket.on("make-move", async ({ gameId, player, move, index, fen, san }) => {
    // Broadcast move to other players
    socket.to(gameId).emit("move-made", { player, move });

    const timers = await syncTimers(gameId);
    io.in(gameId).emit("timerSync", timers);

    console.log(`Player ${player} made move in game ${gameId}:`, move);

    await makeMove(gameId, san, index, fen);
  });

  socket.on("send-message", ({ gameId, content, sender }) => {
    socket
      .to(gameId)
      .emit("message-received", { content, sender, sentAt: Date.now });
    sendMessage(gameId, content, sender);
  });

  socket.on("draw-offer", ({ gameId, player }) => {
    socket.to(gameId).emit("draw-offer", { player });
  });

  socket.on("accept-draw", async ({ gameId, player }) => {
    socket.to(gameId).emit("accept-draw", { player });
    await gameOver(gameId, "draw", "None", "Draw");
  });

  socket.on("resign", async ({ gameId, player, winner }) => {
    socket.to(gameId).emit("resign", { player });
    await gameOver(gameId, "win", winner, "Resign");
  });

  socket.on("game-over", async ({ gameId, winner, reason }) => {
    await gameOver(gameId, "win", winner, reason);
  });
  socket.on("quickPairing", async({ username, timer }) => {
    // Ensure the queue for this timer exists
    if (!quickPairingQueues[timer]) {
      quickPairingQueues[timer] = [];
    }
    
    const queue = quickPairingQueues[timer];
    
    if (queue.length > 0) {
      // Match with another player
      const opponent = queue.shift(); // Get the first player in the queue
      console.log("quick pairs: ", username, opponent.username, timer)
      const data = await createGame(username, opponent.username, timer);
      if (data.success) {
        console.log("id : ", data.game._id.toString())
        // Notify both players about the game
        io.to(socket.id).emit("startGame", { gameId: data.game._id.toString() });
        io.to(opponent.socket.id).emit("startGame", { gameId: data.game._id.toString() });
      }
    } else {
      // Add the player to the queue
      queue.push({ username, socket });
      console.log("quick pairs: ", quickPairingQueues)
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    for (const [timer, queue] of Object.entries(quickPairingQueues)) {
      const index = queue.findIndex((player) => player.socket === socket);
      if (index !== -1) queue.splice(index, 1);
    }
    io.emit("onlineUsers", Object.values(onlineUsers)); // Broadcast updated user list
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/chat", chatRoutes);

server.listen(PORT, () => {
  console.log("listening on PORT : ", PORT);
});
