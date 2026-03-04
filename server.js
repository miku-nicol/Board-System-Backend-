const express = require("express");
const connectDB = require("./src/config/db");
const app = express();
const dotenv = require("dotenv");
const userRouter = require("./src/modules/User/authRoutes");
const boardRouter = require("./src/modules/board/boardRoutes");

 app.use(express.json());


 dotenv.config();

 
app.use("/api/v1/user", userRouter);
app.use("/api/v1/boards", boardRouter);
 
app.use("/", (req, res) => {
    res.end(`Begining of Talenvo program`);
 });


connectDB()
 const PORT= 9000;

 app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
 })