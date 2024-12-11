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
const { makeMove, syncTimers } = require("./controllers/gameController");
const { sendMessage } = require("./controllers/chatController");
const calculateTimers = require("./utils/calculateTimers");
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
    const opponentSocketId = Object.keys(onlineUsers).find(
      (id) => onlineUsers[id] === opponent
    );

    if (opponentSocketId) {
      io.to(opponentSocketId).emit("receiveChallenge", { challenger, timer });
    }
  });
  // Handle challenge request
  socket.on("acceptChallenge", async ({ challenger, opponent, game }) => {
    const opponentSocketId = Object.keys(onlineUsers).find(
      (id) => onlineUsers[id] === opponent
    );

    const challengerSocketId = Object.keys(onlineUsers).find(
      (id) => onlineUsers[id] === challenger
    );
    io.to(opponentSocketId).emit("startGame", { id: game });
    io.to(challengerSocketId).emit("startGame", { id: game });
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
  socket.on("requestTimerSync", async ({gameId}) => {
    
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

  // Handle user disconnect
  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("onlineUsers", Object.values(onlineUsers)); // Broadcast updated user list
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/chat", chatRoutes);

server.listen(PORT, () => {
  console.log("listening on PORT : ", PORT);
});
