const boardModel = require("./boardModel");


const createBoard = async(req, res) =>{
    try {
        console.log("User from token:", req.user);
        const { title, description}=req.body;

        if(!title || !description){
            return res.status(400).json({
                success: false,
                message: "Title and Description are required"
            })
        }

        const board = await boardModel.create({
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
        console.error('Error creating board', error);
        return res.status(500).json({
            success: false,
            error: "Internal server error."
        });
        
    }
};


const getUserBoards = async (req, res)=>{
    try {
        
        const userBoard = await boardModel.find({ userId: req.user.userId});
        if (userBoard.length === 0){
            return res.status(404).json({
                success: false,
                message: "No board found for this user"
            })
        }

        res.status(200).json({
            success: true,
            count: userBoard.length,
            data: userBoard
        })


    } catch (error) {
        console.error("Error fetching boards:", error);
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

        const updatedBoard = await boardModel.findOneAndUpdate({_id: id, userId: req.user.userId}, {title, description}, {new: true, runValidators: true});
        
        if(!updatedBoard){
            return res.status(404).json({ 
                success: false,
                message: "Board not found or unauthorized"
            })
        }
        res.status(200).json({
            success: true,
            message: "Board updated successfully",
             updatedBoard
        })
        
    } catch (error) {
        console.error(error);
       return res.status(500).json({
            success: false,
            message: "cannot update board at the moment"
        })
        
    }
};

const deleteBoard = async(req, res) =>{
    try {
        const { id } = req.params;
        const deleted = await boardModel.findOneAndDelete({_id: id, userId: req.user.userId });

        if (!deleted){
            return res.status(404).json({
                successs: false,
                message: "Board not found or unauthorized"
            })
        };
       return res.status(200).json({
            success: true,
            message: "Board deleted successfuly"
        });
        
    } catch (error) {
        console.error("Error deleting",error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })

        
    }
};


module.exports = { createBoard, getUserBoards, updateBoard, deleteBoard};