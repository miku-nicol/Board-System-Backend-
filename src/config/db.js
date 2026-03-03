 const mongoose = require("mongoose");

 require("dotenv").config();

const dbConnection = process.env.DBSTRING;

const connectDB = async ()=>{
    try {
        console.log(`Connecting to db.....`)
        await mongoose.connect(dbConnection)
        console.log(`Mongodb connected successfully`)
    } catch (error) {
        console.error(`Mongodb connection Failed:`,error.message)
        process.exit(1);
        
    }

};

module.exports = connectDB;