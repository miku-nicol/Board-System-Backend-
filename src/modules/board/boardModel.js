const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);