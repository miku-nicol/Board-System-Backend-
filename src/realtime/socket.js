 const { Server } = require("socket.io")

 let io;

 const initSocket = (server) => {
    
    io = new Server(server, {
        cors: {
            origin: '*'
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("joinBoard", (boardId) => {
            const room = `board:${boardId}`;
            socket.join(room);
            console.log(`user ${socket.id} joined ${room}`)
        })

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
 };

 const getIO = () => io;

 module.exports = { initSocket, getIO};