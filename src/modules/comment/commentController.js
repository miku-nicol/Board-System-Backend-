const { emitCommentAdded } = require("../../realtime/emitter");
const commentService = require("./commentService");

const addComment = async(req, res) => {
    try {
       
        const { cardId, content, parentComment } = req.body

        if(!cardId || !content){
            logger.warn({
                message: "Validation failed: missing cardId or content",
                body: req.body,
                userId: req.user?.userId
            });
            return res.status(400).json({
                success: false,
                message: " CardId and content are require"
            });
        }
 looger.info("cardId recived:", cardId)
        const { comment, boardId}  = await commentService.addComment({
            cardId,
            content,
            parentComment,
            userId: req.user.userId
        });

        emitCommentAdded(boardId, comment);

        logger.info({
            message: "Comment added",
            userId: req.user.userId,
            cardId,
            commentId: comment._id,
            boardId
        });

        return res.status(201).json({
            success: true,
            message: "Comment added",
            data: comment
        });



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
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

         logger.info({
            message: "Comment updated",
            userId: req.user.userId,
            commentId: id
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
        const { commentId } = req.params;
        const onlyReplies = req.query.onlyReplies === "true";

        const result = await commentService.deleteComment({
            commentId,
            userId: req.user.userId,
            onlyReplies
        })

        logger.info({
            message: "Comment deleted",
            userId: req.user.userId,
            commentId,
            onlyReplies
        });



        return res.status(200).json({
            success: true,
            message: onlyReplies ? "Replies deleted successfully" : "Comment and its replies deleted successfully",
            data: result
        });

    } catch (error) {
    logger.error("Error deleting comment:", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
}

const getCardComments = async (req, res) => {
    try {
        const { cardId } = req.params;

        const comments = await commentService.getCardComments({
            cardId,
            userId: req.user.userId
        });

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