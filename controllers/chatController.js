const Chat = require("../models/chats");

module.exports = {
  sendMessage: async (gameId, content, sender) => {
    try {
      let chat = await Chat.findOne({ game: gameId });
      if (!chat) {
        chat = await Chat.create({ game: gameId });
      }
      // Update moves and turn
      chat.messages.push({ content, sender });
      await chat.save();
      return { success: true, chat };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  getChat: async (req, res) => {
    try {
      const { gameId } = req.params;
      const chat = await Chat.findOne({game: gameId})
        if (!chat) {
        return res
          .status(404)
          .json({ success: false, message: "chat not found" });
      }
      res.status(200).json({ success: true, chat });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
