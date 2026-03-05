const express = require("express");
const validateUser = require("../../middleware/authMiddleware");
const { createColumn, updateColumn, deleteColumn } = require("./columnController");

const columnRouter = express.Router()
columnRouter.post("/", validateUser, createColumn);
columnRouter.patch("/:id", validateUser, updateColumn);
columnRouter.delete("/:id", validateUser, deleteColumn);

module.exports = columnRouter;