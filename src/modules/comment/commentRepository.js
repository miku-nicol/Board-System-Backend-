const commentModel = require("./commentModel")


const create = async (data) => {
    return await commentModel.create(data);
};


const findById = async (id) => {
    return await commentModel.findById(id);

};

const findByCard = async(cardId) => {
    return await commentModel.find({ cardId} ).sort({ createdAt: 1 })

};

const update = async(commentId, updateData) =>{
    return await commentModel.findByIdAndUpdate(commentId, updateData, { returnDocument: "after"})
};

const deleteById = async(id) => {
    return await commentModel.findByIdAndDelete(id);
};

const deleteReplies = async(parentId) => {
    return await commentModel.deleteMany({ parentComment: parentId })
}


module.exports = { create, findById, findByCard, update, deleteById, deleteReplies }