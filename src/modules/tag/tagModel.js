const mongoose= require("mongoose");

const Schema= mongoose.Schema;

const tagSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
        },
        boardId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
            required: true

        }
    
    },
    {timestamps: true} 
)

tagSchema.index({ boardId: 1, name: 1}, { unique: true });

module.exports= mongoose.model("Tag", tagSchema)