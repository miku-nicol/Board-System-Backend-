const express = require("express");
const validateUser = require("../../middleware/authMiddleware");
const { createBoard, getUserBoards, updateBoard, deleteBoard } = require("./boardController");

const boardRouter = express.Router()

 boardRouter.post("/", validateUser, createBoard);
 boardRouter.get("/", validateUser, getUserBoards);
 boardRouter.patch("/:id", validateUser, updateBoard);
 boardRouter.delete("/:id", validateUser, deleteBoard);

 module.exports = boardRouter;