const jwt = require("jsonwebtoken");
const User = require("../models/users");
const dotenv = require("dotenv");
dotenv.config();

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(400);
      } else {
        next();
      }
    });
  } else {
    res.json("object");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token)
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err)
        req.currUser = null;
        next();
      } else {
        console.log(decodedToken)
        let user = await User.findById(decodedToken.id);
        req.currUser = user;
        next();
      }
    });
  } else {
    req.currUser = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
