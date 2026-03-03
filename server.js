const express = require("express");
const connectDB = require("./src/config/db");
const app = express();
const dotenv = require("dotenv");

 app.use(express.json());


 dotenv.config();

 app.use("/", (req, res) => {
    res.end(`Begining of Talenvo program`);
 });

 

connectDB()
 const PORT= 9000;

 app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
 })