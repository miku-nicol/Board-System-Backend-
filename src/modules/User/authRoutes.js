const express = require("express");
const validateRegister = require("../../middleware/userValidate");
const validateUser = require("../../middleware/authMiddleware");
const { login, register } = require("./authController");

const userRouter= express.Router();
userRouter.post("/register", validateRegister, register);
userRouter.post("/login",  login);

module.exports = userRouter;
