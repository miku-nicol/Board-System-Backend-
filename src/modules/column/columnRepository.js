const columnModel = require("./columnModel")


const create = async (data) => {
    return await columnModel.create(data);
};

const findById = async (id) => {
    return await columnModel.findById(id);

};

const updateById = async (id, boardId, data) => {
    return await columnModel.findOneAndUpdate(
        { _id: id, boardId},
        data,
        { returnDocument: "after", runValidators: true }
    );
};

const deleteById = async (id, boardId) => {
    return await columnModel.findOneAndDelete({_id: id, boardId})
}


module.exports = { create, deleteById, findById, updateById }