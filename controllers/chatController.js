const Chat = require("../models/chats");

module.exports = {
    sendMessage: async(gameId, content, sender) => {
        try {
            let chat = await Chat.findOne({ game: gameId });
            if (!chat) {
                chat = await Chat.create({game: gameId})
            }
            // Update moves and turn
            chat.messages.push({content, sender});
            await chat.save();
            return ({ success: true, chat });
        } catch (error) {
            return ({ success: false, message: error.message });
        }
    }
}