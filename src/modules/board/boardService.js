const boardRepository = require("./boardRespository")

const createBoard = async ({title, description, userId}) => {
    console.log("Service values:", title, description);
    if(!title || !description){
        throw new Error("Title and Description are required");
    }

    const board = await boardRepository.createBoard({
        title,
        description,
        ownerId: userId,
        members: []
    });
    
    return board;
};

const getUserBoards = async ({userId, page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const query = {
        $or: [
            { ownerId: userId },
            { members: userId }
        ]
    };

    const [boards, total] = await Promise.all([
        boardRepository.findBoardsByUser(query, skip, limit),
        boardRepository.countBoards(query)
    ]);

    return {
        data: boards,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }
     

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

const addMember = async ({ boardId, ownerId, memberId }) => {

    const board = await boardRepository.findBoardById(boardId);

    if (!board) throw new Error ("Board not found");

    if (board.ownerId.toString() !== ownerId) {
        throw new Error("Only board owner can add members");
    }

    if (board.members.includes(memberId)) {
        throw new Error("User already a member");
    }

    board.members.push(memberId);

    return await board.save();
};


const removeMember = async ({ boardId, ownerId, memberId }) => {
    const board = await boardRepository.findBoardById(boardId);

    if (!board) throw new Error("Board not found")

        if(board.ownerId.toString() !== ownerId){
            throw new Error("Only owner can remove members");
        }

        board.members = board.members.filter(
            id => id.toString() !== memberId
        );

        return await board.save();
};




module.exports = { createBoard, getUserBoards, updateBoard, deleteBoard, removeMember, addMember }
