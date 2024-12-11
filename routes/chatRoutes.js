const express = require("express");
const chatController = require("../controllers/chatController");
const router = express.Router();

// Game routes
router.get("/:gameId", chatController.getChat);

module.exports = router;
