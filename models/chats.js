const mongoose = require("mongoose");
//Sign up
const chatSchema = new mongoose.Schema(
  {
    messages: [
      {
        content: { type: String },
        sender: { type: String },
        sentAt: { type: Date, default: Date.now },
      },
    ],
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
  },
  { collection: "chats" }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
