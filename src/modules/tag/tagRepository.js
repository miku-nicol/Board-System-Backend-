const tagModel = require("./tagModel")


const create = async (data) =>{
    return await tagModel.create(data);
};

const findByBoard = async(boardId) => {
    return await tagModel.find({ boardId});
};

const findById = async(id) => {
    return await tagModel.find(id);
};

const deleteById = async(id) => {
    return await tagModel.findByIdAndDelete(id);
};

const findOne = async(query) => {
    return await tagModel.findOne(query)
}


module.exports = { create, findByBoard, findById, deleteById, findOne  };