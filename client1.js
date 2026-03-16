const { io } = require("socket.io-client");

const socket = io("http://localhost:9000");

socket.on("connect", () => {
    console.log("Client1 connected:", socket.id);

    socket.emit("joinBoard", "69b4b17684dcc4f0ff5118b8");
});

socket.on("cardCreated", (card) => {
    console.log("Client1 received cardCreated:", card);
});

socket.on("cardMoved", (card) => {
    console.log("Client1 received cardMoved:", card);
});

socket.on("commentAdded", (comment) => {
    console.log("Client1 received commentAdded:", comment);
});