const { required } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema (
    {
        cardId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        content: {
            type: String,
            required: true
        },

        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },

        edited: {
            type: Boolean,
            default: false
        },

    },

    { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);