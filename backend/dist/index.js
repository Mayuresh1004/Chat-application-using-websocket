import WebSocket, { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let userCount = 0;
let allSockets = new Map();
wss.on("connection", (socket) => {
    //message handler
    socket.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            console.log("User joined room: " + parsedMessage.payload.roomId);
            allSockets.set(socket, {
                socket: socket,
                roomId: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            console.log("User wants to chat");
            const currentUserRoom = Array.from(allSockets.values()).find(x => x.socket === socket)?.roomId;
            allSockets.forEach((user, ws) => {
                if (user.roomId === currentUserRoom) {
                    user.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });
    socket.on("close", () => {
        allSockets.delete(socket);
    });
});
//# sourceMappingURL=index.js.map