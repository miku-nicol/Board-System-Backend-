 const logger = require("../../utils/logger");
const tagService= require("./tagService");

const createTag = async (req, res) => {
  try {
    const { name, boardId } = req.body;

    if (!name || !boardId) {
      return res.status(400).json({
        success: false,
        message: "Name and boardId are required"
      });
    }

    const tag = await tagService.createTag({
      name,
      boardId,
      userId: req.user.userId
    });

    return res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: tag
    });

  } catch (error) {

    logger.error("Error creating tag:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getBoardTags = async (req, res) =>{
  try {
    const { boardId } = req.params;

    const tags = await tagService.getBoardTags({ boardId})

    return res.status(200).json({
      success: true,
      message: tags
    })
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error.message"
    })
    
  }


}
  

module.exports = { createTag, getBoardTags };