const express = require("express");
const validateRegister = require("../../middleware/userValidate");
const { login, register } = require("./userController");

const userRouter= express.Router();
userRouter.post("/register", validateRegister, register);
userRouter.post("/login",  login);

module.exports = userRouter;
