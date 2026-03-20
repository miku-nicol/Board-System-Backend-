 const mongoose = require("mongoose");
const logger = require("../utils/logger");

 require("dotenv").config();

const dbConnection = process.env.DBSTRING;

const connectDB = async ()=>{
    try {
        logger.info(`Connecting to db.....`)
        await mongoose.connect(dbConnection)
        logger.info(`Mongodb connected successfully`)
    } catch (error) {
        logger.error(`Mongodb connection Failed:`,error.message)
        process.exit(1);
        
    }

};

module.exports = connectDB;