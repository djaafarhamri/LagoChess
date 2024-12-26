const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

// Game routes
router.post("/create", gameController.createGame);
router.post("/:gameId/move", gameController.makeMove);
router.get("/game/:gameId", gameController.getGame);
router.get("/getEval", gameController.getEval)

module.exports = router;
