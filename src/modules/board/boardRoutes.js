const express = require("express");
const validateUser = require("../../middleware/authMiddleware");
const { createBoard, getUserBoards, updateBoard, deleteBoard, addMember, removeMember } = require("./boardController");


const boardRouter = express.Router()

 boardRouter.post("/", validateUser, createBoard);
 boardRouter.get("/", validateUser, getUserBoards);
 boardRouter.patch("/:id", validateUser, updateBoard);
 boardRouter.delete("/:id", validateUser, deleteBoard);
 boardRouter.post("/:id/members", validateUser, addMember);
 boardRouter.delete("/:id/members", validateUser, removeMember);

 module.exports = boardRouter;