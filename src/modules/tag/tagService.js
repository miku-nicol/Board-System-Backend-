const tagRepository = require("./tagRepository");
const boardRepository = require("../board/boardRespository");


const createTag = async({ name, boardId, userId }) => {
    const board = await boardRepository.findById(boardId)

    if(!board) throw new Error("Board not found")

        if(board.ownerId.toString() !== userId) throw new Error("Unauthorized");

        return await tagRepository.create({ name, boardId })
};


const getBoardTags = async ({boardId}) => {
    return await tagRepository.findByBoard(boardId);

};

const deleteTag = async ({ id }) => {
    const tag = await tagRepository.findById(id);
    if(!tag) throw new Error("Tag not found");
    return await tagRepository.deleteById(id);
};

module.exports= { createTag, getBoardTags, deleteTag }