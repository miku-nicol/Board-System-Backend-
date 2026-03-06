const boardModel = require("../board/boardModel");
const tagModel = require("./tagModel");


const createTag = async (req, res) => {
  try {
    const { name, boardId } = req.body;

    if (!name || !boardId) {
      return res.status(400).json({
        success: false,
        message: "Name and boardId are required"
      });
    }

    
    const board = await boardModel.findOne({
      _id: boardId,
      userId: req.user.userId
    });

    if (!board) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    
    const existingTag = await tagModel.findOne({
      name,
      boardId
    });

    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: "Tag already exists for this board"
      });
    }

    const tag = await tagModel.create({
      name,
      boardId
    });

    return res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: tag
    });

  } catch (error) {

    console.error("Error creating tag:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = { createTag };