const commentRepository = require("./commentRepository");
const columnModel = require("../column/columnModel");
const boardModel = require("../board/boardModel");
const cardModel = require("../card/cardModel");

const verifyBoardAccess = async (cardId, userId) => {
    const card = await cardModel.findById(cardId);
    if (!card) throw new Error("Card not found");
    const column = await columnModel.findById(card.columnId);
     
    if (!column) throw new Error("Column not found");

    const board = await boardModel.findOne({
        _id: column.boardId,
        $or: [{ ownerId: userId}, { members: userId }]
    });

    if (!board) throw new Error("Unauthorized");

    return { card, column, board }

};



const addComment = async ({ cardId, userId, content, parentComment }) => {

    const { board } = await verifyBoardAccess(cardId, userId)


    if (parentComment) {

       const parent = await commentRepository.findById(parentComment);
        if(!parent) {
            throw new Error("Parent comment not found");
        }

         if (parent.cardId.toString() !== cardId) {
        throw new Error("Parent comment does not belong to this card")
    }

    }

    console.log("cardId inside addComment:", cardId)

    const comment= await commentRepository.create({
        cardId,
        userId,
        content,
        parentComment : parentComment || null
    });

    return { comment, boardId:board._id}
};


const editComment = async ({ commentId, userId, content }) => {
    const comment = await commentRepository.findById(commentId);

    if (!comment) {
        throw new Error("Comment not found");
    }

     if (comment.userId.toString() !== userId) {
        throw new Error("Unauthorized to edit this comment");
    }

     await verifyBoardAccess(comment.cardId, userId);

    return await commentRepository.update(commentId, {
        content,
        edited: true
    })

};


const deleteComment = async ({ commentId, userId, onlyReplies = false }) => {
    const comment = await commentRepository.findById(commentId);

    if (!comment) {
        throw new Error("Comment not found");
    }

    await verifyBoardAccess(comment.cardId, userId);

    const deleteReplies = await commentRepository.deleteReplies(commentId);

    let deletedComment = null;
    if(!onlyReplies){
        deletedComment = await commentRepository.deleteById(commentId);
    }
    

    return { deletedComment, deleteReplies }
};

const getCardComments = async ({ cardId, userId }) => {
    console.log("Card recive:", cardId)
    const card = await cardModel.findById(cardId);
    console.log("Card found:", card);
    if(!card) throw new Error("Card not found");

    await verifyBoardAccess(cardId, userId)

    return await commentRepository.findByCard(cardId)
};


module.exports = { addComment, editComment, deleteComment, getCardComments }