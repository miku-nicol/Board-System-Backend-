const boardModel = require("../board/boardModel");
const columnModel = require("../column/columnModel");
const tagModel = require("../tag/tagModel");
const cardRespository = require("./cardRespository");


const verifyBoardAccess = async (columnId, userId) => {
    const column = await columnModel.findById(columnId);

    if (!column) throw new Error("Column not found");

    const board = await boardModel.findOne({
        _id: column.boardId,
        $or: [{ ownerId: userId}, { members: userId }]
    });

    if (!board) throw new Error("Unauthorized");

    return { column, board }

};


const createCard = async ({ title, description, position, columnId, userId}) => {
    const { board } = await verifyBoardAccess(columnId, userId);

    const card = await cardRespository.createCard({ title, description, position, columnId });

    return { card, boardId: board._id };
};



const updateCard = async ({ id, title, description, position,version, userId }) => {
    const card = await cardRespository.findById(id);

    if (!card) throw new Error("Card not found");

    await verifyBoardAccess(card.columnId, userId);

    if (card.__v !== version){
       
        const error = new Error("Conflict detected. card was updated by another user.");

 error.status = 409;
    throw error;
    }

    

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (position !== undefined) updateData.position = position;

    const updated = await cardRespository.updateById(id, version, updateData);

    if (!updated) {
        const error = new Error("Conflict detected. Card was updated by another user.")
        error.status = 409;
        throw error;
    }

    return updated;

};


const deleteCard = async ({ id, userId }) => {
    const card = await cardRespository.findById(id);
    if (!card) throw new Error ("Card not found");

    const { board } = await verifyBoardAccess(card.columnId, userId);
    await cardRespository.deleteById(id);
    return board._id;
};


const getCardsInColumn = async({ columnId, userId }) => {
    await verifyBoardAccess(columnId, userId);
    return await cardRespository.findByColumn(columnId);
};



const assignTag = async ({ id, name, userId }) =>{
    const card = await cardRespository.findById(id);
    if (!card) throw new Error("Card not found");

    const { board } = await verifyBoardAccess(card.columnId, userId)
    const tag = await tagModel.findOne({ name, boardId: board._id });

    if (!tag) throw new Error ("Tag not found");

    if (card.tags.includes(tag._id)) throw new Error("Tag already assigned");

    card.tags.push(tag._id);
    return await cardRespository.save(card);
};


const setDueDate = async ({ id, dueDate, userId }) => {
    const card = await cardRespository.findById(id);
    if (!card) throw new Error ("Card not found");

    await verifyBoardAccess(card.columnId, userId);
    card.dueDate =dueDate;

    return await cardRespository.save(card);
}

const moveCard = async ({ cardId, newColumnId, newPosition, userId }) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const card = await cardRespository.findById(cardId);

        if(!card) throw new Error("Card not found");

        await verifyBoardAccess(card.columnId, userId);
        await verifyBoardAccess(newColumnId, userId);

        const oldColumnId = card.columnId;
        const oldPosition = card.position;

        /* close gap in old column*/

        await cardRespository.positionDelete(oldColumnId, oldPosition, session);

        /* create space in new column*/

        await cardRespository.positionInsert(newColumnId, newPosition, session);

        /* move card */
        card.columnId = newColumnId;
        card.position = newPosition;

        await cardRespository.save(card, session);
        await session.commitTransaction();

        return card;
    } catch (error){
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}



module.exports = { createCard, updateCard, deleteCard, assignTag, setDueDate, getCardsInColumn, moveCard }