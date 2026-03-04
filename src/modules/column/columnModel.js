const mongoose = require("mongoose");

const Schema = mongoose.Schema

const columnSchema = new Schema({

    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true

    },
    position:{
        type: Number,
        required: true,
        min:0
    }

},

{ timestamps: true}

)
module.exports= mongoose.model("Column", columnSchema)