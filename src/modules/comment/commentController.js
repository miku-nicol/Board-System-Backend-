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
 console.log("cardId recived:", cardId)
        const { comment, boardId}  = await commentService.addComment({
            cardId,
            content,
            parentComment,
            userId: req.user.userId
        });

        emitCommentAdded(boardId, comment);

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


        return res.status(200).json({
            success: true,
            message: onlyReplies ? "Replies deleted successfully" : "Comment and its replies deleted successfully",
            data: result
        });

    } catch (error) {
        console.error("Error deleting comment:", error)
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