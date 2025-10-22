import WebSocket,{WebSocketServer} from "ws";

const wss = new WebSocketServer({ port:8080 })

let userCount = 0;
let allSockets: WebSocket[] = []

wss.on("connection", (socket) => {
    allSockets.push(socket)
    userCount += 1
    console.log("User connected #" + userCount);

    //message handler
    socket.on('message', (message)=>{
        console.log(`meassage recieved: ${message.toString()} ` );

        for (let i = 0; i < allSockets.length; i++) {

            let s = allSockets[i]
            
            s?.send(message.toString() + "Sent from the server " + i )
            
        }


    })
})

