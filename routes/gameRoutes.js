const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

// Game routes
router.post("/create", gameController.createGame);
router.post("/:gameId/join", gameController.joinGame);
router.post("/:gameId/move", gameController.makeMove);
router.post("/:gameId/resign", gameController.resignGame);
router.post("/:gameId/offer-draw", gameController.offerDraw);
router.post("/:gameId/accept-draw", gameController.acceptDraw);
router.get("/:gameId", gameController.getGame);

module.exports = router;
