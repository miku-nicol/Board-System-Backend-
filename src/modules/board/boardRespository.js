const boardModel = require("./boardModel")
 require("../User/userModel");


const createBoard = async (data) => {
    return boardModel.create(data);
};

const findBoardsByUser = async (userId) => {
    return boardModel.find({
        $or: [
        { ownerId: userId },
        { members: userId }
    ]
})
.populate("members")
.populate("ownerId")
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


module.exports = { createBoard, findBoardsByUser, updateBoard, deleteBoard, addMember, removeMember }

