const mongoose= require("mongoose");

const Schema = mongoose.Schema;

const cardSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ""

            
        },
        position:{
            type: Number,
            required: true,
            min: 0

        },
        columnId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Column",
            required: true

        },
        tags:[
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tag"
            }]

        ],
        dueDate: {
            type: Date,
            default: null


        },

    },
{ timestamps: true}
)

module.exports = mongoose.model("Card", cardSchema);