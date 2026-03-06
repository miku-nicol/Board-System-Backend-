const express = require("express");
const validateUser = require("../../middleware/authMiddleware");
const { createCard } = require("../card/cardController");
const { createTag } = require("./tagController");

const tagRouter = express.Router();

tagRouter.post("/", validateUser, createTag)

module.exports = tagRouter;