const boardModel = require("../board/boardModel");
const ColumnModel = require("./ColumnModel");


const createColumn = async ( req, res) => {
    try {
        const { boardId, title, position} = req.body

        if(!boardId || !title || position === undefined){
            return res.status(400).json({
                success: false,
                message: "boardId, title and position are required"
            })
        }

        const board = await boardModel.findOne({_id:boardId, userId: req.user.userId});

        if(!board){
            return res.status(404).json({
                success: false,
                message: "Board not found or unauthorized"
            });
        }

        const newColumn = await ColumnModel.create({
            boardId,
            title,
            position
        });

        return res.status(201).json({
            success: true,
            message: "column created successfully",
            data: newColumn
        })



    } catch (error) {
        console.error("Error creating column", error)
        return res.status(500).json({
            success: false,
            message: "Internal server"
        })
        
    }
};


const updateColumn = async(req, res) =>{
    try {
        const { id} = req.params;
        const { boardId,title, position} = req.body

        const board = await boardModel.findOne({_id:boardId, userId: req.user.userId})
        if(!board){
            return res.status(400).json({
                success: false,
                message: "Board not found or Unauthorized"
            })
        }

    const updated = await ColumnModel.findOneAndUpdate({_id: id, boardId: boardId },{title,position},{new: true, runValidators: true})

    if(!updated){
 return res.status(404).json({
        success: false,
        message: "Column not found"
    })
    }

   
    
    return res.status(200).json({
        success: true,
        message: "column updated successfully",
        data: updated
    })
        
    } catch (error) {
        console.error('Error updating column', error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
        
    }
};

const deleteColumn = async(req, res) =>{
    try {
        const { id } = req.params;
        const { boardId } = req.body;
        const board = await boardModel.findOne({_id: boardId, userId: req.user.userId});

        if(!board){
            return res.status(403).json({
                success: false,
                message: "Board not found or unauthorized"
            });
        }

    const deleted = await ColumnModel.findOneAndDelete({_id: id, boardId: boardId})
    if(!deleted){
        return res.status(404).json({
            success: false,
            message: " Column could not be deleted, try again later."
        })
    }

    return res.status(200).json({
        success: true,
        message: "Column deleted successfully"
    })
    } catch (error) {
        console.error("Error deleting column", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
        
    }
}

module.exports = { createColumn, updateColumn, deleteColumn };