const boardModel = require("./boardModel")
 require("../User/userModel");


const createBoard = async (data) => {
    return boardModel.create(data);
};

const findBoardsByUser = async (query, skip, limit) => {
    return boardModel.find(query)
.select("title description ownerId members")
.populate("members", "name email")
.populate("ownerId", "name")
.sort({ createdAt: -1 })
.skip(skip)
.limit(limit);

};

const countBoards = async(query) => {
    return await boardModel.countDocuments(query);
};

const updateBoard = async (boardId, userId, updateData) => {
    return boardModel.findOneAndUpdate(
        { _id: boardId, ownerId: userId },
        updateData,
        { returnDocument: "after", runValidators: true}
    );
};

const deleteBoard = async (boardId, userId) => {
    return boardModel.findOneAndDelete({ _id: boardId, ownerId: userId });
};

const addMember = async (boardId, ownerId, memberId) => {

    return boardModel.findOneAndUpdate(
        {_id: boardId,
         ownerId
        },
        { $addToSet: { members: memberId }
    },
    { returnDocument: "after"}
    )

}

const removeMember = async ( boardId, ownerId, memberId) => {
    return boardModel.findOneAndDelete(
        {_id: boardId, 
        ownerId
        },
        { $pull: { members: memberId }
    },
    { returnDocument: "after" }
    );
};

const findBoardById = async (boardId) => {
    return boardModel.findById(boardId);
}


module.exports = { createBoard, findBoardsByUser, updateBoard, deleteBoard, addMember, removeMember, findBoardById, countBoards }

