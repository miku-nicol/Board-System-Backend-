const boardModel = require("../board/boardModel");
const columnRepository = require("./columnRepository");

const createColumn = async ({ boardId, title, position, userId }) => {

    if(!boardId || !title || position === undefined){
        throw new Error("boardId, title and position are required")
    }

    const board = await boardModel.findOne({
        _id: boardId,
        $or: [
            { ownerId: userId},
            { members: userId }
        ]
    });

    if(!board){
        throw new Error("Board not found or unauthorized");
    }

    return await columnRepository.create({
        boardId,
        title,
        position
    });
};


const updateColumn = async ({ id, boardId, title, position, userId }) =>{

    if (title === undefined && position === undefined){
        throw new Error("Nothing to update");
    }

    const board = await boardModel.findOne({
        _id: boardId,
        $or: [
            { ownerId: userId},
            { members: userId }
        ]
    });

    if(!board){
        throw new Error("Board not found or unauthorized");
    }

    const updated = await columnRepository.updateById(
        id,
        boardId,
        { title, position }
    );

    if(!updated){
        throw new Error("Column not found");
    }

    return updated;
}

const deleteColumn = async ({ id, boardId, userId }) => {

    const board = await boardModel.findOne({
       _id: boardId,
        $or: [
            { ownerId: userId},
            { members: userId }
        ]
    });

    if(!board) {
        throw new Error("Board not found or unauthorized");
    }

    const deleted = await columnRepository.deleteById(id, boardId);

    if (!deleted){
        throw new Error("Column not found");
    }
    return deleted;
};

module.exports = { createColumn, updateColumn, deleteColumn }