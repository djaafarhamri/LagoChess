const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const dotenv = require("dotenv");
dotenv.config();

//create token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};
const handleErrors = (err) => {
  let errors = { email: "", username: "", password: "" };

  // validation errors
  if (err.message.includes("UserSchema validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  } 

  // duplicate email error
  if (err.code === 11000) {
    if (err.message.includes("username")) {
      errors.username = "that username is already registered";
    } else if (err.message.includes("email")) {
      errors.email = "that email is already registered";
    }
    return errors;
  }
  return errors;
};

module.exports.signup_post = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.create({ email, username, password });
    res.status(201).json({ user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        return res.status(200).json({ user });
      }
    }
    return res.status(400).json("no user");
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
};
module.exports.logout_get = (req, res) => {
  return res.status(202).clearCookie("jwt").send("cookie cleared");
};

module.exports.update_profile = async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;
  const userId = req.currUser._id;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }
      const auth = await bcrypt.compare(currentPassword, user.password);
      if (!auth) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      user.password = newPassword;
    }

    // Update username and email if provided
    if (username) user.username = username;
    if (email) user.email = email;

    // Save changes
    await user.save();

    // Return updated user without password
    const updatedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
