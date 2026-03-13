 const columnService = require("./columnService");


const createColumn = async ( req, res) => {
    try {
        const { boardId, title, position} = req.body

         
        const newColumn = await columnService.create({
            boardId,
            title,
            position,
            userId: req.user.userId
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

         
    const updated = await columnService.updateColumn({
        id,
        boardId,
        title,
        position,
        userId: req.user.userId
    });

    
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


        await columnService.deleteColumn({
            id,
            boardId,
            userId: req.user.userId
        });
    
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