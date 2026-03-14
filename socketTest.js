const { io } = require("socket.io-client");

const socket = io("http://localhost:9000");

socket.on("connect", () => {

    console.log("Connected:", socket.id);

    socket.emit("joinBoard", "123456");

});