const express = require("express");
const validateUser = require("../../middleware/authMiddleware");
const { addComment, editComment, deleteComment, getCardComments } = require("./commentController");

const commentRouter = express.Router();

commentRouter.post("/", validateUser, addComment);
commentRouter.patch("/edit/:id", validateUser, editComment);
commentRouter.delete("/:commentId", validateUser, deleteComment);
commentRouter.get("/get/:cardId", validateUser, getCardComments);

module.exports = { commentRouter };