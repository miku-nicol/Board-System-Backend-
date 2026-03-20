const logger = require("../../utils/logger");
const boardService = require("./boardService")


const createBoard = async(req, res) =>{
    try {
        logger.info("User from token:", req.user);
        logger.info("Resquest body:", req.body);
        const { title, description } =req.body;

    
        const board = await boardService.createBoard({
            title,
            description,
            userId: req.user.userId
        })

        return res.status(201).json({
            success: true,
            message: "Board created successfully",
            data: board

        });
        
    } catch (error) {
        logger.error('Error creating board:', error);
        return res.status(500).json({
            success: false,
            error: "Internal server error."
        });
        
    }
};


const getUserBoards = async (req, res)=>{
    try {
        const { page, limit } = req.query;

        const result = await boardService.getUserBoards({
            userId: req.user.userId,
            page: Number(page) || 1,
            limit: Number(limit) || 10
        });

        return res.status(200).json({
            success: true,
            ...result
        })
         


    } catch (error) {
        logger.error("Error fetching boards:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error ",
            
        })
        
    }
};

const updateBoard = async(req, res) =>{
    try {
        const { id } = req.params;
        const { title, description } = req.body;

         const updatedBoard = await boardService.updateBoard(
            id,
            req.user.userId,
            title,
            description
         )

        res.status(200).json({
            success: true,
            message: "Board updated successfully",
             updatedBoard
        })
        
    } catch (error) {
        logger.error("Error updating board:", error);
       return res.status(500).json({
            success: false,
            message: "cannot update board at the moment"
        })
        
    }
};

const deleteBoard = async(req, res) =>{
    try {
        const { id } = req.params;
         
     await boardService.deleteBoard(id, req.user.userId);

         
       return res.status(200).json({
            success: true,
            message: "Board deleted successfuly"
        });
        
    } catch (error) {
        logger.error("Error deleting board:",error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })

        
    }
};

const addMember = async(req, res) => {
    try {
        const { id } = req.params;
        const { memberId } = req.body

        const board = await boardService.addMember({ 
            boardId: id, 
            ownerId: req.user.userId, 
             memberId
        })
return res.status(200).json({
    success: true,
    message: "Member added successfully",
    data: board
})

    } catch ( error) {
        logger.error("Error adding member:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
}
const removeMember = async(req, res) => {
    try {
        const { id } = req.params;
        const { memberId} = req.body

        const board = await boardService.removeMember({ 
            boardId: id, 
            ownerId: req.user.userId, 
             memberId
        })
return res.status(200).json({
    success: true,
    message: "Member removed successfully",
    data: board
})

    } catch (error) {
        logger.error("Error removing member:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
        
    }
}


module.exports = { createBoard, getUserBoards, updateBoard, deleteBoard, addMember, removeMember};