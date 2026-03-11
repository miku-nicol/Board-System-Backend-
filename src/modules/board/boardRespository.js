const boardModel = require("./boardModel")


const createBoard = async (data) => {
    return boardModel.create(data);
};

const findBoardsByUser = async (userId) => {
    return boardModel.find({ userId });
};

const updateBoard = async (boardId, userId, updateData) => {
    return boardModel.findOneAndUpdate(
        { _id: boardId, userId },
        updateData,
        { returnDocument: "after", runValidators: true}
    );
};

const deleteBoard = async (boardId, userId) => {
    return boardModel.findOneAndDelete({ _id: boardId, userId });
};


module.exports = { createBoard, findBoardsByUser, updateBoard, deleteBoard }

