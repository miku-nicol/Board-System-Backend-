 const { emitCardCreated, emitCardMoved } = require("../../realtime/emitter");
const cardService = require("./cardService");

 
const createCard = async ( req, res) => {
    try {
        
        const { title, description, position, columnId} = req.body;

        if(!title || !description || !columnId|| position ===undefined){
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }
      
        const { card, boardId }= await cardService.createCard({
            title,
            description,
            position,
            columnId,
            userId: req.user.userId
        })

        emitCardCreated(boardId, card);

        return res.status(201).json({
            success: true,
            message: " Card created successfully",
            data: card, boardId
        });


    } catch (error) {
        console.error("Error creating card", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
        
    }
    
};



const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, position, __v } = req.body;

    const updatedCard = await cardService.updateCard(
       {
        id,
        title,
        description,
        position,
        version: __v,
        userId: req.user.userId
       }
    );

    return res.status(200).json({
      success: true,
      message: "Card updated successfully",
      data: updatedCard
    });

  } catch (error) {

    if (error.status === 409) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    console.error("Error updating card", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const cardDelete = async ( req, res) => {
    try {
        const { id }= req.params;

     const boardId = await cardService.deleteCard({ id, userId: req.user.userId});

    return res.status(200).json({
      success: true,
      message: "Card deleted successfully",
      boardId

    });

    } catch (error) {

        console.error("Error deleting card", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
        
    }
    
}



const getCardsInColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    const cards = await cardService.getCardsInColumn({
      columnId, userId: req.user.userId
    });
      

    return res.status(200).json({
      success: true,
      count: cards.length,
      data: cards
    });

  } catch (error) {
    console.error("Error fetching cards", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};




const assignTag = async (req, res) => {
  try {

    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name  is required"
      });
    }

    const card = await cardService.assignTag({ id, name, userId: req.user.userId})

    return res.status(200).json({
      success: true,
      message: "Tag assigned successfully",
      data: card
    });

  } catch (error) {

    console.error("Error assigning tag:", error);

    if (error.message === "Tag not found") return res.status(404).json({success: false, message: error.message})
    if (error.message === "Tag already assigned") return res.status(409).json({success: false, message: error.message})

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};



const setDueDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { dueDate } = req.body;

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: "Due date is required"
      });
    }

    const parsedDate = new Date(dueDate);

    if (isNaN(parsedDate)) {
      return res.status(400).json({
        success: false,
        message: "Invaild date format. Use YYYY-MM-DD"
      })
    }

    const card = await cardService.setDueDate({ id, dueDate, userId: req.user.userId})

    return res.status(200).json({
      success: true,
      message: "Due date set successfully",
      data: card
    });

  } catch (error) {
    console.error("Error setting due date:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const moveCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { columnId, position } = req.body;

    const { card, boardId } = await cardService.moveCard({
      cardId: id,
      newColumnId: columnId,
      newPosition: position,
      userId: req.user.userId
    });

    emitCardMoved(boardId, card);

    return res.status(200).json({
      success: true,
      message: "card moved successfully",
      data: card
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}










module.exports = { createCard, updateCard, cardDelete, getCardsInColumn, assignTag, setDueDate, moveCard}