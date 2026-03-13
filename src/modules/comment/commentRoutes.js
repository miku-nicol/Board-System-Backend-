const express = require("express");
const validateUser = require("../../middleware/authMiddleware");
const { addComment, editComment, deleteComment, getCardComments } = require("./commentController");

const commentRouter = express.Router();

commentRouter.post("/", validateUser, addComment);
commentRouter.patch("/edit/:id", validateUser, editComment);
commentRouter.delete("/:id", validateUser, deleteComment);
commentRouter.get("/get", validateUser, getCardComments);

module.exports = { commentRouter };