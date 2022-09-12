const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default:"comment",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },

    postId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      max: 500,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("comments", CommentSchema);
