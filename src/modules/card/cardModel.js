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
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tag"
            }

        ],
        dueDate: {
            type: Date,
            default: null


        },

        version: {
            type: Number,
            default: 1
        }

    },
{ timestamps: true}
)

cardSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "cardId",
    localField: "_id"
});

cardSchema.set("toJSON", { virtuals: true });
cardSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Card", cardSchema);