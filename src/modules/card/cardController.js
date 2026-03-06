const boardModel = require("../board/boardModel");
const ColumnModel = require("../column/ColumnModel");
const tagModel = require("../tag/tagModel");
const cardModel = require("./cardModel");


const createCard = async ( req, res) => {
    try {
        
        const { title, description, position, columnId} = req.body;

        if(!title || !description || !columnId|| position ===undefined){
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }
        const column = await ColumnModel.findById(columnId);

        if (!column){
            return res.status(403).json({
                success: false,
                message: "Column not found"
            })
        }

        const board = await boardModel.findOne({
      _id: column.boardId,
      userId: req.user.userId
    });

    if (!board) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }


        const newCard = await cardModel.create({
            title,
            description,
            position,
            columnId
        })

        return res.status(201).json({
            success: true,
            message: " Card created successfully",
            data: newCard
        })


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
    const { title, description, position } = req.body;

    
     
    
    const card = await cardModel.findById(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      })
    }

    const column = await ColumnModel.findById(card.columnId);
    if (!column) {
      return res.status(404).json({
        success: false,
        message: "Column not found"
      });
    }

    
    const board = await boardModel.findOne({
      _id: column.boardId,
      userId: req.user.userId
    });

    if (!board) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    
    const updatedCard = await cardModel.findByIdAndUpdate(
      id,
      { title, description, position },
      { returnDocument: "after", runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Card updated successfully",
      data: updatedCard
    });

  } catch (error) {
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


        const card = await cardModel.findById(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      })
    }


    const column = await ColumnModel.findById(card.columnId);
    if (!column) {
      return res.status(404).json({
        success: false,
        message: "Column not found"
      });
    }


    const board = await boardModel.findOne({
      _id: column.boardId,
      userId: req.user.userId
    });

    if (!board) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const deleted = await cardModel.findById(id)

    if(!deleted){
        return res.status(400).json({
            success: false,
            message: " could not be deleted"
        })
    }

    return res.status(200).json({
      success: true,
      message: "Card deleted successfully"
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

     
    
    const column = await ColumnModel.findById(columnId);
    if (!column) {
      return res.status(404).json({
        success: false,
        message: "Column not found"
      });
    }

    
    const board = await boardModel.findOne({
      _id: column.boardId,
      userId: req.user.userId
    });

    if (!board) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // 4️⃣ Get cards
    const cards = await cardModel
      .find({ columnId })
      .sort({ position: 1 }); 

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

    const card = await cardModel.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    const column = await ColumnModel.findById(card.columnId);
    const board = await boardModel.findOne({
      _id: column.boardId,
      userId: req.user.userId
    });

    if (!board) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }


    const taged = await tagModel.findOne({name: name, boardId: board._id});

    if (!taged) {
      return res.status(404).json({
        success: false,
        message: "Tag not found"
      });
    }

    
    if (card.tags.includes(taged._id)) {
      return res.status(400).json({
        success: false,
        message: "Tag already assigned to this card"
      });
    }

    card.tags.push(taged._id);
    await card.save();

    return res.status(200).json({
      success: true,
      message: "Tag assigned successfully",
      data: card
    });

  } catch (error) {

    console.error("Error assigning tag:", error);

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

    const card = await cardModel.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    card.dueDate = dueDate;

    await card.save();

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











module.exports = { createCard, updateCard, cardDelete, getCardsInColumn, assignTag, setDueDate}