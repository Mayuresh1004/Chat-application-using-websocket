import WebSocket,{WebSocketServer} from "ws";

const wss = new WebSocketServer({ port:8080 })

interface User{
    socket: WebSocket;
    roomId: string;
}

let userCount = 0;
let allSockets = new Map<WebSocket,User>();

wss.on("connection", (socket) => {

    //message handler
    socket.on('message', (message)=>{

        const parsedMessage = JSON.parse(message as unknown as string)
        console.log(parsedMessage);
        
        if (parsedMessage.type === "join" ) {

            console.log("User joined room: " + parsedMessage.payload.roomId );
            

            allSockets.set(socket,{
                socket: socket,
                roomId: parsedMessage.payload.roomId
            })
        } 

        if (parsedMessage.type === "chat" ) {

            console.log("User wants to chat");
            

            const currentUserRoom = allSockets.get(socket)?.roomId

            allSockets.forEach((user, ws) => {
                if (user.roomId === currentUserRoom) {
                    user.socket.send(JSON.stringify({
                        type: "chat",
                        message: parsedMessage.payload.message,
                        roomId: currentUserRoom,
                        senderId: parsedMessage.payload.senderId 

                    }));
                }
            });


            
        } 



    })

    socket.on("close", () => {
        allSockets.delete(socket);
    });

})

