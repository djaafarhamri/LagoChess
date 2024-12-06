const { Router } = require("express");
const authController = require("../controllers/authController.js");
const { checkUser } = require("../middlewares/authMiddlewares.js");

const router = Router();

router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.get("/getUser", checkUser, (req, res) => {
    if (req.currUser) return res.status(200).json({user: req.currUser})
    return res.status(401).json("unauthorized")
});

module.exports = router;
