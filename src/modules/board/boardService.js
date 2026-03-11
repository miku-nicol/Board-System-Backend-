const boardRepository = require("./boardRespository")

const createBoard = async ({title, description, userId}) => {
    console.log("Service values:", title, description);
    if(!title || !description){
        throw new Error("Title and Description are required");
    }

    const board = await boardRepository.createBoard({
        title,
        description,
        userId
    });
    
    return board;
};

const getUserBoards = async (userId) => {
    const boards = await boardRepository.findBoardsByUser(userId);

    if(!boards.lenght) {
        throw new Error("No board found for this user");
    }

    return boards;
}


const updateBoard = async (boardId, userId, title, description) => {
    const updatedBoard = await boardRepository.updateBoard(
        boardId,
        userId,
        { title, description }
    );

    if(!updatedBoard) {
        throw new Error("Board not found or unauthorized");
    }

    return updatedBoard;
}

const deleteBoard = async (boardId, userId) => {
    const deleted = await boardRepository.deleteBoard(boardId, userId);

    if(!deleted){
        throw new Error ("Board not found or unauthorize")
    }
    return deleted;
}


module.exports = { createBoard, getUserBoards, updateBoard, deleteBoard }
