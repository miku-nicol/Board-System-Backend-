const commentRepository = require("./commentRepository");


const addComment = async ({ cardId, userId, content, parentComment }) => {
    const card = await cardModel.findById(cardId);
    if (!card){
        throw new Error("Card not found");
    };

    if (parentComment) {
        const parent = await commentRepository.findById(parentComment);
        if(!parent) {
            throw new Error("Parent comment not found");
        }
    }

    return await commentRepository.create({
        cardId,
        userId,
        content,
        parentComment : parentComment || null
    });
};


const editComment = async ({ commentId, userId, content }) => {
    const comment = await commentRepository.findById(commentId);

    if (!comment) {
        throw new Error("Comment not found");
    }

    if (comment.userId.toString() !== userId) {
        throw new Error("Unauthorized");
    }

    comment.content = content;
    comment.edited = true;

    return await commentRepository.update(comment)
};


const deleteComment = async ({ commentId, userId }) => {
    const comment = await commentRepository.findById(commentId);

    if (!comment) {
        throw new Error("Comment not found");
    }

    if(comment.userId.toString() !== userId) {
        throw new Error("Unauthorized")
    }

    await commentRepository.deleteReplies(commentId);

    return await commentRepository.deleteById(commentId);
};

const getCardComments = async (cardId) => {
    return await commentRepository.findByCard(cardId)
};


module.exports = { addComment, editComment, deleteComment, getCardComments }