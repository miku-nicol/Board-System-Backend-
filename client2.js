const { io } = require("socket.io-client");

const socket = io("http://localhost:9000");

socket.on("connect", () => {
    console.log("Client2 connected:", socket.id);

    socket.emit("joinBoard", "board123");
});

socket.on("cardCreated", (data) => {
    console.log("Client2 received cardCreated:", data);
});

socket.on("cardMoved", (data) => {
    console.log("Client2 received cardMoved:", data);
});

socket.on("commentAdded", (data) => {
    console.log("Client2 received commentAdded:", data);
});