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
const mongoose = require("mongoose");
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

app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173"]
}))
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

const io = new Server(4001, {
    cors: { origin: "*" } // Allow cross-origin requests
});

// Track active games
let onlineUsers = {}; // Store online users with socket IDs


// Handle socket connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // User joins with username
    socket.on("userOnline", (username) => {
        console.log("userOnline")
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
    socket.on("join-game", ({ gameId, player }) => {
        socket.join(gameId);
        // Notify others that the player joined
        socket.to(gameId).emit("player-joined", { player });
        console.log(`Player ${player} joined game ${gameId}`);
    });

    // Handle moves
    socket.on("make-move", ({ gameId, player, move }) => {
        // Broadcast move to other players
        socket.to(gameId).emit("move-made", { player, move });

        console.log(`Player ${player} made move in game ${gameId}:`, move);
    });
    // Handle user disconnect
    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        io.emit("onlineUsers", Object.values(onlineUsers)); // Broadcast updated user list
    });

});


app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

server.listen(PORT, () => {
  console.log("listening on PORT : ", PORT);
});
