const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

//Sign up
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please enter an email"],
      unique: true,
      validate: [isEmail, "please enter a valid email"],
    },
    username: {
      type: String,
      required: [true, "please enter an username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      minlength: [6, "minimum password length is 6 characters"],
    },
    games : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    }]
  },
  { collection: "users" }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const model = mongoose.model("User", userSchema);

module.exports = model;
