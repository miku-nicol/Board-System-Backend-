const express = require("express");
const validateUser = require("../../middleware/authMiddleware");
const { createCard, assignTag, updateCard, cardDelete, getCardsInColumn, setDueDate, moveCard } = require("./cardController");

const cardRouter = express.Router();
cardRouter.post("/", validateUser, createCard)
cardRouter.patch("/:id", validateUser, updateCard)
cardRouter.delete("/:id", validateUser, cardDelete)
cardRouter.get("/:columnId", validateUser, getCardsInColumn)
cardRouter.post("/:id/tag", validateUser, assignTag)
cardRouter.patch("/:id/due-date", validateUser, setDueDate);
cardRouter.patch('/:id/move', validateUser, moveCard);


module.exports = cardRouter;