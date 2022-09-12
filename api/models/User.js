const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  { type: {
      type: String,
      default:"user",
      required: true,
    },
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "1662453211502noAvatar.png",
    },
    coverPicture: {
      type: String,
      default: "1662453041356DefaultCover.png",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    bio:{
      type: String,
      max:6,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
