const { emitCommentAdded } = require("../../realtime/emitter");
const commentService = require("./commentService");

const addComment = async(req, res) => {
    try {
        const { cardId, content, parentComment } = req.body

        if(!cardId || !content){
            return res.status(400).json({
                success: false,
                message: " CardId and content are require"
            });
        }

        const comment = await commentService.addComment({
            cardId,
            content,
            parentComment,
            userId: req.user.userId
        });

        emitCommentAdded(boardId, comment)

        return res.status(201).json({
            success: true,
            message: "Comment added",
            data: comment
        });



    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
        
    }
}


const editComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment = await commentService.editComment({
            commentId: id,
            content,
            userId: req.user.userId
        });

        return res.status(200).json({
            success: true,
            message: "Comment updated",
            data: comment
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
        
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        await commentService.deleteComment({
            commentId: id,
            userId: req.user.userId
        })

        return res.status(200).json({
            success: true,
            message: "Comment deleted"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
}

const getCardComments = async (req, res) => {
    try {
        const { cardId } = req.params;

        const comments = await commentService.getCardComments(cardId);

        return res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
        
    }


}



module.exports = { addComment, editComment, deleteComment, getCardComments }