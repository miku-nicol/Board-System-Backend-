const { getIO } = require("./socket");


const boardRoom = (boardId) => `board:${boardId}`;

const emitCardCreated = (boardId, card) => {
    const io = getIO();

    io.to(boardRoom(boardId)).emit("cardCreated", card);
};

const emitCardMoved = (boardId, card) => {
    const io = getIO();
    
    io.to(boardRoom(boardId)).emit("cardMoved", card)
}

const emitCommentAdded = (boardId, comment) => {
    const io = getIO();

    io.to(boardRoom(boardId)).emit("commentAdded", comment)
}


module.exports = { emitCardCreated, emitCardMoved, emit}