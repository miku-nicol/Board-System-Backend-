const express = require("express");
const validateUser = require("../../middleware/authMiddleware");
const { createCard, assignTag, updateCard, cardDelete, getCardsInColumn, setDueDate } = require("./cardController");

const cardRouter = express.Router();
cardRouter.post("/", validateUser, createCard)
cardRouter.patch("/:id", validateUser, updateCard)
cardRouter.delete("/:id", validateUser, cardDelete)
cardRouter.get("/column/:columnId", validateUser, getCardsInColumn)
cardRouter.post("/:id/tag", validateUser, assignTag)
cardRouter.post("/:id/due-data", validateUser, setDueDate);


module.exports = cardRouter;